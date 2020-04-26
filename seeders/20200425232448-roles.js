'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'roles',
      [
        {
          name: 'employer',
          description: 'employer is the person or institution that employs other people',
          active: true,
          createdAt: '2020-04-25 13:17:36.847+00',
          updatedAt: '2020-04-25 13:17:36.847+00',
        },
        {
          name: 'employee',
          description: 'employee is the person that works for employers',
          active: true,
          createdAt: '2020-04-25 13:17:36.847+00',
          updatedAt: '2020-04-25 13:17:36.847+00',
        },
      ],
      {}
    );
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.sequelize.query(
      'alter sequence messages_id_seq restart with 1;'
    );
  },
};