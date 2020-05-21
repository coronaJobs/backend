"use strict";

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      "postStates",
      [
        {
          name: "open",
          description: "The employer is accepting employees.",
          active: true,
          createdAt: "2020-04-25 13:17:36.847+00",
          updatedAt: "2020-04-25 13:17:36.847+00",
        },
        {
          name: "closed",
          description: "The employer is not accepting employees.",
          active: true,
          createdAt: "2020-04-25 13:17:36.847+00",
          updatedAt: "2020-04-25 13:17:36.847+00",
        },
        {
          name: "finished",
          description: "The job required is already done.",
          active: true,
          createdAt: "2020-04-25 13:17:36.847+00",
          updatedAt: "2020-04-25 13:17:36.847+00",
        },
        {
          name: "cancelled",
          description: "The job was cancelled by the employer.",
          active: true,
          createdAt: "2020-04-25 13:17:36.847+00",
          updatedAt: "2020-04-25 13:17:36.847+00",
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("postStates", null, {});
    await queryInterface.sequelize.query(
      'alter sequence "postStates_id_seq" restart with 1;'
    );
  },
};
