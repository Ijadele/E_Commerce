const express = require("express");
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");
const authentication = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/authorizeRole");

const router = express.Router();

router.post("/order", authentication, createOrder);
router.get("/my-orders", authentication, getMyOrders);
router.get("/order/:id", authentication, getSingleOrder);
router.get("/all-orders", authentication, authorizeRole("admin"), getAllOrders);
router.put("/order", authentication, authorizeRole("admin"), updateOrder);
router.delete("/order/:id", authentication, authorizeRole("admin"), deleteOrder);

module.exports = router;