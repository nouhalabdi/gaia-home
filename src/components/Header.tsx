"use client";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { User, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();

  const handleProduitsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      document.getElementById("produits")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/");
      setTimeout(() => {
        document.getElementById("produits")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo Image + Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/logo.jpg" 
            alt="GAÏA HOME" 
            className="h-10 sm:h-12 w-auto object-contain" 
          />
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold text-[#2C3E2D] tracking-widest leading-none">
              GAÏA HOME
            </h1>
            
          </div>
        </Link>
        
        {/* Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-[#2C3E2D] transition-colors">Accueil</Link>
          <button onClick={handleProduitsClick} className="hover:text-[#2C3E2D] transition-colors">
            Produits
          </button>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-0.5 sm:gap-2">
          <Link href="/login" className="p-2 text-gray-500 hover:text-[#2C3E2D] transition-colors">
            <User size={18} />
          </Link>
          <Link href="/panier" className="p-2 text-gray-500 hover:text-[#2C3E2D] transition-colors relative">
            <ShoppingCart size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#2C3E2D] text-white text-[9px] sm:text-[10px] w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-gray-100 flex justify-around py-2 text-xs font-medium text-gray-700">
        <Link href="/" className="hover:text-[#2C3E2D] py-1">Accueil</Link>
        <button onClick={handleProduitsClick} className="hover:text-[#2C3E2D] py-1">Produits</button>
      </div>
    </header>
  );
}