const { db } = require("../models");

const checkIfEmploymentsArePaid = async (jobId) => {
  const postEmployments = await db.employment.findAll({ where: { jobId } });
  if (postEmployments.length) {
    return postEmployments.every((employment) => employment.paid == true);
  }
  return false;
};

module.exports = { checkIfEmploymentsArePaid };
