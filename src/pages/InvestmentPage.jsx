import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout"; // ✅ Add this

export default function Investment() {
  const [partners, setPartners] = useState(() => {
    const stored = localStorage.getItem("partners");
    return stored ? JSON.parse(stored) : [];
  });

  const [name, setName] = useState("");
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("");

  useEffect(() => {
    localStorage.setItem("partners", JSON.stringify(partners));
  }, [partners]);

  const addPartner = () => {
    if (!name.trim()) return;
    setPartners([...partners, { id: Date.now(), name, balance: 0 }]);
    setName("");
  };

  const updateBalance = () => {
    if (!amount || Number(amount) <= 0) return;
    setPartners(
      partners.map((p) =>
        p.id === selected
          ? {
              ...p,
              balance:
                mode === "add"
                  ? p.balance + Number(amount)
                  : p.balance - Number(amount),
            }
          : p
      )
    );
    setSelected(null);
    setAmount("");
    setMode("");
  };

  const deletePartner = (id) => {
    setPartners(partners.filter((p) => p.id !== id));
    setSelected(null);
  };

  const editName = (id, newName) => {
    setPartners(
      partners.map((p) => (p.id === id ? { ...p, name: newName } : p))
    );
  };

  return (
    <DashboardLayout>  {/* ✅ Wrapped Entire Page */}

      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Partner Investments</h1>

        {/* Add Partner */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            className="flex-1 border rounded-lg px-3 py-2"
            placeholder="Partner Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={addPartner}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Partners Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {partners.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between"
            >
              <input
                className="text-lg font-semibold mb-2 w-full border-b focus:outline-none"
                value={p.name}
                onChange={(e) => editName(p.id, e.target.value)}
              />

              <p className="text-gray-600 mb-4">Balance: ₹{p.balance}</p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setSelected(p.id);
                    setMode("add");
                  }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>

                <button
                  onClick={() => {
                    setSelected(p.id);
                    setMode("withdraw");
                  }}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700"
                >
                  <Minus className="w-4 h-4" /> Withdraw
                </button>

                <button
                  onClick={() => setSelected({ id: p.id, delete: true })}
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modals stay same */}
      </div>

    </DashboardLayout>
  );
}
