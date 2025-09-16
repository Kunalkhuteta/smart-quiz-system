const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Replace this with your .env secret
const JWT_SECRET = process.env.JWT_SECRET || "supersecurekey123";

// Test route
router.get("/test", (req, res) => {
  res.json({ msg: "Auth route is working ✅" });
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

// User Signup Route
router.post("/register", async (req, res) => {
  const { name, email, password, role, referralId } = req.body;

  try {
    // Check if user already exists

    // let referredBy = null;
    // console.log(1)
    // console.log("this is referredcode", referralCode)
    // if (referralCode) {
    //   console.log(2)
    //   const teacher = await User.findOne({ referralCode, role });
    //   console.log("this is the ",teacher)
    //   if (teacher) {
    //     referredBy = teacher._id; // 👈 save teacher’s ID
    //   }
    // }
    // console.log(3)

    // Create new user
    
        // if (role === "student" && referredBy) {
        //   const teacher = await User.findById(referredBy);
          
        //   if (!teacher || teacher.role !== "teacher") {
        //     return res.status(400).json({ message: "Invalid referral ID" });
        //   }
    
        //   // referredBy = teacher._id; // ✅ save teacher’s _id
        // }

    const user = await User.create({
      name,
      email,
      password,
      role,
      referredBy: referralId
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      referredBy: user.referredBy,
      referralCode: user.referralCode,
      token,
      message:
        user.role === "teacher"
          ? `Registration successful! Your referral ID is: ${user._id}` 
          : "Registration successful!",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// User Login Route
router.post("/login", async (req, res) => {
  console.log("hi")
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  if(token)console.log(token)
    else console.log("no")

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        referralId: user._id,       // referral ID (for teacher)
        referredBy: user.referredBy, // who referred the user
      },
      token,
    });
    console.log("Login response:", res.data);

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;
