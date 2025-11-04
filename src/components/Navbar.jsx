// src/components/Navbar.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Bell, Search } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-xl">
      {/* Gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />

      <div className="relative flex items-center justify-between px-6 py-5">

        {/* ── Logo & Title ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg">
            <div className="w-full h-full rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center backdrop-blur-sm">
              <Sparkles size={18} className="text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Booking & Funds Tracker
          </h1>
        </motion.div>

        {/* ── Right Side: Search + Notification + Mobile Menu ── */}
        <div className="flex items-center gap-4">

          {/* Search (Desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100/70 dark:bg-gray-800/70 rounded-full backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
          >
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-48 placeholder-gray-500"
            />
          </motion.div>

          {/* Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10 hover:from-emerald-500/20 hover:to-teal-500/20 transition-all"
          >
            <Bell size={20} className="text-emerald-600 dark:text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl bg-gray-100/70 dark:bg-gray-800/70 hover:bg-gray-200/70 dark:hover:bg-gray-700/70 transition-all"
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

      {/* ── Mobile Menu (No Links) ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="md:hidden absolute top-full left-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden"
          >
            <div className="p-6 space-y-6">

              {/* Search (Mobile) */}
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-100/70 dark:bg-gray-800/70 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <Search size={20} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="bg-transparent outline-none flex-1 text-sm placeholder-gray-500"
                />
              </div>

              {/* Decorative Cards */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/10 dark:to-purple-400/10 border border-indigo-200/30 dark:border-indigo-700/30 backdrop-blur-sm"
                >
                  <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Total Bookings</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">1,284</p>
                </motion.div>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/10 dark:to-teal-400/10 border border-emerald-200/30 dark:border-emerald-700/30 backdrop-blur-sm"
                >
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Revenue</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-white">₹2.4M</p>
                </motion.div>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;