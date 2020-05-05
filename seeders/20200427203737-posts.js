'use strict';

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'posts',
      [
        {
          name: 'Se busca jardinero',
          description: 'Trabajo simple en Plaza San Diego, Ñuñoa',
          applicantLimit: 2,
          ownerId: 1,
          stateId: 1,
          createdAt: '2020-04-27 16:30:46.847+00',
          updatedAt: '2020-04-27 16:30:46.847+00',
        },
        {
          name: 'Busco fabricante de mascarillas',
          description: 'Se necesitan 50 mascarillas dentro de cuatro días.',
          applicantLimit: 1,
          ownerId: 2,
          stateId: 3,
          createdAt: '2020-04-27 18:27:35.847+00',
          updatedAt: '2020-04-27 18:27:35.847+00',
        },
      ],
      {}
    );
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('posts', null, {});
    await queryInterface.sequelize.query(
      'alter sequence posts_id_seq restart with 1;'
    );
  },
};
