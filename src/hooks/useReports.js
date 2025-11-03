// src/hooks/useReports.js
import { useMemo } from "react";

export default function useReports(experiences) {
  // Prepare data for line chart
  const lineData = useMemo(() => {
    const map = {};
    experiences.forEach((item) => {
      const label = new Date(item.date).toLocaleDateString("en-US", {
        weekday: "short",
      });
      map[label] = (map[label] || 0) + Number(item.value || 0);
    });
    return Object.keys(map).map((key) => ({ label: key, value: map[key] }));
  }, [experiences]);

  // Prepare data for donut chart
  const donutData = useMemo(() => {
    const map = {};
    experiences.forEach((item) => {
      const label = item.category || "Other";
      map[label] = (map[label] || 0) + Number(item.value || 0);
    });
    return Object.keys(map).map((key) => ({ label: key, value: map[key] }));
  }, [experiences]);

  // Summary totals
  const totalValue = useMemo(() => {
    return experiences.reduce((sum, item) => sum + Number(item.value || 0), 0);
  }, [experiences]);

  return { lineData, donutData, totalValue };
}
