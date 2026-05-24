# Nonprofit Website Workbook

A horizontal, responsive wizard that walks a nonprofit board or working group through seven exercises that produce a **website brief** — *before* a single design decision is made. Each step pairs an exercise with a "From the prototype" callout that explains the design rationale by pointing at a real working site:

> **Prototype:** [Women's Rights Information Center](https://womens-rights-information-center.vercel.app/) (Englewood, NJ)

---

## What's in this repo

```
.
├── Nonprofit Website Workbook.html   # Entry point (open in any browser)
├── index.html                        # Dev/deploy entry point
├── package.json                      # Local dev/build scripts
├── vercel.json                       # Vercel static output config
├── styles.css                        # All styles — WRIC-aligned tokens
├── scripts/
│   └── build-static.mjs              # Copies the static app into dist/
├── src/
│   ├── data.jsx                      # All content (questions, options, copy)
│   ├── wizard.jsx                    # Shell: TopBar, Stepper, FootNav, primitives
│   └── steps.jsx                     # Per-step content + App + mount
├── assets/
│   ├── wric-logo.png                 # WRIC building mark (1159×1387)
│   ├── hero-women.jpeg               # Watercolor portraits hero (1456×816)
│   └── wric-globals.css              # WRIC's own stylesheet (reference only)
├── v1-paginated/                     # Earlier vertical/paginated draft
└── README.md                         # This file
```

The current app still runs in the browser via inline JSX (React 18 + Babel standalone), but the repo now has a project-local Vite dev server and static Vercel build.

---

## Running locally

Install dependencies once:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Then open:

```text
http://localhost:5173/
```

Build the static Vercel output:

```bash
npm run build
```

The build writes to `dist/`, which is the output directory configured in `vercel.json`.

---

## Design system

Everything lives in CSS custom properties at the top of `styles.css`. Tokens are calibrated to the WRIC prototype so the workbook reads as a sibling artifact, not a stranger.

### Color tokens

| Token | Value | Use |
|---|---|---|
| `--navy` | `#0a1d3a` | Primary brand, body ink, logo mark |
| `--navy-bright` | `#0b3b7a` | Links, focus rings, "From the prototype" accents |
| `--coral` | `#e8654a` | Primary CTAs, eyebrow accents |
| `--coral-deep` | `#c94e35` | CTA hover |
| `--paper` | `#faf7f2` | Page background — warm cream |
| `--surface` | `#ffffff` | Card surfaces |
| `--ink-soft` | `#2a3a55` | Body copy |
| `--muted` | `#6a7588` | Eyebrows, labels |
| `--line` | `#e0e4ec` | Dividers, input borders |
| `--wash-blue` | `#cfdde7` | Watercolor accent on DesignNote cards |

### Type

- **Display serif:** `Cormorant Garamond` (400-700, italic) — section titles, prompts, drill numbers
- **Sans:** `Geist` (400-700) — UI chrome, body, labels
- Both loaded from Google Fonts in `Nonprofit Website Workbook.html`

### Radius scale
`--r-sm: 10px` · `--r-md: 14px` · `--r-lg: 20px` · `--r-xl: 28px`

---

## Layout: the horizontal wizard

```
┌──────────────────────────────────────────────────────┐
│  TopBar (sticky)                                     │ 64px
│  [W] Nonprofit Website Workbook       [Auto-saved]   │
├──────────────────────────────────────────────────────┤
│  Stepper (sticky) — horizontal progress              │ 60px
│  [01·Premise] — [02·Unique Value] — [03·One Job] …   │
├──────────────────────────────────────────────────────┤
│  Step header                                         │
│  ── PATHWAYS                                  04     │
│  How do clients find you?                of 07       │
│  Lede sentence wraps to a reasonable measure.        │
├─────────────────────────────┬────────────────────────┤
│  Exercise (left, 1.55fr)    │  Design notes (1fr)    │
│  - Section sub-heads        │  ┌──────────────────┐  │
│  - Prompts + textareas      │  │ From the         │  │
│  - Checklists               │  │ prototype        │  │
│  - Three-paths grid         │  │                  │  │
│  - Pull quotes              │  │ Why the hero …   │  │
│                              │  │ View on the site │  │
│                              │  └──────────────────┘  │
│                              │  (sticky, stacks       │
│                              │   below on mobile)     │
├──────────────────────────────┴────────────────────────┤
│  FootNav (sticky)                                    │ 72px
│  [← Back]     Now · Pathways     [Next · Scope →]    │
└──────────────────────────────────────────────────────┘
```

**Breakpoints:**

| Width | Layout |
|---|---|
| `≥ 960px` | Two-column step body. Sticky right rail. Big step number visible. |
| `< 960px` | Single column. Right rail stacks under exercise. Big step number hidden. |
| `< 640px` | Top-bar subtitle hides. Stepper labels hide (pills only). Footnav simplified. |

---

## Content model (`src/data.jsx`)

All workbook copy lives in plain JS arrays so non-engineers can edit it:

```js
const STEPS = [
  { id: "cover",    kind: "cover",   label: "Start" },
  { id: "premise",  kind: "section", label: "Premise",      num: "01" },
  { id: "uvp",      kind: "section", label: "Unique Value", num: "02" },
  // …
  { id: "review",   kind: "review",  label: "Your Answers" },
  { id: "close",    kind: "close",   label: "Commit" },
];
```

To add a new section:
1. Insert a new entry in `STEPS` with `kind: "section"`.
2. Add the content arrays (questions, options) to `data.jsx`.
3. Write a `MySectionStep({ data, set, toggle })` component in `steps.jsx`.
4. Add a `case` in `App.renderStep()`.

---

## State + persistence

`useWorkbook()` in `wizard.jsx`:

- All answers are kept in a single React state object: `{ uvp_problem: "…", discovery: [...], primary_goal: "donate", … }`
- Persisted to `localStorage` under key `nonprofit-workbook-v2` on every change
- Synced to Firebase Realtime Database under `workbookResponses/{anonymousUid}/{responseId}` when Firebase Auth and Database are enabled
- Current step index persists under `nonprofit-workbook-v2-idx`
- `set(key, val)` and `toggle(key, val)` are the only mutators

Firebase sync uses anonymous auth. Enable the Anonymous provider in Firebase Authentication and publish the Realtime Database rules in `database.rules.json` before relying on remote saves.

The review step also exports answers as JSON (`workbook-brief.json`) and supports `window.print()` for PDF export (a print stylesheet hides chrome).

---

## Reusable primitives (`src/wizard.jsx`)

| Component | Purpose |
|---|---|
| `<TopBar />` | Logo + auto-save pill |
| `<Stepper idx onJump />` | Horizontal progress with clickable pills |
| `<StepHeader num label title lede />` | Big serif headline + step number |
| `<FootNav idx total onPrev onNext />` | Sticky bottom Prev/Next bar |
| `<Field label prompt value onChange placeholder multiline rows />` | Labeled text input or textarea |
| `<Check checked onChange>{label}</Check>` | Single checkbox row |
| `<CheckList items selected onToggle single />` | Two-column or single-column checklist |
| `<PickGrid value onChange options />` | Radio-card grid for "pick one" choices |
| `<DesignNote title cite hero>{children}</DesignNote>` | The "From the prototype" callout |

---

## Future Next.js Port

The current deploy path is a static Vercel app. If the workbook later needs server-side features, accounts, database persistence, or API routes, port it to Next.js:

1. **Create app:** `npx create-next-app@latest workbook --typescript --app`
2. **Move tokens:** Copy the `:root` block from `styles.css` into `app/globals.css`. Most of the rest can go in there too, or split into CSS modules.
3. **Convert components:**
   - `src/data.jsx` → `lib/workbook-content.ts` (typed)
   - `src/wizard.jsx` → `components/Wizard.tsx`, `components/Stepper.tsx`, `components/DesignNote.tsx`
   - `src/steps.jsx` → one file per step under `components/steps/` (`CoverStep.tsx`, `UvpStep.tsx`, etc.)
4. **Pages:** Single page at `app/page.tsx` rendering `<Wizard />`. The wizard owns step-index state.
5. **Persistence:** Replace `localStorage` shim with a `useWorkbook` hook that runs only on the client (`"use client"` directive on the wizard root).
6. **Fonts:** Use `next/font/google` for Cormorant Garamond + Geist.
7. **Assets:** Move `assets/*` to `public/` and reference as `/hero-women.jpeg` etc.
8. **Print/PDF:** `window.print()` still works; or use `@react-pdf/renderer` for a more polished export.

Suggested file structure after porting:

```
workbook/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── Wizard.tsx
│   ├── TopBar.tsx
│   ├── Stepper.tsx
│   ├── FootNav.tsx
│   ├── DesignNote.tsx
│   ├── primitives/
│   │   ├── Field.tsx
│   │   ├── Check.tsx
│   │   ├── CheckList.tsx
│   │   └── PickGrid.tsx
│   └── steps/
│       ├── CoverStep.tsx
│       ├── PremiseStep.tsx
│       ├── UvpStep.tsx
│       ├── OneJobStep.tsx
│       ├── PathwaysStep.tsx
│       ├── ScopeStep.tsx
│       ├── PeopleStep.tsx
│       ├── ShowStep.tsx
│       ├── ReviewStep.tsx
│       └── CloseStep.tsx
├── lib/
│   ├── workbook-content.ts        # All copy, prompts, options
│   ├── useWorkbook.ts             # State + localStorage hook
│   └── types.ts                   # WorkbookData type
└── public/
    ├── hero-women.jpeg
    └── wric-logo.png
```

---

## Notes for Cursor

- **Don't invent new colors.** Every accent should come from the `:root` token block.
- **Display copy uses Cormorant Garamond italic** for emphasis (the `<em>` inside `<h1>`, `.step-title`, `.field-prompt`, `.drill .prompt`, `.design-note h4`). Keep that pattern.
- **"From the prototype" boxes always link to the WRIC URL** and end with a `cite` line naming the section being referenced.
- **The exercise column is canonical**; the design-note column is supporting commentary. Don't put inputs in the right column.
- **Mobile-first.** Check every change at 375px before celebrating.
- **Touch targets ≥ 44px** (WRIC's globals.css uses 44/48/52 minimums — keep this).
- **Print stylesheet** at the bottom of `styles.css` hides nav/chrome; preserve it.

---

## Open questions / next steps

- [ ] Hook the JSON export to a real backend (Supabase, Airtable, etc.) so the working group's brief is durable across devices.
- [ ] Add a "Resume from email" link — magic-link auth that re-hydrates `localStorage` from the server.
- [ ] Build a "Designer view" of the review page that's optimized for handoff (one printable page, no inputs).
- [ ] Optional: per-section facilitator notes the chair can toggle on for board meetings.
- [ ] Optional: a comparison view that puts the answers side-by-side with the WRIC prototype, section by section.

---

*Adapted from "Stop Building Pretty Websites. Start Building Websites That Raise Money." by Harry Martin.*
