// src/components/BookingTable.jsx
import { useState, useMemo } from "react";
import StatusBadge from "../../components/StatusBadge";
import { format } from "date-fns";
import { Plane, Bus, Train, CheckCircle, XCircle } from "lucide-react";

const categoryIcons = {
  flight: { icon: Plane, color: "bg-blue-100 text-blue-700" },
  bus:    { icon: Bus,  color: "bg-emerald-100 text-emerald-700" },
  train:  { icon: Train,color: "bg-purple-100 text-purple-700" },
};

const BookingTable = ({ bookings = [], onUpdateStatus, onRemove }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // --------------------------------------------------------------
  // 1. Filter by search + category
  // --------------------------------------------------------------
  const filteredBookings = useMemo(() => {
    let result = bookings;

    // Category filter
    if (filterCategory !== "all") {
      result = result.filter((b) => b.category === filterCategory);
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((b) => {
        const name  = (b.customerName ?? "").toLowerCase();
        const email = (b.email ?? "").toLowerCase();
        const id    = (b.id ?? "").toLowerCase();
        return name.includes(term) || email.includes(term) || id.includes(term);
      });
    }

    return result;
  }, [bookings, searchTerm, filterCategory]);

  // --------------------------------------------------------------
  // 2. Helper: toggle status (pending <-> confirmed)
  // --------------------------------------------------------------
  const toggleStatus = (id, current) => {
    const next = current === "confirmed" ? "pending" : "confirmed";
    onUpdateStatus(id, next);
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
      {/* ---------------------- FILTERS ---------------------- */}
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-64"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-48"
            >
              <option value="all">All Categories</option>
              <option value="flight">Flight</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
            </select>
          </div>
          <p className="text-sm text-gray-500">
            Showing {filteredBookings.length} / {bookings.length} records
          </p>
        </div>
      </div>

      {/* ---------------------- TABLE ---------------------- */}
      <table className="min-w-full">
        <thead className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider">
          <tr>
            <th className="py-3 px-4 text-left">#</th>
            <th className="py-3 px-4 text-left">Customer</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-left">Category</th>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">Amount</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {filteredBookings.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-8 text-gray-500">
                No bookings match your filters.
              </td>
            </tr>
          ) : (
            filteredBookings.map((booking, idx) => {
              const cat = categoryIcons[booking.category] || categoryIcons.bus;
              const isConfirmed = booking.status === "confirmed";

              return (
                <tr key={booking.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-sm">{idx + 1}</td>

                  <td className="py-3 px-4 font-medium text-gray-800">
                    {booking.customerName ?? "-"}
                  </td>

                  <td className="py-3 px-4 text-gray-600 text-sm">
                    {booking.email ?? "-"}
                  </td>

                  {/* Category Badge */}
                  <td className="py-3 px-4">
                    <div
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${cat.color}`}
                    >
                      <cat.icon size={14} />
                      {booking.category
                        ? booking.category.charAt(0).toUpperCase() + booking.category.slice(1)
                        : "N/A"}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {booking.date ? format(new Date(booking.date), "MMM d, yyyy") : "-"}
                  </td>

                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    ${Number(booking.amount ?? 0).toFixed(2)}
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge status={booking.status ?? "pending"} />
                  </td>

                  {/* ---------------------- ACTIONS ---------------------- */}
                  <td className="py-3 px-4 text-right space-x-2">
                    {/* Confirm / Unconfirm */}
                    <button
                      onClick={() => toggleStatus(booking.id, booking.status)}
                      className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-md transition ${
                        isConfirmed
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                      title={isConfirmed ? "Mark as Pending" : "Mark as Confirmed"}
                    >
                      {isConfirmed ? (
                        <>
                          <XCircle size={14} />
                          Unconfirm
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} />
                          Confirm
                        </>
                      )}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onRemove(booking.id)}
                      className="inline-flex items-center gap-1.5 text-xs px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
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