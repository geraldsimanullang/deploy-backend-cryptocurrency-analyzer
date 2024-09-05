"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/coins-to-seed.json");

    const coins = data.map((coin) => {
      coin.createdAt = new Date();
      coin.updatedAt = new Date();

      return coin;
    });

    await queryInterface.bulkInsert("Coins", coins);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Coins", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
