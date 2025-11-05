// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AllBookings from "../pages/Bookings/AllBookings";
import TrackBooking from "../pages/Bookings/TrackBooking";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import SignIn from "../pages/SignIn";
import Register from "../pages/Register";
import NotFound from "../pages/NotFound";
import AddBooking from "../pages/Bookings/AddBooking";
import FundsDashboard from "../pages/FundsDashboard";
import AddRevenue from "../pages/AddRevenue";
import LogExpense from "../pages/LogExpense";
import ViewExpense from "../pages/ViewExpense";
// Contexts
import { BookingProvider } from "../context/BookingContext";
import { FundsProvider } from "../context/FundsContext";
import { ExpenseProvider } from "../context/ExpenseContext"; // ← NEW

const AppRoutes = () => {
  return (
    <BookingProvider>
      <FundsProvider>
        <ExpenseProvider> {/* ← Wrap everything that uses expenses */}
          <Routes>
            {/* Auth */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />

            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />

            {/* Bookings */}
            <Route path="/bookings" element={<AllBookings />} />
            <Route path="/bookings/track" element={<TrackBooking />} />
            <Route path="/bookings/add" element={<AddBooking />} />

            {/* Funds + Expenses */}
            <Route path="/funds/*" element={<FundsDashboard />} />
            <Route path="/add-revenue/*" element={<AddRevenue />} /> {/* ← NEW */}
            <Route path="/log-expense/*" element={<LogExpense />} /> {/* ← NEW */}
           <Route path="/view/:id" element={<ViewExpense />} />

            {/* Reports & Settings */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ExpenseProvider>
      </FundsProvider>
    </BookingProvider>
  );
};

export default AppRoutes;