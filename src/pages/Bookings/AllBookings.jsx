// src/pages/AllBookings.jsx
import { Link } from "react-router-dom";
import {
  Plus,
  Package,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plane,
  Bus,
  Train,
  Car,
  Hotel,
  Phone,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import BookingTable from "./BookingTable";
import SearchBar from "../../components/SearchBar";
import FilterMenu from "../../components/FilterMenu";
import { useBooking } from "../../context/BookingContext";
import { useState, useMemo } from "react";

const AllBookings = () => {
  const { bookings, removeBooking, updateBookingStatus, isLoading } = useBooking();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [darkMode, setDarkMode] = useState(false); // Dark Mode State

  // Category Icons Map
  const categoryIcons = {
    flight: Plane,
    bus: Bus,
    train: Train,
    cab: Car,
    hotel: Hotel,
  };

  const categoryColors = {
    flight: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    bus: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    train: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
    cab: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
    hotel: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
  };

  // Normalize
  const normalize = (str) => str?.trim().toLowerCase() || "";

  // Filter & Search
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        normalize(booking.customerName).includes(searchLower) ||
        normalize(booking.email).includes(searchLower) ||
        normalize(booking.contactNumber).includes(searchLower) ||
        normalize(booking.platform).includes(searchLower) ||
        normalize(booking.category).includes(searchLower) ||
        booking.id.toLowerCase().includes(searchLower);

      const matchesStatus =
        filterStatus === "all" || normalize(booking.status) === filterStatus;

      const matchesCategory =
        filterCategory === "all" || booking.category === filterCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [bookings, searchTerm, filterStatus, filterCategory]);

  // Stats: totalRevenue + basePay
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => normalize(b.status) === "confirmed").length;
    const pending = bookings.filter((b) => normalize(b.status) === "pending").length;
    const revenue = bookings.reduce((sum, b) => sum + (b.totalRevenue || 0), 0);
    const basePayTotal = bookings.reduce((sum, b) => sum + (b.basePay || 0), 0);
    return { total, confirmed, pending, revenue, basePayTotal };
  }, [bookings]);

  return (
    <DashboardLayout>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-slate-50 via-white to-indigo-50"}`}>
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

          {/* === PREMIUM HEADING SECTION === */}
          <div className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl text-white ${
            darkMode 
              ? "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900" 
              : "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"
          }`}>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="w-9 h-9 text-white/90" />
                  <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 animate-gradient-x">
                    All Bookings
                  </h1>
                </div>
                <p className="text-lg text-white/90 max-w-md">
                  Manage bookings across flights, hotels, cabs, and more with real-time insights.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <TrendingUp size={18} className="text-green-300" />
                    <span className="font-semibold">{stats.total}</span>
                    <span className="text-sm text-white/90">Total Active</span>
                  </div>
                  <div className="text-sm text-white/90">
                    ₹{stats.revenue.toLocaleString()} revenue | ₹{stats.basePayTotal.toLocaleString()} base pay
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to="/bookings/add"
                  className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-white text-indigo-600 font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-50 transition-opacity"></span>
                  <Plus size={22} className="relative z-10 group-hover:rotate-90 transition-transform" />
                  <span className="relative z-10">Add New Booking</span>
                </Link>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition"
                >
                  {darkMode ? <Sun size={18} className="text-yellow-300" /> : <Moon size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* === STATS CARDS === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { label: "Total Bookings", value: stats.total, icon: Package, gradient: darkMode ? "from-blue-600 to-blue-700" : "from-blue-500 to-blue-600" },
              { label: "Confirmed", value: stats.confirmed, icon: Calendar, gradient: darkMode ? "from-emerald-600 to-emerald-700" : "from-green-500 to-emerald-600" },
              { label: "Pending", value: stats.pending, icon: Users, gradient: darkMode ? "from-orange-600 to-orange-700" : "from-amber-500 to-orange-600" },
              { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, gradient: darkMode ? "from-purple-600 to-purple-700" : "from-purple-500 to-indigo-600" },
              { label: "Base Pay", value: `₹${stats.basePayTotal.toLocaleString()}`, icon: DollarSign, gradient: darkMode ? "from-cyan-600 to-cyan-700" : "from-cyan-500 to-teal-600" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <stat.icon size={28} className="opacity-80" />
                </div>
              </div>
            ))}
          </div>

          {/* === SEARCH & FILTERS === */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            <div className="flex-1 max-w-md">
              <SearchBar
                placeholder="Search by name, email, phone, platform..."
                onSearch={setSearchTerm}
                value={searchTerm}
                darkMode={darkMode}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <FilterMenu
                label="Category"
                options={[
                  { value: "all", label: "All Categories" },
                  { value: "flight", label: "Flight" },
                  { value: "hotel", label: "Hotel" },
                  { value: "cab", label: "Cab" },
                  { value: "bus", label: "Bus" },
                  { value: "train", label: "Train" },
                ]}
                value={filterCategory}
                onChange={setFilterCategory}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* === TABLE === */}
          <div className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} rounded-2xl shadow-sm border overflow-hidden`}>
            {isLoading ? (
              <div className="p-16 flex flex-col items-center justify-center text-gray-500">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
                <p>Loading bookings...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className={`text-center py-16 px-6 ${darkMode ? "text-gray-400" : "text-gray-900"}`}>
                <div className={`${darkMode ? "bg-gray-700" : "bg-gray-50"} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5`}>
                  <Package size={48} className={`${darkMode ? "text-gray-500" : "text-gray-400"}`} />
                </div>
                <h3 className={`text-xl font-semibold ${darkMode ? "text-gray-200" : "text-gray-900"}`}>
                  {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                    ? "No bookings found"
                    : "No bookings yet"}
                </h3>
                <p className={`${darkMode ? "text-gray-500" : "text-gray-500"} mt-2 max-w-sm mx-auto`}>
                  {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                    ? "Try adjusting your search or filters."
                    : "Get started by creating your first booking."}
                </p>
                {!searchTerm && filterStatus === "all" && filterCategory === "all" && (
                  <Link
                    to="/bookings/add"
                    className={`mt-6 inline-flex items-center gap-2 px-5 py-2.5 ${darkMode ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"} text-white font-medium rounded-xl transition shadow-md`}
                  >
                    <Plus size={18} />
                    Add First Booking
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <BookingTable
                  bookings={filteredBookings}
                  onUpdateStatus={updateBookingStatus}
                  onRemove={removeBooking}
                  categoryIcons={categoryIcons}
                  categoryColors={categoryColors}
                  darkMode={darkMode}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gradient Animation */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default AllBookings;