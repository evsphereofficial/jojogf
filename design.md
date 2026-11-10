# BIZARRE LOVE — OUR BIZARRE ADVENTURE (VOL. 06)

## Design & Implementation Specification

**Status:** ACTIVE — authoritative design document. Update this file when significant
architectural or creative decisions change. Do not implement components before this document exists.

**Project root:** `D:\Programming\ExtraWebsite`

---

## 1. PROJECT OVERVIEW

### 1.1 Purpose

BIZARRE LOVE is a personalized six-month-anniversary gift website: a continuous, scroll-driven,
cinematic manga experience told in nine chapters. It transforms the original "nine slides, nine
favorite characters" concept into one coherent interactive narrative.

### 1.2 Target audience

- **Primary:** one person — a JoJo's Bizarre Adventure fan receiving the gift. Must feel personal,
  surprising, and rewarding to explore top to bottom.
- **Secondary:** friends/family shown the link on desktop and mobile. Must be legible and navigable
  without instructions.

### 1.3 Experience goals

1. Feel like **a living manga volume**, not a slideshow or decorated landing page.
2. **Explosive opening → playful adventurous middle → intimate emotional chapters → unforgettable ending.**
3. Every animation must serve atmosphere, narrative progression, attention direction, spatial
   continuity, manga identity, or a meaningful interaction — otherwise it does not ship.
4. Visual spectacle never breaks narrative coherence, usability, accessibility, or mobile performance.
5. All personal content is **placeholder-driven and replaceable** without touching animation logic.

### 1.4 Non-goals

- Reproducing copyrighted JoJo/Spider-Verse artwork (inspiration only, original compositions).
- Generic romantic tropes (pastel pink, floating hearts, particle confetti, template sections).
- Photorealistic 3D, expensive post-processing, or full-page scroll hijacking.

---

## 2. CREATIVE DIRECTION

Three complementary visual languages, deliberately layered:

### 2.1 A — JoJo's Bizarre Adventure (identity)

- Exaggerated dramatic compositions, angular silhouettes, strong foreshortening.
- Oversized expressive typography, theatrical chapter introductions ("CHAPTER 01 — THE AWAKENING").
- Manga speed lines, Japanese-inspired SFX typography (ゴゴゴ, ドドド rendered as original
  Latin-graphic equivalents such as "GOROGORO", "DODODO" to avoid shipping copyrighted glyphs as art).
- High-contrast color pairing, strong editorial/grid composition.
- Per-chapter character-inspired thematic variation (9 placeholder themes).

### 2.2 B — Into the Spider-Verse (motion language)

- Halftone / Ben-Day dot shading, offset-printing misregistration, chromatic red/cyan channel split.
- Frame-stepped animation for decorative elements (~12 visual fps) while camera/UI stay smooth.
- Layered parallax, perspective distortion, kinetic typography, dynamic camera moves.
- Motion trails and graphic impact frames used sparingly at major transitions.

### 2.3 C — Neo-brutalism (interface structure)

- Thick black borders, hard rectangular panels, solid flat colors, zero/minimal border radius.
- Hard offset shadows (`6px 6px 0`), exposed grids, asymmetrical layouts.
- Oversized navigation markers, graphic labels, chapter numbers as design elements.

### 2.4 Reference composition (from supplied reference)

Yellow ground, black BIZARRE LOVE wordmark, small VOL. 06 badge, five flat swatches, large black
content panel, yellow chapter metadata, large white type, one italic yellow emphasis word, compact
tagline, yellow directional arrow. This drives hierarchy and framing — it is **not** reproduced statically.

### 2.5 Creative do / don't

| Do | Don't |
|---|---|
| Flat saturated surfaces, texture for depth | Gradients as primary surface treatment |
| One strong focal move per scene | Five competing animations in one viewport |
| Purple never appears | Purple accents of any kind |
| Red = drama, cyan = secondary energy/depth | Red/cyan on body text permanently |
| Chapter personality within global identity | Chapters that abandon the global palette |

---

## 3. COLOR SYSTEM (EXACT VALUES — LOCKED)

| Token | HEX | Purpose |
|---|---|---|
| `--color-primary` Primary Yellow | `#F4D94E` | Brand identity, hero grounds, highlights, active states |
| `--color-ink` Ink Black | `#141414` | Text, dark surfaces, outlines, borders |
| `--color-paper` Paper Cream | `#F7F1DF` | Manga paper, quiet sections, content panels |
| `--color-impact` Impact Red | `#EC3C43` | Dramatic accents, impact frames, danger/emphasis |
| `--color-electric` Electric Cyan | `#16B8B1` | Secondary accents, chromatic separation, depth cues |

### 3.1 Distribution (directional)

35% yellow · 35% black · 20% cream · 5% red · 5% cyan.

### 3.2 Color rules

1. No purple as a default accent — ever.
2. No gradients as primary surface treatment; flat fills first.
3. Maintain foreground/background contrast ≥ 4.5:1 for body text (measured: yellow/ink 13.1:1,
   paper/ink 15.6:1, ink/impact 4.7:1, ink/electric 7.5:1 — all pass AA).
4. Red reserved for dramatic emphasis; cyan for secondary energy and chromatic effects.
5. Chapters may reinterpret the palette but must keep yellow+ink as the identity anchor.
6. Depth comes from textures (halftone, grain, screentone), not gradients.

### 3.3 Tailwind exposure

Tokens live as CSS custom properties in `src/styles/tokens.css`, are mapped in Tailwind v4's
`@theme` block in `globals.css`, and are consumed only via semantic utilities
(`bg-primary`, `text-ink`, `border-ink`, `shadow-comic`, …). **No raw hex values inside components.**

---

