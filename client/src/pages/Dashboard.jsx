import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SkeletonColor from "../components/SkeletonColor";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import ThemedButton from "../components/ThemedButton";
import "../styles/Dashboard.css";

// ✅ Imported icons
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

const API_BASE =
"https://smart-quiz-system.onrender.com";

const Dashboard = () => {
  const navigate = useNavigate();
  const { mode } = useTheme();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let res;
        if (user.role === "teacher") {
          res = await axios.get(`${API_BASE}/api/quiz/teacher-quizzes`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (user.role === "student") {
          res = await axios.get(`${API_BASE}/api/quiz/student-quizzes`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        setQuizzes(res.data || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/quiz/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuizzes(quizzes.filter((q) => q._id !== quizId));
    } catch (err) {
      console.error("Error deleting quiz:", err.response?.data || err.message);
    }
  };

  // ✅ Use imported images instead of string paths
  const techIcons = [
    { src: html, alt: "HTML" },
    { src: css, alt: "CSS" },
    { src: js, alt: "JavaScript" },
    { src: MongoDB, alt: "MongoDB" },
    { src: Express, alt: "Express" },
    { src: react, alt: "React" },
    { src: nodejs, alt: "NodeJS" },
    { src: tailwind, alt: "Tailwind" },
    { src: mui, alt: "Material UI" },
    { src: github, alt: "GitHub" },
    { src: postman, alt: "Postman" },
    { src: npm, alt: "NPM" },
    { src: vercel, alt: "Vercel" },
    { src: render, alt: "Render" },
    { src: eraser, alt: "Eraser" },
    { src: googlecloud, alt: "Google Cloud" },
    { src: googleAuth, alt: "Google Auth" },
    { src: notion, alt: "Notion" },
    { src: hf, alt: "Hugging Face" },
    { src: json, alt: "JSON" },
    { src: api, alt: "API" },
    { src: jwt, alt: "JWT" },
    { src: vite, alt: "Vite" },
  ];

  return (
    <div
      className={`dashboard-page min-h-screen font-sans p-4 sm:p-6 ${
        mode === "dark"
          ? "dark-mode-bg text-gray-100"
          : "light-mode-bg text-gray-900"
      }`}
    >
      {/* Navbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="dashboard-title typing-animation">
          📊 Smart Quiz Dashboard
        </h1>
        <div className="flex gap-3 items-center flex-wrap">
          <ThemeToggle />
          {user?.isAdmin && (
            <ThemedButton
              variant="default"
              onClick={() => navigate("/admin")}
            >
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
        <p>
          <strong>📧 Email:</strong> {user?.email}
        </p>
        <p>
          <strong>🆔 ID:</strong> {user?.id}
        </p>
        {user?.role === "teacher" && (
          <p
            className={`mt-2 ${
              mode === "dark" ? "text-green-400" : "text-green-600"
            }`}
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
        {user?.role === "teacher" && (
          <Link to="/create-quiz">
            <ThemedButton variant="view">➕ Create Quiz</ThemedButton>
          </Link>
          )} 
          <Link to="/dailyQuiz">
            <ThemedButton variant="view">Daily Quiz</ThemedButton>
          </Link>
          
      </div>

      {/* ✅ Tech Stack Marquee */}
      <div className="tech-marquee mt-10">
        <div className="tech-track">
          {techIcons.concat(techIcons).map((icon, idx) => (
            <span key={idx} className="mx-4">
              <img
                src={icon.src}
                alt={icon.alt}
                className="w-10 h-10 object-contain"
              />
            </span>
          ))}
        </div>
      </div>

      {/* Quizzes List */}
      <div className="teacher-quizzes mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          {user?.role === "teacher"
            ? "📝 Your Quizzes"
            : "📝 Available Quizzes"}
        </h2>
        {loading ? (
          <SkeletonColor count={3} />
        ) : quizzes.length === 0 ? (
          <p>No quizzes found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="quiz-card">
                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="quiz-info">
                  Questions: {quiz.questions.length}
                </p>

                {user.role === "teacher" && (
                  <div className="flex gap-2 mt-2">
                    <ThemedButton
                      onClick={() => navigate(`/edit-quiz/${quiz._id}`)}
                    >
                      ✏️ Edit
                    </ThemedButton>
                    <ThemedButton
                      variant="danger"
                      onClick={() => handleDeleteQuiz(quiz._id)}
                    >
                      🗑️ Delete
                    </ThemedButton>
                  </div>
                )}

                {user.role === "student" && (
                  <div className="flex gap-2 mt-2">
                    <ThemedButton
                      onClick={() => navigate(`/attempt-quiz/${quiz._id}`)}
                    >
                      📝 Attempt Quiz
                    </ThemedButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
