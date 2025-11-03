// src/components/ui/Card.jsx
import React from "react";
import clsx from "clsx";

export default function Card({ children, className = "", hover = false }) {
  return (
    <div
      className={clsx(
        "bg-white/60 backdrop-blur-md rounded-2xl shadow-soft border border-white/40 p-6 transition-all",
        hover && "hover:shadow-lg hover:scale-[1.01]",
        className
      )}
    >
      {children}
    </div>
  );
}
