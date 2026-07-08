import { db } from "@/lib/db";
import { MetadataRoute } from "next";

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://zerothi.com";

  // Static routes
  const staticRoutes = [
    "",
    "/about/",
    "/contact/",
    "/products/",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch dynamic products from SQLite DB
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await db.product.findMany({
      select: { slug: true, createdAt: true },
    });

    productRoutes = products.map((p) => ({
      url: `${baseUrl}/products/${p.slug}/`,
      lastModified: p.createdAt ? new Date(p.createdAt) : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to compile product routes for sitemap.xml:", error);
  }

  return [...staticRoutes, ...productRoutes];
}
