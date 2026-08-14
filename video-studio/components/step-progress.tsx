import { SITE } from "@/lib/site-config";
import { Logo } from "./logo";

export function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto w-full max-w-md pt-10">
      <Logo />
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
