import React, { useEffect, useState } from "react";
import { socket } from "./socket";
import AuthPage from "./components/AuthPage";
import UsersList from "./components/UserList";
import ChatWindow from "./components/ChatWindow";

type User = { userID: string; username: string; self?: boolean; messages?: any[] };

export default function App() {
  const [auth, setAuth] = useState<{ user: any; token: string } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;
    // Attach token and username to socket auth
    (socket as any).auth = { username: auth.user.username, token: auth.token };
    socket.connect();

    socket.on("users", (list: User[]) => {
      const enriched = list.map(u => ({ ...u, self: u.userID === socket.id, messages: [] }));
      enriched.sort((a,b)=> a.self ? -1 : a.username.localeCompare(b.username));
      setUsers(enriched);
    });

    socket.on("user connected", (user: User) => {
      setUsers(prev => [...prev, { ...user, messages: [] }]);
    });

    socket.on("user disconnected", ({ userID }: { userID: string }) => {
      setUsers(prev => prev.filter(u => u.userID !== userID));
    });

    socket.on("private message", ({ content, from }: { content: string; from: string }) => {
      setUsers(prev =>
        prev.map(u => {
          if (u.userID === from) {
            return { ...u, messages: [...(u.messages || []), { content, fromSelf: false }] };
          }
          return u;
        })
      );
    });

    return () => {
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
    };
  }, [auth]);

  function sendMessage(toUserID: string, content: string) {
    socket.emit("private message", { content, to: toUserID });
    setUsers(prev =>
      prev.map(u => (u.userID === toUserID ? { ...u, messages: [...(u.messages || []), { content, fromSelf: true }] } : u))
    );
  }

  if (!auth) {
    return <AuthPage onAuth={(user, token) => setAuth({ user, token })} />;
  }

  return (
    <div className="app">
      <div style={{ display: "flex" }}>
        <UsersList users={users} onSelect={setSelectedUser} />
        <ChatWindow selectedUser={selectedUser} onSend={sendMessage} />
      </div>
    </div>
  );
}
