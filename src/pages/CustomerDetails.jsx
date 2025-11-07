// src/pages/CustomerDetails.jsx
import { Link, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import { useBooking } from "../context/BookingContext";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Mail,
  Package,
  Calendar,
  Globe,
  Copy,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  ChevronDown,
  Plane,
  Bus,
  Train,
  Car,
  Hotel,
  User,
  IndianRupee,
} from "lucide-react";

const categoryIcons = {
  flight: Plane,
  bus: Bus,
  train: Train,
  cab: Car,
  hotel: Hotel,
};

const categoryColors = {
  flight: "bg-blue-100 text-blue-700",
  bus: "bg-emerald-100 text-emerald-700",
  train: "bg-purple-100 text-purple-700",
  cab: "bg-orange-100 text-orange-700",
  hotel: "bg-pink-100 text-pink-700",
};

const platformLabels = {
  alhind: "AlHind",
  akbar: "Akbar",
  direct: "Direct",
};

export default function CustomerDetails() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const { bookings, isLoading } = useBooking();
  const [expanded, setExpanded] = useState(new Set());
  const [copied, setCopied] = useState({ field: "", value: "" });

  // Find customer (by ID or latest)
  const customer = useMemo(() => {
    if (!bookings?.length) return null;
    if (customerId) return bookings.find((b) => b.id === customerId) || null;
    return [...bookings].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  }, [bookings, customerId]);

  // All bookings for this customer
  const customerBookings = useMemo(() => {
    if (!customer) return [];
    const email = customer.email?.trim().toLowerCase();
    const phone = customer.contactNumber?.trim();
    return bookings
      .filter(
        (b) =>
          b.email?.trim().toLowerCase() === email ||
          b.contactNumber?.trim() === phone
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [bookings, customer]);

  // Stats
  const stats = useMemo(() => {
    const total = customerBookings.length;
    const confirmed = customerBookings.filter((b) => b.status === "confirmed").length;
    const pending = customerBookings.filter((b) => b.status === "pending").length;
    const cancelled = customerBookings.filter((b) => b.status === "cancelled").length;
    const revenue = customerBookings.reduce((s, b) => s + (b.totalRevenue || 0), 0);
    const profit = customerBookings.reduce((s, b) => s + (b.netProfit || 0), 0);
    return { total, confirmed, pending, cancelled, revenue, profit };
  }, [customerBookings]);

  const toggleExpand = (id) => {
    const newSet = new Set(expanded);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpanded(newSet);
  };

  const copy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied({ field, value: text });
    setTimeout(() => setCopied({ field: "", value: "" }), 2000);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <User size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">No Customer Found</h2>
          <p className="text-gray-500 mt-2">Add a booking to see customer details.</p>
          <Link
            to="/bookings/add"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition"
          >
            Add Booking
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              <ArrowLeft size={22} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Customer Details
            </h1>
            <div className="w-24" />
          </motion.div>

          {/* Customer Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {customer.customerName?.charAt(0).toUpperCase() || "C"}
              </div>

              <div className="flex-1 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">{customer.customerName}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="text-gray-700">{customer.email}</span>
                    <button
                      onClick={() => copy(customer.email, "email")}
                      className="p-1 rounded hover:bg-indigo-100 transition"
                    >
                      <Copy size={14} className={copied.field === "email" ? "text-emerald-600" : "text-gray-400"} />
                    </button>
                    {copied.field === "email" && <span className="text-xs text-emerald-600 ml-1">Copied!</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-500" />
                    <span className="text-gray-700">{customer.contactNumber}</span>
                    <button
                      onClick={() => copy(customer.contactNumber, "phone")}
                      className="p-1 rounded hover:bg-indigo-100 transition"
                    >
                      <Copy size={14} className={copied.field === "phone" ? "text-emerald-600" : "text-gray-400"} />
                    </button>
                    {copied.field === "phone" && <span className="text-xs text-emerald-600 ml-1">Copied!</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total", value: stats.total, icon: Package },
                { label: "Confirmed", value: stats.confirmed, icon: CheckCircle },
                { label: "Pending", value: stats.pending, icon: Clock },
                { label: "Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign },
              ].map((s, i) => (
                <div key={i} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 text-center">
                  <s.icon size={22} className="mx-auto text-indigo-600 mb-1" />
                  <p className="text-xs text-gray-600">{s.label}</p>
                  <p className="font-bold text-gray-900">{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Booking List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <Package size={28} />
              Booking History ({customerBookings.length})
            </h3>

            {customerBookings.length === 0 ? (
              <div className="text-center py-12 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50">
                <Package size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No bookings found for this customer.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {customerBookings.map((b) => {
                  const Icon = categoryIcons[b.category] || Package;
                  const color = categoryColors[b.category] || "bg-gray-100 text-gray-700";
                  const isExpanded = expanded.has(b.id);

                  return (
                    <motion.div
                      key={b.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 overflow-hidden"
                    >
                      {/* Header */}
                      <button
                        onClick={() => toggleExpand(b.id)}
                        className="w-full p-5 flex items-center justify-between hover:bg-indigo-50/50 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2.5 rounded-full ${color}`}>
                            <Icon size={20} />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-gray-900">
                              {b.category.charAt(0).toUpperCase() + b.category.slice(1)} Booking
                            </p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(b.date), "dd MMM yyyy")} • #{b.id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-green-700">₹{Number(b.totalRevenue).toLocaleString()}</span>
                          <ChevronDown
                            size={20}
                            className={`text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-gray-200/50"
                          >
                            <div className="p-5 space-y-4 text-sm">
                              {/* Row 1 */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-gray-600">Platform</p>
                                  <p className="font-medium flex items-center gap-2">
                                    <Globe size={14} /> {platformLabels[b.platform] || b.platform || "—"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Status</p>
                                  <StatusBadge status={b.status} />
                                </div>
                              </div>

                              {/* Financials */}
                              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Base Pay</span>
                                  <span className="font-medium">₹{Number(b.basePay || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Commission</span>
                                  <span className="font-medium text-emerald-700">₹{Number(b.commissionAmount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Markup</span>
                                  <span className="font-medium text-purple-700">₹{Number(b.markupAmount || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                  <span className="font-semibold text-indigo-700">Total Revenue</span>
                                  <span className="font-bold text-indigo-800">₹{Number(b.totalRevenue || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-semibold text-emerald-700">Net Profit</span>
                                  <span className="font-bold text-emerald-800">₹{Number(b.netProfit || 0).toLocaleString()}</span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex justify-end">
                                <Link
                                  to={`/bookings/view/${b.id}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition"
                                >
                                  View Full Details
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}