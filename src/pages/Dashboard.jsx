// src/pages/Dashboard.jsx
import { useState, useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import FundsChart from "../components/FundsChart";
import { useBooking } from "../context/BookingContext";
import { useFunds } from "../context/FundsContext";
import { useExpense } from "../context/ExpenseContext";
import { useAuth } from "../context/AuthContext";
import {
  TrendingUp, Calendar, DollarSign, Activity,
  Download, Search, Clock, UserCheck, FileText,
  ArrowUpRight, ArrowDownRight, Receipt, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  isWithinInterval,
} from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const Dashboard = () => {
  const { bookings = [], isLoading: bookingsLoading } = useBooking();
  const { totals = {} } = useFunds();
  const { expenses = [] } = useExpense();
  const { user } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Current & Previous Month
  const currentPeriod = useMemo(() => {
    const now = new Date();
    return { start: startOfMonth(now), end: endOfMonth(now) };
  }, []);

  const previousPeriod = useMemo(() => {
    const prev = subMonths(new Date(), 1);
    return { start: startOfMonth(prev), end: endOfMonth(prev) };
  }, []);

  // Filter by range
  const filterByRange = (items, range) =>
    items.filter(item => {
      const d = new Date(item.date);
      return isWithinInterval(d, { start: range.start, end: range.end });
    });

  // Data
  const currentBookings = filterByRange(bookings, currentPeriod);
  const previousBookings = filterByRange(bookings, previousPeriod);
  const currentExpenses = filterByRange(expenses, currentPeriod);
  const previousExpenses = filterByRange(expenses, previousPeriod);

  const currentExpenseTotal = currentExpenses.reduce((s, e) => s + e.amount, 0);
  const prevExpenseTotal = previousExpenses.reduce((s, e) => s + e.amount, 0);

  // Current Stats
  const currentStats = useMemo(() => {
    const total = currentBookings.reduce((s, b) => s + (b.amount || 0), 0);
    const count = currentBookings.length;
    const avg = count > 0 ? total / count : 0;
    const highest = currentBookings.reduce((m, b) => Math.max(m, b.amount || 0), 0);
    return { total, count, avg: Math.round(avg), highest };
  }, [currentBookings]);

  // Previous Stats
  const previousStats = useMemo(() => {
    const total = previousBookings.reduce((s, b) => s + (b.amount || 0), 0);
    const count = previousBookings.length;
    const avg = count > 0 ? total / count : 0;
    const highest = previousBookings.reduce((m, b) => Math.max(m, b.amount || 0), 0);
    return { total, count, avg: Math.round(avg), highest };
  }, [previousBookings]);

  // Trend Calculator
  const calcTrend = (cur, prev) => {
    if (prev === 0) return { value: "N/A", change: 0, isPositive: false };
    const change = ((cur - prev) / prev) * 100;
    const isPositive = change >= 0;
    return {
      value: `${isPositive ? "+" : ""}${change.toFixed(1)}%`,
      change: Math.abs(change),
      isPositive,
    };
  };

  const trends = {
    bookings: calcTrend(currentStats.count, previousStats.count),
    revenue: calcTrend(currentStats.total, previousStats.total),
    avgBooking: calcTrend(currentStats.avg, previousStats.avg),
    highest: currentStats.highest > previousStats.highest
      ? { value: "New Record", change: 100, isPositive: true }
      : { value: "–", change: 0, isPositive: false },
    expenses: calcTrend(currentExpenseTotal, prevExpenseTotal),
    profit: calcTrend(
      currentStats.total - currentExpenseTotal,
      previousStats.total - prevExpenseTotal
    ),
  };

  // Stats Cards
  const stats = [
    { title: "Total Bookings", value: currentStats.count, trend: trends.bookings, icon: Calendar, gradient: "from-violet-500 to-purple-600" },
    { title: "Total Revenue", value: `₹${currentStats.total.toLocaleString()}`, trend: trends.revenue, icon: DollarSign, gradient: "from-emerald-500 to-teal-600" },
    { title: "Avg Booking", value: `₹${currentStats.avg.toLocaleString()}`, trend: trends.avgBooking, icon: TrendingUp, gradient: "from-cyan-500 to-blue-600" },
    { title: "Highest Booking", value: `₹${currentStats.highest.toLocaleString()}`, trend: trends.highest, icon: AlertTriangle, gradient: "from-amber-500 to-orange-600" },
    { title: "Total Expenses", value: `₹${currentExpenseTotal.toLocaleString()}`, trend: trends.expenses, icon: Receipt, gradient: "from-rose-500 to-red-600" },
    { title: "Net Profit", value: `₹${(currentStats.total - currentExpenseTotal).toLocaleString()}`, trend: trends.profit, icon: Activity, gradient: (currentStats.total - currentExpenseTotal >= 0 ? "from-lime-500 to-green-600" : "from-orange-500 to-red-600") },
  ];

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch =
        b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || (b.status?.toLowerCase() === filterStatus.toLowerCase());
      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchTerm, filterStatus]);

  const recentBookings = filteredBookings.slice(0, 5);

  // Top Revenue Sources (computed automatically from bookings, grouped by customerName)
  const topSources = useMemo(() => {
    const grouped = bookings.reduce((acc, b) => {
      const name = b.customerName || 'Unknown';
      if (!acc[name]) {
        acc[name] = { name, bookings: 0, revenue: 0 };
      }
      acc[name].bookings += 1;
      acc[name].revenue += (b.amount || 0);
      return acc;
    }, {});
    const sortedSources = Object.values(grouped)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5); // Top 5 sources
    const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];
    return sortedSources.map((source, i) => ({
      ...source,
      fill: colors[i] || '#6366f1'
    }));
  }, [bookings]);

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
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Activity className="w-10 h-10 text-white/90" />
                  <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 animate-gradient-x">
                    Welcome back, {user?.name?.replace("Compass ", "") || "Admin"}
                  </h1>
                </div>
                <p className="text-lg text-blue-50">
                  Live financial & booking insights
                </p>
                <div className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full w-fit">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live • {format(new Date(), "h:mm a")}</span>
                </div>
              </div>

              <button className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-white text-indigo-600 font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-50 transition-opacity"></span>
                <Download size={22} className="relative z-10" />
                <span className="relative z-10">Export Report</span>
              </button>
            </div>
          </motion.header>

          {/* === STATS CARDS === */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                      <stat.icon size={22} />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold">
                      {stat.trend.value === "New Record" ? (
                        <AlertTriangle size={14} className="text-amber-600" />
                      ) : stat.trend.value === "–" || stat.trend.value === "N/A" ? (
                        <span className="text-gray-500">–</span>
                      ) : stat.trend.isPositive ? (
                        <ArrowUpRight size={14} className="text-emerald-600" />
                      ) : (
                        <ArrowDownRight size={14} className="text-rose-600" />
                      )}
                      <span className={
                        stat.trend.value === "New Record" ? "text-amber-600" :
                        stat.trend.value === "–" || stat.trend.value === "N/A" ? "text-gray-500" :
                        stat.trend.isPositive ? "text-emerald-600" : "text-rose-600"
                      }>
                        {stat.trend.value}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>

                  {/* Animated Progress Bar */}
                  {stat.trend.change > 0 && (
                    <div className="mt-4">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(stat.trend.change, 100)}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className={`h-full rounded-full ${
                            stat.trend.isPositive
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                              : "bg-gradient-to-r from-rose-500 to-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* === CHART + RECENT ACTIVITY === */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Revenue Trend</h2>
                    <p className="text-sm text-gray-500">Live booking performance</p>
                  </div>
                  <select className="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 12 months</option>
                  </select>
                </div>
              </div>
              <div className="p-6">
                <div className="h-80"><FundsChart /></div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentBookings.length > 0 ? (
                  recentBookings.map((b) => {
                    const isHighValue = b.amount >= 50000;
                    return (
                      <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition">
                        <div className={`p-2 rounded-full ${b.status?.toLowerCase() === "confirmed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                          {b.status?.toLowerCase() === "confirmed" ? <UserCheck size={16} /> : <Clock size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{b.customerName}</p>
                          <p className="text-xs text-gray-500">#{b.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isHighValue && (
                            <span className="px-2 py-0.5 text-xs font-bold bg-orange-100 text-orange-700 rounded-full">
                              HIGH
                            </span>
                          )}
                          <p className="text-sm font-bold text-gray-900">₹{b.amount}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No recent bookings</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* === BOTTOM ROW === */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings Table */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-xl font-bold text-gray-800">Recent Bookings</h3>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full text-sm rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-indigo-500 transition"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white"
                    >
                      <option value="all">All</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookingsLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse" /></td></tr>
                      ))
                    ) : recentBookings.length > 0 ? (
                      recentBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-3 text-sm font-medium text-indigo-600">#{b.id}</td>
                          <td className="px-6 py-3 text-sm text-gray-900">{b.customerName}</td>
                          <td className="px-6 py-3 text-sm text-gray-500">{format(new Date(b.date), "MMM d, yyyy")}</td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              b.status?.toLowerCase() === "confirmed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-sm font-bold text-gray-900">₹{b.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No bookings found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Top Revenue Sources with Horizontal Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-xl font-bold text-gray-800">Top Revenue Sources</h3>
                <FileText size={22} className="text-gray-400" />
              </div>

              <div className="h-64">
                {topSources && topSources.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={topSources}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" hide={true} />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        width={120}
                      />
                      <Tooltip 
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                        labelFormatter={(label) => label}
                        contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      />
                      <Bar dataKey="revenue" minWidth={100}>
                        {topSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-gray-500 text-center py-8">No data available</p>
                  </div>
                )}
              </div>

              {/* Legend / Quick Stats */}
              {topSources && topSources.length > 0 && (
                <div className="mt-4 space-y-2">
                  {topSources.map((source, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.fill }}></div>
                        <span className="font-medium text-gray-700">{source.name}</span>
                      </div>
                      <span className="text-gray-500">{source.bookings} bookings</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>

      {/* === ANIMATIONS === */}
      <style>{`
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

export default Dashboard;