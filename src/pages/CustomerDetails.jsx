// src/pages/CustomerDetails.jsx
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatusBadge from "../components/StatusBadge";
import { useBooking } from "../context/BookingContext";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Package,
  Calendar,
  Globe,
  Copy,
  CheckCircle,
  Clock,
  DollarSign,
  Plane,
  Bus,
  Train,
  Car,
  Hotel,
  Users,
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
  makemytrip: "MakeMyTrip",
  goibibo: "Goibibo",
  yatra: "Yatra",
  cleartrip: "ClearTrip",
  expedia: "Expedia",
  bookingcom: "Booking.com",
  agoda: "Agoda",
  direct: "Direct",
  other: "Other",
};

export default function CustomerDetails() {
  const navigate = useNavigate();
  const { bookings, isLoading } = useBooking();
  const [copiedId, setCopiedId] = useState("");

  // Latest customer
  const latestCustomer = useMemo(() => {
    if (!bookings.length) return null;
    return [...bookings].sort((a, b) => (b.id > a.id ? 1 : -1))[0];
  }, [bookings]);

  // All bookings for customer
  const customerBookings = useMemo(() => {
    if (!latestCustomer) return [];
    return bookings.filter(
      (b) =>
        b.email.toLowerCase() === latestCustomer.email.toLowerCase() ||
        b.contactNumber === latestCustomer.contactNumber
    );
  }, [bookings, latestCustomer]);

  // Stats
  const stats = useMemo(() => {
    const total = customerBookings.length;
    const confirmed = customerBookings.filter((b) => b.status === "confirmed").length;
    const pending = customerBookings.filter((b) => b.status === "pending").length;
    const revenue = customerBookings.reduce(
      (sum, b) => sum + b.baseAmount + b.commissionAmount + b.markupAmount,
      0
    );
    return { total, confirmed, pending, revenue };
  }, [customerBookings]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
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

  if (!latestCustomer) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">
          <Users size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">No Customers Yet</h2>
          <p className="text-gray-500 mt-2">Start adding bookings to see customer insights.</p>
          <button
            onClick={() => navigate("/bookings/add")}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition"
          >
            Add Booking
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <button
              onClick={() => navigate("/bookings")}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition font-medium"
            >
              <ArrowLeft size={22} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Customer Bookings
            </h1>
            <div className="w-24" />
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Bookings", value: stats.total, icon: Package, color: "from-indigo-500 to-blue-600" },
              { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "from-emerald-500 to-teal-600" },
              { label: "Pending", value: stats.pending, icon: Clock, color: "from-amber-500 to-orange-600" },
              { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "from-purple-500 to-pink-600" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-white/70 border border-white/30 shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-20`} />
                <div className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color} shadow-lg`}>
                      <stat.icon size={28} className="text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bookings Table */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <Package size={28} />
                All Bookings ({customerBookings.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 backdrop-blur text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6 text-left">ID</th>
                    <th className="py-4 px-6 text-left">Customer</th>
                    <th className="py-4 px-6 text-left">Contact</th>
                    <th className="py-4 px-6 text-left">Type</th>
                    <th className="py-4 px-6 text-left">Platform</th>
                    <th className="py-4 px-6 text-left">Date</th>
                    <th className="py-4 px-6 text-left">Revenue</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {customerBookings.map((b) => {
                    const Icon = categoryIcons[b.category] || Package;
                    const total = b.baseAmount + b.commissionAmount + b.markupAmount;

                    return (
                      <motion.tr
                        key={b.id}
                        whileHover={{ backgroundColor: "rgba(199, 210, 254, 0.3)" }}
                        className="transition-all duration-200"
                      >
                        <td className="py-4 px-6 font-mono text-indigo-600 font-bold">#{b.id}</td>
                        <td className="py-4 px-6 font-medium text-gray-900">{b.customerName}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <Phone size={15} className="text-gray-500" />
                            <span className="font-medium">{b.contactNumber}</span>
                            <button
                              onClick={() => copyToClipboard(b.contactNumber, b.id)}
                              className="p-1 rounded hover:bg-indigo-100 transition"
                            >
                              <Copy size={14} className={copiedId === b.id ? "text-emerald-600" : "text-gray-400"} />
                            </button>
                            {copiedId === b.id && <span className="text-xs text-emerald-600">Copied!</span>}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${categoryColors[b.category]}`}>
                            <Icon size={16} />
                            {b.category.charAt(0).toUpperCase() + b.category.slice(1)}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Globe size={14} className="text-gray-400" />
                            {platformLabels[b.platform] || b.platform || "—"}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {format(new Date(b.date), "dd MMM yyyy")}
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            <p className="font-bold text-green-700">₹{total.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">
                              B:₹{b.baseAmount} + C:₹{b.commissionAmount} + M:₹{b.markupAmount}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <StatusBadge status={b.status} />
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            to={`/bookings/view/${b.id}`}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-sm hover:underline"
                          >
                            View Details
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}