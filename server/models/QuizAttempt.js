const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: String,
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },

quizType: { type: String, enum: ["daily", "teacher"], required: true },
  answers: [
    {
      question: String,
      selected: String,
      correct: String,
      isCorrect: Boolean,
    },
  ],
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  correctCount: { type: Number }, // ✅ new
  wrongCount: { type: Number },   // ✅ new
  submittedAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
