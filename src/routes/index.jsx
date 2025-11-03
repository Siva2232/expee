import React, { useEffect, useState, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Layout
import Layout from "../layouts/Layout";

// Pages
import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Tracker from "../pages/Tracker";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Goals from "../pages/Goals";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";

// ──────────────────────────────────────
// 1. Auth Context (single source of truth)
// ──────────────────────────────────────
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

// ──────────────────────────────────────
// 2. Auth Provider (loads once, never re-creates)
// ──────────────────────────────────────
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("demoUser");
    if (raw) setUser(JSON.parse(raw));
    setLoading(false);
  }, []);

  const login = (u) => {
    localStorage.setItem("demoUser", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("demoUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// ──────────────────────────────────────
// 3. Protected Layout (only renders Layout when logged in)
// ──────────────────────────────────────
function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return user ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/auth/signin" replace />
  );
}

// ──────────────────────────────────────
// 4. Main Router
// ──────────────────────────────────────
export default function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/auth/signin" element={<SignIn />} />
          <Route path="/auth/signup" element={<SignUp />} />

          {/* Protected – Layout + Outlet */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/reports" element={<Reports />} />
                <Route path="/goals" element={<Goals />} />
            <Route path="/settings" element={<Settings />} />

          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
