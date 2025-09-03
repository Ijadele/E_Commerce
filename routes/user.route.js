const express = require("express");
const {
  createUser,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/user.controller");
const authentication = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

const router = express.Router();

router.post("/", createUser);
router.get("/", authentication, authorizeRole("admin"), getAllUsers);
router.get("/one", authentication, getOneUser);
router.put("/", authentication, authorizeRole("admin"), updateUser);
router.delete("/", authentication, authorizeRole("admin"), deleteUser);
router.post("/login", loginUser);

module.exports = router;
