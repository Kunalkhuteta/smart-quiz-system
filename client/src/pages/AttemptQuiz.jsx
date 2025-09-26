import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ThemedButton from "../components/ThemedButton";
import { useTheme } from "../context/ThemeContext";
import "../styles/AttemptQuiz.css";

const API_BASE = "https://smart-quiz-system.onrender.com";

const AttemptQuiz = () => {
  const { mode } = useTheme();
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [certificateData, setCertificateData] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(res.data);
      } catch (err) {
        console.error("Error fetching quiz:", err.response?.data || err.message);
        setError("⚠️ Failed to load quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleOptionChange = (questionIndex, value) => {
    setAnswers({ ...answers, [questionIndex]: value });
  };

  const handleSubmit = async () => {
  if (!window.confirm("Are you sure you want to submit the quiz?")) return;
  setSubmitting(true);

  try {
    const token = localStorage.getItem("token");

    const answersArray = quiz.questions.map((q, idx) => {
      const selected = answers[idx] || null;
      const correct = q.answer; // ✅ match schema
      return {
        question: q.question,
        selected,   // ✅ schema expects "selected"
        correct,    // ✅ schema expects "correct"
        isCorrect: selected === correct,
      };
    });

    const totalCorrect = answersArray.filter((a) => a.isCorrect).length;
    const totalWrong = answersArray.length - totalCorrect;

    await axios.post(
      `${API_BASE}/api/quiz/attempt/submit`,
      { quizId: quiz._id, answers: answersArray },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert(
      `✅ Quiz submitted!\nCorrect: ${totalCorrect}\nWrong: ${totalWrong}\nScore: ${totalCorrect}/${answersArray.length}`
    );

    // Store certificate data for download button
    setCertificateData({
      studentName: localStorage.getItem("name") || "Student",
      quizName: quiz.title,
      obtainedMarks: totalCorrect,
      totalMarks: answersArray.length,
    });
  } catch (err) {
    console.error("Submit attempt error:", err.response?.data || err.message);
    alert("⚠️ Error submitting quiz.");
  } finally {
    setSubmitting(false);
  }
};


  const handleDownloadCertificate = async () => {
    if (!certificateData) return;
    try {
      const res = await axios.post(
        `${API_BASE}/api/certificates/generate`,
        certificateData,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${certificateData.studentName}-certificate.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Certificate download failed:", err);
      alert("⚠️ Failed to download certificate.");
    }
  };

  if (loading) return <p className="text-center mt-4">⏳ Loading quiz...</p>;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (!quiz) return <p className="text-center mt-4">❌ Quiz not found.</p>;

  return (
    <div
      className={`attempt-quiz-page min-h-screen p-4 sm:p-6 ${
        mode === "dark"
          ? "dark-mode-bg text-gray-100"
          : "light-mode-bg text-gray-900"
      }`}
    >
      <h1 className="quiz-title mb-6">{quiz.title}</h1>

      {quiz.questions?.length > 0 ? (
        quiz.questions.map((q, idx) => (
          <div key={idx} className="question-card">
            <p className="question-text mb-3">
              {idx + 1}. {q.question}
            </p>
            {q.options.map((opt, oidx) => (
              <label key={oidx} className="option-label">
                <input
                  type="radio"
                  name={`question-${idx}`}
                  value={opt}
                  checked={answers[idx] === opt}
                  onChange={() => handleOptionChange(idx, opt)}
                  className="option-input"
                />
                {opt}
              </label>
            ))}
          </div>
        ))
      ) : (
        <p>No questions found in this quiz.</p>
      )}

      <div className="submit-button-wrapper mt-6 flex flex-col items-center gap-4">
        {!certificateData ? (
          <ThemedButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Quiz"}
          </ThemedButton>
        ) : (
          <ThemedButton onClick={handleDownloadCertificate}>
            🎓 Download Certificate
          </ThemedButton>
        )}
      </div>
    </div>
  );
};

export default AttemptQuiz;
