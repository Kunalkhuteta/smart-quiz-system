
const express = require("express");
const router = express.Router();
const User = require("../models/user");

// 🎯 Register student with referral
router.post("/register-student", async (req, res) => {
  const { name, email, password, referralCode } = req.body;

  try {
    const teacher = await User.findOne({ referralCode, role: "teacher" });
    if (!teacher) return res.status(404).json({ message: "Invalid referral code" });

    const newUser = new User({
      name,
      email,
      password,
      role: "student",
      referredBy: teacher._id,
    });

    await newUser.save();
    res.status(201).json({ message: "Student registered and linked to teacher", userId: newUser._id });
  } catch (error) {
    console.error("❌ Student registration failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 👨‍🏫 Generate referral code (teacher only)
router.post("/generate-code", async (req, res) => {
  const { teacherId } = req.body;

  try {
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can generate referral codes" });
    }

    teacher.generateReferralCode();
    await teacher.save();
    res.json({ referralCode: teacher.referralCode });
  } catch (error) {
    console.error("❌ Referral code generation failed:", error);
    res.status(500).json({ message: "Internal error" });
  }
});

module.exports = router;