## 4. TYPOGRAPHY SYSTEM

### 4.1 Roles & fonts (next/font/google, self-hosted at build)

| Role | Font | Weights | Usage |
|---|---|---|---|
| Display | **Anton** | 400 | Hero titles, chapter names, impact type, oversized numerals |
| Interface/Body | **Space Grotesk** | 400/500/700 | Body, nav, metadata, captions, labels |
| Manga accent | **Playfair Display** Italic | 700i/900i | Single emphasis words, romantic declarations, SFX-adjacent flourishes |

Fallbacks: `Anton → Impact, Haettenschweiler, sans-serif`; `Space Grotesk → system-ui`; 
`Playfair Display → Georgia, serif`.

### 4.2 Type scale (fluid, clamp-based — stored as tokens)

| Token | Size | Use |
|---|---|---|
| `--text-display-xl` | `clamp(3.5rem, 12vw, 11rem)` | Hero wordmark, TO BE CONTINUED |
| `--text-display-lg` | `clamp(2.75rem, 8vw, 7rem)` | Chapter titles |
| `--text-display-md` | `clamp(2rem, 5vw, 4rem)` | Section declarations |
| `--text-heading` | `clamp(1.375rem, 3vw, 2.25rem)` | Sub-headings, panel titles |
| `--text-body` | `clamp(1rem, 1vw + 0.8rem, 1.125rem)` | Body copy |
| `--text-label` | `clamp(0.6875rem, 1vw, 0.8125rem)` | Uppercase tracked labels, metadata |

Letter-spacing: display `0.01em`; labels `0.18em` uppercase; body `0`.

### 4.3 Typographic behaviors (implemented once, reused)

- Character stagger entrances (GSAP `SplitText`-style manual char split, display only).
- Word-by-word reveals for emotional lines (Ch05/Ch08).
- Masked (`clip-path` / overflow-hidden) line reveals for headings.
- Scale-impact entrances (`1.35 → 1`) with hard shadow snap on chapter titles.
- Perspective rotation on transition type (rotateX/Y ≤ 8°).
- **Never** aggressively animate long paragraphs; body copy is static or gently faded.

---

## 5. DESIGN TOKENS

Defined in `src/styles/tokens.css`:

### 5.1 Spacing (8px base, exposed as Tailwind-compatible scale)

`--space-1: 4px` … `--space-2: 8px`, `--space-4: 16px`, `--space-6: 24px`, `--space-8: 32px`,
`--space-12: 48px`, `--space-16: 64px`, `--space-24: 96px`, `--space-32: 128px`.
Component padding uses `space-4/6/8`; section rhythm uses `space-16/24/32`.

### 5.2 Borders

- `--border-comic: 3px solid var(--color-ink)` — default panel border.
- `--border-comic-thick: 5px solid var(--color-ink)` — hero/feature panels.
- `--border-hair: 1px solid var(--color-ink)` — internal grid lines, meta tables.
- Radius: `--radius-panel: 0` (hard edges). Only speech bubbles may use organic clip-paths.

### 5.3 Shadows (hard offset only — no blur)

- `--shadow-comic: 6px 6px 0 var(--color-ink)`
- `--shadow-comic-lg: 12px 12px 0 var(--color-ink)`
- `--shadow-comic-yellow: 6px 6px 0 var(--color-primary)` (on dark grounds)
- `--shadow-comic-paper: 6px 6px 0 color-mix(in srgb, var(--color-ink) 35%, transparent)`

### 5.4 Motion tokens

- `--dur-fast: 140ms` (hover/tap), `--dur-base: 320ms`, `--dur-slow: 720ms`, `--dur-cine: 1200ms`
- `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` (smooth settle)
- `--ease-slam: cubic-bezier(0.85, 0, 0.15, 1)` (hard impact)
- `--ease-back: cubic-bezier(0.34, 1.56, 0.64, 1)` (overshoot pop)
- `--stagger-fast: 0.04s`, `--stagger-base: 0.08s`

### 5.5 Breakpoints (mobile-first; Tailwind defaults + custom)

| Name | Width | Class tier | Character |
|---|---|---|---|
| base | 0–639px | (mobile portrait) | Vertical panel stacks, simplified 3D, touch-first |
| `sm` | 640px | `sm:` | Large phones / small landscape |
| `md` | 768px | `md:` | Tablet — rebalanced compositions |
| `lg` | 1024px | `lg:` | Desktop — full parallax, pointer interactions |
| `xl` | 1280px | `xl:` | Cinematic desktop, widest compositions |

Safe-area: `padding-left/right: env(safe-area-inset-*)` on fixed nav elements.

### 5.6 Z-index scale

`--z-base: 0` · `--z-parallax-far: 10` · `--z-content: 20` · `--z-parallax-near: 30` ·
`--z-sticky: 40` · `--z-nav: 50` · `--z-overlay: 60` · `--z-modal: 70` · `--z-skip: 80`.

### 5.7 Texture tokens

Halftone (radial-gradient dot grid), screentone (repeating diagonal), paper grain (SVG
feTurbulence data-URI, ~2KB), speed-line (repeating-conic or SVG). All CSS/procedural — zero image
downloads. Dot scale: `--halftone-dot: 8px` (sm: 6px, lg: 10px).

---

## 6. NINE-CHAPTER NARRATIVE STRUCTURE

One page, nine stacked `<section>` chapters, each a `ChapterShell` with metadata + theme + content.
All personal facts are **marked placeholders** (`[PLACEHOLDER: …]`) — never invented.

### 6.1 Chapter specs

