"use strict";

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      "posts",
      [
        {
          name: "Se busca jardinero",
          description:
            "Trabajo simple de poda de árboles en Plaza Ñuñoa, Ñuñoa",
          applicantLimit: 2,
          ownerId: 4,
          stateId: 1,
          createdAt: "2020-04-27 16:30:46.847+00",
          updatedAt: "2020-04-27 16:30:46.847+00",
          communeId: 286,
        },
        {
          name: "Busco fabricante de mascarillas",
          description: "Se necesitan 50 mascarillas dentro de cuatro días.",
          applicantLimit: 1,
          ownerId: 5,
          stateId: 3,
          createdAt: "2020-04-27 18:27:35.847+00",
          updatedAt: "2020-04-27 18:27:35.847+00",
          communeId: 286,
        },
        {
          name: "Busco fletes",
          description: "Se necesita transporte para implementos médicos.",
          applicantLimit: 1,
          ownerId: 4,
          stateId: 3,
          createdAt: "2020-04-27 18:27:35.847+00",
          updatedAt: "2020-04-27 18:27:35.847+00",
          communeId: 286,
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("posts", null, {});
    await queryInterface.sequelize.query(
      "alter sequence posts_id_seq restart with 1;"
    );
  },
};
