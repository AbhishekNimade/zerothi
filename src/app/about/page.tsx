import AboutClient from "@/components/AboutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zerothi | Our Journey & Sourcing Story",
  description: "Learn about Zerothi's mission to bridge the agricultural heritage of Nimar. Sourced from local farms and handcrafted by women-led collectives with zero compromises.",
  alternates: {
    canonical: "https://zerothi.com/about/",
  },
  openGraph: {
    title: "Zerothi | Our Journey & Sourcing Story",
    description: "Learn about Zerothi's mission to bridge the agricultural heritage of Nimar. Sourced from local farms and handcrafted by women-led collectives with zero compromises.",
    url: "https://zerothi.com/about/",
    siteName: "Zerothi",
    images: [
      {
        url: "https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
        width: 800,
        height: 600,
        alt: "Zerothi Nimar Journey",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerothi | Our Journey & Sourcing Story",
    description: "Learn about Zerothi's mission to bridge the agricultural heritage of Nimar. Sourced from local farms and handcrafted by women-led collectives with zero compromises.",
    images: ["https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
