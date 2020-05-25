const { db } = require("../../models");
const { getUploadUrl, getFileUrl } = require("../../services/aws-s3");
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
      validateUserParameters(params);
      try {
        // Get profile picture presigned upload URL
        const { profilePicture } = params;
        const { url, filePath } = await getUploadUrl(profilePicture);
        Object.assign(params, { profilePicture: filePath });
        await db.user.create(params);

        return url;
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
      validateUserParameters(params);
      try {
        const editedUser = await db.user.findByPk(params.id);

        // Get profile picture presigned downlaod URL
        const { profilePicture } = params;
        if (profilePicture) {
          const url = await getFileUrl(profilePicture);
          Object.assign(params, { profilePicture: url });
        }

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
  },
};
