import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MetaPixelTracker from "@/components/MetaPixelTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GAÏA HOME - Linge de maison",
  description: "Des nuits douces et confortables pour toute la famille.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-[#F9F8F6] text-gray-800 min-h-screen flex flex-col`}>
        <MetaPixelTracker /> 
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
