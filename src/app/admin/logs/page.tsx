"use client";

import { useEffect, useState } from "react";
import { 
  Loader2, 
  Search, 
  SlidersHorizontal,
  TrendingDown,
  ListTodo
} from "lucide-react";
import { 
  isSheetsConfigured, 
  fetchProductsFromSheet, 
  fetchOrdersFromSheet 
} from "@/lib/sheets";

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

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image: string;
  };
}

interface Order {
  id: string;
  shippingName: string;
  phone: string;
  shippingAddress: string;
  totalAmount: number;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
  user: {
    name: string;
    email: string;
  };
}

interface InventoryLog {
  id: string;
  timestamp: string;
  orderId: string;
  customerName: string;
  productName: string;
  sku: string;
  quantity: number;
  totalPrice: number;
  status: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: "1", sku: "CHIPS-SALT-200", name: "Salted Banana Chips", slug: "salted-banana-chips", category: "BANANA_CHIPS", price: 80, originalPrice: 100, stock: 250, image: "/Product Image/Salted Banana Mockup-01.png", status: "ACTIVE" },
  { id: "2", sku: "CHIPS-TOM-200", name: "Tomato Banana Chips", slug: "tomato-banana-chips", category: "BANANA_CHIPS", price: 90, originalPrice: 110, stock: 200, image: "/Product Image/Tomato Banana Mockup-02.png", status: "ACTIVE" },
  { id: "3", sku: "CHIPS-PERI-200", name: "Peri-Peri Banana Chips", slug: "peri-peri-banana-chips", category: "BANANA_CHIPS", price: 95, originalPrice: 120, stock: 150, image: "/Product Image/Peri-Peri Banana Mockup-03.png", status: "ACTIVE" },
  { id: "4", sku: "CHIPS-PUD-200", name: "Pudina Banana Chips", slug: "pudina-banana-chips", category: "BANANA_CHIPS", price: 85, originalPrice: 105, stock: 180, image: "/Product Image/Pudina Banana Mockup-04.png", status: "ACTIVE" },
  { id: "5", sku: "GHEE-COW-500", name: "Pure Cow Ghee", slug: "pure-cow-ghee", category: "COW_GHEE", price: 1100, originalPrice: 1300, stock: 150, image: "/Product Image/Cow Ghee Mockup-05.png", status: "ACTIVE" },
  { id: "6", sku: "OIL-GND-1L", name: "Wood-Pressed Groundnut Oil", slug: "wood-pressed-groundnut-oil", category: "OIL", price: 450, originalPrice: 550, stock: 100, image: "/Product Image/Groundnut Oil Mockup-06.png", status: "ACTIVE" },
  { id: "7", sku: "OIL-COC-1L", name: "Wood-Pressed Coconut Oil", slug: "wood-pressed-coconut-oil", category: "OIL", price: 380, originalPrice: 450, stock: 80, image: "/Product Image/Groundnut Oil Mockup-06.png", status: "ACTIVE" }
];

function parseProductsString(prodStr: string): OrderItem[] {
  if (!prodStr) return [];
  const PRODUCT_IMAGE_MAP: Record<string, string> = {
    "Salted Banana Chips": "/Product Image/Salted Banana Mockup-01.png",
    "Tomato Banana Chips": "/Product Image/Tomato Banana Mockup-02.png",
    "Peri-Peri Banana Chips": "/Product Image/Peri-Peri Banana Mockup-03.png",
    "Pudina Banana Chips": "/Product Image/Pudina Banana Mockup-04.png",
    "Pure Cow Ghee": "/Product Image/Cow Ghee Mockup-05.png",
    "Wood-Pressed Groundnut Oil": "/Product Image/Groundnut Oil Mockup-06.png",
    "Wood-Pressed Coconut Oil": "/Product Image/Groundnut Oil Mockup-06.png"
  };

  return prodStr.split(", ").map((part, index) => {
    const match = part.trim().match(/^(\d+)x (.*?) \(₹(\d+)\)$/);
    if (match) {
      const qty = parseInt(match[1]);
      const fullName = match[2];
      const price = parseFloat(match[3]);
      
      let img = "/Product Image/Salted Banana Mockup-01.png";
      for (const name in PRODUCT_IMAGE_MAP) {
        if (fullName.includes(name)) {
          img = PRODUCT_IMAGE_MAP[name];
          break;
        }
      }
      
      return {
        id: `item-${index}`,
        quantity: qty,
        price: price,
        product: {
          name: fullName,
          image: img
        }
      };
    }
    return {
      id: `item-${index}`,
      quantity: 1,
      price: 0,
      product: {
        name: part,
        image: "/Product Image/Salted Banana Mockup-01.png"
      }
    };
  });
}

