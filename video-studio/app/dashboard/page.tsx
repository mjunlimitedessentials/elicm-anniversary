import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/current-user";
import { DashboardStats } from "@/components/dashboard-stats";
import { ProjectCard } from "@/components/project-card";

export default async function DashboardPage() {
  const user = await getOrCreateUser();
  const jobs = user
    ? await db.videoJob.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
    : [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Your projects</h1>
          <p className="mt-1 text-gray-400">Everything you've generated, in one place.</p>
        </div>
        <Link
          href="/dashboard/new"
          className="flex shrink-0 items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-bold text-black hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New video
        </Link>
      </div>

      <div className="mt-6">
        <DashboardStats jobs={jobs} />
      </div>

      {jobs.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-10 text-center text-gray-400">
          No videos yet.{" "}
          <Link href="/dashboard/new" className="text-gold underline">
            Create your first one
          </Link>
          .
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <ProjectCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
