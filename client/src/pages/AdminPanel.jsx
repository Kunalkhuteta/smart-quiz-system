import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token =localStorage.getItem("token");

        const usersRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersRes.data);

        const attemptsRes = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/admin/attempts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttempts(attemptsRes.data.attempts);
      } catch (error) {
        console.error("❌ Admin Fetch Error:", error.response?.data || error.message);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🛠️ Admin Panel</h1>

      {/* Users Section */}
      <div style={styles.section}>
        <h2 style={styles.subheading}>👥 All Users</h2>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>👤 Name</th>
                <th style={styles.th}>📧 Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>🛡️ Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={index}>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>{u.role}</td>
                  <td style={styles.td}>{u.isAdmin ? "✅ Yes" : "❌ No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attempts Section */}
      <div style={styles.section}>
        <h2 style={styles.subheading}>📊 All Quiz Attempts</h2>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>👤 Username</th>
                <th style={styles.th}>✅ Score</th>
                <th style={styles.th}>📌 Total</th>
                <th style={styles.th}>📅 Submitted</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a, index) => (
                <tr key={index}>
                  <td style={styles.td}>{a.username}</td>
                  <td style={styles.td}>{a.score}</td>
                  <td style={styles.td}>{a.total}</td>
                  <td style={styles.td}>{new Date(a.submittedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ✨ Styles
const styles = {
  container: {
    padding: "30px",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f9fafb",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "32px",
    marginBottom: "30px",
    textAlign: "center",
    color: "#222",
  },
  section: {
    background: "#ffffff",
    padding: "20px 25px",
    borderRadius: "10px",
    marginBottom: "40px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
  },
  subheading: {
    fontSize: "24px",
    marginBottom: "15px",
    color: "#333",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "8px",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "16px",
  },
  th: {
    textAlign: "left",
    backgroundColor: "#4f46e5",
    color: "white",
    padding: "12px 15px",
    border: "1px solid #e5e7eb",
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#fff",
  },
};

export default AdminPanel;
