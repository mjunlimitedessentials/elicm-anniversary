"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StepProgress } from "@/components/step-progress";
import { DEFAULT_PLAN_ID } from "@/lib/plans";

// Kicks off billing checkout and hands off: to Stripe (external redirect)
// when STRIPE_SECRET_KEY is configured server-side, or to our own mock
// checkout screen otherwise. See lib/billing-provider.ts.
export default function OnboardingCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const planId = searchParams.get("plan") ?? DEFAULT_PLAN_ID;

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId }),
        });
        if (!res.ok) throw new Error("Could not start checkout");
        const { url, external } = await res.json();
        if (cancelled) return;

        if (external) {
          window.location.href = url;
        } else {
          router.replace(url);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      }
    }

    start();
    return () => {
      cancelled = true;
    };
  }, [planId, router]);

  return (
    <main className="min-h-screen bg-background">
      <StepProgress currentStep={4} />
      <div className="mx-auto flex w-full max-w-md flex-col items-center px-6 pb-16 pt-16 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold">
          Step 4 of 4
        </p>
        <h1 className="text-2xl font-extrabold">Taking you to secure checkout...</h1>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
    </main>
  );
}
