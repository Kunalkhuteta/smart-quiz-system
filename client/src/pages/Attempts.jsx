import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Attempts = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [attempts, setAttempts] = useState([]);
  const navigate = useNavigate(); // ❌ fixed the incorrect usage

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
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">📜 Your Quiz Attempts</h2>

        {attempts.length === 0 ? (
          <p className="text-gray-300 text-center">No attempts found.</p>
        ) : (
          <ul className="space-y-4">
            {attempts.map((attempt, index) => {
              const correct = attempt.answers.filter(q => q.selected === q.correct).length;
              const wrong = attempt.total - correct;

              return (
                <li
                  key={index}
                  className="p-4 rounded-lg bg-gray-700 shadow-md flex flex-col gap-2"
                >
                  <p>
                    <strong>✅ Score:</strong> {attempt.score} / {attempt.total}
                  </p>
                  <p>
                    🟢 Correct: {correct} | 🔴 Wrong: {wrong}
                  </p>
                  <p>
                    📅 Submitted: {new Date(attempt.submittedAt).toLocaleString()}
                  </p>
                  <button
                    onClick={() => navigate(`/attempts/${attempt._id}`)}
                    className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded shadow self-start"
                  >
                    🔍 View Details
                  </button>
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
