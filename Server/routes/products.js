// routes/products.js
const express = require("express");
const Product = require("../models/Product");
const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({ path: "vendor", select: "name role", match: { role: "vendor" } })
      .select("name price stock vendor image")
      .lean();

    res.json(
      products.map(p => ({
        id: p._id,
        name: p.name,
        price: p.price,
        stock: p.stock,
        vendor: p.vendor ? p.vendor.name : "Unknown vendor",
        image: p.image || null
      }))
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
});


router.get("/stock", async (req, res) => {
  try {
    const ids = (req.query.ids || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    if (!ids.length) return res.json({});

    const docs = await Product.find({ _id: { $in: ids } }).select("_id stock").lean();
    const map = {};
    docs.forEach(d => (map[d._id] = d.stock));
    res.json(map);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
