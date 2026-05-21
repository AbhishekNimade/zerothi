import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products...");

  const products = [
    {
      name: "Salted Banana Chips",
      slug: "salted-banana-chips",
      description: "Thin-cut banana chips, expertly processed for consistent crunch and authentic taste. Sourced locally to support farmers.",
      price: 80,
      originalPrice: 100,
      category: "CHIPS",
      image: "https://images.unsplash.com/photo-1566478989037-eec170784d20?q=80&w=600&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1622484211148-716598e09117?q=80&w=600&auto=format&fit=crop",
      stock: 250,
      rating: 4.8,
      reviewsCount: 34,
      isFeatured: true,
      bannerLine: "Rooted in farming, Crafted with honesty, Made for real taste.",
      ingredients: "Fresh Bananas, Refined Oil, Iodized Salt"
    },
    {
      name: "Masala Banana Chips",
      slug: "masala-banana-chips",
      description: "Crispy banana chips sprinkled with a bold, aromatic blend of Nimar spices. Expertly crafted for a spicy punch.",
      price: 90,
      originalPrice: 110,
      category: "CHIPS",
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1596541223130-5d56a73fb846?q=80&w=600&auto=format&fit=crop",
      stock: 200,
      rating: 4.9,
      reviewsCount: 42,
      isFeatured: true,
      bannerLine: "Traditional spices, Crafted with honesty, Made for bold taste.",
      ingredients: "Fresh Bananas, Refined Oil, Red Chilli Powder, Black Pepper, Coriander Powder, Amchur (Dry Mango) Powder, Salt, Spices"
    },
    {
      name: "Sweet & Sour Banana Chips",
      slug: "sweet-sour-banana-chips",
      description: "A delicious and unique blend of regional sweetness and tangy spices. Perfect for snack lovers who enjoy a balanced flavor.",
      price: 95,
      originalPrice: 120,
      category: "CHIPS",
      image: "https://images.unsplash.com/photo-1600189020840-e9cb18566c90?q=80&w=600&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1566478989037-eec170784d20?q=80&w=600&auto=format&fit=crop",
      stock: 150,
      rating: 4.6,
      reviewsCount: 18,
      isFeatured: false,
      bannerLine: "Rich taste, Crafted with honesty, Made for real taste.",
      ingredients: "Fresh Bananas, Refined Oil, Sugar Powder, Tamarind Powder, Mango Powder, Salt, Spices"
    },
    {
      name: "Jackfruit Chips",
      slug: "jackfruit-chips",
      description: "Carefully selected jackfruit, sliced thin and crafted into a crispy, highly satisfying snacking experience from Nimar.",
      price: 120,
      originalPrice: 150,
      category: "CHIPS",
      image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1596541223130-5d56a73fb846?q=80&w=600&auto=format&fit=crop",
      stock: 100,
      rating: 4.7,
      reviewsCount: 15,
      isFeatured: false,
      bannerLine: "From Nimar farms, Sourced with care, Perfect snack.",
      ingredients: "Fresh Jackfruit Slices, Refined Oil, Turmeric, Salt"
    },
    {
      name: "Coconut Chips",
      slug: "coconut-chips",
      description: "Light, crunchy coconut flakes offering a naturally refreshing and slightly salted tropical taste from the region.",
      price: 110,
      originalPrice: 140,
      category: "CHIPS",
      image: "https://images.unsplash.com/photo-1600189020840-e9cb18566c90?q=80&w=600&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1566478989037-eec170784d20?q=80&w=600&auto=format&fit=crop",
      stock: 120,
      rating: 4.5,
      reviewsCount: 22,
      isFeatured: false,
      bannerLine: "Sourced with care, Pure taste, Natural energy.",
      ingredients: "Fresh Coconut Flakes, Refined Oil, Sea Salt"
    },
    {
      name: "Authentic Nimar Cow Ghee",
      slug: "authentic-nimar-cow-ghee",
      description: "Pure cow ghee handcrafted using traditional methods in the Nimar region. Rich aroma, granular texture, and unadulterated purity.",
      price: 650,
      originalPrice: 750,
      category: "GHEE",
      image: "https://images.unsplash.com/photo-1589733901241-5e53429e1dbf?q=80&w=600&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=600&auto=format&fit=crop",
      stock: 85,
      rating: 4.9,
      reviewsCount: 65,
      isFeatured: true,
      bannerLine: "Pure essence of tradition, Clarified for perfection.",
      ingredients: "100% Pure Milk Fat (Cow Milk Fat)"
    },
    {
      name: "Cold Pressed Groundnut Oil",
      slug: "cold-pressed-groundnut-oil",
      description: "Extracted using traditional wooden press (Kolhu) with no preservatives. Retains natural nutrients, rich aroma, and premium taste.",
      price: 210,
      originalPrice: 250,
      category: "OIL",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop",
      stock: 140,
      rating: 4.7,
      reviewsCount: 29,
      isFeatured: true,
      bannerLine: "Extracted with care, Refined for health.",
      ingredients: "100% Pure Groundnut Cold-pressed Extract"
    },
    {
      name: "Cold Pressed Mustard Oil",
      slug: "cold-pressed-mustard-oil",
      description: "Pungent and highly aromatic mustard oil, cold-pressed to ensure maximum purity, perfect for traditional Indian cooking.",
      price: 180,
      originalPrice: 220,
      category: "OIL",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop",
      hoverImage: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop",
      stock: 90,
      rating: 4.8,
      reviewsCount: 19,
      isFeatured: false,
      bannerLine: "Pure extraction, Bold flavor, Absolute health.",
      ingredients: "100% Pure Cold-pressed Mustard Seed Extract"
    },
    {
      name: "Raw Green Banana Flour",
      slug: "raw-green-banana-flour",
      description: "Gluten-free, highly nutritious flour made from premium raw green bananas of the Nimar region. Highly digestive and healthy. COMING SOON!",
      price: 0,
      originalPrice: 0,
      category: "FUTURE",
      image: "https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?q=80&w=600&auto=format&fit=crop",
      hoverImage: null,
      stock: 0,
      rating: 5.0,
      reviewsCount: 0,
      isFeatured: false,
      bannerLine: "Future Product Line - Coming Soon.",
      ingredients: "100% Raw Green Bananas"
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // Create an admin user for initial testing
  // password: adminpass123 (hashed with bcrypt manually or seeded directly)
  // We'll use a pre-hashed bcrypt password for simplicity, hashed using round 10:
  // '$2a$10$T3eX2fGep4kL1f6Z2wQ.DehHqF1yUleKsc8Z05hP/M8v0jXh.K4F.'
  await prisma.user.upsert({
    where: { email: "admin@zerothi.com" },
    update: {},
    create: {
      name: "Yash Patidar",
      email: "admin@zerothi.com",
      password: "$2a$10$T3eX2fGep4kL1f6Z2wQ.DehHqF1yUleKsc8Z05hP/M8v0jXh.K4F.",
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@gmail.com" },
    update: {},
    create: {
      name: "Abhishek Gowasami",
      email: "customer@gmail.com",
      password: "$2a$10$T3eX2fGep4kL1f6Z2wQ.DehHqF1yUleKsc8Z05hP/M8v0jXh.K4F.",
      role: "CUSTOMER",
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
