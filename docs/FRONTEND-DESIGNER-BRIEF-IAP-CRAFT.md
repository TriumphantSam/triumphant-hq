# Frontend Designer Brief — Triumphant HQ
## Apply IAP-level craftsmanship to `triumphant-hq`

**Repo / local path:** `C:\Users\trium\triumphant-hq`  
**GitHub:** `TriumphantSam/triumphant-hq`  
**Owner:** Adeyemi Olayemi (TriumphantTech)  
**Brief author:** Chief Developer  
**Date:** 21 Sep 2026  
**Audience:** Frontend designer / Antigravity (implement in the existing Next.js app — do not rebuild from scratch)

---

## 0. One-sentence mission

Raise every marketing surface of Triumphant HQ to the **same craft bar** we used when we redesigned Precision Field Academy off **Integrated Aerial Precision (IAP)** — every detail intentional, premium, and coherent — while keeping **Triumphant HQ’s own brand** (editorial light + blue accent), not IAP’s green AgTech look.

---

## 1. What “copy IAP design” means here

### Do this
- Steal **quality, rhythm, spatial discipline, photography treatment, motion taste, and interaction polish** from IAP (`https://www.iaprecision.com`) and from the PFA site that already absorbed that craft.
- Make Triumphant HQ feel like a **top-tier African tech agency site**: cinematic, confident, quiet luxury, zero template smell.

### Do not do this
- Do **not** paste IAP greens (`#022706`, `#32aa00`, `#4bff00`) onto Triumphant HQ.
- Do **not** copy IAP copy, drone imagery, or AgTech IA.
- Do **not** invent a second design system beside the tokens already in `app/globals.css`.
- Do **not** ship “AI slop”: purple-blue mesh blobs, generic 3D icons, uneven card padding, orphan CTAs, mismatched radii, decorative lines that go nowhere.

**Rule of thumb:** Same *atelier*, different *client brand*.

---

## 2. Craft references (open these before touching pixels)

| Priority | Reference | Why |
|---|---|---|
| 1 | Live IAP — `https://www.iaprecision.com` | The craft bar: hero photography, partner strip, dual CTAs, section pacing, trust density |
| 2 | Live PFA — `https://precisionfieldacademy.com` (and workers.dev if custom domain lags) | Proof we already transferred IAP craft into another Triumphant brand successfully |
| 3 | This repo’s `app/globals.css` + `components/Hero.tsx` + `components/Navigation.tsx` + `components/marketing/*` | The **official** Triumphant HQ token + component kit — extend, don’t replace |
| 4 | Homepage `app/page.tsx` | Canonical section order and content spine |

Also compare side-by-side on desktop + iPhone width. Screenshot IAP hero, logo rail, services band, proof band, final CTA — then match the *feeling*, not the hex codes.

---

## 3. Brand system (locked — use these)

### 3.1 Colour tokens (already in CSS)

| Token | Value | Use |
|---|---|---|
| Accent | `#075ee5` | Primary buttons, links, live dots, focus rings |
| Accent hover | `#004bc2` | Hover / pressed primary |
| Secondary | `#1a8fd4` | Soft accent / gradients only |
| Page bg | `#fafbfd` | Default canvas |
| Muted band | `#f2f5fa` / `#f3f6fb` | Alternating sections |
| Surface | `#ffffff` | Cards, panels |
| Text primary | `#0a1220` | Headings, body emphasis |
| Text secondary | `#4a5568` | Body |
| Text muted | `#6b778c` | Meta, captions |
| Glass | `rgba(255,255,255,0.82)` + blur 18px | Nav / sticky chrome |
| Borders | `rgba(15,23,42,0.09)`–`0.14` | Hairlines only |
| Dark CTA band | `#07122a` → `#0c1f45` → `#0a2a66` | Closing CTA only |

Selection colour = accent on white text.

### 3.2 Typography (already wired in `app/layout.tsx`)

| Role | Family | Notes |
|---|---|---|
| Display | **Syne** (`--font-display`) | H1–H3, logo wordmark feel, card titles. Tight tracking (`-0.03em` to `-0.045em`). |
| Body | **DM Sans** (`--font-sans`) | Leads, body, nav, forms. Comfortable 1.7–1.8 line-height on long copy. |
| Mono | **JetBrains Mono** (`--font-mono`) | Step numbers (`01`), proof meta, tiny labels |

