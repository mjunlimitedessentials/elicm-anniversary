import Link from "next/link";
import { SITE } from "@/lib/site-config";
import { Logo } from "@/components/logo";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo />
      <h1 className="mt-8 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
        {SITE.tagline}
      </h1>
      <p className="mt-4 max-w-xl text-gray-400">
        Bible videos, sermon jams, social clips and kids' content — generated
        from a prompt, tuned to your ministry.
      </p>
      <div className="mt-10 flex gap-4">
        <Link
          href="/sign-up"
          className="rounded-full bg-gold px-8 py-3 font-bold text-black hover:opacity-90"
        >
          Create account
        </Link>
        <Link
          href="/sign-in"
          className="rounded-full border border-border px-8 py-3 font-semibold text-white hover:border-gray-500"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
