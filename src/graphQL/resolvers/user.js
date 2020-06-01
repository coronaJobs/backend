const { db } = require("../../models");
const {
  getUploadUrl,
  getFileUrl,
  deleteResource,
} = require("../../services/aws-s3");
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
      // validate params
      await validateUserParameters(params);
      const { profilePicture, resumeUrl } = params;
      let pictureUploadUrl, resumeUploadUrl;

      try {
        // Get profile picture presigned upload URL
        if (profilePicture) {
          const { url, filePath } = await getUploadUrl(profilePicture);
          Object.assign(params, { profilePicture: filePath });
          pictureUploadUrl = url;
        }

        // Get CV presigned upload URL
        if (resumeUrl) {
          const { url, filePath } = await getUploadUrl(resumeUrl);
          Object.assign(params, { resumeUrl: filePath });
          resumeUploadUrl = url;
        }

        const user = await db.user.create(params);
        if (pictureUploadUrl) {
          user.profilePicture = pictureUploadUrl;
        }
        if (resumeUploadUrl) {
          user.resumeUrl = resumeUploadUrl;
        }
        return user;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },

    editUser: async (_, params, ctx) => {
      // validate session
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }

      // validate user
      if (ctx.currentUser.id != params.id) {
        throw new ForbiddenError("Not authorized");
      }

      // validate params
      await validateUserParameters(params);
      const { profilePicture, resumeUrl } = params;
      let pictureUploadUrl, resumeUploadUrl;

      try {
        // Get user
        const editedUser = await db.user.findByPk(params.id);

        // Get profile picture presigned upload URL
        if (profilePicture) {
          deleteResource(editedUser.profilePicture);
          const { url, filePath } = await getUploadUrl(profilePicture);
          Object.assign(params, { profilePicture: filePath });
          pictureUploadUrl = url;
        }

        // Get CV presigned download URL
        if (resumeUrl) {
          deleteResource(editedUser.resumeUrl);
          const { url, filePath } = await getUploadUrl(resumeUrl);
          Object.assign(params, { resumeUrl: filePath });
          resumeUploadUrl = url;
        }

        const user = await editedUser.update(params);
        if (pictureUploadUrl) {
          user.profilePicture = pictureUploadUrl;
        }
        if (resumeUploadUrl) {
          user.resumeUrl = resumeUploadUrl;
        }
        return user;
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

    resumeUploadError: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      try {
        return await ctx.currentUser.update({ resumeUrl: null });
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
