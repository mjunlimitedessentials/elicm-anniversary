import { UserButton } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/current-user";
import { Logo } from "@/components/logo";
import { DashboardNav } from "@/components/dashboard-nav";
import { CreditsMeter } from "@/components/credits-meter";
import { PLANS, CREDITS_PER_VIDEO } from "@/lib/plans";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getOrCreateUser();

  const [onboarding, jobCount] = user
    ? await Promise.all([
        db.onboardingResponse.findUnique({ where: { userId: user.id } }),
        db.videoJob.count({ where: { userId: user.id } }),
      ])
    : [null, 0];

  const plan = PLANS.find((p) => p.id === onboarding?.plan) ?? PLANS[0];
  const remaining = plan.credits - jobCount * CREDITS_PER_VIDEO;

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="border-b border-border px-6 py-6 lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-5 lg:py-8">
        <div className="flex items-center justify-between lg:flex-col lg:items-stretch lg:gap-6">
          <Logo />
          <div className="lg:hidden">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        <DashboardNav />

        <div className="mt-8">
          <CreditsMeter plan={plan} remaining={remaining} />
        </div>

        <div className="mt-6 hidden lg:block">
          <UserButton afterSignOutUrl="/" showName />
        </div>
      </aside>

      <main className="flex-1 px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}
