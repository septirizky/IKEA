const express = require("express");
const HomeController = require("../controllers/homeController");
const router = express.Router();

router.get("/home/product", HomeController.getProduct);
router.get("/home/product/:id", HomeController.getProductById);

module.exports = router;