**Type scale discipline (match IAP craft density):**
- Hero H1: `clamp(2.35rem, 5vw, 4.4rem)`, weight 800, leading ~1.05
- Section H2: `clamp(2.1rem, 4.2vw, 3.5rem)`, weight 700, leading ~1.05
- Card H3: `clamp(1.35rem, 2vw, 1.7rem)`
- Eyebrow: ~0.72rem, weight 700, tracking `0.18em`, uppercase, accent colour
- Lede / section description: `clamp(1.02rem, 1.5vw, 1.18rem)`, secondary colour

Accent a **single** phrase in big headlines (`.accent-word` / span), never rainbow gradients across whole sentences.

### 3.3 Layout geometry

- Content shell: `width: min(100% - 3rem, 1180px)` (mobile: `100% - 2rem`)
- Section vertical rhythm: `clamp(5rem, 9vw, 8rem)` — do not collapse this
- Card radius: **12px** for buttons/controls; **28px** only for large CTA bands / hero frames
- Hairline grids preferred over floating shadow cards (agency grid / process grid pattern already in CSS)
- Shadows: soft editorial (`--shadow-sm` / `--shadow-md`) — never neon glow on marketing pages

### 3.4 Motion

- Easing: `--ease-out-soft` / `--ease-standard`
- Durations: 180 / 280 / 500ms
- Scroll reveal: `.reveal` system already exists — arm after mount, respect `prefers-reduced-motion`
- Hero: subtle Ken Burns on photography only; no bouncing blobs
- Buttons: `translateY(-2px)` + arrow `translateX(3px)` on hover
- Stagger children 80–110ms — never longer than 400ms total for a row

---

## 4. IAP craft patterns to transplant (detail checklist)

Use this as a **quality audit**. Every pattern below should be visibly true on Triumphant HQ after the pass.

### 4.1 Hero (cinematic, not “template”)
1. Full-bleed real photography (or approved cinematic still), not a flat colour wash.
2. Multi-stop dark gradient overlay for type contrast (top → mid → bottom), plus optional soft accent radial — never a single muddy overlay.
3. Brand lockup / live presence cue above the H1 (dot + wordmark), then **one** sharp promise headline, then one lede ≤ 2 lines.
4. **Dual CTAs:** primary (solid accent) + secondary (ghost/outline). Primary = book/discovery; secondary = explore.
5. Scroll cue at bottom (mouse + label) — tasteful, low opacity.
6. Nav over hero is transparent / light-on-dark; after scroll becomes frosted white glass.

### 4.2 Trust / partner rail
1. Immediately under hero or after first proof strip: logo row of clients/partners.
2. Logos greyscale at rest, slight colour or opacity lift on hover.
3. Even optical sizing; no giant one-off logos breaking the rhythm.
4. Quiet eyebrow: “Trusted by” / “Partners & clients” — not a sales shout.

### 4.3 Section choreography (homepage spine)
Keep the narrative order (refine visuals, don’t reshuffle without reason):

1. Hero  
2. Proof strip (3 cells, hairline dividers)  
3. What we do — SectionHeader + service cards  
4. Local support desk band (photo wash + sticky copy + stats)  
5. Outcomes / results split (copy + large image)  
6. How we work — process steps  
7. Testimonials  
8. SEO snapshot lead magnet band  
9. Locations / service areas  
10. Closing CTA band  
11. Soft resources footer link row  

IAP lesson: each band has **one job**. No band tries to sell services + tell a story + capture email at once.

### 4.4 Cards & grids
1. Prefer **edge-to-edge agency grids** with 1px dividers over scattered floating cards.
2. Hover = background lift / title colour to accent — **not** dramatic scale or coloured shadows.
3. Service cards: image (16:10) → icon → eyebrow → title → promise → text link with arrow.
4. Equal internal padding; titles clamp so a long title doesn’t blow card height unevenly.
5. Text links uppercase micro-label + arrow nudge (existing `.text-link`).

### 4.5 Process / delivery
1. Numbered mono steps (`01`, `02`…) with accent colour.
2. Desktop: horizontal timeline with drawn line animation on enter.
3. Mobile: vertical spine with dots + connecting gradient line.
4. Copy short: title + one sentence. No paragraphs inside steps.

### 4.6 Proof & testimonials
1. Quote stage with calm crossfade (existing testimonial animation).
2. Dot indicators that elongate when active (not tiny circles only).
3. Attribute: name, role, company — never anonymous “Happy Client”.
4. Optional live-dot “in progress / active delivery” only if truthful.

