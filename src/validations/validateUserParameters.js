const { UserInputError } = require('apollo-server');
const validator = require('validator');
const {
  validateRut,
  formatRut,
  RutFormat,
} = require('@fdograph/rut-utilities');
const parseFullName = require('parse-full-name').parseFullName;

const processMail = (params, validationErrors) => {
  const { mail } = params;
  if (mail && !validator.isEmail(mail)) {
      validationErrors.mail = 'Invalid email address';
  }
}

const processPhone = (params, validationErrors) => {
  const { phone } = params;
  if (phone && !validator.isNumeric(phone)) {
    validationErrors.phone = 'Invalid phone number';
  }
}

const processName = (params, validationErrors) => {
  const { name } = params;
  if (name) {
    parsedName = parseFullName(name);
    if (parsedName.error.length) validationErrors.name = parsedName.error[0];
    params.name = [
      parsedName.first,
      parsedName.middle,
      parsedName.last
    ]
    .filter(word => word != '')
    .join(' ');
  }
}

const processRut = (params, validationErrors) => {
  const { rut } = params;
  if (rut) {
    if (!validateRut(rut)) validationErrors.rut = 'Invalid rut number';
    else params.rut = formatRut(rut, RutFormat.DOTS_DASH);
  }
}

const validateUserParameters = (params) => {
  const validationErrors = {}
  processMail(params, validationErrors);
  processPhone(params, validationErrors);
  processName(params, validationErrors);
  processRut(params, validationErrors);

  if ((Object.keys(validationErrors)).length) {
    throw new UserInputError(
      'Failed to save data due to validation errors',
      { validationErrors }
    ); 
  }
}

module.exports = { validateUserParameters };