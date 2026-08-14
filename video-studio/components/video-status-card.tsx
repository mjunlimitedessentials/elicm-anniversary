"use client";

import { useEffect, useState } from "react";
import type { VideoJob } from "@prisma/client";

const STATUS_LABEL: Record<string, string> = {
  queued: "Queued",
  generating: "Generating script & scenes",
  rendering: "Rendering final video",
  completed: "Ready",
  failed: "Failed",
};

export function VideoStatusCard({ initialJob }: { initialJob: VideoJob }) {
  const [job, setJob] = useState(initialJob);

  useEffect(() => {
    if (job.status === "completed" || job.status === "failed") return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/videos/${job.id}`);
      if (res.ok) setJob(await res.json());
    }, 2500);

    return () => clearInterval(interval);
  }, [job.id, job.status]);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
        <span>{job.contentType.replace("-", " ")}</span>
        <span className={job.status === "completed" ? "text-gold" : "text-gray-400"}>
          {STATUS_LABEL[job.status]}
        </span>
      </div>

      <p className="mt-3 text-gray-200">{job.prompt}</p>

      {job.status !== "completed" && job.status !== "failed" && (
        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-hover">
            <div
              className="h-full bg-gold transition-all duration-500"
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">{job.progress}%</p>
        </div>
      )}

      {job.status === "completed" && job.resultUrl && (
        <video
          src={job.resultUrl}
          controls
          className="mt-6 w-full rounded-xl border border-border"
        />
      )}

      {job.status === "failed" && (
        <p className="mt-4 text-sm text-red-400">{job.error ?? "Generation failed."}</p>
      )}
    </div>
  );
}
