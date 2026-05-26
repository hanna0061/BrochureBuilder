# Project Architecture
## Pax Via Tours — Pilgrimage Website

---

## 1. Architectural Philosophy

This project is a **static, data-driven website** built on vanilla HTML, CSS, and JavaScript.
There is no build step, no bundler, no framework. The architecture is designed so that:

- **Adding a new tour = dropping a JSON file** — no code changes.
- **Changing tour content = editing a JSON file** — no HTML changes.
- **Styling all tours consistently** = one CSS token system governs everything.
- **Every component** is a self-contained, reusable pattern.

The brochure has four distinct sections. Each maps to a reusable component cluster on
the website. The data that varies between tours (destinations, itinerary, pricing, dates,
images) is fully externalized to JSON.

---

## 2. File & Folder Structure

```
paxvia-pilgrimage/
│
├── index.html                        ← Tour index / homepage
├── tour.html                         ← Single tour page (shell, JS-populated)
├── terms.html                        ← Terms & Conditions (static)
│
├── assets/
│   │
│   ├── css/
│   │   ├── tokens.css               ← ALL design tokens (CSS custom properties)
│   │   ├── reset.css                ← Minimal box-model reset
│   │   ├── base.css                 ← Body, typography defaults, link states
│   │   ├── layout.css               ← .container, .section, grid utilities
│   │   │
│   │   ├── components/
│   │   │   ├── navbar.css           ← Top header bar + sticky behavior
│   │   │   ├── hero.css             ← Cover title block
│   │   │   ├── photo-grid.css       ← 2×2 destination photo grid
│   │   │   ├── destination-strip.css← City/stop names banner
│   │   │   ├── tour-info-bar.css    ← Dates · Logo badge · Price · CTA
│   │   │   ├── itinerary.css        ← Day-by-day two-column layout
│   │   │   ├── pricing-hero.css     ← Full-bleed hero image (pricing page)
│   │   │   ├── pricing-table.css    ← Price + options + payment schedule
│   │   │   ├── inclusions.css       ← "What's included" bullet list
│   │   │   ├── why-us.css           ← Company description section
│   │   │   ├── tour-card.css        ← Tour listing cards (homepage)
│   │   │   ├── payment-table.css    ← Payment schedule table
│   │   │   ├── terms.css            ← Terms & Conditions document styles
│   │   │   └── footer.css           ← Footer bar
│   │   │
│   │   └── responsive.css           ← All @media queries (single file)
│   │
│   ├── js/
│   │   ├── main.js                  ← App entry point; initializes modules
│   │   ├── tour-loader.js           ← Fetches JSON, renders tour content
│   │   ├── nav.js                   ← Sticky nav, mobile menu toggle
│   │   ├── itinerary.js             ← Day expand/collapse interaction
│   │   └── utils.js                 ← formatCurrency(), formatDate(), etc.
│   │
│   └── images/
│       ├── logo/
│       │   ├── paxvia-badge.png     ← Circular gold seal logo
│       │   └── paxvia-badge.svg     ← SVG version
│       │
│       ├── tours/
│       │   ├── poland-czech-medjugorje/
│       │   │   ├── grid-1.jpg       ← Prague Charles Bridge
│       │   │   ├── grid-2.jpg       ← Warsaw Old Town Square
│       │   │   ├── grid-3.jpg       ← Medjugorje Virgin Mary statue
│       │   │   ├── grid-4.jpg       ← Krakow St. Mary's Basilica
│       │   │   └── pricing-hero.jpg ← Prague Castle at dusk
│       │   │
│       │   └── [future-tours]/
│       │       └── ...
│       │
│       └── shared/
│           └── placeholder.jpg      ← Fallback image
│
└── data/
    ├── company.json                  ← Shared: company name, contact, address
    └── tours/
        ├── poland-czech-medjugorje.json
        └── [future-tours].json
```

---

## 3. CSS Architecture

### Layer Order (cascade-safe)

