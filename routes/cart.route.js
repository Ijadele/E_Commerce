const express = require("express");
const {createCart, getCart, updateCart, deleteCart} = require("../controllers/cart.controller");
const authentication = require("../middlewares/authMiddleware")

const router = express.Router();

router.post("/add", authentication, createCart);
router.get("/cart", authentication, getCart);
router.put("/cart", authentication, updateCart);
router.delete("/cart", authentication, deleteCart);

module.exports = router;