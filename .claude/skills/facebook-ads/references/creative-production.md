# Creative production: static images, carousels, video

The copy is only half the ad. On Meta the creative is the targeting: the algorithm shows
the ad to people who look like the people who stop on it, so the visual decides who sees it.
Every ad in a pack needs a creative brief specific enough that the user (or a designer, or an
image model) can build it without asking a question.

## Contents
1. Sizes and safe zones
2. What makes a static image stop the scroll
3. Static formats that reliably work (with build notes)
4. Carousel design
5. Video ads: structure, scripting, filming on a phone
6. Writing image-generation prompts
7. Canva build steps

## 1. Sizes and safe zones
| Placement | Ratio | Pixels | Notes |
|-----------|-------|--------|-------|
| Feed (FB + IG) | 4:5 | 1080×1350 | Default for static. Takes the most screen. |
| Feed square | 1:1 | 1080×1080 | Required for carousel cards. |
| Stories / Reels | 9:16 | 1080×1920 | Keep text out of top 250px and bottom 340px (UI overlays). |
| Video feed | 4:5 or 1:1 | as above | Upload 9:16 too; Meta crops badly on its own. |

Ship every static in 4:5 and 9:16. Ship every video in 9:16 and 4:5. Name files
`{angle}_{hook}_{ratio}.png`.

## 2. What makes a static stop the scroll
- **One idea per image.** The viewer gets ~0.4 seconds. If the image needs explaining, it lost.
- **On-image text is the hook, restated.** Max 6–8 words, big enough to read on a phone at arm's length (headline ≥ 60px on a 1080 canvas). The primary text and the image should say the same thing in different words.
- **Contrast beats beauty.** A face, a bold colour block, or an unexpected object outperforms polished stock photography. Native, slightly imperfect photos ("ugly ads") often win because they don't look like ads.
- **Faces and eyes.** A real person looking at camera or at the product pulls attention. Founder's face > model's face for small businesses.
- **Show the after state, or the problem, never the feature list.** A laptop stand ad shows a person sitting upright and relaxed, or a person hunched in pain, not a product render on white.
- **Avoid the brand-first layout** (logo top, product middle, tagline bottom). Logo goes small in a corner or nowhere; the page name already shows it.
- **Text-to-image ratio**: Meta no longer penalises text-heavy images, but readability still matters. Text over a busy photo needs a solid or gradient backing block.

## 3. Static formats that reliably work
Pick 3–5 different formats per pack; format variety is how you test creative, not colour swaps.
| Format | What it is | Build notes |
|--------|------------|-------------|
| Big-text callout | Solid background, one huge line of text | Brand colour bg, white text, 1 small product/person photo bottom-right. Fastest to make. |
| Screenshot / native | Looks like a text message, note app, tweet, Google review | Real review screenshot with name blurred; or mock the layout in Canva. Extremely high CTR on cold. |
| Us vs them / before-after (compliant) | Two-panel comparison of situations, not bodies | For health/fitness: compare "Monday 6am with no plan" vs "Monday 6am with a coach text". Never body images. |
| Testimonial card | Quote + face + 5 stars | Keep quote ≤ 20 words, pull the most specific line. |
| Founder photo + hook | Candid phone photo of owner, hook text over it | Reads as organic. Great for local/service businesses. |
| Product-in-use lifestyle | Real customer or founder using it in context | Add one on-image line naming the benefit. |
| List / checklist | "3 signs you need X" as a graphic | Use for problem-aware audiences. |
| Meme / pattern interrupt | Familiar meme format with the pain point | Only when brand voice allows; test cheaply. |
| Event poster | Date, place, one reason to come, one face | For events: date and "free" must be legible at thumbnail size. |

