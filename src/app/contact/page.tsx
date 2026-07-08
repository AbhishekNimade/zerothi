import ContactClient from "@/components/ContactClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zerothi | Contact Us & Direct Sourcing Channels",
  description: "Get in touch with Zerothi. Connect directly with our agro operations or co-founders for business collaborations, bulk distributions, and order inquiries.",
  alternates: {
    canonical: "https://zerothi.com/contact/",
  },
  openGraph: {
    title: "Zerothi | Contact Us & Direct Sourcing Channels",
    description: "Get in touch with Zerothi. Connect directly with our agro operations or co-founders for business collaborations, bulk distributions, and order inquiries.",
    url: "https://zerothi.com/contact/",
    siteName: "Zerothi",
    images: [
      {
        url: "https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
        width: 800,
        height: 600,
        alt: "Contact Zerothi",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerothi | Contact Us & Direct Sourcing Channels",
    description: "Get in touch with Zerothi. Connect directly with our agro operations or co-founders for business collaborations, bulk distributions, and order inquiries.",
    images: ["https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png"],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
