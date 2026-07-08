"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw } from "lucide-react";

export default function PersonalizedBanner() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [lastOrder, setLastOrder] = useState<any>(null);

  useEffect(() => {
    try {
      const localOrdersStr = localStorage.getItem("zerothi_orders");
      if (localOrdersStr) {
        const allLocalOrders = JSON.parse(localOrdersStr);
        // Find last order for this user
        const userEmail = user?.email || "anonymous";
        const userOrders = allLocalOrders.filter(
          (o: any) => o.userEmail === userEmail || (!o.userEmail && userEmail === "anonymous")
        );
        
        if (userOrders.length > 0) {
          // Sort by date descending
          const sorted = userOrders.sort((a: any, b: any) => {
            return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime();
          });
          setLastOrder(sorted[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load last order for personalized banner", e);
    }
  }, [user]);

  const handleReorder = () => {
    if (!lastOrder || !lastOrder.items) return;
    
    // Add all items from last order to cart
    lastOrder.items.forEach((item: any) => {
      const productName = item.product?.name || item.name || "Product";
      const productImage = item.product?.image || item.image || "/placeholder.png";
      const productSlug = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      
      addToCart({
        id: item.id || Math.random().toString(),
        name: productName,
        slug: productSlug,
        price: item.price || 0,
        image: productImage,
        stock: 999,
      }, item.quantity || 1);
    });
    
    router.push("/checkout");
  };

  if (!user) {
    // Brand-story-forward note for first-time visitors
    return (
      <div className="w-full py-3 bg-terracotta-500/10 border-b border-terracotta-500/20 text-center relative z-20">
        <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-terracotta-400">
          🌿 First Time Sourcing? Use code <span className="text-white px-1.5 py-0.5 bg-terracotta-600 rounded-sm">NIMAR10</span> for 10% Off your first harvest batch.
        </span>
      </div>
    );
  }

  return (
    <div className="w-full bg-mustard-500/10 border-b border-mustard-500/20 py-3 px-4 relative z-20 text-center flex flex-col sm:flex-row justify-center items-center gap-3">
      <span className="text-[11px] font-sans text-white/80">
        ✨ Welcome back, <strong className="text-mustard-400 font-bold">{user.name || "Nimar Gourmet"}</strong>! Ready to stock up on your regional favorites?
      </span>
      {lastOrder && (
        <button
          onClick={handleReorder}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-mustard-500 hover:bg-mustard-400 text-black text-[9px] font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer"
        >
          <RotateCcw className="w-2.5 h-2.5" /> Reorder Last Purchase (₹{lastOrder.total || lastOrder.totalAmount})
          <ArrowRight className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}
