// src/components/ui/Input.jsx
import React from "react";
import clsx from "clsx";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  className = "",
  required = false,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1.5 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={clsx(
          "w-full px-3 py-2 rounded-lg border border-gray-200 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all",
          className
        )}
        {...props}
      />
    </div>
  );
}
