"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useLikes } from "@/context/LikesContext";
import { Heart, ShoppingBag, Plus, Minus, ArrowLeft, Star, Leaf, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
}

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLikes();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "ingredients" | "nutritional">("desc");

  const [localProduct, setLocalProduct] = useState(product);

  useEffect(() => {
    async function loadDynamicProduct() {
      try {
        let matched = null;

        if (isSheetsConfigured()) {
          const sheetProducts = await fetchProductsFromSheet();
          if (sheetProducts) {
            matched = sheetProducts.find((sp: any) => sp.slug === product.slug || sp.id.toString() === product.id);
          }
        }

        if (!matched) {
          const localProductsStr = localStorage.getItem("zerothi_products");
          if (localProductsStr) {
            const localProducts = JSON.parse(localProductsStr);
            matched = localProducts.find((lp: any) => lp.slug === product.slug);
          }
        }

        if (matched) {
          setLocalProduct(prev => ({
            ...prev,
            price: Number(matched.price),
            stock: Number(matched.stock),
            image: matched.image || prev.image
          }));
        }
      } catch (e) {
        console.error("Failed to parse local products override", e);
      }
    }
    loadDynamicProduct();
  }, [product]);

  const liked = isLiked(localProduct.id);
  const isOutOfStock = localProduct.stock <= 0;

  const isChips = localProduct.category === "BANANA_CHIPS";
  const isGhee = localProduct.category === "COW_GHEE";
  const isOil = localProduct.category === "OIL";
  const hasSizes = isChips || isGhee || isOil;

  const sizeOptions = isChips 
    ? [
        { label: "30g", multiplier: 0.125, fixedPrice: 10, fixedOriginalPrice: 15 },
        { label: "100g", multiplier: 0.55 },
        { label: "200g", multiplier: 1.0 }
      ]
    : isGhee
    ? [
        { label: "500ml", multiplier: 1.0 }
      ]
    : isOil
    ? [
        { label: "1L", multiplier: 1.0 }
      ]
    : [];

  const [selectedSize, setSelectedSize] = useState(() => {
    if (isChips) return "200g";
    if (isGhee) return "500ml";
    if (isOil) return "1L";
    return "";
  });

  // Reset size selector when switching products
  useEffect(() => {
    if (isChips) setSelectedSize("200g");
    else if (isGhee) setSelectedSize("500ml");
    else if (isOil) setSelectedSize("1L");
    else setSelectedSize("");
  }, [localProduct.id, isChips, isGhee, isOil]);

  const selectedOption = hasSizes
    ? sizeOptions.find(o => o.label === selectedSize)
    : null;

  const currentMultiplier = selectedOption?.multiplier || 1.0;

  const currentPrice = selectedOption?.fixedPrice !== undefined
    ? selectedOption.fixedPrice
    : Math.round(localProduct.price * currentMultiplier);

  const currentOriginalPrice = selectedOption?.fixedOriginalPrice !== undefined
    ? selectedOption.fixedOriginalPrice
    : Math.round(localProduct.originalPrice * currentMultiplier);

  // Calculate discount percentage
  const discount = currentOriginalPrice > currentPrice 
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  const handleIncrement = () => {
    if (quantity < localProduct.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (hasSizes) {
      const customProduct = {
        ...localProduct,
        id: `${localProduct.id}-${selectedSize}`,
        name: `${localProduct.name} (${selectedSize})`,
        price: currentPrice,
        originalPrice: currentOriginalPrice
      };
      addToCart(customProduct, quantity);
    } else {
      addToCart(localProduct, quantity);
    }
  };

  // Mocked details based on regional categories
  const mockIngredients = product.category === "BANANA_CHIPS"
    ? "Fresh Nimar Raw Bananas, Pure Refined Cooking Oil, Salt, Traditional Spices & Masalas (No Artificial Preservatives)."
    : product.category === "COW_GHEE"
    ? "Pure A2 Cow Milk Fat (Clarified Butter obtained from traditional wood-churned curd method)."
    : "100% Raw Wood-Pressed Seeds (Groundnut / Coconut / Mustard) sourced directly from Nimar farmers.";

  const mockNutritional = product.category === "BANANA_CHIPS"
    ? { energy: "520 kcal", protein: "4.2g", fat: "28g", carbs: "61g", sodium: "280mg" }
    : product.category === "COW_GHEE"
    ? { energy: "897 kcal", protein: "0g", fat: "99.5g", carbs: "0g", sodium: "0mg" }
    : { energy: "884 kcal", protein: "0g", fat: "99.9g", carbs: "0g", sodium: "0mg" };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 selection:bg-gold-500/30 selection:text-gold-300">
      {/* Back Button */}
      <Link href="/products" className="inline-flex items-center gap-2 text-white/50 hover:text-gold-400 transition-colors text-xs font-semibold uppercase tracking-wider mb-10">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Gallery Image Display */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-neutral-950 rounded-2xl overflow-hidden relative border border-white/10 group">
            {discount > 0 && (
              <div className="absolute top-6 left-6 z-10 bg-gold-500 text-black text-xs font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider">
                {discount}% OFF
              </div>
            )}
            
            <Image 
              src={product.image} 
              alt={product.name} 
              fill
              className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-105"
              priority
            />
          </div>
          
          {product.hoverImage && (
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-xl overflow-hidden relative border border-white/5 bg-neutral-950">
                <Image src={product.image} alt={product.name} fill className="object-contain p-4" />
              </div>
              <div className="aspect-square rounded-xl overflow-hidden relative border border-white/5 bg-neutral-950">
                <Image src={product.hoverImage} alt={`${product.name} alt`} fill className="object-contain p-4" />
              </div>
            </div>
          )}
        </div>

        {/* Product Meta Details */}
        <div className="space-y-8">
          <div>
            {product.bannerLine && (
              <span className="text-gold-500 font-bold text-xs uppercase tracking-[0.25em] block mb-2">
                {product.bannerLine}
              </span>
            )}
            <h1 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {product.name}
            </h1>
            
            {/* Reviews summary */}
            <div className="flex items-center gap-4 text-xs mt-2 text-white/50">
              <div className="flex items-center text-gold-400">
                {"★".repeat(Math.round(product.rating))}
                {"☆".repeat(5 - Math.round(product.rating))}
              </div>
              <span>({product.rating} Rating)</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">100% Organic & Fresh</span>
            </div>
          </div>

          {/* Price details */}
          <div className="p-6 bg-white/5 rounded-xl border border-white/5 space-y-2">
            <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider block">Price</span>
            <div className="flex items-baseline gap-4">
              <span className="text-gold-400 text-3xl font-extrabold">₹{currentPrice}</span>
              {currentOriginalPrice > currentPrice && (
                <span className="text-white/30 text-sm line-through">₹{currentOriginalPrice}</span>
              )}
            </div>
            <p className="text-[10px] text-white/40 font-light mt-1">Inclusive of all local regional taxes.</p>
          </div>

          {/* Size / Weight Selection */}
          {hasSizes && (
            <div className="space-y-3">
              <span className="text-white/70 text-xs uppercase tracking-wider block font-semibold">
                Select Size / Weight
              </span>
              <div className="flex flex-wrap gap-3">
                {sizeOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedSize(opt.label)}
                    className={`px-5 py-2.5 text-xs font-semibold rounded-lg border transition-all duration-300 cursor-pointer ${
                      selectedSize === opt.label
                        ? "bg-gold-500 border-gold-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                        : "border-white/10 hover:border-white/20 text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Controls */}
          {isOutOfStock ? (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              This product is currently out of stock. We are sourcing fresh batches!
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              {/* Quantity clickers */}
              <div className="flex items-center justify-between border border-white/10 bg-black/60 rounded-lg overflow-hidden py-3 px-5 sm:w-36">
                <button 
                  onClick={handleDecrement}
                  className="text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-white font-bold text-sm w-8 text-center">{quantity}</span>
                <button 
                  onClick={handleIncrement}
                  className="text-white/50 hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <button 
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 rounded-lg cursor-pointer shadow-[0_0_30px_rgba(212,175,55,0.25)]"
              >
                <ShoppingBag className="w-4 h-4" /> Add To Cart
              </button>

              <button 
                onClick={() => toggleLike(product.id)}
                className={`p-4 border rounded-lg flex items-center justify-center transition-colors cursor-pointer focus:outline-none ${
                  liked 
                    ? "bg-red-500/10 border-red-500/30 text-red-500" 
                    : "border-white/10 hover:border-white/20 text-white/60 hover:text-white"
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
              </button>
            </div>
          )}

          {/* Details Tabs */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
            <div className="flex border-b border-white/10 text-xs font-bold uppercase tracking-wider bg-[#070707]">
              <button 
                onClick={() => setActiveTab("desc")}
                className={`flex-1 py-4 text-center cursor-pointer transition-colors ${activeTab === "desc" ? "text-gold-400 border-b-2 border-gold-500 bg-white/5" : "text-white/40 hover:text-white"}`}
              >
                Product Details
              </button>
              <button 
                onClick={() => setActiveTab("ingredients")}
                className={`flex-1 py-4 text-center cursor-pointer transition-colors ${activeTab === "ingredients" ? "text-gold-400 border-b-2 border-gold-500 bg-white/5" : "text-white/40 hover:text-white"}`}
              >
                Ingredients
              </button>
              <button 
                onClick={() => setActiveTab("nutritional")}
                className={`flex-1 py-4 text-center cursor-pointer transition-colors ${activeTab === "nutritional" ? "text-gold-400 border-b-2 border-gold-500 bg-white/5" : "text-white/40 hover:text-white"}`}
              >
                Nutrition Facts
              </button>
            </div>

            <div className="p-6 text-xs text-white/70 leading-relaxed font-light">
              {activeTab === "desc" && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <ul className="space-y-2 pt-2 text-[11px] text-white/50">
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold-500" /> Sourced directly from local Nimar farmers</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold-500" /> Made by local women self-help collectives</li>
                    <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-gold-500" /> Packed with nitrogen for ultimate freshness</li>
                  </ul>
                </div>
              )}
              {activeTab === "ingredients" && <p>{mockIngredients}</p>}
              {activeTab === "nutritional" && (
                <div className="grid grid-cols-2 gap-4 max-w-sm">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Energy Value</span>
                    <span className="text-white font-bold">{mockNutritional.energy}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Proteins</span>
                    <span className="text-white font-bold">{mockNutritional.protein}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Total Fat</span>
                    <span className="text-white font-bold">{mockNutritional.fat}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Carbohydrates</span>
                    <span className="text-white font-bold">{mockNutritional.carbs}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/40">Sodium</span>
                    <span className="text-white font-bold">{mockNutritional.sodium}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="mt-28 pt-16 border-t border-white/5">
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-10">
            You May Also <span className="text-gradient-gold">Like</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
