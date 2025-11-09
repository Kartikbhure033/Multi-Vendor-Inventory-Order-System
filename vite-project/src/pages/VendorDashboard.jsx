import React, { useState } from "react";
import VendorProducts from "./VendorProducts";
import VendorOrders from "./VendorOrders";

export default function VendorDashboard() {
  const [tab, setTab] = useState("products"); // "products" | "orders"

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Vendor Dashboard</h2>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition
            ${tab === "products"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            }`}
        >
          Products
        </button>

        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition
            ${tab === "orders"
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
            }`}
        >
          Orders
        </button>
      </div>

      {/* Content */}
      <div className="mt-4">
        {tab === "products" ? <VendorProducts /> : <VendorOrders />}
      </div>
    </div>
  );
}
