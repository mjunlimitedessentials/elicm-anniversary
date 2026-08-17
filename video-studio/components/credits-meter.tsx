import Link from "next/link";
import type { Plan } from "@/lib/plans";

export function CreditsMeter({ plan, remaining }: { plan: Plan; remaining: number }) {
  const percentLeft = Math.max(0, Math.min(100, (remaining / plan.credits) * 100));

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {plan.name} plan
      </p>
      <p className="mt-2 text-sm text-gray-300">
        {Math.max(0, remaining).toLocaleString()} / {plan.credits.toLocaleString()} credits left
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
        <div
          className="h-full bg-gold transition-all"
          style={{ width: `${percentLeft}%` }}
        />
      </div>
      <Link href="/onboarding/plan" className="mt-3 inline-block text-xs text-gold underline">
        Upgrade plan
      </Link>
    </div>
  );
}
