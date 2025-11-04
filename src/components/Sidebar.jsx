import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Book,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  User,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth(); // ← get loading flag

  const links = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Bookings", path: "/bookings", icon: Book },
    { name: "Funds", path: "/funds", icon: Wallet },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = () => logout();

  // -------------------------------------------------
  // 1. Show a tiny spinner while the context is hydrating
  // -------------------------------------------------
  if (loading) {
    return (
      <aside className="flex h-full w-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </aside>
    );
  }

  // -------------------------------------------------
  // 2. If we *still* have no user → redirect to sign-in
  // -------------------------------------------------
  if (!user) {
    // This should never happen after loading, but guard anyway
    navigate("/signin", { replace: true });
    return null;
  }

  return (
    <aside className="flex h-full w-full flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-lg">
            CP
          </div>
          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">
            Control Panel
          </h1>
        </div>
      </div>

      {/* User Profile – DYNAMIC */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 p-0.5 shadow-md">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-gray-800">
              <User size={18} className="text-gray-700 dark:text-gray-300" />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400 max-w-[150px]">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {links.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            end
            className={({ isActive }) =>
              `group relative flex items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "text-white shadow-lg"
                  : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  size={20}
                  className={`relative z-10 transition-colors ${
                    isActive ? "text-white" : "group-hover:text-blue-600"
                  }`}
                />
                <span className="relative z-10">{name}</span>
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-blue-50 opacity-0 transition-opacity group-hover:opacity-100 dark:bg-blue-900/20" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-600 transition hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={20} className="transition-transform group-hover:scale-110" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;