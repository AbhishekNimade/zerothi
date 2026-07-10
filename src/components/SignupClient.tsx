"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, User, Mail, Phone, Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupClient() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate inputs
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    try {
      const res = await register(fullName, email.trim(), password, cleanPhone);
      if (res.success) {
        router.push(redirect);
        router.refresh();
      } else {
        setError(res.error || "Registration failed. Please check your details.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
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

      <div className="relative z-10 w-full max-w-lg mx-auto px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 bg-black/60 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          <div className="text-center mb-8">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
              Create <span className="text-gradient-gold">Account</span>
            </h2>
            <p className="text-white/60 text-sm mt-2 font-light">
              Register now to place orders and track shipment updates
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

          <form onSubmit={handleSignup} className="space-y-5">
            {/* First & Last Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white/80 text-xs font-semibold uppercase tracking-wider block">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 text-sm focus:outline-none"
                    placeholder="John"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/80 text-xs font-semibold uppercase tracking-wider block">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 text-sm focus:outline-none"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email field */}
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
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
            </div>

            {/* Phone field */}
            <div className="space-y-2">
              <label className="text-white/80 text-xs font-semibold uppercase tracking-wider block">
                Mobile Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 text-sm focus:outline-none"
                  placeholder="e.g. 9876543210"
                  required
                />
              </div>
            </div>

            {/* Password & Confirm row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-white/80 text-xs font-semibold uppercase tracking-wider block">
                  Password
                </label>
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

              <div className="space-y-2">
                <label className="text-white/80 text-xs font-semibold uppercase tracking-wider block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 text-sm focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 relative py-4 bg-gold-500 text-black font-bold uppercase tracking-widest text-xs overflow-hidden transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 rounded-lg cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Register Now <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-white/40 text-xs">
              Already have an account?{" "}
              <Link
                href={redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}
                className="text-gold-400 hover:text-gold-300 font-semibold transition-colors underline ml-1 cursor-pointer"
              >
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
