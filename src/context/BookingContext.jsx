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
import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast"; // npm install react-hot-toast

// === CONSTANTS ===
const STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
};

const CATEGORY = {
  FLIGHT: "flight",
  BUS: "bus",
  TRAIN: "train",
};

// === CONTEXT ===
export const BookingContext = createContext(undefined);

export const BookingProvider = ({ children }) => {
  // 1. Load bookings from localStorage
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("bookings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        console.error("Failed to parse bookings from localStorage", e);
        return [];
      }
    }
    return [];
  });

  // 2. Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem("bookings", JSON.stringify(bookings));
    } catch (e) {
      console.error("Failed to save bookings to localStorage", e);
      toast.error("Failed to save data");
    }
  }, [bookings]);

  // 3. Add new booking with full validation
  const addBooking = (rawBooking) => {
    const {
      customerName,
      email,
      date,
      amount,
      status = STATUS.PENDING,
      category = CATEGORY.FLIGHT,
    } = rawBooking;

    // === VALIDATION ===
    if (!customerName?.trim()) {
      throw new Error("Customer name is required");
    }
    if (!email?.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error("Valid email is required");
    }
    if (!date) {
      throw new Error("Date is required");
    }
    if (!amount || amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    if (!Object.values(CATEGORY).includes(category)) {
      throw new Error("Invalid category");
    }
    if (!Object.values(STATUS).includes(status)) {
      throw new Error("Invalid status");
    }

    const newBooking = {
      id: uuidv4(),
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      date: new Date(date).toISOString(), // ISO string for consistency
      amount: Number(amount),
      status,
      category,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [...prev, newBooking]);
    toast.success("Booking added successfully");
    return newBooking;
  };

  // 4. Remove booking
  const removeBooking = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    toast.success("Booking removed");
  };

  // 5. Update booking status with toast
  const updateBookingStatus = (id, newStatus) => {
    if (!Object.values(STATUS).includes(newStatus)) {
      throw new Error("Invalid status");
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: newStatus } : b
      )
    );

    const booking = bookings.find((b) => b.id === id);
    const name = booking?.customerName || "Booking";

    toast.success(
      newStatus === STATUS.CONFIRMED
        ? `${name} confirmed`
        : `${name} marked as pending`
    );
  };

  // 6. Get booking by ID
  const getBookingById = (id) => bookings.find((b) => b.id === id);

  // 7. Get stats (optional helper for dashboard)
  const getStats = () => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === STATUS.PENDING).length;
    const confirmed = total - pending;
    const revenue = bookings.reduce((sum, b) => sum + b.amount, 0);

    return { total, pending, confirmed, revenue };
  };

  // === CONTEXT VALUE ===
  const value = {
    bookings,
    addBooking,
    removeBooking,
    updateBookingStatus,
    getBookingById,
    getStats,
    isLoading: false, // set true if using API
    STATUS,
    CATEGORY,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// === CUSTOM HOOK ===
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};