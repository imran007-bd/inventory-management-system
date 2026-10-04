import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";
import Supplier from "./Supplier.js";
import Category from "./Category.js";

const PurchaseOrder = sequelize.define("PurchaseOrder", {
  itemName: { type: DataTypes.STRING, allowNull: false },
  purchaseDate: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  cost: { type: DataTypes.FLOAT, allowNull: false },
  paymentStatus: {
    type: DataTypes.ENUM("Paid", "Unpaid", "Partial"),
    allowNull: false,
    defaultValue: "Unpaid",
  },
});

PurchaseOrder.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplier" });
Supplier.hasMany(PurchaseOrder, { foreignKey: "supplierId", as: "purchaseOrders" });

PurchaseOrder.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(PurchaseOrder, { foreignKey: "categoryId", as: "purchaseOrders" });

export default PurchaseOrder;
