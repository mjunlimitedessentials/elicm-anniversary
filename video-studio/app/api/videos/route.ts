import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/current-user";
import { getVideoProvider } from "@/lib/video-provider";

const CreateJobSchema = z.object({
  contentType: z.string().min(1),
  prompt: z.string().min(3).max(2000),
  style: z.string().optional(),
  durationSeconds: z.number().int().min(5).max(600).default(30),
});

export async function POST(req: Request) {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = CreateJobSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const job = await db.videoJob.create({
    data: { userId: user.id, ...parsed.data },
  });

  try {
    const provider = getVideoProvider();
    const { providerJobId } = await provider.generate(parsed.data);
    const updated = await db.videoJob.update({
      where: { id: job.id },
      data: { providerJobId, status: "generating" },
    });
    return NextResponse.json(updated, { status: 201 });
  } catch (err) {
    const failed = await db.videoJob.update({
      where: { id: job.id },
      data: { status: "failed", error: err instanceof Error ? err.message : "Unknown error" },
    });
    return NextResponse.json(failed, { status: 502 });
  }
}

export async function GET() {
  const user = await getOrCreateUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const jobs = await db.videoJob.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(jobs);
}