### 4.7 CTA band
1. Dark blue gradient panel, large radius (28px), strong shadow.
2. Eyebrow in soft blue (`#7eb0ff`), white H2, muted white lede.
3. Primary button stays brand blue; secondary is ghost white outline.
4. Align CTA actions to the right on desktop; stack cleanly on mobile.

### 4.8 Navigation & footer
1. Height ~72px; max width aligned to shell.
2. Desktop mega-dropdowns: white panel, soft shadow, numbered items, clear hierarchy (Local Support featured if it stays a product).
3. Mobile: full-screen or large sheet, display font for primary links, muted labels for groups.
4. Footer: multi-column, brand blurb, services, company, legal, contact; no cramped link salad.
5. WhatsApp / reader widgets must not collide with primary CTAs or cookie/consent UI.

### 4.9 Forms & conversion surfaces
1. Light inputs, clear labels, generous hit targets (min 44px).
2. Focus ring: soft accent glow (existing `:focus-visible`).
3. Error states calm and readable — no red panic banners.
4. Success states feel designed (thank-you pages already exist — match tokens).

### 4.10 Imagery rules (critical)
1. Prefer real photography from Triumphant/IAP media libraries over stock clichés.
2. Every photo gets a purposeful crop and an overlay strategy — never raw ungraded dumps.
3. Aspect ratios consistent per component type (hero full-bleed, cards 16:10, outcomes ~4:5).
4. `next/image` with correct `sizes`; no layout shift.
5. No random AI illustrations mixed with photo sections.

---

## 5. Scope of work (ordered)

### Phase A — System hardening (do first)
1. Audit `app/globals.css` tokens vs components; remove leftover dark-glass / neon utilities from marketing routes if they still leak.
2. Normalize button classes (`.button` / `.button-primary` / `.button-secondary` / `.button-ghost`) everywhere — kill one-off inline gradient buttons.
3. Normalize SectionHeader usage on all marketing pages.
4. Confirm fonts load once via `layout.tsx`; no conflicting Google Fonts tags.
5. Align naming in UI: **Triumphant HQ** (decision: pick one lockup — `TriumphantHQ` vs `Triumphant HQ` — and use it everywhere including nav, footer, metadata, OG).

### Phase B — Homepage craft pass
1. Hero photography + overlay + CTAs + scroll cue to IAP bar.
2. Proof strip optical balance.
3. Services grid polish (imagery, hover, links).
4. Local support band (photo wash gradient must keep text WCAG AA).
5. Outcomes split.
6. Process timeline.
7. Testimonials.
8. SEO snapshot band.
9. Locations.
10. CTA band + resources row.
11. Full responsive pass: 1440 / 1024 / 768 / 390.

### Phase C — Inner marketing pages (same system)
Apply the same tokens, headers, cards, CTA bands to:
- `/services` and `/services/[service]` (+ location variants)
- `/work` and case studies
- `/about` (if present) / company story surfaces
- `/contact` + thank-you
- `/industries/[slug]`, `/locations/[slug]`
- Lead tools: `/seo-snapshot`, scorecards, checklists
- Resource / blog listing cards

### Phase D — Product surfaces (keep brand, simplify chrome)
Digital Forge, funnels, invoices, parent-home-routine may hide main nav (already gated) — still use the **same buttons, type, inputs, radii**. No third visual language.

### Phase E — QA & handoff
1. Lighthouse: performance / a11y / SEO — no regressions vs current main.
2. Keyboard nav + focus visible.
3. Reduced motion.
4. Screenshot pack (desktop + mobile) for Adeyemi review before merge.

---

## 6. Content & tone (design implications)

- Voice: calm expertise, Ibadan-rooted, globally sharp. Short sentences.
- Headlines sell **outcomes**, not tool lists.
- Avoid hype adjectives (“revolutionary”, “cutting-edge”, “synergy”).
- Local Support is a **first-class** product lane — design it with equal dignity to agency services (IAP treats Hire vs Buy as peers; we treat Agency vs Local Support as peers).

---

## 7. Technical constraints

- Stack: **Next.js (App Router) + Tailwind v4 + existing CSS component layer** in `app/globals.css`.
- Prefer extending existing classes (`.section-shell`, `.agency-grid`, `.cta-band`, `.reveal`, etc.) over new one-off CSS files.
- No new UI kit dependency unless Adeyemi approves.
- Keep SEO helpers (`buildPageMetadata`, JSON-LD) intact.
- Do not break API routes under `app/api/**`.
- Animations must not block LCP; hero image stays `priority`.

