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
  deleteEmployment,
  updatePostState,
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
        await updatePostState(offer);
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
      if (offer.stateId != 1 && offer.stateId != 2) {
        throw new ForbiddenError("Job offer is unavailable");
      }
      await checkEmployment(params.jobId, params.employeeId);
      try {
        await deleteEmployment(params.jobId, params.employeeId);
        await updatePostState(offer);
        return true;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },
  },
};
