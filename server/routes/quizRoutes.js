
const express = require("express");
const router = express.Router();
const QuizAttempt = require("../models/QuizAttempt");
const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const {isAuthenticated, protect, isAdmin } = require("../middlewares/authMiddleware");


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

router.post("/submit", async (req, res) => {
  try {
    const {   userId, username, answers, score, total } = req.body;

    const attempt = new QuizAttempt({
      
      userId,
      username,
      answers,
      score,
      total,
    });

    await attempt.save();

    // Fetch all for debugging
    const all = await QuizAttempt.find({ userId });
    console.log("🧠 Attempts now:", all.length); // <- This will show 1 again and again

    res.status(200).json({ message: "✅ Attempt saved!" });
  } catch (err) {
    console.error("❌ Submit error:", err.message);
    res.status(500).json({ message: "Error saving quiz attempt" });
  }
});

// GET /api/quiz/attempts/:userId
router.get("/attempts", async (req, res) => {
  try {
    const { userId } = req.query;
    console.log("📥 Incoming userId:", userId);

    const attempts = await QuizAttempt.find({ userId });


    console.log("📤 Found attempts:", attempts.length);

    res.json({ attempts });
  } catch (err) {
    console.error("❌ Fetch error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});



const Attempt = require("../models/QuizAttempt"); // ✅ Make sure this is at the top

// GET a single attempt by ID
router.get("/attempts/:id", async (req, res) => {
  try {
    const attempt = await Attempt.findById(req.params.id)
    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }
    res.json(attempt);
  } catch (error) {
    console.error("❌ Attempt details error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await QuizAttempt.aggregate([
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
          attempts: { $sum: 1 },
          maxScore: { $max: "$score" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          username: "$user.name",
          email: "$user.email",
          totalScore: 1,
          attempts: 1,
          maxScore: 1,
        },
      },
      {
        $sort: { totalScore: -1 },
      },
    ]);

    res.json({ leaderboard });
  } catch (err) {
    console.error("❌ Leaderboard error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/admin/users", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users); // ✅ MUST return an array
  } catch (err) {
    console.error("Admin Users Fetch Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/admin/attempts", protect, isAdmin, async (req, res) => {
  try {
    const attempts = await QuizAttempt.find().sort({ submittedAt: -1 });
    res.json({ attempts });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE /api/quiz/admin/users/:id
router.delete("/admin/user/:userId", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1. Delete user
    await User.findByIdAndDelete(userId);

    // 2. Delete all attempts by user
    await QuizAttempt.deleteMany({ userId: userId });

    res.status(200).json({ message: "✅ User and attempts deleted successfully." });
  } catch (error) {
    console.error("❌ Admin delete error:", error);
    res.status(500).json({ message: "Error deleting user and attempts" });
  }
});


// DELETE /api/quiz/admin/attempts/:id
router.delete("/admin/attempts/:id", protect, isAdmin, async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    await attempt.remove();
    res.json({ message: "Attempt deleted" });
  } catch (err) {
    console.error("❌ Delete Attempt Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
