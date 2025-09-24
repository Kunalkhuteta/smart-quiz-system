import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import ThemedButton from "../components/ThemedButton";
import "../styles/Attempts.css";
import { useLocation } from "react-router-dom";

const Attempts = () => {
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation(); // ✅
  const { mode } = useTheme();

  const fetchAttempts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/quiz/attempts`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttempts(res.data.attempts);
    } catch (err) {
      console.error("Failed to fetch attempts:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  // 🔹 Refetch whenever navigated from quiz submission
  useEffect(() => {
    if (location.state?.refresh) {
      fetchAttempts();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location]);

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 moving-bg ${
        mode === "dark"
          ? "dark-mode-bg text-gray-100"
          : "light-mode-bg text-gray-900"
      }`}
    >
      {/* Theme toggle button */}
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Animated heading */}
        <h2 className="attempts-heading text-4xl font-extrabold mb-8 text-center">
          📜 Your Quiz Attempts
        </h2>

        {attempts.length === 0 ? (
          <p
            className={`text-center text-lg ${
              mode === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            No attempts found.
          </p>
        ) : (
          <ul className="space-y-6 attempts-list">
            {attempts.map((attempt, index) => {
              const correct = attempt.answers.filter((q) => q.isCorrect).length;
              const wrong = attempt.answers.length - correct;

              return (
                <li
                  key={attempt._id} // ✅ use unique _id
                  className={`attempt-item ${
                    mode === "dark" ? "dark-mode" : "light-mode"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">
                      ✅ Score:{" "}
                      <span className="font-bold">
                        {attempt.score} / {attempt.total}
                      </span>
                    </p>
                    <p className="text-sm opacity-70">
                      {attempt.submittedAt
                        ? new Date(attempt.submittedAt).toLocaleString()
                        : "Date not available"}
                    </p>
                  </div>
                  <div className="flex gap-6 text-md mt-1">
                    <p className="text-green-400 font-semibold">
                      🟢 Correct: {correct}
                    </p>
                    <p className="text-red-400 font-semibold">
                      🔴 Wrong: {wrong}
                    </p>
                  </div>
                  <div className="mt-2">
                    <ThemedButton
                      onClick={() => navigate(`/attempts/${attempt._id}`)}
                      variant="generate"
                    >
                      🔍 View Details
                    </ThemedButton>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Attempts;
