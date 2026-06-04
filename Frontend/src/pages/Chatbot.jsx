import React, { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [listening, setListening] = useState(false);

  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop =
        chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory, thinking]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      parts: [{ text: message }],
    };

    if (fileData) userMessage.parts.push({ inline_data: fileData });

    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setMessage("");
    setFileData(null);
    setThinking(true);

    try {
      const response = await fetch("https://agrisathi-express.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: updatedHistory }),
      });

      const data = await response.json();
      let text = "No response";

if (data?.candidates?.length > 0) {
  const parts = data.candidates[0]?.content?.parts || [];
  text = parts.map(p => p.text || "").join("").trim();

  if (!text) text = "Empty response from AI";
} 
else if (data?.promptFeedback?.blockReason) {
  text = "⚠️ Response blocked due to safety filters";
} 
else if (data?.error) {
  text = "❌ API Error: " + data.error.message;
}

      setChatHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text }] },
      ]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Error: " + err.message }] },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleVoiceInput = () => {
    if (!SpeechRecognition) return alert("Not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.onstart = () => setListening(true);
    recognition.onresult = (e) =>
      setMessage(e.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result.split(",")[1];
      setFileData({ data: base64Data, mime_type: file.type });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="chat-page">

      {/* Header */}
      <div className="chat-header">
        🌾 AgriSathi AI Assistant
      </div>

      {/* Body */}
      <div className="chat-body" ref={chatBodyRef}>
        {chatHistory.length === 0 && (
          <div className="welcome">
            <h2>Welcome 🌿</h2>
            <p>Ask anything about crops, soil, mandi prices.</p>
          </div>
        )}

        {chatHistory.map((entry, idx) => (
          <div
            key={idx}
            className={`message ${
              entry.role === "user" ? "user" : "bot"
            }`}
          >
            <div className="bubble">
              <ReactMarkdown>
                {entry.parts[0].text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {thinking && (
          <div className="message bot">
            <div className="bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="chat-footer">
        <textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        <button
          onClick={handleVoiceInput}
          className={listening ? "mic active" : "mic"}
        >
          🎤
        </button>

        <button onClick={() => fileInputRef.current?.click()}>
          📎
        </button>

        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="send"
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default Chatbot;