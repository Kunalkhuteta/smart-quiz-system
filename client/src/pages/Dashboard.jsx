import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const user = JSON.parse(localStorage.getItem("user"));

const Dashboard = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [certificateReady, setCertificateReady] = useState(false);

  // Generate quiz
  const generateQuiz = async () => {
    try {
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
    <div className={`${darkMode ? "dark" : ""} min-h-screen bg-gray-900 text-gray-100 font-sans p-4`}>
      {/* Navbar */}
      <div className="flex justify-between items-center p-4 bg-gray-800 shadow-md rounded-xl mb-6">
        <h1 className="text-xl font-bold">📊 Smart Quiz Dashboard</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Admin Panel */}
      {user?.isAdmin && (
        <Link
          to="/admin"
          className="block w-fit mb-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded shadow"
        >
          🛠️ Admin Panel
        </Link>
      )}

      {/* User Info */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md mb-6">
        <p><strong>📧 Email:</strong> {user?.email}</p>
        <p><strong>🆔 ID:</strong> {user?.id}</p>
        {user.role === "teacher" && (
          <p className="mt-2 text-green-400">Referral ID: {user.referralId}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <Link
          to="/attempts"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded shadow"
        >
          📜 View Attempts
        </Link>
        <Link
          to="/leaderboard"
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded shadow"
        >
          🏆 View Leaderboard
        </Link>
      </div>

      {/* Quiz Section */}
      <div className="bg-gray-800 p-4 rounded-xl shadow-md mb-6">
        <h2 className="text-lg font-bold mb-4">🚀 Start Your Quiz</h2>
        {questions.length === 0 ? (
          <button
            onClick={generateQuiz}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded shadow"
          >
            Generate Hindi Quiz
          </button>
        ) : (
          <div>
            {questions.map((q, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-xl shadow-md mb-4"
              >
                <p className="font-semibold mb-2">
                  Q{index + 1}: {q.question}{" "}
                  {q.generatedByAI && (
                    <span className="ml-2 text-green-400 font-semibold">[AI]</span>
                  )}
                </p>

                {q.options.map((option, i) => {
                  const isCorrect = submitted && option === q.answer;
                  const isWrong =
                    submitted && answers[index] === option && option !== q.answer;

                  return (
                    <label
                      key={i}
                      className={`block mb-2 p-2 rounded cursor-pointer border
                        ${isCorrect ? "bg-green-700 text-white font-bold" :
                        isWrong ? "bg-red-700 text-white font-bold" :
                        "bg-gray-600 hover:bg-gray-500 text-gray-100"}`}
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
                  <p className="text-green-400 mt-2 font-semibold">
                    ✔ सही उत्तर: {q.answer}
                  </p>
                )}
              </div>
            ))}

            {!submitted && (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded shadow"
              >
                Submit Quiz
              </button>
            )}

            {submitted && (
              <div className="mt-4">
                <h4>🎯 परिणाम:</h4>
                <p>आपके अंक: {score} / {questions.length}</p>
                {certificateReady && (
                  <button
                    type="button"
                    onClick={handleDownloadCertificate}
                    className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded shadow"
                  >
                    🎓 Download Certificate
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
