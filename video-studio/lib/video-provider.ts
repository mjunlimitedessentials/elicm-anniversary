export type VideoJobInput = {
  contentType: string;
  prompt: string;
  style?: string;
  durationSeconds: number;
};

export type VideoJobStatus = {
  status: "queued" | "generating" | "rendering" | "completed" | "failed";
  progress: number; // 0-100
  resultUrl?: string;
  thumbnailUrl?: string;
  error?: string;
};

export interface VideoProvider {
  generate(job: VideoJobInput): Promise<{ providerJobId: string }>;
  getStatus(providerJobId: string): Promise<VideoJobStatus>;
}

/**
 * Zero-setup provider that simulates a realistic render pipeline purely
 * from elapsed time, so the full product flow (request -> poll -> result)
 * works without any external API key. Swap VIDEO_PROVIDER=fal (or your
 * own) in .env.local once you're ready to generate real video.
 */
class MockVideoProvider implements VideoProvider {
  async generate(job: VideoJobInput) {
    // Encode the start time + duration into the "provider job id" so status
    // lookups are stateless (no server-side job store needed for the mock).
    const startedAt = Date.now();
    const providerJobId = `mock_${startedAt}_${encodeURIComponent(job.contentType)}`;
    return { providerJobId };
  }

  async getStatus(providerJobId: string): Promise<VideoJobStatus> {
    const startedAt = Number(providerJobId.split("_")[1] ?? Date.now());
    const elapsedMs = Date.now() - startedAt;

    const stages = [
      { until: 3_000, status: "queued" as const },
      { until: 12_000, status: "generating" as const },
      { until: 20_000, status: "rendering" as const },
    ];

    for (const stage of stages) {
      if (elapsedMs < stage.until) {
        const stageStart = stages[stages.indexOf(stage) - 1]?.until ?? 0;
        const progress = Math.round(
          ((elapsedMs - stageStart) / (stage.until - stageStart)) * 33 +
            stages.indexOf(stage) * 33,
        );
        return { status: stage.status, progress: Math.min(99, Math.max(1, progress)) };
      }
    }

    return {
      status: "completed",
      progress: 100,
      resultUrl:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      thumbnailUrl:
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4#t=0.5",
    };
  }
}

/**
 * Example real integration against fal.ai's queue API. Fill in FAL_API_KEY
 * and point VIDEO_PROVIDER=fal to use this instead of the mock. Swap the
 * model endpoint for whichever text-to-video model you've licensed.
 */
class FalVideoProvider implements VideoProvider {
  private apiKey = process.env.FAL_API_KEY;
  private model = "fal-ai/fast-animatediff/text-to-video";

  async generate(job: VideoJobInput) {
    if (!this.apiKey) throw new Error("FAL_API_KEY is not set");

    const res = await fetch(`https://queue.fal.run/${this.model}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: job.prompt,
        video_length: job.durationSeconds,
        style: job.style,
      }),
    });

    if (!res.ok) {
      throw new Error(`fal.ai request failed: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as { request_id: string };
    return { providerJobId: data.request_id };
  }

  async getStatus(providerJobId: string): Promise<VideoJobStatus> {
    if (!this.apiKey) throw new Error("FAL_API_KEY is not set");

    const res = await fetch(
      `https://queue.fal.run/${this.model}/requests/${providerJobId}/status`,
      { headers: { Authorization: `Key ${this.apiKey}` } },
    );
    const data = (await res.json()) as {
      status: "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
      video_url?: string;
      thumbnail_url?: string;
      error?: string;
    };

    const map: Record<string, VideoJobStatus["status"]> = {
      IN_QUEUE: "queued",
      IN_PROGRESS: "generating",
      COMPLETED: "completed",
      FAILED: "failed",
    };

    return {
      status: map[data.status] ?? "queued",
      progress: data.status === "COMPLETED" ? 100 : data.status === "IN_PROGRESS" ? 60 : 5,
      resultUrl: data.video_url,
      thumbnailUrl: data.thumbnail_url,
      error: data.error,
    };
  }
}

export function getVideoProvider(): VideoProvider {
  return process.env.VIDEO_PROVIDER === "fal" ? new FalVideoProvider() : new MockVideoProvider();
}
