import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Leaderboard.css";

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ get JWT from storage
        console.log(token)
        const res = await axios.get( 
          `${process.env.REACT_APP_API_BASE_URL}/api/quiz/leaderboard`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ backend sends array, not { leaderboard: ... }
        setData(res.data);
      } catch (err) {
        console.error("❌ Leaderboard fetch failed:", err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>🏆 Quiz Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>🏅 Rank</th>
            <th>👤 Username</th>
            <th>📊 Score</th>
          </tr>
        </thead>
        <tbody>
  {data.map((entry, index) => (
    <tr key={entry.userId}>
      <td>#{index + 1}</td>
      <td>{entry.username}</td>
      <td>{entry.totalScore}</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default Leaderboard;
