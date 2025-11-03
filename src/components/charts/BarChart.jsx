// src/components/charts/BarChart.jsx
import React from "react";
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function BarChart({ data, height = 300, showTooltip = true }) {
  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200"
        style={{ height }}
      >
        <p className="text-gray-500 text-sm">No data to display</p>
      </div>
    );
  }

  // Auto-generate colors if not provided
  const coloredData = data.map((item, i) => ({
    ...item,
    fill: item.color || `hsl(${(i * 360) / data.length}, 70%, 55%)`,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar data={coloredData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `$${value.toLocaleString()}`}
        />
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
            formatter={(value) => `$${value.toLocaleString()}`}
          />
        )}
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {coloredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </RechartsBar>
    </ResponsiveContainer>
  );
}