| # | ID | Title | Tone | Signature visual | Signature interaction | Scroll pattern |
|---|---|---|---|---|---|---|
| 01 | `awakening` | THE AWAKENING | Explosive | Yellow/black burst, halftone, floating panels, 3D manga volume | "BEGIN" scroll cue; volume reacts to pointer | Pinned cinematic entrance → angular wipe out |
| 02 | `encounter` | THE FIRST ENCOUNTER | Playful-curious | Cream paper, sequential panels, chat bubbles | Panels construct as you scroll; bubble pop-ins | Vertical scrub, layered horizontal drift |
| 03 | `stand` | THE STAND AWAKENS | Theatrical | Radial burst ground, 3D "Stand" object, attribute table | Inspect 3D object (drag/pointer), reveal abilities | Pinned reveal, object scale/rotate scrub |
| 04 | `moments` | OUR BIZARRE MOMENTS | Energetic | Overlapping rotated collage, red impact frames | Click panels → expand reveal (modal) | Multi-speed parallax scatter |
| 05 | `quiet` | THE QUIET BETWEEN BATTLES | Intimate | Cream, huge negative space, serif emphasis | Word-by-word line reveal on scroll | Slow gentle scrub, no pinning |
| 06 | `universe` | OUR UNIVERSE | Adventurous | Floating themed objects, perspective grid | Pointer-tilt layer; tap objects for details | Multi-layer parallax + perspective |
| 07 | `golden` | GOLDEN MEMORIES | Triumphant | Yellow/black timeline, chapter markers, photo cards | Scroll advances milestones | **Horizontal scroll pin** (vertical → horizontal) |
| 08 | `letter` | THE LETTER | Intimate-editorial | Paper column, restrained type, minimal motion | Line-mask reveals (non-blocking) | Gentle scrub, content-height section |
| 09 | `finale` | TO BE CONTINUED | Cathartic | Return to yellow/black, giant kinetic type, layered composition | Final camera move; magnetic CTA replay | Pinned finale, slow-out |

Emotional chapters (05, 08) minimize the navigator (§10.4) and drop SFX/hard cuts.

### 6.2 Content requirements per chapter

`id, index, number ("01"), title, subtitle, characterTheme (placeholder), theme colors, tone,
transitionIn, transitionOut, content (typed: headline lines, body paragraphs, panels[], stats[],
timeline[], letter[]), assets[] (all placeholder ids).`

### 6.3 Placeholder policy

- All strings live in `src/data/chapters.ts` (+ `src/data/content.ts` for long-form).
- Placeholders are visibly labeled (`[PLACEHOLDER: how we met]`) so nothing personal is fabricated.
- Replacing content = edit data files only; zero component/animation changes.

---

## 7. COMPONENT ARCHITECTURE & DIRECTORY ORGANIZATION

```text
src/
├── app/                      # App Router: layout.tsx (fonts, metadata), page.tsx (composition)
├── components/
│   ├── layout/               # ExperienceShell, ChapterShell, Container, GridGuide
│   ├── navigation/           # ChapterNavigator, ProgressBar, SkipLink, ScrollCue
│   ├── typography/           # DisplayText, KineticHeading, ChapterTitle, MetaLabel, SfxText
│   ├── manga/                # MangaPanel, PanelGrid, SpeechBubble, ImpactFrame, BurstBadge,
│   │                         # HalftoneLayer, SpeedLines, ChapterMarker, SwatchStrip
│   ├── effects/              # ChromaticText, GrainOverlay, RegistrationShift, FrameStep
│   ├── interactions/         # RevealCard, ClickToReveal, PointerTilt, MagneticButton
│   └── ui/                   # Badge, Button, Divider, VisuallyHidden
├── chapters/                 # Chapter01…Chapter09 (+ index.ts barrel)
├── three/
│   ├── scenes/               # MangaVolumeScene (Ch01), StandScene (Ch03)
│   ├── objects/              # MangaVolume, StandCore, OrbitShards, PanelCard
│   ├── materials/            # toonInk(), flatAccent() shared material factories
│   └── shaders/              # (reserved; only if a custom effect justifies it)
├── animations/
│   ├── timelines/            # per-chapter GSAP timeline builders (pure functions)
│   ├── transitions/          # wipeAngular, panelExpand, cameraThrough, typeImpact…
│   └── presets/              # easing/stagger/entrance presets shared across chapters
├── hooks/                    # useChapterProgress, usePrefersReducedMotion, useInViewport,
│                             # useIsMobile, useLenis, useGsapContext
├── lib/                      # gsap.ts (plugin registration), lenis.ts, utils.ts, cn.ts
├── data/                     # chapters.ts, content.ts, tokens mirrors
├── styles/                   # tokens.css, textures.css, typography.css
└── types/                    # chapter.ts, content.ts, three.ts
```

**Ownership rule:** each animated property has exactly one owning library (§9.1).
Components are presentational unless they own a local interaction; scroll logic never lives in JSX.

---

## 8. TECHNOLOGY STACK & RESPONSIBILITIES

| Library | Version policy | Responsibility |
|---|---|---|
| Next.js (App Router) + React + TypeScript strict | current stable via create-next-app | App shell, routing, code-splitting, types |
| Tailwind CSS v4 | scaffold default | Semantic token utilities, layout, responsive tiers |
| GSAP + ScrollTrigger (+ @gsap/react) | latest stable 3.x | **Primary animation engine:** scroll timelines, pins, choreography, camera moves |
| Motion for React (`motion`) | latest stable | React-only transitions: modal/overlay presence, button hover/tap, nav visibility |
| Anime.js | latest stable | Isolated procedural effects only: SVG path draws, speed-line bursts, repeating patterns |
| Three.js + @react-three/fiber + @react-three/drei | versions matched to React 19 | 3D scenes, stylized objects, scroll-linked camera |
| Lenis | latest stable | Smooth scroll (desktop, motion-safe only), fed into ScrollTrigger |
| Zustand | latest stable | Tiny global store: active chapter, navigator state, reduced-motion flag |
| Lucide React | latest stable | Minimal utility icons only (arrows, close, volume if audio exists) |

