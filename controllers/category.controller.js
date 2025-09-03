const categoryModel = require("../models/category.model");

const createCategory = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newCategory = new categoryModel({ name, description });
    await newCategory.save();
    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const allCategories = await categoryModel.find();
    if (!allCategories) {
      return res.status(404).json({ message: "No categories found" });
    }
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

const getOneCategory = async (req, res) => {
  const { id } = req.query;
  try {
    const category = await categoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category", error });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.query;
  const updateData = req.body;
  try {
    const updatedCategory = await categoryModel.findByIdAndUpdate(
      id,
      { ...updateData },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating category", error });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.query;
  try {
    const deletedCategory = await categoryModel.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    return res.json({ message: "Category deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting category", error });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
};
