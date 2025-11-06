// src/components/BookingTable.jsx
import { useState, useMemo } from "react";
import StatusBadge from "../../components/StatusBadge";
import { format } from "date-fns";
import {
  Plane,
  Bus,
  Train,
  Car,
  Hotel,
  CheckCircle,
  XCircle,
  Phone,
  Globe,
  DollarSign,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";

// === Category Icons & Colors ===
const categoryConfig = {
  flight: { icon: Plane, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  bus:    { icon: Bus,  color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300" },
  train:  { icon: Train,color: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300" },
  cab:    { icon: Car,  color: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300" },
  hotel:  { icon: Hotel,color: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300" },
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

const BookingTable = ({ bookings = [], onUpdateStatus, onRemove, darkMode = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // --------------------------------------------------------------
  // 1. Filter: Search + Category
  // --------------------------------------------------------------
  const filteredBookings = useMemo(() => {
    let result = bookings;

    // Category Filter
    if (filterCategory !== "all") {
      result = result.filter((b) => b.category === filterCategory);
    }

    // Search Filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((b) => {
        const fields = [
          b.customerName,
          b.email,
          b.contactNumber,
          b.platform,
          b.id,
          platformLabels[b.platform] || "",
        ];
        return fields.some((f) => f?.toLowerCase().includes(term));
      });
    }

    return result;
  }, [bookings, searchTerm, filterCategory]);

  // --------------------------------------------------------------
  // 2. Toggle Status
  // --------------------------------------------------------------
  const toggleStatus = (id, current) => {
    const next = current === "confirmed" ? "pending" : "confirmed";
    onUpdateStatus(id, next);
  };

  return (
    <div className={`overflow-x-auto rounded-xl border ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
      {/* ---------------------- FILTERS ---------------------- */}
      <div className={`p-4 ${darkMode ? "bg-gray-900" : "bg-gray-50"} border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} />
              <input
                type="text"
                placeholder="Search by name, phone, email, platform..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2.5 rounded-xl border ${darkMode ? "border-gray-700 bg-gray-800 text-white placeholder-gray-400" : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"} text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-80 transition`}
              />
            </div>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <Filter size={16} />
                Category
                {filterCategory !== "all" && (
                  <span className="capitalize">{filterCategory}</span>
                )}
                <ChevronDown size={16} className={`transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
              </button>

              {showCategoryDropdown && (
                <div className={`absolute top-full left-0 mt-2 w-48 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-xl border overflow-hidden z-10`}>
                  <button
                    onClick={() => {
                      setFilterCategory("all");
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition ${filterCategory === "all" ? darkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-50 text-blue-700" : darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-50 text-gray-700"}`}
                  >
                    All Categories
                    {filterCategory === "all" && <span className="text-green-500">Check</span>}
                  </button>
                  {Object.entries(categoryConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setFilterCategory(key);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-center gap-2 transition ${filterCategory === key ? darkMode ? "bg-blue-900/50 text-blue-300" : "bg-blue-50 text-blue-700" : darkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-50 text-gray-700"}`}
                      >
                        <Icon size={16} />
                        <span className="capitalize">{key}</span>
                        {filterCategory === key && <span className="ml-auto text-green-500">Check</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>
      </div>

      {/* ---------------------- TABLE ---------------------- */}
      <table className="min-w-full">
        <thead className={`${darkMode ? "bg-gray-900 text-gray-400" : "bg-gray-100 text-gray-700"} text-xs uppercase tracking-wider`}>
          <tr>
            <th className="py-3 px-4 text-left">#</th>
            <th className="py-3 px-4 text-left">Customer</th>
            <th className="py-3 px-4 text-left">Contact</th>
            <th className="py-3 px-4 text-left">Category</th>
            <th className="py-3 px-4 text-left">Platform</th>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">Base Pay</th>
            <th className="py-3 px-4 text-left">Revenue</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={10} className={`text-center py-16 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <div className="flex flex-col items-center">
                  <div className={`w-20 h-20 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-50"} flex items-center justify-center mb-4`}>
                    <Package size={40} className={darkMode ? "text-gray-500" : "text-gray-400"} />
                  </div>
                  <p className="text-lg font-medium">No bookings match your filters.</p>
                  <p className="text-sm mt-1">Try adjusting search or category.</p>
                </div>
              </td>
            </tr>
          ) : (
            filteredBookings.map((booking, idx) => {
              const cat = categoryConfig[booking.category] || categoryConfig.bus;
              const Icon = cat.icon;
              const isConfirmed = booking.status === "confirmed";

              return (
                <tr key={booking.id} className={`hover:${darkMode ? "bg-gray-700" : "bg-gray-50"} transition`}>
                  {/* # */}
                  <td className={`py-3 px-4 text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {idx + 1}
                  </td>

                  {/* Customer Name */}
                  <td className={`py-3 px-4 font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {booking.customerName || "-"}
                  </td>

                  {/* Contact */}
                  <td className={`py-3 px-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className={darkMode ? "text-gray-500" : "text-gray-400"} />
                      <span>{booking.contactNumber || "-"}</span>
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="py-3 px-4">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cat.color}`}
                    >
                      <Icon size={14} />
                      {booking.category
                        ? booking.category.charAt(0).toUpperCase() + booking.category.slice(1)
                        : "N/A"}
                    </div>
                  </td>

                  {/* Platform */}
                  <td className={`py-3 px-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <div className="flex items-center gap-1.5">
                      <Globe size={14} className={darkMode ? "text-gray-500" : "text-gray-400"} />
                      <span className="capitalize">
                        {platformLabels[booking.platform] || booking.platform || "—"}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className={`py-3 px-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {booking.date ? format(new Date(booking.date), "MMM d, yyyy") : "-"}
                  </td>

                  {/* Base Pay */}
                  <td className={`py-3 px-4 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} className={darkMode ? "text-gray-500" : "text-gray-400"} />
                      {Number(booking.basePay || 0).toLocaleString()}
                    </div>
                  </td>

                  {/* Total Revenue */}
                  <td className={`py-3 px-4 text-sm font-semibold ${darkMode ? "text-emerald-400" : "text-green-700"}`}>
                    <div className="flex items-center gap-1">
                      <DollarSign size={15} />
                      {Number(booking.totalRevenue || 0).toFixed(2)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={booking.status || "pending"} darkMode={darkMode} />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-2">
                    {/* Toggle Status */}
                    <button
                      onClick={() => toggleStatus(booking.id, booking.status)}
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition font-medium ${
                        isConfirmed
                          ? darkMode ? "bg-amber-900/50 text-amber-400 hover:bg-amber-900/70" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : darkMode ? "bg-emerald-900/50 text-emerald-400 hover:bg-emerald-900/70" : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                      title={isConfirmed ? "Mark as Pending" : "Mark as Confirmed"}
                    >
                      {isConfirmed ? (
                        <>
                          <XCircle size={15} />
                          Unconfirm
                        </>
                      ) : (
                        <>
                          <CheckCircle size={15} />
                          Confirm
                        </>
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onRemove(booking.id)}
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition font-medium ${darkMode ? "bg-red-900/50 text-red-400 hover:bg-red-900/70" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                      title="Delete booking"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;