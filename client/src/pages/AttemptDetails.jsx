import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewAttemptDetails = () => {
  const { id } = useParams(); // get attemptId from URL
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

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
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!attempt)
    return <p className="text-gray-300 text-center mt-4">Loading attempt details...</p>;

  const correct = attempt.answers.filter((a) => a.selected === a.correct).length;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">📋 Attempt Details</h2>

        <div className="mb-4">
          <p><strong>🧑 Username:</strong> {attempt.username}</p>
          <p><strong>✅ Score:</strong> {attempt.score} / {attempt.total}</p>
          <p><strong>🗓️ Submitted:</strong> {new Date(attempt.submittedAt).toLocaleString()}</p>
        </div>

        <ul className="space-y-4">
          {attempt.answers.map((ans, idx) => {
            const isCorrect = ans.selected === ans.correct;

            return (
              <li
                key={idx}
                className={`p-4 rounded-lg border ${
                  isCorrect ? "bg-green-700 border-green-600" : "bg-red-700 border-red-600"
                }`}
              >
                <p className="font-semibold mb-1">Q{idx + 1}: {ans.question}</p>
                <p>
                  <span className="font-semibold">Your Answer:</span> {ans.selected || "Not answered"}
                </p>
                <p>
                  <span className="font-semibold">Correct Answer:</span> {ans.correct}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ViewAttemptDetails;
