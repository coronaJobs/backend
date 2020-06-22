"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("employments", "employeeRating", {
        allowNull: true,
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn("employments", "employeeComment", {
        allowNull: true,
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("employments", "employerRating", {
        allowNull: true,
        type: Sequelize.INTEGER,
      }),
      queryInterface.addColumn("employments", "employerComment", {
        allowNull: true,
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("employments", "employeeRating"),
      queryInterface.removeColumn("employments", "employeeComment"),
      queryInterface.removeColumn("employments", "employerRating"),
      queryInterface.removeColumn("employments", "employerComment"),
    ]);
  },
};
