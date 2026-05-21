"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, Lock, Mail, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(res.error || "Invalid email or password.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden py-12 selection:bg-gold-500/30 selection:text-gold-300">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold-900/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gold-900/10 blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10 w-full max-w-md mx-auto px-4 mt-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 bg-black/60 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          <div className="text-center mb-8">
            <h2 className="font-cinzel text-3xl font-bold text-white tracking-wide">
              Welcome <span className="text-gradient-gold">Back</span>
            </h2>
            <p className="text-white/60 text-sm mt-2 font-light">
              Log in to order premium Nimar products
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white/80 text-xs font-semibold uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 text-sm focus:outline-none"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-white/80 text-xs font-semibold uppercase tracking-wider block">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 text-sm focus:outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full relative py-4 bg-gold-500 text-black font-bold uppercase tracking-widest text-xs overflow-hidden transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 rounded-lg cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Log In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6 text-sm text-white/40 font-light">
            Don't have an account?{" "}
            <Link 
              href={redirect !== "/" ? `/signup?redirect=${encodeURIComponent(redirect)}` : "/signup"} 
              className="text-gold-400 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </main>
    }>
      <LoginForm />
    </Suspense>
  );
}
