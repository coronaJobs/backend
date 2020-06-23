"use strict";

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      "employments",
      [
        {
          employeeId: 3,
          jobId: 2,
          employeeRating: 5,
          employeeComment: "Un trabajador muy responsable.",
          createdAt: "2020-05-20 20:30:46.847+00",
          updatedAt: "2020-05-20 20:30:46.847+00",
        },
        {
          employeeId: 3,
          jobId: 3,
          employeeRating: 4,
          employeeComment: "Puntual y profesional!",
          employerRating: 5,
          employerComment: "Muy respetuoso.",
          createdAt: "2020-05-20 20:30:46.847+00",
          updatedAt: "2020-05-20 20:30:46.847+00",
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("employments", null, {});
  },
};
