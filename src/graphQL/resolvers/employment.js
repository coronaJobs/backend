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
    createEmployment: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      const offer = await db.post.findByPk(params.offerId);
      if (!offer) {
        throw new ForbiddenError("Job offer does not exist");
      }
      if (ctx.currentUser.id != offer.ownerId) {
        throw new ForbiddenError("User is not the owner of this job offer");
      }
      if (offer.stateId != 1) {
        throw new ForbiddenError("Job offer is not open");
      }
      await checkApplication(params.offerId, params.applicantId);
      try {
        await deleteApplication(params.offerId, params.applicantId);
        const newEmployment = await db.employment.create({
          employeeId: params.applicantId,
          jobId: params.offerId,
        });
        const jobEmployees = await db.employment.findAll({
          where: {
            jobId: params.offerId,
          },
        });
        if (jobEmployees.length == offer.applicantLimit) {
          await offer.update({
            stateId: 2,
          });
        }
        return newEmployment;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },

    removeEmployee: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      const offer = await db.post.findByPk(params.jobId);
      if (!offer) {
        throw new ForbiddenError("Job offer does not exist");
      }
      if (ctx.currentUser.id != offer.ownerId) {
        throw new ForbiddenError("User is not the owner of this job offer");
      }
      await checkEmployment(params.jobId, params.employeeId);

      return true;
    },
  },
};
