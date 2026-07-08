"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Plus, Minus, Check, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";

interface HamperItem {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

const BOX_BASES = [
  { id: "crate", name: "Handcrafted Wooden Crate", price: 149, desc: "A premium, reusable pine wood box sourced from local Madhya Pradesh artisans.", image: "/Logo%20Zerothi/Leaf%20logo.png", popular: true },
  { id: "festive", name: "Nimar Festive Gift Box", price: 99, desc: "A vibrant golden-red traditional card box with Nimar motifs.", image: "/Logo%20Zerothi/Leaf%20logo.png" },
  { id: "carton", name: "Eco-Friendly Kraft Carton", price: 49, desc: "A simple, minimalist recycled paper box emphasizing zero-waste.", image: "/Logo%20Zerothi/Leaf%20logo.png" }
];

const AVAILABLE_ITEMS: HamperItem[] = [
  { id: "salted-banana-chips-200g", name: "Salted Banana Chips (200g)", price: 80, image: "/Product%20Image/Salted%20Banana%20Mockup-01.png", stock: 100 },
  { id: "tomato-banana-chips-200g", name: "Tomato Banana Chips (200g)", price: 90, image: "/Product%20Image/Tomato%20Banana%20Mockup-02.png", stock: 100 },
  { id: "peri-peri-banana-chips-200g", name: "Peri-Peri Banana Chips (200g)", price: 95, image: "/Product%20Image/Peri-Peri%20Banana%20Mockup-03.png", stock: 100 },
  { id: "pudina-banana-chips-200g", name: "Pudina Banana Chips (200g)", price: 85, image: "/Product%20Image/Pudina%20Banana%20Mockup-04.png", stock: 100 },
  { id: "pure-cow-ghee-500ml", name: "Pure Cow Ghee (500ml)", price: 1100, image: "/Product%20Image/Cow%20Ghee%20Mockup-05.png", stock: 50 },
  { id: "wood-pressed-groundnut-oil-1l", name: "Wood-Pressed Groundnut Oil (1L)", price: 450, image: "/Product%20Image/Groundnut%20Oil%20Mockup-06.png", stock: 50 }
];

export default function HamperCustomizer() {
  const { addToCart } = useCart();
  const router = useRouter();

  // Premium first ordering (Contrast Effect)
  const sortedBoxes = [...BOX_BASES].sort((a, b) => b.price - a.price);

  const [selectedBox, setSelectedBox] = useState(sortedBoxes[0]); // Default to premium wooden crate
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cardMessage, setCardMessage] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  const handleIncrement = (id: string) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.min((prev[id] || 0) + 1, 10)
    }));
  };

  const handleDecrement = (id: string) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0)
    }));
  };

  // Calculate prices
  const itemsTotal = AVAILABLE_ITEMS.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + item.price * qty;
  }, 0);

  const totalHamperPrice = selectedBox.price + itemsTotal;
  const totalItemCount = Object.values(quantities).reduce((sum, q) => sum + q, 0);

  const handleAddToCart = () => {
    if (totalItemCount === 0) {
      alert("Please add at least 1 item to your hamper.");
      return;
    }

    const itemsSummaryList = AVAILABLE_ITEMS
      .filter(item => (quantities[item.id] || 0) > 0)
      .map(item => `${quantities[item.id]}x ${item.name.replace(/ \(.*\)/, "")}`)
      .join(", ");

    const customHamperName = `Custom Hamper [${selectedBox.name.split(" ")[0]} Box: ${itemsSummaryList}]${cardMessage ? ` (Note: ${cardMessage})` : ""}`;

    addToCart({
      id: `custom-hamper-${Date.now()}`,
      name: customHamperName,
      slug: "custom-gift-hamper",
      price: totalHamperPrice,
      image: "/Logo%20Zerothi/Leaf%20logo.png",
      stock: 100
    }, 1);

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      router.push("/checkout");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-black pt-20 overflow-hidden selection:bg-gold-500/30 selection:text-gold-300">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">IKEA Effect Experience</span>
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-2">Build Your Own Hamper</h1>
          <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto font-light leading-relaxed mt-2">
            Customize a premium regional gift bundle. Craft it yourself, write a gift note, and share Nimar's purity with someone special.
          </p>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto rounded-full mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Customizer Controls Side */}
          <div className="lg:col-span-7 space-y-10">
            {/* Step 1: Choose Box (Contrast Effect - premium first) */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-white">Step 1: Choose Packaging Box</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sortedBoxes.map((box) => (
                  <button
                    key={box.id}
                    onClick={() => setSelectedBox(box)}
                    className={`p-5 rounded-xl border text-left flex flex-col justify-between gap-4 transition-all duration-300 relative cursor-pointer ${
                      selectedBox.id === box.id
                        ? "bg-gold-500/10 border-gold-500 shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                        : "bg-black/40 border-white/5 hover:border-white/20"
                    }`}
                  >
                    {box.popular && (
                      <span className="absolute -top-2.5 right-4 bg-gold-500 text-black text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        Most Popular
                      </span>
                    )}
                    <div>
                      <h4 className="text-white text-xs font-bold uppercase tracking-wider">{box.name}</h4>
                      <p className="text-white/40 text-[10px] mt-1 font-light leading-relaxed">{box.desc}</p>
                    </div>
                    <span className="text-gold-400 font-extrabold text-sm mt-2 block">₹{box.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Fill items */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-white">Step 2: Add Nimar Specialties</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AVAILABLE_ITEMS.map((item) => {
                  const qty = quantities[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex gap-4 items-center justify-between"
                    >
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="w-12 h-12 relative bg-neutral-950 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-white text-xs font-semibold truncate leading-tight">{item.name}</h4>
                          <span className="text-gold-400 font-bold text-xs mt-1 block">₹{item.price}</span>
                        </div>
                      </div>

                      {/* Quantity counter */}
                      <div className="flex items-center border border-white/10 rounded-lg bg-black/50 overflow-hidden">
                        <button
                          onClick={() => handleDecrement(item.id)}
                          className="px-2.5 py-1.5 text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs text-white font-bold min-w-6 text-center">{qty}</span>
                        <button
                          onClick={() => handleIncrement(item.id)}
                          className="px-2.5 py-1.5 text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Add personal card note */}
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 space-y-6">
              <h3 className="font-cinzel text-lg font-bold text-white border-b border-white/5 pb-4">Step 3: Gift Message (Optional)</h3>
              <textarea
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                placeholder="Write a message to print on a custom gift card (e.g. 'To Mom & Dad, wishing you a tasty and healthy festive season!')"
                className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-xl py-3.5 px-4 text-white placeholder-white/20 text-xs focus:outline-none min-h-[90px] resize-none"
                maxLength={200}
              />
            </div>
          </div>

          {/* Interactive Visual Preview Box Side */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-[#050505] space-y-6">
              <h3 className="font-cinzel text-lg font-bold text-white border-b border-white/5 pb-4">Hamper Assembly</h3>

              {/* The "Virtual Hamper Box" container */}
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 bg-neutral-950/50 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden">
                <AnimatePresence mode="popLayout">
                  {totalItemCount === 0 ? (
                    <motion.div
                      key="empty-box"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center space-y-3"
                    >
                      <Gift className="w-10 h-10 text-white/20 mx-auto stroke-dasharray" />
                      <p className="text-white/40 text-xs font-light">Add Nimar specialties to assemble your wooden crate box.</p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="active-box"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full space-y-4"
                    >
                      {/* Box Base info */}
                      <div className="flex justify-between items-center bg-gold-500/10 border border-gold-500/20 rounded-lg px-3 py-2 text-[10px] uppercase font-bold text-gold-400">
                        <span>📦 {selectedBox.name}</span>
                        <span>₹{selectedBox.price}</span>
                      </div>

                      {/* Assembled Items lists */}
                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {AVAILABLE_ITEMS.map((item) => {
                          const qty = quantities[item.id] || 0;
                          if (qty === 0) return null;
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="flex items-center justify-between text-xs text-white/80 bg-white/5 rounded-lg p-2 border border-white/[0.03]"
                            >
                              <span className="font-semibold truncate">{item.name.replace(/ \(.*\)/, "")}</span>
                              <span className="text-gold-400 font-bold bg-white/5 px-2 py-0.5 rounded-sm">x{qty}</span>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Card message teaser */}
                      {cardMessage && (
                        <div className="p-3 bg-neutral-900 border border-white/5 rounded-lg text-[10px] text-white/50 italic leading-relaxed">
                          💌 &ldquo;{cardMessage}&rdquo;
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price Details */}
              <div className="border-t border-white/5 pt-4 space-y-3 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Selected Box Packaging</span>
                  <span>₹{selectedBox.price}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Snacks & Oils Subtotal</span>
                  <span>₹{itemsTotal}</span>
                </div>
                <div className="border-t border-white/5 pt-3 flex justify-between text-sm font-bold">
                  <span className="text-white">Hamper Total Price</span>
                  <span className="text-gold-400 text-lg">₹{totalHamperPrice}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={totalItemCount === 0 || isAdded}
                className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-xs transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(212,175,55,0.25)]"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" strokeWidth={3} /> Added to Cart!
                  </>
                ) : (
                  <>
                    Add Hamper to Cart <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
