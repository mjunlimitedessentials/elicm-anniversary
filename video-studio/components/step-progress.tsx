"use client";

import { useUser } from "@clerk/nextjs";
import { SITE } from "@/lib/site-config";
import { Logo } from "./logo";

function UserBadge() {
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return <Logo />;

  const initial = (user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="flex items-center justify-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
        {initial}
      </div>
      <span className="text-sm font-medium text-gray-300">{SITE.name}</span>
    </div>
  );
}

export function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto w-full max-w-md pt-10">
      <UserBadge />
      <div className="mt-8 flex gap-2">
        {Array.from({ length: SITE.totalOnboardingSteps }).map((_, i) => {
          const step = i + 1;
          const filled = step <= currentStep;
          return (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                filled ? "bg-gold shadow-gold-glow" : "bg-surface-hover"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
