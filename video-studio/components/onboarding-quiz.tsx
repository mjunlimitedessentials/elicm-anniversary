"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ONBOARDING_QUESTIONS } from "@/lib/onboarding-questions";
import { QuizImageCard } from "./quiz-image-card";
import { QuizIconRow } from "./quiz-icon-row";

type Answers = Record<string, string[]>;

export function OnboardingQuiz() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);

  const question = ONBOARDING_QUESTIONS[index];
  const selected = answers[question.id] ?? [];
  const canContinue = selected.length > 0;
  const isFirst = index === 0;
  const isLast = index === ONBOARDING_QUESTIONS.length - 1;

  function toggleOption(optionId: string) {
    setAnswers((prev) => {
      const current = prev[question.id] ?? [];
      if (question.multiSelect) {
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [question.id]: next };
      }
      return { ...prev, [question.id]: [optionId] };
    });
  }

  async function finish(finalAnswers: Answers) {
    setSubmitting(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizAnswers: finalAnswers }),
      });
      router.push("/onboarding/plan");
    } finally {
      setSubmitting(false);
    }
  }

  function handleContinue() {
    if (!canContinue) return;
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    finish(answers);
  }

  function handleSkip() {
    const next = { ...answers, [question.id]: [] };
    setAnswers(next);
    if (!isLast) {
      setIndex((i) => i + 1);
      return;
    }
    finish(next);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-16 pt-10">
      <div className="mb-6 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-500">
        <span className="text-gold">Step 2 of 4</span>
        <span>Pick your focus</span>
      </div>

      <div className="mb-8 flex items-center gap-1.5">
        {ONBOARDING_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= index ? "bg-gold" : "bg-surface-hover"}`}
          />
        ))}
        <span className="ml-3 whitespace-nowrap text-xs text-gray-500">
          Question {index + 1} of {ONBOARDING_QUESTIONS.length}
        </span>
      </div>

      <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
        {question.question}
      </h1>
      {question.subtitle && <p className="mt-3 text-gray-400">{question.subtitle}</p>}

      {question.layout === "image-cards" ? (
        <div className="mt-8 grid grid-cols-2 gap-4">
          {question.options.map((option) => (
            <QuizImageCard
              key={option.id}
              option={option}
              selected={selected.includes(option.id)}
              onToggle={() => toggleOption(option.id)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {question.options.map((option) => (
            <QuizIconRow
              key={option.id}
              option={option}
              selected={selected.includes(option.id)}
              onToggle={() => toggleOption(option.id)}
            />
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={!canContinue || submitting}
        onClick={handleContinue}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 font-bold text-black transition-opacity disabled:opacity-40 enabled:hover:opacity-90"
      >
        {submitting ? "Saving..." : "Continue"}
        <ArrowRight className="h-4 w-4" />
      </button>

      {!canContinue && !question.skipLabel && (
        <p className="mt-3 text-center text-sm text-gray-500">Select at least one to continue.</p>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        {!isFirst ? (
          <button
            type="button"
            onClick={() => setIndex((i) => i - 1)}
            className="flex items-center gap-1 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
        ) : (
          <span />
        )}
        {question.skipLabel && (
          <button
            type="button"
            onClick={handleSkip}
            disabled={submitting}
            className="text-gray-400 underline hover:text-white"
          >
            {question.skipLabel}
          </button>
        )}
      </div>
    </div>
  );
}
