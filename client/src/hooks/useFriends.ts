import { useCallback, useState } from "react";
import type { User } from "../types/User";

const BACKEND_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

export function useFriends() {
  const [friends, setFriends] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const fetchFriends = useCallback(async (userId: number) => {
    try {
      const res = await fetch(`${BACKEND_URL}/friends/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch friends");
      const data = await res.json();
      setFriends(data || []);
    } catch (e) {
      setFriends([]);
    }
  }, []);

  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/friends/all`);
      if (!res.ok) throw new Error("Failed to fetch all users");
      const data = await res.json();
      setAllUsers(data || []);
    } catch (e) {
      setAllUsers([]);
    }
  }, []);

  const addFriend = useCallback(async (userId: number, friendId: number) => {
    const res = await fetch(`${BACKEND_URL}/friends/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, friendId }),
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Failed to add friend");
    }
  }, []);

  return { friends, allUsers, fetchFriends, fetchAllUsers, addFriend };
}