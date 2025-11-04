// src/components/FundsChart.jsx
import { useMemo } from "react";
import { useBooking } from "../context/BookingContext";
import { useExpense } from "../context/ExpenseContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, startOfDay, subDays, startOfWeek, subWeeks, startOfMonth, subMonths, startOfYear, subYears } from "date-fns";

const FundsChart = ({ period = "daily" }) => {
  const { bookings = [] } = useBooking();
  const { expenses = [] } = useExpense();

  const data = useMemo(() => {
    const now = new Date();
    let start, labelFormat;

    if (period === "daily") { start = subDays(now, 6); labelFormat = "MMM d"; }
    else if (period === "Weekly") { start = subWeeks(now, 3); labelFormat = "'W'W yyyy"; }
    else if (period === "monthly") { start = subMonths(now, 11); labelFormat = "MMM yyyy"; }
    else if (period === "yearly") { start = subYears(now, 2); labelFormat = "yyyy"; }

    const map = new Map();
    const current = new Date(start);

    while (current <= now) {
      const key = format(current, "yyyy-MM-dd");
      map.set(key, { date: format(current, labelFormat), revenue: 0, expenses: 0 });
      current.setDate(current.getDate() + (period === "weekly" ? 7 : period === "monthly" ? 30 : 1));
    }

    bookings.forEach(b => {
      const d = new Date(b.date);
      if (d >= start && d <= now) {
        const key = format(d, "yyyy-MM-dd");
        if (map.has(key)) {
          const entry = map.get(key);
          entry.revenue += b.amount;
          map.set(key, entry);
        }
      }
    });

    expenses.forEach(e => {
      const d = new Date(e.date);
      if (d >= start && d <= now) {
        const key = format(d, "yyyy-MM-dd");
        if (map.has(key)) {
          const entry = map.get(key);
          entry.expenses += e.amount;
          map.set(key, entry);
        }
      }
    });

    return Array.from(map.values()).map(d => ({ ...d, profit: d.revenue - d.expenses }));
  }, [bookings, expenses, period]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
        <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" />
        <Line type="monotone" dataKey="profit" stroke="#6366f1" strokeWidth={2} name="Profit" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FundsChart;