import Link from "next/link";
import { Plus } from "lucide-react";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/current-user";
import { Logo } from "@/components/logo";

const STATUS_LABEL: Record<string, string> = {
  queued: "Queued",
  generating: "Generating",
  rendering: "Rendering",
  completed: "Ready",
  failed: "Failed",
};

export default async function DashboardPage() {
  const user = await getOrCreateUser();
  const jobs = user
    ? await db.videoJob.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } })
    : [];

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            href="/dashboard/new"
            className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-bold text-black hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New video
          </Link>
        </div>

        <h1 className="mt-10 text-2xl font-extrabold">Your projects</h1>

        {jobs.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-border bg-surface p-10 text-center text-gray-400">
            No videos yet.{" "}
            <Link href="/dashboard/new" className="text-gold underline">
              Create your first one
            </Link>
            .
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/dashboard/projects/${job.id}`}
                className="rounded-2xl border border-border bg-surface p-5 hover:border-gray-600"
              >
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <span>{job.contentType.replace("-", " ")}</span>
                  <span
                    className={job.status === "completed" ? "text-gold" : "text-gray-400"}
                  >
                    {STATUS_LABEL[job.status]}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-gray-200">{job.prompt}</p>
                {job.status !== "completed" && job.status !== "failed" && (
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
                    <div
                      className="h-full bg-gold transition-all"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
