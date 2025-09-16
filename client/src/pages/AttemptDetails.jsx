import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/AttemptDetails.css"; 


const ViewAttemptDetails = () => {
  const { id } = useParams(); // get attemptId from URL

console.log("📦 Attempt ID from URL:", id);

  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttempt = async () => { 
      try {   
        const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");
        console.log(token)
        if (!token) {
          setError("Unauthorized");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/attempts/${id}`, config);
        console.log("✅ Fetched attempt:", res.data);
        setAttempt(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch attempt:", err);
        setError("Failed to fetch attempt details");
      }
    };

    fetchAttempt();
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!attempt) return <p>Loading attempt details...</p>;

  const correct = attempt.answers.filter((a) => a.selected === a.correct).length;
  const wrong = attempt.total - correct;

  return (
    <div className="attempt-details-container">
  <h2>📋 Attempt Details</h2>

  {attempt ? (
    <div>
      <p><strong>🧑 Username:</strong> {attempt.username}</p>
      <p><strong>✅ Score:</strong> {attempt.score} / {attempt.total}</p>
      <p><strong>🗓️ Submitted:</strong> {new Date(attempt.submittedAt).toLocaleString()}</p>

      <ul className="question-list">
        {attempt.answers.map((ans, idx) => {
          const isCorrect = ans.selected === ans.correct;

          return (
            <li key={idx} className={`question-item ${isCorrect ? "correct" : "wrong"}`}>
              <p><strong>Q{idx + 1}:</strong> {ans.question}</p>
              <p>
                <span className="label">Your Answer:</span> {ans.selected || "Not answered"}
              </p>
              <p>
                <span className="label">Correct Answer:</span> {ans.correct}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  ) : (
    <p>Loading attempt details...</p>
  )}
</div>

  );
};

export default ViewAttemptDetails;

