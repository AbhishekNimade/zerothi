"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag, Loader2, Calendar, Clipboard, Package, Truck, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load user orders:", err);
    } finally {
      setLoading(false);
    }
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
                          {/* Visual Stepper */}
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

                          {/* Ordered Items Grid */}
                          <div className="space-y-4 pt-6 border-t border-white/5">
                            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">Ordered Items</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                  <div className="w-14 h-14 relative bg-black/40 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
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
