"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StepProgress } from "@/components/step-progress";

const SIZE_OPTIONS = ["Just me", "2-10 people", "11-50 people", "50+ people"];

export default function OnboardingDetailsPage() {
  const router = useRouter();
  const [ministryName, setMinistryName] = useState("");
  const [ministrySize, setMinistrySize] = useState(SIZE_OPTIONS[0]);
  const [brandColor, setBrandColor] = useState("#e3a83c");
  const [submitting, setSubmitting] = useState(false);

  async function handleContinue() {
    setSubmitting(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ministryName, ministrySize, brandColor }),
      });
      router.push("/onboarding/plan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <StepProgress currentStep={3} />
      <div className="mx-auto w-full max-w-md px-6 pb-16 pt-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gold">
          Step 3 of 4
        </p>
        <h1 className="text-3xl font-extrabold leading-tight">
          Tell us about your ministry
        </h1>
        <p className="mt-2 text-gray-400">
          This shows up on generated videos and helps tailor tone and pacing.
        </p>

        <div className="mt-8 space-y-4">
          <input
            value={ministryName}
            onChange={(e) => setMinistryName(e.target.value)}
            placeholder="Ministry or church name"
            className="w-full rounded-full border border-border bg-surface px-5 py-4 text-white outline-none focus:border-gold"
          />

          <div>
            <label className="mb-2 block text-sm text-gray-400">Team size</label>
            <div className="grid grid-cols-2 gap-3">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setMinistrySize(size)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                    ministrySize === size
                      ? "border-gold bg-surface text-gold"
                      : "border-border bg-surface text-gray-300 hover:border-gray-600"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-400">Brand color</label>
            <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-3">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded-full border-none bg-transparent"
              />
              <span className="text-sm text-gray-300">{brandColor}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={!ministryName || submitting}
          onClick={handleContinue}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 font-bold text-black transition-opacity disabled:opacity-40 enabled:hover:opacity-90"
        >
          {submitting ? "Saving..." : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </main>
  );
}
