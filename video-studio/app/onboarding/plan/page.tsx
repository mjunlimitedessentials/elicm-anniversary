"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { StepProgress } from "@/components/step-progress";
import { PLANS, DEFAULT_PLAN_ID } from "@/lib/plans";

export default function OnboardingPlanPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState<string | null>(null);
  const plan = PLANS.find((p) => p.id === DEFAULT_PLAN_ID)!;

  async function handleContinue(planId: string) {
    setSubmitting(planId);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      router.push(`/onboarding/checkout?plan=${planId}`);
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <StepProgress currentStep={3} />
      <div className="mx-auto w-full max-w-md px-6 pb-16 pt-10">
        <div className="mb-6 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
          <span className="text-gold">Step 3 of 4</span>
          <span>Choose your plan</span>
        </div>

        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">
          Start creating for ${plan.price}/mo.
        </h1>
        <p className="mt-3 text-gray-400">
          One simple plan to get you into the studio. Upgrade to a bigger plan
          anytime from inside your account once you're in.
        </p>

        <div className="mt-8 rounded-2xl border border-gold p-6">
          <h2 className="text-xl font-bold text-white">{plan.name}</h2>
          <p className="mt-2 text-gray-400">{plan.blurb}</p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold">${plan.price}</span>
            <span className="text-gray-400">/ mo</span>
          </div>

          <p className="mt-4 font-medium text-gray-200">
            {plan.credits.toLocaleString()} credits / month
          </p>
          <p className="mt-2 text-sm text-gray-400">
            Includes one-time ${plan.setupFee} studio setup: your private
            workspace, instant credit activation, and the full 2,700-clip
            stock footage library.
          </p>

          <button
            type="button"
            disabled={submitting !== null}
            onClick={() => handleContinue(plan.id)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 font-bold text-black transition-opacity disabled:opacity-40 enabled:hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            {submitting ? "Starting checkout..." : `Continue with ${plan.name}`}
          </button>

          <div className="mt-4 flex justify-center gap-4 text-sm text-gray-400">
            <button type="button" className="underline hover:text-white">
              Have a promo code?
            </button>
            <button type="button" className="underline hover:text-white">
              Use a card instead
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-gray-500">
            Your card is only charged in the secure checkout that comes next.
            Cancel anytime.
          </p>

          <ul className="mt-6 space-y-2 border-t border-border pt-6 text-sm text-gray-300">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className="mt-0.5 text-gold">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
