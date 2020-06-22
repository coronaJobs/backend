const { db } = require("../models");
const {
  ApolloError,
  ForbiddenError,
  AuthenticationError,
} = require("apollo-server");
const tensify = require("tensify");
const _ = require("underscore");

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
  if (!ctx.auth) {
    throw new AuthenticationError("Not authenticated");
  }
  if (!offer) {
    throw new ForbiddenError("Job offer does not exist");
  }
  if (ctx.currentUser.id != offer.ownerId) {
    throw new ForbiddenError("User is not the owner of this job offer");
  }
};

const updatePostStateDueToOwnersAction = async (params, ctx, action) => {
  const actionNumbers = {
    open: 1,
    close: 2,
    finish: 3,
    cancel: 4,
    initialize: 5,
    pay: 6,
  };
  const offer = await db.post.findByPk(params.jobId);
  jobValidations(offer, ctx);
  const allowedActions = {
    // actionNumber: [postStates in which the action can be performed]
    3: [5], // Can finish job only if it is initialized.
    4: [1, 2, 5],
    5: [1, 2],
    6: [3],
  };
  if (!allowedActions[actionNumbers[action]].includes(offer.stateId)) {
    const statesStrings = allowedActions[actionNumbers[action]].map(
      (stateNumber) =>
        tensify(_.invert(actionNumbers)[stateNumber]).past_participle
    );
    const statesStringsJoined = statesStrings.join(" or ");
    throw new ForbiddenError(
      `This job is currently ${
        tensify(_.invert(actionNumbers)[offer.stateId]).past_participle
      }. Can not ${action} it, because it is not ${statesStringsJoined}.`
    );
  }
  try {
    await offer.update({
      stateId: actionNumbers[action],
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
