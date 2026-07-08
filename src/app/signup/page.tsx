import SignupClient from "@/components/SignupClient";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Zerothi | Create Account",
  description: "Sign up for a Zerothi account. Enjoy faster checkouts, order tracking, and notifications on fresh Nimar banana chips batches.",
  alternates: {
    canonical: "https://zerothi.com/signup/",
  },
  openGraph: {
    title: "Zerothi | Create Account",
    description: "Sign up for a Zerothi account. Enjoy faster checkouts, order tracking, and notifications on fresh Nimar banana chips batches.",
    url: "https://zerothi.com/signup/",
    siteName: "Zerothi",
    images: [
      {
        url: "https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
        width: 800,
        height: 600,
        alt: "Signup for Zerothi",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerothi | Create Account",
    description: "Sign up for a Zerothi account. Enjoy faster checkouts, order tracking, and notifications on fresh Nimar banana chips batches.",
    images: ["https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png"],
  },
};

export default function SignupPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </main>
    }>
      <SignupClient />
    </Suspense>
  );
}
