import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${productId}`);
      setProduct(res.data);
    } catch (e) {
      setError("Product not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [productId]);

  if (loading) return <div className="p-8 text-center text-gray-600 text-lg">Loading…</div>;
  if (error) return <div className="p-8 text-center text-red-600 text-lg">{error}</div>;
  if (!product) return null;

  const out = (product.stock ?? 0) <= 0;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-52 h-52 object-cover rounded-xl border border-gray-200 shadow-sm"
          />
        ) : (
          <div className="w-52 h-52 rounded-xl border border-dashed border-gray-400 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-gray-900">{product.name}</h2>

          <p className="text-gray-700">
            <span className="font-semibold">Vendor:</span> {product.vendor}
          </p>

          <p className="text-xl text-gray-800">
            <span className="font-semibold">Price:</span> ₹{product.price}
          </p>

          <p className={`font-semibold ${out ? "text-red-600" : "text-gray-800"}`}>
            {out ? "Out of stock" : `In stock: ${product.stock}`}
          </p>

          {!out && (
            <Link
              to={`/place-order/${product.id}`}
              className="inline-block px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 active:scale-[.97] transition shadow-sm mt-4"
            >
              Place Order
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
