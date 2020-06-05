const { db } = require("../models");

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
    return false;
  } else {
    return true;
  }
};

module.exports = { deleteApplication, checkApplication };