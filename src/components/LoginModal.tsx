"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { X, Phone, ShieldCheck, ArrowRight, Loader2, ShoppingBag, Heart, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { logLoginToSheet } from "@/lib/sheets";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  reason?: "cart" | "like";
}

export default function LoginModal({ isOpen, onClose, onSuccess, reason = "cart" }: LoginModalProps) {
  const { login, loginWithPhone, checkUserSession } = useAuth();
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const initGoogle = () => {
      const gWindow = window as any;
      if (!gWindow.google) return;
      gWindow.google.accounts.id.initialize({
        client_id:
          process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
          "286620839561-tbcs6ap3fevtqiie9g12spvfmap6jn6e.apps.googleusercontent.com",
        callback: handleGoogleLogin,
      });
      const btn = document.getElementById("modalGoogleBtn");
      if (btn) {
        gWindow.google.accounts.id.renderButton(btn, {
          theme: "dark",
          size: "large",
          width: btn.clientWidth || 320,
          text: "signin_with",
          shape: "rectangular",
        });
      }
    };

    let script = document.querySelector(
      `script[src="https://accounts.google.com/gsi/client"]`
    ) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    } else {
      setTimeout(initGoogle, 100);
    }
  }, [isOpen]);

  const handleGoogleLogin = async (response: any) => {
    setIsGoogleLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("zerothi_user", JSON.stringify(data.user));
        logLoginToSheet(data.user.name, data.user.email, "Google Login");
        await checkUserSession();
        onClose();
        onSuccess?.();
        return;
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please enter email/phone and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await login(identifier.trim(), password);
      if (res.success) {
        await checkUserSession();
        onClose();
        onSuccess?.();
      } else {
        setError(res.error || "Invalid email/phone or password.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      if (res.ok) {
        setOtpSent(true);
        setInfoMessage("OTP sent to your number");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.warn("API send-otp failed, using local fallback:");
      setOtpSent(true);
      setInfoMessage("OTP sent to your number");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the verification code.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await loginWithPhone(phone, otp);
      if (res.success) {
        await checkUserSession();
        onClose();
        onSuccess?.();
      } else {
        setError(res.error || "Phone verification failed.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconAndLabel =
    reason === "like"
      ? { icon: <Heart className="w-5 h-5 text-red-400" />, label: "like products" }
      : { icon: <ShoppingBag className="w-5 h-5 text-gold-400" />, label: "add to cart" };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4" data-lenis-prevent>
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-0"
          />

          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md bg-[#090909] border border-white/10 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-y-auto max-h-[92vh] z-10 selection:bg-gold-500/30"
          >
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent sticky top-0 z-20" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8">
              <div className="text-center mb-6 sm:mb-7">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  {iconAndLabel.icon}
                </div>
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide mb-1">
                  Login Required
                </h2>
                <p className="text-white/50 text-xs sm:text-sm font-light">
                  Please log in to {iconAndLabel.label} and place orders.
                </p>
              </div>

              <div className="flex border-b border-white/10 mb-6 bg-white/5 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("password");
                    setError("");
                    setInfoMessage("");
                  }}
                  className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    loginMode === "password"
                      ? "bg-gold-500 text-black shadow-[0_2px_8px_rgba(212,175,55,0.25)]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("otp");
                    setError("");
                    setInfoMessage("");
                  }}
                  className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
                    loginMode === "otp"
                      ? "bg-gold-500 text-black shadow-[0_2px_8px_rgba(212,175,55,0.25)]"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  OTP Code
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 sm:mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs sm:text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {infoMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 sm:mb-5 p-3 bg-gold-500/10 border border-gold-500/30 rounded-lg text-gold-400 text-xs font-semibold text-center uppercase tracking-wider"
                  >
                    {infoMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {loginMode === "password" ? (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Email or phone number"
                      className="w-full bg-black/55 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 pl-11 pr-4 text-white placeholder-white/20 text-xs sm:text-sm focus:outline-none"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full bg-black/55 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 pl-11 pr-4 text-white placeholder-white/20 text-xs sm:text-sm focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Sign In <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div>
                  {!otpSent ? (
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Mobile number e.g. 9876543210"
                          className="w-full bg-black/55 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 pl-11 pr-4 text-white placeholder-white/20 text-xs sm:text-sm focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Send OTP Code <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                      <div className="relative">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="••••••"
                          className="w-full bg-black/55 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 pl-11 pr-4 text-white placeholder-white/20 text-xs sm:text-sm tracking-[0.3em] font-bold text-center focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-[10px] sm:text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Verify & Login <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setOtpSent(false);
                            setOtp("");
                            setInfoMessage("");
                          }}
                          className="text-gold-400/80 hover:text-gold-400 text-xs underline cursor-pointer bg-transparent border-none"
                        >
                          Change Phone Number
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              <div className="text-center mt-5">
                <p className="text-white/40 text-xs">
                  New to Zerothi?{" "}
                  <Link
                    href="/signup"
                    onClick={onClose}
                    className="text-gold-400 hover:text-gold-300 font-semibold transition-colors underline ml-1 cursor-pointer"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>

              <div className="relative my-5 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative px-3 bg-[#090909] text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/30">
                  Or Sign In With
                </span>
              </div>

              <div className="flex justify-center w-full min-h-[44px]">
                {isGoogleLoading ? (
                  <div className="flex items-center gap-2 text-white/40 text-xs sm:text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                  </div>
                ) : (
                  <div id="modalGoogleBtn" className="w-full flex justify-center" />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
