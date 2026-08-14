"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { StepProgress } from "@/components/step-progress";
import { PLANS, DEFAULT_PLAN_ID } from "@/lib/plans";

// Stand-in for Stripe Checkout when STRIPE_SECRET_KEY isn't configured.
// Accepts any input — this never touches a real card network.
export default function MockCheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = PLANS.find((p) => p.id === (searchParams.get("plan") ?? DEFAULT_PLAN_ID))!;
  const [submitting, setSubmitting] = useState(false);

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch("/api/checkout/complete", { method: "POST" });
      router.push("/dashboard?checkout=success");
    } finally {
      setSubmitting(false);
    }
  }

  const total = plan.price + plan.setupFee;

  return (
    <main className="min-h-screen bg-background">
      <StepProgress currentStep={4} />
      <div className="mx-auto w-full max-w-md px-6 pb-16 pt-10">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <Lock className="h-3.5 w-3.5" /> Secure checkout (demo mode)
        </p>
        <h1 className="text-2xl font-extrabold">Confirm your subscription</h1>

        <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">{plan.name} plan</span>
            <span className="font-semibold text-white">${plan.price}.00/mo</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-gray-300">One-time studio setup</span>
            <span className="font-semibold text-white">${plan.setupFee}.00</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold text-white">Due today</span>
            <span className="font-bold text-gold">${total}.00</span>
          </div>
        </div>

        <form onSubmit={handlePay} className="mt-6 space-y-4">
          <input
            required
            placeholder="Card number"
            defaultValue="4242 4242 4242 4242"
            className="w-full rounded-full border border-border bg-surface px-5 py-4 text-white outline-none focus:border-gold"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="MM / YY"
              defaultValue="12/29"
              className="w-full rounded-full border border-border bg-surface px-5 py-4 text-white outline-none focus:border-gold"
            />
            <input
              required
              placeholder="CVC"
              defaultValue="123"
              className="w-full rounded-full border border-border bg-surface px-5 py-4 text-white outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gold py-4 font-bold text-black transition-opacity disabled:opacity-40 enabled:hover:opacity-90"
          >
            {submitting ? "Processing..." : `Pay $${total}.00 and start creating`}
          </button>
          <p className="text-center text-xs text-gray-500">
            No real card is charged — this is the mock billing provider. Set
            STRIPE_SECRET_KEY to use real Stripe Checkout instead.
          </p>
        </form>
      </div>
    </main>
  );
}
