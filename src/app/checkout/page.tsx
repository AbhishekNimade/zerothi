import CheckoutClient from "@/components/CheckoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zerothi | Secure Checkout",
  description: "Complete your purchase securely. Enter your shipping address and payment details to receive fresh Nimar banana chips directly at your doorstep.",
  alternates: {
    canonical: "https://zerothi.com/checkout/",
  },
  openGraph: {
    title: "Zerothi | Secure Checkout",
    description: "Complete your purchase securely. Enter your shipping address and payment details to receive fresh Nimar banana chips directly at your doorstep.",
    url: "https://zerothi.com/checkout/",
    siteName: "Zerothi",
    images: [
      {
        url: "https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
        width: 800,
        height: 600,
        alt: "Zerothi Secure Checkout",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerothi | Secure Checkout",
    description: "Complete your purchase securely. Enter your shipping address and payment details to receive fresh Nimar banana chips directly at your doorstep.",
    images: ["https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png"],
  },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
