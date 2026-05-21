import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Leaf, ShieldCheck, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

export const revalidate = 0; // Don't cache so we always see inventory updates

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

  return (
    <main className="min-h-screen bg-black overflow-hidden selection:bg-gold-500/30 selection:text-gold-300">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center pt-20">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1596541223130-5d56a73fb846?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-30 blur-[1px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 backdrop-blur-sm">
            <span className="text-gold-300 text-xs font-semibold tracking-[0.25em] uppercase">Future Perspective</span>
          </div>
          
          <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            The Taste of <span className="text-gradient-gold">Nimar</span>
          </h1>
          
          <p className="text-sm md:text-base text-white/70 max-w-2xl mx-auto mb-10 font-light leading-relaxed tracking-wide">
            Traditional purity from Nimad, Madhya Pradesh. Empowering local women-led craftsmanship and supporting farming families with zero compromise on quality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <Link href="/about">
              <button className="group relative px-8 py-4 bg-gold-500 text-black font-bold text-xs tracking-widest uppercase overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.45)] cursor-pointer rounded-sm">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Our Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>
            </Link>
            <Link href="/products">
              <button className="px-8 py-4 border border-gold-500/30 text-gold-400 font-bold text-xs tracking-widest uppercase hover:bg-gold-500/10 transition-all hover:border-gold-500 cursor-pointer rounded-sm">
                Shop Catalog
              </button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center animate-bounce opacity-50">
          <span className="text-white/40 text-[9px] tracking-[0.4em] uppercase mb-2">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-gold-500 to-transparent" />
        </div>
      </section>

      {/* Brand Values Section */}
      <section className="py-24 relative z-10 bg-[#040404] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">Uncompromised standards</span>
            <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-4">Our Core Values</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="glass-card p-8 rounded-xl border border-white/5 bg-black/30 hover:border-gold-500/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 mb-6">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Freshness First</h3>
              <p className="text-white/60 text-xs font-light leading-relaxed">
                Ensuring every product is freshly processed and packed under strict hygiene conditions.
              </p>
            </div>

            {/* Value 2 */}
            <div className="glass-card p-8 rounded-xl border border-white/5 bg-black/30 hover:border-gold-500/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Smart Processing</h3>
              <p className="text-white/60 text-xs font-light leading-relaxed">
                Combining traditional methodologies with advanced, preservation-free machinery.
              </p>
            </div>

            {/* Value 3 */}
            <div className="glass-card p-8 rounded-xl border border-white/5 bg-black/30 hover:border-gold-500/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 mb-6">
                <ArrowRight className="w-6 h-6 rotate-[-45deg]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Authentic Taste</h3>
              <p className="text-white/60 text-xs font-light leading-relaxed">
                Using premium masalas and ground-level ingredients for deep, regional flavors.
              </p>
            </div>

            {/* Value 4 */}
            <div className="glass-card p-8 rounded-xl border border-white/5 bg-black/30 hover:border-gold-500/20 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center text-gold-400 mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">Better Snacking</h3>
              <p className="text-white/60 text-xs font-light leading-relaxed">
                Prepared exclusively with refined oils, zero colors, and no artificial preservatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-end mb-16">
          <div>
            <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">Selected favorites</span>
            <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white">Featured Products</h2>
          </div>
          <Link href="/products" className="group text-gold-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:text-gold-300 mt-4 sm:mt-0 transition-colors">
            View All Products <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm">
            No products available at the moment. Run database seed to populate.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Journey Teaser Banner */}
      <section className="py-28 relative z-10 bg-neutral-950 border-t border-white/5 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-cinzel text-3xl md:text-5xl text-white font-bold mb-6">More Than A Food Brand</h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed font-light mb-8 max-w-2xl mx-auto">
            Zerothi represents Nimar's rich agricultural heritage. Sourced directly from local farmers and hand-cooked by women collectives, our products carry a unique regional identity made with honesty and traditional purpose.
          </p>
          <Link href="/about">
            <button className="px-8 py-4 border border-gold-500/50 hover:bg-gold-500 hover:text-black text-gold-400 font-bold text-xs tracking-widest uppercase transition-all rounded-sm cursor-pointer">
              Read Our Full Y-Leaf Journey
            </button>
          </Link>
        </div>
      </section>

      {/* Testimonials/Reviews Section */}
      <section className="py-24 relative z-10 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">Customer Feedback</span>
            <h2 className="font-cinzel text-3xl md:text-5xl font-bold text-white mb-4">Reviews & Trust</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="glass-card p-8 rounded-xl border border-white/5 bg-white/5 flex flex-col justify-between">
              <div>
                <div className="flex text-gold-400 mb-4">
                  {"★".repeat(5)}
                </div>
                <p className="text-white/80 text-xs italic font-light leading-relaxed mb-6">
                  "The Masala Banana chips are out of this world! They are so crispy, and you can tell the spices are authentic and freshly grounded, unlike the commercial chips you find everywhere."
                </p>
              </div>
              <div>
                <h4 className="text-white text-xs font-semibold">Rajesh Sharma</h4>
                <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">Verified Buyer • Indore</p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="glass-card p-8 rounded-xl border border-white/5 bg-white/5 flex flex-col justify-between">
              <div>
                <div className="flex text-gold-400 mb-4">
                  {"★".repeat(5)}
                </div>
                <p className="text-white/80 text-xs italic font-light leading-relaxed mb-6">
                  "I've been cooking with the Cold Pressed Groundnut oil for three weeks now. The natural aroma is absolutely amazing, and there are no additives. Reminds me of childhood cow-driven press oil!"
                </p>
              </div>
              <div>
                <h4 className="text-white text-xs font-semibold">Priya Patidar</h4>
                <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">Verified Buyer • Khargone</p>
              </div>
            </div>

            {/* Review 3 */}
            <div className="glass-card p-8 rounded-xl border border-white/5 bg-white/5 flex flex-col justify-between">
              <div>
                <div className="flex text-gold-400 mb-4">
                  {"★".repeat(5)}
                </div>
                <p className="text-white/80 text-xs italic font-light leading-relaxed mb-6">
                  "The Nimar Cow Ghee has that perfect granular texture and a rich, sweet aroma. Seeing that they support women groups in Nimar makes buying it even more meaningful. Exceptional product!"
                </p>
              </div>
              <div>
                <h4 className="text-white text-xs font-semibold">Amit Chouhan</h4>
                <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">Verified Buyer • Mumbai</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
