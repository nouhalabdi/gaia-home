"use client";
import { useEffect, useState } from "react";
import { Phone, MapPin, User, Clock, Home, Building2 } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchOrders();
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const statusColors: any = {
    pending: "bg-orange-100 text-orange-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">Commandes</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: "all", label: "Toutes" },
          { key: "pending", label: "En attente" },
          { key: "confirmed", label: "Confirmées" },
          { key: "shipped", label: "Expédiées" },
          { key: "delivered", label: "Livrées" },
          { key: "cancelled", label: "Annulées" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
              filter === f.key ? "bg-green-800 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white p-8 md:p-12 rounded-xl text-center text-gray-500 text-sm">
          Aucune commande dans cette catégorie.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order: any) => {
            const isOffice = order.deliveryType === "office";
            return (
              <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                  <div>
                    <span className="text-xs text-gray-500">
                      Commande #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <p className="text-[11px] md:text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Clock size={12} /> {new Date(order.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                  <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${statusColors[order.status]}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 pb-4 border-b">
                  <div className="flex items-start gap-2">
                    <User size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-gray-500">Client</p>
                      <p className="font-medium text-gray-800 text-sm">
                        {order.firstName && order.lastName ? `${order.firstName} ${order.lastName}` : order.customerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-gray-500">Téléphone</p>
                      <a href={`https://wa.me/213${order.phone?.replace(/^0/, "")}`} target="_blank" className="font-medium text-green-700 hover:underline text-sm">
                        {order.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    {isOffice ? <Building2 size={16} className="text-blue-500 mt-0.5 flex-shrink-0" /> : <Home size={16} className="text-green-600 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-[11px] text-gray-500">Type de livraison</p>
                      <p className={`font-bold text-sm ${isOffice ? "text-blue-700" : "text-green-700"}`}>
                        {isOffice ? "Au bureau" : "À domicile"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 md:col-span-2 lg:col-span-2">
                    <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-gray-500">Adresse</p>
                      <p className="font-medium text-gray-800 text-sm">
                        {order.wilaya && order.commune ? `${order.wilaya} - ${order.commune}` : order.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ✅ Items with Images */}
                <div className="mb-4">
                  <p className="text-[11px] text-gray-500 mb-3">Articles commandés</p>
                  <div className="space-y-2">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        {/* Product Image */}
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] text-gray-400 flex-shrink-0">
                            N/A
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-xs md:text-sm truncate">{item.name}</p>
                          <p className="text-[11px] text-gray-500">{item.price} DA × {item.quantity}</p>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-green-700 text-xs md:text-sm">{item.price * item.quantity} DA</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t mt-3 pt-3 space-y-1 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span className="font-medium">{order.subtotal || order.total} DA</span>
                    </div>
                    {order.shippingCost !== undefined && (
                      <div className="flex justify-between text-gray-600">
                        <span>Livraison ({isOffice ? "Au bureau" : "À domicile"})</span>
                        <span className="font-medium">{order.shippingCost} DA</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-green-800 text-base pt-2 border-t">
                      <span>Total à payer</span>
                      <span>{order.total} DA</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/213${order.phone?.replace(/^0/, "")}?text=Bonjour ${order.firstName || order.customerName}, votre commande est confirmée.`}
                    target="_blank"
                    className="px-3 md:px-4 py-2 bg-green-600 text-white rounded-lg text-xs md:text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Contacter via WhatsApp
                  </a>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="px-3 md:px-4 py-2 border rounded-lg text-xs md:text-sm bg-white font-medium"
                  >
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmée</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}