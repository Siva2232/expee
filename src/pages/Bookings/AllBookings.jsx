// src/pages/AllBookings.jsx
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import BookingTable from "./BookingTable";
import SearchBar from "../../components/SearchBar";
import FilterMenu from "../../components/FilterMenu";
import { useBooking } from "../../context/BookingContext";
import { Plus } from "lucide-react";

const AllBookings = () => {
  const { bookings, removeBooking, updateBookingStatus } = useBooking();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">All Bookings</h1>

          <div className="flex items-center gap-3">
            <SearchBar />
            <FilterMenu />
            <Link
              to="/bookings/add"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md"
            >
              <Plus size={18} />
              Add Booking
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
          <BookingTable
            bookings={bookings}
            onUpdateStatus={updateBookingStatus}
            onRemove={removeBooking}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AllBookings;