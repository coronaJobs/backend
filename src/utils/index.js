const utils = {};

Object.assign(
  utils,
  require("./application"),
  require("./employment"),
  require("./post")
);

module.exports = utils;
