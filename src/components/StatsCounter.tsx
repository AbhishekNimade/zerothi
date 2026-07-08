"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
}

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    const duration = 1800; // 1.8 seconds animation duration
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      // Ease out quad formula for smooth decelerating animation
      const progress = frame / totalFrames;
      const easeProgress = progress * (2 - progress); 
      
      const current = Math.round(easeProgress * end);
      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, frameDuration);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span ref={ref} className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-marcellus text-mustard-500 shadow-sm block">
      {count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

export default function StatsCounter() {
  const stats = [
    { value: 150, suffix: "+", label: "Direct Sourced Farms" },
    { value: 2500, suffix: "+", label: "Happy Families Served" },
    { value: 25, suffix: "+", label: "Collectives Engaged" },
    { value: 100, suffix: "%", label: "Pure & Preservative-Free" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 py-16 px-6 max-w-7xl mx-auto text-center border-y border-white/5 bg-oatmeal-950/20 rounded-2xl my-16 shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
      {stats.map((stat, idx) => (
        <div key={idx} className="space-y-3 border-r last:border-r-0 border-white/5 max-md:border-r-0 max-md:even:border-l max-md:even:border-white/5">
          <Counter value={stat.value} suffix={stat.suffix} />
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/50 leading-relaxed max-w-[180px] mx-auto">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
