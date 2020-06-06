const { db } = require("../models");
const {
  ApolloError,
  ForbiddenError,
  AuthenticationError,
} = require("apollo-server");

const checkEmployment = async (jobId, employeeId) => {
  const userEmployments = await db.employment.findAll({
    where: {
      employeeId,
      jobId,
    },
  });
  if (!userEmployments.length) {
    return false;
  } else {
    return true;
  }
};

const deleteEmployment = async (jobId, employeeId) => {
  const employment = await db.employment.findOne({
    where: {
      jobId,
      employeeId,
    },
  });
  await employment.destroy();
};

const updatePostStateDueToCapacity = async (post) => {
  const jobEmployees = await db.employment.findAll({
    where: {
      jobId: post.id,
    },
  });
  if (jobEmployees.length == post.applicantLimit) {
    await post.update({
      stateId: 2,
    });
  } else if (jobEmployees.length < post.applicantLimit) {
    await post.update({
      stateId: 1,
    });
  }
};

const jobValidations = (offer, ctx) => {
  if (!offer) {
    throw new ForbiddenError("Job offer does not exist");
  }
  if (ctx.currentUser.id != offer.ownerId) {
    throw new ForbiddenError("User is not the owner of this job offer");
  }
};

const updatePostStateDueToOwnersAction = async (params, ctx, action) => {
  if (!ctx.auth) {
    throw new AuthenticationError("Not authenticated");
  }
  const actionEnum = {
    finish: 3,
    cancel: 4,
  };
  const offer = await db.post.findByPk(params.jobId);
  jobValidations(offer, ctx);
  if (offer.stateId == 3 || offer.stateId == 4) {
    throw new ForbiddenError(
      "Can not " +
        action +
        " job, because it has already finished or been cancelled"
    );
  }
  try {
    await offer.update({
      stateId: actionEnum[action],
    });
    return true;
  } catch (error) {
    throw new ApolloError("Unexpected error", 500);
  }
};

module.exports = {
  checkEmployment,
  deleteEmployment,
  updatePostStateDueToCapacity,
  updatePostStateDueToOwnersAction,
  jobValidations,
};
