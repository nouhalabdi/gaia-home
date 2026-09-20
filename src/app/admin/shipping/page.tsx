"use client";
import { useEffect, useState } from "react";
import { Save, Search, Check, Loader2 } from "lucide-react";

export default function AdminShippingPage() {
  const [shippings, setShippings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingCode, setSavingCode] = useState<string | null>(null);
  const [savedCode, setSavedCode] = useState<string | null>(null);

  const fetchShipping = async () => {
    const res = await fetch("/api/shipping");
    const data = await res.json();
    setShippings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchShipping();
  }, []);

  // ✅ تعديل السعر في الحالة المحلية فقط
  const handleChange = (code: string, field: "homePrice" | "officePrice", value: string) => {
    setShippings(
      shippings.map((s) =>
        s.code === code ? { ...s, [field]: value } : s
      )
    );
  };

  // ✅ حفظ السعر لولاية واحدة
  const handleSaveOne = async (code: string) => {
    setSavingCode(code);
    const wilaya = shippings.find((s) => s.code === code);
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: wilaya.code,
          homePrice: wilaya.homePrice,
          officePrice: wilaya.officePrice,
        }),
      });
      if (res.ok) {
        setSavedCode(code);
        setTimeout(() => setSavedCode(null), 1500);
      }
    } catch (error) {
      alert("Erreur");
    } finally {
      setSavingCode(null);
    }
  };

  const filtered = shippings.filter(
    (s) =>
      s.wilaya.toLowerCase().includes(search.toLowerCase()) ||
      s.code.includes(search)
  );

  if (loading)
    return (
      <div className="p-8 text-gray-500 flex items-center gap-2">
        <Loader2 className="animate-spin" size={18} /> Chargement...
      </div>
    );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Tarifs de livraison
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Modifiez les prix et cliquez sur <strong>Enregistrer</strong> pour chaque wilaya
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher une wilaya..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 p-3 border rounded-lg bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="p-3 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Code</th>
                <th className="p-3 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Wilaya</th>
                <th className="p-3 md:p-4 font-medium text-gray-600 text-xs md:text-sm">🏠 À domicile (DA)</th>
                <th className="p-3 md:p-4 font-medium text-gray-600 text-xs md:text-sm">🏢 Au bureau (DA)</th>
                <th className="p-3 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => {
                const isSaving = savingCode === s.code;
                const isSaved = savedCode === s.code;
                return (
                  <tr key={s._id || s.code} className="border-b hover:bg-gray-50">
                    <td className="p-3 md:p-4 text-gray-500 text-sm font-mono">{s.code}</td>
                    <td className="p-3 md:p-4 font-medium text-gray-800 text-sm md:text-base">
                      {s.wilaya}
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={s.homePrice}
                          onChange={(e) => handleChange(s.code, "homePrice", e.target.value)}
                          className="w-20 md:w-28 p-2 border-2 border-gray-200 focus:border-[#2C3E2D] rounded-lg text-sm outline-none transition-colors"
                          min="0"
                        />
                        <span className="text-xs text-gray-500">DA</span>
                      </div>
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={s.officePrice}
                          onChange={(e) => handleChange(s.code, "officePrice", e.target.value)}
                          className="w-20 md:w-28 p-2 border-2 border-gray-200 focus:border-[#2C3E2D] rounded-lg text-sm outline-none transition-colors"
                          min="0"
                        />
                        <span className="text-xs text-gray-500">DA</span>
                      </div>
                    </td>
                    <td className="p-3 md:p-4">
                      <button
                        onClick={() => handleSaveOne(s.code)}
                        disabled={isSaving}
                        className={`flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                          isSaved
                            ? "bg-green-600 text-white"
                            : "bg-[#2C3E2D] text-white hover:bg-[#1a261b]"
                        } disabled:opacity-60`}
                      >
                        {isSaving ? (
                          <><Loader2 size={14} className="animate-spin" /> ...</>
                        ) : isSaved ? (
                          <><Check size={14} /> Enregistré</>
                        ) : (
                          <><Save size={14} /> Enregistrer</>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 md:p-4 text-xs md:text-sm text-blue-800">
        💡 <strong>Astuce :</strong> Modifiez le prix dans la case puis cliquez sur <strong>"Enregistrer"</strong> pour cette wilaya. Le changement sera immédiatement appliqué sur le site.
      </div>
    </div>
  );
}