**Explicit exclusions:** no post-processing/bloom, no physics engine, no animation library owns a
property another already animates (§9.1), no CSS framework beyond Tailwind.

**Dependency install order:** scaffold → `gsap @gsap/react` → `motion animejs` →
`three @react-three/fiber @react-three/drei` → `lenis zustand lucide-react`.
Version conflicts (React 19 ↔ R3F) resolved by installing latest majors together, then build-verifying.

---

## 9. ANIMATION ARCHITECTURE

### 9.1 Library ownership (one property → one owner)

| Property / concern | Owner |
|---|---|
| Scroll-linked motion, pins, parallax, scene choreography, big type | **GSAP + ScrollTrigger** |
| React component enter/exit presence (modals, overlays, nav visibility, button states) | **Motion for React** |
| Isolated procedural SVG/graphic loops (speed lines, path draws, decorative pulses) | **Anime.js** |
| 3D object transforms driven by scroll/pointer | **R3F `useFrame`** (reading GSAP-produced progress via refs) |
| Hover/tap micro-states not needing presence | **CSS transitions** (motion tokens) |

Violations are bugs: never tween the same target property from two libraries.

### 9.2 Motion principles

1. **Impact then settle** — entrances overshoot (`--ease-back` / `--ease-slam`), exits are fast and linear.
2. **One hero move per scene** — supporting elements move subtly (≤10% travel).
3. **Weight** — big type moves slow-in/fast-out; small UI snaps.
4. **Spatial continuity** — elements leaving a chapter hand off directionally into the next (exit
   vector ≈ entry vector of successor).
5. **Print logic** — reveals imitate printing: masks wipe, panels register (misregistration shifts ≤ 4px), type stamps.
6. **Intimacy = restraint** — Ch05/Ch08 use ≤15% travel, no overshoot, longer durations.
7. **Frame-step is decorative** — only illustration-grade elements step at ~12fps; camera/UI stay smooth.

### 9.3 Choreography map (entrance → scrub → exit)

| Ch | Entrance | Scrub body | Exit handoff |
|---|---|---|---|
| 01 | Staggered panel slam-in, char-stagger wordmark, badge stamp | Pin: volume rotates, wordmark parallax splits, panels part | Angular wipe (clip-path) revealing Ch02 |
| 02 | Panels print in sequence (mask wipes) | Bubble pops (anime.js), horizontal drift layers | Panel expands to fill → cut to Ch03 |
| 03 | Burst rays spin in, Stand scales 0.6→1 | Pin: Stand orbits + scrubs rotation/scale (static camera, D10), stats stamp in | Chromatic-split flash frame → Ch04 |
| 04 | Collage panels fly from edges, impact frame | Multi-speed parallax scatter, rotated drift | Panels snap-stack → rotate-out |
| 05 | Serif line fades up gently | Word-by-word mask reveal, slow parallax (≤8%) | Cream sheet slides down → Ch06 |
| 06 | Objects drift in from depth (z) | Perspective tilt + layered parallax speeds | Grid lines extend → Ch07 |
| 07 | Timeline line draws (SVG) | **Horizontal pin:** vertical scroll → timeline x-translation | Last milestone centers → releases vertical |
| 08 | Paper column rises | Line-by-line mask reveal (scrub, non-blocking) | Letter seal stamps → Ch09 |
| 09 | Yellow flood, giant type stamps in | Pin: layered composition pulls back, final line lands | End: no exit; replay CTA scrolls to top |

Transitions are chosen from §9.4 by narrative need — never randomized.

### 9.4 Transition patterns (reusable, in `animations/transitions/`)

1. `panelExpand` — outgoing panel scales to cover viewport (clip-path/transform).
2. `cameraThrough` — perspective push through a panel (rotateX + scale + blur-free depth cue).
3. `angularWipe` — skewed clip-path sweep (8–15° angle), ink or yellow fill.
4. `perspectiveRotate` — rotateX/Y card flip between chapters.
5. `typeImpact` — full-bleed display word stamps in/out as the wipe vehicle.
6. `halftoneSweep` — dot-grid mask travels across the seam.
7. `pageReveal` — layered comic-page stack fans out to expose next chapter.

### 9.5 Lifecycle & cleanup

- All GSAP work runs inside `useGsapContext()` (wrapper over `gsap.context`) → reverted on unmount.
- Responsive variants via `gsap.matchMedia()`:
  `(min-width: 1024px) and (prefers-reduced-motion: no-preference)` / mobile / reduced blocks.
- **Base CSS = fully visible, readable state.** Hidden/offset initial states are applied by JS
  *only inside motion-safe contexts* → reduced-motion users (or JS failure) see final states.
- ScrollTriggers are created once per chapter mount, `kill()`ed by context revert; no anonymous
  global listeners; Lenis destroyed on unmount.
- StrictMode double-mount must not double-register (context revert + idempotent init).

---

## 10. SCROLL-DRIVEN STORYTELLING SYSTEM

### 10.1 Pipeline

`Lenis (motion-safe)` → `lenis.on('scroll', ScrollTrigger.update)` → `gsap.ticker` drives
`lenis.raf` (`lagSmoothing(0)`). Reduced-motion / touch-conservative: Lenis disabled, native scroll.

### 10.2 ChapterShell contract

```tsx
<ChapterShell chapter={meta}>        // <section id={id} aria-labelledby=…>, theme class,
  {children}                         //   IntersectionObserver → store.setActive(index)
</ChapterShell>
```

