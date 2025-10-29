import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { socket } from "../socket";
import type { User } from "../types/User";
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";
import Header from "../components/Header";
import FindFriends from "../components/FindFriends";
import { useFriends } from "../hooks/useFriends";

const BACKEND_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

export default function Home({
  auth,
  onLogout,
}: {
  auth: { user: any; token: string };
  onLogout: () => void;
}) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showFindFriends, setShowFindFriends] = useState(false);

  // friends hook: fetch friends / all users / addFriend
  const { friends, fetchFriends, allUsers, fetchAllUsers, addFriend } = useFriends();


  useEffect(() => {
    if (!auth) return;
    (socket as any).auth = { username: auth.user.username, token: auth.token };
    socket.connect();

    socket.on("users", (list: User[]) => {
      const enriched = list.map(u => ({
        ...u,
        self: u.username === auth.user.username,
        messages: u.messages || [],
      }));
      setUsers(enriched);
    });

    socket.on("private message", ({ content, from }: { content: string; from: string }) => {
      setUsers(prev =>
        prev.map(u =>
          u.userID === from ? { ...u, messages: [...(u.messages || []), { content, fromSelf: false }] } : u
        )
      );
    });

    // initial fetch of friend list
    fetchFriends(auth.user.id);

    return () => {
      socket.off("users");
      socket.off("private message");
      socket.disconnect();
    };
  }, [auth, fetchFriends]);

  // when opening find friends panel, load all users
  useEffect(() => {
    if (showFindFriends) fetchAllUsers();
  }, [showFindFriends, fetchAllUsers]);

  // only show online users who are in friends
  const onlineFriends = useMemo(() => {
    return users
      .map(u => {
        const f = friends.find(fr => fr.username === u.username);
        console.log('FRIENDS FOUND: ', f);
        if (f && f.id !== undefined) return { ...u, id: f.id } as User;
        return null;
      })
      .filter(Boolean) as User[];
  }, [users, friends]);


  console.log("ONLINE FRIENDS: ", onlineFriends);

  function sendMessage(toUserID: string, content: string) {
    socket.emit("private message", { content, to: toUserID });
    setUsers(prev =>
      prev.map(u => (u.userID === toUserID ? { ...u, messages: [...(u.messages || []), { content, fromSelf: true }] } : u))
    );
  }

  async function handleAddFriend(friendId: number) {
    if (!auth) return;
    try {
      await addFriend(auth.user.id, friendId);
      toast.success("Friend added");
      fetchFriends(auth.user.id);
      setShowFindFriends(false);
    } catch (e: any) {
      toast.error(e.message || "Failed to add friend");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLogout={() => {
          onLogout();
        }}
        onToggleFind={() => setShowFindFriends(v => !v)}
        currentUser={auth.user}
      />
      <main className="flex h-[calc(100vh-64px)]">
        <UserList users={onlineFriends} onSelect={setSelectedUser} />
        <ChatWindow selectedUser={selectedUser} onSend={sendMessage} />
        {showFindFriends && <FindFriends allUsers={allUsers} currentUser={auth.user} friends={friends} onAddFriend={handleAddFriend} />}
      </main>
    </div>
  );
}