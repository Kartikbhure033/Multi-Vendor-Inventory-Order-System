// Home.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Home({ user }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-indigo-50 flex items-center">
      <div className="mx-auto max-w-7xl px-4 w-full">
        {/* Centered Hero */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-white/80 backdrop-blur p-10 shadow-xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-block rounded-full border border-indigo-200 px-3 py-1 text-xs font-medium text-indigo-700 mb-4">
              Welcome
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Welcome to <span className="text-indigo-600">Multivendor Inventory</span>
            </h1>
            <p className="mt-4 text-gray-600">
              {user
                ? user.role === "vendor"
                  ? "Vendor Dashboard: Manage your products here."
                  : "User Dashboard: Browse and buy products."
                : "Please login or register to start shopping."}
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                to="/products"
                className="rounded-xl bg-indigo-600 text-white px-5 py-3 font-medium shadow hover:bg-indigo-500 active:scale-[.98] transition"
              >
                Explore Products
              </Link>

              {user ? (
                user.role === "vendor" ? (
                  <Link
                    to="/vendor"
                    className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50 transition"
                  >
                    Go to Vendor Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/orders"
                    className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50 transition"
                  >
                    My Orders
                  </Link>
                )
              ) : (
                <Link
                  to="/login"
                  className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50 transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Subtle decorative glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-200/40 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
