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
    throw new ForbiddenError("User is not employed for this job");
  }
};

module.exports = { checkEmployment };