```
1. tokens.css          — custom properties only, no selectors
2. reset.css           — box-sizing, margin/padding zeroes
3. base.css            — html, body, h1-h6, p, a, img defaults
4. layout.css          — .container, .section, .grid-* utilities
5. components/*.css    — individual component styles
6. responsive.css      — all @media overrides, loaded last
```

Each CSS file is included in `<head>` in this exact order. No `@import` chains —
all files are individual `<link>` tags to maximize browser parallel loading.

### Token System (tokens.css)

```css
:root {
  /* --- BRAND COLORS (from brochure) --- */
  --color-navy:          #1A3160;   /* Primary navy — banner bars, headers */
  --color-navy-dark:     #112244;   /* Deeper navy — hover states */
  --color-navy-light:    #1E3D70;   /* Lighter navy — active states */
  --color-white:         #FFFFFF;
  --color-off-white:     #F8F7F5;   /* Warm off-white for section bg */
  --color-text-primary:  #1A1A2E;   /* Near-black for headings */
  --color-text-body:     #3A3A4A;   /* Charcoal for body paragraphs */
  --color-text-muted:    #6B6B7A;   /* Subdued gray for captions */
  --color-badge-gold:    #C4973A;   /* Circular badge accent */
  --color-divider:       #D0CFC8;   /* Light warm gray for rules/borders */

  /* --- TYPOGRAPHY --- */
  --font-serif:   'EB Garamond', 'Garamond', 'Times New Roman', Georgia, serif;
  --font-sans:    'Inter', 'Helvetica Neue', Arial, sans-serif;

  /* --- TYPE SCALE (matches brochure proportions) --- */
  --text-xs:     0.75rem;   /* 12px — fine print, legal */
  --text-sm:     0.875rem;  /* 14px — captions, labels */
  --text-base:   1rem;      /* 16px — body copy */
  --text-md:     1.125rem;  /* 18px — lead body */
  --text-lg:     1.375rem;  /* 22px — subheadings */
  --text-xl:     1.75rem;   /* 28px — section headers (mobile) */
  --text-2xl:    2.25rem;   /* 36px — section headers (desktop) */
  --text-3xl:    3rem;      /* 48px — hero title (mobile) */
  --text-4xl:    4rem;      /* 64px — hero title (desktop) */
  --text-display: clamp(2.5rem, 7vw, 4.5rem); /* Fluid hero display */

  /* --- SPACING SCALE (4px base unit) --- */
  --space-1:     0.25rem;   /* 4px */
  --space-2:     0.5rem;    /* 8px */
  --space-3:     0.75rem;   /* 12px */
  --space-4:     1rem;      /* 16px */
  --space-5:     1.25rem;   /* 20px */
  --space-6:     1.5rem;    /* 24px */
  --space-8:     2rem;      /* 32px */
  --space-10:    2.5rem;    /* 40px */
  --space-12:    3rem;      /* 48px */
  --space-16:    4rem;      /* 64px */
  --space-20:    5rem;      /* 80px */
  --space-24:    6rem;      /* 96px */

  /* --- LAYOUT --- */
  --container-max:   1100px;
  --container-pad:   clamp(1rem, 5vw, 3rem);
  --section-py:      clamp(3rem, 6vw, 5rem);
  --grid-gap:        1.5rem;

  /* --- EFFECTS --- */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   16px;
  --shadow-sm:   0 2px 8px rgba(26, 49, 96, 0.08);
  --shadow-md:   0 4px 20px rgba(26, 49, 96, 0.12);
  --shadow-lg:   0 8px 40px rgba(26, 49, 96, 0.18);
  --transition:  0.25s ease;
}
```

### Naming Convention

- **Components:** `.component-name` (kebab-case, no abbreviations)
- **Elements:** `.component-name__element` (BEM-lite, double underscore)
- **Modifiers:** `.component-name--modifier` (double hyphen)
- **Utilities:** `.u-` prefix (e.g., `.u-text-center`, `.u-visually-hidden`)
- **State classes:** `.is-` prefix (e.g., `.is-active`, `.is-sticky`, `.is-open`)
- **JS hooks:** `data-` attributes only — never style by JS-added classes

