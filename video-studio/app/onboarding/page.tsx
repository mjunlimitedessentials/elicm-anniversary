import { OnboardingQuiz } from "@/components/onboarding-quiz";
import { StepProgress } from "@/components/step-progress";

export default function OnboardingFocusPage() {
  return (
    <main className="min-h-screen bg-background">
      <StepProgress currentStep={2} />
      <OnboardingQuiz />
    </main>
  );
}
