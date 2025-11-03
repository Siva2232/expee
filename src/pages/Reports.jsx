// src/pages/Reports.jsx
import React from "react";
import Layout from "../layouts/Layout";
import LineChart from "../components/charts/LineChart";
import DonutChart from "../components/charts/DonutChart";

export default function Reports() {
  return (
      <div className="grid md:grid-cols-2 gap-6">
        <LineChart title="Monthly Trends" />
        <DonutChart title="Yearly Overview" />
      </div>
  );
}
