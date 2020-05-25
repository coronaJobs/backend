const { db } = require("../../models");
const {
  ApolloError,
  AuthenticationError,
  ForbiddenError,
} = require("apollo-server");

module.exports = {
  Subscription: {},

  Mutation: {
    createEmployment: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      const offer = await db.post.findByPk(params.offerId);
      if (ctx.currentUser.id != offer.ownerId) {
        throw new ForbiddenError("User is not the owner of this job offer");
      }
      if (offer.stateId != 1) {
        throw new ForbiddenError("Job offer is not open");
      }
      const userApplications = await db.application.findAll({
        where: {
          offerId: params.offerId,
          applicantId: params.applicantId,
        },
      });
      if (!userApplications.length) {
        throw new ForbiddenError("User is not applying for this job offer");
      }

      try {
        const application = await db.application.findOne({
          where: {
            offerId: params.offerId,
            applicantId: params.applicantId,
            active: true,
          },
        });
        await application.destroy();
        const newEmployment = await db.employment.create({
          employeeId: params.applicantId,
          jobId: params.offerId,
        });
        return newEmployment;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },

    cancelApplication: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      const userApplications = await db.application.findAll({
        where: {
          offerId: params.offerId,
          applicantId: ctx.currentUser.id,
        },
      });
      if (!userApplications.length) {
        throw new ForbiddenError("User is not applying for this job offer");
      }

      try {
        params["applicantId"] = ctx.currentUser.id;
        const application = await db.application.findOne({
          where: {
            offerId: params.offerId,
            applicantId: ctx.currentUser.id,
            active: true,
          },
        });
        await application.destroy();
        return true;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },
  },
};
