import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";

const Supplier = sequelize.define("Supplier", {
  supplierName: { type: DataTypes.STRING, allowNull: false },
  company: { type: DataTypes.STRING, allowNull: false },
  supplierEmail: { type: DataTypes.STRING, allowNull: false },
  supplierPhone: { type: DataTypes.STRING, allowNull: false },
  supplierAddress: { type: DataTypes.STRING, allowNull: false },
});

export default Supplier;
