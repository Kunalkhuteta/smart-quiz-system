import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // optional theme context
import ThemeToggle from "../components/ThemeToggle"; // MUI switch toggle

const Register = () => {
  const { mode } = useTheme(); // dark/light mode
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState("");
  const [referredBy, setReferredBy] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      setMsg("⚠️ Please select a role");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/register`,
        {
          ...user,
          role,
          referralId: role === "student" ? referredBy : null,
        }
      );
      setMsg(res.data.message || "✅ Registered successfully");
      setUser({ name: "", email: "", password: "" });
      setRole("");
      setReferredBy("");
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 ${
        mode === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* Theme Toggle Switch */}
      <div className="self-end mb-4">
        <ThemeToggle />
      </div>

      <div className={`w-full max-w-md p-8 rounded-xl shadow-lg ${
        mode === "dark" ? "bg-gray-800" : "bg-gray-100"
      }`}>
        <h2 className="text-2xl font-bold mb-6 text-center">🔐 Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={handleChange}
            required
            className={`w-full p-3 rounded border focus:outline-none focus:ring-2 ${
              mode === "dark" ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500" : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-blue-400"
            }`}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
            className={`w-full p-3 rounded border focus:outline-none focus:ring-2 ${
              mode === "dark" ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500" : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-blue-400"
            }`}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
            className={`w-full p-3 rounded border focus:outline-none focus:ring-2 ${
              mode === "dark" ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500" : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-blue-400"
            }`}
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className={`w-full p-3 rounded border focus:outline-none focus:ring-2 ${
              mode === "dark" ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500" : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-blue-400"
            }`}
          >
            <option value="">Select Role</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          {role === "student" && (
            <input
              type="text"
              placeholder="Enter referral ID from your teacher"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value)}
              required
              className={`w-full p-3 rounded border focus:outline-none focus:ring-2 ${
                mode === "dark" ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500" : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-blue-400"
              }`}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white font-semibold shadow transition ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        {msg && (
          <p className={`mt-4 text-center font-semibold ${msg.includes("✅") ? "text-green-400" : "text-red-400"}`}>
            {msg}
          </p>
        )}

        <div className="mt-6 text-center">
          <span className={`mr-2 ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>Already registered?</span>
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
