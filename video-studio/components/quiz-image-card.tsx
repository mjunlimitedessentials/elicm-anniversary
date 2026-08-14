"use client";

import { Check } from "lucide-react";
import type { QuizOption } from "@/lib/onboarding-questions";

// Deterministic placeholder gradient per option, so cards look distinct
// without shipping stock photography. Replace with real imagery by setting
// option.imageUrl.
function gradientFor(id: string) {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) % 360;
  const hue2 = (hash + 55) % 360;
  return `linear-gradient(135deg, hsl(${hash} 45% 18%), hsl(${hue2} 55% 10%))`;
}

export function QuizImageCard({
  option,
  selected,
  onToggle,
}: {
  option: QuizOption;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`group relative aspect-[4/5] overflow-hidden rounded-2xl border text-left transition-all ${
        selected ? "border-gold shadow-gold-glow" : "border-border hover:border-gray-600"
      }`}
      style={{
        backgroundImage: option.imageUrl
          ? `url(${option.imageUrl})`
          : gradientFor(option.id),
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />
      <div
        className={`absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? "border-gold bg-gold" : "border-white/70 bg-black/30"
        }`}
      >
        {selected && <Check className="h-4 w-4 text-black" strokeWidth={3} />}
      </div>
      <span className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white">
        {option.label}
      </span>
    </button>
  );
}
