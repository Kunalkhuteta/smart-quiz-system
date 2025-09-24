import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import ThemedButton from "../components/ThemedButton";
import Skeleton from "@mui/material/Skeleton";
import "../styles/AttemptDetails.css";

const AttemptDetails = () => {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState("");
  const { mode } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized");
          setLoading(false);
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/quiz/attempts/${id}`,
          config
        );
        setAttempt(res.data);
      } catch (err) {
        console.error("Failed to fetch attempt:", err);
        setError("Failed to fetch attempt details");
      } finally {
        setLoading(false);
      }
    };

    fetchAttempt();
  }, [id]);

  if (error)
    return (
      <p
        className={`text-center mt-6 font-semibold ${
          mode === "dark" ? "text-red-400" : "text-red-600"
        }`}
      >
        {error}
      </p>
    );

  if (loading) {
    return (
      <div
        className={`admin-bg min-h-screen p-4 ${
          mode === "dark" ? "text-gray-100" : "text-gray-900"
        }`}
      >
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        <div className="admin-card">
          <h2 className="mb-4 font-bold text-xl">
            <Skeleton variant="text" width={200} height={40} animation="wave" />
          </h2>

          <Skeleton
            variant="rectangular"
            height={80}
            animation="wave"
            style={{ borderRadius: "10px", marginBottom: "16px" }}
          />

          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={50}
              animation="wave"
              style={{ borderRadius: "10px", marginBottom: "12px" }}
            />
          ))}

          <div className="admin-back-btn mt-4">
            <Skeleton
              variant="rectangular"
              width={100}
              height={40}
              animation="wave"
              style={{ borderRadius: "8px" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`admin-bg min-h-screen p-4 ${
        mode === "dark" ? "text-gray-100" : "text-gray-900"
      }`}
    >
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>

      <div className="admin-card">
        <h2>📋 Attempt Details</h2>

        <div className="attempt-info mb-4">
          <p>
            <strong>🧑 Username:</strong> {attempt.username}
          </p>
          <p>
            <strong>✅ Score:</strong> {attempt.score} / {attempt.total}
          </p>
          <p>
            <strong>🗓️ Submitted:</strong>{" "}
            {new Date(attempt.submittedAt).toLocaleString()}
          </p>
        </div>

        <ul className="answers-list">
          {attempt.answers.map((ans, idx) => {
            const isCorrect = ans.isCorrect;
            return (
              <li
                key={idx}
                className={`answer-item ${isCorrect ? "correct" : "wrong"}`}
              >
                <p className="font-semibold mb-1">
                  Q{idx + 1}: {ans.question}
                </p>
                <p className={`text-sm mb-0.5 ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                  <strong>Your Answer:</strong> {ans.selected || "Not answered"} {isCorrect ? "✅" : "❌"}
                </p>
                {!isCorrect && (
                  <p className="text-blue-500 text-sm">
                    <strong>Correct Answer:</strong> {ans.correct}
                  </p>
                )}
              </li>
            );
          })}
        </ul>

        <div className="admin-back-btn mt-4">
          <ThemedButton onClick={() => window.history.back()} variant="default">
            🔙 Back
          </ThemedButton>
        </div>
      </div>
    </div>
  );
};

export default AttemptDetails;
