// src/pages/AddBooking.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { useBooking } from "../../context/BookingContext";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  User,
  Mail,
  Calendar,
  DollarSign,
  CheckCircle,
  Plane,
  Bus,
  Train,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

const categories = [
  { value: "flight", label: "Flight", icon: Plane, color: "bg-blue-100 text-blue-700" },
  { value: "bus", label: "Bus", icon: Bus, color: "bg-emerald-100 text-emerald-700" },
  { value: "train", label: "Train", icon: Train, color: "bg-purple-100 text-purple-700" },
];

export default function AddBooking() {
  const { addBooking } = useBooking();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    date: format(new Date(), "yyyy-MM-dd"),
    amount: "",
    status: "pending",
    category: "flight",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (!form.date) e.date = "Date is required";
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Amount must be > 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      addBooking({
        id: `BK${Date.now()}`,
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        date: form.date,
        amount: Number(form.amount),
        status: form.status,
        category: form.category,
      });

      setSuccess(true);
      setTimeout(() => navigate("/bookings"), 1200);
    } catch (err) {
      alert(err.message || "Failed to add booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <button
              onClick={() => navigate("/bookings")}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">Back to Bookings</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Add New Booking
            </h1>
          </motion.div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700"
            >
              <CheckCircle size={24} />
              <div>
                <p className="font-semibold">Booking added!</p>
                <p className="text-sm">Redirecting...</p>
              </div>
            </motion.div>
          )}

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Plane size={18} />
                  Travel Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <label
                      key={cat.value}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        form.category === cat.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={form.category === cat.value}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="sr-only"
                      />
                      <cat.icon size={28} className={`mb-2 ${cat.color.replace("bg-", "text-").replace("100", "600")}`} />
                      <span className="text-sm font-medium">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User size={18} />
                  Customer Name
                </label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.customerName ? "border-red-500" : "border-gray-300"
                  } bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base`}
                  placeholder="John Doe"
                  disabled={submitting}
                />
                {errors.customerName && <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail size={18} />
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base`}
                  placeholder="john@example.com"
                  disabled={submitting}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar size={18} />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  } bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base`}
                  disabled={submitting}
                />
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>

              {/* Amount */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign size={18} />
                  Amount
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  } bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base`}
                  placeholder="250.00"
                  disabled={submitting}
                />
                {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock size={18} />
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-base"
                  disabled={submitting}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/bookings")}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-medium shadow-lg flex items-center justify-center gap-2 ${
                    submitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting ? (
                    <>Adding...</>
                  ) : (
                    <>
                      <Plus size={20} />
                      Add Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}