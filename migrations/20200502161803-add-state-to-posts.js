'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('posts', 'stateId', {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'postStates',
        key: 'id',
      },
    });
  },
  down: queryInterface => {
    return queryInterface.removeColumn('posts', 'stateId');
  },
};