Examples:
```
.tour-info-bar                      ← component
.tour-info-bar__dates               ← element
.tour-info-bar__price               ← element
.tour-info-bar__cta                 ← element
.tour-info-bar--compact             ← modifier

.itinerary                          ← component
.itinerary__header                  ← element
.itinerary__grid                    ← element
.itinerary__day                     ← element
.itinerary__day--active             ← modifier
```

---

## 4. JavaScript Architecture

### Module Pattern

Each JS file is a self-contained module with a single exported `init()` function.
`main.js` calls all `init()` functions on `DOMContentLoaded`.

```
main.js
  ├── import / call nav.init()
  ├── import / call itinerary.init()
  └── import / call tourLoader.init()   ← on tour.html only
```

No module bundler — use native ES Modules (`type="module"`) for clean separation.
`main.js` uses `<script type="module" src="...">` in HTML.

### tour-loader.js — Data Flow

```
1. Read ?tour= query param from URL (e.g., ?tour=poland-czech-medjugorje)
2. fetch(`/data/tours/${tourId}.json`)
3. Parse JSON → tourData object
4. Call render functions:
   - renderHero(tourData)         → populates hero title, subtitle
   - renderPhotoGrid(tourData)    → injects 4 images into grid cells
   - renderDestinationStrip(tourData)  → builds city list
   - renderTourInfoBar(tourData)  → injects dates, price, CTA
   - renderItinerary(tourData)    → builds day entries from itinerary array
   - renderPricingHero(tourData)  → sets pricing section background image
   - renderPricing(tourData)      → populates price, options, payment table
   - renderInclusions(tourData)   → builds bullet list
   - renderWhyUs(tourData)        → injects company text
5. document.title = tourData.title + " | Pax Via Tours"
```

### utils.js

```javascript
// Exposed utility functions:
formatCurrency(amount, currency)     → "$4,699"
formatDate(dateStr)                  → "October 12, 2026"
formatDateRange(start, end)          → "October 12–23, 2026"
buildTourUrl(tourId)                 → "/tour.html?tour=poland-czech-medjugorje"
createElement(tag, classes, text)   → DOM helper
```

### nav.js

```javascript
// Behaviors:
- Sticky class `.is-sticky` added to <header> when scrollY > 60
- Mobile hamburger toggles `.is-open` on `.navbar__menu`
- Active link detection by pathname
```

### itinerary.js

```javascript
// Behaviors:
- Each day entry is click-expandable on mobile
- Adds `.is-expanded` to `.itinerary__day` on click
- Default: all days expanded on desktop, collapsed on mobile
```

---

## 5. HTML Page Architecture

### tour.html — Shell Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- meta, title (JS-set), CSS links -->
</head>
<body data-tour-id="">   <!-- JS reads this or ?tour= param -->

  <header class="navbar" id="navbar">...</header>

  <main id="tour-content">

    <!-- SECTION 1: HERO (Cover Page equivalent) -->
    <section class="hero" aria-label="Tour overview">
      <div class="hero__text-zone">
        <p class="hero__leader" data-field="leader">...</p>
        <h1 class="hero__title" data-field="title">...</h1>
      </div>
      <div class="destination-strip" data-field="stops">...</div>
      <div class="photo-grid" data-field="photos">
        <div class="photo-grid__cell" data-index="0">...</div>
        <div class="photo-grid__cell" data-index="1">...</div>
        <div class="photo-grid__cell" data-index="2">...</div>
        <div class="photo-grid__cell" data-index="3">...</div>
      </div>
      <div class="tour-info-bar" data-field="info">
        <div class="tour-info-bar__dates">...</div>
        <div class="tour-info-bar__badge">...</div>
        <div class="tour-info-bar__price">...</div>
        <div class="tour-info-bar__cta">...</div>
      </div>
    </section>

    <!-- SECTION 2: ITINERARY -->
    <section class="itinerary" aria-label="Day by day itinerary">
      <h2 class="itinerary__header">Day by Day Itinerary</h2>
      <div class="itinerary__grid" data-field="itinerary">
        <!-- JS-generated day entries -->
      </div>
      <div class="itinerary__meta" data-field="tourMeta">...</div>
    </section>

    <!-- SECTION 3: PRICING HERO IMAGE -->
    <div class="pricing-hero" data-field="pricingHero">...</div>

    <!-- SECTION 4: PRICING -->
    <section class="pricing" aria-label="Tour pricing">
      <div class="pricing__left">
        <div class="pricing__base" data-field="price">...</div>
        <div class="pricing__options" data-field="options">...</div>
        <table class="payment-table" data-field="payments">...</table>
      </div>
      <div class="pricing__right">
        <h3 class="inclusions__title">Base Price Includes:</h3>
        <ul class="inclusions__list" data-field="inclusions">...</ul>
      </div>
    </section>

    <!-- SECTION 5: WHY TRAVEL WITH US -->
    <section class="why-us" data-field="whyUs">...</section>

  </main>

  <footer class="footer" id="footer">...</footer>

  <script type="module" src="assets/js/main.js"></script>
