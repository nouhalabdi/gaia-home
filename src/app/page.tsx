import Link from "next/link";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { ArrowRight, Truck, ShieldCheck, Heart, MessageCircle, ShoppingCart } from "lucide-react";
export const dynamic = 'force-dynamic';

export default async function Home() {
  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION - Full Screen ===== */}
      <section className="relative w-full bg-[#EFEAE1] overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-2 min-h-[calc(100vh-73px)]">
          {/* Left: Text */}
          <div className="flex flex-col justify-center pl-16 xl:pl-24 pr-12 py-16">
            <span className="inline-block bg-white/70 backdrop-blur text-[#2C3E2D] px-4 py-2 rounded-full text-xs font-medium w-fit mb-6">
              Confort & Douceur pour votre maison
            </span>
            <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-[#2C3E2D] leading-[1.15] mb-6">
              Un sommeil paisible <br />
              au service de votre <br />
              confort
            </h1>
            <p className="text-base xl:text-lg text-gray-600 max-w-md mb-8 leading-relaxed">
              Des draps doux, des couettes chaleureuses et des taies d'oreiller élégantes pour une chambre accueillante, nuit après nuit.
            </p>
            <Link 
              href="#produits" 
              className="inline-flex items-center gap-2 bg-[#2C3E2D] text-white px-8 py-4 rounded-full hover:bg-[#1a261b] transition-colors font-medium w-fit"
            >
              Découvrir nos produits <ArrowRight size={18} />
            </Link>

            {/* Features */}
            <div className="flex gap-8 pt-10 mt-10 border-t border-[#2C3E2D]/10">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Heart size={18} className="text-[#2C3E2D]" />
                <span>Matières naturelles</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Truck size={18} className="text-[#2C3E2D]" />
                <span>Livraison rapide</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <ShieldCheck size={18} className="text-[#2C3E2D]" />
                <span>Paiement à la livraison</span>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative h-full">
            <img
              src="https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=1400&auto=format&fit=crop"
              alt="Chambre confortable avec linge de maison"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col">
          {/* Image on Top */}
          <div className="relative w-full h-[300px] sm:h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1616627561950-9f746e330187?q=80&w=1200&auto=format&fit=crop"
              alt="Chambre confortable"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text Below */}
          <div className="px-5 sm:px-8 py-10 sm:py-12">
            <span className="inline-block bg-white/70 backdrop-blur text-[#2C3E2D] px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium mb-4">
              Confort & Douceur
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2C3E2D] leading-tight mb-4">
              Un sommeil paisible au service de votre confort
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
              Des draps doux, des couettes chaleureuses et des taies d'oreiller élégantes pour une chambre accueillante.
            </p>
            <Link 
              href="#produits" 
              className="inline-flex items-center gap-2 bg-[#2C3E2D] text-white px-6 py-3 rounded-full hover:bg-[#1a261b] transition-colors font-medium text-sm"
            >
              Découvrir nos produits <ArrowRight size={16} />
            </Link>

            {/* Features */}
            <div className="flex flex-wrap gap-4 pt-8 mt-8 border-t border-[#2C3E2D]/10">
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <Heart size={14} className="text-[#2C3E2D]" />
                <span>Matières naturelles</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <Truck size={14} className="text-[#2C3E2D]" />
                <span>Livraison rapide</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <ShieldCheck size={14} className="text-[#2C3E2D]" />
                <span>Paiement à la livraison</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS SECTION ===== */}
      <section id="produits" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="mb-8 md:mb-12">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] text-gray-500 mb-2 md:mb-3">NOS PRODUITS</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2C3E2D] mb-2 md:mb-3">
            Découvrez notre collection
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            Des articles adaptés à chaque chambre, pour un confort naturel et durable.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 md:py-20 text-gray-500 bg-white rounded-2xl text-sm">
            Aucun produit disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product: any) => (
              <Link 
                href={`/product/${product._id}`} 
                key={product._id.toString()} 
                className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-xs">Pas d'image</div>
                  )}
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base truncate">{product.name}</h3>
                  <p className="text-[11px] md:text-xs text-gray-500 line-clamp-2 mb-2 md:mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#2C3E2D] text-sm md:text-base">{product.price} DA</span>
                    <span className="p-1.5 md:p-2 bg-[#E8F0E8] text-[#2C3E2D] rounded-full group-hover:bg-[#2C3E2D] group-hover:text-white transition-colors">
                      <ShoppingCart size={14} className="md:hidden" />
                      <ShoppingCart size={16} className="hidden md:block" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== CONTACT BANNER ===== */}
      <section className="bg-[#2C3E2D] py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center px-4 sm:px-6">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] text-gray-400 mb-2 md:mb-3">UNE QUESTION ?</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
            Nous sommes là pour vous !
          </h2>
          <p className="text-sm md:text-base text-gray-300 mb-6 md:mb-8">
            Pour toute demande ou commande, n'hésitez pas à nous contacter.
          </p>
          <a 
            href="https://wa.me/213 770 26 02 03" 
            target="_blank" 
            className="inline-flex items-center gap-2 bg-white text-[#2C3E2D] px-6 md:px-8 py-3 md:py-4 rounded-full font-bold hover:bg-gray-100 transition-colors text-sm md:text-base"
          >
            <MessageCircle size={18} /> Contacter sur WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
