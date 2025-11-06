import { useState, useEffect } from "react";
import { Plus, Minus, Trash2, Edit3, X, Check, IndianRupee, Sparkles } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

export default function Investment() {
  const [partners, setPartners] = useState(() => {
    const saved = localStorage.getItem("partners");
    return saved ? JSON.parse(saved) : [];
  });

  const [name, setName] = useState("");
  const [modal, setModal] = useState({ open: false, partner: null, type: "" });
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    localStorage.setItem("partners", JSON.stringify(partners));
  }, [partners]);

  const addPartner = () => {
    if (!name.trim()) return;
    setPartners([...partners, { id: Date.now(), name: name.trim(), balance: 0 }]);
    setName("");
  };

  const startEdit = (id, current) => {
    setEditingId(id);
    setTempName(current);
  };

  const saveEdit = () => {
    if (!tempName.trim()) return;
    setPartners(partners.map(p => p.id === editingId ? { ...p, name: tempName.trim() } : p));
    setEditingId(null);
  };

  const openModal = (partner, type) => {
    setModal({ open: true, partner, type });
    setAmount("");
  };

  const closeModal = () => setModal({ open: false, partner: null, type: "" });

  const execute = () => {
    const value = Number(amount);
    if (modal.type !== "delete" && (!amount || value <= 0)) return;

    if (modal.type === "add" || modal.type === "withdraw") {
      setPartners(partners.map(p =>
        p.id === modal.partner.id
          ? { ...p, balance: modal.type === "add" ? p.balance + value : p.balance - value }
          : p
      ));
    } else if (modal.type === "delete") {
      setPartners(partners.filter(p => p.id !== modal.partner.id));
    }
    closeModal();
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="mb-10 animate-in fade-in slide-in-from-top duration-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                <IndianRupee className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Partner Investments
              </h1>
              <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-gray-600 ml-14">Elegantly track every rupee with style</p>
          </div>

          {/* Add Partner */}
          <div className="mb-10 animate-in fade-in slide-in-from-left delay-100 duration-700">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addPartner()}
                  placeholder="Enter partner name..."
                  className="flex-1 px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:bg-white transition-all duration-300 font-medium placeholder-gray-400"
                />
                <button
                  onClick={addPartner}
                  className="px-7 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-3 font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Add Partner
                </button>
              </div>
            </div>
          </div>

          {/* Partners Grid */}
          {partners.length === 0 ? (
            <div className="text-center py-20 animate-in fade-in duration-1000">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-6 shadow-inner">
                <IndianRupee className="w-16 h-16 text-indigo-600" />
              </div>
              <p className="text-xl text-gray-500 font-medium">No partners yet</p>
              <p className="text-gray-400 mt-1">Add your first partner to begin tracking</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {partners.map((p, idx) => (
                <div
                  key={p.id}
                  className="group animate-in fade-in slide-in-from-bottom duration-700"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative h-full bg-white/80 backdrop-blur-2xl rounded-3xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                    
                    {/* Floating Edit/Delete */}
                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {editingId === p.id ? (
                        <>
                          <button onClick={saveEdit} className="p-2 bg-green-100 rounded-xl hover:bg-green-200 transition">
                            <Check className="w-4 h-4 text-green-600" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
                            <X className="w-4 h-4 text-gray-600" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(p.id, p.name)}
                          className="p-2 bg-indigo-100 rounded-xl hover:bg-indigo-200 transition"
                        >
                          <Edit3 className="w-4 h-4 text-indigo-600" />
                        </button>
                      )}
                    </div>

                    {/* Name */}
                    <div className="mb-4">
                      {editingId === p.id ? (
                        <input
                          value={tempName}
                          onChange={(e) => setTempName(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && saveEdit()}
                          className="text-2xl font-bold bg-transparent border-b-2 border-indigo-400 focus:border-purple-500 outline-none w-full transition-colors"
                          autoFocus
                        />
                      ) : (
                        <h3 className="text-2xl font-bold text-gray-800">{p.name}</h3>
                      )}
                    </div>

                    {/* Balance */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-7 h-7 text-indigo-600" />
                        <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {p.balance.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="h-1 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full mt-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-1000"
                          style={{ width: `${Math.min((p.balance / 100000) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => openModal(p, "add")}
                        className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-md font-medium flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Add
                      </button>
                      <button
                        onClick={() => openModal(p, "withdraw")}
                        className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl hover:from-rose-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 shadow-md font-medium flex items-center justify-center gap-2"
                      >
                        <Minus className="w-5 h-5" />
                        Withdraw
                      </button>
                      <button
                        onClick={() => openModal(p, "delete")}
                        className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transform hover:scale-110 transition-all duration-300"
                      >
                        <Trash2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal */}
          {modal.open && modal.partner && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
              <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in duration-300">
                
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {modal.type === "add" && "Add Investment"}
                    {modal.type === "withdraw" && "Withdraw Amount"}
                    {modal.type === "delete" && "Delete Partner"}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-xl transition"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {modal.type === "delete" ? (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-10 h-10 text-rose-600" />
                    </div>
                    <p className="text-lg font-medium text-gray-800 mb-1">
                      Delete <span className="text-rose-600">{modal.partner.name}</span>?
                    </p>
                    <p className="text-sm text-gray-500">This action cannot be undone.</p>
                    <div className="flex gap-3 mt-8">
                      <button
                        onClick={closeModal}
                        className="flex-1 py-3 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={execute}
                        className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-2xl hover:from-rose-600 hover:to-pink-700 transition font-medium shadow-lg"
                      >
                        Delete Forever
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mb-6">
                      <p className="text-sm text-gray-600">Partner</p>
                      <p className="text-xl font-bold text-gray-800">{modal.partner.name}</p>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Amount in Rupees
                      </label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-600" />
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0"
                          className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:bg-white transition-all font-semibold text-lg"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={closeModal}
                        className="flex-1 py-3 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={execute}
                        className={`flex-1 py-3 rounded-2xl text-white font-medium shadow-lg transition-all transform hover:scale-105 ${
                          modal.type === "add"
                            ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                            : "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                        }`}
                      >
                        {modal.type === "add" ? "Add Amount" : "Withdraw"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-top {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-in-from-left {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-from-bottom {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-in { animation-fill-mode: both; }
      `}</style>
    </DashboardLayout>
  );
}