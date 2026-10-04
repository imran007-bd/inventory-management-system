import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";

const addProduct = async (req, res) => {
  try {
    const {
      sku,
      productName,
      categoryId,
      brand,
      color,
      size,
      gender,
      material,
      supplierId,
      purchasePrice,
      sellingPrice,
      quantity,
      description,
    } = req.body;

    if (
      !sku ||
      !productName ||
      !categoryId ||
      !brand ||
      !color ||
      !size ||
      !gender ||
      !supplierId ||
      purchasePrice === undefined ||
      purchasePrice === "" ||
      sellingPrice === undefined ||
      sellingPrice === "" ||
      quantity === undefined ||
      quantity === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingProduct = await Product.findOne({ where: { sku } });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this SKU already exists",
      });
    }

    await Product.create({
      sku,
      productName,
      categoryId,
      brand,
      color,
      size,
      gender,
      material,
      supplierId,
      purchasePrice,
      sellingPrice,
      quantity,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.log("Error adding product:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getProduct = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: "category" },
        { model: Supplier, as: "supplier" },
      ],
    });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sku,
      productName,
      categoryId,
      brand,
      color,
      size,
      gender,
      material,
      supplierId,
      purchasePrice,
      sellingPrice,
      quantity,
      description,
    } = req.body;

    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await existingProduct.update({
      sku,
      productName,
      categoryId,
      brand,
      color,
      size,
      gender,
      material,
      supplierId,
      purchasePrice,
      sellingPrice,
      quantity,
      description,
    });

    return res.status(200).json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findByPk(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await existingProduct.destroy();
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addProduct, getProduct, updateProduct, deleteProduct };
