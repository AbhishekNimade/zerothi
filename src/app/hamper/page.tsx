import HamperCustomizer from "@/components/HamperCustomizer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zerothi | Build Your Own Gift Hamper",
  description: "Customize your own traditional Nimar food gift box. Choose a base carton or handcrafted wooden box and fill it with authentic banana chips, ghee, and wood-pressed oils.",
  alternates: {
    canonical: "https://zerothi.com/hamper/",
  },
  openGraph: {
    title: "Zerothi | Build Your Own Gift Hamper",
    description: "Customize your own traditional Nimar food gift box. Choose a base carton or handcrafted wooden box and fill it with authentic banana chips, ghee, and wood-pressed oils.",
    url: "https://zerothi.com/hamper/",
    siteName: "Zerothi",
    images: [
      {
        url: "https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
        width: 800,
        height: 600,
        alt: "Build Your Own Hamper",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerothi | Build Your Own Gift Hamper",
    description: "Customize your own traditional Nimar food gift box. Choose a base carton or handcrafted wooden box and fill it with authentic banana chips, ghee, and wood-pressed oils.",
    images: ["https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png"],
  },
};

export default function HamperPage() {
  return <HamperCustomizer />;
}
