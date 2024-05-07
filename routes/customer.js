const express = require("express");
const CustomerController = require("../controllers/customerController");
const { authorAdmin, authorCustomer } = require("../middlewares/authorization");
const upload = require("../middlewares/multer");

const router = express.Router();

router.get("/customer", authorAdmin, CustomerController.getAll);
router.put("/customer/:id", authorCustomer, CustomerController.update);
router.patch(
  "/product/:id",
  upload.single("photo"),
  CustomerController.updatePhoto
);

module.exports = router;
