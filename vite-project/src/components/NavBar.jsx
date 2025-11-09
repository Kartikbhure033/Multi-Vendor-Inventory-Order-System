// NavBar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            to="/"
            className="text-xl font-extrabold tracking-tight hover:opacity-80 transition"
          >
            Multivendor<span className="text-indigo-600"> Inventory</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/products"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Products
            </Link>

            {user?.role === "user" && (
              <Link
                to="/orders"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                My Orders
              </Link>
            )}

            {user?.role === "vendor" && (
              <Link
                to="/vendor"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Vendor Dashboard
              </Link>
            )}

            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Hi <span className="font-medium">{user.name}</span>{" "}
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 ml-1">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={onLogout}
                  className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 active:scale-[.98] transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 transition"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="rounded-xl bg-indigo-600 text-white px-3 py-1.5 text-sm hover:bg-indigo-500 shadow-sm active:scale-[.98] transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-gray-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              {open ? (
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white/90 backdrop-blur">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/products"
              className="block rounded-lg px-3 py-2 hover:bg-gray-100"
              onClick={() => setOpen(false)}
            >
              Products
            </Link>

            {user?.role === "user" && (
              <Link
                to="/orders"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                My Orders
              </Link>
            )}

            {user?.role === "vendor" && (
              <Link
                to="/vendor"
                className="block rounded-lg px-3 py-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Vendor Dashboard
              </Link>
            )}

            {user ? (
              <button
                onClick={() => {
                  setOpen(false);
                  onLogout?.();
                }}
                className="w-full text-left rounded-lg px-3 py-2 border border-gray-300 hover:bg-gray-50"
              >
                Logout ({user.name})
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center rounded-lg border border-gray-300 px-3 py-2 hover:bg-gray-50"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center rounded-lg bg-indigo-600 text-white px-3 py-2 hover:bg-indigo-500"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
