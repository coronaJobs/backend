const utils = {};

Object.assign(
  utils,
  require("./application"),
  require("./employment"),
  require("./user")
);

module.exports = utils;
