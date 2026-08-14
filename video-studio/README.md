# Recreate Studio

An AI ministry-video production app, recreating the sign-up → onboarding →
plan → checkout → generate flow of prayproductionstudio.com/sign-up
(Clerk-powered auth with email OTP, a 4-step onboarding wizard, then a
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
- A **pluggable billing provider** (`lib/billing-provider.ts`) — a mock
  checkout screen by default, or real Stripe Checkout when
  `STRIPE_SECRET_KEY` is set.

## The flow, matched to the reference product

1. **`/sign-up`** — step 1 of 4. Clerk auth themed black/gold: Apple /
   Facebook / Google OAuth, or first/last name + email + password. Clerk's
   built-in email OTP screen follows automatically.
2. **`/onboarding`** — step 2 of 4, "Pick your focus". A 7-question quiz
   engine with dot pagination, mixing two layouts:
   - **image-cards** (question 1: *"What are you most interested in using
     Recreate Studio for?"* — Bible Videos / Sermon Jam Videos / Social
     Media / Kids Ministry Content, multi-select)
   - **icon-list** rows for questions 2–7 (*Who will see this?*, *What do
     you want to walk away with today?*, *When do you need the first
     piece?*, *What AI video tools are you using now?* — with a "I'm not
     using any yet" skip link, *What's your skill level?*, *What's your
     current occupation?*)
   Data lives in `lib/onboarding-questions.ts`.
3. **`/onboarding/plan`** — step 3 of 4, "Choose your plan". Single Lite
   plan card ($19/mo, $9 one-time setup, 1,000 credits/mo, listing the real
   provider names from your screenshot: Kling, Seedance, Veo, Gemini, Nano
   Banana Pro). Config lives in `lib/plans.ts`.
4. **`/onboarding/checkout`** → **`/onboarding/checkout/mock`** — step 4 of
   4, "secure checkout". Redirects to real Stripe Checkout if
   `STRIPE_SECRET_KEY` is set, otherwise to a mock card-entry screen that
   completes instantly (no real charge).
5. **`/dashboard`** — list of video projects/jobs.
6. **`/dashboard/new`** — request form (content type from the quiz, prompt,
   style, length) that POSTs to `/api/videos`.
7. **`/dashboard/projects/[id]`** — polls job status until the video is
   ready.

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

Without a video-generation API key or a Stripe key, the whole flow —
sign-up through checkout through a finished "video" — still runs end to
end on the bundled mock providers, so you can demo and build against it
immediately.

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
The reference product's plan card lists Kling, Seedance, Veo and Gemini as
providers — swap in whichever of those you have API access to.

## Wiring real billing

Set `STRIPE_SECRET_KEY` in `.env.local` and `/onboarding/checkout` will
create a real Stripe Checkout session instead of using the mock screen
(see `lib/billing-provider.ts`). Before going live, add a
`checkout.session.completed` webhook at
`app/api/webhooks/stripe/route.ts` to mark `checkoutCompletedAt` — the
mock provider's `/api/checkout/complete` route trusts the client, which is
fine for a demo but not for real payments.

## Notes on fidelity to the reference

I couldn't load prayproductionstudio.com directly from this environment
(egress to that domain is blocked here), so this was built entirely from
the screenshots you shared — sign-up, email verification, all 7 onboarding
questions, and the plan/checkout step. The dashboard and video-request
flow past that point weren't in your screenshots, so those are original,
reasonable designs for a ministry-video product — adjust
`app/dashboard/**` once you can confirm the real copy/layout.

The logo is a generic placeholder monogram, not a copy of their mark —
swap `components/logo.tsx` and `lib/site-config.ts` for your own branding.
