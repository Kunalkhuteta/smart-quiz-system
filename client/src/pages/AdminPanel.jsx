import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

        setLoading(false);
      } catch (error) {
        console.error("❌ Admin Fetch Error:", error.response?.data || error.message);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <p className="text-gray-300 text-center mt-10">Loading admin data...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">🛠️ Admin Panel</h1>

      {/* Users Section */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md mb-10">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-2">👥 All Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2 text-left">👤 Name</th>
                <th className="px-4 py-2 text-left">📧 Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">🛡️ Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((u, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">{u.isAdmin ? "✅ Yes" : "❌ No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attempts Section */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-2">📊 All Quiz Attempts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2 text-left">👤 Username</th>
                <th className="px-4 py-2 text-left">✅ Score</th>
                <th className="px-4 py-2 text-left">📌 Total</th>
                <th className="px-4 py-2 text-left">📅 Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {attempts.map((a, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-4 py-2">{a.username}</td>
                  <td className="px-4 py-2">{a.score}</td>
                  <td className="px-4 py-2">{a.total}</td>
                  <td className="px-4 py-2">{new Date(a.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
