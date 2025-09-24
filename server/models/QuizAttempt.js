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
  answers: [
    {
      question: String,
      selected: String,
      correct: String,
      isCorrect: Boolean,
    },
  ],
  score: Number,
  total: Number,
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
