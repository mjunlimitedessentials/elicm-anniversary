"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

const CONTENT_TYPES = [
  { id: "bible-videos", label: "Bible Video" },
  { id: "sermon-jam", label: "Sermon Jam" },
  { id: "social-media", label: "Social Media Clip" },
  { id: "kids-ministry", label: "Kids Ministry" },
];

const STYLES = ["Cinematic realism", "Illustrated", "Motion graphics", "Documentary"];

export function VideoRequestForm() {
  const router = useRouter();
  const [contentType, setContentType] = useState(CONTENT_TYPES[0].id);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(STYLES[0]);
  const [durationSeconds, setDurationSeconds] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentType, prompt, style, durationSeconds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.formErrors?.[0] ?? "Could not start generation");
      router.push(`/dashboard/projects/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div>
        <label className="mb-2 block text-sm text-gray-400">Content type</label>
        <div className="grid grid-cols-2 gap-3">
          {CONTENT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setContentType(type.id)}
              className={`rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                contentType === type.id
                  ? "border-gold bg-surface text-gold"
                  : "border-border bg-surface text-gray-300 hover:border-gray-600"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-400">
          Describe the video you want
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          minLength={3}
          rows={4}
          placeholder="e.g. A 60-second retelling of David and Goliath, cinematic, for a Sunday kids service."
          className="w-full rounded-2xl border border-border bg-surface px-5 py-4 text-white outline-none focus:border-gold"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm text-gray-400">Visual style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-full border border-border bg-surface px-5 py-3 text-white outline-none focus:border-gold"
          >
            {STYLES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-gray-400">Length (seconds)</label>
          <input
            type="number"
            min={5}
            max={600}
            value={durationSeconds}
            onChange={(e) => setDurationSeconds(Number(e.target.value))}
            className="w-full rounded-full border border-border bg-surface px-5 py-3 text-white outline-none focus:border-gold"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={submitting || prompt.length < 3}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 font-bold text-black transition-opacity disabled:opacity-40 enabled:hover:opacity-90"
      >
        {submitting ? "Starting..." : "Generate video"}
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
