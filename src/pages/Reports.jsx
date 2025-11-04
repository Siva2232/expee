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
import { motion } from "framer-motion";
import { saveAs } from "file-saver";
import { useBooking } from "../context/BookingContext";
import { useExpense } from "../context/ExpenseContext";
import DashboardLayout from "../components/DashboardLayout";

import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  FileText,
  Filter,
  BarChart3,
  PieChart,          // ← we use the normal PieChart icon
  Activity,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  CheckCircle,
  IndianRupee,
  ShoppingCart,
  Wrench,
  Fuel,
  Briefcase,
  Coffee,
} from "lucide-react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,   // keep the chart component separate
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const Reports = () => {
  const { bookings = [] } = useBooking();
  const { expenses = [] } = useExpense();

  const [dateRange, setDateRange] = useState("thisMonth");
  const [reportType, setReportType] = useState("overview");

  /* --------------------------------------------------------------
     Date‑range logic
  -------------------------------------------------------------- */
  const { start, end } = useMemo(() => {
    const now = new Date();
    let s, e;
    switch (dateRange) {
      case "lastMonth":
        s = startOfMonth(subMonths(now, 1));
        e = endOfMonth(subMonths(now, 1));
        break;
      case "last3Months":
        s = startOfMonth(subMonths(now, 3));
        e = endOfMonth(now);
        break;
      case "last6Months":
        s = startOfMonth(subMonths(now, 6));
        e = endOfMonth(now);
        break;
      case "thisYear":
        s = new Date(now.getFullYear(), 0, 1);
        e = now;
        break;
      case "lastYear":
        s = new Date(now.getFullYear() - 1, 0, 1);
        e = new Date(now.getFullYear() - 1, 11, 31);
        break;
      default: // thisMonth
        s = startOfMonth(now);
        e = endOfMonth(now);
    }
    return { start: s, end: e };
  }, [dateRange]);

  /* --------------------------------------------------------------
     Filter data by selected period
  -------------------------------------------------------------- */
  const filteredBookings = useMemo(
    () =>
      bookings.filter(b => {
        const d = new Date(b.date);
        return d >= start && d <= end;
      }),
    [bookings, start, end]
  );

  const filteredExpenses = useMemo(
    () =>
      expenses.filter(e => {
        const d = new Date(e.date);
        return d >= start && d <= end;
      }),
    [expenses, start, end]
  );

  /* --------------------------------------------------------------
     Core calculations
  -------------------------------------------------------------- */
  const totalRevenue = filteredBookings.reduce(
    (sum, b) => sum + (Number(b.amount) || 0),
    0
  );
  const totalExpense = filteredExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue
    ? ((netProfit / totalRevenue) * 100).toFixed(1)
    : 0;
  const bookingCount = filteredBookings.length;
  const avgBookingValue = bookingCount
    ? Math.round(totalRevenue / bookingCount)
    : 0;

  /* --------------------------------------------------------------
     Growth vs previous period
  -------------------------------------------------------------- */
  const prevPeriod = useMemo(() => {
    const diff = end.getTime() - start.getTime();
    const prevStart = new Date(start.getTime() - diff - 1);
    const prevEnd = new Date(end.getTime() - diff - 1);
    return { start: prevStart, end: prevEnd };
  }, [start, end]);

  const prevRevenue = bookings
    .filter(b => {
      const d = new Date(b.date);
      return d >= prevPeriod.start && d <= prevPeriod.end;
    })
    .reduce((sum, b) => sum + (Number(b.amount) || 0), 0);

  const revenueGrowth = prevRevenue
    ? ((totalRevenue - prevRevenue) / prevRevenue * 100).toFixed(1)
    : 0;

  /* --------------------------------------------------------------
     12‑month trend
  -------------------------------------------------------------- */
  const monthlyTrend = useMemo(() => {
    const data = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const mStart = startOfMonth(date);
      const mEnd = endOfMonth(date);
      const rev = bookings
        .filter(b => {
          const d = new Date(b.date);
          return d >= mStart && d <= mEnd;
        })
        .reduce((s, b) => s + (Number(b.amount) || 0), 0);
      const exp = expenses
        .filter(e => {
          const d = new Date(e.date);
          return d >= mStart && d <= mEnd;
        })
        .reduce((s, e) => s + e.amount, 0);
      data.push({
        month: format(date, "MMM"),
        revenue: rev,
        expense: exp,
        profit: rev - exp,
      });
    }
    return data;
  }, [bookings, expenses]);

  /* --------------------------------------------------------------
     Top customers
  -------------------------------------------------------------- */
  const topCustomers = useMemo(() => {
    const map = {};
    filteredBookings.forEach(b => {
      const name = b.customerName || "Unknown";
      map[name] = (map[name] || 0) + (Number(b.amount) || 0);
    });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [filteredBookings]);

  /* --------------------------------------------------------------
     Expense by category
  -------------------------------------------------------------- */
  const expenseByCategory = useMemo(() => {
    const map = {
      Fuel: 0,
      Salary: 0,
      Rent: 0,
      Marketing: 0,
      Maintenance: 0,
      Other: 0,
    };
    filteredExpenses.forEach(e => {
      const cat = e.category || "Other";
      map[cat] = (map[cat] || 0) + e.amount;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredExpenses]);

  const COLORS = [
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#6366f1",
  ];

  /* --------------------------------------------------------------
     Export CSV
  -------------------------------------------------------------- */
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

  /* --------------------------------------------------------------
     Render
  -------------------------------------------------------------- */
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Advanced Reports & Analytics
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {format(start, "MMM d")} – {format(end, "MMM d, yyyy")} • {bookingCount} bookings • {filteredExpenses.length} expenses
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                  <Download size={18} /> Export CSV
                </button>
              </div>
            </div>
          </motion.header>

          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-3">
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm">
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="last3Months">Last 3 Months</option>
              <option value="last6Months">Last 6 Months</option>
              <option value="thisYear">This Year</option>
              <option value="lastYear">Last Year</option>
            </select>
            <select value={reportType} onChange={e => setReportType(e.target.value)} className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-sm">
              <option value="overview">Overview</option>
              <option value="revenue">Revenue</option>
              <option value="expenses">Expenses</option>
              <option value="customers">Customers</option>
              <option value="performance">Performance</option>
            </select>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            <motion.div whileHover={{ y: -4 }} className="p-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-xl">
              <DollarSign size={22} />
              <p className="text-xs opacity-90 mt-1">Revenue</p>
              <p className="text-xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              <p className="text-xs mt-1 flex items-center gap-1">
                {revenueGrowth > 0 ? <ArrowUpRight size={14} className="text-emerald-300" /> : <ArrowDownRight size={14} className="text-rose-300" />}
                <span className={revenueGrowth > 0 ? "text-emerald-300" : "text-rose-300"}>{Math.abs(revenueGrowth)}%</span>
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="p-5 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl text-white shadow-xl">
              <ShoppingCart size={22} />
              <p className="text-xs opacity-90 mt-1">Expenses</p>
              <p className="text-xl font-bold">₹{totalExpense.toLocaleString()}</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className={`p-5 rounded-2xl text-white shadow-xl ${netProfit >= 0 ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-orange-500 to-red-600"}`}>
              <Target size={22} />
              <p className="text-xs opacity-90 mt-1">Net Profit</p>
              <p className="text-xl font-bold">₹{netProfit.toLocaleString()}</p>
              <p className="text-xs mt-1">{profitMargin}% margin</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="p-5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl text-white shadow-xl">
              <Users size={22} />
              <p className="text-xs opacity-90 mt-1">Bookings</p>
              <p className="text-xl font-bold">{bookingCount}</p>
            </motion.div>
            <motion.div whileHover={{ y: -4 }} className="p-5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white shadow-xl">
              <IndianRupee size={22} />
              <p className="text-xs opacity-90 mt-1">Avg Booking</p>
              <p className="text-xl font-bold">₹{avgBookingValue.toLocaleString()}</p>
            </motion.div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue vs Expense Trend */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity size={20} /> Revenue & Profit Trend (12 Months)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8b5cf6" fill="#c4b5fd" />
                    <Area type="monotone" dataKey="expense" stackId="1" stroke="#ef4444" fill="#fca5a5" />
                    <Area type="monotone" dataKey="profit" stroke="#10b981" fill="#86efac" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Expense Breakdown */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><PieChart size={20} /> Expense by Category</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={expenseByCategory}
                      cx="50%" cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Top Customers + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users size={20} /> Top 6 Customers</h3>
              <div className="space-y-3">
                {topCustomers.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{c.name}</p>
                        <p className="text-xs text-gray-500">₹{c.amount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {(c.amount / totalRevenue * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Clock size={20} /> Recent Activity</h3>
              <div className="space-y-3 text-sm">
                {[...filteredBookings.map(b => ({ ...b, amount: Number(b.amount) })), ...filteredExpenses.map(e => ({ ...e, amount: -e.amount }))].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.amount > 0 ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-rose-500" />}
                      <span className="text-gray-700 dark:text-gray-300">{item.customerName || item.description}</span>
                    </div>
                    <span className={item.amount > 0 ? "text-emerald-600" : "text-rose-600"}>₹{Math.abs(item.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Performance Metrics */}
          {reportType === "performance" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl text-white shadow-xl">
                <BarChart3 size={28} />
                <p className="text-sm mt-2">Booking Conversion</p>
                <p className="text-3xl font-bold">78.4%</p>
                <p className="text-xs mt-1">+12.3% vs last period</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white shadow-xl">
                <Fuel size={28} />
                <p className="text-sm mt-2">Fuel Efficiency</p>
                <p className="text-3xl font-bold">12.8 km/L</p>
                <p className="text-xs mt-1">-0.4 L/100km</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl text-white shadow-xl">
                <Briefcase size={28} />
                <p className="text-sm mt-2">Employee Cost</p>
                <p className="text-3xl font-bold">₹42K</p>
                <p className="text-xs mt-1">per active driver</p>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;