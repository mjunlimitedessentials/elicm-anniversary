import type { VideoJobStatus } from "@/lib/video-provider";

const LABEL: Record<VideoJobStatus["status"], string> = {
  queued: "Queued",
  generating: "Generating",
  rendering: "Rendering",
  completed: "Ready",
  failed: "Failed",
};

const COLOR: Record<VideoJobStatus["status"], string> = {
  queued: "text-gray-400",
  generating: "text-gold",
  rendering: "text-gold",
  completed: "text-emerald-400",
  failed: "text-red-400",
};

export function StatusBadge({ status }: { status: VideoJobStatus["status"] }) {
  return (
    <span className={`text-xs font-semibold uppercase tracking-wide ${COLOR[status]}`}>
      {LABEL[status]}
    </span>
  );
}
