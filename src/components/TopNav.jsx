// src/components/layout/TopNav.jsx
import React from "react";
import { Bell, User } from "lucide-react";

export default function TopNav() {
  return (
    <header className="bg-white/60 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-30 flex items-center justify-between px-6 py-3 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">Experience Tracker</h2>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-all">
          <Bell size={18} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            U
          </div>
          <span className="text-sm text-gray-700 font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
}
