import LoginClient from "@/components/LoginClient";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Zerothi | Account Login",
  description: "Log in to your Zerothi account to check your order status, track shipments, and manage your billing details for Nimar snacks.",
  alternates: {
    canonical: "https://zerothi.com/login/",
  },
  openGraph: {
    title: "Zerothi | Account Login",
    description: "Log in to your Zerothi account to check your order status, track shipments, and manage your billing details for Nimar snacks.",
    url: "https://zerothi.com/login/",
    siteName: "Zerothi",
    images: [
      {
        url: "https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
        width: 800,
        height: 600,
        alt: "Login to Zerothi",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerothi | Account Login",
    description: "Log in to your Zerothi account to check your order status, track shipments, and manage your billing details for Nimar snacks.",
    images: ["https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png"],
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </main>
    }>
      <LoginClient />
    </Suspense>
  );
}
