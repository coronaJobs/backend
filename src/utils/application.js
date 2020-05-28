const { db } = require("../models");
const { ForbiddenError } = require("apollo-server");

const deleteApplication = async (offerId, applicantId) => {
  const application = await db.application.findOne({
    where: {
      offerId: offerId,
      applicantId: applicantId,
    },
  });
  await application.destroy();
};

const checkApplication = async (offerId, applicantId) => {
  const userApplications = await db.application.findAll({
    where: {
      offerId: offerId,
      applicantId: applicantId,
    },
  });
  if (!userApplications.length) {
    throw new ForbiddenError("User is not applying for this job offer");
  }
};

module.exports = { deleteApplication, checkApplication };