- Scroll progress per chapter: one ScrollTrigger (`start: 'top bottom'`, `end: 'bottom top'`,
  `onUpdate: self => progressRef.current = self.progress`) writing to a **ref** — never React state.
- Chapter-local timelines attach with `trigger: sectionRef` and their own `scrub`/`pin` config.
- Scene mount/unmount decided by `useInViewport(section, {rootMargin: '100%'})`.

### 10.3 State (Zustand, minimal)

`{ activeChapter, setChapter, navigatorMinimized, reducedMotion }`.
Selectors are used so only navigator components re-render (≤10 renders per full scroll).

### 10.4 Chapter navigator spec

- Fixed rail (desktop right, mobile bottom bar), 9 rectangular markers `01…09`, ink surface,
  active marker = primary yellow fill + ink text, 3px outline, `shadow-comic` on active.
- Shows current number + title tooltip/label; progress hairline under active marker.
- Click/Enter → `lenis.scrollTo('#id', {offset: 0})` (or `scrollIntoView` when Lenis off).
- **Minimized mode** during Ch05/Ch08: collapses to 9 tiny dots (still keyboard-focusable).
- `aria-label="Chapter navigation"`, `aria-current="true"` on active, visible focus ring
  (2px primary + 2px ink offset), safe-area padding, z-index `--z-nav`.

### 10.5 Progress feedback

A 3px top progress bar (scaleX from overall scroll progress, transform-only, ink→yellow).

---

## 11. 3D RENDERING ARCHITECTURE

### 11.1 Strategy: selective mounting (≤1 WebGL canvas alive)

- Only chapters 01 and 03 ship scenes (justified below); others are DOM/SVG.
- Each scene component lazy-loads (`next/dynamic`, `ssr: false`) and mounts **only while its
  chapter is within viewport ±100% rootMargin**, unmounting fully outside (geometry/material/
  renderer disposed by R3F on unmount).
- No global post-processing. No shadows maps beyond a single cheap directional if needed.

### 11.2 Scenes

| Scene | Chapter | Contents | Motion |
|---|---|---|---|
| `MangaVolumeScene` | 01 | Stylized manga tankōbon: box body, cream page-block, cover plane with procedurally drawn CanvasTexture (BIZARRE LOVE / VOL. 06), ink outlines | Scroll progress → Y rotation (via ref), pointer parallax (±6°), gentle idle float |
| `StandScene` | 03 | Abstract "Stand" guardian: toon-shaded core (icosahedron) + orbiting shards/ring, flat accent materials, outline pass | Scrub rotation + scale reveal, pointer orbit, attribute-label sync |

### 11.3 Materials & lighting

- `MeshToonMaterial` / flat `MeshBasicMaterial`-style, 3–4 step gradient map (procedural 1×4
  DataTexture) — graphic, illustrative, no PBR.
- Outlines: inverted-hull or drei `Outlines` (ink color, 0.02 thickness) on hero objects only.
- Lighting: 1 ambient + 1 directional (no shadow) + optional rim; ≤4 lights total.
- Textures: CanvasTexture generated at runtime (zero downloads), ≤1024², `colorSpace: SRGBColorSpace`.

### 11.4 Performance rules

- `dpr={[1, 1.75]}` (mobile capped 1.25), `frameloop="always"` only while in view, else unmounted.
- Geometries/materials created via factories and shared; < 60 draw calls, < 100k tris per scene.
- Pointer/scroll data flows through refs — zero React re-renders per frame.
- `Suspense` fallback = styled DOM placeholder (never a spinner screen).

### 11.5 Fallbacks

- No WebGL / `webglcontextlost` / `deviceMemory < 4` / `saveData` → DOM composition fallback
  (CSS 3D-transformed panel standing in for the volume; graphic SVG burst for the Stand).
- Ch03's ability labels & content are DOM, independent of the canvas (canvas is enhancement).

---

## 12. MOBILE-FIRST ADAPTATION

1. **Build order:** mobile compositions designed first; `md`/`lg`/`xl` add layers (never the reverse).
2. Mobile: vertical panel stacks, single-column grids, 3D complexity reduced (fewer shards, dpr 1.25,
   simplified camera path), no pinned horizontal sequences replaced by vertical scrub equivalents
   where pinning proves janky (Ch07 fallback: vertical milestone list with progress line).
3. `gsap.matchMedia()` creates separate timelines per tier — desktop pin configs are never assumed
   to work on mobile; landscape and portrait both tested.
4. Fluid type via `clamp()` (no breakpoint font jumps); `svh` units for full-height scenes (mobile
   URL-bar safe); no fixed-pixel scene dimensions.
5. Touch: all interactions have tap equivalents; no hover-only content; `touch-action` left native
   (no scroll hijack); navigator targets ≥ 40×40px.
