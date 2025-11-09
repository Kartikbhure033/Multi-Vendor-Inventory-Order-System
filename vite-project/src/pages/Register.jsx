import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Register({ setUser }) {
  const [step, setStep] = useState("choose");
  const [role, setRole] = useState("user");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", { ...form, role });
      const u = res.data.user;
      setUser(u);

      if (u.role === "vendor") navigate("/vendor");
      else navigate("/products");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  // STEP 1: Choose Role
  if (step === "choose")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-indigo-50 px-4">
        <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-indigo-100 text-center space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Register</h2>

          <div className="space-y-3">
            <button
              onClick={() => { setRole("user"); setStep("form"); }}
              className="w-full py-3 rounded-xl border border-gray-300 hover:bg-gray-50 active:scale-[.98] transition font-medium"
            >
              Register as User
            </button>

            <button
              onClick={() => { setRole("vendor"); setStep("form"); }}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[.98] transition font-medium shadow-sm"
            >
              Register as Vendor
            </button>
          </div>
        </div>
      </div>
    );

  // STEP 2: Fill Form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-indigo-50 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-indigo-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register as {role}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 outline-none transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 outline-none transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 outline-none transition"
          />

          {error && (
            <p className="text-sm text-red-600 font-medium text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 shadow-sm active:scale-[.98] transition"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 font-medium hover:text-indigo-500"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