</body>
</html>
```

---

## 6. Data Flow Architecture

```
User visits: /tour.html?tour=poland-czech-medjugorje
          |
          v
main.js → tour-loader.js
          |
          v
fetch('/data/tours/poland-czech-medjugorje.json')
          |
          v
tourData = {
  id, title, leader, stops[],
  dates, duration, price, departure,
  photos[], pricingHeroImage,
  itinerary[],
  inclusions[], options{},
  payments[],
  company{}
}
          |
          v
render*() functions → inject into [data-field] slots
          |
          v
Fully populated tour page
```

**Fallback strategy:**
- If `?tour=` param missing → redirect to `index.html`
- If JSON fetch fails → show error state with contact info
- If image 404 → `onerror` replaces with `shared/placeholder.jpg`

---

## 7. Homepage (index.html) Architecture

The homepage lists all available tours as cards. It reads a **manifest file** at startup.

```
/data/tours-manifest.json → array of tour stubs
  [
    { id, title, thumbnail, dates, price, departure },
    ...
  ]
```

Each stub renders a `.tour-card` on the homepage. Clicking navigates to
`/tour.html?tour={id}`.

The homepage itself does not load individual tour JSON files — only the manifest.

---

## 8. Scalability Strategy

### Adding a New Tour

1. Create `/data/tours/[new-tour-id].json` with the tour schema.
2. Add images to `/assets/images/tours/[new-tour-id]/`.
3. Add a stub entry to `/data/tours-manifest.json`.
4. The new tour is instantly live on the homepage and accessible via URL.

**Zero code changes required.**

### Adding a New Page Type

1. Create a new HTML shell (e.g., `gallery.html`).
2. Create corresponding CSS in `assets/css/components/gallery.css`.
3. Add `gallery` section to the tour JSON schema.
4. The JS loader handles it via a new `renderGallery()` function.

### Theme Variations (future)

All colors live in `tokens.css` under `:root`. A tour can optionally override
tokens by including a `theme` object in its JSON, allowing per-tour accent colors
(e.g., a Fatima tour might use a different palette).

---

## 9. Asset Organization Rules

- **Images named semantically:** `grid-1.jpg`, `pricing-hero.jpg` — not `IMG_0034.jpg`.
- **All images compressed** before committing — max 200KB for grid thumbs, 500KB for hero.
- **WebP preferred** with JPG fallback via `<picture>` element.
- **Logo in two formats:** `.png` (current) and `.svg` (future-proof vector).
- **No hotlinking** — all assets hosted locally.

---

## 10. State Management

This site has minimal state. All state lives in the DOM and module-level variables.

| State                  | Where Stored                    |
|------------------------|---------------------------------|
| Current tour data      | `tourLoader.currentTour` object |
| Nav sticky flag        | `.is-sticky` class on `<header>`|
| Mobile menu open       | `.is-open` class on menu        |
| Expanded itinerary day | `.is-expanded` class on day row |
| Form field values      | Native HTML form state          |

No global state store. No `window.*` pollution. Each module owns its state.
