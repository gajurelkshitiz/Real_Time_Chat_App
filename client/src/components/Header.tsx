import React from "react";

export default function Header({ onLogout, onToggleFind }: { onLogout: () => void; onToggleFind: () => void }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <h1 className="text-2xl font-bold text-blue-600">Chat App</h1>
      <div className="flex items-center gap-4">
        <button onClick={onToggleFind} className="p-2 rounded hover:bg-blue-100 transition" title="Find Friends">
          {/* Find Friends Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth={2} fill="none" />
            <path stroke="currentColor" strokeWidth={2} d="M2 20c0-4 8-4 8 0" />
            <path stroke="currentColor" strokeWidth={2} d="M22 20c0-4-8-4-8 0" />
          </svg>
        </button>
        <button onClick={onLogout} title="Logout" className="p-2 rounded hover:bg-gray-200 transition">
          {/* Logout Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}