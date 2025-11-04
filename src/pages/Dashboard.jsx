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
import { motion } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  isWithinInterval,
} from "date-fns";

const Dashboard = () => {
  const { bookings = [], isLoading: bookingsLoading } = useBooking();
  const { totals = {}, topSources = [] } = useFunds();
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

  // Filter by date range
  const filterByRange = (items, range) =>
    items.filter(item => {
      const d = new Date(item.date);
      return isWithinInterval(d, { start: range.start, end: range.end });
    });

  // Bookings
  const currentBookings = filterByRange(bookings, currentPeriod);
  const previousBookings = filterByRange(bookings, previousPeriod);

  // Expenses
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
    return { total, count, avg, highest };
  }, [currentBookings]);

  // Previous Stats
  const previousStats = useMemo(() => {
    const total = previousBookings.reduce((s, b) => s + (b.amount || 0), 0);
    const count = previousBookings.length;
    const avg = count > 0 ? total / count : 0;
    const highest = previousBookings.reduce((m, b) => Math.max(m, b.amount || 0), 0);
    return { total, count, avg, highest };
  }, [previousBookings]);

  // Trend Calculator
  const calcTrend = (cur, prev) => {
    if (prev === 0) return { value: "0%", change: 0, isPositive: false };
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
      ? { value: "New", change: 100, isPositive: true }
      : { value: "–", change: 0, isPositive: false },
    expenses: calcTrend(currentExpenseTotal, prevExpenseTotal),
    profit: calcTrend(
      currentStats.total - currentExpenseTotal,
      previousStats.total - prevExpenseTotal
    ),
  };

  // Stats with Progress Bars
  const stats = [
    {
      title: "Total Bookings",
      value: currentStats.count,
      trend: trends.bookings,
      icon: Calendar,
      color: "from-violet-500 to-purple-600",
    },
    {
      title: "Total Revenue",
      value: `$${currentStats.total.toLocaleString()}`,
      trend: trends.revenue,
      icon: DollarSign,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Avg Booking",
      value: `$${Math.round(currentStats.avg)}`,
      trend: trends.avgBooking,
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Highest Booking",
      value: `$${currentStats.highest.toLocaleString()}`,
      trend: trends.highest,
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Total Expenses",
      value: `$${currentExpenseTotal.toLocaleString()}`,
      trend: trends.expenses,
      icon: Receipt,
      color: "from-red-500 to-rose-600",
    },
    {
      title: "Net Profit",
      value: `$${(currentStats.total - currentExpenseTotal).toLocaleString()}`,
      trend: trends.profit,
      icon: Activity,
      color: currentStats.total - currentExpenseTotal >= 0
        ? "from-lime-500 to-green-600"
        : "from-orange-500 to-red-600",
    },
  ];

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const matchesSearch =
        b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || b.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchTerm, filterStatus]);

  const recentBookings = filteredBookings.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
          >
            <div>
              <h1 className=" Divine text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Welcome back, {user?.name?.split(" ")[0] || "Admin"}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Live booking & financial monitoring
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Live • {format(new Date(), "h:mm a")}</span>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm">
                <Download size={16} />
                Export Report
              </button>
            </div>
          </motion.header>

          {/* Stats Grid – 6 Cards with Progress Bars */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white p-5 sm:p-6 shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                      <stat.icon size={20} />
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold">
                      {stat.trend.value === "New" ? (
                        <AlertTriangle size={14} className="text-amber-600" />
                      ) : stat.trend.value === "–" ? (
                        <span className="text-gray-500">–</span>
                      ) : stat.trend.isPositive ? (
                        <ArrowUpRight size={14} className="text-emerald-600" />
                      ) : (
                        <ArrowDownRight size={14} className="text-red-600" />
                      )}
                      <span className={
                        stat.trend.value === "New" ? "text-amber-600" :
                        stat.trend.value === "–" ? "text-gray-500" :
                        stat.trend.isPositive ? "text-emerald-600" :
                        "text-red-600"
                      }>
                        {stat.trend.value}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 font-medium">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>

                  {/* Progress Bar */}
                  {stat.trend.change > 0 && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(stat.trend.change, 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.3 }}
                          className={`h-full rounded-full ${
                            stat.trend.isPositive
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                              : "bg-gradient-to-r from-red-500 to-rose-500"
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chart + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Revenue Trend</h2>
                    <p className="text-xs sm:text-sm text-gray-500">Live booking amounts</p>
                  </div>
                  <select className="px-3 py-2 text-xs sm:text-sm rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500">
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 12 months</option>
                  </select>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="h-64 sm:h-80">
                  <FundsChart />
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5 sm:p-6"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentBookings.length > 0 ? (
                  recentBookings.map((b) => {
                    const isHighValue = b.amount >= 500;
                    return (
                      <div key={b.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
                        <div className={`p-2 rounded-full ${b.status === "confirmed" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                          {b.status === "confirmed" ? <UserCheck size={16} /> : <Clock size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{b.customerName}</p>
                          <p className="text-xs text-gray-500">Booking #{b.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {isHighValue && (
                            <span className="px-2 py-0.5 text-xs font-bold bg-orange-100 text-orange-700 rounded-full">
                              HIGH
                            </span>
                          )}
                          <p className="text-sm font-semibold text-gray-900">${b.amount}</p>
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

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings Table */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="text-lg font-bold text-gray-800">Recent Bookings</h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-3 py-2 w-full text-sm rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white"
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookingsLoading ? (
                      Array(5).fill(0).map((_, i) => (
                        <tr key={i}>
                          <td colSpan={5} className="px-4 py-4">
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </td>
                        </tr>
                      ))
                    ) : recentBookings.length > 0 ? (
                      recentBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-sm text-gray-900">#{b.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{b.customerName}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {format(new Date(b.date), "MMM d, yyyy")}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              b.status === "confirmed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">${b.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No bookings found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Top Revenue Sources */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-200 p-5 sm:p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Top Revenue Sources</h3>
                <FileText size={20} className="text-gray-400" />
              </div>
              <div className="space-y-4">
                {topSources.length > 0 ? (
                  topSources.map((source, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                          {source.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{source.name}</p>
                          <p className="text-xs text-gray-500">{source.bookings} bookings</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-900">${source.revenue.toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No data available</p>
                )}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;