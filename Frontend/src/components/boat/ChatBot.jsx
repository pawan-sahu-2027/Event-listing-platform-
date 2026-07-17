

import React, { useState } from "react";
import axios from "axios";
import "./ChatBoat.css";


const ChatBot = () => {

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
   const API_URL =
  "https://z80x8c7mx3.execute-api.ap-south-1.amazonaws.com";


  const toggleChat = () => {
    setOpen((prev) => !prev);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        type: "user",
        text: userMessage,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
    
      console.log("Payload:", {
        query: userMessage,
      });
      
      const response = await axios.post(
        `${API_URL}/api/v1/chat`,
        {
          query: userMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

   

      const answer =
        response.data?.answer ||
        "No response received from AI.";

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text: answer,
        },
      ]);
    } catch (error) {
      console.error("❌ Axios Error");

      console.log(error);

      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }

      if (error.request) {
        console.log("No response received");
        console.log(error.request);
      }

      console.log("Message:", error.message);

      setMessages((prev) => [
        ...prev,
        {
          type: "ai",
          text:
            "Something went wrong while contacting the AI server.",
        },
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
            AI ChatBot
            <span
              style={{ cursor: "pointer" }}
              onClick={toggleChat}
            >
              ✖
            </span>
          </div>

          <div className="chat-body">
            {messages.length === 0 && (
              <div className="ai-msg">
                👋 Hello! Ask me anything about events.
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.type === "user"
                    ? "user-msg"
                    : "ai-msg"
                }
              >
                {message.text}
              </div>
            ))}

            {loading && (
              <div className="ai-msg">
                🤖 Typing...
              </div>
            )}
          </div>

          <div className="chat-footer">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;