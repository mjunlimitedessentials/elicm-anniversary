import { SignIn } from "@clerk/nextjs";
import { Logo } from "@/components/logo";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Logo />
      <div className="mt-8 w-full max-w-md px-6">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </main>
  );
}
