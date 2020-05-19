'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('applications', {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('applications');
  },
};
