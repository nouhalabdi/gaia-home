import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
          
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/logo.jpg" 
              alt="GAÏA HOME" 
              className="h-10 md:h-12 w-auto object-contain" 
            />
          </div>

          {/* Copyright & Dev Credit */}
          <div className="text-center order-3 md:order-2">
            <p className="text-xs text-gray-400">© 2026 GAÏA HOME. Tous droits réservés.</p>
            <p className="text-xs text-gray-400 mt-1">
              Développé par{" "}
              <a 
                href="https://www.facebook.com/profile.php?id=61590728369782" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#2C3E2D] hover:underline font-medium"
              >
                NL Dev
              </a>
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4 order-2 md:order-3">
            {/* Instagram */}
            <a href="https://www.instagram.com/gaia.homealgerie?stkn=bnpoMzdoa25xa2Fh" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-[#2C3E2D] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="https://www.facebook.com/share/1DT1v7Sov3/" target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-[#2C3E2D] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            
          </div>

        </div>
      </div>
    </footer>
  );
}