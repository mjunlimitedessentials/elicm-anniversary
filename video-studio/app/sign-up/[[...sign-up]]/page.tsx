import { SignUp } from "@clerk/nextjs";
import { StepProgress } from "@/components/step-progress";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <StepProgress currentStep={1} />
      <div className="mt-8 w-full max-w-md px-6">
        <h1 className="text-3xl font-extrabold leading-tight">
          Create account
          <br />
          <span className="text-gray-400">to start creating</span>
        </h1>
      </div>
      <div className="mt-6 w-full max-w-md px-6">
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/onboarding"
        />
      </div>
    </main>
  );
}
