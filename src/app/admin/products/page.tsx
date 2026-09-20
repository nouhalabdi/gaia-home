"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts(products.filter((p) => p._id !== id));
    } else {
      alert("Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Produits ({products.length})
        </h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-green-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-green-900 transition-colors text-sm md:text-base"
        >
          <Plus size={18} /> Ajouter un produit
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            Aucun produit pour le moment. Commencez par en ajouter un !
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-3 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Image</th>
                  <th className="p-3 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Nom</th>
                  <th className="p-3 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Prix</th>
                  <th className="p-3 md:p-4 font-medium text-gray-600 text-xs md:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3 md:p-4">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-200 rounded-lg flex items-center justify-center text-[10px] text-gray-400">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="p-3 md:p-4 font-medium text-gray-800 text-sm md:text-base">
                      {product.name}
                    </td>
                    <td className="p-3 md:p-4 text-gray-600 font-medium text-sm md:text-base">
                      {product.price} DA
                    </td>
                    <td className="p-3 md:p-4">
                      <div className="flex gap-1 md:gap-2">
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-1.5 md:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}