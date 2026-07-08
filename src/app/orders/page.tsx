import OrdersClient from "@/components/OrdersClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zerothi | Your Orders",
  description: "View and track your current and past orders of authentic Nimar snacks, cow ghee, and cold pressed groundnut oils.",
  alternates: {
    canonical: "https://zerothi.com/orders/",
  },
  openGraph: {
    title: "Zerothi | Your Orders",
    description: "View and track your current and past orders of authentic Nimar snacks, cow ghee, and cold pressed groundnut oils.",
    url: "https://zerothi.com/orders/",
    siteName: "Zerothi",
    images: [
      {
        url: "https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png",
        width: 800,
        height: 600,
        alt: "Zerothi Orders History",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zerothi | Your Orders",
    description: "View and track your current and past orders of authentic Nimar snacks, cow ghee, and cold pressed groundnut oils.",
    images: ["https://zerothi.com/Logo%20Zerothi/Medium%20Logo%20Zerothi-04.png"],
  },
};

export default function OrdersPage() {
  return <OrdersClient />;
}
