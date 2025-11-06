// src/components/Navbar.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Bell, Search, LogOut, Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { Link } from "react-router-dom";
const Navbar = () => {
  const { unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/signin", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="relative w-full bg-white/80 backdrop-blur-2xl border-b border-gray-200/50 shadow-xl">
      {/* Gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

      <div className="relative flex items-center justify-between px-6 py-5">

        {/* Logo & Title */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-xl bg-white flex items-center justify-center backdrop-blur-sm">
              <Sparkles size={18} className="text-indigo-600" />
            </div>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            CRM
          </h1>
        </motion.div>

        {/* Right Side: Wallets + Search + Notification + Logout + Mobile Menu */}
        <div className="flex items-center gap-3">

          {/* Wallets (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-200/30 backdrop-blur-sm"
            >
              <Wallet size={16} className="text-indigo-600" />
              <div>
                <p className="text-xs text-indigo-600 font-medium">Main Wallet</p>
                <p className="text-sm font-bold text-gray-800">₹1,84,500</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-200/30 backdrop-blur-sm"
            >
              <Wallet size={16} className="text-emerald-600" />
              <div>
                <p className="text-xs text-emerald-600 font-medium">Expense</p>
                <p className="text-sm font-bold text-gray-800">₹42,300</p>
              </div>
            </motion.div>
          </div>

          {/* Search (Desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100/70 rounded-full backdrop-blur-sm border border-gray-200/50"
          >
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-48 placeholder-gray-500"
            />
          </motion.div>

          {/* Notification Bell */}
<Link to="/notifications">
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="relative p-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all"
  >
    <Bell size={20} className="text-emerald-600" />

    {unreadCount > 0 && (
      <>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>

        <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
      </>
    )}
  </motion.button>
</Link>

          {/* Logout Button (Desktop) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 font-medium rounded-xl border border-red-200/30 transition-all"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl bg-gray-100/70 hover:bg-gray-200/70 transition-all"
          >
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="md:hidden absolute top-full left-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl overflow-hidden"
          >
            <div className="p-6 space-y-6">

              {/* Search (Mobile) */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-100/70 rounded-2xl backdrop-blur-sm border border-gray-200/50">
                <Search size={20} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
                />
              </div>

              {/* Wallets (Mobile) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-200/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-indigo-600" />
                    <p className="text-xs font-medium text-indigo-600">Main Wallet</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">₹1,84,500</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/30 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-emerald-600" />
                    <p className="text-xs font-medium text-emerald-600">Expense</p>
                  </div>
                  <p className="text-lg font-bold text-gray-800 mt-1">₹42,300</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-2xl shadow-lg"
                >
                  New Booking
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-2xl shadow-lg"
                >
                  Add Expense
                </motion.button>
              </div>

              {/* Logout Button (Mobile) */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 font-semibold rounded-2xl border border-red-200/30 transition-all flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;