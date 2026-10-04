import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";

const User = sequelize.define("User", {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING },
  role: {
    type: DataTypes.ENUM("admin", "manager", "inventory_staff"),
    defaultValue: "inventory_staff",
  },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected"),
    defaultValue: "pending",
  },
});

export default User;
