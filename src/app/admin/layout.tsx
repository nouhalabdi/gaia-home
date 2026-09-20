"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Home, Truck } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
  { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { name: "Produits", href: "/admin/products", icon: Package },
  { name: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { name: "Tarifs livraison", href: "/admin/shipping", icon: Truck },
];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-green-800 tracking-widest">GAÏA HOME</h1>
          <p className="text-xs text-gray-500 mt-1">Espace Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-green-800 text-white" : "text-gray-600 hover:bg-green-50"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Home size={20} />
            <span className="font-medium">Voir le site</span>
          </Link>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })} 
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-green-800 tracking-widest">GAÏA HOME</h1>
          <span className="text-xs text-gray-500">Admin</span>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-50">
          {menuItems.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${
                  isActive ? "text-green-800" : "text-gray-500"
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.name.split(" ")[0]}</span>
              </Link>
            );
          })}
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })} 
            className="flex flex-col items-center gap-1 px-3 py-1 text-red-500"
          >
            <LogOut size={20} />
            <span className="text-[10px] font-medium">Sortir</span>
          </button>
        </div>
      </div>
    </div>
  );
}