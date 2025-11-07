// src/context/WalletContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const WalletContext = createContext();
export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const defaultWallets = {
    alhind: 1000,
    akbar: 500,
    office: 2000,
  };

  const [wallets, setWallets] = useState(() => {
    const saved = localStorage.getItem("wallets");
    return saved ? JSON.parse(saved) : defaultWallets;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("walletTransactions");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("wallets", JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem("walletTransactions", JSON.stringify(transactions));
  }, [transactions]);

  const updateWallet = (walletKey, amount, operation = "add") => {
    setWallets((prev) => {
      const current = prev[walletKey] ?? 0;
      const updated = operation === "add" ? current + amount : current - amount;
      return { ...prev, [walletKey]: Math.max(0, updated) };
    });
  };

  // Add with logging
  const addToWallet = (walletKey, amount, user = "System") => {
    if (!walletKey || amount <= 0) return;
    updateWallet(walletKey, amount, "add");
    logTransaction(walletKey, amount, "credit", user);
  };

  // Deduct with logging + balance check
  const deductFromWallet = (walletKey, amount, user = "System") => {
    if (!walletKey || amount <= 0) return;
    const current = wallets[walletKey] ?? 0;
    if (current < amount) {
      throw new Error(`Insufficient balance in ${walletKey}. Available: ₹${current.toFixed(2)}, Required: ₹${amount.toFixed(2)}`);
    }
    updateWallet(walletKey, amount, "deduct");
    logTransaction(walletKey, amount, "debit", user);
  };

  // Log transaction
  const logTransaction = (walletKey, amount, operation, user = "Unknown") => {
    setTransactions((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        walletKey,
        amount,
        operation, // "credit" or "debit"
        user,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // Safe wallet data
  const walletData = [
    { name: "AlHind", amount: wallets.alhind ?? 0, key: "alhind" },
    { name: "Akbar", amount: wallets.akbar ?? 0, key: "akbar" },
    { name: "Office Fund", amount: wallets.office ?? 0, key: "office" },
  ];

  return (
    <WalletContext.Provider value={{ 
      walletData, 
      addToWallet, 
      deductFromWallet, 
      logTransaction, 
      transactions 
    }}>
      {children}
    </WalletContext.Provider>
  );
};