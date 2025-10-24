const express = require("express");
const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    // const msg=`Make the asked question arranged in sequence for a chatbot web app and answer it in brief and if you don't know the answer, just say "Sorry, I cannot answer that." and don't try to make up an answer. Here is the question: ${message}`;
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-8b-instruct:free",
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
