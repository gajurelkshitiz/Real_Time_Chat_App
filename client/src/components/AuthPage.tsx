import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { useAuth } from "../hooks/useAuth";


export default function AuthPage({ onAuth }: { onAuth: (user: any, token: string) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { authenticate, loading } = useAuth();

  // Auto-login if token cookie exists
  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");
    if (token && user) {
      onAuth(JSON.parse(user), token);
    }
  }, [onAuth]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { user, token } = await authenticate(mode, username, password);
      toast.success(mode === "login" ? "Logged in!" : "Registered successfully!");
      if (rememberMe) {
        Cookies.set("token", token, { expires: 7 }); // 7 days
        Cookies.set("user", JSON.stringify(user), { expires: 7 });
      }
      onAuth(user, token);
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Toaster position="top-center" />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {mode === "login" ? "Login" : "Register"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username"
            required
            autoFocus
          />
          <input
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {mode === "login" && (
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              Remember Me
            </label>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading
              ? mode === "login"
                ? "Logging in..."
                : "Registering..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>
        <button
          className="mt-4 w-full text-blue-500 hover:underline"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}