// src/pages/AllBookings.jsx
import { Link } from "react-router-dom";
import { Plus, Package, Calendar, Users, DollarSign, TrendingUp } from "lucide-react";
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

  // Helper: Normalize status
  const normalizeStatus = (status) => status?.trim().toLowerCase();

  // Filter & search
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" ||
        normalizeStatus(booking.status) === filterStatus.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchTerm, filterStatus]);

  // Stats
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => normalizeStatus(b.status) === "confirmed").length;
    const pending = bookings.filter((b) => normalizeStatus(b.status) === "pending").length;
    const revenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    return { total, confirmed, pending, revenue };
  }, [bookings]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* === PREMIUM HEADING SECTION === */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 shadow-2xl text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Left: Title + Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Package className="w-9 h-9 text-white/90" />
                <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 animate-gradient-x">
                  All Bookings
                </h1>
              </div>
              <p className="text-lg text-blue-50 max-w-md">
                Manage, track, and grow your business with real-time booking insights.
              </p>

              {/* Live Stats Badge */}
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <TrendingUp size={18} className="text-green-300" />
                  <span className="font-semibold">{stats.total}</span>
                  <span className="text-sm text-blue-100">Total Active</span>
                </div>
                <div className="text-sm text-blue-100">
                  ${stats.revenue.toLocaleString()} earned
                </div>
              </div>
            </div>

            {/* Right: Floating Add Button */}
            <Link
              to="/bookings/add"
              className="group relative inline-flex items-center gap-3 px-6 py-3.5 bg-white text-indigo-600 font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              {/* Glow Effect */}
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-50 transition-opacity"></span>
              <Plus size={22} className="relative z-10 group-hover:rotate-90 transition-transform" />
              <span className="relative z-10">Add New Booking</span>
            </Link>
          </div>
        </div>

        {/* === STATS CARDS (Below Header) === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "Total Bookings", value: stats.total, icon: Package, gradient: "from-blue-500 to-blue-600" },
            { label: "Confirmed", value: stats.confirmed, icon: Calendar, gradient: "from-green-500 to-emerald-600" },
            { label: "Pending", value: stats.pending, icon: Users, gradient: "from-amber-500 to-orange-600" },
            { label: "Total Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, gradient: "from-purple-500 to-indigo-600" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon size={32} className="opacity-80" />
              </div>
            </div>
          ))}
        </div>

        {/* === SEARCH & FILTER === */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="Search by ID, name, or service..."
              onSearch={setSearchTerm}
              value={searchTerm}
            />
          </div>
          <FilterMenu onFilterChange={setFilterStatus} value={filterStatus} />
        </div>

        {/* === TABLE CONTAINER === */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-16 flex flex-col items-center justify-center text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-indigo-600 mb-4"></div>
              <p>Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5">
                <Package size={48} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {searchTerm || filterStatus !== "all" ? "No bookings found" : "No bookings yet"}
              </h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters."
                  : "Get started by creating your first booking."}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <Link
                  to="/bookings/add"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
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
              />
            </div>
          )}
        </div>
      </div>

      {/* Optional: Add this for gradient animation */}
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