"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { StepProgress } from "@/components/step-progress";

const PLANS = [
  { id: "starter", name: "Starter", price: "$0", blurb: "3 videos / month, watermarked" },
  { id: "ministry", name: "Ministry", price: "$29/mo", blurb: "30 videos / month, no watermark" },
  { id: "unlimited", name: "Unlimited", price: "$99/mo", blurb: "Unlimited videos, priority render" },
];

export default function OnboardingPlanPage() {
  const router = useRouter();
  const [plan, setPlan] = useState("ministry");
  const [submitting, setSubmitting] = useState(false);

  async function handleFinish() {
    setSubmitting(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, completed: true }),
      });
      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <StepProgress currentStep={4} />
      <div className="mx-auto w-full max-w-md px-6 pb-16 pt-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold">
          Step 4 of 4
        </p>
        <h1 className="text-3xl font-extrabold leading-tight">Choose your plan</h1>
        <p className="mt-2 text-gray-400">You can change this anytime from settings.</p>

        <div className="mt-8 space-y-3">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlan(p.id)}
              className={`flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors ${
                plan === p.id ? "border-gold bg-surface" : "border-border bg-surface hover:border-gray-600"
              }`}
            >
              <div>
                <div className="flex items-center gap-2 font-semibold text-white">
                  {p.name}
                  {plan === p.id && <Check className="h-4 w-4 text-gold" />}
                </div>
                <div className="text-sm text-gray-400">{p.blurb}</div>
              </div>
              <div className="font-bold text-gold">{p.price}</div>
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={submitting}
          onClick={handleFinish}
          className="mt-8 w-full rounded-full bg-gold py-4 font-bold text-black transition-opacity disabled:opacity-40 enabled:hover:opacity-90"
        >
          {submitting ? "Setting up..." : "Start creating"}
        </button>
      </div>
    </main>
  );
}
