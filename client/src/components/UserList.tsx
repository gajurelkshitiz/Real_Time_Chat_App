import React from "react";

type User = {
  userID: string;
  username: string;
  self?: boolean;
  messages?: { content: string; fromSelf: boolean }[];
};

interface UsersListProps {
  users: User[];
  onSelect: (user: User) => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, onSelect }) => {
  return (
    <div
      style={{
        width: "250px",
        borderRight: "1px solid #ccc",
        padding: "10px",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Online Users</h3>
      {users.length === 0 && <p>No users connected</p>}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {users.map((user) => (
          <li
            key={user.userID}
            onClick={() => onSelect(user)}
            style={{
              cursor: "pointer",
              backgroundColor: user.self ? "#d1ffd1" : "#f1f1f1",
              marginBottom: "8px",
              padding: "8px",
              borderRadius: "8px",
            }}
          >
            <strong>{user.username}</strong>{" "}
            {user.self && <span style={{ color: "green" }}>(You)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
