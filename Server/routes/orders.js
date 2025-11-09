const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles"); // from earlier snippet
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();


router.post("/", auth, requireRole("user"), async (req, res) => {
  try {
    const { productId, quantity } = req.body || {};
    const qty = Number(quantity);

    if (!mongoose.isValidObjectId(productId))
      return res.status(400).json({ msg: "Invalid productId" });
    if (!Number.isInteger(qty) || qty <= 0)
      return res.status(400).json({ msg: "Quantity must be a positive integer" });

    const product = await Product.findById(productId)
      .populate({ path: "vendor", select: "_id role name" })
      .lean();

    if (!product) return res.status(404).json({ msg: "Product not found" });
    if (product.vendor?.role !== "vendor")
      return res.status(400).json({ msg: "Product vendor is invalid" });

    if (String(product.vendor._id) === String(req.user.id))
      return res.status(403).json({ msg: "Vendors cannot order their own products" });

    const dec = await Product.updateOne(
      { _id: product._id, stock: { $gte: qty } },
      { $inc: { stock: -qty } }
    );

    if (dec.modifiedCount === 0) {
      return res.status(400).json({ msg: "Insufficient stock" });
    }

    const price = Number(product.price);
    const order = await Order.create({
      buyer: req.user.id,
      vendor: product.vendor._id,
      product: product._id,
      qty,
      price,
      amount: price * qty,
    });

    return res.status(201).json({
      id: order._id, qty: order.qty, amount: order.amount,
      product: { id: product._id, name: product.name },
    });
  } catch (e) {
    console.error("PLACE ORDER ERROR:", e); // <— see server logs
    return res.status(500).json({ msg: "Server error", detail: e.message });
  }
});


router.get("/me", auth, requireRole("user"), async (req, res) => {
  const orders = await Order.find({ buyer: req.user.id })
    .sort({ createdAt: -1 })
    .populate({ path: "product", select: "name image" })
    .populate({ path: "vendor",  select: "name" })
    .lean();

  res.json(orders.map(o => ({
    id: o._id,
    product: o.product ? { id: o.product._id, name: o.product.name, image: o.product.image || null } : null,
    vendor:  o.vendor ? { id: o.vendor._id, name: o.vendor.name } : null,
    qty: o.qty,
    price: o.price,
    amount: o.amount,
    status: o.status,
    createdAt: o.createdAt,
  })));
});

module.exports = router;
