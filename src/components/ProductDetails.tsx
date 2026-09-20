"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { ShoppingCart, Check, Truck, ShieldCheck, Heart, Zap } from "lucide-react";
import Link from "next/link";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
  };
}

export default function ProductDetails({ product }: ProductProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
    });
    router.push("/panier?checkout=true");
  };

  return (
    <div className="min-h-screen py-6 md:py-12">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-4 md:mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#2C3E2D]">Accueil</Link>
          <span>/</span>
          <span className="text-[#2C3E2D] font-medium truncate">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="aspect-square bg-gray-50 flex items-center justify-center p-4 md:p-6">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl md:rounded-2xl" />
            ) : (
              <div className="text-gray-400 text-sm">Pas d'image</div>
            )}
          </div>

          {/* Details */}
          <div className="p-5 md:p-10 lg:p-12 flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 md:mb-4">
              {product.name}
            </h1>
            
            <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">{product.description}</p>
            
            <div className="text-2xl md:text-3xl font-bold text-[#2C3E2D] mb-4 md:mb-6">{product.price} DA</div>

            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-4 md:mb-6 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-2"><Heart size={14} className="text-[#2C3E2D]" /> Matières douces</div>
              <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#2C3E2D]" /> Haute qualité</div>
              <div className="flex items-center gap-2"><Truck size={14} className="text-[#2C3E2D]" /> Livraison rapide</div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <span className="font-medium text-gray-700 text-sm md:text-base">Quantité:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="px-3 md:px-4 py-2 hover:bg-gray-100 text-lg font-medium"
                >
                  −
                </button>
                <span className="px-4 md:px-6 py-2 font-bold min-w-[40px] md:min-w-[50px] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="px-3 md:px-4 py-2 hover:bg-gray-100 text-lg font-medium"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-3 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2 md:gap-3 transition-all mb-2 md:mb-3 text-sm md:text-base ${
                added ? "bg-green-600 text-white" : "bg-[#2C3E2D] text-white hover:bg-[#1a261b]"
              }`}
            >
              {added ? <><Check size={18} /> Ajouté au panier !</> : <><ShoppingCart size={18} /> Ajouter au panier</>}
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-3 md:py-4 rounded-xl font-bold flex items-center justify-center gap-2 md:gap-3 bg-[#D4A853] text-white hover:bg-[#b8903f] transition-all text-sm md:text-base"
            >
              <Zap size={18} /> Confirmer la commande maintenant
            </button>

            <div className="mt-3 md:mt-4 text-xs md:text-sm text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> En stock
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}