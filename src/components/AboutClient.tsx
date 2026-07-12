"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Snail, Tractor, Sparkles, ChefHat, Heart, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TimelineStep {
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  image: string;
}

const TIMELINE_STEPS: TimelineStep[] = [
  {
    title: "1. Yield Sourcing",
    subtitle: "Direct From Nimar Farms",
    description: "Our raw materials, including fresh Nimar bananas and dairy fats, are carefully selected directly from local farmers in Nimar, ensuring fair trade and absolute freshness.",
    icon: Tractor,
    image: "/yield-sourcing-bananas.png"
  },
  {
    title: "2. Precision Slicing",
    subtitle: "Crafted Thinness",
    description: "Using customized slicing machinery, the bananas are cut to precise, micro-thin specifications to ensure a perfectly consistent, uniform crunch in every bite.",
    icon: Snail,
    image: "https://images.unsplash.com/photo-1528825871115-3581a5387919?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "3. Preservative-Free Frying",
    subtitle: "Health-First Methods",
    description: "Slices are cooked in pure, machine-refined oils with zero trans fat, zero artificial preservatives, and zero coloring agents to lock in natural flavor.",
    icon: ChefHat,
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "4. Aromatic Spicing",
    subtitle: "Authentic Regional Blends",
    description: "Our chips are blended with high-grade, local Nimar masalas, dry mango powder, and natural spices, ensuring an unadulterated, bold regional taste.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "5. Safe Packaging",
    subtitle: "Traceable & Sealed",
    description: "Each package undergoes strict quality checks, flushed with nitrogen to preserve crispness, and carries full traceability back to the harvesting farm.",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop"
  }
];

const FOUNDERS = [
  {
    initials: "YP",
    name: "Yash Patidar",
    role: "Co-Founder",
    roleColor: "from-gold-400 to-amber-500",
    bio: "With a background in B.Tech in IT and 7+ years of corporate experience, Yash handles operations, builds structured workflows, and executes growth strategies. His deep understanding of technology and systematic thinking drives Zerothi's operational excellence from farm procurement to final delivery.",
    tags: ["Operations", "Growth Strategy", "Technology"],
    quote: "We're not just selling chips — we're preserving a way of life from Nimar that deserves to reach every home in India.",
  },
  {
    initials: "MC",
    name: "Mayank Chouhan",
    role: "Co-Founder",
    roleColor: "from-gold-400 to-amber-500",
    bio: "An MBA professional with an entrepreneurial mindset, Mayank specializes in strategic business development, identifying market gaps, and transforming regional favorites into modern brands. His vision is the backbone of Zerothi's growth roadmap across retail and D2C channels.",
    tags: ["Business Development", "Brand Strategy", "Market Research"],
    quote: "Nimar's agricultural wealth has always been there. Zerothi is simply the bridge that brings it honestly to modern consumers.",
  },
  {
    initials: "AG",
    name: "Abhishek Gowasami",
    role: "Head – Agro Operations",
    roleColor: "from-emerald-400 to-teal-500",
    bio: "Agro professional with 10+ years of crop planning and field execution experience. Abhishek optimizes farming processes, coordinates with local farming communities, and ensures every batch sourced meets Zerothi's uncompromising purity standards — from soil to shelf.",
    tags: ["Agro Operations", "Crop Planning", "Field Execution"],
    quote: "Quality begins in the soil. Every banana we source, every batch we approve, goes through the same scrutiny as if it were for my own family.",
  },
];

const ADVISORS = [
  {
    initials: "VM",
    name: "Vinod Malaviya",
    role: "Adviser",
    domain: "Energy & Infrastructure",
    image: "/director/team-vinod-sir.webp",
    description: "Transforming India's water future, and now its energy future. With an esteemed career in water treatment and environmental services as the co-founder of Shubham Hydrosys, Vinod brings 18+ years of high-level project governance, operations, and large-scale infrastructure expertise. Today, he translates those decades of execution into building scalable, reliable solar systems and clean energy frameworks across Madhya Pradesh.",
  },
];

