const { db } = require("../../models");
const { ApolloError, ForbiddenError } = require("apollo-server");
const {
  deleteApplication,
  checkApplication,
  checkEmployment,
  deleteEmployment,
  updatePostStateDueToCapacity,
  updatePostStateDueToOwnersAction,
  jobValidations,
  checkIfEmploymentsArePaid,
} = require("../../utils");

module.exports = {
  Subscription: {},

  Mutation: {
    createEmployment: async (_, params, ctx) => {
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

    markEmploymentAsPaid: async (_, params, ctx) => {
      const { jobId } = params;
      const employeeId = ctx.currentUser.id;
      if (!(await checkEmployment(jobId, employeeId))) {
        throw new ForbiddenError("User is not employed for this job");
      }
      const post = await db.post.findByPk(jobId);
      if (post.stateId != 3) {
        throw new ForbiddenError(
          "Can not mark as paid, because job is not finished."
        );
      }
      const employment = await db.employment.findOne({
        where: {
          employeeId,
          jobId,
        },
      });
      if (employment.paid) {
        throw new ForbiddenError("Employment already marked as paid.");
      }
      try {
        await employment.update({ paid: true });
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
      const jobEmployments = await db.employment.findAll({
        where: {
          jobId: params.jobId,
        },
      });
      if (!jobEmployments.length) {
        throw new ForbiddenError(
          "Can not initialize job, because no employees have been accepted."
        );
      }
      return await updatePostStateDueToOwnersAction(params, ctx, "initialize");
    },

    payJob: async (_, params, ctx) => {
      if (!(await checkIfEmploymentsArePaid(params.jobId))) {
        throw new ForbiddenError(
          "Can not mark job as paid, because not all employees have been paid or there are no employees."
        );
      }
      return await updatePostStateDueToOwnersAction(params, ctx, "pay");
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
    createEmployerEvaluation: async (_, params, ctx) => {
      const { postId, comment, rating } = params;
      const post = await db.post.findByPk(postId);

      if (!(await checkEmployment(postId, ctx.currentUser.id))) {
        throw new ForbiddenError("Current user is not employed for this job");
      }

      if (post.stateId !== 3 && post.stateId !== 6) {
        throw new ForbiddenError("The job is not finished or paid");
      }

      const employment = await db.employment.findOne({
        where: {
          employeeId: ctx.currentUser.id,
          jobId: postId,
        },
      });
      try {
        return await employment.update({
          employerComment: comment,
          employerRating: rating,
        });
      } catch (error) {
        throw new ApolloError("Unexpected error", 500);
      }
    },
  },
};
