"use client";

import { useCart } from "@/context/CartContext";
import { useLikes } from "@/context/LikesContext";
import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
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
  
  const liked = isLiked(product.id);
  const isOutOfStock = product.stock <= 0 && product.category !== "FUTURE";
  const isFuture = product.category === "FUTURE";
  
  // Calculate discount percentage
  const discount = product.originalPrice > product.price 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all duration-300 flex flex-col group relative bg-black/40"
    >
      {/* Product Image Area */}
      <div className="aspect-square w-full bg-neutral-950 overflow-hidden relative border-b border-white/5">
        {/* Floating Badges */}
        {discount > 0 && !isFuture && (
          <div className="absolute top-4 left-4 z-10 bg-gold-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider">
            {discount}% OFF
          </div>
        )}
        {isFuture && (
          <div className="absolute top-4 left-4 z-10 bg-white/15 text-white text-[10px] font-bold px-2.5 py-1 rounded-sm uppercase tracking-wider backdrop-blur-sm border border-white/10">
            COMING SOON
          </div>
        )}

        {/* Favorite Icon */}
        {!isFuture && (
          <button 
            onClick={() => toggleLike(product.id)}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
          >
            <Heart className={`w-4 h-4 transition-transform ${liked ? 'fill-red-500 text-red-500 scale-110' : 'text-white/70'}`} />
          </button>
        )}

        {/* Image tag with hover secondary image support */}
        <Link href={isFuture ? "#" : `/products/${product.slug}`} className="block w-full h-full relative">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            className={`object-contain p-4 transition-transform duration-700 ease-out group-hover:scale-105 ${product.hoverImage ? 'group-hover:opacity-0' : ''}`}
          />
          {product.hoverImage && (
            <Image 
              src={product.hoverImage} 
              alt={`${product.name} alternate`} 
              fill
              className="object-contain p-4 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
            />
          )}
        </Link>
      </div>

      {/* Product Details Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-gold-500 uppercase tracking-[0.2em] mb-1.5 block">
            {product.category === "BANANA_CHIPS" 
              ? "Banana Chips" 
              : product.category === "COW_GHEE" 
              ? "Pure Ghee" 
              : product.category === "OIL" 
              ? "Wood-Pressed Oil" 
              : product.category}
          </span>
          <Link href={isFuture ? "#" : `/products/${product.slug}`}>
            <h3 className="font-cinzel text-lg text-white font-bold tracking-wide group-hover:text-gold-400 transition-colors line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-white/60 text-xs font-light line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        {/* Price & Cart Actions */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
          <div>
            {isFuture ? (
              <span className="text-white/40 text-xs uppercase tracking-wider font-semibold">Preview</span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gold-400 font-bold text-sm">₹{product.price}</span>
                {product.originalPrice > product.price && (
                  <span className="text-white/30 text-xs line-through">₹{product.originalPrice}</span>
                )}
              </div>
            )}
          </div>

          {/* Action button */}
          {isFuture ? (
            <button className="px-4 py-2 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-wider rounded-sm disabled:cursor-not-allowed" disabled>
              Notify Me
            </button>
          ) : isOutOfStock ? (
            <span className="text-red-400/80 text-[10px] uppercase font-bold tracking-wider">Out of Stock</span>
          ) : (
            <button 
              onClick={() => addToCart(product)}
              className="w-8 h-8 rounded-full bg-gold-500 hover:bg-gold-400 text-black flex items-center justify-center transition-colors focus:outline-none cursor-pointer"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
