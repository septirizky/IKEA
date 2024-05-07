"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const customer = require("../json/customer.json");
    customer.forEach((el) => {
      el.updatedAt = el.createdAt = new Date();
    });
    await queryInterface.bulkInsert("Customers", customer, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Customers", null, {});
  },
};