6. Layout distortion (the original concept's failure mode) is prevented by: grid-based panel flow,
   `aspect-ratio` + `min(…)` sizing, overflow management, and per-tier composition tests.

---

## 13. ACCESSIBILITY & REDUCED MOTION

- **Semantics:** one `<h1>` (hero), sequential `<h2>` chapter titles, `<section>` + `aria-labelledby`,
  landmarks (`header/nav/main`), meaningful `role="button"` only where real buttons suffice.
- **Keyboard:** skip-link first focusable; navigator is real `<button>`s; modal (Ch04 reveal) traps
  focus, closes on Escape, restores focus; all interactive elements show `:focus-visible`
  (3px primary outline + 2px ink offset — visible on every surface color).
- **Contrast:** all token pairs pass WCAG AA (§3.2); labels tracked but ≥ 0.6875rem.
- **Alt text:** placeholder graphics get `alt=""` (decorative) or descriptive alt when meaningful.
- **Reduced motion (`prefers-reduced-motion: reduce`):**
  - Lenis off; all GSAP/Anime motion contexts skipped (§9.5) → static final states.
  - No pins (sections flow naturally), no parallax, no frame-stepping, no impact flashes,
    no chromatic split animation (static layout preserved).
  - Navigator still fully functional (instant scroll).
  - CSS-only transitions limited to ≤100ms color/opacity.
- **User control:** an always-available "REDUCE MOTION" toggle in the nav (persisted in
  `localStorage`, sets a data-attribute honored by the same code paths as the media query) —
  lets the recipient tone down the show without OS settings.
- **No autoplay audio.** (Audio is out of scope for v1; if added later: user-initiated only.)
- **No scroll hijacking** beyond pinned sections' natural scrub; content reachable by normal scrolling.

---

## 14. PERFORMANCE BUDGETS

| Metric | Budget | Strategy |
|---|---|---|
| First Load JS (route) | ≤ 350KB gzip | Next code-splitting; GSAP core+ScrollTrigger only; `motion`/`animejs` tree-shaken; three.js **not** in initial graph |
| 3D chunks (lazy) | ≤ 200KB gzip combined | `next/dynamic` scenes; drei imports trimmed to used exports |
| CSS | ≤ 60KB gzip | Tailwind v4 utilities + token layers, no unused frameworks |
| Fonts | ≤ 220KB woff2 total | 3 families, restricted weights, `next/font` self-host, `display: swap` |
| Images | 0 downloads v1 | Procedural CSS/SVG/Canvas textures only |
| React re-renders during scroll | 0 per frame | Refs + Zustand selectors; progress never enters React state |
| Layout thrash | none | Transform/opacity/clip-path only; no animating width/height/top |
| WebGL | ≤ 1 canvas alive, dpr ≤ 1.75 (1.25 mobile), < 60 draw calls, < 100k tris | Selective mounting, shared factories, dispose on unmount |
| Main-thread frame target | ≥ 50fps desktop / ≥ 30fps mobile | GPU-friendly transforms, batched ScrollTriggers, lazy 3D |
| LCP | < 2.5s (mid-tier mobile) | Hero text in HTML (not JS-injected), preloaded font, no render-blocking extras |
| CLS | < 0.1 | Fixed aspect-ratio placeholders, no late-shifting media |

Measured during Phase 7 via `npm run build` output, React DevTools Profiler, and Chrome
Performance/Framerate panels.

---

## 15. ASSET STRATEGY

- **No external asset dependencies.** All visuals are original and procedural:
  CSS halftone/screentone/grain, inline SVG (speed lines, bursts, bubbles, arrows, swatches),
  Canvas-generated 3D textures, geometric SVG "photo" placeholders with `PHOTO 01` labels.
- Asset references centralized in `src/data/content.ts` as typed ids → component mapping;
  hotlinking random/copyrighted images is forbidden.
- **Replacement path (future):** drop files into `public/media/<chapter>/`, flip the asset entry to
  a real `src`, keep the same aspect-ratio wrapper → no layout or animation changes.
  Supported: couple photos, chat screenshots, personal messages, character illustrations,
  custom glTF models (registered in `three/objects/`), optional SFX (user-triggered only).
- Copyright: original JoJo-**inspired** treatments only; no reproduced panels/artwork/trackers.

---

## 16. IMPLEMENTATION PHASES

| Phase | Scope | Dependencies | Acceptance criteria |
|---|---|---|---|
| **1 Foundation** | Scaffold, tokens, fonts, typography components, manga primitives, responsive utils, 9-chapter skeleton | design.md (done) | App builds; tokens drive all color/type usage; all 9 sections render with placeholder content |
| **2 Opening** | Ch01 full composition + entrance choreography + halftone + 3D volume + wipe to Ch02 | Phase 1 | Distinctive pinned cinematic hero; volume renders & reacts; smooth handoff |
| **3 Chapter framework** | ChapterShell, progress system, navigator, transitions, matchMedia lifecycle | Phase 1 | Navigator jumps correctly; active state tracks scroll; cleanup verified under StrictMode |
| **4 Narrative animations** | Distinct scroll choreography for Ch02–Ch09 | Phase 3 | No two chapters share a signature effect; reduced-motion shows static finals |
| **5 3D integration** | StandScene, scroll camera, pointer inspect, fallbacks, perf | Phases 2–3 | ≤1 canvas alive; unmount disposes; fallback renders without WebGL |
| **6 Polish** | Timing, textures, borders, hovers, responsive art direction | Phase 4 | Visual consistency pass; no orphaned placeholder controls |
| **7 Testing** | Build/type/lint, device matrix, keyboard, reduced-motion, perf budgets | All | §18 Definition of Done checklist passes |

**Vertical-slice priority if time-constrained:** design system + navigator + Ch01 + Ch01→Ch02
transition + ChapterShell framework (matches the brief's explicit fallback instruction).

---

## 17. TESTING & VALIDATION STRATEGY

1. **Static:** `npm run build` (Next + TS strict), `npx tsc --noEmit`, `npm run lint` — must pass clean.
2. **Runtime:** dev-server smoke pass over all 9 chapters; watch console for errors/React warnings;
   verify ScrollTrigger/`lenis` cleanup by mounting/unmounting (StrictMode double-invoke) without leaks.
3. **Responsive matrix:** 1440×900 desktop, 1280×800 laptop, 834×1112 tablet, 390×844 portrait,
   844×390 landscape — layout, pinning, navigator placement, no horizontal overflow.
4. **Accessibility:** keyboard-only run (tab order, focus rings, modal Escape), axe-core spot check,
   reduced-motion emulation (OS + in-app toggle) — content fully visible, no pins/flashes.
5. **Performance:** Lighthouse (perf/a11y/best-practices), bundle analyzer on first-load + 3D chunks,
   Performance panel: no per-frame React commits, frame rate within budget.
6. **Content:** every placeholder greppable (`[PLACEHOLDER`), no invented personal facts.

---

## 18. RISKS, TRADEOFFS & MITIGATIONS

| Risk | Impact | Mitigation |
|---|---|---|
| GSAP ScrollTrigger + Lenis desync | Broken scrubbing | Official integration pattern (§10.1); single ticker; verify on resize |
| React 19 ↔ R3F/drei version mismatch | Build/runtime failure | Install latest majors together; build-verify immediately after install; DOM fallback exists |
| Mobile pin jank / URL-bar resize | Distorted layout | `svh` units, matchMedia per-tier timelines, Ch07 vertical fallback, `invalidateOnRefresh` |
| three.js bundle weight | Slow first load | Strictly lazy dynamic import; never in initial graph; tree-shake drei |
| Over-animation (one giant timeline) | Jank, unreadable | One hero move per scene (§9.2); chapter-scoped contexts |
| Anime.js v4 API drift | Runtime errors | Use only `animate`/`stagger` basics; isolate in `effects/` so a swap is local |
| Flash of hidden content vs flash of unstyled | Bad first paint | Hidden states applied via JS in motion-safe context only (§9.5) |
| Font network failure at build | Build break | next/font downloads at build; if blocked, fallback to `next/font/local` or system stack (documented here) |
| Scope overrun (9 chapters × 3D × motion) | Incomplete delivery | Phased roadmap + vertical-slice priority (§16); 3D limited to 2 scenes by design |
| Copyright creep (JoJo artwork) | Legal/ethical | Original compositions only; procedural assets (§15) |
| Content fabrication | Breaks gift's authenticity | Typed placeholders only (§6.3); lint-by-review grep for `[PLACEHOLDER` |

### 18.1 Definition of Done (from brief)

- [x] `design.md` exists and reflects the implementation (update on change)
- [x] Project builds; typecheck + lint clean (`next build`, `tsc --noEmit`, `eslint` all pass)
- [x] Exact palette `#F4D94E / #141414 / #F7F1DF / #EC3C43 / #16B8B1` drives the UI
- [x] Nine chapters in one working narrative structure
- [x] Opening chapter explosive & animated (not a fade-in hero)
- [x] Chapter navigator functional (jump + active tracking)
- [x] Scroll-driven transitions working across chapter seams
- [x] ≥1 meaningful interactive 3D scene (Ch01 volume + Ch03 Stand, both pointer-reactive)
- [ ] Mobile layouts without distortion — code paths hardened in the phone pass (D13–D16; both reported phone bugs fixed); **final visual QA on physical devices still outstanding** (no browser tooling in this session)
- [x] No animation-library conflicts; all timelines/listeners/WebGL cleaned up (D9 ownership rules)
- [x] Reduced-motion path supported (media query + in-app toggle)
- [x] Placeholders replaceable via data files only (76 `[PLACEHOLDER` strings, all in `src/data/`)
- [x] No known blocking runtime errors (SSR smoke pass over all nine sections)

**Measured budgets (production build, gzip):** JS 297 KB / 350 KB · CSS 9 KB / 60 KB ·
three.js + R3F absent from the initial graph (verified by scanning served chunks) · 0 images.

---

## DECISION LOG (append as decisions land)

- **D1** Single-page continuous experience (no routing between chapters) — serves "one volume" feel.
- **D2** Fonts: Anton + Space Grotesk + Playfair Display Italic (§4.1) — display/label/emphasis triad.
- **D3** Lenis motion-safe only; native scroll on touch/reduced — avoids scroll hijack complaints.
- **D4** 3D limited to Ch01 + Ch03 with selective mounting (§11.1) — performance budget over spectacle.
- **D5** Tailwind v4 `@theme` token mapping; raw hex banned in components (§3.3).
- **D6** Ch07 horizontal pin with documented vertical mobile fallback (§12.3).
- **D7** In-app REDUCE MOTION toggle mirroring the OS media query (§13).
- **D8** *(implementation)* Modal a11y is centralized in `hooks/useModalDialog.ts`: Escape closes, Tab
  traps focus inside the dialog, background scroll locks while open, and focus returns to the opener.
  Ch04 memory modal and Ch06 object files both use it — no per-modal keyboard logic.
- **D9** *(implementation)* **One transform owner per element.** GSAP animates *wrapper* elements
  (`.mom-card`, `.uni-object`) while CSS `:hover` transforms live on the interactive child button;
  otherwise GSAP's inline `transform` silently kills the hover press (and vice versa). Where an
  entrance `from()` tween would leave an inline transform over a CSS-hover element (`.hero-cue`),
  `clearProps: "transform"` is used. MagneticButton is GSAP-only for transform and has no CSS
  hover transform by design.
- **D10** *(implementation)* No camera motion in the 3D scenes: per-frame camera mutation conflicts
  with `react-hooks/immutability` and buys little. Pointer parallax is applied to the *objects*
  (MangaVolume / StandCore groups) through refs instead; §9.3/§11.2 updated accordingly.
- **D11** *(implementation)* WebGL capability is exposed via `useWebGLSupport()` — a cached probe read
  through `useSyncExternalStore` (server snapshot `false`). This avoids both a hydration mismatch
  and `setState`-in-effect, while keeping Ch01/Ch03 on their DOM fallbacks when WebGL is missing.
- **D12** *(implementation)* Ch07 desktop rail geometry: track carries `pt-16`, milestone markers sit
  at `-top-[86px]` so their centres land exactly on the SVG rail at `top-0`; the rail draws with
  `pathLength=1` in sync with the track's x-translation.
- **D13** *(bugfix, phone reports)* Two reported phone bugs fixed at the root cause:
  (a) Ch01 mobile ScrollTrigger ran `start:"top bottom"` → progress **0.5 at page load**, rotating the
  volume 90° edge-on as a black slab behind the title; re-anchored to `top top`/`bottom top`.
  (b) Ch02's print-in clip was a single timeline spanning the whole chapter, so a panel fully in view
  sat ~30% revealed (chopped art + caption); replaced with **per-panel** `fromTo` scrubs
  (`top 88%` → `top 46%`), the same pattern Ch08 already used.
- **D14** *(implementation, phone performance pass — no layout changes)*
  `ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true })` (iOS toolbar resize no
  longer storms `refresh()`); Lenis is **skipped entirely on coarse pointers** (`(hover: none) and
  (pointer: coarse)`) — 100% native touch scroll, fulfilling D3; Playfair trimmed to weight 400 only;
  the full-screen grain overlay's `mix-blend-multiply` is `lg:`-only; WebGL `dpr` capped to 1.25 and
  objects scaled compact below 1024px; touch pointers ignored by all pointer-parallax/tilt listeners;
  hidden (`lg:block`) float-panel scrub removed from the mobile Ch01 path; Ch04 `ImpactFrame` base is
  `invisible` + GSAP `autoAlpha` (paint skipped until the one flash, correct under reduced motion).
- **D15** *(implementation, interaction)* `hooks/useDragRotate.ts` powers drag-to-spin toys: the Ch01
  volume ("DRAG TO SPIN") and the Ch03 Stand ("DRAG TO INSPECT", new drag surface over the stage).
  Touch drags engage only once horizontal movement dominates (vertical swipe = page scroll, via
  `touch-action: pan-y` + `pointercancel` reset); a tap kicks an inertial spin that decays in
  `useFrame`. The hook exposes **`step(delta)`** rather than a mutable ref: React Compiler's
  `react-hooks/immutability` rule forbids mutating props inside `useFrame`, so all mutation stays in
  the hook where the ref is born, and the 3D objects only *read* the returned yaw/pitch.
  Ch01 SFX words are also tappable (anime.js `outBack` pop + shuffle).
- **D16** *(implementation, phone legibility + chrome)* Hero display type carries
  `-webkit-text-stroke` yellow ring (`text-stroke-primary`, `paint-order: stroke fill`) so black type
  stays legible over the ink volume without clipping in `overflow-hidden` boxes. The bottom chapter
  bar no longer overflows ≤420px screens: the marker `<ul>` is `min-w-0 flex-1 overflow-x-auto` with
  a `scrollbar-hide` utility (still swipeable), and the FX toggle label raised to 11px (§13 minimum).
- **D17** *(implementation, playful toys)* Five tappable playthings, all data-labelled, additive
  (no existing layout restyled), and reduced-motion-aware:
  1. **Punch-it SFX machine (Ch04)** — tap fires a random Latin SFX stamp + one-frame impact flash +
     a 260ms screen-kick of the Ch04 section (safe: no pins live in that section — a transformed
     ancestor would re-anchor `position: fixed` pins, see `kick()` docs).
  2. **Tap-to-pop bubbles (Ch02)** — `SpeechBubble` gains `onPop` (renders as a `<button>`); each tap
     wobbles it (anime) and cycles to the next placeholder take (`content.ch02.bubbles[].alts`).
     The GSAP/anime entrance now targets a new wrapper div while the button keeps hover = shadow-only
     (D9 one-owner rule preserved).
  3. **Hold-to-charge finale (Ch09)** — hold Space/Enter/pointer for 900ms: SVG ring fills via a CSS
     transition (reduced-motion CSS collapses it to an instant jump for free), release early drains
     it; completion bursts SFX stamps + confetti panels + flash. Kick targets the *button*, never the
     pinned Ch09 section.
  4. **Halftone finger-paint (Ch05)** — canvas dot-painting sized by swipe speed, palette read from
     CSS vars (fallbacks mirror tokens.css); an idle self-stopping rAF loop fades wet ink (~3s, parks
     at 4.5s idle → zero background cost on phones). Canvas pixels are painted imperatively — no CSS/
     GSAP/anime touches them, so ownership stays clean. Reduced motion: no fade loop, CLEAR button
     wipes instead.
  5. **Konami secret → BIZARRE MODE** — tap the Ch01 `VOL. 06` badge 5× in a 1.6s chain (or the arrow
     key sequence on desktop) → `store.bizarre` opens a 6.5s window where a fixed layer rains SFX
     stamps in waves + a pulsing banner (CSS `anim-pulse-step`, auto-disabled under reduced motion).
  Shared plumbing: `src/lib/sfx.ts` — SFX pools + `spawnStamp`/`screenFlash`/`kick` helpers. All toy
  DOM is created and destroyed **imperatively** (zero React re-renders per tap); the helper owns each
  spawned node's transform (wrapper = static placement, inner span = animation target).
- **D18** *(bugfix, latent)* `z-nav` / `z-modal` / `z-overlay` / `z-skip` were never emitted by
  Tailwind v4 — it ships no named `z-*` theme namespace, so the tokens.css scale silently didn't map
  (stacking had been working only by DOM order: modals above the grain overlay purely by source
  position). All eight `--z-*` tokens now have explicit `.z-*` classes in textures.css (unlayered, so
  they always win), and the new toys reuse `z-overlay` (60) / `.sfx-flash` — modal (70) still sits
  above every toy layer.

