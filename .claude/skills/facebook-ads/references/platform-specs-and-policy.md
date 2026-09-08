# Meta platform specs, campaign structure, testing, and policy (2025–2026)

## Contents
1. Placement and copy specs
2. How the algorithm reads your ads now (Andromeda, Advantage+)
3. Campaign structure recipes by budget
4. Testing, kill and scale rules
5. Metrics targets and diagnostics
6. Ad policy: what gets rejected and how to rewrite
7. Naming convention
8. Launch checklist

## 1. Placement and copy specs
| Element | Spec |
|---------|------|
| Primary text | ~125 characters visible before "…See more" on mobile; Reels shows ~40–72 |
| Headline | 27 chars safe, 40 max before truncation; not shown on IG Reels |
| Description | ~30 chars feed; ~20 per carousel card; often hidden on mobile |
| Feed image | 4:5 (1080×1350) preferred, 1:1 (1080×1080) fine, 16:9 weak |
| Stories / Reels | 9:16 (1080×1920); keep text out of top ~14% and bottom ~20–35% |
| Carousel | 1:1 cards, 2–10 cards, headline ≤ 40 per card, own link per card |
| Video | MP4/MOV, 4:5 for feed and 9:16 for Reels/Stories, captions burned in, ≤ 60s for cold |
| Lead form | instant form or landing page; qualifying questions reduce junk leads |

## 2. How the algorithm reads your ads now
- Advantage+ Sales/Leads campaigns are the default scaling lane. Detailed targeting, custom audiences and lookalikes are *suggestions*; only location and minimum age are hard limits. The creative does the targeting: the ad is shown to people who resemble the people who respond to it.
- Meta's Andromeda retrieval model rewards structurally different creatives in one ad set (a Meta test: 25 diverse creatives in one ad set beat 5×5 by +17% conversions at −16% cost). Diversity means different persona, message, format, and hook, not a colour swap.
- Practical: 5–10 genuinely different ads per ad set for small accounts, 10–20 for larger; aim for ~50 optimisation events per ad set per week to exit learning (budget accordingly, or optimise for a higher-volume event such as leads or add-to-cart when purchase volume is low).
- Meta spends roughly 20–25% of a sales campaign on remarketing automatically. Under ~$50/day, skip a separate retargeting campaign; above that, add one with its own Level-3 copy.
- Budget changes over ~20% in a day reset learning. Scale in steps every 3–4 days.

## 3. Campaign structure recipes
**Under $20/day (one campaign):**
- Campaign: Leads or Sales objective (or Engagement → Messages for local services), Advantage+ campaign budget.
- 1 ad set: location radius + minimum age; Advantage+ audience on. 5–8 ads: 3 static (different formats), 1 carousel, 1–2 videos, 1 native/ugly.
- Read at day 4, act at day 7. No separate retargeting.

**$20–100/day (two lanes):**
- Testing campaign: ad-set budgets, 1 ad set per concept, 3:2:2 flexible ads (3 creatives × 2 texts × 2 headlines), $10–15/day each, ≥5 ad sets if audience-testing.
- Scaling campaign: Advantage+ Sales/Leads, winners moved in after 7 days.
- Optional retargeting ad set: site visitors 30d, engagers 90d, video 50%+ viewers; 10% of budget; Level-3 copy.

**$100+/day:** as above plus 70/20/10 prospecting/testing/retargeting, cost caps once you know your CPA, weekly creative refresh of 2 concepts × 2 hooks × 2 openers.

**Events with a hard date:** 3 phases: announce (weeks 3–2 out: invite + story ads), remind (week 1: proof, "seats filling", speaker/programme), last call (final 72h: countdown with a true reason). Shift budget forward; don't spread it flat.

