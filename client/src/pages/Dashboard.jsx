import React, { useEffect, useState } from "react";
import axios from "axios";
import {  Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"; 
const user = JSON.parse(localStorage.getItem("user"));


const Dashboard = () => {
  const navigate = useNavigate();
  
  // const user = JSON.parse(localStorage.getItem("user"));
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const generateQuiz = async () => {
    const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/generate`);
    setQuestions(res.data.questions);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };
  
  const handleOptionChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);

    const user = JSON.parse(localStorage.getItem("user"));
    
    console.log("hi");

    console.log("🧠 Current user:", user); // debug
    // console.log("user id", user?._id);

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/submit`, {
        userId: user.id,               // ✅ This must be present
        username: user.username,
        answers: questions.map((q, i) => ({
          question: q.question,
          selected: answers[i],
          correct: q.answer
        })),
        score: correct,
        total: questions.length
      });

      console.log("✅ Quiz attempt submitted!");
    } catch (err) {
      console.error("❌ Failed to save quiz attempt:", err);
      alert("❌ Could not save your attempt");
    }
   

  };




  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div>
      <div className="dashboard-container">
  {user?.isAdmin && (
  <Link to="/admin" className="button-link admin">🛠️ Admin Panel</Link>
)}
  <div className="dashboard-header">📊 Welcome, {user?.name} 
    
    </div> 

  <div className="user-info">
    <p><strong>📧 Email:</strong> {user?.email}</p>
    <p><strong>🆔 ID:</strong> {user?.id}</p>
  </div>
      <div className="button-group">
        <Link to="/attempts" className="button-link">📜 View Attempts</Link>
  <Link to="/leaderboard" className="button-link">🏆 View Leaderboard</Link>
  </div>

      <hr />


       <div className="quiz-section">
    <h3>🚀 Start Your Quiz</h3>
      {questions.length === 0 && (
        <button onClick={generateQuiz}>Generate Hindi Quiz</button>
      )}
       </div>
</div>
        


      {questions.length > 0 && (
        <form>
          {questions.map((q, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <p><strong>Q{index + 1}:</strong> {q.question}</p>
              {q.options.map((option, i) => {
                const isCorrect = submitted && option === q.answer;
                const isWrong = submitted && answers[index] === option && option !== q.answer;

                return (
                  <label key={i} style={{
                    display: "block",
                    marginBottom: "5px",
                    color: isCorrect ? "green" : isWrong ? "red" : "black",
                    fontWeight: isCorrect || isWrong ? "bold" : "normal"
                  }}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      disabled={submitted}
                      checked={answers[index] === option}
                      onChange={() => handleOptionChange(index, option)}
                    />{" "}
                    {option}
                  </label>
                );
              })}
              {submitted && (
                <p style={{ color: "green" }}>✔ सही उत्तर: {q.answer}</p>
              )}
            </div>
          ))}



          {!submitted && (
            <button type="button" onClick={handleSubmit} className="button-link">
              Submit Quiz
            </button>
          )}

          {submitted && (
            <div>
              <h4>🎯 परिणाम:</h4>
              <p>आपके अंक: {score} / {questions.length}</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default Dashboard;
