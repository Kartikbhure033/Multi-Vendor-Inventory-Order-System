import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api";

async function fetchProduct(productId) {
  try {
    const res = await API.get(`/products/${productId}`);
    return res.data;
  } catch {
    const all = await API.get("/products");
    return all.data.find(p => p.id === productId) || null;
  }
}

export default function PlaceOrder() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const p = await fetchProduct(productId);
        if (!alive) return;
        if (!p) setError("Product not found");
        else {
          setProduct(p);
          setQty(1);
        }
      } catch {
        setError("Failed to load product");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [productId]);

  const maxQty = useMemo(() => Math.max(0, product?.stock ?? 0), [product]);
  const total = useMemo(() => (product ? product.price * qty : 0), [product, qty]);

  const clampQty = (n) => {
    if (!Number.isFinite(n)) return 1;
    n = Math.floor(n);
    if (n < 1) return 1;
    if (maxQty > 0 && n > maxQty) return maxQty;
    return n;
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!product) return;
    if (maxQty <= 0) return setError("Out of stock");

    const safeQty = clampQty(Number(qty));
    if (safeQty <= 0) return setError("Quantity must be at least 1");

    try {
      setPlacing(true);
      setError("");
      const res = await API.post("/orders", { productId: product.id, quantity: safeQty });
      navigate("/orders", { state: { flash: `Order placed! #${res.data.id} (₹${res.data.amount})` } });
    } catch (e) {
      setError(e.response?.data?.msg || "Order failed");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-600 text-lg">Loading…</div>;
  if (error) return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold mb-2">Place Order</h2>
      <p className="text-red-600">{error}</p>
    </div>
  );
  if (!product) return null;

  const out = maxQty <= 0;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Place Order</h2>

      <div className="space-y-3">
        <div className="text-2xl font-bold">{product.name}</div>
        <div className="text-gray-600">Vendor: {product.vendor}</div>
        <div className="text-xl">Price: ₹{product.price}</div>
        <div className={`font-semibold ${out ? "text-red-600" : "text-gray-800"}`}>
          {out ? "Out of stock" : `In stock: ${product.stock}`}
        </div>
      </div>

      <form onSubmit={placeOrder} className="mt-6 space-y-5">
        <div className="space-y-1">
          <label className="text-sm font-medium">Quantity</label>
          <input
            type="number"
            min={1}
            max={maxQty || undefined}
            value={qty}
            onChange={(e) => setQty(clampQty(Number(e.target.value)))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          {maxQty > 0 && <small className="text-gray-500 text-sm">Max: {maxQty}</small>}
        </div>

        <div className="text-lg font-medium">
          Total: <span className="font-semibold text-indigo-600">₹{total}</span>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={placing || out}
            className={`px-4 py-2 rounded-lg text-white transition ${
              out
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 active:scale-[.97]"
            }`}
          >
            {placing ? "Placing…" : "Place Order"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 active:scale-[.97] transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
