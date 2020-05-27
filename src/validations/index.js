const validators = {};

Object.assign(
  validators,
  require("./validateUserParameters"),
  require("./validatePostSearchParameters"),
  require("./validatePostParameters")
);

module.exports = validators;
