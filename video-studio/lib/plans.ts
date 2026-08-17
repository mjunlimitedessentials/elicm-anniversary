export type Plan = {
  id: string;
  name: string;
  blurb: string;
  price: number; // USD / month
  setupFee: number; // one-time USD
  credits: number; // per month
  features: string[];
};

// Mirrors the reference product's single-plan checkout step: one plan is
// offered up front, with upgrades available later from inside the app.
export const PLANS: Plan[] = [
  {
    id: "lite",
    name: "Lite",
    blurb: "For trying the studio on reels and short clips.",
    price: 19,
    setupFee: 9,
    credits: 1000,
    features: [
      "~8 Kling 1080p videos",
      "~25 Nano Banana Pro images",
      "Great for reels, shorts, and testing the studio",
      "1 seat",
      "All premium providers: Kling, Seedance, Veo, Gemini",
    ],
  },
];

export const DEFAULT_PLAN_ID = "lite";

// Illustrative only — the reference plan card advertises "~8 Kling 1080p
// videos" from 1,000 credits, so a flat estimate is used to drive the
// dashboard's credits-remaining meter without a real cost model.
export const CREDITS_PER_VIDEO = Math.round(
  PLANS[0].credits / 8,
);
