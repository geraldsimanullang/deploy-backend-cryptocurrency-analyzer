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

    const data = require("../data/coins-to-seed.json");

    const coins = data.map((coin) => {
        coin.createdAt = new Date();
        coin.updatedAt = new Date();

        return coin;
    });

    await queryInterface.bulkInsert("Coins", coins);

});

afterAll(async () => {
    await sequelize.queryInterface.bulkDelete("Users", null, {
        truncate: true,
        restartIdentity: true,
        cascade: true,
    });

    await queryInterface.bulkDelete("Coins", null, {
        truncate: true,
        restartIdentity: true,
        cascade: true,
      });
});

describe("GET /coins", () => {
    describe("success", () => {
        test("data retrieved successfully", async () => {
            const response = await request(app).get("/coins")

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
        });
    });
});

describe("GET /coins/:name", () => {
    describe("success get coin detail", () => {
        test("data retrieved successfully", async () => {
            const response = await request(app).get("/coins")

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Object);
        });
    });
});
