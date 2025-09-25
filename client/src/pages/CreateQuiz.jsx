import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const API_BASE =  process.env.REACT_APP_API_BASE_URL || "https://smart-quiz-system.onrender.com";

const CreateQuiz = () => {
  const { quizId } = useParams(); // For editing mode
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], answer: "" },
  ]);
  const [loading, setLoading] = useState(false);

  // Fetch quiz if editing
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/api/quiz/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const quiz = res.data;

        setTitle(quiz.title);
        setQuestions(
          quiz.questions.map((q) => ({
            questionText: q.question,
            options: q.options,
            answer: q.answer, // ✅ match backend
          }))
        );
      } catch (err) {
        console.error("Error fetching quiz:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title,
        questions: questions.map((q) => ({
          question: q.questionText,
          options: q.options,
          answer: q.answer,
        })),
      };

      if (quizId) {
        // Edit existing quiz
        await axios.put(`${API_BASE}/api/quiz/${quizId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Quiz updated successfully!");
      } else {
        // Create new quiz
        await axios.post(`${API_BASE}/api/quiz/create`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("✅ Quiz created successfully!");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving quiz:", err.response?.data || err.message);
      alert("❌ Error saving quiz, try again");
    }
  };

  if (loading) return <p>Loading quiz...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">
        {quizId ? "✏️ Edit Quiz" : "📝 Create New Quiz"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Title */}
        <div>
          <label className="block text-lg font-medium mb-1">Quiz Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            placeholder="Enter quiz title..."
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Questions */}
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            className="border border-gray-200 p-5 rounded-lg bg-gray-50 dark:bg-gray-700 space-y-4"
          >
            <label className="block text-lg font-semibold">
              Question {qIndex + 1}
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your question..."
              value={q.questionText}
              onChange={(e) =>
                handleQuestionChange(qIndex, "questionText", e.target.value)
              }
              required
            />

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              {q.options.map((opt, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  required
                />
              ))}
            </div>

            {/* Correct Answer */}
            <div>
              <label className="block text-md font-medium mb-1">
                Select Correct Answer
              </label>
              <select
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={q.answer}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "answer", e.target.value)
                }
                required
              >
                <option value="">Choose one...</option>
                {q.options.map((opt, oIndex) => (
                  <option key={oIndex} value={opt}>
                    {opt || `Option ${oIndex + 1}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 hover:bg-blue-600 text-black px-5 py-2 rounded-lg shadow"
          >
            ➕ Add Question
          </button>

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-black px-5 py-2 rounded-lg shadow"
          >
            {quizId ? "✅ Update Quiz" : "✅ Submit Quiz"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateQuiz;
