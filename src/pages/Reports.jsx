// src/pages/Reports.jsx
import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  subYears,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { saveAs } from "file-saver";
import { useBooking } from "../context/BookingContext";
import { useExpense } from "../context/ExpenseContext";
import DashboardLayout from "../components/DashboardLayout";

import {
  Download, Calendar, TrendingUp, TrendingDown, Users, DollarSign,
  FileText, Filter, BarChart3, PieChart, Activity, Target,
  ArrowUpRight, ArrowDownRight, Clock, AlertCircle, CheckCircle,
  IndianRupee, ShoppingCart, Wrench, Fuel, Briefcase, Coffee,
} from "lucide-react";

import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area,
} from "recharts";

const Reports = () => {
  const { bookings = [] } = useBooking();
  const { expenses = [] } = useExpense();

  const [dateRange, setDateRange] = useState("thisMonth");
  const [reportType, setReportType] = useState("overview");

  // Date-range logic
  const { start, end } = useMemo(() => {
    const now = new Date();
    let s, e;
    switch (dateRange) {
      case "lastMonth": s = startOfMonth(subMonths(now, 1)); e = endOfMonth(subMonths(now, 1)); break;
      case "last3Months": s = startOfMonth(subMonths(now, 3)); e = endOfMonth(now); break;
      case "last6Months": s = startOfMonth(subMonths(now, 6)); e = endOfMonth(now); break;
      case "thisYear": s = new Date(now.getFullYear(), 0, 1); e = now; break;
      case "lastYear": s = new Date(now.getFullYear() - 1, 0, 1); e = new Date(now.getFullYear() - 1, 11, 31); break;
      default: s = startOfMonth(now); e = endOfMonth(now);
    }
    return { start: s, end: e };
  }, [dateRange]);

  // Filter data
  const filteredBookings = useMemo(() => bookings.filter(b => new Date(b.date) >= start && new Date(b.date) <= end), [bookings, start, end]);
  const filteredExpenses = useMemo(() => expenses.filter(e => new Date(e.date) >= start && new Date(e.date) <= end), [expenses, start, end]);

  // Core Metrics
  const totalRevenue = filteredBookings.reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const totalExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue ? ((netProfit / totalRevenue) * 100).toFixed(1) : 0;
  const bookingCount = filteredBookings.length;
  const avgBookingValue = bookingCount ? Math.round(totalRevenue / bookingCount) : 0;

  // Growth
  const prevPeriod = useMemo(() => {
    const diff = end.getTime() - start.getTime();
    return { start: new Date(start.getTime() - diff - 1), end: new Date(end.getTime() - diff - 1) };
  }, [start, end]);

  const prevRevenue = bookings
    .filter(b => new Date(b.date) >= prevPeriod.start && new Date(b.date) <= prevPeriod.end)
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);
  const revenueGrowth = prevRevenue ? ((totalRevenue - prevRevenue) / prevRevenue * 100).toFixed(1) : 0;

  // 12-month trend
  const monthlyTrend = useMemo(() => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const mStart = startOfMonth(date);
      const mEnd = endOfMonth(date);
      const rev = bookings.filter(b => new Date(b.date) >= mStart && new Date(b.date) <= mEnd).reduce((s, b) => s + (Number(b.amount) || 0), 0);
      const exp = expenses.filter(e => new Date(e.date) >= mStart && new Date(e.date) <= mEnd).reduce((s, e) => s + e.amount, 0);
      data.push({ month: format(date, "MMM"), revenue: rev, expense: exp, profit: rev - exp });
    }
    return data;
  }, [bookings, expenses]);

  // Top Customers
  const topCustomers = useMemo(() => {
    const map = {};
    filteredBookings.forEach(b => { map[b.customerName || "Unknown"] = (map[b.customerName || "Unknown"] || 0) + (Number(b.amount) || 0); });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [filteredBookings]);

  // Expense by Category
  const expenseByCategory = useMemo(() => {
    const map = { Fuel: 0, Salary: 0, Rent: 0, Marketing: 0, Maintenance: 0, Other: 0 };
    filteredExpenses.forEach(e => { map[e.category || "Other"] = (map[e.category || "Other"] || 0) + e.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value })).filter(c => c.value > 0);
  }, [filteredExpenses]);

  const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#6366f1"];

  // Export CSV
  const exportCSV = () => {
    const headers = "Type,Date,Description,Amount,Category/Customer\n";
    const rows = [
      ...filteredBookings.map(b => `Booking,${format(new Date(b.date), "yyyy-MM-dd")},${b.customerName},${b.amount},`),
      ...filteredExpenses.map(e => `Expense,${format(new Date(e.date), "yyyy-MM-dd")},${e.description},${-e.amount},${e.category || "Other"}`)
    ];
    const csv = headers + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, `report-${format(start, "yyyy-MM-dd")}-to-${format(end, "yyyy-MM-dd")}.csv`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

          {/* === PREMIUM HEADER === */}
          <motion.header
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl text-white"
          >
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-10 h-10 text-white/90" />
                  <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-100 animate-gradient-x">
                    Advanced Reports
                  </h1>
                </div>
                <p className="text-lg text-white/90">
                  {format(start, "MMM d")} – {format(end, "MMM d, yyyy")}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Users size={16} /> {bookingCount} bookings
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <DollarSign size={16} /> ₹{totalRevenue.toLocaleString()} revenue
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

          {/* === FILTERS === */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-3 flex-wrap">
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="px-5 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition"
              >
                <Calendar size={16} />
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
                <option value="last3Months">Last 3 Months</option>
                <option value="last6Months">Last 6 Months</option>
                <option value="thisYear">This Year</option>
                <option value="lastYear">Last Year</option>
              </select>

              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="px-5 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-sm font-medium flex items-center gap-2 shadow-sm hover:shadow-md transition"
              >
                <Filter size={16} />
                <option value="overview">Overview</option>
                <option value="revenue">Revenue</option>
                <option value="expenses">Expenses</option>
                <option value="customers">Customers</option>
                <option value="performance">Performance</option>
              </select>
            </div>
          </div>

          {/* === KPI CARDS === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { label: "Revenue", value: totalRevenue, growth: revenueGrowth, icon: DollarSign, gradient: "from-indigo-500 to-purple-600" },
              { label: "Expenses", value: totalExpense, icon: ShoppingCart, gradient: "from-rose-500 to-red-600" },
              { label: "Net Profit", value: netProfit, margin: profitMargin, icon: Target, gradient: netProfit >= 0 ? "from-emerald-500 to-teal-600" : "from-orange-500 to-red-600" },
              { label: "Bookings", value: bookingCount, icon: Users, gradient: "from-blue-500 to-cyan-600" },
              { label: "Avg Booking", value: avgBookingValue, icon: IndianRupee, gradient: "from-amber-500 to-orange-600" },
            ].map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative overflow-hidden bg-gradient-to-br ${kpi.gradient} p-6 rounded-2xl text-white shadow-xl backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{kpi.label}</p>
                    <p className="text-2xl font-bold mt-1">₹{kpi.value.toLocaleString()}</p>
                    {kpi.growth !== undefined && (
                      <p className="text-xs mt-1 flex items-center gap-1">
                        {kpi.growth > 0 ? <ArrowUpRight size={14} className="text-emerald-300" /> : <ArrowDownRight size={14} className="text-rose-300" />}
                        <span className={kpi.growth > 0 ? "text-emerald-300" : "text-rose-300"}>{Math.abs(kpi.growth)}%</span>
                      </p>
                    )}
                    {kpi.margin && <p className="text-xs mt-1">{kpi.margin}% margin</p>}
                  </div>
                  <kpi.icon size={28} className="opacity-80" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* === CHARTS === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trend Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity size={20} className="text-indigo-600" /> Revenue & Profit Trend
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8b5cf6" fill="url(#revenue)" />
                    <Area type="monotone" dataKey="expense" stackId="1" stroke="#ef4444" fill="url(#expense)" />
                    <Area type="monotone" dataKey="profit" stroke="#10b981" fill="url(#profit)" />
                    <defs>
                      <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c4b5fd" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#c4b5fd" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#fca5a5" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="profit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#86efac" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#86efac" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Pie Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart size={20} className="text-indigo-600" /> Expense Breakdown
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={expenseByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseByCategory.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* === BOTTOM SECTION === */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Customers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users size={20} className="text-indigo-600" /> Top Customers
              </h3>
              <div className="space-y-3">
                {topCustomers.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{c.name}</p>
                        <p className="text-xs text-gray-500">₹{c.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-indigo-600">
                      {(c.amount / totalRevenue * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock size={20} className="text-indigo-600" /> Recent Activity
              </h3>
              <div className="space-y-3 text-sm">
                {[...filteredBookings.map(b => ({ ...b, amount: Number(b.amount) })), ...filteredExpenses.map(e => ({ ...e, amount: -e.amount }))]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition">
                      <div className="flex items-center gap-2">
                        {item.amount > 0 ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-rose-500" />}
                        <span className="text-gray-700 truncate max-w-32">{item.customerName || item.description}</span>
                      </div>
                      <span className={item.amount > 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                        ₹{Math.abs(item.amount).toFixed(0)}
                      </span>
                    </div>
                  ))}
              </div>
            </motion.div>
          </div>

          {/* === PERFORMANCE METRICS === */}
          <AnimatePresence>
            {reportType === "performance" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {[
                  { label: "Booking Conversion", value: "78.4%", change: "+12.3%", icon: BarChart3, gradient: "from-cyan-500 to-blue-600" },
                  { label: "Fuel Efficiency", value: "12.8 km/L", change: "-0.4 L/100km", icon: Fuel, gradient: "from-amber-500 to-orange-600" },
                  { label: "Employee Cost", value: "₹42K", change: "per driver", icon: Briefcase, gradient: "from-violet-500 to-purple-600" },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className={`p-6 bg-gradient-to-br ${m.gradient} rounded-2xl text-white shadow-xl`}
                  >
                    <m.icon size={28} />
                    <p className="text-sm mt-2 opacity-90">{m.label}</p>
                    <p className="text-3xl font-bold">{m.value}</p>
                    <p className="text-xs mt-1 opacity-80">{m.change}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* === ANIMATIONS === */}
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

export default Reports;