export default function AdminLogsPage() {
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & filters for inventory logs
  const [logSearchQuery, setLogSearchQuery] = useState("");
  const [logFilterCategory, setLogFilterCategory] = useState("ALL");

  useEffect(() => {
    loadLogsData();
  }, []);

  const loadLogsData = async () => {
    setLoading(true);
    let ordersData: Order[] = [];
    let productsData: Product[] = [];

    // 1. Google Sheets Sync
    if (isSheetsConfigured()) {
      try {
        const sheetProducts = await fetchProductsFromSheet();
        if (sheetProducts && sheetProducts.length > 0) {
          productsData = sheetProducts.map((sp: any) => {
            const matched = DEFAULT_PRODUCTS.find((p) => p.slug === sp.slug || p.id === sp.id.toString());
            return {
              id: sp.id?.toString() || matched?.id || sp.slug,
              sku: sp.sku || matched?.sku || ("SKU-" + sp.id),
              name: sp.name || matched?.name || "",
              slug: sp.slug,
              category: sp.category || matched?.category || "BANANA_CHIPS",
              price: Number(sp.price),
              originalPrice: Number(sp.originalPrice) || Math.round(Number(sp.price) * 1.2),
              stock: Number(sp.stock),
              image: matched?.image || "/placeholder.png",
              status: sp.status || "ACTIVE"
            };
          });
        }

        const sheetOrders = await fetchOrdersFromSheet("");
        if (sheetOrders) {
          ordersData = sheetOrders.map((o: any) => ({
            id: o.OrderID || o.id || "",
            shippingName: o.CustomerName || o.shippingName || "Customer",
            phone: o.Phone || o.phone || "",
            shippingAddress: o.Address || o.shippingAddress || "",
            totalAmount: parseFloat(o.TotalAmount || o.total || "0"),
            status: (o.Status || o.status || "PENDING") as any,
            paymentStatus: o.PaymentStatus || o.paymentStatus || "PENDING",
            paymentMethod: o.PaymentMethod || o.paymentMethod || "COD",
            createdAt: o.Timestamp || o.date || new Date().toISOString(),
            items: parseProductsString(o.OrderedProducts || o.products || ""),
            user: {
              name: o.CustomerName || "Customer",
              email: o.UserEmail || "anonymous",
            }
          }));
        }
      } catch (err) {
        console.error("Failed to load logs data from Google Sheets:", err);
      }
    }

    // 2. Fallbacks
    if (productsData.length === 0) {
      const localProducts = localStorage.getItem("zerothi_products");
      productsData = localProducts ? JSON.parse(localProducts) : DEFAULT_PRODUCTS;
    }

    if (ordersData.length === 0) {
      try {
        const localOrdersStr = localStorage.getItem("zerothi_orders");
        if (localOrdersStr) {
          const allLocalOrders = JSON.parse(localOrdersStr);
          ordersData = allLocalOrders.map((o: any) => ({
            id: o.id,
            shippingName: o.shippingDetails?.name || o.shippingName || "Customer",
            phone: o.shippingDetails?.phone || o.phone || "",
            shippingAddress: o.shippingDetails 
              ? `${o.shippingDetails.address}, ${o.shippingDetails.city} - ${o.shippingDetails.postalCode}`
              : o.shippingAddress || "",
            totalAmount: o.total || o.totalAmount || 0,
            status: o.status || "PENDING",
            paymentStatus: o.paymentStatus || "PENDING",
            paymentMethod: o.paymentMethod || "Cash on Delivery (COD)",
            createdAt: o.date || o.createdAt || new Date().toISOString(),
            items: (o.items || []).map((item: any, idx: number) => ({
              id: item.id || `item-${idx}`,
              quantity: item.quantity || 1,
              price: item.price || 0,
              product: {
                name: item.name || "Product",
                image: item.image || "/placeholder.png"
              }
            })),
            user: {
              name: o.shippingDetails?.name || "Customer",
              email: o.userEmail || "anonymous"
            }
          }));
        }
      } catch (err) {
        console.error("Local storage logs fetch error:", err);
      }
    }

    // Construct inventory log items
    const logs: InventoryLog[] = [];
    ordersData.forEach((o) => {
      o.items.forEach((item, idx) => {
        const matchedProd = productsData.find(p => item.product.name.includes(p.name) || p.name.includes(item.product.name));
        logs.push({
          id: `${o.id}-${idx}`,
          timestamp: o.createdAt,
          orderId: o.id,
          customerName: o.shippingName,
          productName: item.product.name,
          sku: matchedProd?.sku || "SKU-GEN",
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          status: o.status
        });
      });
    });

    setProducts(productsData);
    setInventoryLogs(logs);
    setLoading(false);
  };

  const filteredLogs = inventoryLogs.filter((log) => {
    const searchMatch = log.customerName.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                        log.productName.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
                        log.sku.toLowerCase().includes(logSearchQuery.toLowerCase());
    
    const matchedProduct = products.find(p => p.sku === log.sku || p.name === log.productName);
    const categoryMatch = logFilterCategory === "ALL" || matchedProduct?.category === logFilterCategory;

    return searchMatch && categoryMatch;
  });

  return (
    <div className="space-y-6">
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-white font-cinzel text-xl font-bold tracking-wide flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-gold-500" /> Inventory Transaction Ledger
          </h2>
          <p className="text-white/40 text-xs mt-1">Audit log detailing product stocks subtracted, customer transactions, and timestamped listings.</p>
        </div>
        <button
          onClick={loadLogsData}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase rounded-lg tracking-wider transition-colors"
        >
          Refresh Logs
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center p-4 bg-white/5 border border-white/5 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search logs by customer, item or SKU..." 
            value={logSearchQuery}
            onChange={(e) => setLogSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-xl py-2.5 pl-12 pr-4 text-white placeholder-white/20 text-xs focus:outline-none"
          />
        </div>

        <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-semibold uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-white/40" />
          <select 
            value={logFilterCategory} 
            onChange={(e) => setLogFilterCategory(e.target.value)}
            className="bg-transparent text-white focus:outline-none pr-4 cursor-pointer"
          >
            <option value="ALL">All Categories</option>
            <option value="BANANA_CHIPS">Banana Chips</option>
            <option value="COW_GHEE">Pure Ghee</option>
            <option value="OIL">Wood-Pressed Oil</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-20 text-white/40 text-sm font-light border border-white/5 rounded-2xl bg-black/40">
          No inventory log records found matching the active filters.
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar border border-white/5 rounded-2xl bg-black/40">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase font-bold tracking-wider bg-white/[0.02]">
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Order ID</th>
                <th className="py-4 px-4">Customer Name</th>
                <th className="py-4 px-4">Product Details</th>
                <th className="py-4 px-4">SKU Code</th>
                <th className="py-4 px-4">Stock Alteration</th>
                <th className="py-4 px-4">Total Amount</th>
                <th className="py-4 px-4">Order Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 text-white/50">
                    {new Date(log.timestamp).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </td>
                  <td className="py-4 px-4 text-white font-semibold">
                    #{log.orderId}
                  </td>
                  <td className="py-4 px-4 text-white/80">
                    {log.customerName}
                  </td>
                  <td className="py-4 px-4 text-white font-medium">
                    {log.productName}
                  </td>
                  <td className="py-4 px-4 text-white/40 font-mono">
                    {log.sku}
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-1 text-red-400 font-semibold text-[11px]">
                      <TrendingDown className="w-3.5 h-3.5" /> -{log.quantity} qty
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gold-400 font-bold">
                    ₹{log.totalPrice}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      log.status === "DELIVERED" 
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                        : log.status === "CANCELLED"
                        ? "bg-red-500/10 border border-red-500/20 text-red-400"
                        : "bg-gold-500/10 border border-gold-500/20 text-gold-400"
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
