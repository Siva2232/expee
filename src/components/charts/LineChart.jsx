// src/components/charts/LineChart.jsx
import React from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * Reusable LineChart
 *
 * @param {Object[]} data          – [{ label: "Mon", value: 6.5 }, …]
 * @param {string}   title         – Optional chart title
 * @param {number}   height        – Chart height (default 280)
 * @param {boolean}  showGrid      – Show background grid
 * @param {boolean}  showTooltip   – Show tooltip on hover
 * @param {string}   className     – Extra Tailwind classes for the wrapper
 */
export default function LineChart({
  data = [],
  title = "",
  height = 280,
  showGrid = true,
  showTooltip = true,
  className = "",
}) {
  // -------------------------------------------------
  // Empty state
  // -------------------------------------------------
  if (!data || data.length === 0) {
    return (
      <div
        className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center ${className}`}
        style={{ height }}
      >
        <p className="text-gray-500 text-sm">No data to display</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 ${className}`}
    >
      {/* Title (optional) */}
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}

      {/* Chart */}
      <div style={{ height: height - (title ? 80 : 48) }}>
        <ResponsiveContainer width="100%" height="100%">
          <ReLineChart
            data={data}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            {showGrid && (
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            )}

            <XAxis
              dataKey="label"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                }}
                formatter={(v) => (typeof v === "number" ? v.toLocaleString() : v)}
              />
            )}

            <Line
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#3b82f6" }}
              activeDot={{ r: 6, strokeWidth: 2, fill: "#3b82f6" }}
            />
          </ReLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}