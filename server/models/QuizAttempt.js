
const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema({
  // user: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User", // ✅ required to make populate("user") work
  // },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User", 
    required: true,
  },
  username: String,

  answers: [
    {
      question: String,
      selected: String,
      correct: String,
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
// // 

