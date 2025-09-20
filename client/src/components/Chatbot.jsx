import React, { useState } from "react";
import "../styles/Chatbot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! Ask me anything." },
  ]);
  const [input, setInput] = useState("");

  // Send message to backend
  const sendMessage = async (message) => {
    if (!message) return;

    // Add user's message to chat
    setMessages((prev) => [...prev, { from: "user", text: message }]);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/chatbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      // Add bot reply
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: data.reply || "Sorry, I cannot answer that." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error connecting to AI" },
      ]);
    }
  };

  // Handle input enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="chatbot-wrapper">
      {open && (
        <div className="chat-window">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "bot" ? "bot-message" : "user-message"}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
      <button className="chatbot-icon" onClick={() => setOpen(!open)}>
        💬
      </button>
    </div>
  );
}
