import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedProductsClient from "@/components/FeaturedProductsClient";
import CoreValues from "@/components/CoreValues";
import HomeVisuals from "@/components/HomeVisuals";
import PersonalizedBanner from "@/components/PersonalizedBanner";
import StatsCounter from "@/components/StatsCounter";
import { ArrowRight, Leaf, ShieldCheck, HeartHandshake } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zerothi | Authentic Nimar Banana Chips & Ghee",
  description: "Experience the authentic taste of Nimar with Zerothi. Handcrafted, preservative-free banana chips and pure cow ghee sourced directly from local Indian farms.",
  alternates: {
    canonical: "https://zerothi.com/",
  },
  openGraph: {
    title: "Zerothi | Authentic Nimar Banana Chips & Ghee",
    description: "Experience the authentic taste of Nimar with Zerothi. Handcrafted, preservative-free banana chips and pure cow ghee sourced directly from local Indian farms.",
    url: "https://zerothi.com/",
    siteName: "Zerothi",
    images: [
      {
        url: "https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
        width: 800,
        height: 600,
        alt: "Zerothi Nimar",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerothi | Authentic Nimar Banana Chips & Ghee",
    description: "Experience the authentic taste of Nimar with Zerothi. Handcrafted, preservative-free banana chips and pure cow ghee sourced directly from local Indian farms.",
    images: ["https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png"],
  },
};

export default async function Home() {
  // Fetch featured products from the SQLite database
  let featuredProducts: any[] = [];
  try {
    featuredProducts = await db.product.findMany({
      where: { isFeatured: true },
      take: 4,
    });
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
  }

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Zerothi",
    "image": "https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
    "@id": "https://zerothi.com/#localbusiness",
    "url": "https://zerothi.com/",
    "telephone": "+919425340003",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "490, B Block, Sneh Nagar",
      "addressLocality": "Barwani",
      "addressRegion": "Madhya Pradesh",
      "postalCode": "451551",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.0305,
      "longitude": 74.8986
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    },
    "sameAs": [
      "https://www.instagram.com/zerothi_nimar/"
    ]
  };

  return (
    <main className="min-h-screen bg-oatmeal-950 selection:bg-mustard-500/30 selection:text-mustard-300 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <Navbar />
      <PersonalizedBanner />
      <HomeVisuals />
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col pt-20">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-oatmeal-950/60 to-oatmeal-950 z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596541223130-5d56a73fb846?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-25 blur-[1px]" />
        </div>

        {/* Hero Content — centred in remaining space */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto w-full pb-20">
          <div className="mb-6 select-none flex items-center justify-center pt-6">
            <Image 
              src="/Logo%20Zerothi/Medium%20Logo%20Zerothi%20without%20test%20or%20nimar-04.png" 
              alt="Zerothi Logo" 
              width={560} 
              height={560} 
              className="h-44 sm:h-52 md:h-60 lg:h-72 w-auto object-contain mx-auto"
              priority
            />
          </div>
          
          <h1 className="heading-xl text-white mb-6 uppercase tracking-wider">
            The Taste of <span className="text-gradient-mustard">Nimar</span>
          </h1>
          
          <p className="body-l max-w-2xl mx-auto mb-10">
            Traditional purity from Nimad, Madhya Pradesh. Empowering local women-led craftsmanship and supporting farming families with zero compromise on quality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center">

            {/* ── Explore Our Story ── */}
            <Link href="/about">
              <button className="
                group relative px-10 py-[14px]
                border border-terracotta-500/40 text-terracotta-400
                font-bold text-[11px] tracking-[0.25em] uppercase
                overflow-hidden cursor-pointer rounded-[2px] min-w-[210px]
                transition-all duration-500
                hover:-translate-y-[3px]
                hover:border-terracotta-500/80
                hover:text-terracotta-300
                hover:shadow-[0_12px_40px_rgba(201,82,43,0.25),inset_0_0_0_1px_rgba(201,82,43,0.3)]
              ">
                {/* Soft radial terracotta glow fill from center */}
                <span className="
                  absolute inset-0 opacity-0 group-hover:opacity-100
                  bg-[radial-gradient(ellipse_at_center,rgba(201,82,43,0.12)_0%,transparent_70%)]
                  transition-opacity duration-500
                " />
                {/* Top edge terracotta line */}
                <span className="
                  absolute top-0 left-0 right-0 h-[1px]
                  bg-gradient-to-r from-transparent via-terracotta-400 to-transparent
                  scale-x-0 group-hover:scale-x-100
                  transition-transform duration-500 ease-out
                " />
                <span className="relative z-10 flex items-center justify-center gap-2.5 font-sans uppercase tracking-[0.2em] text-[10px]">
                  Explore Our Story
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-400" />
                </span>
              </button>
            </Link>

            {/* ── Shop Catalog ── */}
            <Link href="/products">
              <button className="
                group relative px-10 py-[14px]
                border border-mustard-500/40 text-mustard-450
                font-bold text-[11px] tracking-[0.25em] uppercase
                overflow-hidden cursor-pointer rounded-[2px] min-w-[210px]
                transition-all duration-500
                hover:-translate-y-[3px]
                hover:border-mustard-500/80
                hover:text-mustard-300
                hover:shadow-[0_12px_40px_rgba(229,176,38,0.25),inset_0_0_0_1px_rgba(229,176,38,0.3)]
              ">
                {/* Soft radial mustard glow fill from center */}
                <span className="
                  absolute inset-0 opacity-0 group-hover:opacity-100
                  bg-[radial-gradient(ellipse_at_center,rgba(229,176,38,0.12)_0%,transparent_70%)]
                  transition-opacity duration-500
                " />
                {/* Top edge mustard line */}
                <span className="
                  absolute top-0 left-0 right-0 h-[1px]
                  bg-gradient-to-r from-transparent via-mustard-400 to-transparent
                  scale-x-0 group-hover:scale-x-100
                  transition-transform duration-500 ease-out
                " />
                <span className="relative z-10 flex items-center justify-center gap-2.5 font-sans uppercase tracking-[0.2em] text-[10px]">
                  Shop Catalog
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-400" />
                </span>
              </button>
            </Link>

          </div>
        </div>

         {/* ── Scroll Indicator — pinned at very bottom, never overlaps buttons ── */}
         <div className="relative z-20 flex flex-col items-center gap-2 pb-6 sm:pb-8 pointer-events-none select-none">
           <span className="text-white/40 text-[8px] sm:text-[9px] tracking-[0.5em] uppercase font-bold">Scroll</span>
           {/* Mouse pill */}
           <div className="relative w-[22px] h-[36px] sm:w-[24px] sm:h-[40px] rounded-[12px] border-2 border-white/20 flex justify-center pt-[6px]">
             <div
               className="w-[4px] h-[7px] rounded-full bg-gradient-to-b from-mustard-400 to-mustard-600"
               style={{ animation: "scrollDot 1.8s cubic-bezier(0.45,0,0.55,1) infinite" }}
             />
             <div className="absolute inset-0 rounded-[12px] bg-gradient-to-b from-mustard-500/8 to-transparent" />
           </div>
           {/* Chevrons */}
           <div className="flex flex-col items-center" style={{ animation: "chevronFade 1.8s ease-in-out infinite" }}>
             <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-mustard-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
             </svg>
             <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-mustard-500/30 -mt-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
               <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
             </svg>
           </div>
         </div>
      </section>

      {/* Brand Values Section */}
      <section className="py-24 relative z-10 bg-oatmeal-950/80 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-mustard-500 tracking-[0.3em] uppercase block mb-2">Uncompromised standards</span>
            <h2 className="heading-l text-white mb-4">Our Core Values</h2>
            <div className="w-16 h-0.5 bg-mustard-500 mx-auto rounded-full"></div>
          </div>

          <CoreValues />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-16">
          <div>
            <span className="text-[10px] font-bold text-mustard-500 tracking-[0.3em] uppercase block mb-2">Selected favorites</span>
            <h2 className="heading-l text-white">Featured Products</h2>
          </div>
          <Link href="/products" className="group text-mustard-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-mustard-400 mt-4 sm:mt-0 transition-colors">
            View All Products <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <FeaturedProductsClient initialProducts={featuredProducts} />
      </section>

      {/* Stats Counter Section (Dumb counting numbers animation) */}
      <section className="relative z-10">
        <StatsCounter />
      </section>

      {/* Brand Journey Teaser Banner */}
      <section className="py-28 relative z-10 bg-oatmeal-950 border-t border-white/5 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-[url('/farmland-rising-sun.png')] bg-cover bg-center opacity-15" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="heading-l text-white mb-6">More Than A Food Brand</h2>
          <p className="body-m text-white/70 mb-8 max-w-2xl mx-auto">
            Zerothi represents Nimar's rich agricultural heritage. Sourced directly from local farmers and hand-cooked by women collectives, our products carry a unique regional identity made with honesty and traditional purpose.
          </p>
          <Link href="/about">
            <button className="px-8 py-4 border border-terracotta-500/50 hover:bg-terracotta-500 hover:text-black text-terracotta-400 font-bold text-xs tracking-widest uppercase transition-all rounded-sm cursor-pointer">
              Read Our Full Zerothi Journey
            </button>
          </Link>
        </div>
      </section>

      {/* Testimonials/Reviews Section */}
      <section className="py-24 relative z-10 bg-oatmeal-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-mustard-500 tracking-[0.3em] uppercase block mb-2">Customer Feedback</span>
            <h2 className="heading-l text-white mb-4">Reviews & Trust</h2>
            <div className="w-16 h-0.5 bg-mustard-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="glass-card p-8 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between hover:border-mustard-500/20 transition-all">
              <div>
                <div className="flex text-mustard-500 mb-4">
                  {"★".repeat(5)}
                </div>
                <p className="body-s italic mb-6">
                  "The Masala Banana chips are out of this world! They are so crispy, and you can tell the spices are authentic and freshly grounded, unlike the commercial chips you find everywhere."
                </p>
              </div>
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-wider">Rajesh Sharma</h4>
                <p className="text-white/40 text-[9px] uppercase tracking-wider mt-0.5">Verified Buyer</p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="glass-card p-8 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between hover:border-mustard-500/20 transition-all">
              <div>
                <div className="flex text-mustard-500 mb-4">
                  {"★".repeat(5)}
                </div>
                <p className="body-s italic mb-6">
                  "The Tomato Banana chips are a household favorite now! My kids absolutely love the tangy tomato spice mix, and I love that they are made without any artificial preservatives."
                </p>
              </div>
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-wider">Priya Patidar</h4>
                <p className="text-white/40 text-[9px] uppercase tracking-wider mt-0.5">Verified Buyer</p>
              </div>
            </div>

            {/* Review 3 */}
            <div className="glass-card p-8 rounded-xl border border-white/5 bg-white/[0.01] flex flex-col justify-between hover:border-mustard-500/20 transition-all">
              <div>
                <div className="flex text-mustard-500 mb-4">
                  {"★".repeat(5)}
                </div>
                <p className="body-s italic mb-6">
                  "The Pudina Banana chips have this incredibly fresh, cooling mint aroma mixed with classic Nimar spices. Hands down the best mint-flavored chips I have ever had!"
                </p>
              </div>
              <div>
                <h4 className="text-white text-xs font-bold uppercase tracking-wider">Amit Chouhan</h4>
                <p className="text-white/40 text-[9px] uppercase tracking-wider mt-0.5">Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
