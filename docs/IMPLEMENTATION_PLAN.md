# Implementation Plan
## Pax Via Tours — Pilgrimage Website

---

## Overview

This plan divides the build into 7 sequential phases. Each phase has a clear
deliverable, validation checkpoint, and list of files produced. No phase should
begin until the previous phase passes its validation checkpoint.

**Total estimated phases:** 7
**Build target:** tour.html (single tour) + index.html (homepage) + terms.html

---

## Phase 0 — Project Setup

**Goal:** Create the skeleton directory structure and all empty files. No styling yet.

### Deliverables

1. Create full folder tree (see PROJECT_ARCHITECTURE.md §2)
2. Create all HTML files with minimal valid boilerplate
3. Create all CSS files (empty — just comments and file headers)
4. Create all JS files (empty — just module comment)
5. Create `data/company.json` with all company info
6. Create `data/tours/poland-czech-medjugorje.json` with full tour data (from COUNTRY_SYSTEM.md)
7. Create `data/tours-manifest.json` with one entry

### Files Created

```
index.html           — boilerplate only
tour.html            — boilerplate only
terms.html           — boilerplate only

assets/css/tokens.css         — all custom properties
assets/css/reset.css          — box-model reset only
assets/css/base.css           — empty
assets/css/layout.css         — empty
assets/css/components/        — 13 empty component CSS files
assets/css/responsive.css     — empty

assets/js/main.js             — empty
assets/js/tour-loader.js      — empty
assets/js/nav.js              — empty
assets/js/itinerary.js        — empty
assets/js/utils.js            — empty

data/company.json             — COMPLETE
data/tours-manifest.json      — COMPLETE (1 entry)
data/tours/poland-czech-medjugorje.json  — COMPLETE
```

### Validation Checkpoint 0

- [ ] Open each HTML file in browser — renders without errors
- [ ] All CSS files link correctly (check browser DevTools — no 404s)
- [ ] `fetch('/data/tours/poland-czech-medjugorje.json')` in console returns data
- [ ] All JSON files are valid (use `JSON.parse()` in console to verify)

---

## Phase 1 — Design Tokens & Base Styles

**Goal:** Establish the complete CSS foundation. After this phase, all tokens,
typography defaults, and layout utilities are ready. No components yet.

### Tasks

1. **tokens.css** — Write ALL custom properties from DESIGN_SYSTEM.md §3 (colors,
   fonts, type scale, spacing, effects, breakpoints)
2. **reset.css** — Minimal reset: `box-sizing: border-box`, `margin: 0`, `padding: 0`,
   `img { max-width: 100% }`, list resets
3. **base.css** — Body defaults (font-family, color, font-size), heading defaults
   (h1–h6 font, line-height, letter-spacing), link defaults, paragraph defaults
4. **layout.css** — `.container` class, `.section` vertical padding utility

### HTML Setup (all 3 pages)

Each HTML file must include this `<head>` block:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pax Via Tours &amp; Travel</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

  <!-- CSS — load in exact order -->
  <link rel="stylesheet" href="assets/css/tokens.css">
  <link rel="stylesheet" href="assets/css/reset.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/layout.css">
  <!-- component CSS files added in later phases -->
  <link rel="stylesheet" href="assets/css/responsive.css">
