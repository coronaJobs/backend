const { db } = require("../../models");
const { validatePostSearchParameters } = require("../../validations");
const { ForbiddenError, UserInputError } = require("apollo-server");
const { Op } = require("sequelize");
const { DateTime } = require("luxon");

module.exports = {
  Subscription: {},

  Query: {
    getAllPosts: async (_, params, ctx) => {
      validatePostSearchParameters(params);
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

      return await db.post.findAll(filter);
    },
    getPost: async (_, params, ctx) => {
      if (await ctx.ability.can(db.post, "read")) {
        const postId = params.id;
        const post = await db.post.findOne({
          where: { id: postId, active: true },
        });
        if (post) {
          return post;
        }
        throw new UserInputError("Post not found");
      }

      throw new ForbiddenError();
    },
  },

  Mutation: {
    createPost: async (_, params, ctx) => {
      params["stateId"] = 1;
      const newPost = await db.post.create(params);
      return newPost;
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
    commune: async (post) => {
      return await post.getCommune();
    },
  },
};
