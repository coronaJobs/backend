"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("employments", "paid", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn("employments", "paid");
  },
};
