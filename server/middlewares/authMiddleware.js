const jwt = require("jsonwebtoken");
const User = require("../models/user");
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) next();
  else res.status(403).json({ message: "Not authorized" });
};


const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if token is present
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "❌ Not authorized, token missing" });
  }

  try {
    const token = authHeader.split(" ")[1]; // Get token from Bearer <token>
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    const user = await User.findById(decoded.id).select("-password"); // Get user without password

    if (!user) {
      return res.status(401).json({ message: "❌ User not found" });
    }

    req.user = user; // Attach user info to request
    next(); // Proceed to next handler
  } catch (err) {
    console.error("❌ Auth error:", err);
    res.status(401).json({ message: "❌ Token failed or invalid" });
  }
};
    module.exports = {isAuthenticated, protect, isAdmin };