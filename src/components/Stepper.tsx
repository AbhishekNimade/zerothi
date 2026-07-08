"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStep: number; // 1-indexed
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  // Goal Gradient Effect: Progress bar starts at a non-zero percentage.
  // E.g. if we are on step 2 of 4, the bar should fill up to 33.3% or 50%.
  // Let's compute progress percentage as: (currentStep - 1) / (steps.length - 1) * 100
  const progressPercent = steps.length > 1 
    ? ((currentStep - 1) / (steps.length - 1)) * 100 
    : 100;

  return (
    <div className="w-full py-6">
      {/* Progress Track and Bar */}
      <div className="relative flex justify-between items-center w-full">
        {/* Track Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 z-0" />
        
        {/* Filled Progress Line */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-gold-600 to-gold-400 origin-left z-0"
        />

        {/* Steps Nodes */}
        {steps.map((step, idx) => {
          const stepNumber = idx + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={idx} className="relative z-10 flex flex-col items-center">
              {/* Step Circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  borderColor: isActive || isCompleted ? "rgb(212,175,55)" : "rgba(255,255,255,0.1)",
                  backgroundColor: isCompleted 
                    ? "rgb(212,175,55)" 
                    : isActive 
                    ? "#000000" 
                    : "#0a0a0a"
                }}
                transition={{ duration: 0.3 }}
                className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${
                  isCompleted 
                    ? "text-black" 
                    : isActive 
                    ? "text-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                    : "text-white/40"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" strokeWidth={3} />
                ) : (
                  stepNumber
                )}
              </motion.div>

              {/* Step Label */}
              <span className={`absolute top-10 whitespace-nowrap text-[10px] uppercase font-bold tracking-widest transition-colors ${
                isActive ? "text-gold-400" : isCompleted ? "text-white/60" : "text-white/20"
              }`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
