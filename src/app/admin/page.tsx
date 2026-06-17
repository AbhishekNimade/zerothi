"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, ShieldCheck, ShoppingBag, Leaf, DollarSign, Archive, ClipboardList, Check } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

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
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
  user: {
    name: string;
    email: string;
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form states for modifying products
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [editStock, setEditStock] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "ADMIN") {
        router.push("/");
      } else {
        loadAdminData();
      }
    }
  }, [user, authLoading, router]);

  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch("/api/admin/orders"),
        fetch("/api/products") // public endpoint we can query
      ]);

      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        setOrders(oData.orders || []);
      }
      
      if (productsRes.ok) {
        const pData = await productsRes.json();
        setProducts(pData || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status })
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: status as any } : o))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, paymentStatus })
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveProduct = async (productId: string) => {
    setActionLoading(productId);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          price: parseFloat(editPrice),
          stock: parseInt(editStock)
        })
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId ? { ...p, price: parseFloat(editPrice), stock: parseInt(editStock) } : p
          )
        );
        setEditingProductId(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const startEditing = (p: Product) => {
    setEditingProductId(p.id);
    setEditPrice(p.price.toString());
    setEditStock(p.stock.toString());
  };

  if (authLoading || !user || user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-20 overflow-hidden selection:bg-gold-500/30 selection:text-gold-300">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block">Control Panel</span>
            </div>
            <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-white">Admin Dashboard</h1>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex gap-4">
            <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center min-w-28">
              <span className="text-[9px] text-white/40 uppercase font-bold tracking-wider block">Total Orders</span>
              <span className="text-white font-bold text-lg">{orders.length}</span>
            </div>
            <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-center min-w-28">
              <span className="text-[9px] text-white/40 uppercase font-bold tracking-wider block">Total Products</span>
              <span className="text-white font-bold text-lg">{products.length}</span>
            </div>
          </div>
        </div>

        {/* Tab switch buttons */}
        <div className="flex gap-4 border-b border-white/10 pb-6 mb-8 justify-center sm:justify-start">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "orders" 
                ? "bg-gold-500 text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
                : "bg-white/5 border border-white/5 text-white/60 hover:text-white"
            }`}
          >
            <ClipboardList className="w-4 h-4" /> Manage Orders
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "products" 
                ? "bg-gold-500 text-black shadow-[0_0_20px_rgba(212,175,55,0.2)]" 
                : "bg-white/5 border border-white/5 text-white/60 hover:text-white"
            }`}
          >
            <Archive className="w-4 h-4" /> Manage Products
          </button>
        </div>

        {loadingData ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        ) : activeTab === "orders" ? (
          /* Manage Orders section */
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-20 text-white/40 text-sm font-light">
                No orders found in the database.
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 uppercase font-bold tracking-wider">
                      <th className="py-4 px-4">Order ID / Date</th>
                      <th className="py-4 px-4">Customer Details</th>
                      <th className="py-4 px-4">Items Summary</th>
                      <th className="py-4 px-4">Total Price</th>
                      <th className="py-4 px-4">Payment Status</th>
                      <th className="py-4 px-4">Shipping Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="py-5 px-4 space-y-1">
                          <span className="font-semibold text-white block">#{order.id.slice(0, 8)}</span>
                          <span className="text-white/40 text-[10px] block">
                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                          </span>
                        </td>
                        <td className="py-5 px-4 space-y-1">
                          <span className="text-white block font-medium">{order.shippingName}</span>
                          <span className="text-white/40 text-[10px] block truncate max-w-[150px]">{order.user.email}</span>
                          <span className="text-white/40 text-[10px] block">{order.phone}</span>
                        </td>
                        <td className="py-5 px-4">
                          <div className="max-w-[200px] truncate space-y-0.5 text-white/60">
                            {order.items.map((item, idx) => (
                              <span key={item.id} className="block text-[11px] truncate">
                                {item.product.name} (x{item.quantity})
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-5 px-4 font-bold text-gold-400">
                          ₹{order.totalAmount}
                        </td>
                        <td className="py-5 px-4">
                          <select
                            value={order.paymentStatus}
                            onChange={(e) => handleUpdatePaymentStatus(order.id, e.target.value)}
                            disabled={actionLoading === order.id}
                            className="bg-black/50 border border-white/10 text-white rounded px-2.5 py-1.5 focus:outline-none focus:border-gold-500 cursor-pointer disabled:opacity-50"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                          </select>
                        </td>
                        <td className="py-5 px-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            disabled={actionLoading === order.id}
                            className="bg-black/50 border border-white/10 text-white rounded px-2.5 py-1.5 focus:outline-none focus:border-gold-500 cursor-pointer disabled:opacity-50"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Manage Products section */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((p) => {
              const isEditing = editingProductId === p.id;
              const isFuture = p.category === "FUTURE";

              return (
                <div 
                  key={p.id} 
                  className="glass-card p-6 rounded-2xl border border-white/5 bg-black/40 flex gap-4 items-center"
                >
                  <div className="w-20 h-20 bg-neutral-950 rounded-lg overflow-hidden border border-white/10 relative flex-shrink-0">
                    <Image src={p.image} alt={p.name} fill className="object-contain p-2" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <span className="text-[9px] font-bold text-gold-500 uppercase tracking-widest">{p.category}</span>
                      <h4 className="text-white text-sm font-semibold truncate mt-0.5">{p.name}</h4>
                    </div>

                    {isEditing ? (
                      <div className="flex gap-4 items-end pt-1">
                        <div className="w-1/2 space-y-1">
                          <label className="text-[9px] text-white/40 uppercase font-bold tracking-wider block">Price (₹)</label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 focus:border-gold-500 rounded px-2 py-1 text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div className="w-1/2 space-y-1">
                          <label className="text-[9px] text-white/40 uppercase font-bold tracking-wider block">Stock</label>
                          <input
                            type="number"
                            value={editStock}
                            onChange={(e) => setEditStock(e.target.value)}
                            disabled={isFuture}
                            className="w-full bg-black/50 border border-white/10 focus:border-gold-500 rounded px-2 py-1 text-white text-xs focus:outline-none disabled:opacity-50"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-8 text-[11px]">
                        <div>
                          <span className="text-white/40 block">Price</span>
                          <span className="text-gold-400 font-bold">₹{p.price}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block">Stock Level</span>
                          <span className={p.stock < 10 && !isFuture ? "text-red-400 font-semibold" : "text-white/80"}>
                            {isFuture ? "Coming Soon" : p.stock}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-center">
                    {isEditing ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => handleSaveProduct(p.id)}
                          disabled={actionLoading === p.id}
                          className="w-10 h-10 rounded-full bg-emerald-500 text-black hover:bg-emerald-400 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50"
                          title="Save Changes"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditingProductId(null)}
                          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                          title="Cancel"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditing(p)}
                        className="px-4 py-2 border border-gold-500/50 hover:bg-gold-500 hover:text-black text-gold-400 rounded-sm text-[10px] uppercase font-bold tracking-wider transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
