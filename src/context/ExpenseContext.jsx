// src/context/ExpenseContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const ExpenseContext = createContext(undefined);

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ── ADD EXPENSE WITH CATEGORY ──
  const addExpense = (desc, amount, category = "Other") => {
    if (!desc.trim() || amount <= 0) return;

    const newExpense = {
      id: uuidv4(),
      description: desc.trim(),
      amount: Number(amount),
      category: category.trim() || "Other",
      date: new Date().toISOString(),
    };

    setExpenses(prev => [...prev, newExpense]);
  };

  // ── REMOVE EXPENSE ──
  const removeExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // ── TOTAL SPENT ──
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // ── TOP CATEGORIES (optional helper) ──
  const getCategoryTotals = () => {
    const map = {};
    expenses.forEach(e => {
      const cat = e.category || "Other";
      map[cat] = (map[cat] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      addExpense,
      removeExpense,
      total,
      getCategoryTotals, // optional, or compute in component
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error("useExpense must be used within ExpenseProvider");
  return ctx;
};