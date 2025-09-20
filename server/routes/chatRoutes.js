const express = require("express");
const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct:together",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content || "Sorry, I cannot answer that.";

    res.json({ reply });
  } catch (err) {
    console.error("HF API error:", err);
    res.status(500).json({ reply: "Error connecting to AI" });
  } 
});

module.exports = router;
