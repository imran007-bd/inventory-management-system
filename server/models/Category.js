import { DataTypes } from "sequelize";
import { sequelize } from "../db/connection.js";

const Category = sequelize.define("Category", {
  categoryName: { type: DataTypes.STRING, allowNull: false },
  categoryDescription: { type: DataTypes.STRING, allowNull: false },
});

export default Category;
