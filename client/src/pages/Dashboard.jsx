import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import SkeletonColor from "../components/SkeletonColor";
import { useTheme } from "../context/ThemeContext"; // Theme context
import ThemeToggle from "../components/ThemeToggle"; // Material UI switch
import ThemedButton from "../components/ThemedButton";

const user = JSON.parse(localStorage.getItem("user"));

const Dashboard = () => {
  const navigate = useNavigate();
  const { mode } = useTheme(); // get current theme
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

  // Optionally, refresh user on login (if token changes)
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  
  // Generate quiz
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

  // Handle option selection
  const handleOptionChange = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  // Submit quiz
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

  // Download certificate
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className={`min-h-screen font-sans p-4 transition-colors duration-300 ${mode === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      
      {/* Navbar */}
      <div className={`flex justify-between items-center p-4 shadow-md rounded-xl mb-6 ${mode === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-200 text-gray-900"}`}>
        <h1 className="text-xl font-bold">📊 Smart Quiz Dashboard</h1>
        <div className="flex gap-2 items-center">
          <ThemeToggle />
          {user?.isAdmin && (
            <Link to="/admin">
              <ThemedButton variant="default">🛠️ Admin Panel</ThemedButton>
            </Link>
          )}
          <ThemedButton variant="default" onClick={handleLogout}>Logout</ThemedButton>
        </div>
      </div>

      {/* User Info */}
      <div className={`p-4 rounded-xl shadow-md mb-6 ${mode === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
        <p><strong>📧 Email:</strong> {user?.email}</p>
        <p><strong>🆔 ID:</strong> {user?.id}</p>
        {user.role === "teacher" && (
          <p className={`mt-2 ${mode === "dark" ? "text-green-400" : "text-green-600"}`}>
            Referral ID: {user.referralId}
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mb-6">
        <Link to="/attempts">
          <ThemedButton variant="view">📜 View Attempts</ThemedButton>
        </Link>
        <Link to="/leaderboard">
          <ThemedButton variant="view">🏆 View Leaderboard</ThemedButton>
        </Link>
      </div>

      {/* Quiz Section */}
      <div className={`p-4 rounded-xl shadow-md mb-6 ${mode === "dark" ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
        <h2 className="text-lg font-bold mb-4">🚀 Start Your Quiz</h2>

        {loading ? (
          <SkeletonColor />
        ) : questions.length === 0 ? (
          <ThemedButton variant="generate" onClick={generateQuiz}>
            Generate Hindi Quiz
          </ThemedButton>
        ) : (
          <div>
            {questions.map((q, index) => (
              <div key={index} className={`p-4 rounded-xl shadow-md mb-4 ${mode === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                <p className="font-semibold mb-2">
                  Q{index + 1}: {q.question}{" "}
                  {q.generatedByAI && (
                    <span className={`ml-2 font-semibold ${mode === "dark" ? "text-green-400" : "text-green-600"}`}>[AI]</span>
                  )}
                </p>

                {q.options.map((option, i) => {
                  const isCorrect = submitted && option === q.answer;
                  const isWrong = submitted && answers[index] === option && option !== q.answer;

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
                  <p className={`mt-2 font-semibold ${mode === "dark" ? "text-green-400" : "text-green-600"}`}>
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
                <p>🎯 आपके अंक: {score} / {questions.length}</p>
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
