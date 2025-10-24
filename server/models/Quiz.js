const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: {
    type: [{ type: String, required: true }],
    validate: [arr => arr.length === 4, "There must be exactly 4 options"], // ensure 4 options
  },
  answer: { type: String, required: true }, // correct answer
});

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    isDaily: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User"}, // teacher or system
    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
