"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag, Loader2, Calendar, Clipboard, Package, Truck, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { fetchOrdersFromSheet, updateOrderStatusInSheet } from "@/lib/sheets";

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
    // Matches: 2x Salted Banana Chips (100g) (₹80) -> Regex: (\d+)x (.*?) \(₹(\d+)\)
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
}

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login?redirect=/orders");
      return;
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    // 1. Try to fetch from Google Sheet first
    try {
      const sheetOrders = await fetchOrdersFromSheet(user?.email || "anonymous");
      if (sheetOrders && sheetOrders.length > 0) {
        const mappedOrders: Order[] = sheetOrders.map((o: any) => ({
          id: o.OrderID || o.id || "",
          shippingName: o.CustomerName || o.shippingName || "Customer",
          phone: o.Phone || o.phone || "",
          shippingAddress: o.Address || o.shippingAddress || "",
          totalAmount: parseFloat(o.TotalAmount || o.total || "0"),
          status: o.Status || o.status || "PENDING",
          paymentStatus: o.PaymentStatus || o.paymentStatus || "PENDING",
          paymentMethod: o.PaymentMethod || o.paymentMethod || "COD",
          createdAt: o.Timestamp || o.date || new Date().toISOString(),
          items: parseProductsString(o.OrderedProducts || o.products || "")
        }));
        setOrders(mappedOrders);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Failed to load user orders from Google Sheets, trying LocalStorage fallback:", err);
    }

    // 2. Try to fetch from SQLite API
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Failed to load user orders from API:", err);
    }

    // 3. Fallback to localStorage
    try {
      const localOrdersStr = localStorage.getItem("zerothi_orders");
      if (localOrdersStr) {
        const allLocalOrders = JSON.parse(localOrdersStr);
        const userEmail = user?.email || "anonymous";
        const userOrders = allLocalOrders.filter(
          (o: any) => o.userEmail === userEmail || !o.userEmail
        );
        
        const mappedOrders: Order[] = userOrders.map((o: any) => ({
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
          }))
        }));

        setOrders(mappedOrders);
      }
    } catch (err) {
      console.error("Failed to parse orders from localStorage:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    // LocalStorage cancel
    try {
      const localOrdersStr = localStorage.getItem("zerothi_orders");
      if (localOrdersStr) {
        const allLocalOrders: any[] = JSON.parse(localOrdersStr);
        const updated = allLocalOrders.map((o: any) => {
          if (o.id === orderId) {
            return { ...o, status: "CANCELLED" };
          }
          return o;
        });
        localStorage.setItem("zerothi_orders", JSON.stringify(updated));
      }
    } catch (e) {
      console.error("Failed to cancel order locally:", e);
    }

    // Google Sheets cancel
    try {
      updateOrderStatusInSheet(orderId, "CANCELLED");
    } catch (e) {
      console.error("Failed to cancel order in Google Sheet:", e);
    }

    fetchOrders();

    const message = `Hi ZEROTHI, I want to cancel my order ID #${orderId}`;
    const whatsappNumber = "919425340003";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (authLoading || (loading && user)) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </main>
    );
  }

  const toggleExpandOrder = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const getStatusStep = (status: string) => {
    if (status === "PENDING") return 0;
    if (status === "PROCESSING") return 1;
    if (status === "SHIPPED") return 2;
    if (status === "DELIVERED") return 3;
    return 0;
  };

  const STATUS_STEPS = [
    { label: "Ordered", desc: "Order Received", icon: Clipboard },
    { label: "Processing", desc: "Batch Sourcing", icon: Package },
    { label: "Shipped", desc: "In Transit", icon: Truck },
    { label: "Delivered", desc: "Arrived Safely", icon: CheckCircle2 },
  ];

  return (
    <main className="min-h-screen bg-black pt-20 overflow-hidden selection:bg-gold-500/30 selection:text-gold-300">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">Purchase history</span>
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-2">My Orders</h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto rounded-full"></div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/5 rounded-2xl max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-gold-500/5 border border-gold-500/25 flex items-center justify-center text-gold-400 mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-medium text-lg">No orders placed yet</p>
              <p className="text-white/40 text-xs mt-1 font-light">Your organic Nimar delicacies are waiting for you!</p>
            </div>
            <button 
              onClick={() => router.push("/products")}
              className="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-black font-semibold uppercase text-xs tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Shop Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {orders.map((order) => {
              const currentStep = getStatusStep(order.status);
              const isExpanded = expandedOrderId === order.id;

              return (
                <div 
                  key={order.id} 
                  className="glass-card rounded-2xl border border-white/10 overflow-hidden bg-black/50 transition-all duration-300"
                >
                  {/* Header Row */}
                  <div 
                    onClick={() => toggleExpandOrder(order.id)}
                    className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] bg-gold-500/10 border border-gold-500/30 text-gold-400 font-bold px-2.5 py-1 rounded-sm uppercase tracking-wide">
                          ID: #{order.id.slice(0, 8)}
                        </span>
                        <span className="text-white/40 text-xs flex items-center gap-1 font-light">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-white/60 text-xs font-light">
                        Shipping to: <span className="text-white font-medium">{order.shippingName}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-8">
                      <div>
                        <span className="text-white/40 text-[9px] uppercase font-bold tracking-wider block">Total Amount</span>
                        <span className="text-gold-400 font-bold text-lg">₹{order.totalAmount}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                          order.status === "DELIVERED" 
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" 
                            : order.status === "CANCELLED"
                            ? "bg-red-500/10 border border-red-500/30 text-red-400"
                            : "bg-gold-500/10 border border-gold-500/30 text-gold-400"
                        }`}>
                          {order.status}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Stepper & Items Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-white/5 bg-[#050505]"
                      >
                        <div className="p-6 md:p-8 space-y-8">
                          {order.status === "CANCELLED" ? (
                            <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                              <p className="font-semibold text-sm">Order Cancelled</p>
                              <p className="opacity-70 mt-1 font-light">This order has been cancelled. If this was a mistake, please reach out to ZEROTHI support via WhatsApp.</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Delivery Status</h4>
                              <div className="relative py-6 max-w-3xl mx-auto">
                                {/* Connector Progress Line */}
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
                                <div 
                                  className="absolute top-1/2 left-0 h-0.5 bg-gold-500 -translate-y-1/2 z-0 transition-all duration-500" 
                                  style={{ width: `${(currentStep / 3) * 100}%` }}
                                />

                                {/* Steps */}
                                <div className="relative z-10 flex justify-between">
                                  {STATUS_STEPS.map((step, idx) => {
                                    const StepIcon = step.icon;
                                    const isCompleted = idx < currentStep;
                                    const isActive = idx === currentStep;
                                    return (
                                      <div key={idx} className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                          isCompleted 
                                            ? "bg-gold-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" 
                                            : isActive 
                                            ? "bg-black border-2 border-gold-500 text-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.3)] animate-pulse" 
                                            : "bg-neutral-900 border border-white/10 text-white/30"
                                        }`}>
                                          <StepIcon className="w-4 h-4" />
                                        </div>
                                        <span className={`text-[10px] font-bold mt-2 ${isActive ? "text-gold-400" : isCompleted ? "text-white/80" : "text-white/30"}`}>
                                          {step.label}
                                        </span>
                                        <span className="text-[8px] text-white/30 font-light mt-0.5 hidden sm:block">
                                          {step.desc}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Ordered Items Grid */}
                          <div className="space-y-4 pt-6 border-t border-white/5">
                            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Ordered Items</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                  <div className="w-14 h-14 relative bg-black/40 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                    <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-1" />
                                  </div>
                                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h5 className="text-white text-xs font-semibold truncate">{item.product.name}</h5>
                                    <p className="text-white/40 text-[10px] mt-0.5">Quantity: {item.quantity} • ₹{item.price} each</p>
                                  </div>
                                  <div className="flex flex-col justify-center text-right">
                                    <span className="text-gold-400 text-xs font-bold">₹{item.price * item.quantity}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Delivery Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5 text-xs font-light">
                            <div>
                              <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Delivery Address</h5>
                              <p className="text-white/80 leading-relaxed">
                                {order.shippingAddress}
                              </p>
                            </div>
                            <div>
                              <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-2">Order Info</h5>
                              <ul className="space-y-1.5 text-white/80">
                                <li>Payment Method: <span className="text-white font-medium">{order.paymentMethod}</span></li>
                                <li>Payment Status: <span className="text-white font-medium">{order.paymentStatus}</span></li>
                                <li>Phone: <span className="text-white font-medium">{order.phone}</span></li>
                              </ul>
                            </div>
                          </div>

                          {/* Order Cancellation */}
                          {order.status === "PENDING" && (
                            <div className="flex justify-end pt-6 border-t border-white/5">
                              <button
                                onClick={() => handleCancelOrder(order.id)}
                                className="px-5 py-2.5 bg-red-500/10 border border-red-500/35 hover:bg-red-500 hover:text-white text-red-400 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.05)] hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                              >
                                Cancel Order
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
