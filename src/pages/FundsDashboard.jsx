// src/pages/FundsDashboard.jsx
import { useState, useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import FundsChart from "../components/FundsChart";
import { useBooking } from "../context/BookingContext";
import { useExpense } from "../context/ExpenseContext";
import {
  BarChart3, CalendarDays, CalendarRange, CalendarCheck, Receipt,
  Download, Trash2, Plus, Tag
} from "lucide-react";
import { motion } from "framer-motion";
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

  // ── REVENUE BY PERIOD (FIXED: use `let`) ──
  const revenueByPeriod = useMemo(() => {
    const now = new Date();
    const dailyStart = startOfDay(now);
    const weeklyStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
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

  // ── PROFIT = REVENUE - EXPENSES ──
  const profit = useMemo(() => ({
    daily: revenueByPeriod.daily - expenseTotal,
    weekly: revenueByPeriod.weekly - expenseTotal,
    monthly: revenueByPeriod.monthly - expenseTotal,
    yearly: revenueByPeriod.yearly - expenseTotal,
  }), [revenueByPeriod, expenseTotal]);

  // ── BOOKING STATS ──
  const bookingStats = useMemo(() => {
    const total = revenueByPeriod.yearly;
    const avg = bookings.length ? Math.round(total / bookings.length) : 0;
    const highest = bookings.reduce((max, b) => Math.max(max, Number(b.amount) || 0), 0);
    return { total, avg, highest, count: bookings.length };
  }, [revenueByPeriod, bookings]);

  // ── EXPENSE CATEGORIES ──
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

  const renderContent = () => {
    switch (activeTab) {
      case "daily": return <DailyFunds revenue={revenueByPeriod.daily} profit={profit.daily} bookingStats={bookingStats} />;
      case "weekly": return <WeeklyFunds revenue={revenueByPeriod.weekly} profit={profit.weekly} />;
      case "monthly": return <MonthlyFunds revenue={revenueByPeriod.monthly} profit={profit.monthly} />;
      case "yearly": return <YearlyFunds revenue={revenueByPeriod.yearly} profit={profit.yearly} />;
      case "expenses": return (
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
      );
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

          {/* Header */}
          <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Funds & Profit Center
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {bookingStats.count} bookings • ₹{bookingStats.total.toLocaleString()} revenue • ₹{expenseTotal.toLocaleString()} spent
                </p>
              </div>
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 text-sm"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
          </motion.header>

          {/* Tab Bar */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-gray-800 text-blue-600 border-t-2 border-x border-gray-200 dark:border-gray-700"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
};

// ── DAILY FUNDS ──
const DailyFunds = ({ revenue, profit, bookingStats }) => (
  <div className="space-y-8">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Daily Overview</h2>
    <div className="grid md:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-2xl text-white shadow-lg">
        <p className="text-sm opacity-90">Revenue</p>
        <p className="text-2xl font-bold">₹{revenue.toLocaleString()}</p>
      </div>
      <div className="bg-gradient-to-br from-red-500 to-rose-600 p-5 rounded-2xl text-white shadow-lg">
        <p className="text-sm opacity-90">Expenses</p>
        <p className="text-2xl font-bold">₹{(revenue - profit).toLocaleString()}</p>
      </div>
      <div className={`p-5 rounded-2xl text-white shadow-lg ${profit >= 0 ? "bg-gradient-to-br from-lime-500 to-green-600" : "bg-gradient-to-br from-orange-500 to-red-600"}`}>
        <p className="text-sm opacity-90">Net Profit</p>
        <p className="text-2xl font-bold">₹{profit.toLocaleString()}</p>
      </div>
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-2xl text-white shadow-lg">
        <p className="text-sm opacity-90">Avg Booking</p>
        <p className="text-2xl font-bold">₹{bookingStats.avg}</p>
      </div>
    </div>
    <div className="h-80"><FundsChart period="daily" /></div>
  </div>
);

// Reuse for Weekly/Monthly/Yearly
const WeeklyFunds = ({ revenue, profit }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Weekly Funds</h2>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="h-64 sm:h-80"><FundsChart period="weekly" /></div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div><strong>Revenue:</strong> ₹{revenue.toLocaleString()}</div>
        <div><strong>Profit:</strong> <span className={profit >= 0 ? "text-green-600" : "text-red-600"}>₹{profit.toLocaleString()}</span></div>
      </div>
    </div>
  </div>
);

const MonthlyFunds = ({ revenue, profit }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Monthly Funds</h2>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="h-64 sm:h-80"><FundsChart period="monthly" /></div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div><strong>Revenue:</strong> ₹{revenue.toLocaleString()}</div>
        <div><strong>Profit:</strong> <span className={profit >= 0 ? "text-green-600" : "text-red-600"}>₹{profit.toLocaleString()}</span></div>
      </div>
    </div>
  </div>
);

const YearlyFunds = ({ revenue, profit }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Yearly Funds</h2>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="h-64 sm:h-80"><FundsChart period="yearly" /></div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div><strong>Revenue:</strong> ₹{revenue.toLocaleString()}</div>
        <div><strong>Profit:</strong> <span className={profit >= 0 ? "text-green-600" : "text-red-600"}>₹{profit.toLocaleString()}</span></div>
      </div>
    </div>
  </div>
);

// ── EXPENSE TRACKER (unchanged) ──
const ExpenseTracker = ({ expenses, removeExpense, handleAddExpense, desc, setDesc, amount, setAmount, category, setCategory, expenseTotal, categoryTotals, exportCSV }) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Expense Tracker</h2>
      <div className="text-lg font-bold text-red-600 dark:text-red-400">
        Total: ₹{expenseTotal.toLocaleString()}
      </div>
    </div>

    <form onSubmit={handleAddExpense} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input type="text" placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
        <input type="number" min="0.01" step="0.01" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
        <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus size={18} /> Add
        </button>
      </div>
    </form>

    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Tag size={18} /> Top Expense Categories
      </h3>
      <div className="space-y-2">
        {categoryTotals.map((c, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="font-medium">{c.name}</span>
            <span className="text-red-600">-₹{c.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        {expenses.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No expenses recorded</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {expenses.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{format(new Date(e.date), "MMM d")}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">{e.description}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {e.category || "Other"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400">-₹{e.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => removeExpense(e.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
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
);

export default FundsDashboard;