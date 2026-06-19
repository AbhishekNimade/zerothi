import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products...");

  // Clear existing products to ensure clean database state
  await prisma.product.deleteMany({});
  console.log("Cleared old products from database.");

  const products = [
    {
      name: "Salted Banana Chips",
      slug: "salted-banana-chips",
      description: "Thin-cut banana chips, expertly processed for consistent crunch and authentic taste. Sourced locally to support farmers.",
      price: 80,
      originalPrice: 100,
      category: "BANANA_CHIPS",
      image: "/Product%20Image/Salted%20Banana%20Mockup-01.png",
      hoverImage: null,
      stock: 250,
      rating: 4.8,
      reviewsCount: 34,
      isFeatured: true,
      bannerLine: "Rooted in farming, Crafted with honesty, Made for real taste.",
      ingredients: "Fresh Bananas, Refined Oil, Iodized Salt"
    },
    {
      name: "Tomato Banana Chips",
      slug: "tomato-banana-chips",
      description: "Crispy banana chips seasoned with a delicious, tangy tomato flavor. A perfect blend of sweetness and spices from Nimar.",
      price: 90,
      originalPrice: 110,
      category: "BANANA_CHIPS",
      image: "/Product%20Image/Tomato%20Banana%20Mockup-02.png",
      hoverImage: null,
      stock: 200,
      rating: 4.7,
      reviewsCount: 28,
      isFeatured: true,
      bannerLine: "Tangy Tomato goodness, crafted with care.",
      ingredients: "Fresh Bananas, Refined Oil, Tomato Powder, Sugar, Iodized Salt, Spices"
    },
    {
      name: "Peri-Peri Banana Chips",
      slug: "peri-peri-banana-chips",
      description: "Spice up your snacking with our Peri-Peri Banana Chips. Packed with a fiery punch of peri-peri seasoning and regional spices.",
      price: 95,
      originalPrice: 120,
      category: "BANANA_CHIPS",
      image: "/Product%20Image/Peri-Peri%20Banana%20Mockup-03.png",
      hoverImage: null,
      stock: 150,
      rating: 4.9,
      reviewsCount: 45,
      isFeatured: true,
      bannerLine: "Fiery Peri-Peri, bold regional taste.",
      ingredients: "Fresh Bananas, Refined Oil, Peri-Peri Seasoning, Red Chilli, Garlic Powder, Salt, Spices"
    },
    {
      name: "Pudina Banana Chips",
      slug: "pudina-banana-chips",
      description: "Refreshing mint-infused banana chips, offering a perfect blend of coolness and authentic spices. A Nimar specialty.",
      price: 85,
      originalPrice: 105,
      category: "BANANA_CHIPS",
      image: "/Product%20Image/Pudina%20Banana%20Mockup-04.png",
      hoverImage: null,
      stock: 180,
      rating: 4.6,
      reviewsCount: 22,
      isFeatured: true,
      bannerLine: "Refreshing Mint, crafted for authentic taste.",
      ingredients: "Fresh Bananas, Refined Oil, Pudina (Mint) Powder, Black Salt, Iodized Salt, Dry Mango Powder, Spices"
    },
    {
      name: "Pure Cow Ghee",
      slug: "pure-cow-ghee",
      description: "Handcrafted using traditional granular curd churning methods in the Nimar region. Rich golden color, granular texture, and absolute purity.",
      price: 1100,
      originalPrice: 1300,
      category: "COW_GHEE",
      image: "/Product%20Image/Cow%20Ghee%20Mockup-05.png",
      hoverImage: null,
      stock: 150,
      rating: 4.9,
      reviewsCount: 64,
      isFeatured: true,
      bannerLine: "Granular Purity, Handcrafted with Care.",
      ingredients: "100% Clarified Butter Fat (Cow Milk Fat)"
    },
    {
      name: "Wood-Pressed Groundnut Oil",
      slug: "wood-pressed-groundnut-oil",
      description: "Traditional wood-pressed groundnut oil, cold-pressed from premium quality seeds sourced directly from Nimar farmers. 100% natural, unrefined, and chemical-free.",
      price: 450,
      originalPrice: 550,
      category: "OIL",
      image: "/Product%20Image/Groundnut%20Oil%20Mockup-06.png",
      hoverImage: null,
      stock: 100,
      rating: 4.8,
      reviewsCount: 42,
      isFeatured: true,
      bannerLine: "Authentic Wood-Pressed Groundnut Oil, 100% Pure & Natural.",
      ingredients: "100% Wood-Pressed Groundnut Seeds"
    },
    {
      name: "Wood-Pressed Coconut Oil",
      slug: "wood-pressed-coconut-oil",
      description: "Wood-pressed raw coconut oil, cold-pressed from selected fresh coconuts. Ideal for cooking, hair, and skin care. 100% pure, natural, and preservative-free.",
      price: 380,
      originalPrice: 450,
      category: "OIL",
      image: "/Product%20Image/Groundnut%20Oil%20Mockup-06.png",
      hoverImage: null,
      stock: 80,
      rating: 4.7,
      reviewsCount: 15,
      isFeatured: true,
      bannerLine: "100% Pure Wood-Pressed Coconut Oil.",
      ingredients: "100% Pure Dried Coconut Copra"
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
