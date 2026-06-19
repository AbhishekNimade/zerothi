"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Loader2, 
  ShieldCheck,
  ClipboardList,
  Archive,
  ListTodo,
  Settings,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { fetchOrdersFromSheet, fetchProductsFromSheet, isSheetsConfigured } from "@/lib/sheets";

interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  status: string;
}

const DEFAULT_PRODUCTS_COUNT = 7;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  const loadCounts = async () => {
    try {
      let prodLen = DEFAULT_PRODUCTS_COUNT;
      let ordLen = 0;

      if (isSheetsConfigured()) {
        try {
          const prods = await fetchProductsFromSheet();
          if (prods && prods.length > 0) prodLen = prods.length;
          const ords = await fetchOrdersFromSheet("");
          if (ords && ords.length > 0) ordLen = ords.length;
        } catch (e) {
          console.error("Sheets fetch in layout counts failed:", e);
        }
      } else {
        const localProds = localStorage.getItem("zerothi_products");
        if (localProds) {
          prodLen = JSON.parse(localProds).length;
        }
        const localOrds = localStorage.getItem("zerothi_orders");
        if (localOrds) {
          ordLen = JSON.parse(localOrds).length;
        }
      }

      setProductsCount(prodLen);
      setOrdersCount(ordLen);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "ADMIN") {
        router.push("/");
      } else {
        loadCounts();
      }
    }
  }, [user, authLoading, router, pathname]);

  if (authLoading || !user || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </main>
    );
  }

  const tabs = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Orders", path: "/admin/orders", icon: ClipboardList },
    { name: "Products", path: "/admin/products", icon: Archive },
    { name: "Logs", path: "/admin/logs", icon: ListTodo },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <main className="min-h-screen bg-black pt-20 overflow-hidden selection:bg-gold-500/30 selection:text-gold-300">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block">Control Panel</span>
            </div>
            <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-white tracking-wide">Admin Hub</h1>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex gap-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center min-w-28 backdrop-blur-md">
              <span className="text-[9px] text-white/40 uppercase font-bold tracking-wider block">Orders Count</span>
              <span className="text-white font-bold text-lg">{ordersCount}</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center min-w-28 backdrop-blur-md">
              <span className="text-[9px] text-white/40 uppercase font-bold tracking-wider block">Catalog Stock</span>
              <span className="text-white font-bold text-lg">{productsCount}</span>
            </div>
          </div>
        </div>

        {/* Tab switch navigation */}
        <div className="flex flex-wrap gap-3 border-b border-white/10 pb-6 mb-8 justify-center sm:justify-start">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive 
                    ? "bg-gold-500 text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
                    : "bg-white/5 border border-white/5 text-white/60 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.name}
              </Link>
            );
          })}
        </div>

        {/* Page Render Container */}
        <div className="min-h-[50vh]">
          {children}
        </div>
      </section>

      <Footer />
    </main>
  );
}
