import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SkeletonColor from "../components/SkeletonColor";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import ThemedButton from "../components/ThemedButton";
import "../styles/Dashboard.css";

const API_BASE =  "https://smart-quiz-system.onrender.com";

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
      </div>

      {/* Tech Stack Marquee */}
      <div className="tech-marquee mt-10">
        <div className="tech-track">
          {[
            "html",
            "css",
            "js",
            "mongodb",
            "express",
            "react",
            "nodejs",
            "tailwind",
            "mui",
            "github",
            "postman",
            "npm",
            "vercel",
            "render",
            "eraser",
            "googlecloud",
            "googleauth",
            "notion",
            "hugginface",
            "json",
            "api",
            "jwt",
            "vite",
          ].map((icon, idx) => (
            <span key={idx}>
              <img
                src={`/images/${icon}.png`}
                alt={icon}
                className="w-10 h-10"
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
