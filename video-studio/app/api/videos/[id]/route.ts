import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/current-user";
import { getVideoProvider } from "@/lib/video-provider";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const job = await db.videoJob.findFirst({ where: { id: params.id, userId: user.id } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Terminal states don't need a fresh provider lookup.
  if (job.status === "completed" || job.status === "failed" || !job.providerJobId) {
    return NextResponse.json(job);
  }

  const provider = getVideoProvider();
  const status = await provider.getStatus(job.providerJobId);

  const updated = await db.videoJob.update({
    where: { id: job.id },
    data: {
      status: status.status,
      progress: status.progress,
      resultUrl: status.resultUrl ?? job.resultUrl,
      thumbnailUrl: status.thumbnailUrl ?? job.thumbnailUrl,
      error: status.error,
    },
  });

  return NextResponse.json(updated);
}
