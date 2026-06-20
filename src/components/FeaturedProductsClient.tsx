"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { isSheetsConfigured, fetchProductsFromSheet } from "@/lib/sheets";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  hoverImage: string | null;
  stock: number;
  rating: number;
  bannerLine: string | null;
  status?: string;
  sku?: string;
}

export default function FeaturedProductsClient({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        let merged: Product[] = [];
        let sheetProducts = null;

        if (isSheetsConfigured()) {
          sheetProducts = await fetchProductsFromSheet();
        }

        if (sheetProducts && sheetProducts.length > 0) {
          merged = sheetProducts.map((sp: any) => {
            const matched = initialProducts.find(p => p.slug === sp.slug || p.id === sp.id.toString());
            return {
              id: sp.id?.toString() || matched?.id || sp.slug,
              name: sp.name || matched?.name || "",
              slug: sp.slug,
              description: matched?.description || "Premium regional purity from Nimar.",
              price: Number(sp.price),
              originalPrice: Number(sp.originalPrice) || Math.round(Number(sp.price) * 1.2),
              category: sp.category || matched?.category || "BANANA_CHIPS",
              image: sp.image || matched?.image || "/placeholder.png",
              hoverImage: matched?.hoverImage || null,
              stock: Number(sp.stock),
              rating: Number(sp.rating) || matched?.rating || 4.8,
              bannerLine: matched?.bannerLine || null,
              status: sp.status || "ACTIVE",
              sku: sp.sku || ""
            };
          });
        } else {
          const localProductsStr = localStorage.getItem("zerothi_products");
          if (localProductsStr) {
            const localProducts = JSON.parse(localProductsStr);
            merged = localProducts.map((lp: any) => {
              const matched = initialProducts.find(p => p.slug === lp.slug);
              return {
                id: lp.id || matched?.id || lp.slug,
                name: lp.name || matched?.name || "",
                slug: lp.slug,
                description: matched?.description || lp.description || "Premium regional purity from Nimar.",
                price: Number(lp.price),
                originalPrice: Number(lp.originalPrice) || matched?.originalPrice || Math.round(lp.price * 1.2),
                category: lp.category || matched?.category || "BANANA_CHIPS",
                image: lp.image || matched?.image || "/placeholder.png",
                hoverImage: matched?.hoverImage || null,
                stock: Number(lp.stock),
                rating: Number(lp.rating) || matched?.rating || 4.8,
                bannerLine: matched?.bannerLine || lp.bannerLine || null,
                status: lp.status || "ACTIVE",
                sku: lp.sku || ""
              };
            });
          } else {
            merged = initialProducts;
          }
        }

        // Filter: Keep only ACTIVE products
        const activeProducts = merged.filter((p: any) => p.status !== "INACTIVE");
        setProducts(activeProducts.slice(0, 4));
      } catch (e) {
        console.error("Failed to parse featured products dynamically:", e);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, [initialProducts]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-white/40 text-sm font-light">
        No products available at the moment.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
