import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { VideoRequestForm } from "@/components/video-request-form";

export default function NewVideoPage() {
  return (
    <div className="mx-auto max-w-lg">
      <Link href="/dashboard" className="flex items-center gap-1 text-sm text-gray-400 hover:text-white">
        <ChevronLeft className="h-4 w-4" /> Back to projects
      </Link>
      <h1 className="mt-6 text-2xl font-extrabold">New video</h1>
      <p className="mt-2 text-gray-400">
        Describe what you want — Recreate Studio handles script, voice and render.
      </p>
      <VideoRequestForm />
    </div>
  );
}
