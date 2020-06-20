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
  updatePostStateDueToCapacity,
  updatePostStateDueToOwnersAction,
  jobValidations,
} = require("../../utils");

module.exports = {
  Subscription: {},

  Mutation: {
    createEmployment: async (_, params, ctx) => {
      if (!ctx.auth) {
        throw new AuthenticationError("Not authenticated");
      }
      const offer = await db.post.findByPk(params.offerId);
      jobValidations(offer, ctx);
      if (offer.stateId != 1) {
        throw new ForbiddenError("Job offer is not open");
      }
      if (!(await checkApplication(params.offerId, params.applicantId))) {
        throw new ForbiddenError("User is not applying for this job offer");
      }
      try {
        await deleteApplication(params.offerId, params.applicantId);
        const newEmployment = await db.employment.create({
          employeeId: params.applicantId,
          jobId: params.offerId,
        });
        await updatePostStateDueToCapacity(offer);
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
      jobValidations(offer, ctx);
      if (offer.stateId != 1 && offer.stateId != 2) {
        throw new ForbiddenError("Job offer is unavailable");
      }
      if (!(await checkEmployment(params.jobId, params.employeeId))) {
        throw new ForbiddenError("User is not employed for this job");
      }
      try {
        await deleteEmployment(params.jobId, params.employeeId);
        await updatePostStateDueToCapacity(offer);
        return true;
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },

    cancelJob: async (_, params, ctx) => {
      return await updatePostStateDueToOwnersAction(params, ctx, "cancel");
    },

    finishJob: async (_, params, ctx) => {
      return await updatePostStateDueToOwnersAction(params, ctx, "finish");
    },

    initializeJob: async (_, params, ctx) => {
      return await updatePostStateDueToOwnersAction(params, ctx, "initialize");
    },

    createEmployeeEvaluation: async (_, params, ctx) => {
      const { employeeId, postId, comment, rating } = params;
      const post = await db.post.findByPk(postId);
      jobValidations(post, ctx);

      if (!(await checkEmployment(postId, employeeId))) {
        throw new ForbiddenError("User is not employed for this job");
      }

      if (post.stateId !== 3 && post.stateId !== 6) {
        throw new ForbiddenError("The job is not finished or paid");
      }

      const employment = await db.employment.findOne({
        where: {
          employeeId,
          jobId: postId,
        },
      });
      try {
        return await employment.update({
          employeeComment: comment,
          employeeRating: rating,
        });
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },
  },
};
