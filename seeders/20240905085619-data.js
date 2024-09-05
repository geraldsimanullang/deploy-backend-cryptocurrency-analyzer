"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const stringData = JSON.stringify(require("../data/bitcoin-data.json"));

    const data = [
      {
        UserId: 1,
        CoinId: 1,
        data: stringData,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];

    await queryInterface.bulkInsert("Data", data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Data", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    })
  },
};
