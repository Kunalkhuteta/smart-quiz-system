import React, { useEffect, useState } from "react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { mode } = useTheme();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/quiz/leaderboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(res.data);
      } catch (err) {
        console.error("❌ Leaderboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const bgColor = mode === "dark" ? "bg-gray-800" : "bg-gray-100";
  const headerBg = mode === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-300 text-gray-900";
  const rowHover = mode === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200";

  const rankColor = (rank) => {
    if (rank === 1) return "text-yellow-400 font-bold"; // Gold
    if (rank === 2) return "text-gray-300 font-bold";  // Silver
    if (rank === 3) return "text-amber-600 font-bold"; // Bronze
    return "";
  };

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${mode === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>

      <h1 className="text-3xl font-bold mb-8 text-center">🏆 Quiz Leaderboard</h1>

      <div className={`${bgColor} p-6 rounded-2xl shadow-lg overflow-x-auto`}>
        <table className="min-w-full divide-y divide-gray-700">
          <thead className={`${headerBg}`}>
            <tr>
              <th className="px-4 py-3 text-left">🏅 Rank</th>
              <th className="px-4 py-3 text-left">👤 Username</th>
              <th className="px-4 py-3 text-left">📊 Total Score</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className={rowHover}>
                  <td className="px-4 py-2">
                    <Skeleton width={30} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton width={100} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton width={60} height={20} sx={{ bgcolor: mode === "dark" ? "grey.800" : "grey.300" }} />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-4 py-4 text-center text-gray-500">
                  No leaderboard data available.
                </td>
              </tr>
            ) : (
              data.map((entry, index) => (
                <tr
                  key={entry.userId}
                  className={`transition-transform duration-150 rounded-lg ${rowHover}`}
                >
                  <td className={`px-4 py-2 ${rankColor(index + 1)}`}>#{index + 1}</td>
                  <td className="px-4 py-2">{entry.username}</td>
                  <td className="px-4 py-2">{entry.totalScore}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
