import React from "react";
import type { User } from "../types/User";

export default function FindFriends({
  allUsers,
  currentUser,
  friends,
  onAddFriend,
}: {
  allUsers: User[];
  currentUser: any;
  friends: User[];
  onAddFriend: (friendId: number) => void;
}) {
  return (
    <aside className="fixed right-0 top-16 bg-white shadow-lg p-6 w-80 h-[calc(100vh-64px)] overflow-y-auto z-50">
      <h2 className="text-xl font-bold mb-4">Find Friends</h2>
      <ul>
        {allUsers
          .filter(u => u.username !== currentUser.username && !friends.some(f => f.username === u.username))
          .map(u => (
            <li key={u.id ?? u.userID} className="flex justify-between items-center mb-2">
              <span>{u.username}</span>
              <button onClick={() => onAddFriend(u.id ?? 0)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                Add Friend
              </button>
            </li>
          ))}
      </ul>
    </aside>
  );
}