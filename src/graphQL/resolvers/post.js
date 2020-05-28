const { db } = require("../../models");
const { validatePostSearchParameters } = require("../../validations");
const { Op } = require("sequelize");
const { DateTime } = require("luxon");
const {
  AuthenticationError,
  ForbiddenError,
  ApolloError,
} = require("apollo-server");
const { getUploadUrl, getFileUrl } = require("../../services/aws-s3");

module.exports = {
  Subscription: {},

  Query: {
    getAllPosts: async (_, params, ctx) => {
      validatePostSearchParameters(params);
      const {
        text,
        fromDate,
        toDate,
        ownerId,
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

      if (ownerId) {
        filter.where.ownerId = ownerId;
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

      console.log(filter);
      const posts = await db.post.findAll(filter);
      const presignedPosts = await posts.filter((post) => {
        const path = post.picture;
        if (path) {
          const signedUrl = getFileUrl(path);
          post.picture = signedUrl;
        }
        return post;
      });
      console.log(presignedPosts);

      return presignedPosts;
    },
  },

  Mutation: {
    createPost: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      if (!ctx.ability.can(db.post, "create")) {
        throw new ForbiddenError("Not authorized");
      }
      try {
        params["stateId"] = 1;

        // Get picture presigned URL
        const { picture } = params;
        const { url, filePath } = await getUploadUrl(picture);
        Object.assign(params, { picture: filePath });

        // Create post
        const newPost = await db.post.create(params);
        newPost.picture = url;
        return newPost;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },

    deletePostPicture: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      const post = params.post ? db.post.findByPk(params.post) : null;
      if (!post) {
        throw new ApolloError("Invalid request", 400);
      }
      try {
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
  },
};
