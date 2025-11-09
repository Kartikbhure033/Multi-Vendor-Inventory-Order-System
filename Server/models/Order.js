const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    buyer:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    product:  { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    qty:      { type: Number, min: 1, required: true },
    price:    { type: Number, min: 0, required: true }, // snapshot at purchase
    amount:   { type: Number, min: 0, required: true },

    status: { type: String, enum: ["placed", "fulfilled", "cancelled"], default: "placed" },
    notes:  { type: String },
  },
  { timestamps: true }
);

// Helpful indexes
OrderSchema.index({ buyer: 1, createdAt: -1 });
OrderSchema.index({ vendor: 1, createdAt: -1 });

module.exports = mongoose.model("Order", OrderSchema);
