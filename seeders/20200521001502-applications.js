'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'applications',
      [
        {
          applicantId: 1,
          offerId: 1,
          createdAt: '2020-05-20 20:30:46.847+00',
          updatedAt: '2020-05-20 20:30:46.847+00',
        },
        {
          applicantId: 1,
          offerId: 2,
          createdAt: '2020-05-20 20:30:46.847+00',
          updatedAt: '2020-05-20 20:30:46.847+00',
        },
        {
          applicantId: 2,
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
  },
};
