import React, { useRef, useState, useEffect } from "react";

const Chatbot = () => {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [fileData, setFileData] = useState(null);

  const messageInputRef = useRef(null);
  const chatBodyRef = useRef(null);
  const fileInputRef = useRef(null);


  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      setTimeout(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, thinking]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      parts: [{ text: message }],
    };

    if (fileData) {
      userMessage.parts.push({ inline_data: fileData });
    }

    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setMessage("");
    setFileData(null);
    setThinking(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: updatedHistory
      }),
    });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Failed to get response");
      }

      const responseText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text
          ?.replace(/\\(.?)\\*/g, "$1")
          ?.trim() || "No response received";

      const botMessage = {
        role: "model",
        parts: [{ text: responseText }],
      };

      setChatHistory((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("API Error:", err);
      setChatHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Error: " + err.message }] },
      ]);
    } finally {
      setThinking(false);
    }
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const avatarPath =
    "M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5zM867.2 644.5V453.1h26.5c19.4 0 35.1 15.7 35.1 35.1v121.1c0 19.4-15.7 35.1-35.1 35.1h-26.5zM95.2 609.4V488.2c0-19.4 15.7-35.1 35.1-35.1h26.5v191.3h-26.5c-19.4 0-35.1-15.7-35.1-35.1zM561.5 149.6c0 23.4-15.6 43.3-36.9 49.7v44.9h-30v-44.9c-21.4-6.5-36.9-26.3-36.9-49.7 0-28.6 23.3-51.9 51.9-51.9s51.9 23.3 51.9 51.9z";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "40px 10px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          height: "80vh",
          backgroundColor: "#fff",
          borderRadius: "15px",
          boxShadow:
            "0 0 128px 0 rgba(0,0,0,0.1), 0 32px 64px -48px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#724ae8",
            color: "#fff",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <svg
            style={{ width: "32px", height: "32px", fill: "#fff" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1024 1024"
          >
            <path d={avatarPath} />
          </svg>
          <h2 style={{ margin: 0, fontSize: "18px" }}>Chatbot</h2>
        </div>

        {/* Chat body */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
          }}
          ref={chatBodyRef}
        >
          {chatHistory.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#666",
                marginTop: "40px",
              }}
            >
              <h3>Hi there! 👋</h3>
              <p>How can I help you today?</p>
            </div>
          )}

          {chatHistory.map((entry, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                margin: "20px 0",
                gap: "12px",
                alignItems: "flex-start",
                flexDirection: entry.role === "user" ? "row-reverse" : "row",
              }}
            >
              {entry.role === "model" && (
                <svg
                  style={{
                    width: "32px",
                    height: "32px",
                    fill: "#724ae8",
                    flexShrink: 0,
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 1024 1024"
                >
                  <path d={avatarPath} />
                </svg>
              )}
              <div
                style={{
                  maxWidth: "75%",
                  padding: "12px 16px",
                  borderRadius: "18px",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  backgroundColor:
                    entry.role === "user" ? "#724ae8" : "#f1f1f1",
                  color: entry.role === "user" ? "#fff" : "#333",
                  borderBottomRightRadius:
                    entry.role === "user" ? "4px" : "18px",
                  borderBottomLeftRadius:
                    entry.role === "model" ? "4px" : "18px",
                }}
              >
                {entry.parts[0].text}
                {entry.parts[1]?.inline_data && (
                  <img
                    src={`data:${entry.parts[1]?.inline_data.mime_type};base64,${entry.parts[1].inline_data.data}`}
                    alt="file"
                    style={{
                      maxWidth: "200px",
                      borderRadius: "8px",
                      marginTop: "8px",
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          {thinking && (
            <div style={{ display: "flex", gap: "12px" }}>
              <svg
                style={{
                  width: "32px",
                  height: "32px",
                  fill: "#724ae8",
                  flexShrink: 0,
                }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
              >
                <path d={avatarPath} />
              </svg>
              <div
                style={{
                  backgroundColor: "#f1f1f1",
                  borderRadius: "18px",
                  padding: "12px 16px",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#724ae8",
                      borderRadius: "50%",
                      animation: "bounce 1.4s ease-in-out infinite",
                      animationDelay: "0s",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#724ae8",
                      borderRadius: "50%",
                      animation: "bounce 1.4s ease-in-out infinite",
                      animationDelay: "0.2s",
                    }}
                  ></div>
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#724ae8",
                      borderRadius: "50%",
                      animation: "bounce 1.4s ease-in-out infinite",
                      animationDelay: "0.4s",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px",
            borderTop: "1px solid #ddd",
            display: "flex",
            alignItems: "flex-end",
            gap: "10px",
          }}
        >
          <textarea
            style={{
              flex: 1,
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "20px",
              resize: "none",
              minHeight: "44px",
              fontSize: "14px",
              outline: "none",
            }}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            ref={messageInputRef}
            rows={1}
          />

          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".jpg,.jpeg,.png,.gif,.pdf,.docx,.txt"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file"
            style={{
              width: "44px",
              height: "44px",
              border: "none",
              borderRadius: "50%",
              backgroundColor: "#f1f1f1",
              color: "#666",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            📎
          </button>

          {fileData && (
            <button
              type="button"
              onClick={() => setFileData(null)}
              title="Remove file"
              style={{
                width: "44px",
                height: "44px",
                border: "none",
                borderRadius: "50%",
                backgroundColor: "#ff4444",
                color: "#fff",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            title="Send message"
            style={{
              width: "44px",
              height: "44px",
              border: "none",
              borderRadius: "50%",
              backgroundColor: "#724ae8",
              color: "#fff",
              fontSize: "18px",
              cursor: !message.trim() ? "not-allowed" : "pointer",
              opacity: !message.trim() ? 0.5 : 1,
            }}
          >
            ↑
          </button>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};
 export default Chatbot;