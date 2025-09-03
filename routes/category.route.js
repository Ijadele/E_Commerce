const express = require("express");
const {
  createCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const authentication = require("../middlewares/authMiddleware");    
const authorizeRole = require("../middlewares/authorizeRole");

const router = express.Router();

router.post("/category", authentication, authorizeRole("admin"), createCategory);
router.get("/categories", getAllCategories);
router.get("/category", getOneCategory);
router.put("/category", authentication, authorizeRole("admin"), updateCategory);
router.delete("/category", authentication, authorizeRole("admin"), deleteCategory);

module.exports = router;