---

## 8. Anti-patterns (reject in review)

- Purple/pink AI gradients, floating glassmorphism orbs, particle walls
- Mixed corner radii on the same page (8 / 12 / 16 / 24 / 999 without role)
- Cards with different padding in one grid
- Primary buttons that aren’t `#075ee5`
- Thin grey text on grey backgrounds
- Stock “handshake in suit” or “laptop with charts” overload without brand context
- Auto-playing noisy video behind copy
- Cookie-cutter Icon + title + blurb rows with no photography
- Infinite scroll logo marquees that distract from CTAs
- Hard horizontal scroll on mobile from 100vw mistakes

---

## 9. Acceptance criteria (definition of done)

The pass is done when Adeyemi / Chief Developer can say yes to all of these:

1. **Side-by-side:** IAP homepage and Triumphant HQ homepage feel like the same *craft tier* (spacing, type, photo treatment, CTA clarity) even though colours differ.  
2. **Token fidelity:** No rogue colours outside the locked palette on marketing pages.  
3. **Nav behaviour:** Transparent over home hero → frosted white on scroll; correct on inner pages.  
4. **Dual CTA clarity:** Every major band ends with an obvious next step.  
5. **Mobile:** 390px width — no overflow, tap targets ≥ 44px, type readable without pinch.  
6. **Motion:** Reveals work; reduced-motion users see static content.  
7. **A11y:** Contrast AA for text on photo washes; focus rings visible.  
8. **Consistency:** Services, work, contact, SEO tools share the same section header + button + card language.  
9. **No AI-slop tells** in a 10-second squint test.  
10. **Handoff:** PR with before/after screenshots + short note of what changed.

---

## 10. Deliverables from the designer

1. Implementation PR(s) against `TriumphantSam/triumphant-hq` (or local branch Adeyemi names).  
2. Before/after screenshot set (home + 2 inner pages, desktop + mobile).  
3. Short changelog: tokens touched, components refactored, pages completed.  
4. List of any missing photography / logo assets Adeyemi must supply (paths preferred under existing `/public/images`).

---

## 11. Suggested build order for the designer (day plan)

**Day 1:** Phase A system hardening + Hero + Nav glass states.  
**Day 2:** Homepage bands 2–6 (proof → process).  
**Day 3:** Homepage bands 7–11 + footer polish.  
**Day 4:** Services + Work listing/detail craft.  
**Day 5:** Contact, SEO snapshot, locations; QA + screenshots.

If time is short: **Days 1–3 only** (homepage to IAP bar) is the minimum valuable ship.

---

## 12. Asset asks (flag early)

Designer should list gaps immediately. Likely needs:
- Final Triumphant HQ logo SVG (light + dark / mono)
- 1–2 cinematic hero stills (agency / Ibadan tech atmosphere)
- Client logos (SVG or transparent PNG) for trust rail
- Service card photography (4 disciplines)
- Team / office / local-support desk imagery for authenticity

Place new files under `public/images/` with kebab-case names; do not commit huge unoptimized RAW files.

---

## 13. Contact for decisions

- **Product / priority:** Adeyemi Olayemi  
- **Brief / review:** Chief Developer (this agent)  
- **Implementation:** Frontend designer / Antigravity  

When blocked on brand choice (lockup spelling, logo mark), ask Adeyemi once with a widget-style A/B — do not guess twice.

---

## 14. Paste-ready kickoff message (send this to the designer)

> Please upgrade Triumphant HQ (`C:\Users\trium\triumphant-hq`) to the same craftsmanship bar as IAP (`iaprecision.com`) — the same standard we used for Precision Field Academy. Keep Triumphant HQ’s editorial light theme and blue accent (`#075ee5`); do not copy IAP greens. Work inside the existing Next.js tokens in `app/globals.css` and components. Every detail matters: hero photography + overlays, frosted nav states, hairline agency grids, Syne/DM Sans hierarchy, dual CTAs, process timeline, proof/testimonials, dark CTA band, mobile polish, and zero AI-slop. Follow `docs/FRONTEND-DESIGNER-BRIEF-IAP-CRAFT.md` end-to-end. Start with Phase A + homepage, then services/work/contact. Ship with before/after screenshots.

---

*End of brief.*

