import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LikesProvider } from "@/context/LikesContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import LenisProvider from "@/components/LenisProvider";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  metadataBase: new URL("https://zerothi.com"),
  title: {
    default: "Zerothi | Authentic Nimar Banana Chips & Ghee",
    template: "%s | Zerothi"
  },
  description: "Traditional purity from Nimar, empowering women-led collectives and supporting local farming families with zero trans fat or preservatives.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Zerothi | Authentic Nimar Banana Chips & Ghee",
    description: "Traditional purity from Nimar, empowering women-led collectives and local farming families.",
    url: "https://zerothi.com",
    siteName: "Zerothi",
    images: [
      {
        url: "/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
        width: 800,
        height: 600,
        alt: "Zerothi",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerothi | Authentic Nimar Banana Chips & Ghee",
    description: "Traditional purity from Nimar, empowering women-led collectives and local farming families.",
    images: ["/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "LocalBusiness"],
              "name": "Zerothi",
              "alternateName": "Zerothi Food Brand",
              "url": "https://zerothi.com",
              "logo": "https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
              "description": "Zerothi is a regional food brand based in Barwani, Madhya Pradesh, producing traditional banana chips, cow ghee, and wood-pressed oils sourced directly from Nimar farmers and handcrafted by women-led self-help collectives.",
              "email": "support@zerothi.com",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Barwani",
                "addressRegion": "Madhya Pradesh",
                "postalCode": "451551",
                "addressCountry": "IN"
              },
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "sameAs": [
                "https://www.instagram.com/zerothi_official/",
                "https://www.linkedin.com/company/zerothi/"
              ]
            })
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-sans min-h-full flex flex-col bg-black text-white antialiased">
        <AuthProvider>
          <CartProvider>
            <LikesProvider>
              <LenisProvider>
                {children}
                <WhatsAppButton />
                <MobileBottomNav />
              </LenisProvider>
            </LikesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
