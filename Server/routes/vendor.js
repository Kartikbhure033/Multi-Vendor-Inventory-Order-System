const express = require("express");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const Product = require("../models/Product");
const Order = require("../models/Order");

const router = express.Router();



// GET /api/vendor/me/products
router.get("/me/products", auth, requireRole("vendor"), async (req, res) => {
  const products = await Product.find({ vendor: req.user.id })
    .select("name price stock image createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();

  res.json(products.map(p => ({
    id: p._id, name: p.name, price: p.price, stock: p.stock, image: p.image || null,
    createdAt: p.createdAt, updatedAt: p.updatedAt
  })));
});

// POST /api/vendor/me/products
router.post("/me/products", auth, requireRole("vendor"), async (req, res) => {
  const { name, price, stock, image } = req.body || {};
  if (!name || price == null || stock == null) {
    return res.status(400).json({ msg: "name, price, stock are required" });
  }
  const doc = await Product.create({
    name: String(name).trim(),
    price: Number(price),
    stock: Number(stock),
    image: image || undefined,
    vendor: req.user.id,
  });
  res.status(201).json({
    id: doc._id, name: doc.name, price: doc.price, stock: doc.stock, image: doc.image || null
  });
});

// PATCH /api/vendor/me/products/:id
router.patch("/me/products/:id", auth, requireRole("vendor"), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: "Invalid product id" });

  const { name, price, stock, image } = req.body || {};
  const update = {};
  if (name != null) update.name = String(name).trim();
  if (price != null) update.price = Number(price);
  if (stock != null) update.stock = Number(stock);
  if (image !== undefined) update.image = image || undefined;

  const doc = await Product.findOneAndUpdate(
    { _id: id, vendor: req.user.id },
    { $set: update },
    { new: true }
  ).lean();

  if (!doc) return res.status(404).json({ msg: "Product not found" });
  res.json({ id: doc._id, name: doc.name, price: doc.price, stock: doc.stock, image: doc.image || null });
});

// DELETE /api/vendor/me/products/:id
router.delete("/me/products/:id", auth, requireRole("vendor"), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: "Invalid product id" });

  const del = await Product.deleteOne({ _id: id, vendor: req.user.id });
  if (del.deletedCount === 0) return res.status(404).json({ msg: "Product not found" });
  res.json({ ok: true });
});



// GET /api/vendor/me/orders
router.get("/me/orders", auth, requireRole("vendor"), async (req, res) => {
  const orders = await Order.find({ vendor: req.user.id })
    .sort({ createdAt: -1 })
    .populate({ path: "product", select: "name image" })
    .populate({ path: "buyer", select: "name" })
    .lean();

  res.json(orders.map(o => ({
    id: o._id,
    product: o.product ? { id: o.product._id, name: o.product.name, image: o.product.image || null } : null,
    buyer: o.buyer ? { id: o.buyer._id, name: o.buyer.name } : null,
    qty: o.qty,
    price: o.price,
    amount: o.amount,
    status: o.status,
    createdAt: o.createdAt
  })));
});

// PATCH /api/vendor/me/orders/:id  { status: "fulfilled" | "cancelled" }
router.patch("/me/orders/:id", auth, requireRole("vendor"), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!mongoose.isValidObjectId(id)) return res.status(400).json({ msg: "Invalid order id" });
  if (!["fulfilled", "cancelled"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  // If cancelling, return stock
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const order = await Order.findOne({ _id: id, vendor: req.user.id }).session(session);
      if (!order) return res.status(404).json({ msg: "Order not found" });

      if (order.status !== "placed") {
        return res.status(400).json({ msg: `Order already ${order.status}` });
      }

      // If cancelled -> return stock to product
      if (status === "cancelled") {
        await Product.updateOne(
          { _id: order.product },
          { $inc: { stock: order.qty } }
        ).session(session);
      }

      order.status = status;
      await order.save({ session });

      res.json({ ok: true, id: order._id, status: order.status });
    });
  } catch (e) {
    console.error("VENDOR UPDATE ORDER STATUS:", e);
    res.status(500).json({ msg: "Server error" });
  } finally {
    session.endSession();
  }
});

module.exports = router;