export default function AboutClient() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main className="min-h-screen bg-black pt-20 overflow-hidden selection:bg-gold-500/30 selection:text-gold-300">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative py-28 bg-gradient-to-b from-black via-gold-950/10 to-black border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 md:gap-x-6">
            <span>Our</span>
            <span className="relative inline-block w-[40px] sm:w-[55px] md:w-[75px] h-[40px] sm:h-[55px] md:h-[75px] align-middle hover:scale-110 transition-transform duration-300">
              <Image
                src="/Logo%20Zerothi/Leaf%20logo.png"
                alt="Zerothi Leaf"
                fill
                className="object-contain"
                priority
              />
            </span>
            <span>Journey</span>
          </h1>
          <p className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-2xl mx-auto tracking-wide">
            From the fertile soils of Nimar to your taste buds. Zerothi was born from a simple idea: to deliver the authentic regional flavors of Madhya Pradesh to modern homes with absolute honesty and consistency.
          </p>
        </div>
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      </section>

      {/* ── About Zerothi — Redesigned Card Layout ── */}
      <section
        id="about-zerothi"
        aria-label="About Zerothi"
        className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/5"
      >
        <div className="mb-12">
          <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">Brand Overview</span>
          <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white">About Zerothi</h2>
          <div className="w-12 h-0.5 bg-gold-500 mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* What Zerothi is */}
          <div className="glass-card p-7 rounded-2xl border border-white/8 bg-black/40 hover:border-gold-500/20 transition-all duration-300 group">
            <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
              <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-2">What is Zerothi?</h3>
            <p className="text-white/70 text-sm font-light leading-relaxed">
              Zerothi is a regional food brand based in Barwani, Madhya Pradesh, India. The company produces and sells traditional food products sourced from the Nimar agricultural belt — a fertile region along the Narmada River in western Madhya Pradesh known for banana cultivation, dairy farming, and oilseed crops.
            </p>
          </div>

          {/* What it sells */}
          <div className="glass-card p-7 rounded-2xl border border-white/8 bg-black/40 hover:border-gold-500/20 transition-all duration-300 group">
            <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
              <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-2">What does Zerothi sell?</h3>
            <p className="text-white/70 text-sm font-light leading-relaxed">
              Zerothi sells banana chips (in Salted, Tomato, Peri-Peri, and Pudina flavors), pure cow ghee made by the traditional bilona/granular curd churning method, and cold-pressed wood-pressed oils including groundnut and coconut varieties. All products are manufactured without artificial preservatives, trans fats, or synthetic color agents.
            </p>
          </div>

          {/* Where it&apos;s based */}
          <div className="glass-card p-7 rounded-2xl border border-white/8 bg-black/40 hover:border-gold-500/20 transition-all duration-300 group">
            <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
              <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-2">Where is Zerothi based?</h3>
            <p className="text-white/70 text-sm font-light leading-relaxed">
              Zerothi&apos;s operations are headquartered in Barwani, Madhya Pradesh, India (PIN 451551). Raw materials are sourced directly from farmers in the Nimar region. Products are sold online via zerothi.com and ship to customers across India.
            </p>
          </div>

          {/* Sourcing story */}
          <div className="glass-card p-7 rounded-2xl border border-white/8 bg-black/40 hover:border-gold-500/20 transition-all duration-300 group">
            <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
              <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
            </div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-2">Sourcing and production</h3>
            <p className="text-white/70 text-sm font-light leading-relaxed">
              Zerothi procures raw materials — including fresh Nimar bananas, cow milk, and groundnut/coconut seeds — directly from local farming families through fair-trade agreements. Processing and packaging is carried out by women-led self-help collectives (SHGs) in Barwani. Each product batch is nitrogen-flushed before sealing to preserve freshness without refrigeration.
            </p>
          </div>

          {/* Differentiation - full width */}
          <div className="md:col-span-2 glass-card p-7 rounded-2xl border border-white/8 bg-black/40 hover:border-gold-500/20 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold-400 to-amber-600 rounded-l-2xl" />
            <div className="pl-4">
              <div className="w-9 h-9 rounded-lg bg-gold-500/10 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                <svg className="w-4 h-4 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
              </div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-500 mb-2">What differentiates Zerothi from other brands?</h3>
              <p className="text-white/70 text-sm font-light leading-relaxed">
                Unlike mass-produced food brands, Zerothi maintains full farm-to-shelf traceability: each batch is linked to a specific sourcing farm in Nimar. Products contain zero artificial preservatives, zero trans fat, and zero artificial coloring agents. The brand uses traditional methods — such as the bilona churning process for ghee and the wooden ghani press for oils — that are largely absent in commercial-scale food manufacturing. The business model directly benefits farming families and women&apos;s collectives in a Tier-3 district of Madhya Pradesh.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── Farm-to-Taste Journey ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">How it is made</span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-4">From Farm to Taste</h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto rounded-full" />
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-stretch">
          {/* Navigation Sidebar */}
          <div className="w-full lg:w-1/3 flex flex-col gap-3 justify-center">
            {TIMELINE_STEPS.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = activeStep === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-5 rounded-xl border flex items-center gap-4 transition-all focus:outline-none cursor-pointer ${
                    isActive
                      ? "bg-gold-500/10 border-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                      : "bg-black/40 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? "bg-gold-500 text-black" : "bg-white/5 text-white/60"
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-xs uppercase font-bold tracking-wider ${isActive ? "text-gold-400" : "text-white/40"}`}>
                      Step 0{index + 1}
                    </h4>
                    <p className="text-white font-medium text-sm mt-0.5">{step.title.split(". ")[1]}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Detail Card */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-card rounded-2xl overflow-hidden border border-white/10 bg-[#070707] h-full flex flex-col"
              >
                <div className="p-8 md:p-12 flex flex-col justify-center flex-1">
                  <span className="text-[10px] font-bold text-gold-500 tracking-[0.2em] uppercase">
                    {TIMELINE_STEPS[activeStep].subtitle}
                  </span>
                  <h3 className="font-cinzel text-2xl font-bold text-white mt-2 mb-4">
                    {TIMELINE_STEPS[activeStep].title}
                  </h3>
                  <p className="text-white/70 text-xs font-light leading-relaxed tracking-wide">
                    {TIMELINE_STEPS[activeStep].description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission — 3D Animated Cards ── */}
      <section className="py-28 bg-[#040404] border-y border-white/5 overflow-hidden relative">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">What drives us</span>
            <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-4">Vision & Mission</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              whileHover={{ y: -8, rotateY: 3, scale: 1.015, transition: { duration: 0.35 } }}
              style={{ transformStyle: "preserve-3d", perspective: 800 }}
              className="relative group"
            >
              <div className="glass-card p-10 rounded-2xl border border-white/5 bg-black/60 relative overflow-hidden h-full"
                   style={{ backdropFilter: "blur(20px)" }}>
                {/* Animated gold border accent */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-700 rounded-l-2xl" />
                {/* Corner glow */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold-500/8 rounded-full blur-2xl group-hover:bg-gold-500/15 transition-all duration-500" />

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-700/10 border border-gold-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                <span className="text-[9px] font-bold text-gold-500/70 uppercase tracking-[0.3em] block mb-2">Our Vision</span>
                <h2 className="font-cinzel text-2xl text-white font-bold tracking-wider mb-5">
                  Building Honest Food at Scale
                </h2>
                <p className="text-white/65 leading-relaxed font-light text-sm tracking-wide">
                  Zerothi was founded with a vision to bring the authentic taste of the Nimar region to modern consumers, while creating meaningful impact for local farming communities connected to their roots. We are building a transparent food system that delivers reliable, honest, and traceable products at national scale.
                </p>

                {/* Bottom metric */}
                <div className="mt-8 pt-6 border-t border-white/5 flex gap-8">
                  <div>
                    <p className="text-gold-400 font-bold text-lg">100%</p>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider">Transparent Sourcing</p>
                  </div>
                  <div>
                    <p className="text-gold-400 font-bold text-lg">Zero</p>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider">Artificial Additives</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              whileHover={{ y: -8, rotateY: -3, scale: 1.015, transition: { duration: 0.35 } }}
              style={{ transformStyle: "preserve-3d", perspective: 800 }}
              className="relative group"
            >
              <div className="glass-card p-10 rounded-2xl border border-white/5 bg-black/60 relative overflow-hidden h-full"
                   style={{ backdropFilter: "blur(20px)" }}>
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-gold-400 via-gold-500 to-gold-700 rounded-l-2xl" />
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-gold-500/8 rounded-full blur-2xl group-hover:bg-gold-500/15 transition-all duration-500" />

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-700/10 border border-gold-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>

                <span className="text-[9px] font-bold text-gold-500/70 uppercase tracking-[0.3em] block mb-2">Our Mission</span>
                <h2 className="font-cinzel text-2xl text-white font-bold tracking-wider mb-5">
                  Bridge the Authenticity Gap
                </h2>
                <p className="text-white/65 leading-relaxed font-light text-sm tracking-wide">
                  Nimar is known for its rich agricultural heritage, hardworking farmers, and traditional food culture. Zerothi was created to bridge the market gap — by delivering authentic, unadulterated products that truly represent the soil, the people, and the traditions of Nimar — while empowering every farmer and woman in our supply chain.
                </p>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-8">
                  <div>
                    <p className="text-gold-400 font-bold text-lg">Nimar</p>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider">Agricultural Heritage</p>
                  </div>
                  <div>
                    <p className="text-gold-400 font-bold text-lg">D2C</p>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider">Direct to Consumer</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Meet the Founders — 1×1 Full-Width Grid ── */}
      <section className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">The people behind it</span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-4">Meet The Founders</h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto rounded-full" />
        </div>

        <div className="space-y-10">
          {FOUNDERS.map((founder, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.65, ease: "easeOut", delay: idx * 0.08 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/8 bg-[#080808] group hover:border-gold-500/20 transition-all duration-500 shadow-[0_8px_40px_rgba(0,0,0,0.5)]`}
              >
                {/* ── Image Side ── */}
                <div className={`relative min-h-[340px] lg:min-h-[420px] bg-neutral-950 flex items-center justify-center overflow-hidden ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  {/* 3D animated gradient background */}
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `conic-gradient(from 0deg, transparent 0%, #D4AF37 25%, transparent 50%, #D4AF37 75%, transparent 100%)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-gold-950/40 via-black/60 to-black/80" />

                  {/* Giant Initials Avatar */}
                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <motion.div
                      whileHover={{ scale: 1.05, rotateY: 8 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      style={{ transformStyle: "preserve-3d", perspective: 600 }}
                      className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${founder.roleColor} flex items-center justify-center shadow-[0_20px_60px_rgba(212,175,55,0.35),0_0_0_1px_rgba(212,175,55,0.2)] relative`}
                    >
                      <span className="font-cinzel text-5xl text-black font-black">{founder.initials}</span>
                      {/* Shine effect */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/25 via-transparent to-transparent" />
                    </motion.div>
                    <div className="text-center">
                      <p className="font-cinzel text-xl font-bold text-white">{founder.name}</p>
                      <p className="text-gold-500 text-[10px] uppercase font-bold tracking-widest mt-1">{founder.role}</p>
                    </div>
                  </div>

                  {/* Bottom blur overlay for transition */}
                  <div className={`absolute bottom-0 ${isEven ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r"} from-[#080808]/90 via-transparent to-transparent w-1/3 h-full pointer-events-none hidden lg:block`} />
                </div>

                {/* ── Detail Side ── */}
                <div className={`p-10 lg:p-14 flex flex-col justify-center space-y-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {founder.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.25em] block mb-1">{founder.role}</span>
                    <h3 className="font-cinzel text-3xl lg:text-4xl font-bold text-white">{founder.name}</h3>
                  </div>

                  <p className="text-white/65 text-sm font-light leading-relaxed tracking-wide">
                    {founder.bio}
                  </p>

                  {/* Pull Quote */}
                  <blockquote className="relative pl-5 border-l-2 border-gold-500/50">
                    <Quote className="w-4 h-4 text-gold-500/40 absolute -top-1 -left-2" />
                    <p className="text-white/50 text-xs font-light italic leading-relaxed">
                      "{founder.quote}"
                    </p>
                  </blockquote>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Leadership Advisory ── */}
      <section className="py-24 bg-[#040404] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">Guided by experience</span>
            <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-white mb-4">Leadership Advisory</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto rounded-full" />
          </div>

          <div className="flex justify-center">
            {ADVISORS.map((advisor, idx) => (
              <motion.div
                key={advisor.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="max-w-5xl w-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-[#080808] hover:border-gold-500/20 transition-all duration-500 shadow-[0_12px_50px_rgba(0,0,0,0.6)]">
                  
                  {/* ── Image Side (Framed Portrait) ── */}
                  <div className="relative bg-neutral-950 flex items-center justify-center p-8 sm:p-12 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-white/5">
                    {/* Animated gold backdrop glow */}
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 opacity-15 pointer-events-none"
                      style={{
                        background: `conic-gradient(from 0deg, transparent 0%, #D4AF37 30%, transparent 60%, #D4AF37 90%, transparent 100%)`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-gold-950/10 via-black/80 to-black pointer-events-none" />

                    {/* Centered Framed Image */}
                    {advisor.image ? (
                      <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:border-gold-500/30 transition-all duration-500 z-10">
                        <Image
                          src={advisor.image}
                          alt={advisor.name}
                          fill
                          className="object-cover opacity-95 group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Soft vignette overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center z-10">
                        <span className="font-cinzel text-4xl font-extrabold text-black">{advisor.initials}</span>
                      </div>
                    )}
                  </div>

                  {/* ── Detail Side ── */}
                  <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center space-y-6 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-400 to-amber-600 lg:hidden" />
                    
                    <div>
                      <span className="text-[10px] font-bold text-gold-500 tracking-[0.25em] uppercase block mb-1">
                        {advisor.domain}
                      </span>
                      <h3 className="font-cinzel text-3xl sm:text-4xl font-bold text-white tracking-wide">
                        {advisor.name}
                      </h3>
                      <p className="text-gold-400 text-xs font-bold uppercase tracking-[0.2em] mt-1.5">
                        {advisor.role}
                      </p>
                    </div>

                    <p className="text-white/65 text-sm sm:text-base font-light leading-relaxed tracking-wide">
                      {advisor.description}
                    </p>

                    {/* Professional highlights / tags */}
                    <div className="pt-6 border-t border-white/5 flex flex-wrap gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3.5 py-1.5 rounded-full">
                        18+ Years Governance
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3.5 py-1.5 rounded-full">
                        Water treatment (shubham hydrosys)
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3.5 py-1.5 rounded-full">
                        solar infrastructure (r-solar)
                      </span>
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
