import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import ThemeToggle from "../components/ThemeToggle"; 
import { useTheme } from "../context/ThemeContext";
import ThemedButton from "../components/ThemedButton";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useTheme();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      const usersRes = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/quiz/admin/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(usersRes.data);

      const attemptsRes = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/quiz/admin/attempts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttempts(attemptsRes.data.attempts);

    } catch (error) {
      console.error("❌ Admin Fetch Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/quiz/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.filter((u) => u._id !== id));
      alert("User deleted successfully ✅");
    } catch (err) {
      console.error("Delete User Error:", err.response?.data || err.message);
      alert("Failed to delete user ❌");
    }
  };

  const handleDeleteAttempt = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attempt?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/api/quiz/admin/attempts/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttempts(attempts.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Delete attempt error:", err.response?.data || err.message);
      alert("Failed to delete attempt.");
    }
  };

  return (
    <div className={`admin-wrapper ${mode}-mode`}>
      <div className="admin-header">
        <h1>🛠️ Admin Panel</h1>
        <ThemeToggle />
      </div>

      {loading ? (
        <div className="admin-content">
          {/* Users Skeleton */}
          <div className="admin-card">
            <h2>👥 All Users</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead className="table-header">
                  <tr>
                    <th>👤 Name</th>
                    <th>📧 Email</th>
                    <th>Role</th>
                    <th>🛡️ Admin</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(5)].map((_, j) => (
                        <td key={j}><Skeleton variant="text" width={80 + j*20} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attempts Skeleton */}
          <div className="admin-card">
            <h2>📊 All Quiz Attempts</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead className="table-header">
                  <tr>
                    <th>👤 Username</th>
                    <th>✅ Score</th>
                    <th>📌 Total</th>
                    <th>📅 Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(5)].map((_, j) => (
                        <td key={j}><Skeleton variant="text" width={60 + j*20} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-content">
          {/* Users Table */}
          <div className="admin-card">
            <h2>👥 All Users</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead className="table-header">
                  <tr>
                    <th>👤 Name</th>
                    <th>📧 Email</th>
                    <th>Role</th>
                    <th>🛡️ Admin</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i} className="table-row">
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.isAdmin ? "✅ Yes" : "❌ No"}</td>
                      <td>
                        <ThemedButton className="btn-delete" onClick={() => handleDeleteUser(u._id)}>Delete</ThemedButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attempts Table */}
          <div className="admin-card">
            <h2>📊 All Quiz Attempts</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead className="table-header">
                  <tr>
                    <th>👤 Username</th>
                    <th>✅ Score</th>
                    <th>📌 Total</th>
                    <th>📅 Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a, i) => (
                    <tr key={i} className="table-row">
                      <td>{a.username}</td>
                      <td>{a.score}</td>
                      <td>{a.total}</td>
                      <td>{new Date(a.submittedAt).toLocaleString()}</td>
                      <td>
                        <ThemedButton className="btn-delete" onClick={() => handleDeleteAttempt(a._id)}>Delete</ThemedButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
