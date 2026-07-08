"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag, CreditCard, Loader2, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { saveOrderToSheet, fetchOrdersFromSheet, isSheetsConfigured } from "@/lib/sheets";

import Stepper from "@/components/Stepper";

export default function CheckoutClient() {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [wizardStep, setWizardStep] = useState(1); // 1: Delivery Details, 2: Review & Payment
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isDefaulted, setIsDefaulted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load smart defaults from user profile or previous orders
  useEffect(() => {
    let prefilled = false;
    
    // 1. Try to read from localStorage defaults (last filled checkout)
    try {
      const savedDefaults = localStorage.getItem("zerothi_checkout_defaults");
      if (savedDefaults) {
        const parsed = JSON.parse(savedDefaults);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.city) setCity(parsed.city);
        if (parsed.postalCode) setPostalCode(parsed.postalCode);
        prefilled = true;
      }
    } catch (e) {
      console.warn("Failed loading checkout defaults:", e);
    }

    // 2. Fallback: try to read from most recent order
    if (!prefilled) {
      try {
        const savedOrders = localStorage.getItem("zerothi_orders");
        if (savedOrders) {
          const orders = JSON.parse(savedOrders);
          if (orders.length > 0 && orders[0].shippingDetails) {
            const sd = orders[0].shippingDetails;
            if (sd.name) setName(sd.name);
            if (sd.phone) setPhone(sd.phone);
            if (sd.address) setAddress(sd.address);
            if (sd.city) setCity(sd.city);
            if (sd.postalCode) setPostalCode(sd.postalCode);
            prefilled = true;
          }
        }
      } catch (e) {
        console.warn("Failed loading from order history:", e);
      }
    }

    // 3. Logged-in user base info prefill
    if (user) {
      if (!name) setName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
    }

    if (prefilled) {
      setIsDefaulted(true);
    }
  }, [user]);

  // Save values to localStorage as defaults as they type
  const saveDefaults = (field: string, val: string) => {
    try {
      const current = JSON.parse(localStorage.getItem("zerothi_checkout_defaults") || "{}");
      current[field] = val;
      localStorage.setItem("zerothi_checkout_defaults", JSON.stringify(current));
    } catch (e) {
      console.error(e);
    }
  };

  // Calculate pricing rules
  const shippingCharge = cartTotal > 500 ? 0 : 50;
  const finalTotal = cartTotal + shippingCharge;

  // Dynamically calculate sequential order ID starting from 1001
  const getNextOrderId = async (): Promise<string> => {
    let maxId = 1000;

    // 1. Try to query sheets
    if (isSheetsConfigured()) {
      try {
        const sheetOrders = await fetchOrdersFromSheet("");
        if (sheetOrders && sheetOrders.length > 0) {
          sheetOrders.forEach((o: any) => {
            const orderIdStr = (o.OrderID || o.id || "").toString();
            // extract digits only
            const digits = orderIdStr.replace(/\D/g, "");
            const numericId = parseInt(digits);
            if (!isNaN(numericId) && numericId > maxId) {
              maxId = numericId;
            }
          });
        }
      } catch (err) {
        console.warn("Failed to query order IDs from sheet, checking local storage:", err);
      }
    }

    // 2. Check local storage
    try {
      const localOrdersStr = localStorage.getItem("zerothi_orders");
      if (localOrdersStr) {
        const localOrders = JSON.parse(localOrdersStr);
        localOrders.forEach((o: any) => {
          const orderIdStr = (o.id || "").toString();
          const digits = orderIdStr.replace(/\D/g, "");
          const numericId = parseInt(digits);
          if (!isNaN(numericId) && numericId > maxId) {
            maxId = numericId;
          }
        });
      }
    } catch (e) {
      console.error("Failed to parse local order IDs:", e);
    }

    return (maxId + 1).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!name || !phone || !address || !city || !postalCode) {
      setError("Please fill out all shipping fields.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Calculate next sequential Order ID (starts at 1001, 1002, etc.)
      const nextId = await getNextOrderId();
      const orderId = nextId;

      const itemsList = cartItems.map(item => `- ${item.quantity}x ${item.name} (₹${item.price} each)`).join("\n");
      
      const message = `Hi ZEROTHI! I want to place an order:

*Order ID:* #${orderId}

*Order Details:*
${itemsList}

*Cart Subtotal:* ₹${cartTotal}
*Delivery Charge:* ${shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
*Total Amount:* ₹${finalTotal}

*Shipping Details:*
- Name: ${name}
- Phone: ${phone}
- Address: ${address}, ${city} - ${postalCode}
- Payment Mode: Cash on Delivery (COD)

Please confirm my order. Thanks!`;

      // Save order to local storage
      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal: cartTotal,
        shipping: shippingCharge,
        total: finalTotal,
        status: "PENDING",
        shippingDetails: {
          name,
          phone,
          address,
          city,
          postalCode
        },
        userEmail: user?.email || "anonymous"
      };

      try {
        const existingOrders = JSON.parse(localStorage.getItem("zerothi_orders") || "[]");
        existingOrders.unshift(newOrder);
        localStorage.setItem("zerothi_orders", JSON.stringify(existingOrders));
      } catch (e) {
        console.error("Failed to save order in local storage", e);
      }

      // Deduct inventory levels in local storage fallback
      try {
        const localProductsStr = localStorage.getItem("zerothi_products");
        if (localProductsStr) {
          const localProducts = JSON.parse(localProductsStr);
          const updated = localProducts.map((p: any) => {
            const orderItem = cartItems.find(item => item.name.includes(p.name) || p.name.includes(item.name));
            if (orderItem) {
              return { ...p, stock: Math.max(0, p.stock - orderItem.quantity) };
            }
            return p;
          });
          localStorage.setItem("zerothi_products", JSON.stringify(updated));
        }
      } catch (e) {
        console.error("Local stock deduction failed:", e);
      }

      // Save order to Google Sheets securely (triggers atomic stock deduction there too)
      try {
        saveOrderToSheet(newOrder);
      } catch (e) {
        console.error("Failed to save order in Google Sheet", e);
      }

      const whatsappNumber = "919425340003";
      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      clearCart();
      window.location.href = url;
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-20 overflow-hidden selection:bg-gold-500/30 selection:text-gold-300">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">Final step</span>
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-2">Secure Checkout</h1>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto rounded-full"></div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/5 rounded-2xl max-w-md mx-auto space-y-6">
            <ShoppingBag className="w-12 h-12 text-gold-500 mx-auto" />
            <div>
              <p className="text-white font-medium text-lg">Your cart is empty</p>
              <p className="text-white/40 text-xs mt-1 font-light">Cannot checkout with an empty shopping bag.</p>
            </div>
            <button 
              onClick={() => router.push("/products")}
              className="px-6 py-3 bg-gold-500 text-black font-bold uppercase text-xs tracking-wider rounded-sm cursor-pointer"
            >
              Back to Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Form Side */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 bg-black/55"
              >
                <h3 className="font-cinzel text-xl font-bold text-white mb-6">Shipping Address</h3>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
                    {error}
                  </div>
                )}

                {/* Goal Gradient Stepper: Step 2 of 4 (Cart was Step 1) */}
                <div className="mb-8">
                  <Stepper steps={["Cart", "Details", "Payment", "Confirmation"]} currentStep={wizardStep + 1} />
                </div>

                {wizardStep === 1 ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!name || !phone || !address || !city || !postalCode) {
                        setError("Please fill out all shipping fields.");
                        return;
                      }
                      setError("");
                      setWizardStep(2);
                    }} 
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-white/77 text-xs uppercase tracking-wider block font-semibold">Recipient Full Name</label>
                        {isDefaulted && name && <span className="text-[9px] text-gold-500/80 font-light">Prefilled</span>}
                      </div>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          saveDefaults("name", e.target.value);
                        }}
                        placeholder="e.g. John Doe"
                        className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 px-4 text-white placeholder-white/20 text-sm focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-white/77 text-xs uppercase tracking-wider block font-semibold">Contact Phone Number</label>
                        {isDefaulted && phone && <span className="text-[9px] text-gold-500/80 font-light">Prefilled</span>}
                      </div>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          saveDefaults("phone", e.target.value);
                        }}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 px-4 text-white placeholder-white/20 text-sm focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-white/77 text-xs uppercase tracking-wider block font-semibold">Street Delivery Address</label>
                        {isDefaulted && address && <span className="text-[9px] text-gold-500/80 font-light">Prefilled</span>}
                      </div>
                      <input 
                        type="text" 
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          saveDefaults("address", e.target.value);
                        }}
                        placeholder="e.g. House No. 123, Nimar Main Rd"
                        className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 px-4 text-white placeholder-white/20 text-sm focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-white/77 text-xs uppercase tracking-wider block font-semibold">City / Region</label>
                          {isDefaulted && city && <span className="text-[9px] text-gold-500/80 font-light">Prefilled</span>}
                        </div>
                        <input 
                          type="text" 
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            saveDefaults("city", e.target.value);
                          }}
                          placeholder="e.g. Khargone"
                          className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 px-4 text-white placeholder-white/20 text-sm focus:outline-none"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-white/77 text-xs uppercase tracking-wider block font-semibold">Postal / PIN Code</label>
                          {isDefaulted && postalCode && <span className="text-[9px] text-gold-500/80 font-light">Prefilled</span>}
                        </div>
                        <input 
                          type="text" 
                          value={postalCode}
                          onChange={(e) => {
                            setPostalCode(e.target.value);
                            saveDefaults("postalCode", e.target.value);
                          }}
                          placeholder="e.g. 451001"
                          className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 px-4 text-white placeholder-white/20 text-sm focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full py-4 mt-6 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-xs transition-colors rounded-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Continue to Payment & Review <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Shipping Address Summary (Smart Defaults visibly editable) */}
                    <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Delivery Details</span>
                        <button 
                          type="button" 
                          onClick={() => setWizardStep(1)}
                          className="text-[10px] text-gold-400 hover:text-gold-300 font-bold uppercase tracking-widest cursor-pointer underline underline-offset-2"
                        >
                          Change
                        </button>
                      </div>
                      <div className="text-xs space-y-1.5 text-white/70">
                        <p><strong className="text-white">Name:</strong> {name}</p>
                        <p><strong className="text-white">Phone:</strong> {phone}</p>
                        <p><strong className="text-white">Address:</strong> {address}, {city} - {postalCode}</p>
                      </div>
                    </div>

                    {/* Payment Mode (Smart Defaults pre-selected) */}
                    <div className="pt-2 space-y-3">
                      <label className="text-white/70 text-xs uppercase tracking-wider block font-semibold">Payment Mode</label>
                      
                      {/* COD (Pre-selected Recommended Default) */}
                      <div className="p-4 bg-gold-500/5 border border-gold-500/35 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-gold-400" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white text-xs font-semibold">Cash on Delivery (COD)</span>
                              <span className="text-[8px] bg-gold-500/10 border border-gold-500/20 text-gold-400 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                                Recommended
                              </span>
                            </div>
                            <p className="text-white/40 text-[10px] mt-0.5">Pay with cash or UPI on delivery.</p>
                          </div>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center text-black">
                          <Check className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>
                      </div>

                      {/* Online/UPI (Disabled Alternative) */}
                      <div className="p-4 bg-white/[0.01] border border-white/5 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-white/30" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white/40 text-xs font-semibold">UPI / Online Cards</span>
                              <span className="text-[7px] bg-white/10 text-white/50 font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                                Soon
                              </span>
                            </div>
                            <p className="text-white/20 text-[10px] mt-0.5">Instant online payment options.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setWizardStep(1)}
                        className="py-4 px-6 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white font-bold uppercase tracking-widest text-xs transition-colors rounded-lg cursor-pointer"
                      >
                        Back
                      </button>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-xs transition-colors rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Place Order (₹{finalTotal}) <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>

            {/* Order Summary Side */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/5 bg-[#050505] space-y-6">
                <h3 className="font-cinzel text-lg font-bold text-white tracking-wide border-b border-white/5 pb-4">Order Summary</h3>

                {/* Items List */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-12 h-12 relative bg-neutral-950 rounded-lg overflow-hidden border border-white/10">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-xs font-semibold truncate">{item.name}</h4>
                        <p className="text-white/40 text-[10px] mt-0.5">Qty: {item.quantity} • ₹{item.price}</p>
                      </div>
                      <span className="text-gold-400 text-xs font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Costs details */}
                <div className="border-t border-white/5 pt-4 space-y-3 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Cart Subtotal</span>
                    <span>₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Delivery Charges</span>
                    <span>{shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}</span>
                  </div>
                  {shippingCharge > 0 && (
                    <p className="text-[10px] text-gold-400/80 font-light">Add items worth ₹{500 - cartTotal} more for FREE delivery!</p>
                  )}

                  <div className="border-t border-white/5 pt-3 flex justify-between text-sm font-bold">
                    <span className="text-white">Amount Payable</span>
                    <span className="text-gold-400 text-lg">₹{finalTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
