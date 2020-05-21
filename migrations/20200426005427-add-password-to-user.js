"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("users", "password", {
      allowNull: false,
      type: Sequelize.STRING,
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn("users", "password");
  },
};
