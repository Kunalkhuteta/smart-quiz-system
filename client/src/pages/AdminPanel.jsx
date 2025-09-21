import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import ThemeToggle from "../components/ThemeToggle"; 
import { useTheme } from "../context/ThemeContext";
import ThemedButton from "../components/ThemedButton";

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

  // Delete user
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

  // Delete quiz attempt
  const handleDeleteAttempt = async (id) => {
  if (!window.confirm("Are you sure you want to delete this attempt?")) return;
  try {
    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/api/quiz/admin/attempts/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(res.data); // check response
    setAttempts(attempts.filter((a) => a._id !== id));
  } catch (err) {
    console.error("Delete attempt error:", err.response?.data || err.message);
    alert("Failed to delete attempt.");
  }
};


  const tableHeaderStyle = mode === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-300 text-gray-900";
  const tableRowHover = mode === "dark" ? "hover:bg-gray-700 transition-colors duration-200" : "hover:bg-gray-200 transition-colors duration-200";
  const tableRowBg = mode === "dark" ? "bg-gray-800" : "bg-gray-100";
  const tableBorder = mode === "dark" ? "divide-gray-700" : "divide-gray-400";

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${mode === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛠️ Admin Panel</h1>
        <ThemeToggle />
      </div>

      {loading ? (
        <>
          {/* Skeleton loaders */}
          {/* Users Skeleton */}
          <div className={`p-6 rounded-xl shadow-md mb-10 ${tableRowBg}`}>
            <h2 className={`text-2xl font-semibold mb-4 pb-2 border-b ${tableBorder}`}>👥 All Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead>
                  <tr className={tableHeaderStyle}>
                    <th className="px-4 py-2 text-left">👤 Name</th>
                    <th className="px-4 py-2 text-left">📧 Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">🛡️ Admin</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tableBorder}`}>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2"><Skeleton variant="text" width={100} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                      <td className="px-4 py-2"><Skeleton variant="text" width={180} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                      <td className="px-4 py-2"><Skeleton variant="text" width={80} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                      <td className="px-4 py-2"><Skeleton variant="text" width={60} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                      <td className="px-4 py-2"><Skeleton variant="text" width={80} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attempts Skeleton */}
          <div className={`p-6 rounded-xl shadow-md ${tableRowBg}`}>
            <h2 className={`text-2xl font-semibold mb-4 pb-2 border-b ${tableBorder}`}>📊 All Quiz Attempts</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead>
                  <tr className={tableHeaderStyle}>
                    <th className="px-4 py-2 text-left">👤 Username</th>
                    <th className="px-4 py-2 text-left">✅ Score</th>
                    <th className="px-4 py-2 text-left">📌 Total</th>
                    <th className="px-4 py-2 text-left">📅 Submitted</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tableBorder}`}>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-2"><Skeleton variant="text" width={120} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                      <td className="px-4 py-2"><Skeleton variant="text" width={60} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                      <td className="px-4 py-2"><Skeleton variant="text" width={60} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                      <td className="px-4 py-2"><Skeleton variant="text" width={140} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                      <td className="px-4 py-2"><Skeleton variant="text" width={80} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Users Table */}
          <div className={`p-6 rounded-xl shadow-md mb-10 ${tableRowBg}`}>
            <h2 className={`text-2xl font-semibold mb-4 pb-2 border-b ${tableBorder}`}>👥 All Users</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead>
                  <tr className={tableHeaderStyle}>
                    <th className="px-4 py-2 text-left">👤 Name</th>
                    <th className="px-4 py-2 text-left">📧 Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">🛡️ Admin</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tableBorder}`}>
                  {users.map((u, i) => (
                    <tr key={i} className={tableRowHover}>
                      <td className="px-4 py-2">{u.name}</td>
                      <td className="px-4 py-2">{u.email}</td>
                      <td className="px-4 py-2">{u.role}</td>
                      <td className="px-4 py-2">{u.isAdmin ? "✅ Yes" : "❌ No"}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <ThemedButton
                          variant="default"
                          className="bg-red-600 hover:bg-red-500"
                          onClick={() => handleDeleteUser(u._id)}
                        >
                          Delete
                        </ThemedButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attempts Table */}
          <div className={`p-6 rounded-xl shadow-md ${tableRowBg}`}>
            <h2 className={`text-2xl font-semibold mb-4 pb-2 border-b ${tableBorder}`}>📊 All Quiz Attempts</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y">
                <thead>
                  <tr className={tableHeaderStyle}>
                    <th className="px-4 py-2 text-left">👤 Username</th>
                    <th className="px-4 py-2 text-left">✅ Score</th>
                    <th className="px-4 py-2 text-left">📌 Total</th>
                    <th className="px-4 py-2 text-left">📅 Submitted</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${tableBorder}`}>
                  {attempts.map((a, i) => (
                    <tr key={i} className={tableRowHover}>
                      <td className="px-4 py-2">{a.username}</td>
                      <td className="px-4 py-2">{a.score}</td>
                      <td className="px-4 py-2">{a.total}</td>
                      <td className="px-4 py-2">{new Date(a.submittedAt).toLocaleString()}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <ThemedButton
                          variant="default"
                          className="bg-red-600 hover:bg-red-500"
                          onClick={() => handleDeleteAttempt(a._id)}
                        >
                          Delete
                        </ThemedButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
