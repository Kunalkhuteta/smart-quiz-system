import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SkeletonColor from "../components/SkeletonColor";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import ThemedButton from "../components/ThemedButton";
import "../styles/Dashboard.css";
import html from "../images/html.png";
import css from "../images/css.png";
import js from "../images/js.png";
import MongoDB from "../images/mongodb.png";
import Express from "../images/express.png";
import react from "../images/react.png";
import nodejs from "../images/nodejs.png";
import github from "../images/github.png";
import googleAuth from "../images/googleauth.png";
import googlecloud from "../images/googlecloud.png";
import hf from "../images/hugginface.png";
import json from "../images/json.png";
import api from "../images/api.png";
import jwt from "../images/jwt.png";
import mui from "../images/mui.png";
import notion from "../images/notion.png";
import npm from "../images/npm.png";
import postman from "../images/postman.png";
import vite from "../images/vite.png";
import vercel from "../images/vercel.png";
import tailwind from "../images/tailwind.png";
import render from "../images/render.png";
import eraser from "../images/eraser.png";

const Dashboard = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [certificateReady, setCertificateReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const generateQuiz = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/quiz/generate`
      );
      setQuestions(res.data.questions);
      setAnswers({});
      setSubmitted(false);
      setScore(0);
      setCertificateReady(false);
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert("Could not generate quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    setScore(correct);
    setSubmitted(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/quiz/submit`, {
        userId: user.id,
        username: user.username,
        answers: questions.map((q, i) => ({
          question: q.question,
          selected: answers[i],
          correct: q.answer,
        })),
        score: correct,
        total: questions.length,
      });
      setCertificateReady(true);
    } catch (err) {
      console.error("Failed to save quiz attempt:", err);
      alert("Could not save your attempt");
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/certificates/generate`,
        {
          studentName: user.name,
          quizName: "Hindi Quiz",
          obtainedMarks: score,
          totalMarks: questions.length,
        },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${user.name}-certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating certificate:", err);
      alert("Could not generate certificate");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div
      className={`min-h-screen font-sans p-4 sm:p-6 animated-bg transition-colors duration-500 ${
        mode === "dark" ? "dark-mode-bg text-gray-100" : "light-mode-bg text-gray-900"
      }`}
    >
      {/* Navbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="dashboard-title typing-animation">📊 Smart Quiz Dashboard</h1>
        <div className="flex gap-3 items-center flex-wrap">
          <ThemeToggle />
          {user?.isAdmin === true && (
            <ThemedButton variant="default" onClick={() => navigate("/admin")}>
              Admin Panel
            </ThemedButton>
          )}
          <ThemedButton variant="default" onClick={handleLogout}>
            Logout
          </ThemedButton>
        </div>
      </div>

      {/* User Info */}
      <div className="user-info-card p-4 rounded-xl shadow-md mb-6 sm:mb-8">
        <p className="user-info-text"><strong>📧 Email:</strong> {user?.email}</p>
        <p className="user-info-text"><strong>🆔 ID:</strong> {user?.id}</p>
        {user?.role === "teacher" && (
          <p
            className={`mt-2 ${mode === "dark" ? "text-green-400" : "text-green-600"} user-info-text`}
          >
            Referral ID: {user.referralId}
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="button-group mb-6 sm:mb-4 flex-wrap justify-center gap-4">
        <Link to="/attempts">
          <ThemedButton variant="view">📜 View Attempts</ThemedButton>
        </Link>
        <Link to="/leaderboard">
          <ThemedButton variant="view">🏆 View Leaderboard</ThemedButton>
        </Link>
      </div>

      {/* 🔥 Tech Stack Looping Icons */}
      <div className="tech-marquee">
        <div className="tech-track">
          <span> <img src={html} alt="HTML" className="w-10 h-10" /></span>
          <span> <img src={css} alt="CSS" className="w-10 h-10" /></span>
          <span> <img src={js} alt="JS" className="w-10 h-10" /></span>
          <span> <img src={MongoDB} alt="mongodb" className="w-10 h-10" /></span>
          <span> <img src={Express} alt="express" className="w-10 h-10" /></span>
          <span> <img src={react} alt="react" className="w-10 h-10" /></span>
          <span> <img src={nodejs} alt="nodejs" className="w-10 h-10" /></span>
          <span> <img src={tailwind} alt="tailwind" className="w-10 h-10" /></span>
          <span> <img src={mui} alt="mui" className="w-10 h-10" /></span>
          <span> <img src={github} alt="github" className="w-10 h-10" /></span>
          <span> <img src={postman} alt="postman" className="w-10 h-10" /></span>
          <span> <img src={npm} alt="npm" className="w-10 h-10" /></span>
          <span> <img src={vercel} alt="vercel" className="w-10 h-10" /></span>
          <span> <img src={render} alt="render" className="w-10 h-10" /></span>
          <span> <img src={eraser} alt="eraser" className="w-10 h-10" /></span>
          <span> <img src={googlecloud} alt="googlecloud" className="w-10 h-10" /></span>
          <span> <img src={googleAuth} alt="googleAuth" className="w-10 h-10" /></span>
          <span> <img src={notion} alt="notion" className="w-10 h-10" /></span>
          <span> <img src={hf} alt="hf" className="w-10 h-10" /></span>
          <span> <img src={json} alt="json" className="w-10 h-10" /></span>
          <span> <img src={api} alt="api" className="w-10 h-10" /></span>
          <span> <img src={jwt} alt="jwt" className="w-10 h-10" /></span>
          <span> <img src={vite} alt="vite" className="w-10 h-10" /></span>
         
        </div>
      </div>

      {/* Quiz Section */}
      <div className="quiz-section p-4 rounded-xl shadow-md mb-6 sm:mb-8">
        <h2 className="quiz-title mb-4">Start Quiz</h2>
        {loading ? (
          <SkeletonColor />
        ) : questions.length === 0 ? (
          <ThemedButton variant="generate" onClick={generateQuiz}>
            Generate Hindi Quiz
          </ThemedButton>
        ) : (
          <div>
            {questions.map((q, index) => (
              <div key={index} className="quiz-card p-4 rounded-xl mb-4 shadow-md">
                <p className="font-semibold mb-2">
                  Q{index + 1}: {q.question}{" "}
                  {q.generatedByAI && (
                    <span className="text-green-500 font-semibold ml-2">[AI]</span>
                  )}
                </p>
                {q.options.map((option, i) => {
                  const isCorrect = submitted && option === q.answer;
                  const isWrong =
                    submitted && answers[index] === option && option !== q.answer;
                  return (
                    <label
                      key={i}
                      className={`block mb-2 p-2 rounded cursor-pointer border transition ${
                        isCorrect
                          ? "bg-green-700 text-white font-bold"
                          : isWrong
                          ? "bg-red-700 text-white font-bold"
                          : mode === "dark"
                          ? "bg-gray-600 hover:bg-gray-500 text-gray-100"
                          : "bg-gray-300 hover:bg-gray-400 text-gray-900"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        disabled={submitted}
                        checked={answers[index] === option}
                        className="mr-2"
                        onChange={() => handleOptionChange(index, option)}
                      />
                      {option}
                    </label>
                  );
                })}
                {submitted && (
                  <p
                    className={`mt-2 font-semibold ${
                      mode === "dark" ? "text-green-400" : "text-green-600"
                    }`}
                  >
                    ✔ सही उत्तर: {q.answer}
                  </p>
                )}
              </div>
            ))}
            {!submitted && (
              <ThemedButton variant="generate" onClick={handleSubmit}>
                Submit Quiz
              </ThemedButton>
            )}
            {submitted && certificateReady && (
              <div className="mt-4">
                <p className="mb-2">🎯 Score: {score} / {questions.length}</p>
                <ThemedButton variant="generate" onClick={handleDownloadCertificate}>
                  🎓 Download Certificate
                </ThemedButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
