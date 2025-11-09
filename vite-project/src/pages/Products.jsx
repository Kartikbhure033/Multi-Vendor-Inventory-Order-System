import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get("/products");
      setItems(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const ids = useMemo(() => items.map((p) => p.id), [items]);

  const pollStocks = async () => {
    if (!ids.length) return;
    try {
      const res = await API.get(`/products/stock`, { params: { ids: ids.join(",") } });
      const stockMap = res.data || {};
      setItems((prev) =>
        prev.map((p) =>
          stockMap[p.id] != null ? { ...p, stock: stockMap[p.id] } : p
        )
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(pollStocks, 10000);
    pollStocks();
    return () => clearInterval(timerRef.current);
  }, [ids.join(",")]);

  if (loading)
    return <div className="p-8 text-center text-gray-600 text-lg">Loading products…</div>;

  if (!items.length)
    return <div className="p-8 text-center text-gray-600 text-lg">No products found.</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Products</h2>
      

      {/* Header */}
      <div className="hidden md:grid grid-cols-5 gap-4 font-semibold border-b pb-2 text-gray-700">
        <div className="col-span-2">Product</div>
        <div>Vendor</div>
        <div>Price</div>
        <div className="text-right">Stock / Action</div>
      </div>

      {items.map((p) => {
        const out = (p.stock ?? 0) <= 0;
        return (
          <div
            key={p.id}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 py-4 border-b last:border-none items-center"
          >
            {/* Product Name + Image */}
            <div className="col-span-2 flex items-center gap-3">
              {p.image ? (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                />
              ) : null}
              <Link
                to={`/place-order/${p.id}`}
                className="font-medium text-gray-800 hover:text-indigo-600 transition"
              >
                {p.name}
              </Link>
            </div>

            {/* Vendor */}
            <div className="text-gray-700">{p.vendor}</div>

            {/* Price */}
            <div className="text-gray-800 font-medium">₹{p.price}</div>

            {/* Stock + Button */}
            <div className="flex justify-end items-center gap-3">
              <span className={`font-semibold ${out ? "text-red-600" : "text-gray-800"}`}>
                {out ? "Out" : p.stock}
              </span>

              <Link
                to={`/place-order/${p.id}`}
                title={out ? "Out of stock" : "Place order"}
                className={`px-3 py-1.5 rounded-lg text-sm transition shadow-sm ${
                  out
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed pointer-events-none"
                    : "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[.97]"
                }`}
              >
                Order
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
