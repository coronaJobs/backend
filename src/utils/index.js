const utils = {};

Object.assign(
  utils,
  require("./application"),
  require("./employment"),
  require("./post"),
  require("./user")
);

module.exports = utils;
