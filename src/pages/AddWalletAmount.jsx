// src/pages/AddWalletAmount.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useWallet } from "../context/WalletContext";
import { useAuth } from "../context/AuthContext";
import { ArrowLeft, Plus, Minus, DollarSign, CheckCircle, Wallet as WalletIcon, Clock, User } from "lucide-react";

const walletOptions = [
  { value: "alhind", label: "AlHind" },
  { value: "akbar", label: "Akbar" },
  { value: "office", label: "Office Fund" },
];

export default function AddWalletAmount() {
  const { addToWallet, deductFromWallet, logTransaction, transactions } = useWallet();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ 
    wallet: "", 
    amount: "", 
    mode: "add",
    name: user?.name || "" // Pre-fill with current user name if available
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.wallet) e.wallet = "Select a wallet";
    if (!form.amount || Number(form.amount) <= 0) e.amount = "Enter a valid amount";
    if (!form.name.trim()) e.name = "Name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const amount = Number(form.amount);
      const operation = form.mode === "add" ? "add" : "deduct";
      form.mode === "add"
        ? addToWallet(form.wallet, amount)
        : deductFromWallet(form.wallet, amount);

      logTransaction(form.wallet, amount, operation, form.name.trim());

      setSuccess(true);
      setTimeout(() => navigate("/add-wallet-amount"), 1000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const recentTransactions = transactions.slice(-5).reverse(); // Last 5, newest first

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto p-6">
        <button onClick={() => navigate("/")} className="flex gap-2 text-gray-600 mb-6">
          <ArrowLeft /> Back
        </button>

        {success && (
          <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-lg flex gap-2 mb-4 text-emerald-700">
            <CheckCircle /> Wallet Updated Successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-5">
          <div className="flex gap-3">
            <button type="button" className={`flex-1 py-2 rounded-lg ${form.mode === "add" ? "bg-emerald-600 text-white" : "bg-gray-200"}`} onClick={() => setForm({ ...form, mode: "add" })}>
              <Plus size={18} /> Add
            </button>
            <button type="button" className={`flex-1 py-2 rounded-lg ${form.mode === "remove" ? "bg-red-600 text-white" : "bg-gray-200"}`} onClick={() => setForm({ ...form, mode: "remove" })}>
              <Minus size={18} /> Remove
            </button>
          </div>

          <select 
            className={`w-full border p-3 rounded-lg ${errors.wallet ? "border-red-500" : ""}`} 
            value={form.wallet} 
            onChange={(e) => setForm({ ...form, wallet: e.target.value })}
          >
            <option value="">Select Wallet</option>
            {walletOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {errors.wallet && <p className="text-sm text-red-600">{errors.wallet}</p>}

          <div className="relative">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User size={18} /> Name
            </label>
            <input 
              type="text" 
              className={`w-full border p-3 rounded-lg pr-10 ${errors.name ? "border-red-500" : ""}`} 
              placeholder="Enter name manually" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
          </div>

          <input 
            type="number" 
            className={`w-full border p-3 rounded-lg ${errors.amount ? "border-red-500" : ""}`} 
            placeholder="Amount" 
            value={form.amount} 
            onChange={(e) => setForm({ ...form, amount: e.target.value })} 
          />
          {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}

          <button type="submit" disabled={submitting} className={`w-full py-3 rounded-lg text-white ${form.mode === "add" ? "bg-emerald-600" : "bg-red-600"} ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}>
            {submitting ? "Processing..." : (form.mode === "add" ? "Add Amount" : "Remove Amount")}
          </button>
        </form>

        {/* Transaction History */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock size={20} /> Recent Transactions
          </h2>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 text-center">No transactions yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentTransactions.map((t) => (
                <li key={t.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{t.user}</span> {t.operation === "add" ? "added" : "deducted"} ₹{t.amount}
                    <br />
                    <small className="text-gray-500">{new Date(t.timestamp).toLocaleString()}</small>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    t.operation === "add" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  }`}>
                    {t.walletKey}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}