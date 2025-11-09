// models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String }, // optional
  },
  { timestamps: true }
);

ProductSchema.index({ name: 1, vendor: 1 });

module.exports = mongoose.model("Product", ProductSchema);
