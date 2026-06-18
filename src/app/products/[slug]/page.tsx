import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Statically exported page

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
  });
  if (!product) return {};
  return {
    title: `${product.name} | ZEROTHI`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch current product
  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category (limit to 4)
  const relatedProducts = await db.product.findMany({
    where: {
      category: product.category,
      id: { not: product.id },
    },
    take: 4,
  });

  return (
    <main className="min-h-screen bg-black pt-24 overflow-hidden">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": product.image,
            "description": product.description,
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "price": product.price,
              "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })
        }}
      />
      <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
      <Footer />
    </main>
  );
}

export async function generateStaticParams() {
  try {
    const products = await db.product.findMany({
      select: { slug: true }
    });
    return products.map((p) => ({
      slug: p.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static params for products:", error);
    return [];
  }
}
