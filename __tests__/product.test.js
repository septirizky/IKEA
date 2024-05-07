const { afterAll, beforeAll, describe, expect, it } = require("@jest/globals");
const request = require("supertest");

const { signToken, verifyToken } = require("../helpers/jwt");
const { Category, Product, User } = require("../models");
const app = require("../app");
const categories = require("../json/category.json");
const products = require("../json/product.json");
const users = require("../json/user.json");

let adminToken;
let staffToken;

/* ========== SEED DATA ========== */
beforeAll(async () => {
  try {
    await Category.bulkCreate(categories);

    const createdUsers = await User.bulkCreate(users, {
      individualHooks: true,
    });

    adminToken = signToken({
      id: createdUsers[0].id,
      email: createdUsers[0].email,
      role: createdUsers[0].role,
    });
    staffToken = signToken({
      id: createdUsers[1].id,
      email: createdUsers[1].email,
      role: createdUsers[1].role,
    });
    console.log(adminToken, "<<<<<<tooooooooookkkkkkke");
  } catch (error) {
    console.log(error);
  }
});

/* ========== CREATE PRODUCT (POST) ========== */
describe("POST /products", () => {
  it("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app)
      .post("/product")
      .send({ ...products[0], userId: null });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Please login first");
  });

  it("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .post("/product")
      .set("Authorization", "Bearer invalid")
      .send({ ...products[0], userId: null });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Please login first");
  });

  it("Gagal ketika request body tidak sesuai", async () => {
    const response = await request(app)
      .post("/product")
      .set("Authorization", `Bearer ${adminToken}`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid input");
  });

  it("Berhasil membuat entitas utama", async () => {
    const { id: userId } = verifyToken(adminToken);

    const response = await request(app)
      .post("/product")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...products[0], userId });

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("name", products[0].name);
    expect(response.body).toHaveProperty(
      "description",
      products[0].description
    );
    expect(response.body).toHaveProperty("price", products[0].price);
    expect(response.body).toHaveProperty("stock", products[0].stock);
    expect(response.body).toHaveProperty("imgUrl", products[0].imgUrl);
    expect(response.body).toHaveProperty("categoryId", products[0].categoryId);
    expect(response.body).toHaveProperty("userId", userId);
  });
});

/* ========== UPDATE PRODUCT (PUT) ========== */
describe("PUT /products/:id", () => {
  it("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app)
      .put("/product/1")
      .send({ ...products[1], userId: null });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Please login first");
  });

  it("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .put("/product/1")
      .set("Authorization", "Bearer invalid")
      .send({ ...products[1], userId: null });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Please login first");
  });

  it("Gagal karena id entity yang dikirim tidak terdapat di database", async () => {
    const { id: userId } = verifyToken(adminToken);

    const response = await request(app)
      .put("/product/22")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...products[1], userId });

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Data with id 22 not found"
    );
  });

  it("Gagal menjalankan fitur ketika staff mengolah data entity yang bukan miliknya", async () => {
    const { id: userId } = verifyToken(staffToken);

    const response = await request(app)
      .put("/product/1")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ ...products[1], userId });

    expect(response.status).toBe(403);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "You dont have any access");
  });

  it("Gagal ketika request body tidak sesuai", async () => {
    const response = await request(app)
      .put("/product/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        imgUrl: "",
        categoryId: 0,
        userId: 0,
      });
    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid input");
  });

  it("Berhasil mengupdate data entitas utama berdasarkan params id yang diberikan", async () => {
    const { id: userId } = verifyToken(adminToken);

    const response = await request(app)
      .put("/product/1")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ ...products[1], userId });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("name", products[1].name);
    expect(response.body).toHaveProperty(
      "description",
      products[1].description
    );
    expect(response.body).toHaveProperty("price", products[1].price);
    expect(response.body).toHaveProperty("stock", products[1].stock);
    expect(response.body).toHaveProperty("imgUrl", products[1].imgUrl);
    expect(response.body).toHaveProperty("categoryId", products[1].categoryId);
    expect(response.body).toHaveProperty("userId", userId);
  });
});

/* ========== DELETE PRODUCT (DELETE) ========== */
describe("DELETE /product/:id", () => {
  it("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).delete("/products/1");

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Please login first");
  });

  it("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .delete("/product/1")
      .set("Authorization", "Bearer invalid");

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Please login first");
  });

  it("Gagal karena id entity yang dikirim tidak terdapat di database", async () => {
    const response = await request(app)
      .delete("/product/2")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Data with id 22 not found"
    );
  });

  it("Gagal menjalankan fitur ketika staff menghapus entity yang bukan miliknya", async () => {
    const response = await request(app)
      .delete("/products/1")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(403);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "You dont have any access");
  });

  it("Berhasil menghapus data entitas utama berdasarkan params id yang diberikan", async () => {
    const { id: userId } = verifyToken(adminToken);

    const response = await request(app)
      .delete("/products/1")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("name", products[1].name);
    expect(response.body).toHaveProperty(
      "description",
      products[1].description
    );
    expect(response.body).toHaveProperty("price", products[1].price);
    expect(response.body).toHaveProperty("stock", products[1].stock);
    expect(response.body).toHaveProperty("imgUrl", products[1].imgUrl);
    expect(response.body).toHaveProperty("categoryId", products[1].categoryId);
    expect(response.body).toHaveProperty("userId", userId);
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
    await Category.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
    await Product.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (error) {
    console.log(error);
  }
});
