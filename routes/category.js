const express = require("express");
const CategoryController = require("../controllers/categoryController");
const { authorCategory } = require("../middlewares/authorization");
const router = express.Router();

router.post("/category", authorCategory, CategoryController.create);
router.get("/category", CategoryController.getAll);
router.put("/category/:id", authorCategory, CategoryController.update);
router.delete("/category/:id", authorCategory, CategoryController.delete);

module.exports = router;
