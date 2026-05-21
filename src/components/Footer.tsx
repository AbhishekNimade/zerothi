import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-16 pb-8 selection:bg-gold-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block mb-2">
              <Image 
                src="/logo.png" 
                alt="Zerothi Logo" 
                width={240} 
                height={100} 
                className="h-16 md:h-20 w-auto object-contain scale-110 md:scale-125 origin-left"
              />
            </Link>
            <p className="text-white/50 text-xs font-light leading-relaxed">
              Bringing traditional purity from the heart of Nimar, Madhya Pradesh to modern homes. Empowering women, supporting local farmers, and executing zero compromise on quality.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-sm text-gold-400 font-bold uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col space-y-2 text-xs text-white/60">
              <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
              <Link href="/about" className="hover:text-gold-400 transition-colors">Our Story</Link>
              <Link href="/products" className="hover:text-gold-400 transition-colors">Shop Products</Link>
              <Link href="/contact" className="hover:text-gold-400 transition-colors">Contact Us</Link>
              <Link href="/orders" className="hover:text-gold-400 transition-colors">My Orders</Link>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-sm text-gold-400 font-bold uppercase tracking-wider">Contact Info</h4>
            <div className="flex flex-col space-y-3 text-xs text-white/60">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-500" />
                <span>Nimar Region, Madhya Pradesh, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-500" />
                <span>support@zerothi.com</span>
              </div>
            </div>
          </div>

          {/* Follow Us */}
          <div className="space-y-3">
            <h4 className="font-cinzel text-sm text-gold-400 font-bold uppercase tracking-wider">Follow Our Journey</h4>
            <p className="text-white/40 text-[11px] font-light">
              Connect with us on social media for Nimar harvesting updates and new product rollouts.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-gold-500 hover:text-black transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-gold-500 hover:text-black transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-gold-500 hover:text-black transition-all">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center flex flex-col sm:flex-row justify-between items-center text-[10px] text-white/40 font-light gap-4">
          <p>© {new Date().getFullYear()} ZEROTHI Food Brand. All Rights Reserved.</p>
          <p>Rooted in Farming • Crafted with Honesty • Made for Real Taste</p>
        </div>
      </div>
    </footer>
  );
}