</head>
```

### Validation Checkpoint 1

Open `tour.html` in browser, type test content:
- [ ] EB Garamond loads correctly (inspect element — computed font)
- [ ] Inter loads correctly
- [ ] A paragraph renders at 16px with correct line height
- [ ] An h1 renders at the expected display size
- [ ] `.container` centers content with correct max-width
- [ ] Custom properties accessible (`getComputedStyle(document.documentElement).getPropertyValue('--color-navy')` returns value)

---

## Phase 2 — Static HTML Structure (tour.html)

**Goal:** Build the complete HTML skeleton of `tour.html` with all sections,
all semantic elements, and all `data-field` slots. No styling yet — pure structure.

### Tasks

1. Write `<header class="navbar">` with all sub-elements
2. Write `<section class="hero">` containing:
   - `.hero__text-zone` (leader + h1 title)
   - `.destination-strip`
   - `.photo-grid` (4 cells with placeholder `<img>`)
   - `.tour-info-bar` (dates + badge + price + CTA strip)
3. Write `<section class="itinerary">` with:
   - Section heading
   - `.itinerary__grid` (12 empty `.itinerary__day` articles as placeholders)
   - `.itinerary__meta`
4. Write `.pricing-hero` div
5. Write `<section class="pricing">` with:
   - `.pricing__header-bar` (PRICING label)
   - Two-column `.pricing__grid`
   - Left: `.pricing__base-block`, `.pricing__options-block`, `.payment-table`
   - Right: `.inclusions`
6. Write `<section class="why-us">`
7. Write `<footer class="footer">`
8. Add `<script type="module" src="assets/js/main.js">` at end of body

### Semantic Rules

- One `<h1>` per page only (tour title)
- `<h2>` for each major section heading
- `<h3>` for sub-section headings within sections
- `<article>` for each itinerary day
- `<table>` for payment schedule (not divs)
- `<address>` for all contact/address blocks
- `<nav>` only for the navbar `<ul>`

### Validation Checkpoint 2

- [ ] HTML validates (paste into validator.w3.org — zero errors)
- [ ] One `<h1>` confirmed (browser DevTools accessibility tree)
- [ ] All `[data-field]` attributes present
- [ ] Page reads correctly with no CSS (test by disabling styles)
- [ ] Tab order is logical top-to-bottom

---

## Phase 3 — Component Styling (Desktop-first pass)

**Goal:** Style all components at 1440px (brochure target width). Make it look
like the brochure on a wide desktop. No responsiveness yet.

### Styling Order (top to bottom as they appear on page)

1. **navbar.css** — brand, nav links, CTA button
2. **hero.css** — leader text, title, white background, spacing
3. **photo-grid.css** — 2×2 grid, 5px gap, aspect-ratio, hover zoom
4. **destination-strip.css** — navy bar, white uppercase text, full-bleed
5. **tour-info-bar.css** — navy bar, 3-column flex, dates/badge/price/CTA
6. **itinerary.css** — two-column grid, day entries, typography, overnight lines
7. **pricing-hero.css** — full-width container, aspect-ratio, overlay
8. **pricing-table.css** — PRICING bar, two-column grid, base price, options
9. **payment-table.css** — table, alternating rows, column styling
10. **inclusions.css** — list, gold bullets, spacing
11. **why-us.css** — navy background, centered content, typography
12. **footer.css** — navy background, 3-column flex, address, links

### For each component:

```
Step 1: Open brochure page image alongside code
Step 2: Style to match pixel-by-pixel
Step 3: Check spacing with brochure proportions
Step 4: Verify font size, weight, color are correct
Step 5: Add hover state if applicable
Step 6: Move to next component
```

### Validation Checkpoint 3

For each component — open `tour.html` in browser at 1440px width:
- [ ] Hero title matches brochure font size and style
- [ ] Photo grid has white 5px gaps
- [ ] Destination strip is full-bleed navy with correct text
- [ ] Tour info bar shows dates (left) / badge (center) / price (right)
- [ ] Itinerary is two-column, matches brochure text layout
- [ ] Pricing section matches two-column layout
- [ ] Why Us section is navy with centered white text
- [ ] Footer is consistent with navbar brand

**Pixel-perfect test:** Take a screenshot of the styled page and overlay it on
the brochure page image in any image editor. Key proportions should align.

---

## Phase 4 — JavaScript Data Rendering

**Goal:** Wire all JavaScript so the page renders from JSON data instead of
static placeholder content.

### Tasks

**utils.js** (implement first — no dependencies)
```javascript
// Implement:
formatCurrency(amount, currency)
formatDate(isoDateString)
formatDateRange(startIso, endIso)
buildTourUrl(tourId)
createElement(tag, classNames, textContent)
```

**tour-loader.js** (main data module)
```javascript
// Implement in order:
1. getTourId()          — reads ?tour= from URL
2. loadTour(id)         — fetch JSON, returns promise
3. renderHero(data)     — populates leader + title
4. renderPhotoGrid(data) — injects 4 img src + alt
5. renderStops(data)    — builds destination strip spans
6. renderInfoBar(data)  — dates, price, CTA
7. renderItinerary(data) — builds 12 day articles
8. renderPricingHero(data) — sets image src
9. renderPricing(data)  — price, notes, options
10. renderPayments(data) — payment table rows
11. renderInclusions(data) — bullet list items
12. renderWhyUs(data)   — company text paragraphs
13. renderMeta(data)    — document.title, meta description
14. renderError(message) — fallback error display
15. init()              — orchestrates all of the above
```

**nav.js**
```javascript
// Implement:
initStickyNav()     — IntersectionObserver or scroll event
initMobileMenu()    — hamburger toggle
setActiveLink()     — highlight current page link
```

**itinerary.js**
```javascript
// Implement:
initExpandCollapse() — mobile only, click handler on day headers
setAllExpanded()     — desktop default
setAllCollapsed()    — mobile default
```

**main.js**
```javascript
// Implement:
import { init as initNav } from './nav.js';
import { init as initTourLoader } from './tour-loader.js';
import { init as initItinerary } from './itinerary.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  // Only on tour.html:
  if (document.querySelector('[data-field="title"]')) {
    initTourLoader().then(() => initItinerary());
  }
});
```

### Validation Checkpoint 4

- [ ] Visit `tour.html?tour=poland-czech-medjugorje` — page renders with real data
- [ ] Hero title reads "Poland, Czeck, & Medjugorje"
- [ ] Leader reads "Join Father Tito Cartagenas on a Pilgrimage to"
- [ ] All 4 grid photos load (or show placeholder correctly if images pending)
- [ ] Destination strip shows: Warsaw · Czestochowa · Krakow · Prague · Medjugorje
- [ ] Dates read: October 12–23, 2026
- [ ] Price reads: $4,699
- [ ] Itinerary has 12 day entries with correct text
- [ ] Payment table shows all 4 payments with correct dates
- [ ] Inclusions list has all 9 items
- [ ] Why Us has two paragraphs
- [ ] `document.title` is correct
- [ ] Visit `tour.html` (no param) — redirects to `index.html`
- [ ] Visit `tour.html?tour=fake-tour` — renders error state

---

## Phase 5 — Responsive Styles

**Goal:** Apply all media query overrides from RESPONSIVE_STRATEGY.md. The site
must be fully usable at 320px, 480px, 768px, 1024px, and 1440px.

### Responsive.css — Write in this order

```css
/* ========================
   responsive.css — ALL media queries
   ======================== */

