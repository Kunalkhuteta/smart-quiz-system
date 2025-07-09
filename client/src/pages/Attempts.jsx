import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Attempts.css"; 

const Attempts = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [attempts, setAttempts] = useState([]);
  const navigate = new useNavigate();
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        // const user = JSON.parse(localStorage.getItem("user"));
        console.log("🧠 user:", user);
        console.log("📦 Sending userId:", user.id);
        const res = await axios.get(`/api/quiz/attempts/?userId=${user.id}`);
        console.log("📨 Raw response:", res);
        console.log("✅ Attempts from backend:", res.data.attempts);

        setAttempts(res.data.attempts);
      } catch (err) {
        console.error("❌ Failed to fetch attempts:", err);
      }
    };

    fetchAttempts();
  });
  

  return (
   <div className="attempts-container">
  <h2>📜 Your Quiz Attempts</h2>
  {attempts.length === 0 ? (
    <p className="no-attempts">No attempts found.</p>
  ) : (
    <ul className="attempts-list">
      {attempts.map((attempt, index) => {
        const correct = attempt.answers.filter(q => q.selected === q.correct).length;
        const wrong = attempt.total - correct;

        return (
          <li key={index} className="attempt-item">
            <p><strong>✅ Score:</strong> {attempt.score} / {attempt.total}</p>
            <p>🟢 Correct: {correct} | 🔴 Wrong: {wrong}</p>
            <p>📅 Submitted: {new Date(attempt.submittedAt).toLocaleString()}</p>
            <button onClick={() => navigate(`/attempts/${attempt._id}`)}>
              🔍 View Details
            </button>
          </li>
        );
      })}
    </ul>
  )}
</div>

  );
};

export default Attempts;
