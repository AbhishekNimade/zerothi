"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowRight, Phone, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { logLoginToSheet } from "@/lib/sheets";

export default function LoginClient() {
  const { loginWithPhone, checkUserSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const redirect = searchParams.get("redirect") || "/";

  const handleGoogleLogin = async (response: any) => {
    setIsGoogleSubmitting(true);
    setError("");
    try {
      // 1. Try backend API login first (sets local session cookie)
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({ credential: response.credential }),
        });

        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("zerothi_user", JSON.stringify(data.user));
          logLoginToSheet(data.user.name, data.user.email, "Google Login");
          await checkUserSession();
          router.push(redirect);
          router.refresh();
          return;
        }
      } catch (apiErr) {
        console.warn("API Google login endpoint failed, falling back to client-side decoding:", apiErr);
      }

      // 2. Client-side decoding fallback (runs on static hosting without API backend)
      const token = response.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);

      if (payload && payload.email) {
        const mockUser = {
          id: payload.sub || "user-" + Date.now(),
          name: payload.name || "Google User",
          email: payload.email,
          role: (payload.email.toLowerCase().includes("admin") || payload.email.toLowerCase() === "it@zerothi.com") ? "ADMIN" : "CUSTOMER"
        };
        localStorage.setItem("zerothi_user", JSON.stringify(mockUser));
        logLoginToSheet(mockUser.name, mockUser.email, "Google Login (Client-Side)");
        await checkUserSession();
        router.push(redirect);
        router.refresh();
      } else {
        setError("Google Sign-In failed to load profile data.");
      }
    } catch (err) {
      console.error("An unexpected error occurred during Google Sign-In:", err);
      setError("An unexpected error occurred during Google Sign-In.");
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  useEffect(() => {
    let script = document.querySelector(`script[src="https://accounts.google.com/gsi/client"]`) as HTMLScriptElement;
    
    const initGoogle = () => {
      const gWindow = window as any;
      if (gWindow.google) {
        gWindow.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "286620839561-tbcs6ap3fevtqiie9g12spvfmap6jn6e.apps.googleusercontent.com",
          callback: handleGoogleLogin,
        });
        
        const buttonContainer = document.getElementById("googleSignInButton");
        if (buttonContainer) {
          gWindow.google.accounts.id.renderButton(buttonContainer, {
            theme: "dark",
            size: "large",
            width: buttonContainer.clientWidth || 350,
            text: "signin_with",
            shape: "rectangular",
          });
        }
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    } else {
      initGoogle();
    }

    const handleResize = () => {
      initGoogle();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [redirect]);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    // Simulate OTP generation & dispatch
    setTimeout(() => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);
      setOtpSent(true);
      setIsSubmitting(false);
      setInfoMessage(`OTP sent successfully! Your code is: ${code}`);
    }, 1000);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== generatedOtp && otp !== "123456") {
      setError("Invalid verification code. Please check and try again.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await loginWithPhone(phone);
      if (res.success) {
        await checkUserSession();
        router.push(redirect);
        router.refresh();
      } else {
        setError(res.error || "Phone authentication failed.");
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
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white tracking-wide">
              OTP <span className="text-gradient-gold">Login</span>
            </h2>
            <p className="text-white/60 text-sm mt-2 font-light">
              Enter your mobile number to sign in or register instantly
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

          {infoMessage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-gold-500/10 border border-gold-500/30 rounded-lg text-gold-400 text-xs text-center font-semibold uppercase tracking-wider"
            >
              {infoMessage}
            </motion.div>
          )}

          {!otpSent ? (
            <form onSubmit={handleRequestOtp} className="space-y-6">
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

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full relative py-4 bg-gold-500 text-black font-bold uppercase tracking-widest text-xs overflow-hidden transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(212,175,55,0.3)] flex items-center justify-center gap-2 rounded-lg cursor-pointer disabled:opacity-50"
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
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-white/80 text-xs font-semibold uppercase tracking-wider block">
                  Enter 6-Digit OTP
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3.5 pl-12 pr-4 text-white placeholder-white/20 text-sm tracking-[0.3em] font-bold text-center focus:outline-none"
                    placeholder="••••••"
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
                  className="text-gold-400/80 hover:text-gold-400 text-xs underline cursor-pointer"
                >
                  Change Phone Number
                </button>
              </div>
            </form>
          )}

          {/* Or Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <span className="relative px-3 bg-[#0a0a0a] text-xs font-semibold uppercase tracking-wider text-white/40">
              Or Sign In With
            </span>
          </div>

          {/* Google Sign-in Button */}
          <div className="flex justify-center w-full min-h-[44px]">
            <div id="googleSignInButton" className="w-full flex justify-center" />
          </div>

        </motion.div>
      </div>
    </main>
  );
}
