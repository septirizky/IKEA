const express = require("express");
const ProductController = require("../controllers/productController");
const { authorProduct } = require("../middlewares/authorization");
const upload = require("../middlewares/multer");
const router = express.Router();

router.post("/product", authorProduct, ProductController.create);
router.get("/product", ProductController.getAll);
router.get("/product/:id", ProductController.getById);
router.put("/product/:id", authorProduct, ProductController.update);
router.patch(
  "/product/:id",
  authorProduct,
  upload.single("imgUrl"),
  ProductController.updateImageUrl
);
router.delete("/product/:id", authorProduct, ProductController.delete);

module.exports = router;
