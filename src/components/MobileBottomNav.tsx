"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const { user } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Define mobile core destinations (3-5 items)
  const navItems = [
    {
      label: "Home",
      path: "/",
      icon: Home,
    },
    {
      label: "Shop",
      path: "/products",
      icon: ShoppingBag,
    },
    ...(user ? [{
      label: "Cart",
      path: "/checkout",
      icon: ShoppingCart,
      badge: cartCount,
    }] : []),
    {
      label: "Account",
      path: user ? "/orders" : "/login",
      icon: User,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-55 block md:hidden bg-oatmeal-950/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.9)] pb-[calc(env(safe-area-inset-bottom,16px)-8px)]">
      <nav className="flex items-center justify-around h-16 relative px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="relative flex flex-col items-center justify-center flex-1 h-full min-h-[48px] cursor-pointer select-none text-center transition-all focus:outline-none"
            >
              {/* Highlight background active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute top-0 left-1/4 right-1/4 h-[3px] bg-mustard-500 rounded-full shadow-[0_0_10px_rgba(229,176,38,0.5)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon with fill/outline variants */}
              <div className="relative p-1">
                <Icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive 
                      ? "text-mustard-500 fill-mustard-500/20 scale-110" 
                      : "text-white/40 hover:text-white/70"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {/* Cart Quantity Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-terracotta-500 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center shadow-lg">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Text Label */}
              <span
                className={`text-[9px] font-medium tracking-wider uppercase mt-1 transition-all ${
                  isActive ? "text-mustard-450 font-bold" : "text-white/40"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
