const orderModel = require("../models/order.model");
const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");

// const createOrder = async (req, res) => {
//   try {
//     const cart = await cartModel
//       .findOne({ user: req.user.id })
//       .populate("products.product");

//     if (!cart || cart.products.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     // verify stock and compute totals
//     let totalAmount = 0;
//     const updates = [];

//     for (const item of cart.products) {
//       const product = await productModel.findById(item.product);
//       if (!product || product.stock < item.quantity) {
//         return res
//           .status(400)
//           .json({ message: "Insufficient stock", product: item.product });
//       }
//       totalAmount += product.price * item.quantity;

//       // prepare stock decrement update
//       updates.push({
//         updateOne: {
//           filter: { _id: item.product },
//           update: { $inc: { stock: -item.quantity } },
//         },
//       });
//     }

//     // apply all stock updates at once
//     await productModel.bulkWrite(updates);

//     // create order
//     const order = new orderModel({
//       user: req.user.id,
//       products: cart.products,
//       totalAmount,
//     });
//     await order.save();

//     // clear cart
//     cart.products = [];
//     await cart.save();

//     res.status(201).json(order);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating order", error });
//   }
// };

// customer: get own orders

const createOrder = async (req, res) => {
  try {
    let products = [];
    let totalAmount = 0;
    const updates = [];

    // If request has products in body → direct order (Buy Now)
    if (req.body.products && req.body.products.length > 0) {
      products = req.body.products;

    } else {
      // Otherwise fallback to cart
      const cart = await cartModel
        .findOne({ user: req.user.id })
        .populate("products.product");

      if (!cart || cart.products.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      products = cart.products;

      // clear the cart after order creation
      cart.products = [];
      await cart.save();
    }

    // verify stock and compute totals
    const orderProducts = [];
    for (const item of products) {
      const product = await productModel.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res
          .status(400)
          .json({ message: "Insufficient stock", product: item.product });
      }
      orderProducts.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      });
      totalAmount += product.price * item.quantity;

      // prepare stock decrement update
      updates.push({
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { stock: -item.quantity } },
        },
      });
    }

    // apply all stock updates at once
    await productModel.bulkWrite(updates);

    // create order
    const order = new orderModel({
      user: req.user.id,
      products: orderProducts,
      totalAmount,
    });
    await order.save();

    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ user: req.user.id })
      .populate("products.product", "name price image")
      .sort("-createdAt");
    if (!orders) {
      return res.status(404).json({ message: "Orders not found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// Admin: all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("user", "name email")
      .populate("products.product", "name price image")
      .sort("-createdAt");
    if (!orders) {
      return res.status(404).json({ message: "Orders not found" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};

// get single order
const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel
      .findById(id)
      .populate("user", "name email")
      .populate("products.product", "name price image");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { id } = req.query;
    const { status } = req.body;
    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status || order.status;
    await order.save();

    res.status(200).json({message: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error });
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.query;
  try {
    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // restore stock
    const updates = order.products.map(item => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: item.quantity } },
      },
    }));
    await productModel.bulkWrite(updates);
    await orderModel.findByIdAndDelete(id);
    res.status(204).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
