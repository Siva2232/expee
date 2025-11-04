// src/pages/FundsDashboard.jsx
import { useState, useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import FundsChart from "../components/FundsChart";
import { useBooking } from "../context/BookingContext";
import { useExpense } from "../context/ExpenseContext";
import {
  BarChart3, CalendarDays, CalendarRange, CalendarCheck, Receipt,
  Download, Trash2, Plus, Tag, TrendingUp, DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import { saveAs } from "file-saver";

const tabs = [
  { id: "daily", label: "Daily", icon: BarChart3 },
  { id: "weekly", label: "Weekly", icon: CalendarDays },
  { id: "monthly", label: "Monthly", icon: CalendarRange },
  { id: "yearly", label: "Yearly", icon: CalendarCheck },
  { id: "expenses", label: "Expenses", icon: Receipt },
];

const CATEGORIES = ["Fuel", "Salary", "Rent", "Marketing", "Maintenance", "Other"];

const FundsDashboard = () => {
  const [activeTab, setActiveTab] = useState("daily");
  const { bookings = [] } = useBooking();
  const { expenses = [], addExpense, removeExpense, total: expenseTotal } = useExpense();

  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  // Revenue by Period
  const revenueByPeriod = useMemo(() => {
    const now = new Date();
    const dailyStart = startOfDay(now);
    const weeklyStart = startOfWeek(now, { weekStartsOn: 1 });
    const monthlyStart = startOfMonth(now);
    const yearlyStart = startOfYear(now);

    let daily = 0, weekly = 0, monthly = 0, yearly = 0;

    bookings.forEach(b => {
      const date = new Date(b.date);
      const amt = Number(b.amount) || 0;

      if (date >= yearlyStart) yearly += amt;
      if (date >= monthlyStart) monthly += amt;
      if (date >= weeklyStart) weekly += amt;
      if (date >= dailyStart) daily += amt;
    });

    return { daily, weekly, monthly, yearly };
  }, [bookings]);

  // Profit
  const profit = useMemo(() => ({
    daily: revenueByPeriod.daily - expenseTotal,
    weekly: revenueByPeriod.weekly - expenseTotal,
    monthly: revenueByPeriod.monthly - expenseTotal,
    yearly: revenueByPeriod.yearly - expenseTotal,
  }), [revenueByPeriod, expenseTotal]);

  // Booking Stats
  const bookingStats = useMemo(() => {
    const total = revenueByPeriod.yearly;
    const avg = bookings.length ? Math.round(total / bookings.length) : 0;
    const highest = bookings.reduce((max, b) => Math.max(max, Number(b.amount) || 0), 0);
    return { total, avg, highest, count: bookings.length };
  }, [revenueByPeriod, bookings]);

  // Expense Categories
  const categoryTotals = useMemo(() => {
    const map = {};
    CATEGORIES.forEach(c => map[c] = 0);
    expenses.forEach(e => {
      const cat = e.category || "Other";
      map[cat] = (map[cat] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (desc.trim() && amount > 0) {
      addExpense(desc.trim(), Number(amount), category);
      setDesc(""); setAmount(""); setCategory(CATEGORIES[0]);
    }
  };

  const exportCSV = () => {
    const headers = "Type,Date,Description,Amount,Category\n";
    const rows = [
      ...bookings.map(b => `Booking,${format(new Date(b.date), "yyyy-MM-dd")},${b.customerName},${b.amount},`),
      ...expenses.map(e => `Expense,${format(new Date(e.date), "yyyy-MM-dd")},${e.description},${-e.amount},${e.category || "Other"}`)
    ];
    const csv = headers + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, `financial-report-${format(new Date(), "yyyy-MM-dd")}.csv`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

          {/* === PREMIUM HEADER === */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 shadow-2xl text-white"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-10 h-10 text-white/90" />
                  <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 animate-gradient-x">
                    Funds & Profit Center
                  </h1>
                </div>
                <p className="text-lg text-blue-50 max-w-md">
                  Real-time financial insights, profit tracking, and expense management.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <TrendingUp size={18} className="text-green-300" />
                    <span className="font-semibold">{bookingStats.count}</span>
                    <span className="text-blue-100">Bookings</span>
                  </div>
                  <div className="text-blue-100">
                    ₹{bookingStats.total.toLocaleString()} revenue • ₹{expenseTotal.toLocaleString()} spent
                  </div>
                </div>
              </div>

              <button
                onClick={exportCSV}
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-white text-indigo-600 font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-50 transition-opacity"></span>
                <Download size={22} className="relative z-10" />
                <span className="relative z-10">Export Report</span>
              </button>
            </div>
          </motion.header>

          {/* === ANIMATED TAB BAR === */}
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-2">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                      isActive
                        ? "text-indigo-600 shadow-md"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl -z-10"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* === ANIMATED CONTENT === */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "daily" && <DailyFunds revenue={revenueByPeriod.daily} profit={profit.daily} bookingStats={bookingStats} />}
              {activeTab === "weekly" && <WeeklyFunds revenue={revenueByPeriod.weekly} profit={profit.weekly} />}
              {activeTab === "monthly" && <MonthlyFunds revenue={revenueByPeriod.monthly} profit={profit.monthly} />}
              {activeTab === "yearly" && <YearlyFunds revenue={revenueByPeriod.yearly} profit={profit.yearly} />}
              {activeTab === "expenses" && (
                <ExpenseTracker
                  expenses={expenses}
                  removeExpense={removeExpense}
                  handleAddExpense={handleAddExpense}
                  desc={desc} setDesc={setDesc}
                  amount={amount} setAmount={setAmount}
                  category={category} setCategory={setCategory}
                  expenseTotal={expenseTotal}
                  categoryTotals={categoryTotals}
                  exportCSV={exportCSV}
                />
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* === CSS ANIMATIONS === */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease infinite;
        }
      `}</style>
    </DashboardLayout>
  );
};

// === ENHANCED COMPONENTS ===

const DailyFunds = ({ revenue, profit, bookingStats }) => (
  <div className="space-y-8">
    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
      <BarChart3 className="text-indigo-600" /> Daily Overview
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: "Revenue", value: revenue, gradient: "from-emerald-500 to-teal-600" },
        { label: "Expenses", value: revenue - profit, gradient: "from-rose-500 to-pink-600" },
        { label: "Net Profit", value: profit, gradient: profit >= 0 ? "from-lime-500 to-green-600" : "from-orange-500 to-red-600" },
        { label: "Avg Booking", value: bookingStats.avg, gradient: "from-blue-500 to-indigo-600" },
      ].map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl text-white shadow-xl backdrop-blur-sm`}
        >
          <p className="text-white/80 text-sm font-medium">{stat.label}</p>
          <p className="text-3xl font-bold mt-1">₹{stat.value.toLocaleString()}</p>
        </motion.div>
      ))}
    </div>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
    >
      <div className="h-80"><FundsChart period="daily" /></div>
    </motion.div>
  </div>
);

const WeeklyFunds = ({ revenue, profit }) => <PeriodCard title="Weekly" revenue={revenue} profit={profit} period="weekly" />;
const MonthlyFunds = ({ revenue, profit }) => <PeriodCard title="Monthly" revenue={revenue} profit={profit} period="monthly" />;
const YearlyFunds = ({ revenue, profit }) => <PeriodCard title="Yearly" revenue={revenue} profit={profit} period="yearly" />;

const PeriodCard = ({ title, revenue, profit, period }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6"
  >
    <h2 className="text-2xl font-bold text-gray-800">{title} Performance</h2>
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="h-80"><FundsChart period={period} /></div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-lg font-medium">
        <div className="flex justify-between">
          <span className="text-gray-600">Revenue:</span>
          <span className="text-emerald-600">₹{revenue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Profit:</span>
          <span className={profit >= 0 ? "text-green-600" : "text-red-600"}>
            ₹{profit.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const ExpenseTracker = ({ expenses, removeExpense, handleAddExpense, desc, setDesc, amount, setAmount, category, setCategory, expenseTotal, categoryTotals }) => (
  <div className="space-y-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
        <Receipt className="text-rose-600" /> Expense Tracker
      </h2>
      <div className="text-xl font-bold text-rose-600">
        Total: ₹{expenseTotal.toLocaleString()}
      </div>
    </div>

    <motion.form
      onSubmit={handleAddExpense}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
    >
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
        />
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-blue-700 transform hover:scale-105 transition shadow-md"
        >
          <Plus size={20} /> Add Expense
        </button>
      </div>
    </motion.form>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Tag className="text-indigo-600" /> Top Categories
        </h3>
        <div className="space-y-3">
          {categoryTotals.map((c, i) => (
            <div key={i} className="flex justify-between items-center">
              <span className="font-medium text-gray-700">{c.name}</span>
              <span className="text-rose-600 font-bold">-₹{c.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <h3 className="text-lg font-semibold mb-4">Recent Expenses</h3>
        <div className="max-h-64 overflow-y-auto">
          {expenses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No expenses yet</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Desc</th>
                  <th className="pb-2">Amt</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.slice(0, 5).map(e => (
                  <tr key={e.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-2 text-gray-600">{format(new Date(e.date), "MMM d")}</td>
                    <td className="py-2 font-medium">{e.description}</td>
                    <td className="py-2 text-rose-600 font-medium">-₹{e.amount.toFixed(0)}</td>
                    <td className="py-2 text-right">
                      <button onClick={() => removeExpense(e.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default FundsDashboard;