import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import { getOrCreateUser } from "@/lib/current-user";
import { VideoStatusCard } from "@/components/video-status-card";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const user = await getOrCreateUser();
  if (!user) notFound();

  const job = await db.videoJob.findFirst({ where: { id: params.id, userId: user.id } });
  if (!job) notFound();

  return (
    <main className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-lg">
        <Link href="/dashboard" className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
          <ChevronLeft className="h-4 w-4" /> Back to projects
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold">Project</h1>
        <div className="mt-6">
          <VideoStatusCard initialJob={job} />
        </div>
      </div>
    </main>
  );
}
