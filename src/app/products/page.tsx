import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductsGrid from "@/components/ProductsGrid";
import { db } from "@/lib/db";

export const revalidate = 0; // Ensure fresh data on every visit

export default async function ProductsPage() {
  let products: any[] = [];
  try {
    // Fetch all products from the SQLite database
    products = await db.product.findMany({
      orderBy: { rating: "desc" }
    });
  } catch (error) {
    console.error("Failed to load products from database:", error);
  }

  return (
    <main className="min-h-screen bg-black pt-20 overflow-hidden selection:bg-gold-500/30 selection:text-gold-300">
      <Navbar />

      {/* Header Banner */}
      <section className="relative py-20 bg-gradient-to-b from-black via-gold-950/5 to-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-[10px] font-bold text-gold-500 tracking-[0.3em] uppercase block mb-2">Regional purity catalog</span>
          <h1 className="font-cinzel text-4xl md:text-6xl font-bold text-white mb-4">
            Our <span className="text-gradient-gold">Products</span>
          </h1>
          <p className="text-white/60 text-xs md:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Authentic banana chips sourced and handcrafted with integrity from local Nimar farmers.
          </p>
        </div>

        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:30px_30px]" />
      </section>

      {/* Product Catalog Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductsGrid products={products} />
      </section>

      <Footer />
    </main>
  );
}
