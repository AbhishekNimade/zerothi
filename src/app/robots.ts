import { MetadataRoute } from "next";

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout/", "/orders/", "/api/"],
    },
    sitemap: "https://zerothi.com/sitemap.xml",
  };
}
