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
} from "lucide-react";

// === Category Icons & Colors ===
const categoryConfig = {
  flight: { icon: Plane, color: "bg-blue-100 text-blue-700" },
  bus:    { icon: Bus,  color: "bg-emerald-100 text-emerald-700" },
  train:  { icon: Train,color: "bg-purple-100 text-purple-700" },
  cab:    { icon: Car,  color: "bg-orange-100 text-orange-700" },
  hotel:  { icon: Hotel,color: "bg-pink-100 text-pink-700" },
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

const BookingTable = ({ bookings = [], onUpdateStatus, onRemove }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

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
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      {/* ---------------------- FILTERS ---------------------- */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-start lg:items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search */}
            <input
              type="text"
              placeholder="Search by name, phone, email, platform..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-72"
            />

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-48"
            >
              <option value="all">All Categories</option>
              {Object.keys(categoryConfig).map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <p className="text-sm text-gray-500">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>
      </div>

      {/* ---------------------- TABLE ---------------------- */}
      <table className="min-w-full">
        <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
          <tr>
            <th className="py-3 px-4 text-left">#</th>
            <th className="py-3 px-4 text-left">Customer</th>
            <th className="py-3 px-4 text-left">Contact</th>
            <th className="py-3 px-4 text-left">Category</th>
            <th className="py-3 px-4 text-left">Platform</th>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">Base Pay</th> {/* NEW */}
            <th className="py-3 px-4 text-left">Revenue</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={10} className="text-center py-12 text-gray-500">
                <div className="flex flex-col items-center">
                  <Package className="w-12 h-12 text-gray-300 mb-3" />
                  <p>No bookings match your filters.</p>
                </div>
              </td>
            </tr>
          ) : (
            filteredBookings.map((booking, idx) => {
              const cat = categoryConfig[booking.category] || categoryConfig.bus;
              const Icon = cat.icon;
              const isConfirmed = booking.status === "confirmed";

              return (
                <tr key={booking.id} className="hover:bg-gray-50 transition">
                  {/* # */}
                  <td className="py-3 px-4 text-sm font-medium text-gray-600">
                    {idx + 1}
                  </td>

                  {/* Customer Name */}
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {booking.customerName || "-"}
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-gray-400" />
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
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-700">
                      <Globe size={14} className="text-gray-400" />
                      <span className="capitalize">
                        {platformLabels[booking.platform] || booking.platform || "—"}
                      </span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {booking.date ? format(new Date(booking.date), "MMM d, yyyy") : "-"}
                  </td>

                  {/* Base Pay – NEW */}
                  <td className="py-3 px-4 text-sm text-gray-700">
                    <div className="flex items-center gap-1">
                      <DollarSign size={14} className="text-gray-400" />
                      {Number(booking.basePay || 0).toLocaleString()}
                    </div>
                  </td>

                  {/* Total Revenue */}
                  <td className="py-3 px-4 text-sm font-semibold text-green-700">
                    <div className="flex items-center gap-1">
                      <DollarSign size={15} />
                      {Number(booking.totalRevenue || 0).toFixed(2)}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    <StatusBadge status={booking.status || "pending"} />
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-2">
                    {/* Toggle Status */}
                    <button
                      onClick={() => toggleStatus(booking.id, booking.status)}
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition font-medium ${
                        isConfirmed
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
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
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition font-medium"
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