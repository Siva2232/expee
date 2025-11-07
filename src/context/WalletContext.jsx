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

  // ✅ Save wallets to localStorage whenever wallet changes
  useEffect(() => {
    localStorage.setItem("wallets", JSON.stringify(wallets));
  }, [wallets]);

  // ✅ Save transactions to localStorage whenever transactions change
  useEffect(() => {
    localStorage.setItem("walletTransactions", JSON.stringify(transactions));
  }, [transactions]);

  const updateWallet = (walletKey, amount, operation = "add") => {
    setWallets((prev) => ({
      ...prev,
      [walletKey]:
        operation === "add"
          ? Math.max(0, prev[walletKey] + amount)
          : Math.max(0, prev[walletKey] - amount),
    }));
  };

  const addToWallet = (walletKey, amount) => {
    if (!walletKey || amount <= 0) return;
    updateWallet(walletKey, amount, "add");
  };

  const deductFromWallet = (walletKey, amount) => {
    if (!walletKey || amount <= 0) return;
    if (wallets[walletKey] < amount) {
      throw new Error(`Insufficient balance in ${walletKey}. Available: ₹${wallets[walletKey].toFixed(2)}, Required: ₹${amount.toFixed(2)}`);
    }
    updateWallet(walletKey, amount, "deduct");
  };

  const logTransaction = (walletKey, amount, operation, user = "Unknown") => {
    setTransactions((prev) => [
      ...prev,
      {
        id: Date.now(),
        walletKey,
        amount,
        operation,
        user,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // ✅ Derive display-ready data (do NOT store this formatted version)
  const walletData = [
    { name: "AlHind Agency", amount: wallets.alhind, key: "alhind" },
    { name: "Akbar Agency", amount: wallets.akbar, key: "akbar" },
    { name: "Office Fund", amount: wallets.office, key: "office" },
  ];

  return (
    <WalletContext.Provider value={{ walletData, addToWallet, deductFromWallet, logTransaction, transactions }}>
      {children}
    </WalletContext.Provider>
  );
};