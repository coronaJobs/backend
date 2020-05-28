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
      const users = await db.user.findAll();
      return await users.filter((user) => {
        const path = user.profilePicture;
        if (path) {
          const signedUrl = getFileUrl(path);
          user.profilePicture = signedUrl;
        }
        return user;
      });
    },

    getUser: async (_, { id }, ctx) => {
      const user = await db.user.findByPk(id);
      const filePath = user.profilePicture;
      user.profilePicture = await getFileUrl(filePath);
      return user;
    },

    getCurrentUser: async (_, __, ctx) => {
      return ctx.currentUser;
    },
  },

  Mutation: {
    createUser: async (_, params, ctx) => {
      await validateUserParameters(params);
      try {
        // Get profile picture presigned upload URL
        const { profilePicture } = params;
        const { url, filePath } = await getUploadUrl(profilePicture);
        Object.assign(params, { profilePicture: filePath });

        var user = await db.user.create(params);
        user.profilePicture = url;
        return user;
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

    profilePictureUploadError: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      try {
        return await ctx.currentUser.update({ profilePicture: null });
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
  },
};
