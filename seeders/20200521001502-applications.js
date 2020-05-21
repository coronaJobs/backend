'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'applications',
      [
        {
          applicantId: 1,
          offerId: 2,
          createdAt: '2020-05-20 20:30:46.847+00',
          updatedAt: '2020-05-20 20:30:46.847+00',
        },
      ],
      {}
    );
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('applications', null, {});
    await queryInterface.sequelize.query(
      'alter sequence applications_id_seq restart with 1;'
    );
  },
};
