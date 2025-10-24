const express = require("express");
const router = express.Router();
const QuizAttempt = require("../models/QuizAttempt");
const Quiz = require("../models/Quiz");
const axios = require("axios");

// 1️⃣ Get Subjects
router.get("/subjects", (req, res) => {
  res.json(["Maths", "English", "GK", "Science"]);
});

// 2️⃣ Generate/Get Daily Quiz
router.post("/", async (req, res) => {
  const { subject, userId } = req.body;
  if (!subject) return res.status(400).json({ message: "Subject is required" });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    

    let quiz = await Quiz.findOne({
      subject,
      isDaily: true,
      createdAt: { $gte: today },
    });

    if (!quiz) {
      const message = `Generate 10 multiple-choice questions in ${subject}.
      Each question must have 4 options (A, B, C, D) and include the correct answer.
      Respond ONLY in JSON like:
      {"questions":[{"question":"...","options":["A","B","C","D"],"answer":"A"}]}`;

      let aiRes; // define outside the try block
      try {
        aiRes = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: "meta-llama/llama-3.3-8b-instruct:free", // ✅ safe free model
            messages: [{ role: "user", content: message }],
          },
          
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // ✅ Use OpenRouter key
              "Content-Type": "application/json",
            },
          }
        );
      } catch (err) {
        console.error("🔥 AI Request Failed:");
        if (err.response) {
          console.error("Status:", err.response.status);
          console.error("Data:", err.response.data);
        } else {
          console.error("Error:", err.message);
        }

        // Fallback — if AI fails, return dummy quiz
        return res.status(500).json({
          message: "AI request failed",
          error: err.message,
        });
      }

      // ✅ Parse AI response safely
      let aiQuiz;
      try {
        const textOutput = aiRes.data?.choices?.[0]?.message?.content || "{}";
        const jsonString = textOutput.match(/\{[\s\S]*\}/)?.[0];
        if (!jsonString) throw new Error("No JSON found in AI response");

        const cleaned = jsonString
          .replace(/(\r\n|\n|\r)/gm, "")
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]");

        aiQuiz = JSON.parse(cleaned);
      } catch (err) {
        console.error("⚠️ AI parse failed:", err.message);
        return res.status(500).json({ message: "AI returned invalid JSON format" });
      }

      // ✅ Save the quiz
      quize = new Quiz({
        title: `${subject} Daily Quiz`,
        subject,
        isDaily: true,
        createdBy: userId || null,
        questions: aiQuiz.questions,
      });
      await quize.save();
    }

    res.json(quize);
  } catch (err) {
    console.error("Daily Quiz Error:", err);
    res.status(500).json({ message: "Failed to generate quiz" });
  }
});


// 3️⃣ Submit Quiz (no changes)
router.post("/submit", async (req, res) => {
  const { quizId, userId, answers } = req.body;

  if (!quizId) return res.status(400).json({ message: "QuizId is required" });
  if (!userId) return res.status(400).json({ message: "You must be logged in" });

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0, correctCount = 0, wrongCount = 0;

    const attemptAnswers = quiz.questions.map((q, idx) => {
      const selectedRaw = answers[idx] || "";
      const correctRaw = q.answer || "";
      let correctText = "";

      if (["a", "b", "c", "d"].includes(correctRaw.toLowerCase())) {
        const optionIndex = { a: 0, b: 1, c: 2, d: 3 }[correctRaw.toLowerCase()];
        correctText = q.options?.[optionIndex] || correctRaw;
      } else {
        correctText = correctRaw;
      }

      const isCorrect =
        selectedRaw.toLowerCase() === correctRaw.toLowerCase() ||
        selectedRaw.toLowerCase() === correctText.toLowerCase();

      if (isCorrect) {
        score++;
        correctCount++;
      } else wrongCount++;

      return {
        question: q.question,
        options: q.options || [],
        selected: selectedRaw || "Not answered",
        correct: correctText,
        isCorrect,
      };
    });

    const attempt = new QuizAttempt({
      userId,
      quizId,
      quizType: quiz.isDaily ? "daily" : "teacher",
      answers: attemptAnswers,
      score,
      total: quiz.questions.length,
      correctCount,
      wrongCount,
      submittedAt: new Date(),
    });

    await attempt.save();

    res.json({
      message: "Quiz submitted successfully ✅",
      score,
      total: quiz.questions.length,
      correctCount,
      wrongCount,
    });
  } catch (err) {
    console.error("Submit Quiz Error:", err);
    res.status(500).json({ message: "Failed to submit quiz", error: err.message });
  }
});

module.exports = router;
 