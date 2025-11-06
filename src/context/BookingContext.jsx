// // src/context/BookingContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import { v4 as uuidv4 } from "uuid";

// export const BookingContext = createContext(undefined);

// export const BookingProvider = ({ children }) => {
//   // 1. Load from localStorage
//   const [bookings, setBookings] = useState(() => {
//     const saved = localStorage.getItem("bookings");
//     if (saved) {
//       try {
//         return JSON.parse(saved);
//       } catch {
//         return [];
//       }
//     }
//     return [];
//   });

//   // 2. Persist every change
//   useEffect(() => {
//     localStorage.setItem("bookings", JSON.stringify(bookings));
//   }, [bookings]);

//   // 3. Add booking with full validation
//   const addBooking = (rawBooking) => {
//     const {
//       customerName,
//       email,
//       date,
//       amount,
//       status = "pending",
//       category = "flight", // default
//     } = rawBooking;

//     // Validation
//     if (!customerName?.trim()) throw new Error("Customer name is required");
//     if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Valid email is required");
//     if (!date) throw new Error("Date is required");
//     if (!amount || amount <= 0) throw new Error("Amount must be greater than 0");
//     if (!["flight", "bus", "train"].includes(category)) {
//       throw new Error("Category must be flight, bus, or train");
//     }

//     const newBooking = {
//       id: uuidv4(),
//       customerName: customerName.trim(),
//       email: email.trim(),
//       date,
//       amount: Number(amount),
//       status,
//       category, // ← SAVED HERE
//     };

//     setBookings((prev) => [...prev, newBooking]);
//     return newBooking;
//   };

//   // 4. Remove booking
//   const removeBooking = (id) => {
//     setBookings((prev) => prev.filter((b) => b.id !== id));
//   };

//   // 5. Update status
//   const updateBookingStatus = (id, newStatus) => {
//     if (!["pending", "confirmed"].includes(newStatus)) {
//       throw new Error("Invalid status");
//     }
//     setBookings((prev) =>
//       prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
//     );
//   };

//   // 6. Get by ID
//   const getBookingById = (id) => bookings.find((b) => b.id === id);

//   // 7. Context value
//   const value = {
//     bookings,
//     addBooking,
//     removeBooking,
//     updateBookingStatus,
//     getBookingById,
//   };

//   return (
//     <BookingContext.Provider value={value}>
//       {children}
//     </BookingContext.Provider>
//   );
// };

// // Custom hook
// export const useBooking = () => {
//   const context = useContext(BookingContext);
//   if (!context) {
//     throw new Error("useBooking must be used within a BookingProvider");
//   }
//   return context;
// };
// src/context/BookingContext.jsx
// src/context/BookingContext.jsx
// src/context/BookingContext.jsx
// src/context/BookingContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

export const CATEGORY = {
  FLIGHT: "flight",
  BUS: "bus",
  TRAIN: "train",
  CAB: "cab",
  HOTEL: "hotel",
};

export const STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
};

const BookingContext = createContext(undefined);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem("bookings");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to load bookings", e);
      toast.error("Failed to load saved data");
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("bookings", JSON.stringify(bookings));
    } catch (e) {
      console.error("Failed to save bookings", e);
    }
  }, [bookings]);

  const addBooking = (rawBooking) => {
    const {
      customerName,
      email,
      contactNumber,
      date,
      basePay = 0,
      commissionAmount = 0,
      markupAmount = 0,
      platform = "",
      status = STATUS.PENDING,
      category = CATEGORY.FLIGHT,
    } = rawBooking;

    if (!customerName?.trim()) throw new Error("Customer name is required");
    if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email))
      throw new Error("Valid email is required");
    if (!contactNumber?.trim()) throw new Error("Contact number is required");
    if (!/^\d{10}$/.test(contactNumber.replace(/[\s-]/g, "")))
      throw new Error("Contact number must be 10 digits");
    if (!date) throw new Error("Date is required");

    if (basePay < 0) throw new Error("Base pay cannot be negative");
    if (commissionAmount < 0) throw new Error("Commission cannot be negative");
    if (markupAmount < 0) throw new Error("Markup cannot be negative");

    if (!Object.values(CATEGORY).includes(category))
      throw new Error("Invalid category");
    if (!Object.values(STATUS).includes(status))
      throw new Error("Invalid status");

    if (["flight", "hotel", "cab"].includes(category) && !platform)
      throw new Error("Platform is required");

    const totalRevenue = Number(commissionAmount) + Number(markupAmount);

    const newBooking = {
      id: `BK${Date.now()}${Math.floor(Math.random() * 1000)}`,
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      contactNumber: contactNumber.trim(),
      date,
      basePay: Number(basePay),
      commissionAmount: Number(commissionAmount),
      markupAmount: Number(markupAmount),
      totalRevenue: Number(totalRevenue.toFixed(2)),
      platform,
      status,
      category,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [...prev, newBooking]);
    toast.success("Booking added successfully!");
    return newBooking;
  };

  const removeBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    toast.success("Booking removed");
  };

  const updateBookingStatus = (id, newStatus) => {
    if (!Object.values(STATUS).includes(newStatus))
      throw new Error("Invalid status");

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );

    const booking = bookings.find((b) => b.id === id);
    const name = booking?.customerName?.split(" ")[0] || "Booking";
    const msg =
      newStatus === STATUS.CONFIRMED
        ? `${name}'s booking confirmed`
        : newStatus === STATUS.CANCELLED
        ? `${name}'s booking cancelled`
        : `${name}'s booking pending`;
    toast.success(msg);
  };

  const getBookingById = (id) => bookings.find((b) => b.id === id);

  const getStats = () => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === STATUS.PENDING).length;
    const confirmed = bookings.filter((b) => b.status === STATUS.CONFIRMED).length;
    const cancelled = total - pending - confirmed;
    const revenue = bookings.reduce((sum, b) => sum + b.totalRevenue, 0);
    const basePayTotal = bookings.reduce((sum, b) => sum + b.basePay, 0);

    return { total, pending, confirmed, cancelled, revenue, basePayTotal };
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        removeBooking,
        updateBookingStatus,
        getBookingById,
        getStats,
        isLoading: false,
        CATEGORY,
        STATUS,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
};