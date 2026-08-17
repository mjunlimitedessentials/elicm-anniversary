import type { VideoJob } from "@prisma/client";

export function DashboardStats({ jobs }: { jobs: VideoJob[] }) {
  const total = jobs.length;
  const ready = jobs.filter((j) => j.status === "completed").length;
  const inProgress = jobs.filter((j) =>
    ["queued", "generating", "rendering"].includes(j.status),
  ).length;

  const stats = [
    { label: "Total projects", value: total },
    { label: "In progress", value: inProgress },
    { label: "Ready to share", value: ready },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-border bg-surface p-4 sm:p-5">
          <p className="text-2xl font-extrabold text-white sm:text-3xl">{stat.value}</p>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
