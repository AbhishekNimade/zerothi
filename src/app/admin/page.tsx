"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ClipboardList, 
  Archive, 
  ListTodo, 
  Settings, 
  Database,
  ArrowRight,
  TrendingUp,
  Package,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { 
  isSheetsConfigured, 
  fetchProductsFromSheet, 
  fetchOrdersFromSheet 
} from "@/lib/sheets";

interface DashboardStats {
  ordersCount: number;
  productsCount: number;
  totalRevenue: number;
  activeProductsCount: number;
  pendingOrdersCount: number;
}

export default function AdminDashboardHub() {
  const [stats, setStats] = useState<DashboardStats>({
    ordersCount: 0,
    productsCount: 0,
    totalRevenue: 0,
    activeProductsCount: 0,
    pendingOrdersCount: 0
  });
  const [dbConfigured, setDbConfigured] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    let ordersData: any[] = [];
    let productsData: any[] = [];
    const isConfig = isSheetsConfigured();
    setDbConfigured(isConfig);

    // Fetch from sheets
    if (isConfig) {
      try {
        const prods = await fetchProductsFromSheet();
        if (prods) productsData = prods;
        const ords = await fetchOrdersFromSheet("");
        if (ords) ordersData = ords;
      } catch (err) {
        console.error("Sheets stats load failed:", err);
      }
    }

    // Fallbacks
    if (productsData.length === 0) {
      const localProds = localStorage.getItem("zerothi_products");
      if (localProds) productsData = JSON.parse(localProds);
    }

    if (ordersData.length === 0) {
      const localOrds = localStorage.getItem("zerothi_orders");
      if (localOrds) {
        ordersData = JSON.parse(localOrds).map((o: any) => ({
          total: o.total || o.totalAmount || 0,
          status: o.status || "PENDING"
        }));
      }
    }

    // Calculate revenue & indicators
    let revenue = 0;
    let pendingCount = 0;
    ordersData.forEach((o) => {
      const amt = parseFloat(o.TotalAmount || o.total || "0");
      if (!isNaN(amt)) revenue += amt;
      
      const status = (o.Status || o.status || "PENDING").toUpperCase();
      if (status === "PENDING" || status === "PROCESSING") {
        pendingCount++;
      }
    });

    let activeCount = 0;
    productsData.forEach((p) => {
      if ((p.status || "ACTIVE").toUpperCase() === "ACTIVE") {
        activeCount++;
      }
    });

    setStats({
      ordersCount: ordersData.length,
      productsCount: productsData.length,
      totalRevenue: revenue,
      activeProductsCount: activeCount,
      pendingOrdersCount: pendingCount
    });
    setLoading(false);
  };

  const menuCards = [
    {
      title: "Orders Management",
      desc: "Manage customer shipments, edit delivery status, verify payment receipts.",
      path: "/admin/orders",
      icon: ClipboardList,
      color: "from-amber-500/20 to-orange-500/5",
      borderColor: "hover:border-amber-500/30",
      iconColor: "text-amber-400",
      badge: stats.pendingOrdersCount > 0 ? `${stats.pendingOrdersCount} Pending` : null
    },
    {
      title: "Products Inventory",
      desc: "Update product retail rates, control stock levels, set active visibility toggles.",
      path: "/admin/products",
      icon: Archive,
      color: "from-yellow-500/20 to-gold-500/5",
      borderColor: "hover:border-gold-500/30",
      iconColor: "text-gold-400",
      badge: `${stats.activeProductsCount}/${stats.productsCount} Active`
    },
    {
      title: "Transaction Logs",
      desc: "Audit automated ledger lines tracking item quantity subtractions and orders history.",
      path: "/admin/logs",
      icon: ListTodo,
      color: "from-neutral-500/20 to-neutral-700/5",
      borderColor: "hover:border-white/20",
      iconColor: "text-white/80",
      badge: null
    },
    {
      title: "Sheets Integration",
      desc: "Modify script URLs, test connections, view Apps Script setup copy guides.",
      path: "/admin/settings",
      icon: Settings,
      color: "from-emerald-500/20 to-teal-500/5",
      borderColor: "hover:border-emerald-500/30",
      iconColor: "text-emerald-400",
      badge: dbConfigured ? "Connected" : "Fallback Local"
    }
  ];

  return (
    <div className="space-y-10">
      {/* Intro section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-white font-cinzel text-xl font-bold tracking-wide">Overview Hub</h2>
          <p className="text-white/40 text-xs mt-1">Review live sales metrics, inventory status, and configure databases.</p>
        </div>
        
        {/* Connection status tag */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-medium backdrop-blur-md ${
          dbConfigured 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
        }`}>
          <Database className="w-3.5 h-3.5" />
          <span>Database: {dbConfigured ? "Google Sheets Connected" : "Local Storage Mode"}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* revenue card */}
        <div className="glass-card p-6 border border-white/5 bg-white/[0.02] rounded-2xl relative overflow-hidden">
          <div className="absolute right-4 top-4 text-white/5">
            <TrendingUp className="w-16 h-16" />
          </div>
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Estimated Revenue</span>
          <h3 className="font-cinzel text-2xl font-bold text-white mt-1.5">₹{stats.totalRevenue.toLocaleString("en-IN")}</h3>
          <span className="text-[9px] text-emerald-400 mt-2 block font-medium">All checkouts cumulative</span>
        </div>

        {/* Orders status card */}
        <div className="glass-card p-6 border border-white/5 bg-white/[0.02] rounded-2xl relative overflow-hidden">
          <div className="absolute right-4 top-4 text-white/5">
            <ClipboardList className="w-16 h-16" />
          </div>
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Sales Invoices</span>
          <h3 className="font-cinzel text-2xl font-bold text-white mt-1.5">{stats.ordersCount} Invoiced</h3>
          <span className="text-[9px] text-amber-400 mt-2 block font-medium">{stats.pendingOrdersCount} Pending shipments</span>
        </div>

        {/* catalog card */}
        <div className="glass-card p-6 border border-white/5 bg-white/[0.02] rounded-2xl relative overflow-hidden">
          <div className="absolute right-4 top-4 text-white/5">
            <Package className="w-16 h-16" />
          </div>
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Catalog Stock</span>
          <h3 className="font-cinzel text-2xl font-bold text-white mt-1.5">{stats.productsCount} Items</h3>
          <span className="text-[9px] text-gold-400 mt-2 block font-medium">{stats.activeProductsCount} Live on catalog list</span>
        </div>

        {/* sheet status card */}
        <div className="glass-card p-6 border border-white/5 bg-white/[0.02] rounded-2xl relative overflow-hidden">
          <div className="absolute right-4 top-4 text-white/5">
            <FileSpreadsheet className="w-16 h-16" />
          </div>
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider block">Google Sheets Sync</span>
          <h3 className="font-cinzel text-2xl font-bold text-white mt-1.5">{dbConfigured ? "Active" : "Disabled"}</h3>
          {dbConfigured ? (
            <span className="text-[9px] text-emerald-400 mt-2 block font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> API Web App synchronized
            </span>
          ) : (
            <span className="text-[9px] text-amber-400 mt-2 block font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Using client fallbacks
            </span>
          )}
        </div>
      </div>

      {/* Grid of Section Managers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {menuCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link 
              key={card.path} 
              href={card.path} 
              className={`group flex items-start gap-5 p-8 rounded-3xl border border-white/5 bg-gradient-to-br ${card.color} ${card.borderColor} transition-all duration-300 relative hover:shadow-[0_0_30px_rgba(255,255,255,0.02)] cursor-pointer`}
            >
              {/* Icon Container */}
              <div className={`p-4 rounded-2xl bg-black/50 border border-white/10 group-hover:scale-105 transition-transform duration-300 ${card.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-white text-lg font-bold font-cinzel leading-none">{card.title}</h4>
                  {card.badge && (
                    <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      card.title.includes("Orders") 
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                        : card.title.includes("Products")
                        ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {card.badge}
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-xs mt-2.5 font-light leading-relaxed">{card.desc}</p>
              </div>

              {/* Action arrow */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-gold-400 group-hover:translate-x-1.5 transition-all duration-300">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
