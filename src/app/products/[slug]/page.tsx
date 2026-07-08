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

  const cleanDesc = (product.description || "").replace(/<[^>]*>/g, '').trim();
  const shortDesc = cleanDesc.length > 155 ? cleanDesc.slice(0, 152) + "..." : cleanDesc;
  const imageAbsUrl = product.image.startsWith("http") ? product.image : `https://zerothi.com${product.image}`;

  return {
    title: `Zerothi | Buy ${product.name} Online`,
    description: shortDesc,
    alternates: {
      canonical: `https://zerothi.com/products/${product.slug}/`,
    },
    openGraph: {
      title: `Zerothi | Buy ${product.name} Online`,
      description: shortDesc,
      url: `https://zerothi.com/products/${product.slug}/`,
      siteName: "Zerothi",
      images: [
        {
          url: imageAbsUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Zerothi | Buy ${product.name} Online`,
      description: shortDesc,
      images: [imageAbsUrl],
    },
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

  const imageAbsUrl = product.image.startsWith("http") ? product.image : `https://zerothi.com${product.image}`;

  // Product-category-specific FAQs for AEO (AI Answer Engine Optimization)
  const categoryFaqs: Record<string, { q: string; a: string }[]> = {
    BANANA_CHIPS: [
      {
        q: "Are Zerothi banana chips preservative-free?",
        a: "Yes. Zerothi banana chips contain zero artificial preservatives, zero trans fat, and zero artificial coloring agents. They are fried in pure refined oil and flushed with nitrogen to preserve freshness."
      },
      {
        q: "Where are Zerothi banana chips sourced from?",
        a: "Zerothi sources raw bananas directly from farms in the Nimar region of Madhya Pradesh, India. All sourcing is done through direct farmer partnerships to ensure fair trade and freshness."
      },
      {
        q: "Who makes Zerothi banana chips?",
        a: "Zerothi banana chips are handcrafted by women-led self-help collectives based in Barwani, Madhya Pradesh. The brand is co-founded by Yash Patidar and Mayank Chouhan with a mission to bring authentic Nimar flavors to modern consumers."
      },
      {
        q: "What flavors of banana chips does Zerothi offer?",
        a: "Zerothi currently offers four banana chip flavors: Salted, Tomato, Peri-Peri, and Pudina (Mint). All are made from fresh Nimar bananas with regional spice blends."
      }
    ],
    COW_GHEE: [
      {
        q: "How is Zerothi cow ghee made?",
        a: "Zerothi Pure Cow Ghee is made using the traditional granular curd churning (bilona) method practiced in the Nimar region of Madhya Pradesh. The milk is cultured, curd is hand-churned to extract butter (makhan), and then clarified slowly to produce ghee with a characteristic granular texture."
      },
      {
        q: "Is Zerothi ghee made from A2 milk?",
        a: "Zerothi ghee is made from 100% pure cow milk fat sourced from indigenous cow breeds in the Nimar region. The ghee is single-ingredient: 100% Clarified Butter Fat (Cow Milk Fat)."
      },
      {
        q: "Does Zerothi cow ghee contain any additives?",
        a: "No. Zerothi Pure Cow Ghee contains a single ingredient: 100% Clarified Butter Fat from cow milk. There are no additives, preservatives, artificial flavors, or colors."
      }
    ],
    OIL: [
      {
        q: "What is wood-pressed oil and how is it different from refined oil?",
        a: "Wood-pressed (cold-pressed / kachi ghani) oil is extracted by crushing seeds in a traditional wooden press (ghani) at low speed without heat or chemicals. This preserves natural antioxidants, vitamins, and flavor compounds. Refined oils use high heat and chemical solvents that strip these nutrients. Zerothi's wood-pressed oils are unrefined, unbleached, and chemical-free."
      },
      {
        q: "Where does Zerothi source the groundnuts for its oil?",
        a: "Zerothi sources groundnuts directly from farmers in the Nimar region of Madhya Pradesh, India. The seeds are single-pressed in a traditional wooden ghani to produce unrefined, chemical-free oil."
      },
      {
        q: "Can Zerothi wood-pressed coconut oil be used for skincare and hair?",
        a: "Yes. Zerothi Wood-Pressed Coconut Oil is 100% pure, unrefined, and free from preservatives, making it suitable for cooking, hair conditioning, and skin moisturization. It retains the natural fatty acids and aroma of fresh coconut."
      }
    ]
  };

  const productFaqs = categoryFaqs[product.category] || [];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": imageAbsUrl,
    "description": product.description,
    "sku": product.slug,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Zerothi"
    },
    ...(product.reviewsCount > 0 && product.rating > 0 ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewsCount,
        "bestRating": 5,
        "worstRating": 1
      }
    } : {}),
    "offers": {
      "@type": "Offer",
      "url": `https://zerothi.com/products/${product.slug}/`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2030-01-01",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  const faqSchema = productFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": productFaqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": a
      }
    }))
  } : null;

  const breadcrumbsSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://zerothi.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://zerothi.com/products/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://zerothi.com/products/${product.slug}/`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-black pt-24 overflow-hidden">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ProductDetailsClient product={product} relatedProducts={relatedProducts} productFaqs={productFaqs} />
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