/* --- GLOBAL --- */
/* --- NAVBAR --- */
/* --- HERO TEXT ZONE --- */
/* --- PHOTO GRID --- */
/* --- DESTINATION STRIP --- */
/* --- TOUR INFO BAR --- */
/* --- ITINERARY --- */
/* --- PRICING HERO --- */
/* --- PRICING PANEL --- */
/* --- PAYMENT TABLE --- */
/* --- INCLUSIONS --- */
/* --- WHY TRAVEL WITH US --- */
/* --- FOOTER --- */
/* --- PRINT --- */
```

For each section, write mobile base (already in component CSS) then add breakpoint
overrides at `@media (min-width: 768px)` and `@media (min-width: 1280px)`.

### Testing Matrix

For each breakpoint, test with browser DevTools responsive mode:

| Test Device    | Width  | Key Checks                                              |
|----------------|--------|---------------------------------------------------------|
| iPhone SE      | 375px  | Photo grid 2×2, stacked info bar, collapsed itinerary  |
| iPhone 14 Plus | 430px  | Destination strip wraps, CTA readable                  |
| iPad portrait  | 768px  | Two-column itinerary visible, info bar in one row       |
| iPad landscape | 1024px | All desktop-like, two-column pricing                   |
| Laptop 13"     | 1280px | Full desktop layout, navbar complete                   |
| Desktop 1440px | 1440px | Matches brochure proportions                           |

### Validation Checkpoint 5

- [ ] No horizontal scroll at any viewport width
- [ ] No text overflow/clipping at any breakpoint
- [ ] Photo grid is always 2×2 (never 1-column)
- [ ] Info bar dates/price never overlap on mobile
- [ ] Itinerary collapses on mobile, expands on desktop
- [ ] All tap targets ≥ 44px on mobile (use DevTools accessibility)
- [ ] Images never stretch outside their containers

---

## Phase 6 — Homepage & Terms Pages

**Goal:** Build `index.html` (tour listing) and `terms.html` (T&C document).

### index.html

1. Same `<header>` and `<footer>` as `tour.html`
2. Hero section: Company tagline + "Upcoming Pilgrimages"
3. Tour cards grid — JS reads `tours-manifest.json` and renders cards
4. Add `tour-card.css` styles
5. Responsive: 1 → 2 → 3 column grid

### terms.html

1. Same `<header>` and `<footer>`
2. Static HTML — no JS rendering needed
3. All T&C content from brochure Page 4 written as static HTML
4. Use proper semantic structure: `<h2>` per section, `<p>` per paragraph
5. Contact address in `<address>` tag
6. Add `terms.css` styles
7. Print media query (see RESPONSIVE_STRATEGY.md §8)

### Validation Checkpoint 6

- [ ] `index.html` renders tour card for Poland/Czech/Medjugorje tour
- [ ] Clicking card navigates to correct tour page
- [ ] `terms.html` contains all T&C sections from the brochure
- [ ] Terms page prints cleanly (Ctrl+P preview)
- [ ] Both pages have correct `<title>` and `<meta description>`

---

## Phase 7 — QA, Performance & Final Validation

**Goal:** The final phase. Full quality pass before the site is considered complete.

### 7.1 Pixel-Perfect Verification

For each brochure page, perform an overlay comparison:

1. Screenshot the website section at 1440px width
2. Open brochure page image
3. Scale both to the same width
4. Check: title proportions, spacing rhythm, photo grid aspect ratio,
   color accuracy (use color picker on both), type weight accuracy

Required match: Core layout, spacing proportions, typography hierarchy, colors.
Not required: Exact pixel-perfect for content that's text (line breaks differ).

### 7.2 HTML & CSS Validation

- [ ] All 3 HTML files pass W3C validator (zero errors)
- [ ] No `!important` declarations except in a clearly documented override
- [ ] No inline styles in HTML (except dynamically set by JS — e.g., img src)

### 7.3 Accessibility Audit

- [ ] Run DevTools Lighthouse Accessibility audit — target 90+
- [ ] All images have `alt` text
- [ ] All form inputs (future forms) have labels
- [ ] Color contrast ratio: white on navy (#1A3160) = check passes
- [ ] Keyboard navigation: Tab through entire page in order
- [ ] Screen reader: headings hierarchy logical (h1 → h2 → h3)
- [ ] No keyboard traps

### 7.4 Performance Audit

- [ ] Run Lighthouse Performance — target 85+
- [ ] All images compressed (TinyPNG or similar before adding to project)
- [ ] Google Fonts load with `display=swap`
- [ ] No render-blocking scripts (all JS at end of body, `type="module"`)
- [ ] Hero images load with `loading="eager"`, all others `loading="lazy"`
- [ ] No unused CSS (review each component CSS file)

### 7.5 Cross-Browser Testing

| Browser            | Version | Status |
|--------------------|---------|--------|
| Chrome             | Latest  | [ ]    |
| Firefox            | Latest  | [ ]    |
| Safari (macOS)     | Latest  | [ ]    |
| Edge               | Latest  | [ ]    |
| Chrome (Android)   | Latest  | [ ]    |
| Safari (iOS)       | Latest  | [ ]    |

Test for: Layout rendering, font loading, JS execution, touch interactions.

### 7.6 Functional Tests

- [ ] `?tour=poland-czech-medjugorje` — full render correct
- [ ] `?tour=` (empty) — redirects to index
- [ ] `?tour=nonexistent` — error state shown with contact info
- [ ] Mobile menu opens and closes correctly
- [ ] Sticky nav activates on scroll
- [ ] Itinerary days expand/collapse on mobile
- [ ] Photo grid hover zoom works
- [ ] All links navigate to correct targets
- [ ] Footer copyright year is current (`new Date().getFullYear()`)
- [ ] Brochure email link `mailto:info@paxvia.com` opens mail client
- [ ] Brochure phone link `tel:8442128162` works on mobile

### 7.7 Content Accuracy Check

Cross-check every piece of content against the actual brochure:

- [ ] Tour title exact (including "Czeck" — note the brochure spelling)
- [ ] All 12 day descriptions match brochure
- [ ] Overnight cities correct
- [ ] Price: $4,699 (cash/check)
- [ ] Single supplement: +$950
- [ ] Payment schedule dates correct
- [ ] All 9 inclusions items present
- [ ] Company address, phone, email, CST number correct
- [ ] Terms & Conditions text matches brochure verbatim

### 7.8 File Size Audit

```
target:
  - Each HTML file:     < 30KB
  - tokens.css:         < 5KB
  - All CSS combined:   < 80KB
  - All JS combined:    < 40KB
  - Each grid image:    < 200KB
  - Pricing hero image: < 400KB