## 4. Testing, kill and scale rules
- Decide the success metric before launch (CPL, CPA, cost per registration, ROAS).
- Don't judge before ~3 days or ~$30 per ad, whichever is later; don't kill before 7 days unless spend is > 2× target CPA with zero results.
- Green: beats target → hold, then +20% budget every 3 days. Yellow: within 30% of target → let it run, swap the hook. Red: > 2× target after 7 days → pause, keep the learning.
- Fatigue diagnosis (4Pi): CPM and frequency rising together → creative fatigue, ship new angles. CPM rising, frequency flat → competition, improve the hook or move budget. CTR fine, conversions bad → landing page or offer.
- Iterate winners: same body, new hook → same script, new person → mash-up of people → new format. Losers teach what not to show; note the reason in the pack.

## 5. Metrics targets (rules of thumb, adjust per niche)
| Metric | Healthy cold | Investigate |
|--------|--------------|-------------|
| Hook rate (3s views ÷ impressions) | > 30% | < 15% |
| Hold rate (15s ÷ 3s) | > 30% | |
| Outbound CTR (link) | > 1% (0.8% ecom, 1.5%+ local/event) | < 0.5% |
| CPM | niche-dependent | doubling week-over-week with rising frequency |
| Frequency (7d, cold) | < 2 | > 3 |
| Landing page conversion | 3–10% ecom, 20–40% free event/lead form | |
Hook rate and CTR are diagnostics; the only success metric is cost per the thing you actually want.

## 6. Ad policy: rejections and rewrites
| Risk | Why | Rewrite |
|------|-----|---------|
| "Do you struggle with anxiety / debt / your weight?" | implies personal attributes (health, financial, body) about the reader | "For people managing…", "If daily stress is loud…", first-person story |
| "Are you a Christian / over 50 / a single mom?" | religion, age, family status are personal attributes | describe the situation or interest: "families in Riverview", "if Sunday mornings matter to you" |
| Before/after body photos, tape measures, idealised bodies | negative self-perception rules; side-by-side allowed since mid-2026 only without inferiority or efficacy claims | show situations, faces, energy, habits, the crew; testimonials as text with a face |
| "Cure", "clinically proven", "guaranteed results", "lose 20 lbs" | unsubstantiated health/results claims | state process outcomes ("31 of 36 finished"), use guarantees about refunds not results |
| Landing page says something the ad doesn't, or vice versa | landing-page parity | mirror headline and offer |
| Fake urgency, fake countdowns | misleading | true deadlines with the reason |
| Alcohol, dating, credit, housing, employment, politics | special ad categories / age gates | declare the category; targeting shrinks; write accordingly |
| Faith-based events | not restricted, but avoid targeting by religion as an attribute | target geography + interests (community events, family activities); copy can be openly faith-based |
Run this table against every text field, including video spoken lines, on-screen captions,
on-image text, and carousel cards; the primary text is usually the cleanest field and the
video script the dirtiest.
If the user's brief contains a violating element, don't silently drop it: flag it in the strategy summary, explain the rule in one line, and give the compliant version.

## 7. Naming convention
`YYYY-MM-DD_{objective}_{avatar}_{angle}_{format}_{hook}` e.g. `2026-09-15_leads_tampaparents_hardpart_video_q1`. Put the same tag in the ad name and the file name.

## 8. Launch checklist
- [ ] Objective matches the real outcome (Leads/Sales/Registrations, not Engagement)
- [ ] Pixel/CAPI or lead form firing; conversion event selected
- [ ] Location radius + minimum age set; Advantage+ audience on (or interests as suggestions)
- [ ] 5–8 structurally different ads uploaded, 4:5 and 9:16 assets for each
- [ ] Primary text first 125 chars carry the hook; headline ≤ 40; CTA button set
- [ ] Landing page headline matches ad headline; loads under 3s on mobile
- [ ] Policy table reviewed; no personal-attribute "you", no body before/afters, no unproven claims
- [ ] Success metric + kill/scale rule written down
- [ ] Naming convention applied
- [ ] Calendar reminders: day 4 read, day 7 decision, every 3–4 days after
