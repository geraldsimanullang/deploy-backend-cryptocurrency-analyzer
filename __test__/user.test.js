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

describe("POST /register", () => {
  describe("register success", () => {
    test("meet all requirements", async () => {
      const response = await request(app).post("/register").send({
        name: "User Test",
        email: "usertest@mail.com",
        password: "usertestpassword",
      });

      expect(response.status).toBe(201);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("name", expect.any(String));
      expect(response.body).toHaveProperty("email", expect.any(String));
    });
  });

  describe("register failed", () => {
    test("password not given", async () => {
      const response = await request(app).post("/register").send({
        name: "User Test",
        email: "usertest@mail.com",
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Password is required");
    });

    test("name not given", async () => {
      const response = await request(app).post("/register").send({
        email: "usertest@mail.com",
        password: "usertestpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Name is required");
    });

    test("email not given", async () => {
      const response = await request(app).post("/register").send({
        name: "User Test",
        password: "usertestpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Email is required");
    });

    test("email already exist", async () => {
      const response = await request(app).post("/register").send({
        name: "User Test",
        email: "geraldsimanullang@gmail.com",
        password: "usertestpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Email already registered"
      );
    });
  });
});

describe("POST /login", () => {
  describe("login success", () => {
    test("meet all requirements", async () => {
      const response = await request(app).post("/login").send({
        email: "geraldsimanullang@gmail.com",
        password: "password",
      });

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
    });
  });

  describe("login failed", () => {
    test("password not given", async () => {
      const response = await request(app).post("/login").send({
        email: "geraldsimanullang@gmail.com",
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Invalid login");
    });

    test("email not given", async () => {
      const response = await request(app).post("/login").send({
        password: process.env.ADMIN_PASS,
      });

      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty("message", "Invalid login");
    });

    test("unregistered email", async () => {
      const response = await request(app).post("/login").send({
        email: "thisemailisnotregistered@mail.com",
        password: "password"
      });

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    });

    test("wrong password", async () => {
      const response = await request(app).post("/login").send({
        email: "geraldsimanullang@mail.com",
        password: "wrong_password",
      });

      expect(response.status).toBe(401);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid email or password"
      );
    });
  });
});