## 4. Carousel design
- Card 1 is 100% of the job: it is a static ad on its own. Hook on card 1; if card 1 doesn't stop them, cards 2–10 never exist.
- Use one of these sequencing logics: (a) problem → agitate → solution → proof → CTA; (b) one product per card (catalogue); (c) step-by-step "how it works"; (d) FAQ / objections, one per card; (e) a single panoramic image split across cards (curiosity swipe).
- Each card: its own headline (≤ 40 chars) and link. Keep description short or off.
- Last card is always a direct CTA card with the offer and the button text repeated on-image.
- 3–5 cards for cold traffic, up to 10 for catalogue/retargeting.

## 5. Video ads
### Structure (any length)
| Beat | Time | Job |
|------|------|-----|
| Hook | 0–3s | Visual + spoken + on-screen text hit at once. Name the who or the problem. Never start with a logo or "Hi, I'm…". |
| Re-hook / promise | 3–8s | Why keep watching: what they'll get by the end. |
| Body | 8–40s | Problem → why it persists → the mechanism/solution → proof. One idea per 5 seconds. Change the shot every 2–4s. |
| Offer + CTA | last 5–10s | Say exactly what to do and what happens next. Put the CTA on-screen. |
Targets: 15–30s for cold prospecting, 30–60s for offer explanation, 60–90s for founder story or VSL-style on warm audiences.

### Script table (use this exact layout so it's filmable)
| Time | Shot (what we see) | Spoken line | On-screen text |
Every spoken line under ~12 words. Write the way the founder talks. Add captions to everything; most watch on mute.

### Hook types for video (rotate across scripts)
- Callout: "If you're a mom in Tampa who…"
- Contrarian: "Stop stretching your neck. It's not the problem."
- Result-first: "Here's what 6 weeks looks like." (show the *situation*, not a body)
- Question: "Why does your laptop make your shoulders hurt by 2pm?"
- Story: "Three weeks ago I couldn't…"
- Demonstration: product doing the thing, no talking for 2s, then voice.
- Social proof: "42 people signed up last week, here's why."

### Filming on a phone (give this to the user)
- Vertical, 1080p or 4K, 30fps. Wipe the lens.
- Face the window (light on the face), never window behind.
- Phone at eye level; prop it on a shelf or use a $15 tripod.
- Record 3 takes of each line, read from the script table, don't memorise.
- B-roll list: 5–8 clips of 5s each (product in use, workspace, walking in, hands, the event venue, the group). Editors and Meta's own tools need these to cut every 3s.
- Record clean audio in a quiet room; a $20 lav mic doubles perceived quality.
- Deliver a cover frame: the best face+text frame, exported as a 9:16 image.

### UGC-style variants
Write 2–3 scripts as if a customer filmed them: casual, first-person, "I was skeptical", unboxing/first use, honest one drawback and why it didn't matter.

## 6. Writing image-generation prompts
When the user has no photos, write a prompt per image with: subject + action, setting, lighting,
camera (e.g. "shot on iPhone, candid"), mood, colour palette, aspect ratio, and "no text" (add
text in Canva afterwards, generated text is unreliable). Example:
`Candid iPhone photo of a woman in her 30s at a kitchen table working on a laptop raised on a slim aluminium stand, sitting upright and relaxed, morning window light, warm neutral tones, shallow depth of field, 4:5, no text, no logos`
Never generate fake testimonial faces presented as real customers; use illustrated or clearly stylised imagery for proof-type cards if no real photo exists.

## 7. Canva build steps (for users who will make it themselves)
1. Create design → Custom size 1080×1350.
2. Background: brand colour or the photo; add a rectangle with 60–80% opacity behind any text.
3. Add heading text: the on-image hook, bold sans (Inter, Montserrat, Anton), size 90–130, max 3 lines, left-aligned, 80px margin.
4. Add the photo/person, right or bottom. Crop tight to the face.
5. Optional: small logo, 120px wide, bottom-left. Optional CTA pill ("Register free →").
6. Resize → 1080×1920 for stories; move text into the middle 60% of the canvas.
7. Download PNG. Check on your phone before uploading.
