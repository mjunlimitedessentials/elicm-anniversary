# Recreate Studio

An AI ministry-video production app, modeled on the sign-up → onboarding →
generate flow of prayproductionstudio.com/sign-up (Clerk-powered auth, a
4-step onboarding wizard with an image-card "pick your focus" quiz, then a
dashboard that turns requests into AI-generated videos).

This is a **standalone Next.js app** living in its own folder so it doesn't
touch the ELICM anniversary site elsewhere in this repo.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Clerk** for auth (email/password + Apple/Facebook/Google OAuth + email
  OTP verification) — same provider the reference site uses ("Secured by
  Clerk")
- **Prisma + PostgreSQL** for onboarding answers and video job records
- A **pluggable video-generation provider** (`lib/video-provider.ts`) —
  ships with a working mock provider so the whole flow runs end-to-end with
  zero external keys; swap in a real provider (fal.ai, Runway, Replicate,
  Pika) by implementing the same interface.

## What's implemented

1. `/sign-up`, `/sign-in` — Clerk auth themed to a black/gold dark UI,
   step 1 of 4.
2. `/onboarding` — 7-question quiz engine (image-card multi-select and
   single-select question types), step 2 of 4, with dot pagination matching
   the reference screenshots.
3. `/onboarding/details` — ministry profile (step 3 of 4).
4. `/onboarding/plan` — plan selection (step 4 of 4).
5. `/dashboard` — list of video projects/jobs.
6. `/dashboard/new` — request form (content type from the quiz, prompt,
   style, length) that POSTs to `/api/videos`.
7. `/dashboard/projects/[id]` — polls job status until the video is ready.
8. `/api/videos`, `/api/videos/[id]` — job creation + status, backed by the
   provider abstraction and persisted via Prisma.
9. `/api/onboarding` — persists quiz + profile + plan answers against the
   Clerk user.

## Getting started

```bash
cd video-studio
cp .env.example .env.local   # fill in Clerk + database keys
npm install
npx prisma db push           # creates tables from prisma/schema.prisma
npm run dev
```

You need, at minimum:
- A free Clerk application (clerk.com) for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  / `CLERK_SECRET_KEY`. Enable Email/Password + Google + Facebook + Apple
  under Clerk's "User & Authentication → Social Connections" to match the
  reference sign-up screen.
- A Postgres database (local, Supabase, Neon, etc.) for `DATABASE_URL`.

Without a real video-generation API key, `/dashboard/new` still works end
to end using the mock provider, which fakes progress through
`queued → generating → rendering → completed` and returns a sample video
URL, so you can demo and build against the full flow immediately.

## Wiring a real AI video provider

Implement the `VideoProvider` interface in `lib/video-provider.ts`:

```ts
interface VideoProvider {
  generate(job: VideoJobInput): Promise<{ providerJobId: string }>
  getStatus(providerJobId: string): Promise<VideoJobStatus>
}
```

A stub `FalVideoProvider` is included showing the shape of a real
integration (fal.ai's text-to-video models) — fill in `FAL_API_KEY` and
flip `VIDEO_PROVIDER=fal` in `.env.local` to use it instead of the mock.

## Notes on fidelity to the reference

I could not load prayproductionstudio.com directly from this environment
(egress to that domain is blocked here), so this was built from the
screenshots you shared: dark theme, gold/amber accent, 4-segment top
progress bar, Clerk-branded auth, and the "Pick Your Focus" image-card quiz
(question 1 of 7 shown: Bible Videos / Sermon Jam Videos / Social Media /
Kids Ministry Content). The remaining 6 quiz questions, the "details" and
"plan" steps, and the dashboard were not visible in your screenshots, so
those are original, reasonable placeholders for a ministry-video product —
edit `lib/onboarding-questions.ts` and the `/onboarding/details` and
`/onboarding/plan` pages to match the real copy once you can confirm it.
The logo is a generic placeholder monogram, not a copy of their mark —
swap `components/logo.tsx` and `lib/site-config.ts` for your own branding.
