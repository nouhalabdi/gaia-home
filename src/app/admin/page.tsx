import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { Package, ShoppingCart, DollarSign, Clock, CheckCircle, Truck } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  await connectDB();
  
  const productCount = await Product.countDocuments();
  const pendingOrders = await Order.countDocuments({ status: "pending" });
  const confirmedOrders = await Order.countDocuments({ status: "confirmed" });
  const shippedOrders = await Order.countDocuments({ status: "shipped" });
  const deliveredOrders = await Order.countDocuments({ status: "delivered" });
  
  // ✅ Chiffre d'affaires : فقط الطلبات التي تم تسليمها (Livrées)
  const deliveredList = await Order.find({ status: "delivered" }).lean();
  const revenue = deliveredList.reduce(
    (sum: number, order: any) => sum + (order.total || 0),
    0
  );

  const stats = [
    { 
      title: "Total Produits", 
      value: productCount, 
      icon: Package, 
      color: "text-blue-600", 
      bg: "bg-blue-50",
      href: "/admin/products"
    },
    { 
      title: "En attente", 
      value: pendingOrders, 
      icon: Clock, 
      color: "text-orange-600", 
      bg: "bg-orange-50",
      href: "/admin/orders"
    },
    { 
      title: "Confirmées", 
      value: confirmedOrders, 
      icon: ShoppingCart, 
      color: "text-purple-600", 
      bg: "bg-purple-50",
      href: "/admin/orders"
    },
    { 
      title: "Chiffre d'affaires", 
      value: `${revenue.toLocaleString()} DA`, 
      icon: DollarSign, 
      color: "text-green-700", 
      bg: "bg-green-50",
      href: "/admin/orders"
    },
  ];

  // أحدث 5 طلبات
  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const statusLabels: any = {
    pending: { label: "En attente", color: "text-orange-600" },
    confirmed: { label: "Confirmée", color: "text-purple-600" },
    shipped: { label: "Expédiée", color: "text-blue-600" },
    delivered: { label: "Livrée", color: "text-green-600" },
    cancelled: { label: "Annulée", color: "text-red-600" },
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
        Tableau de bord
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
        {stats.map((stat) => (
          <Link 
            key={stat.title} 
            href={stat.href}
            className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <h3 className="text-gray-500 text-[11px] md:text-sm font-medium">{stat.title}</h3>
                <p className={`text-xl md:text-3xl font-bold mt-1 md:mt-2 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2 md:p-4 rounded-full ${stat.bg} w-fit`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Dernières commandes</h2>
          <Link href="/admin/orders" className="text-sm text-green-700 hover:underline font-medium">
            Voir tout →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500 text-center py-8 text-sm">Aucune commande pour le moment.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order: any) => {
              const statusInfo = statusLabels[order.status] || { label: order.status, color: "text-gray-600" };
              return (
                <div key={order._id.toString()} className="flex justify-between items-center p-3 md:p-4 bg-gray-50 rounded-lg text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800 truncate">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.phone}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-green-700">{order.total} DA</p>
                    <p className={`text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}