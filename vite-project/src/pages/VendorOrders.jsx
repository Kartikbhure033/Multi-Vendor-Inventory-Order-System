import React, { useEffect, useState } from "react";
import API from "../api";

export default function VendorOrders() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/vendor/me/orders");
      setRows(res.data || []);
    } catch (e) {
      setError(e.response?.data?.msg || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await API.patch(`/vendor/me/orders/${id}`, { status });
      setRows(prev => prev.map(r => (r.id === id ? { ...r, status: res.data.status } : r)));
    } catch (e) {
      alert(e.response?.data?.msg || "Update failed");
    }
  };

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div style={{ color: "crimson" }}>{error}</div>;
  if (!rows.length) return <p>No orders yet.</p>;

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.2fr 2.2fr 0.8fr 0.9fr 1.1fr",
          gap: 12,
          fontWeight: 600,
          padding: "8px 0",
          borderBottom: "1px solid #ddd"
        }}
      >
        <div>Product</div>
        <div>Buyer</div>
        <div>Buyer ID</div>
        <div>Qty</div>
        <div>Total</div>
        <div>Status</div>
      </div>

      {rows.map(o => {
        const actionable = o.status === "placed";
        const buyerId = o.buyer?.id || "-";
        return (
          <div
            key={o.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.2fr 2.2fr 0.8fr 0.9fr 1.1fr",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid #eee",
              alignItems: "center"
            }}
          >
            {/* Product */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              {o.product?.image ? (
                <img
                  src={o.product.image}
                  alt={o.product.name}
                  style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }}
                />
              ) : null}
              <div>
                <div style={{ fontWeight: 600 }}>{o.product?.name || "Deleted product"}</div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  {new Date(o.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Buyer name */}
            <div>{o.buyer?.name || "-"}</div>

            {/* Buyer ID with copy */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <code style={{ fontSize: 12, background: "#f6f6f6", padding: "2px 6px", borderRadius: 4, wordBreak: "break-all" }}>
                {buyerId}
              </code>
              {buyerId !== "-" && (
                <button
                  onClick={() => copy(buyerId)}
                  title="Copy Buyer ID"
                  style={{ padding: "4px 8px" }}
                >
                  Copy
                </button>
              )}
            </div>

            {/* Qty */}
            <div>{o.qty}</div>

            {/* Total */}
            <div>₹{o.amount}</div>

            {/* Status + actions */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontWeight: 700, textTransform: "capitalize" }}>{o.status}</span>
              {actionable && (
                <>
                  <button onClick={() => updateStatus(o.id, "fulfilled")} style={{ padding: "6px 10px" }}>
                    Fulfill
                  </button>
                  <button
                    onClick={() => updateStatus(o.id, "cancelled")}
                    style={{ padding: "6px 10px", borderColor: "#c00", color: "#c00" }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
