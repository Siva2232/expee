// src/pages/FinanceDashboard.jsx
import React, { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Plus,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  X,
} from "lucide-react";
import {
  format,
  startOfWeek,
  startOfMonth,
  startOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  isWithinInterval,
} from "date-fns";
import LineChart from "../components/charts/LineChart";
import BarChart from "../components/charts/BarChart";

export default function FinanceDashboard() {
  // -----------------------------------------------------------------
  // 1. STATE
  // -----------------------------------------------------------------
  const [transactions, setTransactions] = useState([]); // ← empty, you fill it
  const [view, setView] = useState("monthly"); // daily | weekly | monthly | yearly
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  // -----------------------------------------------------------------
  // 2. HELPERS – date ranges
  // -----------------------------------------------------------------
  const range = useMemo(() => {
    const now = new Date();
    if (view === "daily") return { start: subDays(now, 6), end: now };
    if (view === "weekly") return { start: subWeeks(now, 3), end: now };
    if (view === "monthly") return { start: subMonths(now, 11), end: now };
    return { start: subYears(now, 2), end: now };
  }, [view]);

  // -----------------------------------------------------------------
  // 3. FILTERED TRANSACTIONS
  // -----------------------------------------------------------------
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const inDate = isWithinInterval(t.date, range);
      const inCat = filterCategory === "all" || t.category === filterCategory;
      return inDate && inCat;
    });
  }, [transactions, range, filterCategory]);

  // -----------------------------------------------------------------
  // 4. AGGREGATE BY PERIOD (for line / bar chart)
  // -----------------------------------------------------------------
  const aggregated = useMemo(() => {
    const map = new Map();

    filtered.forEach((t) => {
      let key;
      if (view === "daily") key = format(t.date, "MMM dd");
      else if (view === "weekly") key = `Wk ${format(startOfWeek(t.date), "w")}`;
      else if (view === "monthly") key = format(t.date, "MMM yyyy");
      else key = format(t.date, "yyyy");

      if (!map.has(key)) map.set(key, { income: 0, expense: 0 });
      const bucket = map.get(key);
      if (t.type === "income") bucket.income += t.amount;
      else bucket.expense += Math.abs(t.amount);
    });

    return Array.from(map, ([label, data]) => ({
      label,
      income: data.income,
      expense: data.expense,
      profit: data.income - data.expense,
    }));
  }, [filtered, view]);

  // -----------------------------------------------------------------
  // 5. TOTALS
  // -----------------------------------------------------------------
  const totalIncome = filtered.reduce((s, t) => (t.type === "income" ? s + t.amount : s), 0);
  const totalExpense = filtered.reduce((s, t) => (t.type === "expense" ? s + Math.abs(t.amount) : s), 0);
  const totalProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome ? ((totalProfit / totalIncome) * 100).toFixed(1) : 0;

  // -----------------------------------------------------------------
  // 6. CATEGORY BREAKDOWN (for donut)
  // -----------------------------------------------------------------
  const categoryBreakdown = useMemo(() => {
    const map = new Map();
    filtered.forEach((t) => {
      if (t.type === "expense") {
        map.set(t.category, (map.get(t.category) || 0) + Math.abs(t.amount));
      }
    });
    return Array.from(map, ([name, value]) => ({
      name,
      value,
      color: `hsl(${Math.random() * 360}, 70%, 55%)`,
    }));
  }, [filtered]);

  // -----------------------------------------------------------------
  // 7. ADD TRANSACTION HANDLER
  // -----------------------------------------------------------------
  const addTransaction = (data) => {
    setTransactions((prev) => [
      ...prev,
      { id: Date.now(), date: new Date(data.date), ...data },
    ]);
    setShowAddModal(false);
  };

  // -----------------------------------------------------------------
  // 8. RENDER
  // -----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ==== HEADER ==== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              Finance Tracker
            </h1>
            <p className="text-gray-600 mt-1">
              Daily • Weekly • Monthly • Yearly profit & expense overview
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View selector */}
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition"
            >
              <Plus className="w-5 h-5" /> Add
            </button>
          </div>
        </div>

        {/* ==== KPI CARDS ==== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Income",
              value: `$${totalIncome.toLocaleString()}`,
              icon: TrendingUp,
              color: "from-green-500 to-emerald-500",
              trend: totalIncome > 0 ? "positive" : "neutral",
            },
            {
              label: "Total Expense",
              value: `$${totalExpense.toLocaleString()}`,
              icon: TrendingDown,
              color: "from-red-500 to-rose-500",
              trend: totalExpense > 0 ? "negative" : "neutral",
            },
            {
              label: "Net Profit",
              value: `$${totalProfit.toLocaleString()}`,
              icon: DollarSign,
              color: totalProfit >= 0 ? "from-blue-500 to-cyan-500" : "from-red-500 to-rose-500",
              trend: totalProfit >= 0 ? "positive" : "negative",
            },
            {
              label: "Profit Margin",
              value: `${profitMargin}%`,
              icon: ArrowUpRight,
              color: "from-purple-500 to-pink-500",
              trend: "neutral",
            },
          ].map((kpi, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color} text-white`}>
                  <kpi.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ==== CHARTS ==== */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Line / Bar – Income vs Expense */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {view.charAt(0).toUpperCase() + view.slice(1)} Trend
            </h3>
            <LineChart
              data={aggregated.map((d) => ({
                label: d.label,
                income: d.income,
                expense: d.expense,
              }))}
              height={300}
              showGrid
              showTooltip
            />
          </div>

          {/* Donut – Expense categories */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Expense Breakdown</h3>
            <p className="text-sm text-gray-600 mb-4">
              {categoryBreakdown.length === 0 ? "No expenses yet" : ""}
            </p>
            {categoryBreakdown.length > 0 && (
              <BarChart data={categoryBreakdown} height={240} />
            )}
          </div>
        </div>

        {/* ==== RECENT TRANSACTIONS ==== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button
  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
>
  View all
</button>
          </div>

          <div className="space-y-3">
            {filtered.slice(-5).reverse().map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      t.type === "income" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-gray-900">{t.category}</p>
                    <p className="text-xs text-gray-500">
                      {format(t.date, "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-semibold ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}${Math.abs(t.amount).toLocaleString()}
                </p>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-gray-500 py-6">
                No transactions in this period. Click “Add” to start tracking.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ==== ADD TRANSACTION MODAL ==== */}
      {showAddModal && (
        <TransactionModal
          onSave={addTransaction}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------
   MODAL – Add / Edit Transaction
   ------------------------------------------------------------- */
function TransactionModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    date: format(new Date(), "yyyy-MM-dd"),
    note: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category) return;
    onSave({
      type: form.type,
      amount: form.type === "income" ? +form.amount : -Math.abs(+form.amount),
      category: form.category,
      date: form.date,
      note: form.note,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">New Transaction</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="income"
                checked={form.type === "income"}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="text-green-600"
              />
              <span>Income</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="expense"
                checked={form.type === "expense"}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="text-red-600"
              />
              <span>Expense</span>
            </label>
          </div>

          <input
            type="number"
            placeholder="Amount"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            placeholder="Category (e.g., Rent, Salary)"
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="text"
            placeholder="Note (optional)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}