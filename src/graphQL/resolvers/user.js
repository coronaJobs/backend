const { db } = require("../../models");
const {
  AuthenticationError,
  ForbiddenError,
  ApolloError,
} = require("apollo-server");
const { validateUserParameters } = require("../../validations");

module.exports = {
  Subscription: {},

  Query: {
    getUsers: async (_, params, ctx) => {
      return await db.user.findAll();
    },

    getUser: async (_, { id }, ctx) => {
      return await db.user.findByPk(id);
    },

    getCurrentUser: async (_, __, ctx) => {
      return ctx.currentUser;
    },
  },

  Mutation: {
    createUser: async (_, params, ctx) => {
      await validateUserParameters(params);
      try {
        return await db.user.create(params);
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },

    editUser: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      if (ctx.currentUser.id != params.id) {
        throw new ForbiddenError("Not authorized");
      }
      await validateUserParameters(params);
      try {
        const editedUser = await db.user.findByPk(params.id);
        return await editedUser.update(params);
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },
  },

  User: {
    posts: async (user) => {
      return await user.getPosts();
    },
    role: async (user) => {
      return await user.getRole({
        where: {
          active: true,
        },
      });
    },
    applications: async (user) => {
      return await user.getOffers({
        where: {
          active: true,
        },
      });
    },
    jobs: async (user) => {
      return await user.getJobs({
        where: {
          active: true,
        },
      });
    },
  },
};
