// src/context/BookingContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export const BookingContext = createContext(undefined);

export const BookingProvider = ({ children }) => {
  // 1. Load from localStorage
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("bookings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // 2. Persist every change
  useEffect(() => {
    localStorage.setItem("bookings", JSON.stringify(bookings));
  }, [bookings]);

  // 3. Add booking with full validation
  const addBooking = (rawBooking) => {
    const {
      customerName,
      email,
      date,
      amount,
      status = "pending",
      category = "flight", // default
    } = rawBooking;

    // Validation
    if (!customerName?.trim()) throw new Error("Customer name is required");
    if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Valid email is required");
    if (!date) throw new Error("Date is required");
    if (!amount || amount <= 0) throw new Error("Amount must be greater than 0");
    if (!["flight", "bus", "train"].includes(category)) {
      throw new Error("Category must be flight, bus, or train");
    }

    const newBooking = {
      id: uuidv4(),
      customerName: customerName.trim(),
      email: email.trim(),
      date,
      amount: Number(amount),
      status,
      category, // ← SAVED HERE
    };

    setBookings((prev) => [...prev, newBooking]);
    return newBooking;
  };

  // 4. Remove booking
  const removeBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  // 5. Update status
  const updateBookingStatus = (id, newStatus) => {
    if (!["pending", "confirmed"].includes(newStatus)) {
      throw new Error("Invalid status");
    }
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  // 6. Get by ID
  const getBookingById = (id) => bookings.find((b) => b.id === id);

  // 7. Context value
  const value = {
    bookings,
    addBooking,
    removeBooking,
    updateBookingStatus,
    getBookingById,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};