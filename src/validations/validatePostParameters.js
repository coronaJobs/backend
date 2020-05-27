const validator = require("validator");
const { UserInputError } = require("apollo-server");
const { db } = require("./../models");

// name: String!
// description: String!
// applicantLimit: Int!
// ownerId: Int!
// communeId: Int!

const validateName = async (name, validatorErrors) => {
  if (validator.isEmpty(name, { ignore_whitespace: true })) {
    validatorErrors.text = "Invalid name, can't be an empty string";
  }
};

const validateDescription = async (description, validatorErrors) => {
  if (validator.isEmpty(description, { ignore_whitespace: true })) {
    validatorErrors.description =
      "Invalid description, can't be an empty string";
  }
};

const validateApplicantLimit = async (applicantLimit, validatorErrors) => {
  // must be between 1 and 10
  if (applicantLimit < 1 || applicantLimit > 10) {
    validatorErrors.applicantLimit =
      "Invalid applicantLimit: must be between 1 and 10";
  }
};

// ownerId will not be used

const validateCommuneId = async (communeId, validatorErrors) => {
  const commune = await db.commune.findByPk(communeId);

  if (!commune) {
    validatorErrors.communeId = "Invalid communeId, commune does not exist";
  }
};

const validatePostParameters = async (params) => {
  const { name, description, applicantLimit, communeId } = params;

  const validatorErrors = {};

  await validateName(name, validatorErrors);
  await validateDescription(description, validatorErrors);
  await validateApplicantLimit(applicantLimit, validatorErrors);
  await validateCommuneId(communeId, validatorErrors);

  if (Object.keys(validatorErrors).length) {
    throw new UserInputError("Failed to fetch data due to validation errors", {
      validatorErrors,
    });
  }
};

module.exports = { validatePostParameters };
