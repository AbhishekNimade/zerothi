"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShoppingBag, CreditCard, ChevronRight, Loader2, ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=/checkout`);
    } else if (user) {
      setName(user.name);
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </main>
    );
  }

  // Calculate pricing rules
  const shippingCharge = cartTotal > 500 ? 0 : 50;
  const finalTotal = cartTotal + shippingCharge;

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
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          city,
          postalCode,
          items: cartItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        })
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        router.push("/orders");
      } else {
        setError(data.error || "Failed to process order.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
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

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-white/70 text-xs uppercase tracking-wider block font-semibold">Recipient Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 px-4 text-white placeholder-white/20 text-sm focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 text-xs uppercase tracking-wider block font-semibold">Contact Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 px-4 text-white placeholder-white/20 text-sm focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 text-xs uppercase tracking-wider block font-semibold">Street Delivery Address</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. House No. 123, Nimar Main Rd"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 px-4 text-white placeholder-white/20 text-sm focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white/70 text-xs uppercase tracking-wider block font-semibold">City / Region</label>
                      <input 
                        type="text" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Khargone"
                        className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 px-4 text-white placeholder-white/20 text-sm focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-xs uppercase tracking-wider block font-semibold">Postal / PIN Code</label>
                      <input 
                        type="text" 
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="e.g. 451001"
                        className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 px-4 text-white placeholder-white/20 text-sm focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Method Option */}
                  <div className="pt-6 border-t border-white/5 space-y-3">
                    <label className="text-white/70 text-xs uppercase tracking-wider block font-semibold">Payment Mode</label>
                    <div className="p-4 bg-gold-500/5 border border-gold-500/35 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gold-400" />
                        <div>
                          <p className="text-white text-xs font-semibold">Cash on Delivery (COD)</p>
                          <p className="text-white/40 text-[10px] mt-0.5">Pay in cash or UPI when delivered.</p>
                        </div>
                      </div>
                      <div className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center text-black">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 mt-6 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-xs transition-colors rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Place Order (₹{finalTotal}) <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
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
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
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
