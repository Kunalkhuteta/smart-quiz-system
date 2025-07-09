const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const quizRoutes = require("./routes/quizRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/quiz", quizRoutes);

app.use("/api", require("./routes/authRoutes"));

// Test Route
app.get("/api/test", (req, res) => {
  res.json({ msg: "Backend working perfectly 🔥" });
});

app.get("/api/quiz/attempts/:id", async (req, res) => {
  try {
    if (!req.params.id) {

      return res.status(400).json({ message: "Invalid ID" });
    }

    console.log("h");
    const attempt = await QuizAttempt.findById(req.params.id);
    console.log(attempt)
    if (!attempt) {
      return res.status(500).json({ message: "Attempt not found" });
    }

    res.json(attempt);
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
// app.post("/api/testlogin", (req, res) => {
//   res.json({ message: "Test login success", data: req.body });
// });

// DB + Server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected")    ;
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.log(err));
// app.listen(process.env.PORT || 5000, () => {
//   console.log("Server running without DB");
// });
