"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud, X } from "lucide-react";
import Link from "next/link";
import { CldUploadWidget } from "next-cloudinary";

export default function NewProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Veuillez télécharger une image.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          image: imageUrl,
        }),
      });
      if (res.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("Erreur lors de l'ajout");
      }
    } catch (error) {
      alert("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 hover:bg-gray-200 rounded-full">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Ajouter un produit</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-6">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result: any) => setImageUrl(result.info.secure_url)}
            options={{ maxFiles: 1, resourceType: "image" }}
          >
            {({ open }) => (
              <div
                onClick={() => open()}
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 relative overflow-hidden cursor-pointer"
              >
                {imageUrl ? (
                  <>
                    <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageUrl("");
                      }}
                      className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 cursor-pointer"
                    >
                      <X size={16} />
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500">Cliquez pour télécharger une image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (MAX. 5MB)</p>
                  </>
                )}
              </div>
            )}
          </CldUploadWidget>
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="Ex: Drap de lit 2 places"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="Décrivez le produit..."
          />
        </div>

        {/* Prix */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prix (DA)</label>
          <input
            type="number"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="2500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-800 text-white py-4 rounded-lg font-bold hover:bg-green-900 transition-colors disabled:opacity-50"
        >
          {loading ? "Ajout en cours..." : "Ajouter le produit"}
        </button>
      </form>
    </div>
  );
}