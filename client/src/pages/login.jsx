import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/Login.css";

const Login = () => {
  const { mode } = useTheme();
  const [user, setUser] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/login`,
        user
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMsg("✅ Login successful!");
      navigate("/dashboard", { replace: true });
      window.location.reload();
    } catch (err) {
      setMsg(err.response?.data?.message || "❌ Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`login-bg min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-300 ${mode === "dark"
          ? "bg-gray-950 text-gray-100"
          : "bg-gray-100 text-gray-900"
        }`}
    >
      {/* Theme Toggle
      <div className="self-end mb-4">
        <ThemeToggle />
      </div> */}

      {/* Login Card */}
      <div
        className={`w-full max-w-md p-8 rounded-xl shadow-2xl backdrop-blur-md bg-opacity-80 ${mode === "dark" ? "bg-gray-800/90" : "bg-white/90"
          }`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
            className={`input-field ${mode === "dark"
                ? "bg-gray-700 text-gray-100 border-gray-600"
                : "bg-gray-100 text-gray-900 border-gray-300"
              }`}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
            className={`input-field ${mode === "dark"
                ? "bg-gray-700 text-gray-100 border-gray-600"
                : "bg-gray-100 text-gray-900 border-gray-300"
              }`}
          />


          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transform transition hover:scale-105 ${loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              }`}
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        {msg && (
          <p
            className={`mt-4 text-center font-medium transition ${msg.includes("✅") ? "text-green-400" : "text-red-400"
              }`}
          >
            {msg}
          </p>
        )}

        <div className="mt-6 text-center">
          <span
            className={`mr-2 ${mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
          >
            Not registered yet?
          </span>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 rounded-lg text-white font-semibold shadow-md transform transition hover:scale-105"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
