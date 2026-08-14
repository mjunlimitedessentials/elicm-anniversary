"use client";

import type { QuizOption } from "@/lib/onboarding-questions";
import { QuizIcon } from "./quiz-icon";

export function QuizIconRow({
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
      className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-colors ${
        selected ? "border-gold bg-surface" : "border-border bg-surface hover:border-gray-600"
      }`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-hover text-gray-300">
        <QuizIcon name={option.icon} className="h-5 w-5" />
      </span>
      <span className="flex-1">
        <span className="block font-semibold text-white">{option.label}</span>
        {option.subtitle && (
          <span className="mt-0.5 block text-sm text-gray-400">{option.subtitle}</span>
        )}
      </span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-gold bg-gold" : "border-gray-500"
        }`}
      />
    </button>
  );
}
