import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import ThemedButton from "../components/ThemedButton";
import "../styles/Attempts.css";

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
              const correct = attempt.answers.filter(
                (q) => q.selected === q.correct
              ).length;
              const wrong = attempt.total - correct;

              return (
                <li
                  key={index}
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
                      {new Date(attempt.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-6 text-md">
                    <p className="text-green-400 font-semibold">
                      🟢 Correct: {correct}
                    </p>
                    <p className="text-red-400 font-semibold">
                      🔴 Wrong: {wrong}
                    </p>
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
