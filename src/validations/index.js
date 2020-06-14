const validators = {};

Object.assign(
  validators,
  require("./validateUserParameters"),
  require("./validatePostSearchParameters"),
  require("./validatePostParameters"),
  require("./validateApplicationParameters"),
  require("./validateCancelApplicationParameters")
);

module.exports = validators;
