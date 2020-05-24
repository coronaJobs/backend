"use strict";

const rawCommunes = require("./../staticData/communes");
const communes = [];
rawCommunes.forEach((com) => {
  communes.push({
    createdAt: "2020-04-27 16:30:46.847+00",
    updatedAt: "2020-04-27 16:30:46.847+00",
    name: com,
  });
});

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("communes", communes, {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("communes", null, {});
    await queryInterface.sequelize.query(
      "alter sequence communes_id_seq restart with 1;"
    );
  },
};
