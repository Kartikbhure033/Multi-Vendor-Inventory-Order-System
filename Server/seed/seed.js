// seed/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");

const MONGO_URI = process.env.MONGO_URI;

const vendors = [
  { name: "Alpha Gadgets", email: "alpha@shop.com" },
  { name: "Beta Bazaar",  email: "beta@shop.com"  },
  { name: "Cosmic Supplies", email: "cosmic@shop.com" },
];

const sampleProducts = [
  { name: "Wireless Mouse",       price: 799,  stock: 25 },
  { name: "Mechanical Keyboard",  price: 3599, stock: 12 },
  { name: "USB-C Hub",            price: 1299, stock: 40 },
  { name: "1080p Webcam",         price: 2199, stock: 18 },
  { name: "Noise-Cancel Headset", price: 4999, stock: 9  },
  { name: "Portable SSD 1TB",     price: 6599, stock: 15 },
  { name: "Phone Stand",          price: 299,  stock: 80 },
  { name: "Laptop Sleeve 15\"",   price: 899,  stock: 33 },
  { name: "Smart Plug",           price: 999,  stock: 22 },
  { name: "LED Desk Lamp",        price: 1499, stock: 27 },
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected.");

  // Clean old
  await User.deleteMany({ email: { $in: vendors.map(v => v.email) } });
  await Product.deleteMany({}); 

  // Create vendors
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("password123", salt);

  const createdVendors = await User.insertMany(
    vendors.map(v => ({ name: v.name, email: v.email, password: passwordHash, role: "vendor" }))
  );
  console.log(`Created ${createdVendors.length} vendors.`);

  
  const productsToCreate = sampleProducts.map((p, i) => ({
    ...p,
    vendor: createdVendors[i % createdVendors.length]._id,
  }));

  await Product.insertMany(productsToCreate);
  console.log(`Inserted ${productsToCreate.length} products.`);

  console.log("Done.");
  await mongoose.disconnect();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
