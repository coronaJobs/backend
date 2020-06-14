const { db } = require("../../models");
const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server");
const { deleteApplication, checkApplication } = require("../../utils");
const {
  validateApplicationParameters,
  validateCancelApplicationParameters,
} = require("./../../validations");
module.exports = {
  Subscription: {},

  Mutation: {
    createApplication: async (_, params, ctx) => {
      const userCanCreateApplication = await ctx.ability.can(
        db.application,
        "create"
      );
      if (!userCanCreateApplication) {
        throw new ForbiddenError("The user can't create an application");
      }

      await validateApplicationParameters(params, ctx.currentUser);

      const applicationParams = {
        offerId: params.offerId,
        applicantId: ctx.currentUser.id,
      };

      try {
        const newApplication = await db.application.create(applicationParams);
        return newApplication;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },

    cancelApplication: async (_, params, ctx) => {
      const userCanCancelApplication = await ctx.ability.can(
        db.application,
        "cancel"
      );
      if (!userCanCancelApplication) {
        throw new ForbiddenError("The user can't cancel an application");
      }

      await validateCancelApplicationParameters(params, ctx.currentUser);

      try {
        await deleteApplication(params.offerId, ctx.currentUser.id);
        return true;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },
  },
};
