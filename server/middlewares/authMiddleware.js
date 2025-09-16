const jwt = require("jsonwebtoken");
const User = require("../models/user");

// const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return res.status(401).json({ message: "❌ Not authorized, token missing" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.userId).select("-password");
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "❌ Not authorized, token invalid" });
//   }
// };
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find user
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }
     console.log("✅ Logged in user for leaderboard:", req.user);
      next();
    } catch (error) {
      console.error("❌ Protect error:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) next();
  else res.status(403).json({ message: "Not authorized" });
};

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "❌ Not authorized, token missing" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // fixed here too
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "❌ User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("❌ Auth error:", err);
    res.status(401).json({ message: "❌ Token failed or invalid" });
  }
};

const isTeacher = (req, res, next) => {
  if (req.user?.role === "teacher") next();
  else res.status(403).json({ message: "Not authorized as teacher" });
};

const isStudent = (req, res, next) => {
  if (req.user?.role === "student") next();
  else res.status(403).json({ message: "Not authorized as student" });
};

module.exports = { protect, isAdmin, isAuthenticated, isTeacher, isStudent };
