const express = require("express");
const {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const upload = require("../utils/multer");
const authentication = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

const router = express.Router();

router.post("/product", authentication, authorizeRole("admin"), upload.single("image"), createProduct);
router.get("/products", getAllProducts);
router.get("/product", getOneProduct);
router.put("/product", authentication, authorizeRole("admin"), updateProduct);
router.delete("/product", authentication, authorizeRole("admin"), deleteProduct);

module.exports = router;
