import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    await connectDB();
    const product = await Product.findById(id).lean();
    
    if (!product) {
      notFound();
    }
    
    
    const serializedProduct = JSON.parse(JSON.stringify(product));
    
    return <ProductDetails product={serializedProduct} />;
  } catch (error) {
    notFound();
  }
}