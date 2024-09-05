const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models");
const { hash } = require("../helpers/bcryptjs");

beforeAll(async () => {
  require("dotenv").config();
  const hashedPassword = hash("password");

  const admin = [
    {
      name: "Gerald Simanullang",
      email: "geraldsimanullang@gmail.com",
      password: hashedPassword,
      role: "Admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await sequelize.queryInterface.bulkInsert("Users", admin, {});
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

