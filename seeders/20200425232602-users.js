"use strict";

const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(Number(process.env.PASSWORD_SALT));

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          rut: "20.513.280-5",
          name: "Renato Corona",
          mail: "rcorona@coronajobs.com",
          phone: "8675463",
          address: "San Pablo 4332",
          roleId: 1,
          password: bcrypt.hashSync("123123", salt),
          /*
          profilePicture: '',
          resumeUrl: '',
          */
          createdAt: "2020-04-25 13:17:36.847+00",
          updatedAt: "2020-04-25 13:17:36.847+00",
        },
        {
          rut: "12.360.217-k",
          name: "Kimberley Scarleth Gonzalez",
          mail: "kimberley@coronajobs.com",
          phone: "8641463",
          address: "San Telmo 4577",
          roleId: 2,
          password: bcrypt.hashSync("123123", salt),
          /*
          profilePicture: '',
          resumeUrl: '',
          */
          createdAt: "2020-04-25 13:17:36.847+00",
          updatedAt: "2020-04-25 13:17:36.847+00",
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.sequelize.query(
      "alter sequence users_id_seq restart with 1;"
    );
  },
};
