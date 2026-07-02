"use client";

import { useCart } from "@/context/CartContext";
import { useLikes } from "@/context/LikesContext";
import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number;
    category: string;
    image: string;
    hoverImage?: string | null;
    stock: number;
    rating: number;
    bannerLine?: string | null;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLikes();
  const router = useRouter();

  const liked = isLiked(product.id);
  const isOutOfStock = product.stock <= 0 && product.category !== "FUTURE";
  const isFuture = product.category === "FUTURE";

  const categoryLabel =
    product.category === "BANANA_CHIPS"
      ? "Banana Chips"
      : product.category === "COW_GHEE"
      ? "Pure Ghee"
      : product.category === "OIL"
      ? "Wood-Pressed Oil"
      : product.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-xl sm:rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all duration-300 flex flex-col group relative bg-black/40"
    >
      {/* Product Image Area */}
      <div className="aspect-square w-full bg-neutral-950 overflow-hidden relative border-b border-white/5">

        {/* Badges */}
        {isFuture && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-white/15 text-white text-[8px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-sm uppercase tracking-wider backdrop-blur-sm border border-white/10">
            Coming Soon
          </div>
        )}

        {/* Heart / Like button */}
        {!isFuture && (
          <button
            onClick={() => toggleLike(product.id)}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
          >
            <Heart
              className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                liked ? "fill-red-500 text-red-500 scale-110" : "text-white/70"
              }`}
            />
          </button>
        )}

        {/* Product Image */}
        <Link
          href={isFuture ? "#" : `/products/${product.slug}`}
          className="block w-full h-full relative"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={`object-contain p-3 sm:p-4 transition-transform duration-700 ease-out group-hover:scale-105 ${
              product.hoverImage ? "group-hover:opacity-0" : ""
            }`}
          />
          {product.hoverImage && (
            <Image
              src={product.hoverImage}
              alt={`${product.name} alternate`}
              fill
              className="object-contain p-3 sm:p-4 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
            />
          )}
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-2.5 sm:p-6 flex-1 flex flex-col justify-between gap-2 sm:gap-0">
        <div>
          {/* Category Label */}
          <span className="text-[8px] sm:text-[10px] font-bold text-gold-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-0.5 sm:mb-1.5 block">
            {categoryLabel}
          </span>

          {/* Product Name */}
          <Link href={isFuture ? "#" : `/products/${product.slug}`}>
            <h3 className="font-cinzel text-[11px] sm:text-lg text-white font-bold tracking-wide group-hover:text-gold-400 transition-colors line-clamp-2 sm:line-clamp-1 leading-tight sm:mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Description — hidden on mobile */}
          <p className="hidden sm:block text-white/60 text-xs font-light line-clamp-2 leading-relaxed mt-1 mb-4">
            {product.description}
          </p>
        </div>

        {/* Price & Actions Row */}
        <div className="pt-2 sm:pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
          {/* Price */}
          <div>
            {isFuture ? (
              <span className="text-white/40 text-[10px] uppercase tracking-wider font-semibold">
                Preview
              </span>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-gold-400 font-bold text-xs sm:text-sm">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-white/30 text-[9px] sm:text-xs line-through hidden sm:inline">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isFuture ? (
            <button
              className="px-2 sm:px-4 py-1 sm:py-2 border border-white/10 text-white/50 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider rounded-sm disabled:cursor-not-allowed"
              disabled
            >
              Notify
            </button>
          ) : isOutOfStock ? (
            <span className="text-red-400/80 text-[8px] sm:text-[10px] uppercase font-bold tracking-wider">
              Out of Stock
            </span>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Add to cart icon — hidden on very small screens */}
              <button
                onClick={() => addToCart(product)}
                className="hidden sm:flex w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white items-center justify-center transition-colors focus:outline-none cursor-pointer"
                title="Add to Cart"
              >
                <ShoppingBag className="w-4 h-4" />
              </button>
              {/* Buy Now button */}
              <button
                onClick={() => {
                  addToCart(product);
                  router.push("/checkout");
                }}
                className="px-2.5 sm:px-3.5 py-1.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider rounded-full bg-gold-500 hover:bg-gold-400 text-black transition-colors focus:outline-none cursor-pointer flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)] whitespace-nowrap"
              >
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
