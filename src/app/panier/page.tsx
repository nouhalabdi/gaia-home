"use client";
import { useState, useEffect, Suspense } from "react";
import { useCartStore } from "@/lib/store";
import { useSearchParams } from "next/navigation";
import { Trash2, ArrowLeft, CheckCircle, ShoppingCart, Home, Building2 } from "lucide-react";
import Link from "next/link";

function CartContent() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [shippings, setShippings] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    wilayaCode: "",
    commune: "",
    deliveryType: "home",
  });

  const subtotal = getTotal();
  const selectedWilaya = shippings.find((s) => s.code === formData.wilayaCode);
  const shippingCost = selectedWilaya
    ? formData.deliveryType === "home"
      ? Number(selectedWilaya.homePrice)
      : Number(selectedWilaya.officePrice)
    : 0;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (searchParams.get("checkout") === "true") setShowForm(true);
    fetch("/api/shipping")
      .then((res) => res.json())
      .then((data) => setShippings(data));
  }, [searchParams]);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.wilayaCode) {
      alert("Veuillez choisir une wilaya.");
      return;
    }
    setLoading(true);
    try {
      const wilayaName = selectedWilaya?.wilaya || "";
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          wilaya: wilayaName,
          wilayaCode: formData.wilayaCode,
          commune: formData.commune,
          deliveryType: formData.deliveryType,
          shippingCost,
          subtotal,
          total,
          address: `${wilayaName} - ${formData.commune} (${formData.deliveryType === "home" ? "À domicile" : "Au bureau"})`,
          items,
        }),
      });
      if (res.ok) {
        setSuccess(true);
        clearCart();
      }
    } catch (error) {
      alert("Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-10 rounded-2xl md:rounded-3xl shadow-sm text-center max-w-md w-full border">
          <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-600 mx-auto mb-4 md:mb-6" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Commande confirmée !</h1>
          <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
            Merci pour votre confiance. Nous vous contacterons bientôt.
          </p>
          <Link href="/" className="block w-full bg-[#2C3E2D] text-white py-3 rounded-xl font-bold hover:bg-[#1a261b]">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 md:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2C3E2D] mb-4 md:mb-8 text-sm">
          <ArrowLeft size={18} /> Continuer mes achats
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Mon Panier</h1>

        {items.length === 0 ? (
          <div className="bg-white p-10 md:p-16 rounded-2xl text-center border">
            <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6 text-sm md:text-base">Votre panier est vide.</p>
            <Link href="/" className="inline-block bg-[#2C3E2D] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1a261b] text-sm">
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              {items.map((item) => (
                <div key={item._id} className="bg-white p-3 md:p-4 rounded-2xl shadow-sm border flex gap-3 md:gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-sm md:text-base truncate">{item.name}</h3>
                    <p className="text-[#2C3E2D] font-bold text-sm md:text-base">{item.price} DA</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} className="px-2 md:px-3 py-1 hover:bg-gray-100 text-sm">−</button>
                        <span className="px-2 md:px-3 font-medium text-sm min-w-[30px] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="px-2 md:px-3 py-1 hover:bg-gray-100 text-sm">+</button>
                      </div>
                      <button onClick={() => removeItem(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border h-fit lg:sticky lg:top-24">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Récapitulatif</h2>

              {!showForm ? (
                <>
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total:</span>
                      <span className="font-medium">{subtotal} DA</span>
                    </div>
                  </div>
                  <button onClick={() => setShowForm(true)} className="w-full bg-[#2C3E2D] text-white py-3 rounded-xl font-bold hover:bg-[#1a261b] text-sm md:text-base">
                    Confirmer la commande
                  </button>
                </>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-3">
                  <input type="text" required placeholder="Prénom" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full p-2.5 md:p-3 border rounded-lg text-sm" />
                  <input type="text" required placeholder="Nom" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full p-2.5 md:p-3 border rounded-lg text-sm" />
                  <input type="tel" required placeholder="Téléphone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-2.5 md:p-3 border rounded-lg text-sm" />

                  {/* Wilaya Dropdown */}
                  <select
                    required
                    value={formData.wilayaCode}
                    onChange={(e) => setFormData({...formData, wilayaCode: e.target.value})}
                    className="w-full p-2.5 md:p-3 border rounded-lg text-sm bg-white"
                  >
                    <option value="">Choisir une wilaya...</option>
                    {shippings.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.code} - {s.wilaya}
                      </option>
                    ))}
                  </select>

                  <input type="text" required placeholder="Commune" value={formData.commune} onChange={(e) => setFormData({...formData, commune: e.target.value})} className="w-full p-2.5 md:p-3 border rounded-lg text-sm" />

                  {/* Delivery Type */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs md:text-sm font-medium text-gray-700">Type de livraison</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, deliveryType: "home"})}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                          formData.deliveryType === "home"
                            ? "border-[#2C3E2D] bg-[#2C3E2D]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Home size={18} className={formData.deliveryType === "home" ? "text-[#2C3E2D]" : "text-gray-400"} />
                        <span className="text-xs font-medium">À domicile</span>
                        {selectedWilaya && (
                          <span className="text-[10px] text-gray-500">
                            {selectedWilaya.homePrice} DA
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, deliveryType: "office"})}
                        className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-colors ${
                          formData.deliveryType === "office"
                            ? "border-[#2C3E2D] bg-[#2C3E2D]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Building2 size={18} className={formData.deliveryType === "office" ? "text-[#2C3E2D]" : "text-gray-400"} />
                        <span className="text-xs font-medium">Au bureau</span>
                        {selectedWilaya && (
                          <span className="text-[10px] text-gray-500">
                            {selectedWilaya.officePrice} DA
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2 text-sm mt-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total:</span>
                      <span className="font-medium">{subtotal} DA</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Livraison:</span>
                      <span className="font-medium">{shippingCost} DA</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#2C3E2D] text-base border-t pt-2">
                      <span>Total:</span>
                      <span>{total} DA</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !formData.wilayaCode}
                    className="w-full bg-[#2C3E2D] text-white py-3 rounded-xl font-bold hover:bg-[#1a261b] disabled:opacity-50 text-sm md:text-base"
                  >
                    {loading ? "Envoi..." : "Confirmer la commande"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Chargement...</div>}>
      <CartContent />
    </Suspense>
  );
}