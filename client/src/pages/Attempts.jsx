import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import ThemedButton from "../components/ThemedButton";

const Attempts = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate();
  const { mode } = useTheme();

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/quiz/attempts/?userId=${user.id}`
        );
        setAttempts(res.data.attempts);
      } catch (err) {
        console.error("Failed to fetch attempts:", err);
      }
    };

    fetchAttempts();
  }, [user.id]);

  return (
    <div className={`min-h-screen p-6 transition-colors duration-300 ${mode === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      {/* Theme toggle button */}
      <div className="flex justify-end mb-6">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">
          📜 Your Quiz Attempts
        </h2>

        {attempts.length === 0 ? (
          <p className={`text-center text-lg ${mode === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            No attempts found.
          </p>
        ) : (
          <ul className="space-y-6">
            {attempts.map((attempt, index) => {
              const correct = attempt.answers.filter(q => q.selected === q.correct).length;
              const wrong = attempt.total - correct;

              return (
                <li
                  key={index}
                  className={`p-6 rounded-2xl shadow-lg flex flex-col gap-3 transition-transform duration-200 transform hover:scale-[1.02] ${
                    mode === "dark"
                      ? "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 border border-gray-600"
                      : "bg-white border border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">
                      ✅ Score: <span className="font-bold">{attempt.score} / {attempt.total}</span>
                    </p>
                    <p className="text-sm text-gray-400">{new Date(attempt.submittedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4 text-md">
                    <p className="text-green-400 font-semibold">🟢 Correct: {correct}</p>
                    <p className="text-red-400 font-semibold">🔴 Wrong: {wrong}</p>
                  </div>
                  <div>
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
