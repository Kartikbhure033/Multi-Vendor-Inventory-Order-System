import React, { useEffect, useState } from "react";
import API from "../api";

function ProductForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial || { name: "", price: "", stock: "", image: "" });
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (initial?.id) {
        const res = await API.patch(`/vendor/me/products/${initial.id}`, {
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          image: form.image || undefined,
        });
        onSaved?.(res.data);
      } else {
        const res = await API.post(`/vendor/me/products`, {
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          image: form.image || undefined,
        });
        onSaved?.(res.data);
      }
    } catch (e) {
      alert(e.response?.data?.msg || "Save failed");
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3 max-w-xl bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
      <div className="grid gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Name"
          className="h-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="grid gap-1 sm:grid-cols-2 sm:gap-3">
        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={onChange}
            placeholder="Price"
            className="h-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Stock</label>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={onChange}
            placeholder="Stock"
            className="h-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Image URL (optional)</label>
        <input
          name="image"
          value={form.image}
          onChange={onChange}
          placeholder="https://…"
          className="h-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-blue-700 active:scale-[.99] transition"
        >
          {initial?.id ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-xl border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function VendorProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // product | null
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await API.get("/vendor/me/products");
      setItems(res.data || []);
    } catch (e) {
      alert(e.response?.data?.msg || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/vendor/me/products/${id}`);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e.response?.data?.msg || "Delete failed");
    }
  };

  const onSaved = (p) => {
    setCreating(false);
    setEditing(null);
    setItems((prev) => {
      const i = prev.findIndex((x) => x.id === p.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = p;
        return copy;
      }
      return [p, ...prev];
    });
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-4 sm:p-6">
      {/* Header / Actions */}
      {creating ? (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">New Product</h3>
          <ProductForm onCancel={() => setCreating(false)} onSaved={onSaved} />
        </div>
      ) : editing ? (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">Edit Product</h3>
          <ProductForm initial={editing} onCancel={() => setEditing(null)} onSaved={onSaved} />
        </div>
      ) : (
        <div className="mb-3">
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 active:scale-[.99] transition"
          >
            <span className="text-lg leading-none">＋</span> Add Product
          </button>
        </div>
      )}

      {/* Empty state */}
      {!items.length ? (
        <p className="text-gray-600 dark:text-gray-300">No products yet.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          {/* Header row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-4 sm:px-6 py-3 text-sm font-semibold border-b border-gray-200 dark:border-gray-800">
            <div>Product</div>
            <div>Price</div>
            <div>Stock</div>
            <div className="text-right">Actions</div>
          </div>

          {/* Rows */}
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {items.map((p) => (
              <li
                key={p.id}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center px-4 sm:px-6 py-4"
              >
                {/* Product cell */}
                <div className="flex items-center gap-3 min-w-0">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-12 w-12 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-gray-800"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-xl ring-1 ring-gray-200 dark:ring-gray-800 bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-500">
                      No img
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      Updated: {new Date(p.updatedAt || p.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="font-medium">₹{p.price}</div>

                {/* Stock */}
                <div className="font-medium">{p.stock}</div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditing(p)}
                    className="rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="rounded-xl border border-red-300 text-red-700 dark:border-red-700 px-3 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
