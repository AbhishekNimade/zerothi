"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Snail, Tractor, Sparkles, ChefHat, Heart } from "lucide-react";
import Image from "next/image";

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
    image: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "2. Precision Slicing",
    subtitle: "Crafted Thinness",
    description: "Using customized slicing machinery, the bananas are cut to precise, micro-thin specifications to ensure a perfectly consistent, uniform crunch in every bite.",
    icon: Snail,
    image: "https://images.unsplash.com/photo-1596541223130-5d56a73fb846?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "3. Preservative-Free Frying",
    subtitle: "Health-First Methods",
    description: "Slices are cooked in pure, machine-refined oils with zero trans fat, zero artificial preservatives, and zero coloring agents to lock in natural flavor.",
    icon: ChefHat,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "4. Aromatic Spicing",
    subtitle: "Authentic Regional Blends",
    description: "Our chips are blended with high-grade, local Nimar masalas, dry mango powder, and natural spices, ensuring an unadulterated, bold regional taste.",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1600189020840-e9cb18566c90?q=80&w=600&auto=format&fit=crop"
  },
  {
    title: "5. Safe Packaging",
    subtitle: "Traceable & Sealed",
    description: "Each package undergoes strict quality checks, flushed with nitrogen to preserve crispness, and carries full traceability back to the harvesting farm.",
    icon: Heart,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d20?q=80&w=600&auto=format&fit=crop"
  }
];

export default function AboutPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <main className="min-h-screen bg-black pt-20 overflow-hidden selection:bg-gold-500/30 selection:text-gold-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-28 bg-gradient-to-b from-black via-gold-950/10 to-black border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10">
            <span className="text-gold-300 text-xs font-semibold tracking-[0.2em] uppercase">Brand Genesis</span>
          </div>
          <h1 className="font-cinzel text-5xl md:text-7xl font-bold text-white mb-6">
            The <span className="text-gradient-gold">Zerothi</span> Journey
          </h1>
          <p className="text-sm md:text-base text-white/70 font-light leading-relaxed max-w-2xl mx-auto tracking-wide">
            From the fertile soils of Nimar to your taste buds. Zerothi was born from a simple idea: to deliver the authentic regional flavors of Madhya Pradesh to modern homes with absolute honesty and consistency.
          </p>
        </div>
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      </section>

      {/* Interactive Y-Leaf Journey Steps */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">How it is made</span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-4">From Farm to Taste</h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto rounded-full"></div>
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
                className="glass-card rounded-2xl overflow-hidden border border-white/10 bg-[#070707] h-full flex flex-col md:flex-row"
              >
                {/* Step Image */}
                <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative min-h-[250px] bg-neutral-950">
                  <Image
                    src={TIMELINE_STEPS[activeStep].image}
                    alt={TIMELINE_STEPS[activeStep].title}
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                </div>

                {/* Step Text */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
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

      {/* Vision & Mission Cards */}
      <section className="py-24 bg-[#040404] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="glass-card p-10 rounded-2xl border border-white/5 bg-black/40 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gold-500" />
              <h2 className="font-cinzel text-2xl text-gold-400 font-bold tracking-wider mb-4">Our Vision</h2>
              <p className="text-white/70 leading-relaxed font-light text-xs tracking-wide">
                Zerothi was founded with a vision to bring the taste of the Nimar region to modern consumers while creating meaningful impact for local communities connected to its roots. We are building a system to deliver reliable, honest food at scale.
              </p>
            </div>
            
            <div className="glass-card p-10 rounded-2xl border border-white/5 bg-black/40 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gold-500" />
              <h2 className="font-cinzel text-2xl text-gold-400 font-bold tracking-wider mb-4">Our Mission</h2>
              <p className="text-white/70 leading-relaxed font-light text-xs tracking-wide">
                Nimad is known for its rich agricultural heritage, hardworking farmers, and traditional food culture. Zerothi was created to bridge the market gap — by delivering authentic, unadulterated products that truly represent the soil, people, and traditions of Nimad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">Leadership team</span>
          <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-4">Meet The Founders</h2>
          <div className="w-16 h-0.5 bg-gold-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Yash Patidar */}
          <div className="glass-card p-8 rounded-2xl border border-white/5 hover:border-gold-500/20 bg-black/40 text-center transition-all group hover:-translate-y-1">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <span className="font-cinzel text-xl text-black font-bold">YP</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Yash Patidar</h3>
            <p className="text-gold-500 text-[10px] uppercase font-bold tracking-widest mb-4">Co-Founder</p>
            <p className="text-white/60 font-light text-xs leading-relaxed tracking-wide">
              With a background in B.Tech in IT and 7+ years of corporate experience, Yash handles operations, builds structured workflows, and executes growth strategies.
            </p>
          </div>

          {/* Mayank Chouhan */}
          <div className="glass-card p-8 rounded-2xl border border-white/5 hover:border-gold-500/20 bg-black/40 text-center transition-all group hover:-translate-y-1">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <span className="font-cinzel text-xl text-black font-bold">MC</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Mayank Chouhan</h3>
            <p className="text-gold-500 text-[10px] uppercase font-bold tracking-widest mb-4">Co-Founder</p>
            <p className="text-white/60 font-light text-xs leading-relaxed tracking-wide">
              An MBA professional with an entrepreneurial mindset, Mayank specializes in strategic business development, identifying market gaps, and transforming regional favorites into modern brands.
            </p>
          </div>

          {/* Abhishek Gowasami */}
          <div className="glass-card p-8 rounded-2xl border border-white/5 hover:border-gold-500/20 bg-black/40 text-center transition-all group hover:-translate-y-1">
            <div className="w-20 h-20 bg-gradient-to-br from-gold-400 to-gold-700 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <span className="font-cinzel text-xl text-black font-bold">AG</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Abhishek Gowasami</h3>
            <p className="text-gold-500 text-[10px] uppercase font-bold tracking-widest mb-4">Head – Agro Operations</p>
            <p className="text-white/60 font-light text-xs leading-relaxed tracking-wide">
              Agro professional with 10+ years of crop planning and field execution experience. Optimizes farming processes to support regional farming communities.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
