const cartModel = require("../models/cart.model");

const createCart = async (req, res) => {
  try {
    const { products } = req.body;
    const cart = await cartModel.findOne({ user: req.user.id });
    if (cart) {
      return res.status(400).json({ message: "Cart already exists" });
    }
    const newCart = new cartModel({ user: req.user.id, products });
    await newCart.save();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: "Error creating cart", error });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await cartModel
      .findOne({ user: req.user.id })
      .populate("products.product", "name price");
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    let cart = await cartModel.findOne({ user: req.user.id });

    if (!cart) {
      cart = new cartModel({ user: req.user.id, products: [] });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex > -1) {
      // Update existing quantity
      cart.products[productIndex].quantity = quantity;
    } else {
      // Add new product
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
};

const deleteCart = async (req, res) => {
  try {
    const cart = await cartModel.findOneAndDelete({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(204).json({ message: "Cart deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cart", error });
  }
};

module.exports = {
  createCart,
  getCart,
  updateCart,
  deleteCart,
};
