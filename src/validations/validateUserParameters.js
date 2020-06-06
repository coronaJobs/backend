const { UserInputError } = require("apollo-server");
const validator = require("validator");
const passwordValidator = require("password-validator");
const {
  validateRut,
  formatRut,
  RutFormat,
} = require("@fdograph/rut-utilities");
const parseFullName = require("parse-full-name").parseFullName;
const { db } = require("./../models");

const processMail = async (params, validationErrors) => {
  const { mail } = params;
  if (mail === "") validationErrors.mail = "Empty email";
  if (mail) {
    const users = await db.user.findAll({
      where: {
        mail,
      },
    });
    if (!validator.isEmail(mail))
      validationErrors.mail = "Invalid email address";
    else if (users.length) validationErrors.mail = "Email already exists";
  }
};

const processPhone = (params, validationErrors) => {
  const { phone } = params;
  if (phone === "") validationErrors.phone = "Empty phone";
  if (phone && !validator.isNumeric(phone)) {
    validationErrors.phone = "Invalid phone number";
  }
};

const processAddress = (params, validationErrors) => {
  const { address } = params;
  if (address === "") validationErrors.address = "Empty address";
};

const processName = (params, validationErrors) => {
  const { name } = params;
  if (name === "") validationErrors.name = "Empty name";
  if (name) {
    const parsedName = parseFullName(name);
    if (parsedName.error.length) validationErrors.name = parsedName.error[0];
    params.name = [parsedName.first, parsedName.middle, parsedName.last]
      .filter((word) => word != "")
      .join(" ");
  }
};

const processRut = async (params, validationErrors) => {
  const { rut } = params;
  if (rut === "") validationErrors.rut = "Empty rut number";
  if (rut) {
    const formattedRut = formatRut(rut, RutFormat.DOTS_DASH);
    const users = await db.user.findAll({
      where: {
        rut: formattedRut,
      },
    });
    if (!validateRut(rut)) validationErrors.rut = "Invalid rut number";
    else if (users.length) validationErrors.rut = "Rut already exists";
    else params.rut = formattedRut;
  }
};

const processPassword = (params, validationErrors) => {
  const { password } = params;
  if (password === "") validationErrors.password = "Empty password";
  if (password) {
    var schema = new passwordValidator();
    schema.has().not().spaces();
    if (!schema.validate(password))
      validationErrors.password = "Invalid password";
  }
};

const validateUserParameters = async (params) => {
  const validationErrors = {};
  await processMail(params, validationErrors);
  await processRut(params, validationErrors);
  processPhone(params, validationErrors);
  processName(params, validationErrors);
  processAddress(params, validationErrors);
  processPassword(params, validationErrors);

  if (Object.keys(validationErrors).length) {
    throw new UserInputError("Failed to save data due to validation errors", {
      validationErrors,
    });
  }
};

module.exports = { validateUserParameters };
