import React, { useState } from "react";
import API from "../api";

export default function BuyButton({ product, onPlaced }) {
  const [loading, setLoading] = useState(false);

  const place = async () => {
    const raw = window.prompt(`Quantity for "${product.name}"?`, "1");
    if (!raw) return;
    const qty = parseInt(raw, 10);
    if (!Number.isInteger(qty) || qty <= 0) {
      alert("Enter a valid quantity.");
      return;
    }
    if (qty > (product.stock ?? 0)) {
      alert("Quantity exceeds available stock.");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/orders", { productId: product.id, quantity: qty });
      const data = res.data;
      alert(`✅ Order placed!\nOrder ID: ${data.id}\nTotal: ₹${data.amount}`);
      onPlaced?.(qty, data);
    } catch (e) {
      alert(e.response?.data?.msg || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || (product.stock ?? 0) <= 0;

  return (
    <button
      onClick={place}
      disabled={disabled}
      title={disabled ? "Out of stock" : "Buy"}
      className={`
        px-4 py-2 rounded-lg text-sm font-medium transition-all select-none
        ${disabled 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[.97] shadow-sm"
        }
      `}
    >
      {loading ? "Placing..." : (product.stock ?? 0) <= 0 ? "Out of Stock" : "Buy"}
    </button>
  );
}
