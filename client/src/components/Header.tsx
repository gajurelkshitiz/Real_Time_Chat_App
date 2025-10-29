import React from "react";
import { FiUsers, FiLogOut } from "react-icons/fi";

// Cast icons to a React SVG component type to satisfy TS
const UsersIcon = FiUsers as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
const LogoutIcon = FiLogOut as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

type Props = {
  onLogout: () => void;
  onToggleFind: () => void;
  currentUser?: { username: string; fullName?: string };
};

export default function Header({ onLogout, onToggleFind, currentUser }: Props) {
  const displayName = currentUser?.fullName || currentUser?.username || "Guest";
  const initial = (currentUser?.username || "G").charAt(0).toUpperCase();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <h1 className="text-2xl font-bold text-blue-600">Chat App</h1>

      <div className="flex items-center gap-4">
        <button
          onClick={onToggleFind}
          className="p-2 rounded hover:bg-blue-100 transition flex items-center"
          title="Find Friends"
          aria-label="Find Friends"
        >
          <UsersIcon className="h-6 w-6 text-blue-500" />
        </button>

        <button
          onClick={onLogout}
          title="Logout"
          className="p-2 rounded hover:bg-gray-200 transition flex items-center"
          aria-label="Logout"
        >
          <LogoutIcon className="h-6 w-6 text-red-500" />
        </button>

        {/* Profile avatar with fallback initial and hover tooltip */}
        <div className="relative group">
          <div
            className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium select-none"
            aria-hidden={false}
            title={displayName} // simple native tooltip fallback
          >
            {initial}
          </div>

          {/* custom tooltip shown on hover (accessible via CSS, hidden by default) */}
          <div className="pointer-events-none absolute right-0 mt-2 translate-y-1 hidden group-hover:block">
            <div className="bg-black text-white text-sm rounded px-2 py-1 whitespace-nowrap shadow-lg">
              {displayName}
            </div>
          </div>
        </div>
        
      </div>
    </header>
  );
}