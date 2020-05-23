const { db } = require("../../models");
const {
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server");

module.exports = {
  Subscription: {},

  Mutation: {
    createApplication: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      const userApplications = await db.application.findAll({
        where: {
          offerId: params.offerId,
          applicantId: ctx.currentUser.id,
          active: true,
        }
      })
      const offer = await db.post.findByPk(params.offerId);
      if (offer.stateId != 1) {
        throw new ForbiddenError("Job offer is unavailable");
      }
      if (userApplications.length) {
        throw new ForbiddenError("User already applied to this job offer");
      }

      try {
        params["applicantId"] = ctx.currentUser.id;
        const newApplication = await db.application.create(params);
        return newApplication;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },
  },
};