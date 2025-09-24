import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ThemedButton from "../components/ThemedButton";
import { useTheme } from "../context/ThemeContext";
import "../styles/AttemptQuiz.css"; // ✅ Add this CSS file

const AttemptQuiz = () => {
  const { mode } = useTheme();
  const navigate = useNavigate();
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(res.data);
      } catch (err) {
        console.error("Error fetching quiz:", err.response?.data || err.message);
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
        const selectedOption = answers[idx] || null;
        return {
          question: q.question,
          selectedOption,
          correctAnswer: q.answer,
          isCorrect: selectedOption === q.answer,
        };
      });

      const totalCorrect = answersArray.filter((a) => a.isCorrect).length;
      const totalWrong = answersArray.length - totalCorrect;

      await axios.post(
        "/api/quiz/attempt/submit",
        { quizId: quiz._id, answers: answersArray },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(
        `✅ Quiz submitted!\nCorrect: ${totalCorrect}\nWrong: ${totalWrong}\nScore: ${totalCorrect}/${answersArray.length}`
      );

      navigate("/attempts");
    } catch (err) {
      console.error("Submit attempt error:", err.response?.data || err.message);
      alert("Error submitting quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading quiz...</p>;
  if (!quiz) return <p className="text-center mt-4">Quiz not found.</p>;

  return (
    <div className={`attempt-quiz-page min-h-screen p-4 sm:p-6 ${mode === "dark" ? "dark-mode-bg text-gray-100" : "light-mode-bg text-gray-900"}`}>
      <h1 className="quiz-title mb-6">{quiz.title}</h1>

      {quiz.questions.map((q, idx) => (
        <div key={idx} className="question-card">
          <p className="question-text mb-3">{idx + 1}. {q.question}</p>
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
      ))}

      <div className="submit-button-wrapper mt-6">
        <ThemedButton onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Quiz"}
        </ThemedButton>
      </div>
    </div>
  );
};

export default AttemptQuiz;
