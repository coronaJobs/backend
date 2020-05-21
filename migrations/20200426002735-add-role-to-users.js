"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("users", "roleId", {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: "roles",
        key: "id",
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn("users", "roleId");
  },
};
