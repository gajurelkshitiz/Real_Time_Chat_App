import React, { useState, useEffect, useRef } from "react";

type Message = {
  content: string;
  fromSelf: boolean;
};

type User = {
  userID: string;
  username: string;
  messages?: Message[];
};

interface ChatWindowProps {
  selectedUser: User | null;
  onSend: (toUserID: string, content: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedUser, onSend }) => {
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser?.messages]);

  if (!selectedUser) {
    return (
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Select a user to start chatting</h2>
      </div>
    );
  }

  function handleSend() {
    if (!message.trim()) return;
    if (!selectedUser) return;
    onSend(selectedUser.userID, message);
    setMessage("");
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          backgroundColor: "#f7f7f7",
        }}
      >
        <h3>Chat with {selectedUser.username}</h3>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#fafafa",
        }}
      >
        {selectedUser.messages?.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.fromSelf ? "right" : "left",
              marginBottom: "10px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "16px",
                backgroundColor: msg.fromSelf ? "#d1e7dd" : "#e2e3e5",
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ccc",
          backgroundColor: "#fff",
        }}
      >
        <input
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          style={{
            marginLeft: "10px",
            padding: "10px 16px",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
