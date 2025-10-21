import { useState } from "react";

const BACKEND_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

export function useAuth() {
  const [loading, setLoading] = useState(false);

  async function authenticate(mode: "login" | "register", username: string, password: string) {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Auth failed");
      return { user: data.user, token: data.token };
    } finally {
      setLoading(false);
    }
  }

  return { authenticate, loading };
}