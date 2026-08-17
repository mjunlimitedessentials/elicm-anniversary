import Link from "next/link";
import type { VideoJob } from "@prisma/client";
import { Play, AlertTriangle, Loader2 } from "lucide-react";
import { gradientFor } from "@/lib/gradient";
import { StatusBadge } from "./status-badge";

export function ProjectCard({ job }: { job: VideoJob }) {
  return (
    <Link
      href={`/dashboard/projects/${job.id}`}
      className="group overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-gray-600"
    >
      <div
        className="relative flex aspect-video items-center justify-center"
        style={{ backgroundImage: gradientFor(job.id) }}
      >
        {job.status === "completed" && (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white transition-transform group-hover:scale-110">
            <Play className="h-5 w-5" fill="currentColor" />
          </span>
        )}
        {(job.status === "queued" || job.status === "generating" || job.status === "rendering") && (
          <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
        )}
        {job.status === "failed" && <AlertTriangle className="h-6 w-6 text-red-400" />}

        <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium capitalize text-gray-200">
          {job.contentType.replace("-", " ")}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <StatusBadge status={job.status} />
          <span className="text-xs text-gray-500">
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-gray-200">{job.prompt}</p>

        {job.status !== "completed" && job.status !== "failed" && (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-hover">
            <div
              className="h-full bg-gold transition-all"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