```

---

## Build Sequence Summary

```
Phase 0 — Project setup & JSON data         [1–2 hours]
Phase 1 — Tokens & base CSS                 [1–2 hours]
Phase 2 — HTML structure                    [2–3 hours]
Phase 3 — Component styling (desktop)       [4–6 hours]
Phase 4 — JavaScript data rendering         [3–4 hours]
Phase 5 — Responsive styles                 [3–4 hours]
Phase 6 — Homepage & Terms pages            [2–3 hours]
Phase 7 — QA & final validation             [2–3 hours]
                                            ──────────
Total estimated time:                       18–27 hours
```

---

## Do Not Proceed Rules

**STOP and fix before continuing if:**

- A component visually diverges significantly from the brochure at desktop width
- HTML has validation errors
- JS throws console errors on page load
- A required `[data-field]` slot is unpopulated
- Any text on dark background fails contrast (< 3:1 for large, < 4.5:1 for body)
- Horizontal scroll appears at any viewport width
- The photo grid drops to a single column on any screen

---

## Post-Launch: Adding Future Tours

When the site is live and a new tour brochure arrives:

1. Analyze the new brochure (same analysis process as this document)
2. Create the JSON file from the COUNTRY_SYSTEM.md schema
3. Add images to the correct folder
4. Add stub to manifest
5. Test: `tour.html?tour=[new-id]`
6. Done — no code changes
