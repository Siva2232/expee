// src/pages/AllBookings.jsx
import { Link } from "react-router-dom";
import { Plus, Package, Calendar, Users, DollarSign } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import BookingTable from "./BookingTable";
import SearchBar from "../../components/SearchBar";
import FilterMenu from "../../components/FilterMenu";
import { useBooking } from "../../context/BookingContext";
import { useState, useMemo } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import EmptyState from "../../components/EmptyState";

const AllBookings = () => {
  const { bookings, removeBooking, updateBookingStatus, isLoading } = useBooking();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter and search logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || booking.status.toLowerCase() === filterStatus.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [bookings, searchTerm, filterStatus]);

  // Stats summary
  const stats = useMemo(() => {
    const total = bookings.length;
    const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
    const pending = bookings.filter((b) => b.status === "Pending").length;
    const revenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

    return { total, confirmed, pending, revenue };
  }, [bookings]);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Bookings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track all customer bookings in one place</p>
          </div>

          <Link
            to="/bookings/add"
            className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Add Booking
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Bookings</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <Package size={28} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-xl text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Confirmed</p>
                <p className="text-2xl font-bold mt-1">{stats.confirmed}</p>
              </div>
              <Calendar size={28} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-5 rounded-xl text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold mt-1">{stats.pending}</p>
              </div>
              <Users size={28} className="opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-5 rounded-xl text-white shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">${stats.revenue.toLocaleString()}</p>
              </div>
              <DollarSign size={28} className="opacity-80" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="Search by ID, name, or service..."
              onSearch={setSearchTerm}
              value={searchTerm}
            />
          </div>
          <FilterMenu onFilterChange={setFilterStatus} value={filterStatus} />
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <EmptyState
              title={searchTerm || filterStatus !== "all" ? "No bookings found" : "No bookings yet"}
              description={
                searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters."
                  : "Start by adding your first booking to get started."
              }
              action={
                !searchTerm && filterStatus === "all" ? (
                  <Link
                    to="/bookings/add"
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Plus size={16} />
                    Add First Booking
                  </Link>
                ) : null
              }
            />
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

        {/* Optional: Pagination (uncomment if needed) */}
        {/* {filteredBookings.length > 0 && (
          <div className="flex justify-center mt-6">
            <Pagination count={Math.ceil(filteredBookings.length / 10)} />
          </div>
        )} */}
      </div>
    </DashboardLayout>
  );
};

export default AllBookings;