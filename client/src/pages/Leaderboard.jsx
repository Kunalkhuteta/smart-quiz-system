import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/quiz/leaderboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Leaderboard fetch failed:", err);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p className="text-gray-300 text-center mt-10">Loading leaderboard...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">🏆 Quiz Leaderboard</h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">🏅 Rank</th>
              <th className="px-4 py-2 text-left">👤 Username</th>
              <th className="px-4 py-2 text-left">📊 Total Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((entry, index) => (
              <tr key={entry.userId} className="hover:bg-gray-700">
                <td className="px-4 py-2">#{index + 1}</td>
                <td className="px-4 py-2">{entry.username}</td>
                <td className="px-4 py-2">{entry.totalScore}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <p className="text-gray-400 mt-4 text-center">No leaderboard data available.</p>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
