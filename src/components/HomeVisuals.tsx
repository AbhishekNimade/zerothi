"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles, Leaf, Droplet, ShieldCheck } from "lucide-react";

export default function HomeVisuals() {
  const { scrollY } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Calculate transforms for layered parallax floating ingredients
  const yLeaf = useTransform(scrollY, [0, 1000], [0, -180]);
  const yGhee = useTransform(scrollY, [0, 1500], [0, 120]);
  const yChili = useTransform(scrollY, [0, 1200], [0, -80]);
  const ySpice = useTransform(scrollY, [0, 1800], [0, 140]);

  // Rotations for extra 3D floating effect
  const rotateLeaf = useTransform(scrollY, [0, 1000], [0, 45]);
  const rotateSpice = useTransform(scrollY, [0, 1800], [0, -35]);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) return null;

  // Render static decoration or hide entirely on mobile to ensure smooth scrolling
  if (isMobile) {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-20">
        <div className="absolute top-[30%] -left-12 w-32 h-32 text-nimar-green-500/20">
          <Leaf className="w-full h-full transform -rotate-12" />
        </div>
        <div className="absolute top-[55%] -right-16 w-24 h-24 text-mustard-500/20">
          <Droplet className="w-full h-full transform rotate-45" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* 1. Floating Banana Leaf Segment (Parallax Layer 1) */}
      {!shouldReduceMotion && (
        <motion.div
          style={{ y: yLeaf, rotate: rotateLeaf }}
          className="absolute top-[30%] -left-12 w-32 h-32 text-nimar-green-500/20 opacity-40 md:opacity-60 lg:w-48 lg:h-48"
        >
          <Leaf className="w-full h-full transform -rotate-12" />
        </motion.div>
      )}

      {/* 2. Floating Golden Ghee Droplet (Parallax Layer 2) */}
      {!shouldReduceMotion && (
        <motion.div
          style={{ y: yGhee }}
          className="absolute top-[55%] -right-16 w-24 h-24 text-mustard-500/20 opacity-30 md:opacity-50 lg:w-36 lg:h-36"
        >
          <Droplet className="w-full h-full transform rotate-45" />
        </motion.div>
      )}

      {/* 3. Floating Spices Scatter (Parallax Layer 3) */}
      {!shouldReduceMotion && (
        <motion.div
          style={{ y: ySpice, rotate: rotateSpice }}
          className="absolute top-[80%] left-[8%] w-16 h-16 text-terracotta-500/20 opacity-30 lg:w-28 lg:h-28"
        >
          <Sparkles className="w-full h-full" />
        </motion.div>
      )}

      {/* 4. Sourcing Guarantee Badge Background Floating Layer */}
      {!shouldReduceMotion && (
        <motion.div
          style={{ y: yChili }}
          className="absolute top-[110%] right-[10%] w-20 h-20 text-nimar-green-500/10 opacity-30 lg:w-32 lg:h-32"
        >
          <ShieldCheck className="w-full h-full" />
        </motion.div>
      )}
    </div>
  );
}
