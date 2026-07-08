"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("Please fill out all fields.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Simulate API submit latency
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black pt-20 overflow-hidden selection:bg-gold-500/30 selection:text-gold-300">
      <Navbar />

      {/* Header Banner */}
      <section className="relative py-20 bg-gradient-to-b from-black via-gold-950/5 to-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">Connect with us</span>
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white mb-4">
            Contact <span className="text-gradient-gold">Us</span>
          </h1>
          <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Have questions about bulk orders, regional distribution, or our Zerothi farming methods? Drop us a line.
          </p>
        </div>
      </section>

      {/* Contact Cards & Forms */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Details column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-card p-8 rounded-2xl border border-white/5 bg-black/40 space-y-6">
              <h3 className="font-cinzel text-xl font-bold text-white tracking-wide">Direct Channels</h3>
              <p className="text-white/50 text-xs font-light leading-relaxed">
                Connect with our agro operations or co-founders directly for business collaborations and order details.
              </p>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href="tel:+919425340003"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Call / WhatsApp</h5>
                    <p className="text-white text-sm font-semibold mt-0.5">+91 94253 40003</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:support@zerothi.com"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Email Inquiry</h5>
                    <p className="text-white text-sm font-semibold mt-0.5">support@zerothi.com</p>
                  </div>
                </a>

                {/* Origin Location — 3D hover pop-up + Maps link */}
                <a
                  href="https://maps.app.goo.gl/6h6pNwgWuoGbjH7X9?g_st=iw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-card flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-gold-500/40 transition-all group cursor-pointer"
                  style={{ transformStyle: "preserve-3d", transition: "transform 0.35s cubic-bezier(.25,.8,.25,1), box-shadow 0.35s ease, border-color 0.25s ease" }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "perspective(600px) rotateX(-6deg) rotateY(4deg) translateY(-6px) scale(1.03)";
                    el.style.boxShadow = "0 20px 40px -10px rgba(212,175,55,0.25), 0 8px 16px -4px rgba(0,0,0,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
                    el.style.boxShadow = "none";
                  }}
                  onMouseMove={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const cx = rect.width / 2;
                    const cy = rect.height / 2;
                    const rotateY = ((x - cx) / cx) * 8;
                    const rotateX = -((y - cy) / cy) * 6;
                    el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.03)`;
                    el.style.boxShadow = "0 20px 40px -10px rgba(212,175,55,0.25), 0 8px 16px -4px rgba(0,0,0,0.6)";
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 group-hover:bg-gold-500 group-hover:text-black transition-colors"
                    style={{ transition: "background 0.25s, color 0.25s, transform 0.35s" }}
                  >
                    <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Origin Location</h5>
                    <p className="text-white text-sm font-semibold mt-0.5">Nimar Region, Madhya Pradesh, India</p>
                  </div>
                  <span className="text-[9px] font-bold text-gold-500/60 uppercase tracking-widest group-hover:text-gold-400 transition-colors shrink-0">
                    View Map ↗
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 md:p-10 rounded-2xl border border-white/10 bg-black/50"
            >
              <h3 className="font-cinzel text-2xl font-bold text-white mb-6">Send A Message</h3>

              {submitted ? (
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <CheckCircle2 className="w-16 h-16 text-gold-400" />
                  <div>
                    <h4 className="text-lg font-bold text-white">Thank You!</h4>
                    <p className="text-white/60 text-xs mt-1 max-w-sm mx-auto">
                      Your query has been successfully received. A member of the Zerothi co-founding team will contact you shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 border border-white/10 hover:border-gold-500/50 text-white/60 hover:text-gold-400 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white/70 text-xs uppercase tracking-wider block font-medium">Your Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3 px-4 text-white placeholder-white/20 text-xs focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-white/70 text-xs uppercase tracking-wider block font-medium">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3 px-4 text-white placeholder-white/20 text-xs focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-white/70 text-xs uppercase tracking-wider block font-medium">Message Details</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      placeholder="Detail your request, batch inquiries or vendor proposals here..."
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-500 transition-colors rounded-lg py-3 px-4 text-white placeholder-white/20 text-xs focus:outline-none resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gold-500 hover:bg-gold-400 text-black font-bold uppercase tracking-widest text-xs transition-colors rounded-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    ) : (
                      <>
                        Send Message <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
