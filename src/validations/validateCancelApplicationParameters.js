const { UserInputError } = require("apollo-server");
const { db } = require("./../models");
const { checkApplication, checkEmployment } = require("./../utils");

const validateOffer = async (offerId, validatorErrors) => {
  const offer = await db.post.findByPk(offerId);
  if (!offer) {
    validatorErrors.offerId = "Job offer does not exist";
  } else {
    if (offer.stateId != 1) {
      validatorErrors.offerState = "Job offer is unavailable";
    }
  }
};

const validateApplicationExistence = async (
  offerId,
  currentUser,
  validatorErrors
) => {
  const applicationExists = await checkApplication(offerId, currentUser.id);

  if (await checkEmployment(offerId, currentUser.id)) {
    validatorErrors.applicationEmployment =
      "User is already employed for this job";
  } else if (!applicationExists) {
    validatorErrors.applicationExistence =
      "User haven't applied for this job offer";
  }
};

const validateCancelApplicationParameters = async (params, currentUser) => {
  const { offerId } = params;

  const validatorErrors = {};

  await validateOffer(offerId, validatorErrors);
  await validateApplicationExistence(offerId, currentUser, validatorErrors);

  if (Object.keys(validatorErrors).length) {
    throw new UserInputError(
      "Failed to cancel application due to validation errors",
      {
        validatorErrors,
      }
    );
  }
};

module.exports = { validateCancelApplicationParameters };
