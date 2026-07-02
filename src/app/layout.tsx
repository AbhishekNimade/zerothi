import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LikesProvider } from "@/context/LikesContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import LenisProvider from "@/components/LenisProvider";

export const metadata: Metadata = {
  title: "ZEROTHI | The Taste of Nimar",
  description: "Traditional purity from Nimad, empowering women and supporting farmers.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
              "@type": "Organization",
              "name": "ZEROTHI",
              "url": "https://zerothi.com",
              "logo": "https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
              "description": "Traditional purity from Nimar, empowering women and supporting farmers.",
              "sameAs": [
                "https://instagram.com/zerothi"
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
              </LenisProvider>
            </LikesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
