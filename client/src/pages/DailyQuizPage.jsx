import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Skeleton from "@mui/material/Skeleton";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import confetti from "canvas-confetti"; // 🎉 Confetti effect
import { ToastContainer, toast } from "react-toastify"; // 🍞 Toast notifications
import "react-toastify/dist/ReactToastify.css";
import "../styles/DailyQuizPage.css";

const API_BASE = "http://localhost:5000/api"; // change later for deployment

const DailyQuizPage = () => {
  const { mode } = useTheme();
  const [user, setUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // ⏱️ 5 minutes
  const timerRef = useRef(null);

  // Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Timer countdown
  useEffect(() => {
    if (quiz) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmitQuiz(true); // auto-submit when time’s up
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [quiz]);

  // Fetch Quiz
  const fetchQuiz = async () => {
    if (!subject) return toast.info("📚 Please select a subject first!");
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/dailyQuiz`, {
        subject,
        userId: user?._id || user?.id,
      });
      if (!res.data || !res.data._id) throw new Error("Quiz not found");
      setQuiz(res.data);
      setAnswers(Array(res.data.questions.length).fill(""));
      setTimeLeft(300);
      toast.success("🧠 Quiz loaded successfully!");
    } catch (err) {
      console.error("Error fetching quiz:", err);
      toast.error("❌ Failed to load quiz.");
    } finally {
      setLoading(false);
    }
  };

  // Option select
  const handleOptionChange = (qIndex, option) => {
    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  };

  // Submit Quiz
  const handleSubmitQuiz = async (auto = false) => {
    if (!quiz) return toast.warning("⚠️ No quiz to submit.");
    if (!user?.id) return toast.info("🔐 Please login to submit quiz.");
    clearInterval(timerRef.current);

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/dailyQuiz/submit`, {
        quizId: quiz._id,
        userId: user.id,
        answers,
      });

      const { score, total, correctCount, wrongCount } = res.data;
      const percent = (score / total) * 100;

      // 🎉 Confetti for high score
      if (percent >= 70) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }

      // ✨ Toast message instead of alert
      toast.success(
        `${auto ? "⏱️ Time's up!\n" : "✅ Quiz Submitted!\n"} Score: ${score}/${total} | ✅ ${correctCount} | ❌ ${wrongCount}`
      );
    
      setQuiz(null);
      setAnswers([]);
    } catch (err) {
      console.error("Submit failed:", err);
      toast.error("🚨 Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  // 🧭 Progress percentage
  const answeredCount = answers.filter((a) => a !== "").length;
  const progress = quiz ? (answeredCount / quiz.questions.length) * 100 : 0;

  // ⏱️ Timer format
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  return (
    <div className={`dailyquiz-container ${mode}`}>
      <div className="quiz-header">
        <h2 className="quiz-title">🧠 Daily Quiz</h2>
        <ThemeToggle />
      </div>

      <div className="subject-area">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="subject-select"
        >
          <option value="">-- Select Subject --</option>
          <option value="Maths">Maths</option>
          <option value="English">English</option>
          <option value="GK">GK</option>
          <option value="Science">Science</option>
        </select>
        <button className="gradient-btn" onClick={fetchQuiz} disabled={loading}>
          {loading ? "Loading..." : "Start Quiz"}
        </button>
      </div>

      {quiz && (
        <div className="progress-section">
          <div className="progress-info">
            <span>
              Question {answeredCount} of {quiz.questions.length}
            </span>
            <span className="timer">⏱️ {formatTime(timeLeft)}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="quiz-body">
        {loading && (
          <div className="skeleton-list">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={50}
                style={{ marginBottom: "10px", borderRadius: "8px" }}
              />
            ))}
          </div>
        )}

        {quiz && (
          <div className="quiz-box">
            <h3 className="quiz-subtitle">{quiz.title}</h3>

            {quiz.questions.map((q, idx) => (
              <div key={idx} className="quiz-question">
                <p className="question-text">
                  {idx + 1}. {q.question}
                </p>
                <div className="options-list">
                  {q.options.map((opt, oidx) => (
                    <label
                      key={oidx}
                      className={`option-item ${
                        answers[idx] === opt ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleOptionChange(idx, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              className="gradient-btn submit-btn"
              onClick={() => handleSubmitQuiz(false)}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        )}
      </div>

      {/* 🍞 Toast Container */}
      <ToastContainer position="top-center" autoClose={4000} />
    </div>
  );
};

export default DailyQuizPage;
