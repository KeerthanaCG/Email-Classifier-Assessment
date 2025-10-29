"use client";
import React from "react";

interface NavbarProps {
  user?: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const userName =
    user?.name ||
    user?.displayName ||
    (typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")?.name
      : null) ||
    "User";

  return (
    <nav className="bg-slate-800 border-b border-slate-700 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-wide">
          Email Classifier
        </h1>
        <span className="text-slate-400 text-sm">AI-powered Inbox</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-slate-300 text-sm">{userName}</span>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 text-sm px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
