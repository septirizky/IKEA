"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const product = require("../json/product.json");
    product.forEach((el) => {
      el.updatedAt = el.createdAt = new Date();
    });
    await queryInterface.bulkInsert("Products", product, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
