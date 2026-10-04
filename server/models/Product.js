import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";
import Category from "./Category.js";
import Supplier from "./Supplier.js";

const Product = sequelize.define("Product", {
  sku: { type: DataTypes.STRING, allowNull: false, unique: true },
  productName: { type: DataTypes.STRING, allowNull: false },
  brand: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.ENUM("S", "M", "L", "XL", "XXL"), allowNull: false },
  gender: { type: DataTypes.ENUM("Men", "Women", "Kids"), allowNull: false },
  material: { type: DataTypes.STRING, allowNull: true },
  purchasePrice: { type: DataTypes.FLOAT, allowNull: false },
  sellingPrice: { type: DataTypes.FLOAT, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  description: { type: DataTypes.STRING },
});

Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

Product.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplier" });
Supplier.hasMany(Product, { foreignKey: "supplierId", as: "products" });

export default Product;
