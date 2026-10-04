import PurchaseOrder from "../models/PurchaseOrder.js";
import Supplier from "../models/Supplier.js";
import Category from "../models/Category.js";

const addPurchaseOrder = async (req, res) => {
  try {
    const { supplierId, itemName, categoryId, purchaseDate, quantity, cost, paymentStatus } = req.body;

    if (
      !supplierId ||
      !itemName ||
      !categoryId ||
      quantity === undefined ||
      quantity === "" ||
      cost === undefined ||
      cost === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const supplier = await Supplier.findByPk(supplierId);
    if (!supplier) {
      return res.status(404).json({ success: false, message: "Supplier not found" });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    await PurchaseOrder.create({
      supplierId,
      itemName,
      categoryId,
      purchaseDate,
      quantity,
      cost,
      paymentStatus,
    });

    return res.status(201).json({
      success: true,
      message: "Purchase order added successfully",
    });
  } catch (error) {
    console.log("Error adding purchase order:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getPurchaseOrders = async (req, res) => {
  try {
    const { supplierId } = req.query;
    const where = supplierId ? { supplierId } : {};

    const purchaseOrders = await PurchaseOrder.findAll({
      where,
      include: [
        { model: Supplier, as: "supplier" },
        { model: Category, as: "category" },
      ],
      order: [["purchaseDate", "DESC"]],
    });

    return res.status(200).json({ success: true, purchaseOrders });
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { supplierId, itemName, categoryId, purchaseDate, quantity, cost, paymentStatus } = req.body;

    const existingOrder = await PurchaseOrder.findByPk(id);
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: "Purchase order not found" });
    }

    await existingOrder.update({
      supplierId,
      itemName,
      categoryId,
      purchaseDate,
      quantity,
      cost,
      paymentStatus,
    });

    return res.status(200).json({ success: true, message: "Purchase order updated successfully" });
  } catch (error) {
    console.error("Error updating purchase order:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const existingOrder = await PurchaseOrder.findByPk(id);
    if (!existingOrder) {
      return res.status(404).json({ success: false, message: "Purchase order not found" });
    }

    await existingOrder.destroy();
    return res.status(200).json({ success: true, message: "Purchase order deleted successfully" });
  } catch (error) {
    console.error("Error deleting purchase order:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export { addPurchaseOrder, getPurchaseOrders, updatePurchaseOrder, deletePurchaseOrder };
