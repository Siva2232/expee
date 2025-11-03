// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  BarChart2,
  Calendar,
  Settings,
  LogOut,
  User,
  Zap,
  Target,
  Trophy,
  ChevronRight,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Realistic user data (from auth context)
  const displayName = user?.name || "Alex Turner";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const streak = 12;
  const level = 7;
  const xpProgress = 68; // %

  const links = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard", badge: null },
    { name: "Focus Tracker", icon: <Zap size={18} />, path: "/tracker", badge: "Live" },
    { name: "Reports", icon: <BarChart2 size={18} />, path: "/reports", badge: null },
    { name: "Goals", icon: <Target size={18} />, path: "/goals", badge: "3" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings", badge: null },
  ];

  const handleLogout = () => {
    logout();
    navigate("/auth/signin");
  };

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-white/80 backdrop-blur-xl border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 flex flex-col shadow-lg`}
    >
      {/* === HEADER: Logo + Toggle === */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            T
          </div>
          {isOpen && (
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Tracker
            </h1>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-all hover:scale-110"
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* === USER PROFILE CARD === */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {avatarInitial}
            </div>
            {streak > 7 && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Trophy size={10} className="text-white" />
              </div>
            )}
          </div>

          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Level {level}</span>
                <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <span className="text-indigo-600 font-medium">{xpProgress}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Streak Badge */}
        {isOpen && streak > 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs font-medium text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full w-fit">
            <Trophy size={14} />
            <span>{streak}-day streak</span>
          </div>
        )}
      </div>

      {/* === NAVIGATION LINKS === */}
      <nav className="flex-1 mt-3 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            end
            className={({ isActive }) =>
              `group relative flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <div className={isOpen ? "" : "mx-auto"}>{link.icon}</div>
              {isOpen && <span className="text-sm font-medium">{link.name}</span>}
            </div>

            {/* Badge */}
            {link.badge && isOpen && (
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  link.badge === "Live"
                    ? "bg-green-100 text-green-700 animate-pulse"
                    : "bg-indigo-100 text-indigo-700"
                }`}
              >
                {link.badge}
              </span>
            )}

            {/* Tooltip when collapsed */}
            {!isOpen && (
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                {link.name}
                {link.badge && (
                  <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded text-xs">
                    {link.badge}
                  </span>
                )}
                <ChevronRight size={12} className="inline ml-1" />
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* === QUICK STATS === */}
      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-100 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Today</span>
            <span className="font-semibold text-indigo-600">6h 42m</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Weekly Goal</span>
            <span className="font-semibold text-green-600">84%</span>
          </div>
        </div>
      )}

      {/* === LOGOUT === */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
            text-red-600 hover:bg-red-50 hover:shadow-sm`}
        >
          <LogOut size={18} />
          {isOpen && "Logout"}
          {!isOpen && (
            <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight size={16} />
            </span>
          )}
        </button>
      </div>

      {/* === FOOTER === */}
      <div className="p-3 text-center">
        {isOpen ? (
          <p className="text-xs text-gray-400">
            © 2025 <span className="font-medium text-indigo-600">Uxinity</span> — v2.1.0
          </p>
        ) : (
          <div className="w-6 h-6 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-60" />
        )}
      </div>
    </aside>
  );
}