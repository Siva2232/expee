// src/components/layout/LayoutShell.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

export default function LayoutShell({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNav />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
