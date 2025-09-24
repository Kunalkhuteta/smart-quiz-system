const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }], // max 4 options
  answer: { type: String, required: true }, // correct answer
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // teacher
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
