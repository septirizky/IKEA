const { afterAll, beforeAll, describe, expect, it } = require("@jest/globals");
const request = require("supertest");

const { User } = require("../models");
const app = require("../app");
const users = require("../json/user.json");

/* ========== SEED DATA ========== */
beforeAll(async () => {
  try {
    await User.bulkCreate(users, { individualHooks: true });
  } catch (error) {
    console.log(error);
  }
});

/* ========== LOGIN (POST) ========== */
describe("POST /login", () => {
  it("Email tidak diberikan / tidak diinput", async () => {
    const response = await request(app).post("/login").send({
      email: "",
      password: "12345678",
    });
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Please provide email and password"
    );
  });

  it("Password tidak diinput", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@gmail.com",
      password: "",
    });
    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Please provide email and password"
    );
  });

  it("Email tidak terdaftar", async () => {
    const response = await request(app).post("/login").send({
      email: "invalid@gmail.com",
      password: "12345678",
    });
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Incorrect email or password"
    );
  });

  it("Password tidak terdaftar", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@gmail.com",
      password: "15678",
    });
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Incorrect email or password"
    );
  });

  it("Berhasil login dan mengirimkan accessToken", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@gmail.com",
      password: "12345678",
    });
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("accessToken", expect.any(String));
  });
});

/* ========== CLEAN UP DATA ========== */
afterAll(async () => {
  try {
    await User.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (error) {
    console.log(error);
  }
});
