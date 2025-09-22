import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/Register.css";

const Register = () => {
  const { mode } = useTheme();
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
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/register`, {
        ...user,
        role,
        referralId: role === "student" ? referredBy : null,
      });
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
    <div className={`register-page ${mode === "dark" ? "dark" : "light"}`}>
      {/* <div className="theme-toggle-wrapper">
        <ThemeToggle />
      </div> */}

      <div className="register-card">
        <h2 className="register-title">Sign Up</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={user.name}
            onChange={handleChange}
            required
            className="register-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={user.email}
            onChange={handleChange}
            required
            className="register-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={user.password}
            onChange={handleChange}
            required
            className="register-input"
          />

          <select value={role} onChange={(e) => setRole(e.target.value)} required className="register-input">
            <option value="">Select Role</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          {role === "student" && (
            <input
              type="text"
              placeholder="Referral ID from your teacher"
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value)}
              required
              className="register-input"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold shadow-md transform transition hover:scale-105 ${loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              }`}
          >
            {loading ? "Registering" : "Sign Up"}
          </button>
        </form>

        {msg && <p className={`register-msg ${msg.includes("✅") ? "success" : "error"}`}>{msg}</p>}

        <div className="register-footer">
          <span
            className={`mr-2 ${mode === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
          > Already registered?</span>
          <button onClick={() => navigate("/login")} className="register-login-btn">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
