import React, { useEffect, useState } from "react";
import API from "../api";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/orders/me");
      setOrders(res.data || []);
    } catch (e) {
      setError(e.response?.data?.msg || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  if (loading)
    return (
      <div className="p-8 text-center text-gray-600 text-lg">
        Loading orders…
      </div>
    );

  if (error)
    return (
      <div className="p-8 text-center text-red-600 text-lg">
        {error}
      </div>
    );

  if (!orders.length)
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">My Orders</h2>
        <p className="text-gray-600">No orders yet.</p>
      </div>
    );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      {/* Header */}
      <div className="hidden md:grid grid-cols-6 gap-4 font-semibold border-b pb-2 text-gray-700">
        <div className="col-span-2">Product</div>
        <div>Vendor</div>
        <div>Vendor ID</div>
        <div>Qty</div>
        <div>Total</div>
      </div>

      {orders.map((o) => {
        const vendorId = o.vendor?.id || "-";
        return (
          <div
            key={o.id}
            className="grid grid-cols-1 md:grid-cols-6 gap-4 py-4 border-b last:border-none items-center"
          >
            {/* Product */}
            <div className="col-span-2 flex items-center gap-3">
              {o.product?.image && (
                <img
                  src={o.product.image}
                  alt={o.product.name}
                  className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                />
              )}
              <div>
                <p className="font-semibold text-gray-800">
                  {o.product?.name || "Deleted product"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Vendor Name */}
            <div className="text-gray-700">{o.vendor?.name || "-"}</div>

            {/* Vendor ID + Copy */}
            <div className="flex items-center gap-2">
              <code className="px-2 py-1 bg-gray-100 rounded text-xs break-all">
                {vendorId}
              </code>
              {vendorId !== "-" && (
                <button
                  onClick={() => copy(vendorId)}
                  className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-100 active:scale-[.96] transition"
                >
                  Copy
                </button>
              )}
            </div>

            {/* Qty */}
            <div className="text-gray-800">{o.qty}</div>

            {/* Total + Status */}
            <div className="text-gray-800">
              <div>₹{o.amount}</div>
              <div className="text-xs capitalize font-semibold text-indigo-600">
                {o.status}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
