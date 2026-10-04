import { Sequelize } from "sequelize";
import process from "node:process";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required.");
}

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection Created");
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Connection Failed", error.message);
    process.exit(1);
  }
};

export default connectDB;
