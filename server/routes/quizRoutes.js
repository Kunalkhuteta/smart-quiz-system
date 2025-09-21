  const express = require("express");
  const router = express.Router();
  const QuizAttempt = require("../models/QuizAttempt");
  const PDFDocument = require("pdfmake");

  const User = require("../models/user");

  const {  protect, isAdmin } = require("../middlewares/authMiddleware");

  // ----------------------------
  // Generate Quiz (Dummy Example)
  // ----------------------------
  router.post("/generate", async (req, res) => {
    try {
      const dummyQuestions = [
        {
          question: "भारत का राष्ट्रीय पशु कौन सा है?",
          options: ["शेर", "हाथी", "बाघ", "गाय"],
          answer: "बाघ"
        },
        {
          question: "ताजमहल कहाँ स्थित है?",
          options: ["दिल्ली", "आगरा", "जयपुर", "वाराणसी"],
          answer: "आगरा"
        },
        {
          question: "भारत की राजधानी क्या है?",
          options: ["कोलकाता", "मुंबई", "नई दिल्ली", "चेन्नई"],
          answer: "नई दिल्ली"
        }
      ];

      res.json({ questions: dummyQuestions });
    } catch (err) {
      console.error("❌ Dummy quiz error:", err.message);
      res.status(500).json({ error: "Dummy quiz generation failed" });
    }
  });

  // ----------------------------
  // Submit Attempt
  // ----------------------------
  router.post("/submit", async (req, res) => {
    try {
      const { userId, username, answers, score, total } = req.body;

      const attempt = new QuizAttempt({ userId, username, answers, score, total });
      await attempt.save();

      res.status(200).json({ message: "✅ Attempt saved!" });
    } catch (err) {
      console.error("❌ Submit error:", err.message);
      res.status(500).json({ message: "Error saving quiz attempt" });
    }
  });

  // ----------------------------
  // Get Attempts by User
  // ----------------------------
  router.get("/attempts", async (req, res) => {
    try {
      const { userId } = req.query;
      const attempts = await QuizAttempt.find({ userId });
      res.json({ attempts });
    } catch (err) {
      console.error("❌ Fetch error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  });

  // ----------------------------
  // Get Attempt by ID
  // ----------------------------
  router.get("/attempts/:id", async (req, res) => {
    try {
      const attempt = await QuizAttempt.findById(req.params.id);
      if (!attempt) return res.status(404).json({ message: "Attempt not found" });
      res.json(attempt);
    } catch (error) {
      console.error("❌ Attempt details error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.get("/leaderboard", protect, async (req, res) => {
    try {
      let teacherId;

      if (req.user.role === "teacher") {
        // teacher sees their own class leaderboard
        teacherId = req.user._id;
      } else if (req.user.role === "student") {
        // student sees leaderboard of their teacher's class
        if (!req.user.referredBy) {
          return res.status(400).json({ message: "You are not linked to any teacher." });
        }
        teacherId = req.user.referredBy;
      } else {
        return res.status(403).json({ message: "Not allowed" });
      }

      // get all students under that teacher
      const students = await User.find({ referredBy: teacherId, role: "student" });

      // get attempts for those students
      const attempts = await QuizAttempt.find({ userId: { $in: students.map(s => s._id) } });

      // group scores
      const scores = {};
      attempts.forEach((a) => {
        const uid = a.userId.toString();
        if (!scores[uid]) scores[uid] = 0;
        scores[uid] += a.score;
      });

      // build leaderboard
      const leaderboard = students.map((s) => ({
        userId: s._id,
        username: s.name,
        totalScore: scores[s._id.toString()] || 0,
      }));

      // sort by score
      leaderboard.sort((a, b) => b.totalScore - a.totalScore);

      res.json(leaderboard);
    } catch (err) {
      console.error("❌ Leaderboard error:", err);
      res.status(500).json({ message: "Server Error" });
    }
  });



  // ----------------------------
  // Admin – Get All Users
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

  // ----------------------------
  // Admin – Get All Attempts
  // ----------------------------
  router.get("/admin/attempts", protect, isAdmin, async (req, res) => {
    try {
      const attempts = await QuizAttempt.find().sort({ submittedAt: -1 });
      res.json({ attempts });
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  });

  // ----------------------------
  // Admin – Delete User & Attempts
  // ----------------------------
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

  // ----------------------------
  // Admin – Delete Attempt
  // ----------------------------
router.delete("/admin/attempts/:id", protect, isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Attempt delete ID:", id);

    const attempt = await QuizAttempt.findByIdAndDelete(id);

    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    res.json({ message: "Attempt deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Attempt Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});





  module.exports = router;
