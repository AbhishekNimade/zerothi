"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLikes } from "@/context/LikesContext";
import ProductCard from "@/components/ProductCard";
import { Search, Heart, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  const searchParams = useSearchParams();
  const { likedIds } = useLikes();

  const [displayProducts, setDisplayProducts] = useState<Product[]>(products);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("POPULARITY");
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  // Sync edits from Google Sheets or localStorage fallback
  useEffect(() => {
    async function loadDynamicProducts() {
      try {
        let merged: Product[] = [];
        let sheetProducts = null;

        if (isSheetsConfigured()) {
          sheetProducts = await fetchProductsFromSheet();
        }

        if (sheetProducts && sheetProducts.length > 0) {
          merged = sheetProducts.map((sp: any) => {
            const matched = products.find(p => p.slug === sp.slug || p.id === sp.id.toString());
            return {
              id: sp.id?.toString() || matched?.id || sp.slug,
              name: sp.name || matched?.name || "",
              slug: sp.slug,
              description: matched?.description || "Premium regional purity from Nimar.",
              price: sp.category === "BANANA_CHIPS" ? 10 : Number(sp.price),
              originalPrice: sp.category === "BANANA_CHIPS" ? 12 : (Number(sp.originalPrice) || Math.round(Number(sp.price) * 1.2)),
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
 
          // Sync to localStorage
          localStorage.setItem("zerothi_products", JSON.stringify(merged));
        } else {
          // Fall back to localStorage
          const localProductsStr = localStorage.getItem("zerothi_products");
          if (localProductsStr) {
            const localProducts = JSON.parse(localProductsStr);
            merged = localProducts.map((lp: any) => {
              const matched = products.find(p => p.slug === lp.slug);
              return {
                id: lp.id || matched?.id || lp.slug,
                name: lp.name || matched?.name || "",
                slug: lp.slug,
                description: matched?.description || lp.description || "Premium regional purity from Nimar.",
                price: lp.category === "BANANA_CHIPS" ? 10 : Number(lp.price),
                originalPrice: lp.category === "BANANA_CHIPS" ? 12 : (Number(lp.originalPrice) || matched?.originalPrice || Math.round(lp.price * 1.2)),
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
            merged = products;
          }
        }

        // Append any build-time products missing from list
        products.forEach(p => {
          if (!merged.some((m: any) => m.slug === p.slug)) {
            // Apply build-time fallback status logic
            merged.push({
              ...p,
              status: p.status || "ACTIVE"
            });
          }
        });

        // Filter: Keep only ACTIVE products
        const activeProducts = merged.filter((p: any) => 
          p.status !== "INACTIVE" && 
          p.slug !== "pure-cow-ghee" // Explicit hardcode bypass for Ghee which was disabled by Admin
        );
        setDisplayProducts(activeProducts);
      } catch (e) {
        console.error("Failed to parse custom dynamic products:", e);
        setDisplayProducts(products);
      }
    }

    loadDynamicProducts();
  }, [products]);

  // If searchParam contains ?filter=liked, pre-select liked items
  useEffect(() => {
    if (searchParams.get("filter") === "liked") {
      setShowLikedOnly(true);
    } else {
      setShowLikedOnly(false);
    }
  }, [searchParams]);

  // Extract unique categories
  const categories = ["ALL", "BANANA_CHIPS", "COW_GHEE", "OIL"];

  const formatCategoryName = (cat: string) => {
    if (cat === "ALL") return "All Products";
    if (cat === "BANANA_CHIPS") return "Banana Chips";
    if (cat === "COW_GHEE") return "Pure Ghee";
    if (cat === "OIL") return "Wood-Pressed Oil";
    return cat;
  };

  // Filter products
  const filteredProducts = displayProducts.filter((product) => {
    // Hide inactive products
    const activeMatch = product.status !== "INACTIVE";

    // Category match
    const categoryMatch = activeCategory === "ALL" || product.category === activeCategory;
    
    // Search match
    const searchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Liked match
    const likedMatch = !showLikedOnly || likedIds.includes(product.id);

    return activeMatch && categoryMatch && searchMatch && likedMatch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "PRICE_ASC") return a.price - b.price;
    if (sortBy === "PRICE_DESC") return b.price - a.price;
    if (sortBy === "NAME_ASC") return a.name.localeCompare(b.name);
    return b.rating - a.rating; // Popularity default
  });

  return (
    <div className="space-y-12">
      {/* Search, Sort and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center p-4 bg-white/5 border border-white/5 rounded-2xl backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search items by name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/20 text-sm focus:outline-none"
          />
        </div>

        {/* Sort & Liked Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          {/* Liked Toggle */}
          <button 
            onClick={() => setShowLikedOnly(!showLikedOnly)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all focus:outline-none cursor-pointer ${
              showLikedOnly 
                ? "bg-red-500/10 border-red-500/40 text-red-400" 
                : "bg-black/40 border-white/10 hover:border-white/20 text-white/80"
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${showLikedOnly ? "fill-red-500 text-red-500" : ""}`} />
            Favorites ({likedIds.length})
          </button>

          {/* Sort dropdown */}
          <div className="relative flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-semibold uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-white/40" />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-white focus:outline-none pr-4 cursor-pointer"
            >
              <option value="POPULARITY">Popularity</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="NAME_ASC">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-2 md:justify-center border-b border-white/5 pb-6 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              // reset liked filter if we switch categories and no items are liked to prevent empty page confusion
              if (showLikedOnly && likedIds.length === 0) {
                setShowLikedOnly(false);
              }
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex-shrink-0 ${
              activeCategory === cat 
                ? "bg-gold-500 text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
                : "bg-white/5 border border-white/5 text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            {formatCategoryName(cat)}
          </button>
        ))}
      </div>

      {/* Products Grid list */}
      <AnimatePresence mode="wait">
        {sortedProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20 text-white/40 text-sm font-light"
          >
            No products found matching your active filter.
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8"
          >
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
