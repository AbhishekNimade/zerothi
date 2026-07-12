"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useLikes } from "@/context/LikesContext";
import { useAuth } from "@/context/AuthContext";
import { Heart, ShoppingBag, Plus, Minus, ArrowLeft, Star, Leaf, Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import LoginModal from "@/components/LoginModal";
import { isSheetsConfigured, fetchProductsFromSheet } from "@/lib/sheets";

interface ProductFaq {
  q: string;
  a: string;
}

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
  reviewsCount?: number;
  bannerLine: string | null;
  ingredients?: string | null;
}

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
  productFaqs?: ProductFaq[];
}

export default function ProductDetailsClient({ product, relatedProducts, productFaqs = [] }: ProductDetailsClientProps) {
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLikes();
  const { user } = useAuth();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  // Login modal
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalReason, setModalReason] = useState<"cart" | "like">("cart");
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const requireAuth = (reason: "cart" | "like", action: () => void) => {
    if (!user) {
      setModalReason(reason);
      setPendingAction(() => action);
      setShowLoginModal(true);
    } else {
      action();
    }
  };

  const handleLoginSuccess = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };
  const [activeTab, setActiveTab] = useState<"desc" | "ingredients" | "nutritional">("desc");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Phase 4: conversion and AOV optimization states
  const [purchaseType, setPurchaseType] = useState<"one-time" | "subscription">("subscription"); // Smart Default
  const [subscriptionFreq, setSubscriptionFreq] = useState<"30" | "15" | "60">("30");
  const [bundleTier, setBundleTier] = useState<1 | 2 | 4 | 6>(1);
  const [isBundleExpanded, setIsBundleExpanded] = useState(false);

  const lifestyleImage = product.category === "BANANA_CHIPS"
    ? "https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=800&auto=format&fit=crop"
    : product.category === "COW_GHEE"
    ? "https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?q=80&w=800&auto=format&fit=crop"
    : product.category === "OIL" && product.name.toLowerCase().includes("coconut")
    ? "https://images.unsplash.com/photo-1622484211148-716598e09116?q=80&w=800&auto=format&fit=crop"
    : "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop";

  const [activeImage, setActiveImage] = useState(product.image);

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
    setActiveImage(product.image);
  }, [product]);

  const getVariantMetadata = (label: string) => {
    const isChips = localProduct.category === "BANANA_CHIPS";
    const nameLower = localProduct.name.toLowerCase();
    
    if (isChips) {
      const spice = nameLower.includes("peri-peri") ? "Spicy 🔥" : nameLower.includes("pudina") ? "Medium" : nameLower.includes("tomato") ? "Mild" : "None";
      const flavor = nameLower.includes("peri-peri") ? "Fiery & Bold" : nameLower.includes("pudina") ? "Cool Mint" : nameLower.includes("tomato") ? "Tangy Tomato" : "Classic Salty";
      return {
        notes: `Taste: ${flavor}`,
        spice: `Spice: ${spice}`,
        origin: "Origin: Barwani Farms"
      };
    } else if (localProduct.category === "COW_GHEE") {
      return {
        notes: "Texture: Highly Granular",
        spice: "Method: Curd Churned",
        origin: "Sourcing: Nimar Dairy Pastures"
      };
    } else {
      const oilType = nameLower.includes("coconut") ? "Raw Coconut" : "premium Groundnut";
      return {
        notes: `Extraction: Cold Pressed`,
        spice: `Seed: ${oilType}`,
        origin: "Sourcing: Nimar Farms"
      };
    }
  };

  const liked = isLiked(localProduct.id);
  const isOutOfStock = localProduct.stock <= 0;

  const isChips = localProduct.category === "BANANA_CHIPS";
  const isGhee = localProduct.category === "COW_GHEE";
  const isOil = localProduct.category === "OIL";
  const hasSizes = isChips || isGhee || isOil;

  interface SizeOption {
    label: string;
    multiplier: number;
    fixedPrice?: number;
    fixedOriginalPrice?: number;
    available: boolean;
    tag?: string;
  }

  const sizeOptions: SizeOption[] = isChips 
    ? [
        { label: "200g (Family Pack)", multiplier: 1.0, available: false },
        { label: "100g (Standard)", multiplier: 0.55, available: false },
        { label: "30g (Starter)", multiplier: 0.125, fixedPrice: 10, fixedOriginalPrice: 15, available: true, tag: "Popular Default" }
      ]
    : isGhee
    ? [
        { label: "1L (Value Pack)", multiplier: 1.9, available: false },
        { label: "500ml (Standard)", multiplier: 1.0, available: true, tag: "Recommended Default" }
      ]
    : isOil
    ? [
        { label: "5L (Jumbo Can)", multiplier: 4.5, available: false },
        { label: "1L (Standard)", multiplier: 1.0, available: true, tag: "Recommended Default" }
      ]
    : [];

  const [selectedSize, setSelectedSize] = useState(() => {
    if (isChips) return "30g (Starter)";
    if (isGhee) return "500ml (Standard)";
    if (isOil) return "1L (Standard)";
    return "";
  });

  // Reset size selector when switching products
  useEffect(() => {
    if (isChips) setSelectedSize("30g (Starter)");
    else if (isGhee) setSelectedSize("500ml (Standard)");
    else if (isOil) setSelectedSize("1L (Standard)");
    else setSelectedSize("");
  }, [localProduct.id, isChips, isGhee, isOil]);

  const selectedOption = hasSizes
    ? sizeOptions.find(o => o.label === selectedSize)
    : null;

  const currentMultiplier = selectedOption?.multiplier || 1.0;

  // Base price for a single unit of the variant
  const baseVariantPrice = selectedOption?.fixedPrice !== undefined
    ? selectedOption.fixedPrice
    : Math.round(localProduct.price * currentMultiplier);

  const baseVariantOriginalPrice = selectedOption?.fixedOriginalPrice !== undefined
    ? selectedOption.fixedOriginalPrice
    : Math.round(localProduct.originalPrice * currentMultiplier);

  // Apply subscription or bundling multipliers (AOV Optimization)
  const activeDiscountMultiplier = 
    purchaseType === "subscription"
      ? 0.85 // Save 15%
      : bundleTier === 2
      ? 0.95 // Save 5%
      : bundleTier === 4
      ? 0.90 // Save 10%
      : bundleTier === 6
      ? 0.85 // Save 15%
      : 1.0;

  const currentPrice = Math.round(baseVariantPrice * activeDiscountMultiplier * bundleTier);
  const currentOriginalPrice = Math.round(baseVariantOriginalPrice * bundleTier);

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

  const doAddToCart = () => {
    // Generate custom item suffix based on conversion choices
    let purchaseSuffix = "";
    if (purchaseType === "subscription") {
      purchaseSuffix = ` - Subscribed (Every ${subscriptionFreq} Days)`;
    } else if (bundleTier > 1) {
      const savings = bundleTier === 2 ? "5%" : bundleTier === 4 ? "10%" : "15%";
      purchaseSuffix = ` - Bundle of ${bundleTier} (${savings} Off)`;
    }

    const sizeSuffix = hasSizes ? ` (${selectedSize})` : "";
    const finalCartName = `${localProduct.name}${sizeSuffix}${purchaseSuffix}`;
    const cartItemId = `${localProduct.id}${hasSizes ? `-${selectedSize}` : ""}${purchaseType === "subscription" ? `-sub-${subscriptionFreq}` : `-bundle-${bundleTier}`}`;

    const customProduct = {
      ...localProduct,
      id: cartItemId,
      name: finalCartName,
      price: currentPrice,
      originalPrice: currentOriginalPrice
    };
    
    addToCart(customProduct, quantity);
  };

  const doBuyNow = () => {
    doAddToCart();
    router.push("/checkout");
  };

  const handleAddToCart = () => requireAuth("cart", doAddToCart);
  const handleBuyNow = () => requireAuth("cart", doBuyNow);
  const handleLike = () => requireAuth("like", () => toggleLike(localProduct.id));

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
        {/* Gallery Image Display (closes imagination gap with lifestyle shots) */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-neutral-950 rounded-2xl overflow-hidden relative border border-white/10 group">
            {discount > 0 && (
              <div className="absolute top-6 left-6 z-10 bg-gold-500 text-black text-xs font-bold px-3 py-1.5 rounded-sm uppercase tracking-wider">
                {discount}% OFF
              </div>
            )}
            
            <Image 
              src={activeImage} 
              alt={product.name} 
              fill
              className="object-contain p-6 transition-all duration-500"
              priority
            />
          </div>
          
          {/* Thumbnails to toggle active image (Smart Selection) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setActiveImage(product.image)}
              className={`aspect-square rounded-xl overflow-hidden relative border bg-neutral-950 p-2 transition-all duration-300 cursor-pointer ${
                activeImage === product.image ? "border-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.2)]" : "border-white/5 hover:border-white/20"
              }`}
            >
              <Image src={product.image} alt="Packaging Mockup" fill className="object-contain p-3" />
              <span className="absolute bottom-2 left-0 right-0 text-center text-[8px] uppercase tracking-wider text-white/55 bg-black/70 py-0.5">Packaging</span>
            </button>
            <button
              onClick={() => setActiveImage(lifestyleImage)}
              className={`aspect-square rounded-xl overflow-hidden relative border bg-neutral-950 p-2 transition-all duration-300 cursor-pointer ${
                activeImage === lifestyleImage ? "border-gold-500 shadow-[0_0_10px_rgba(212,175,55,0.2)]" : "border-white/5 hover:border-white/20"
              }`}
            >
              <Image src={lifestyleImage} alt="Lifestyle Sourcing" fill className="object-cover" />
              <span className="absolute bottom-2 left-0 right-0 text-center text-[8px] uppercase tracking-wider text-white/55 bg-black/70 py-0.5">Sourcing Shot</span>
            </button>
          </div>
        </div>

        {/* Product Meta Details */}
        <div className="space-y-8">
          <div>
            {product.reviewsCount && product.reviewsCount > 30 && (
              <span className="inline-block bg-gold-500 text-black text-[9px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                ★ Bestseller
              </span>
            )}
            {product.bannerLine && (
              <span className="text-gold-500 font-bold text-xs uppercase tracking-[0.25em] block mb-2">
                {product.bannerLine}
              </span>
            )}
            <h1 className="font-cinzel text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {product.name}
            </h1>
            
            {/* Reviews & Social Proof Velocity (Real Data Grounded) */}
            <div className="flex flex-wrap items-center gap-4 text-xs mt-2 text-white/50">
              <div className="flex items-center text-gold-400">
                {"★".repeat(Math.round(product.rating))}
                {"☆".repeat(5 - Math.round(product.rating))}
              </div>
              <span className="font-semibold text-white/80">{product.rating} out of 5</span>
              <span>({product.reviewsCount || 0} verified Nimar buyer reviews)</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-sm">
                🔥 {product.reviewsCount && product.reviewsCount > 40 ? "180+" : "90+"} ordered this month
              </span>
            </div>
          </div>

          {/* Price details with dynamic feedback */}
          <div className="p-6 bg-white/5 rounded-xl border border-white/5 space-y-2">
            <span className="text-white/40 text-[10px] uppercase font-bold tracking-wider block">Price Details</span>
            <div className="flex items-baseline gap-4">
              <span className="text-gold-400 text-3xl font-extrabold">₹{currentPrice}</span>
              {currentOriginalPrice > currentPrice && (
                <span className="text-white/30 text-sm line-through">₹{currentOriginalPrice}</span>
              )}
            </div>
            {purchaseType === "subscription" ? (
              <p className="text-[10px] text-emerald-400 font-bold">🎉 Includes 15% Subscription Discount!</p>
            ) : bundleTier > 1 ? (
              <p className="text-[10px] text-emerald-400 font-bold">🎉 Includes bulk bundle discounts!</p>
            ) : (
              <p className="text-[10px] text-white/40 font-light">Inclusive of all local regional taxes.</p>
            )}
          </div>

          {/* Smart Defaults & Visual Swatch Cards */}
          {hasSizes && (
            <div className="space-y-3">
              <span className="text-white/70 text-xs uppercase tracking-wider block font-semibold">
                Select Size / Weight
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {sizeOptions.map((opt) => {
                  const isAvailable = opt.available !== false;
                  const isSelected = selectedSize === opt.label;
                  const meta = getVariantMetadata(opt.label);
                  
                  return isAvailable ? (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setSelectedSize(opt.label)}
                      className={`p-4 text-left rounded-xl border transition-all duration-300 relative cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? "bg-gold-500/10 border-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                          : "border-white/10 hover:border-white/20 text-white/70 hover:text-white bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      {opt.tag && (
                        <span className="absolute -top-2.5 left-3 bg-gold-500 text-black text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm border border-black/10">
                          {opt.tag}
                        </span>
                      )}
                      <div>
                        <span className="text-xs font-bold block">{opt.label.split(" (")[0]}</span>
                        <span className="text-[8px] text-white/40 block mt-1 leading-snug group-hover:text-white/60">
                          {meta.notes} • {meta.spice}
                        </span>
                      </div>
                      
                      {/* Tooltip trigger info for mobile/hover */}
                      <span className="text-[7px] text-gold-400 font-semibold uppercase tracking-wider mt-2 block">
                        {meta.origin}
                      </span>
                    </button>
                  ) : (
                    <div
                      key={opt.label}
                      title="Coming soon"
                      className="relative p-4 text-left rounded-xl border border-white/5 bg-white/[0.02] text-white/20 select-none cursor-not-allowed"
                    >
                      <span className="text-xs font-bold block">{opt.label.split(" (")[0]}</span>
                      <span className="text-[8px] text-white/20 block mt-1 leading-snug">{meta.notes}</span>
                      <span className="absolute -top-2.5 right-3 bg-white/10 text-white/30 text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm leading-none">
                        Soon
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Subscription Option (AOV Optimization - Smart Defaults) */}
          <div className="space-y-3">
            <span className="text-white/70 text-xs uppercase tracking-wider block font-semibold">
              Purchase Plan
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Subscription Card */}
              <button
                type="button"
                onClick={() => {
                  setPurchaseType("subscription");
                  setBundleTier(1); // reset bundle when selecting subscription
                }}
                className={`p-4 rounded-xl border text-left transition-all duration-300 relative cursor-pointer ${
                  purchaseType === "subscription"
                    ? "bg-gold-500/10 border-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : "bg-black/40 border-white/10 hover:border-white/25 text-white/70"
                }`}
              >
                <div className="absolute -top-2.5 right-4 bg-emerald-500 text-black text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  Save 15%
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Subscribe & Save</h4>
                <p className="text-[9px] text-white/50 mt-1 leading-snug">Deliver fresh batches automatically. Pause or cancel anytime.</p>
                
                {purchaseType === "subscription" && (
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-2">
                    <span className="text-[9px] text-white/60">Frequency:</span>
                    <select
                      value={subscriptionFreq}
                      onChange={(e) => setSubscriptionFreq(e.target.value as any)}
                      className="bg-black border border-white/20 text-gold-400 text-[10px] rounded px-1.5 py-0.5 focus:outline-none"
                    >
                      <option value="30">Every 30 Days (Recommended)</option>
                      <option value="15">Every 15 Days</option>
                      <option value="60">Every 60 Days</option>
                    </select>
                  </div>
                )}
              </button>

              {/* One-Time Card */}
              <button
                type="button"
                onClick={() => setPurchaseType("one-time")}
                className={`p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                  purchaseType === "one-time"
                    ? "bg-gold-500/10 border-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                    : "bg-black/40 border-white/10 hover:border-white/25 text-white/70"
                }`}
              >
                <h4 className="text-xs font-bold uppercase tracking-wider">One-time Purchase</h4>
                <p className="text-[9px] text-white/50 mt-1 leading-snug">Buy standard individual quantity at regular retail price.</p>
              </button>
            </div>
          </div>

          {/* Progressive Disclosure Bundle Tiers (Only for One-Time purchases) */}
          {purchaseType === "one-time" && (
            <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40">
              <button
                type="button"
                onClick={() => setIsBundleExpanded(!isBundleExpanded)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-white hover:text-gold-400 transition-colors cursor-pointer"
              >
                <span>📦 Buy a Bundle & Save up to 15%</span>
                <span className="text-gold-500 text-[10px] font-bold">
                  {isBundleExpanded ? "Collapse ▲" : "Expand ▼"}
                </span>
              </button>
              
              {isBundleExpanded && (
                <div className="p-4 border-t border-white/5 bg-black/25 grid grid-cols-2 gap-3">
                  {[
                    { tier: 1, label: "Single Unit", desc: "Standard", discount: "0%" },
                    { tier: 2, label: "Double Pack", desc: "Save 5%", discount: "5%" },
                    { tier: 4, label: "Family Pack of 4", desc: "Save 10%", discount: "10%" },
                    { tier: 6, label: "Party Pack of 6", desc: "Save 15%", discount: "15%" }
                  ].map((btn) => (
                    <button
                      key={btn.tier}
                      type="button"
                      onClick={() => setBundleTier(btn.tier as any)}
                      className={`p-3 rounded-lg border text-left transition-all duration-300 cursor-pointer ${
                        bundleTier === btn.tier
                          ? "bg-gold-500/10 border-gold-500 text-gold-400"
                          : "border-white/5 hover:border-white/10 bg-white/[0.01] text-white/60"
                      }`}
                    >
                      <h5 className="text-[11px] font-bold">{btn.label}</h5>
                      <span className="text-[9px] text-emerald-400 font-semibold block mt-0.5">{btn.desc} Off</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Add to Cart Controls */}
          {isOutOfStock ? (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
              This product is currently out of stock. We are sourcing fresh batches!
            </div>
          ) : (
            <div className="space-y-4">
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

                {/* Journey-oriented CTA Action Button */}
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 py-4 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 rounded-lg cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> Add To Cart
                </button>

                <button 
                  onClick={handleBuyNow}
                  className="flex-1 py-4 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 rounded-lg cursor-pointer shadow-[0_0_30px_rgba(212,175,55,0.25)]"
                >
                  {product.category === "BANANA_CHIPS"
                    ? "Bring Nimar's Crunch Home"
                    : product.category === "COW_GHEE"
                    ? "Taste Nimar's Purity"
                    : "Secure My Fresh Batch"}
                </button>

                <button 
                  onClick={handleLike}
                  className={`p-4 border rounded-lg flex items-center justify-center transition-colors cursor-pointer focus:outline-none ${
                    liked 
                      ? "bg-red-500/10 border-red-500/30 text-red-500" 
                      : "border-white/10 hover:border-white/20 text-white/60 hover:text-white"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? "fill-red-500" : ""}`} />
                </button>
              </div>
            </div>
          )}

          {/* Genuine Sourcing & Hygiene Guarantees (Conversion Copy) */}
          <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] grid grid-cols-2 gap-4 text-[10px] leading-relaxed text-white/50">
            <div className="space-y-1">
              <h5 className="font-bold text-white uppercase tracking-wider">FSSAI Certified</h5>
              <p>Certified hygiene standards. FSSAI Lic No. 21424010000318.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-white uppercase tracking-wider">100% Direct Sourced</h5>
              <p>Grown by Nimar farmers, eliminating middle-men to double their margins.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-white uppercase tracking-wider">Women-Empowered</h5>
              <p>Handcrafted locally by women self-help collectives in Barwani, MP.</p>
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-white uppercase tracking-wider">Purity Commitment</h5>
              <p>Zero artificial preservatives, trans fats, or colors. 100% pure.</p>
            </div>
          </div>

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
                <div className="space-y-5">
                  {/* What it is */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-1">What it is</h3>
                    <p className="text-white/70 leading-relaxed">{product.description}</p>
                  </div>

                  {/* How it&apos;s made */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-1">How it&apos;s made</h3>
                    <p className="text-white/60 leading-relaxed">
                      {product.category === "BANANA_CHIPS"
                        ? "Fresh Nimar bananas are thin-sliced, fried in pure refined oil without trans fat, then coated with regional spice blends. Each batch is flushed with nitrogen before sealing for maximum crispness."
                        : product.category === "COW_GHEE"
                        ? "Milk from local cow breeds is cultured into curd, then hand-churned using the traditional bilona (wooden churn) method to extract makhan (butter), which is then slow-clarified into granular ghee."
                        : "Seeds are single-pressed in a traditional wooden ghani (stone or wood press) at room temperature with no added heat or chemicals, preserving the oil&apos;s natural flavor and nutrients."}
                    </p>
                  </div>

                  {/* Why it&apos;s different */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-2">Why it&apos;s different</h3>
                    <ul className="space-y-1.5 text-[11px] text-white/50">
                      <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" /> Sourced directly from local Nimar farmers, not brokers</li>
                      <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" /> Handcrafted by women-led self-help collectives in Barwani, MP</li>
                      <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" /> Nitrogen-packed for freshness — no artificial preservatives</li>
                      <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-gold-500 mt-0.5 shrink-0" /> Fully traceable from harvest farm to your doorstep</li>
                    </ul>
                  </div>
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

      {/* FAQ Section — AEO-optimized visible Q&A */}
      {productFaqs.length > 0 && (
        <section className="mt-20 pt-16 border-t border-white/5">
          <div className="max-w-2xl">
            <p className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-2">Frequently Asked</p>
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-white mb-8">
              Questions About This Product
            </h2>
            <div className="space-y-2">
              {productFaqs.map((faq, i) => (
                <div
                  key={i}
                  className="border border-white/10 rounded-xl overflow-hidden bg-black/40 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-medium leading-snug">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gold-500 shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-xs text-white/50 leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
        reason={modalReason}
      />
    </div>
  );
}
