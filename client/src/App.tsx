import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { socket } from "./socket";
import AuthPage from "./components/AuthPage";
import UserList from "./components/UserList";
import ChatWindow from "./components/ChatWindow";
import toast from "react-hot-toast";
import { User } from "./types/User";
import Home from "./pages/Home";


export default function App() {
  const token = Cookies.get("token");
  const user = Cookies.get("user");
  const [auth, setAuth] = React.useState<{ user: any; token: string } | null>(() =>
    token && user ? { user: JSON.parse(user), token } : null
  );
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showFindFriends, setShowFindFriends] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    if (!auth) return;
    (socket as any).auth = { username: auth.user.username, token: auth.token };
    socket.connect();

    socket.on("users", (list: User[]) => {
      const enriched = list.map(u => ({
        ...u,
        self: u.username === auth.user.username,
        messages: [],
      }));
      setUsers(enriched);
    });

    socket.on("private message", ({ content, from }: { content: string; from: string }) => {
      setUsers(prev =>
        prev.map(u =>
          u.userID === from
            ? { ...u, messages: [...(u.messages || []), { content, fromSelf: false }] }
            : u
        )
      );
    });

    return () => {
      socket.off("users");
      socket.off("private message");
    };
  }, [auth]);

  useEffect(() => {
    if (showFindFriends && auth) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/friends/all`)
        .then(res => res.json())
        .then(setAllUsers);


      console.log(allUsers, "ALL USERS LISTS");
    }
  }, [showFindFriends, auth]);

  useEffect(() => {
    if (auth) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/friends/${auth.user.id}`)
        .then(res => res.json())
        .then(setFriends);
    }
  }, [auth]);

  const onlineFriends = users
    .map(u => {
      const friend = friends.find(f => f.username === u.username);
      // Only include users with id
      if (friend && friend.id !== undefined) {
        return { ...u, id: friend.id };
      }
      return null;
    })
    .filter(Boolean) as User[];

  function sendMessage(toUserID: string, content: string) {
    socket.emit("private message", { content, to: toUserID });
    setUsers(prev =>
      prev.map(u =>
        u.userID === toUserID
          ? { ...u, messages: [...(u.messages || []), { content, fromSelf: true }] }
          : u
      )
    );
  }

  function addFriend(friendId: number) {
    if (!auth) return;
    fetch(`${process.env.REACT_APP_SERVER_URL}/friends/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: auth.user.id, friendId }),
    }).then(() => {
      toast.success("Friend added!");
      setShowFindFriends(false);
    });
  }

  function handleLogout() {
    Cookies.remove("token");
    Cookies.remove("user");
    setAuth(null);
    socket.disconnect();
  }

  return auth ? (
    <Home
      auth={auth}
      onLogout={() => {
        Cookies.remove("token");
        Cookies.remove("user");
        setAuth(null);
      }}
    />
  ) : (
    <AuthPage
      onAuth={(user, token) => {
        setAuth({ user, token });
      }}
    />
  );
}
