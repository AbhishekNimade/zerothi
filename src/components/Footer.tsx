import { Mail, MapPin } from "lucide-react";
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
                src="/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png" 
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
                <span>Barwani, Madhya Pradesh, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-500" />
                <a href="mailto:support@zerothi.com" className="hover:text-gold-400 transition-colors">support@zerothi.com</a>
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
              {/* Instagram — real gradient brand icon */}
              <a
                href="https://www.instagram.com/zerothi_nimar?igsh=OWR3d2FsazI0MXhh&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow us on Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all group relative overflow-hidden hover:scale-110"
                style={{ background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)" }}
              >
                <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn — real brand icon */}
              <a
                href="https://www.linkedin.com/company/zerothi/"
                target="_blank"
                rel="noopener noreferrer"
                title="Connect on LinkedIn"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "#0A66C2" }}
              >
                <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
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
