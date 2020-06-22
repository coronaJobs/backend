const { db } = require("../../models");
const {
  validatePostSearchParameters,
  validatePostParameters,
} = require("../../validations");
const { ForbiddenError, UserInputError } = require("apollo-server");
const { Op } = require("sequelize");
const { DateTime } = require("luxon");
const { AuthenticationError, ApolloError } = require("apollo-server");
const { getUploadUrl, getFileUrl } = require("../../services/aws-s3");
const { checkIfEmploymentsArePaid } = require("../../utils");

module.exports = {
  Subscription: {},

  Query: {
    getAllPosts: async (_, params, ctx) => {
      await validatePostSearchParameters(params);
      const {
        text,
        fromDate,
        toDate,
        communeId,
        fromApplicantLimit,
        toApplicantLimit,
      } = params;

      const filter = { where: {} };

      if (text) {
        Object.assign(filter.where, {
          [Op.or]: {
            name: { [Op.iLike]: "%" + text + "%" },
            description: { [Op.iLike]: "%" + text + "%" },
          },
        });
      }

      if (fromDate && toDate) {
        filter.where.createdAt = {
          [Op.between]: [
            DateTime.fromISO(fromDate, { zone: "UTC" }).toISO(),
            DateTime.fromISO(toDate, { zone: "UTC" }).toISO(),
          ],
        };
      } else if (fromDate) {
        filter.where.createdAt = {
          [Op.gte]: DateTime.fromISO(fromDate, { zone: "UTC" }).toISO(),
        };
      } else if (toDate) {
        filter.where.createdAt = {
          [Op.lte]: DateTime.fromISO(toDate, { zone: "UTC" }).toISO(),
        };
      }

      if (communeId) {
        filter.where.communeId = communeId;
      }

      if (fromApplicantLimit && toApplicantLimit) {
        filter.where.applicantLimit = {
          [Op.between]: [fromApplicantLimit, toApplicantLimit],
        };
      } else if (fromApplicantLimit) {
        filter.where.applicantLimit = { [Op.gte]: fromApplicantLimit };
      } else if (toApplicantLimit) {
        filter.where.applicantLimit = { [Op.lte]: toApplicantLimit };
      }

      const posts = await db.post.findAll(filter);
      const presignedPosts = await posts.filter(async (post) => {
        const path = post.picture;
        if (path) {
          const { url } = await getFileUrl(path);
          post.picture = url;
        }
        return post;
      });

      return presignedPosts;
    },
    getPost: async (_, params, ctx) => {
      if (await ctx.ability.can(db.post, "read")) {
        const postId = params.id;
        const post = await db.post.findOne({
          where: { id: postId, active: true },
        });
        if (post) {
          const { picture } = params;
          if (picture) {
            const { url } = await getFileUrl(picture);
            post.picture = url;
          }
          return post;
        }
        throw new UserInputError("Post not found");
      }

      throw new ForbiddenError();
    },
  },

  Mutation: {
    createPost: async (_, params, ctx) => {
      // validate permissions
      const canCreatePost = await ctx.ability.can(db.post, "create");
      if (!canCreatePost) {
        throw new ForbiddenError();
      }

      // validate params
      await validatePostParameters(params);

      const { name, description, applicantLimit, communeId, picture } = params;

      // default initial state is 1
      const stateId = 1;

      // the owner is the currentUser
      const ownerId = ctx.currentUser.id;

      // Get picture presigned URL
      let url, filePath;
      if (picture) {
        const uploadData = await getUploadUrl("postPictures", picture);
        url = uploadData.url;
        filePath = uploadData.filePath;
      }

      const postParams = {
        name,
        description,
        applicantLimit,
        communeId,
        stateId,
        ownerId,
        picture: filePath,
      };

      const newPost = await db.post.create(postParams);
      newPost.picture = url;
      return newPost;
    },

    postPictureUploadError: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }

      // validate params
      const { postId } = params.postId;
      if (!postId) {
        throw new ApolloError("Invalid request", 400);
      }
      try {
        const post = db.post.findByPk(postId);
        return await post.update({ picture: null });
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },
  },

  Post: {
    owner: async (post) => {
      return await post.getOwner();
    },
    state: async (post) => {
      return await post.getState();
    },
    applicants: async (post) => {
      return await post.getApplicants();
    },
    employees: async (post) => {
      return await post.getEmployees();
    },
    commune: async (post) => {
      return await post.getCommune();
    },
    areAllEmploymentsPaid: async (post) => {
      return await checkIfEmploymentsArePaid(post.id);
    },
  },
};
