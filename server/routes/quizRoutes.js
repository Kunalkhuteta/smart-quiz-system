const express = require("express");
const router = express.Router();
const QuizAttempt = require("../models/QuizAttempt");
const Quiz = require("../models/Quiz");
const User = require("../models/user");
const { protect, isAdmin, isTeacher } = require("../middlewares/authMiddleware");

// Student - Submit Quiz Attempt
router.post("/attempt/submit", protect, async (req, res) => {
  try {
    const { quizId, answers } = req.body;

    if (!quizId) return res.status(400).json({ message: "Quiz ID is required" });
    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Answers must be a non-empty array" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Calculate score correctly ✅
    let score = 0;
    let detailedAnswers = [];

   quiz.questions.forEach((q, idx) => {
  const studentAns = answers[idx]; // from frontend
  // Use isCorrect sent from frontend (already correct)
  const isCorrect = !!studentAns.isCorrect;

  if (isCorrect) score++;

  detailedAnswers.push({
    question: q.question,
    selected: studentAns.selectedOption || null,
    correct: q.correctAnswer,
    isCorrect
  });
});


    const attempt = new QuizAttempt({
      userId: req.user._id,
      username: req.user.name,
      quizId,
      answers: detailedAnswers,
      score,
      total: quiz.questions.length,
    });

    await attempt.save();

    res.json({
      success: true,
      score,
      total: quiz.questions.length,
      attempt,
    });
  } catch (err) {
    console.error("❌ Submit attempt error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/attempts", protect, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user._id }).sort({ submittedAt: -1 });
    res.json({ attempts });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// ----------------------------
// Get Attempt by ID
// ----------------------------
router.get("/attempts/:id", protect, async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    res.json(attempt);
  } catch (err) {
    console.error("❌ Attempt details error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ----------------------------
// Leaderboard
// ----------------------------
router.get("/leaderboard", protect, async (req, res) => {
  try {
    let teacherId;

    if (req.user.role === "teacher") teacherId = req.user._id;
    else if (req.user.role === "student") {
      if (!req.user.referredBy) return res.status(400).json({ message: "You are not linked to any teacher." });
      teacherId = req.user.referredBy;
    } else return res.status(403).json({ message: "Not allowed" });

    const students = await User.find({ referredBy: teacherId, role: "student" });
    const attempts = await QuizAttempt.find({ userId: { $in: students.map(s => s._id) } });

    const scores = {};
    attempts.forEach(a => {
      const uid = a.userId.toString();
      if (!scores[uid]) scores[uid] = 0;
      scores[uid] += a.score;
    });

    const leaderboard = students.map(s => ({
      userId: s._id,
      username: s.name,
      totalScore: scores[s._id.toString()] || 0,
    }));

    leaderboard.sort((a, b) => b.totalScore - a.totalScore);
    res.json(leaderboard);
  } catch (err) {
    console.error("❌ Leaderboard error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ----------------------------
// Admin Routes
// ----------------------------
router.get("/admin/users", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Admin Users Fetch Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/admin/attempts", protect, isAdmin, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find().sort({ createdAt: -1 });
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/admin/users/:userId", protect, isAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;
    await User.findByIdAndDelete(userId);
    await QuizAttempt.deleteMany({ userId });
    res.status(200).json({ message: "✅ User and attempts deleted successfully." });
  } catch (error) {
    console.error("❌ Admin delete error:", error);
    res.status(500).json({ message: "Error deleting user and attempts" });
  }
});

router.delete("/admin/attempts/:id", protect, isAdmin, async (req, res) => {
  try {
    const attempt = await QuizAttempt.findByIdAndDelete(req.params.id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });
    res.json({ message: "Attempt deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Attempt Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// Teacher - Create Quiz
// ----------------------------
router.post("/create", protect, isTeacher, async (req, res) => {
  try {
    const { title, questions } = req.body;
    const quiz = new Quiz({ title, questions, createdBy: req.user._id });
    await quiz.save();
    res.json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Teacher - Get Own Quizzes
// ----------------------------
router.get("/teacher-quizzes", protect, isTeacher, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Student - Get Quizzes Linked to Teacher
// ----------------------------
router.get("/student-quizzes", protect, async (req, res) => {
  try {
    if (!req.user.referredBy) return res.json([]);
    const quizzes = await Quiz.find({ createdBy: req.user.referredBy });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Get Quiz by ID
// ----------------------------
router.get("/:quizId", protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Edit Quiz (Teacher Only)
// ----------------------------
router.put("/:quizId", protect, isTeacher, async (req, res) => {
  try {
    const { quizId } = req.params;
    const { title, questions } = req.body;

    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId, createdBy: req.user._id },
      { title, questions },
      { new: true }
    );

    if (!quiz) return res.status(404).json({ message: "Quiz not found or not yours" });
    res.json({ success: true, quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Delete Quiz (Teacher Only)
// ----------------------------
router.delete("/:quizId", protect, isTeacher, async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params.quizId, createdBy: req.user._id });
    if (!quiz) return res.status(404).json({ message: "Quiz not found or not yours" });
    res.json({ message: "✅ Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
