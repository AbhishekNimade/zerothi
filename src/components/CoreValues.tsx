"use client";

import React, { useState } from "react";
import { Leaf, ShieldCheck, ArrowRight, HeartHandshake, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

interface ValueItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  shortDesc: string;
  detailedDesc: string;
  metrics: string[];
}

const VALUES: ValueItem[] = [
  {
    id: "freshness",
    title: "Freshness First",
    subtitle: "Direct Harvest-to-Pack Pipeline",
    icon: Leaf,
    shortDesc: "Ensuring every product is freshly processed and packed under strict hygiene conditions.",
    detailedDesc: "Sourced directly from local Nimar farms at dawn, sliced and processed within hours to lock in maximum organic crunch and flavor without degradation.",
    metrics: [
      "Harvest-to-Pack: < 12 Hours",
      "Nitrogen-Flushed Preservation"
    ]
  },
  {
    id: "processing",
    title: "Smart Processing",
    subtitle: "Modern Engineering",
    icon: ShieldCheck,
    shortDesc: "Combining traditional methodologies with advanced, preservation-free machinery.",
    detailedDesc: "Cooked in clean, computer-controlled deep fryers with strict heat profiles. Preserves the natural banana color without requiring chemicals.",
    metrics: [
      "Zero Preservative Injection",
      "99.8% Slicing Precision"
    ]
  },
  {
    id: "taste",
    title: "Authentic Taste",
    subtitle: "Nimar Regional Masalas",
    icon: ArrowRight,
    shortDesc: "Using premium masalas and ground-level ingredients for deep, regional flavors.",
    detailedDesc: "No synthetic powder mixes. We use geographical-indicator (GI) spices ground locally by Nimar women cooperatives for authentic flavor.",
    metrics: [
      "100% Local GI Spices",
      "Hand-Ground Spice Mixes"
    ]
  },
  {
    id: "snacking",
    title: "Better Snacking",
    subtitle: "Clean Fats & Zero Trans Fat",
    icon: HeartHandshake,
    shortDesc: "Prepared exclusively with refined oils, zero colors, and no artificial preservatives.",
    detailedDesc: "Snacks fried in premium high-smoke point oils monitored hourly for acidity levels. Zero trans fat, zero synthetic colors.",
    metrics: [
      "0g Trans Fat Per Serving",
      "Vigilant Oil Acidity Tests"
    ]
  }
];

export default function CoreValues() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {VALUES.map((item) => (
        <FlipCard key={item.id} item={item} />
      ))}
    </div>
  );
}

// ── 3D Flip Card (click-based, mobile-friendly) ──
function FlipCard({ item }: { item: ValueItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = item.icon;

  const handleMouseEnter = () => {
    if (window.matchMedia("(hover: hover)").matches) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.matchMedia("(hover: hover)").matches) {
      setIsHovered(false);
    }
  };

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const silentGlow = "rgba(212, 175, 55, 0.12)";
  const activeGlow = "rgba(212, 175, 55, 0.22)";
  const hoverBorder = "border-gold-500/30";

  const shouldShowBack = isHovered || isFlipped;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[320px] rounded-2xl cursor-pointer select-none"
      style={{ perspective: 1200 }}
    >
      {/* ── CARD OUTER ── */}
      <motion.div
        animate={{
          rotateY: shouldShowBack ? 180 : 0,
          boxShadow: shouldShowBack
            ? `0 20px 40px -10px ${activeGlow}, 0 0 25px 1px ${silentGlow}`
            : "0 4px 30px rgba(0,0,0,0.15)"
        }}
        transition={{ type: "spring", stiffness: 200, damping: 26, mass: 0.8 }}
        className="w-full h-full relative rounded-2xl"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >

        {/* ── CARD FRONT ── */}
        <div
          className={`absolute inset-0 w-full h-full glass-card p-8 rounded-2xl border border-white/5 bg-black/45 ${
            shouldShowBack ? "" : hoverBorder
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-gold-500/5 to-transparent opacity-10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400 mb-6">
              <Icon className={`w-6 h-6 ${item.id === "taste" ? "rotate-[-45deg]" : ""}`} />
            </div>

            <h3 className="text-lg font-bold text-white mb-3 tracking-wide">
              {item.title}
            </h3>

            <p className="text-white/60 text-xs font-light leading-relaxed">
              {item.shortDesc}
            </p>
          </div>

          <div className="relative z-10 text-[9px] font-bold text-gold-500/40 uppercase tracking-widest flex items-center gap-1.5 mt-4">
            <span>Hover or Tap to reveal details</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* ── CARD BACK ── */}
        <div
          className="absolute inset-0 w-full h-full glass-card p-6 rounded-2xl border border-gold-500/20 bg-[#080808]/95 flex flex-col justify-between text-left"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-gradient-to-br from-gold-500/5 to-transparent opacity-10 rounded-full blur-2xl" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400">
                <Icon className={`w-4 h-4 ${item.id === "taste" ? "rotate-[-45deg]" : ""}`} />
              </div>
              <div>
                <span className="text-[8px] font-bold text-gold-500 uppercase tracking-wider block">
                  {item.subtitle}
                </span>
                <h4 className="text-sm font-bold text-white font-cinzel">
                  {item.title}
                </h4>
              </div>
            </div>

            <p className="text-white/75 text-xs font-light leading-relaxed">
              {item.detailedDesc}
            </p>
          </div>

          <div className="relative z-10 bg-white/[0.02] border border-white/5 rounded-xl p-3.5 space-y-2">
            <h5 className="text-[9px] uppercase tracking-wider text-gold-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Standards
            </h5>
            <ul className="space-y-1.5">
              {item.metrics.map((metric, i) => (
                <li key={i} className="flex items-center gap-2 text-[10px] text-white/60 font-light">
                  <Star className="w-2.5 h-2.5 text-gold-500 shrink-0 fill-gold-500/20" />
                  <span className="truncate">{metric}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
