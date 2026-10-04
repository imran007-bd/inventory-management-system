// Need to run this file for the first time to create an admin user.
// command: node --env-file=.env seed.js

import bcrypt from "bcrypt";
import process from "node:process";
import User from "./models/user.js";
import connectDB, { sequelize } from "./db/connection.js";

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding.");
  }

  await connectDB();
  const [admin, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      name: "admin",
      email,
      password: await bcrypt.hash(password, 10),
      address: "admin address",
      role: "admin",
      status: "approved",
    },
  });

  console.log(
    created ? `Admin account created: ${admin.email}` : `Admin account already exists: ${admin.email}`
  );
};

seedAdmin()
  .catch((error) => {
    console.error("Admin seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(() => sequelize.close());
