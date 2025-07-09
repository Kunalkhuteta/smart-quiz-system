const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Replace this with your .env secret
const JWT_SECRET = process.env.JWT_SECRET || "supersecurekey123";

router.get("/test", (req, res) => {
  res.json({ msg: "Auth route is working ✅" });
});

// user Signup Route
router.post("/register", async (req, res) => {
  const { name, email, password} = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    //paasword converts into hashcode
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// user Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
 
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({  user: { id: user.id, name: user.name, email: user.email , isAdmin: user.isAdmin, token} });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
});



module.exports = router;
