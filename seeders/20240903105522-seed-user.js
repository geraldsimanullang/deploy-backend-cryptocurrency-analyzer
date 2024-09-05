"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    require("dotenv").config();
    const password = "password";
    const { hash } = require("../helpers/bcryptjs");

    await queryInterface.bulkInsert("Users", [
      {
        name: "Gerald Simanullang",
        email: "geraldsimanullang@gmail.com",
        password: hash(password),
        role: "Admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
