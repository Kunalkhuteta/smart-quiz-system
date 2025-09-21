import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import ThemedButton from "../components/ThemedButton";

const ViewAttemptDetails = () => {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState("");
  const { mode } = useTheme();

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized");
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
      }
    };

    fetchAttempt();
  }, [id]);

  if (error)
    return (
      <p className={`text-center mt-6 font-semibold ${mode === "dark" ? "text-red-400" : "text-red-600"}`}>
        {error}
      </p>
    );

  if (!attempt)
    return (
      <p className={`text-center mt-6 font-medium ${mode === "dark" ? "text-gray-300" : "text-gray-700"}`}>
        Loading attempt details...
      </p>
    );

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${mode === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      {/* Theme toggle */}
      <div className="flex justify-end mb-4">
        <ThemeToggle />
      </div>

      <div className={`max-w-2xl mx-auto p-6 rounded-xl shadow-lg ${mode === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}`}>
        <h2 className="text-2xl font-bold mb-4 text-center">📋 Attempt Details</h2>

        {/* Attempt Info */}
        <div className={`p-4 rounded-lg mb-4 shadow-inner ${mode === "dark" ? "bg-gray-700 border border-gray-600" : "bg-gray-50 border border-gray-200"}`}>
          <p className="text-md mb-1"><strong>🧑 Username:</strong> {attempt.username}</p>
          <p className="text-md mb-1"><strong>✅ Score:</strong> {attempt.score} / {attempt.total}</p>
          <p className="text-md"><strong>🗓️ Submitted:</strong> {new Date(attempt.submittedAt).toLocaleString()}</p>
        </div>

        {/* Answers Section */}
        <ul className="space-y-3">
          {attempt.answers.map((ans, idx) => {
            const isCorrect = ans.selected === ans.correct;

            return (
              <li
                key={idx}
                className={`p-3 rounded-lg border-l-4 transition-transform duration-150 ${
                  isCorrect
                    ? mode === "dark"
                      ? "bg-green-700 border-green-400"
                      : "bg-green-100 border-green-500"
                    : mode === "dark"
                    ? "bg-red-700 border-red-400"
                    : "bg-red-100 border-red-500"
                }`}
              >
                <p className="font-semibold mb-1 text-md">Q{idx + 1}: {ans.question}</p>
                <p className="text-sm mb-0.5"><span className="font-semibold">Your Answer:</span> {ans.selected || "Not answered"}</p>
                <p className="text-sm"><span className="font-semibold">Correct Answer:</span> {ans.correct}</p>
              </li>
            );
          })}
        </ul>

        {/* Back Button */}
        <div className="mt-4 flex justify-center">
          <ThemedButton onClick={() => window.history.back()} variant="default">
            🔙 Back
          </ThemedButton>
        </div>
      </div>
    </div>
  );
};

export default ViewAttemptDetails;
