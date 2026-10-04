// Populates dummy data for Categories, Suppliers, Products and Purchase Orders.
// command: node --env-file=.env seedData.js

import connectDB from "./db/connection.js";
import Category from "./models/Category.js";
import Supplier from "./models/Supplier.js";
import Product from "./models/Product.js";
import PurchaseOrder from "./models/PurchaseOrder.js";

const categoriesData = [
  { categoryName: "Shirt", categoryDescription: "Formal and casual shirts" },
  { categoryName: "T-shirt", categoryDescription: "Casual t-shirts" },
  { categoryName: "Jeans", categoryDescription: "Denim jeans and pants" },
  { categoryName: "Panjabi", categoryDescription: "Traditional panjabi wear" },
];

const suppliersData = [
  {
    supplierName: "Rahim Uddin",
    company: "Deshi Textiles Ltd.",
    supplierEmail: "rahim@deshitextiles.com",
    supplierPhone: "01711111111",
    supplierAddress: "Mirpur, Dhaka",
  },
  {
    supplierName: "Karim Sheikh",
    company: "Karim Garments",
    supplierEmail: "karim@karimgarments.com",
    supplierPhone: "01722222222",
    supplierAddress: "Gazipur, Dhaka",
  },
  {
    supplierName: "Nusrat Jahan",
    company: "Nusrat Fabrics",
    supplierEmail: "nusrat@nusratfabrics.com",
    supplierPhone: "01733333333",
    supplierAddress: "Narayanganj, Dhaka",
  },
];

const seed = async () => {
  try {
    await connectDB();

    const categories = {};
    for (const data of categoriesData) {
      const [category] = await Category.findOrCreate({
        where: { categoryName: data.categoryName },
        defaults: data,
      });
      categories[data.categoryName] = category;
    }

    const suppliers = {};
    for (const data of suppliersData) {
      const [supplier] = await Supplier.findOrCreate({
        where: { supplierName: data.supplierName },
        defaults: data,
      });
      suppliers[data.supplierName] = supplier;
    }

    const productsData = [
      {
        sku: "SKU-1001",
        productName: "Classic Cotton Shirt",
        categoryId: categories["Shirt"].id,
        brand: "Yellow",
        color: "White",
        size: "M",
        gender: "Men",
        material: "Cotton",
        supplierId: suppliers["Rahim Uddin"].id,
        purchasePrice: 650,
        sellingPrice: 950,
        quantity: 40,
        description: "Slim fit formal cotton shirt.",
      },
      {
        sku: "SKU-1002",
        productName: "Round Neck T-shirt",
        categoryId: categories["T-shirt"].id,
        brand: "Ecstasy",
        color: "Black",
        size: "L",
        gender: "Men",
        material: "Cotton",
        supplierId: suppliers["Karim Sheikh"].id,
        purchasePrice: 300,
        sellingPrice: 450,
        quantity: 80,
        description: "Everyday round neck t-shirt.",
      },
      {
        sku: "SKU-1003",
        productName: "Slim Fit Jeans",
        categoryId: categories["Jeans"].id,
        brand: "Cats Eye",
        color: "Blue",
        size: "XL",
        gender: "Men",
        material: "Denim",
        supplierId: suppliers["Nusrat Jahan"].id,
        purchasePrice: 900,
        sellingPrice: 1400,
        quantity: 25,
        description: "Stretchable slim fit denim jeans.",
      },
      {
        sku: "SKU-1004",
        productName: "Embroidered Panjabi",
        categoryId: categories["Panjabi"].id,
        brand: "Aarong",
        color: "Maroon",
        size: "L",
        gender: "Men",
        material: "Linen",
        supplierId: suppliers["Rahim Uddin"].id,
        purchasePrice: 1200,
        sellingPrice: 1850,
        quantity: 15,
        description: "Festive embroidered panjabi.",
      },
      {
        sku: "SKU-1005",
        productName: "Women's Printed T-shirt",
        categoryId: categories["T-shirt"].id,
        brand: "Ecstasy",
        color: "Pink",
        size: "S",
        gender: "Women",
        material: "Cotton",
        supplierId: suppliers["Karim Sheikh"].id,
        purchasePrice: 280,
        sellingPrice: 420,
        quantity: 60,
        description: "Casual printed t-shirt for women.",
      },
      {
        sku: "SKU-1006",
        productName: "Kids Denim Jeans",
        categoryId: categories["Jeans"].id,
        brand: "Cats Eye",
        color: "Light Blue",
        size: "S",
        gender: "Kids",
        material: "Denim",
        supplierId: suppliers["Nusrat Jahan"].id,
        purchasePrice: 500,
        sellingPrice: 750,
        quantity: 30,
        description: "Comfortable denim jeans for kids.",
      },
    ];

    const products = {};
    for (const data of productsData) {
      const [product] = await Product.findOrCreate({
        where: { sku: data.sku },
        defaults: data,
      });
      products[data.sku] = product;
    }

    const purchaseOrdersData = [
      {
        supplierId: suppliers["Rahim Uddin"].id,
        itemName: products["SKU-1001"].productName,
        categoryId: categories["Shirt"].id,
        purchaseDate: "2026-05-10",
        quantity: 40,
        cost: 26000,
        paymentStatus: "Paid",
      },
      {
        supplierId: suppliers["Karim Sheikh"].id,
        itemName: products["SKU-1002"].productName,
        categoryId: categories["T-shirt"].id,
        purchaseDate: "2026-06-02",
        quantity: 80,
        cost: 24000,
        paymentStatus: "Paid",
      },
      {
        supplierId: suppliers["Nusrat Jahan"].id,
        itemName: products["SKU-1003"].productName,
        categoryId: categories["Jeans"].id,
        purchaseDate: "2026-06-18",
        quantity: 25,
        cost: 22500,
        paymentStatus: "Partial",
      },
      {
        supplierId: suppliers["Rahim Uddin"].id,
        itemName: products["SKU-1004"].productName,
        categoryId: categories["Panjabi"].id,
        purchaseDate: "2026-07-01",
        quantity: 15,
        cost: 18000,
        paymentStatus: "Unpaid",
      },
      {
        supplierId: suppliers["Karim Sheikh"].id,
        itemName: products["SKU-1005"].productName,
        categoryId: categories["T-shirt"].id,
        purchaseDate: "2026-07-05",
        quantity: 60,
        cost: 16800,
        paymentStatus: "Paid",
      },
      {
        supplierId: suppliers["Nusrat Jahan"].id,
        itemName: products["SKU-1006"].productName,
        categoryId: categories["Jeans"].id,
        purchaseDate: "2026-07-10",
        quantity: 30,
        cost: 15000,
        paymentStatus: "Unpaid",
      },
    ];

    for (const data of purchaseOrdersData) {
      await PurchaseOrder.findOrCreate({
        where: {
          supplierId: data.supplierId,
          itemName: data.itemName,
          purchaseDate: data.purchaseDate,
        },
        defaults: data,
      });
    }

    console.log("Dummy data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seed();
