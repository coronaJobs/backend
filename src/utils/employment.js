const { db } = require("../models");
const { ForbiddenError } = require("apollo-server");

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

const updatePostState = async (post) => {
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

module.exports = {
  checkEmployment,
  deleteEmployment,
  updatePostState,
  jobValidations,
};
