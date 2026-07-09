"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignupClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  useEffect(() => {
    // Redirect instantly to OTP login page since login handles automatic signup
    router.replace(redirect !== "/" ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login");
  }, [router, redirect]);

  return (
    <main className="min-h-screen bg-black flex flex-col justify-center items-center text-center p-6 select-none">
      <div className="space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto" />
        <p className="text-white/60 text-sm font-light tracking-wide">
          Redirecting to fast OTP Sign-In...
        </p>
      </div>
    </main>
  );
}
