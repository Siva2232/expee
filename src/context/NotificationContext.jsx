// src/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const NotificationContext = createContext();

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
};

const NOTIF_KEY = "crm-compass-notifications-v2";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Load
  useEffect(() => {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (raw) {
      try { setNotifications(JSON.parse(raw)); }
      catch (e) { console.error("Failed to load notifications", e); }
    }
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (msg) => {
    const id = Date.now();
    const n = { id, message: msg, timestamp: new Date(), read: false };
    setNotifications(p => [n, ...p]);
  };

  const markAsRead = (id) => {
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      setNotifications,
      addNotification,
      markAsRead,
      clearAll,
      unreadCount,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};