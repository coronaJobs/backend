"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("posts", "communeId", {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: "communes",
        key: "id",
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.removeColumn("posts", "communeId");
  },
};
