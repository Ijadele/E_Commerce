const productModel = require("../models/product.model");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs/promises");

const createProduct = async (req, res) => {
  const { name, description, price, stock, category } = req.body;
  const image = req.file.path;
  const imageUpload = await cloudinary.uploader.upload(image, {
    folder: "products",
  });

  // remove local image file
  await fs.unlink(image);

  if (!name || !description || !price || !stock || !category || !image) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newProduct = new productModel({
      name,
      description,
      price,
      createdBy: req.user.id, // assuming req.user is set by authentication middleware
      stock,
      category,
      image: imageUpload.secure_url,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel.find().populate("category", "name");
    if (!allProducts) {
      return res.status(404).json({ message: "No products found" });
    }
    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

const getOneProduct = async (req, res) => {
  const { id } = req.query;
  try {
    const product = await productModel.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating product", error });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.query;
  try {
    const deletedProduct = await productModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting product", error });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
