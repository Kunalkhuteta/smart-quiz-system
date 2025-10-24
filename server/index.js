const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const quizRoutes = require("./routes/quizRoutes");
const authRoutes = require("./routes/authRoutes");
const referralRoutes = require("./routes/referralRoutes");
const certificateRoutes = require("./routes/certificateRoutes");
const chatRoutes = require("./routes/chatRoutes");
const QuizAttempt = require("./models/QuizAttempt");
const dailyQuizRoutes = require("./routes/dailyQuiz");
const app = express();

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:3000", // frontend dev
  "http://localhost:5000", // backend dev
  "https://smart-quiz-system-uuqh.vercel.app",
  "https://smart-quiz-system-uuqh-1gzketfmw-kunal-khutetas-projects.vercel.app"
];

// ✅ CORS middleware
const isDev = process.env.NODE_ENV !== "production";

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow server-to-server
    if(isDev) return callback(null, true); // allow all in dev
    if(allowedOrigins.includes(origin)){
      return callback(null, true);
    }
    return callback(new Error(`CORS error: Origin ${origin} not allowed`), false);
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
}));


// ✅ Body parser
app.use(express.json());

// ✅ Routes
app.use("/api/quiz", quizRoutes);
app.use("/api/chatbot", chatRoutes);
app.use("/api/referrals", referralRoutes);
app.use("/api", authRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/dailyQuiz", dailyQuizRoutes);
// ✅ Test route
app.get("/api/test", (req, res) => res.json({ msg: "Backend working 🔥" }));

// ✅ Example quiz attempt route
app.get("/api/quiz/attempts/:id", async (req, res) => {
  try {
    const attempt = await QuizAttempt.findById(req.params.id);
    if(!attempt) return res.status(404).json({ message: "Attempt not found" });
    res.json(attempt);
  } catch(err){
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Connect DB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Server running on port ${process.env.PORT || 5000}`)
  );
})
.catch(err => console.log(err));
