import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // dark/light mode
import ThemeToggle from "../components/ThemeToggle"; // MUI switch toggle

const Login = () => {
  const { mode } = useTheme(); // dark or light mode
  const [user, setUser] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      // Clear previous login data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/login`, user);

      // Store token & user in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMsg("✅ Login successful!");
      navigate("/dashboard", { replace: true }); // ensure reload dashboard with new user
      window.location.reload(); // forces reading the new user from localStorage
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${
        mode === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      {/* Theme Toggle Switch */}
      <div className="self-end mb-4">
        <ThemeToggle />
      </div>

      <div
        className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-colors duration-300 ${
          mode === "dark" ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <h2 className="text-2xl font-bold mb-6 text-center">🔐 Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
            className={`w-full p-3 rounded border focus:outline-none focus:ring-2 transition-colors duration-300 ${
              mode === "dark"
                ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500"
                : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-blue-400"
            }`}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
            className={`w-full p-3 rounded border focus:outline-none focus:ring-2 transition-colors duration-300 ${
              mode === "dark"
                ? "bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-500"
                : "bg-gray-200 text-gray-900 border-gray-300 focus:ring-blue-400"
            }`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white font-semibold shadow transition-colors duration-300 ${
              loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {msg && (
          <p
            className={`mt-4 text-center font-semibold transition-colors duration-300 ${
              msg.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {msg}
          </p>
        )}

        <div className="mt-6 text-center">
          <span className={`mr-2 transition-colors duration-300 ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Not registered yet?
          </span>
          <button
            onClick={() => navigate("/register")}
            className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded text-white font-semibold transition-colors duration-300"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
