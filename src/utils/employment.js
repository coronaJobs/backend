const { db } = require("../models");

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

module.exports = { checkEmployment, deleteEmployment, updatePostState };
