import React, { useState } from "react";
import axios from "axios";
// import "./chatbot.css";
import "./ChatBoat.css";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setOpen(!open);

const sendMessage = async () => {
  if (!input.trim()) return;

  const userMsg = input;

  setMessages((prev) => [...prev, { type: "user", text: userMsg }]);
  setInput("");
  setLoading(true);

  try {
    const res = await axios.post("http://localhost:8080/api/v1/chat", {
      query: userMsg,
    });

    // Extract the answer field sent by your backend
    const aiReply = res.data.answer || "No response received from AI.";

    setMessages((prev) => [
      ...prev,
      { type: "ai", text: aiReply },
    ]);
  } catch (error) {
    console.error("Frontend Error:", error); 
    setMessages((prev) => [
      ...prev,
      { type: "ai", text: "Error fetching response." },
    ]);
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      {/* Floating Button */}
      <div className="chat-bubble" onClick={toggleChat}>
        🤖
      </div>

      {/* Chat Window */}
      {open && (
        <div className="chat-window">
          <div className="chat-header">
            AI Chat Bot
            <span onClick={toggleChat}>✖</span>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={msg.type === "user" ? "user-msg" : "ai-msg"}
              >
                {msg.text}
              </div>
            ))}

            {loading && <div className="ai-msg">Typing...</div>}
          </div>

          <div className="chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;