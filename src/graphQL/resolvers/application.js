const { db } = require("../../models");
const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server");
const {
  deleteApplication,
  checkApplication,
  checkEmployment,
} = require("../../utils");

module.exports = {
  Subscription: {},

  Mutation: {
    createApplication: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      const offer = await db.post.findByPk(params.offerId);
      if (!offer) {
        throw new ForbiddenError("Job offer does not exist");
      }
      if (offer.stateId != 1) {
        throw new ForbiddenError("Job offer is unavailable");
      }
      if (offer.ownerId == ctx.currentUser.id) {
        throw new ForbiddenError("Owner can not apply to job offer");
      }
      if (await checkApplication(params.offerId, ctx.currentUser.id)) {
        throw new ForbiddenError("User already applied for this job offer");
      }
      if (await checkEmployment(params.offerId, ctx.currentUser.id)) {
        throw new ForbiddenError("User is already employed for this job");
      }
      try {
        params["applicantId"] = ctx.currentUser.id;
        const newApplication = await db.application.create(params);
        return newApplication;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },

    cancelApplication: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      if (!(await checkApplication(params.offerId, ctx.currentUser.id))) {
        throw new ForbiddenError("User is not applying for this job offer");
      }
      try {
        await deleteApplication(params.offerId, ctx.currentUser.id);
        return true;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },
  },
};
