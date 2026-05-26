# Pax Via Tours — Pilgrimage Website

## Project Overview

This project converts the **Pax Via Tours & Travel** printed pilgrimage brochure into a
pixel-perfect, fully responsive, production-grade website. The brochure promotes Catholic
pilgrimage tours led by spiritual directors (currently Fr. Tito Cartagenas), covering
multi-country itineraries across Europe and beyond.

The website is engineered to be **tour-agnostic** — all tour content (destinations,
itinerary, pricing, dates, inclusions) is loaded dynamically from external JSON files.
The same HTML/CSS/JS shell renders any tour without code changes.

---

## Source Brochure

| Property        | Value                                          |
|-----------------|------------------------------------------------|
| File            | `Fr. Tito Full Brochure.pdf`                   |
| Created With    | Adobe Photoshop 24.0                           |
| Pages           | 4                                              |
| Page Size       | 8.5 × 11 in (612 × 792 pt) — US Letter        |
| Tour Name       | Poland, Czech & Medjugorje Pilgrimage          |
| Tour Code       | SFO-1012/12D                                   |
| Tour Leader     | Father Tito Cartagenas                         |
| Operator        | Pax Via Tours & Travel (PVTT)                  |
| Dates           | October 12–23, 2026                            |
| Duration        | 12 Days                                        |
| Departure       | San Francisco (SFO)                            |
| Base Price      | $4,699 per person (double occ., cash/check)    |
| Company Address | 9939 Hibert St Suite 106, San Diego, CA 92131  |
| Phone           | (844) 212-8162                                 |
| Email           | info@paxvia.com                                |
| Website         | PaxVia.com                                     |
| CST             | 2161770-50                                     |

---

## Project Goals

1. **Pixel-perfect brochure recreation** — the website must visually match the printed
   brochure as closely as possible: layout, typography, color, spacing, proportions.
2. **Full responsiveness** — desktop, laptop, tablet, and mobile.
3. **Multi-tour / multi-country support** — any new pilgrimage tour can be added by
   dropping a new JSON file. Zero code changes required.
4. **Vanilla stack** — HTML, CSS, Vanilla JavaScript only. No frameworks, no build tools.
5. **Production quality** — semantic markup, accessibility, performance, SEO-ready.

---

## Brochure → Website Section Map

| Brochure Page       | Website Section(s)                                          |
|---------------------|-------------------------------------------------------------|
| Page 1 — Cover      | Hero, Destination Strip, Tour Info Bar                     |
| Page 2 — Itinerary  | Day-by-Day Itinerary Section                               |
| Page 3 — Pricing    | Hero Image Banner, Pricing Table, Inclusions, Why Us       |
| Page 4 — T&C        | Terms & Conditions Page / Modal                            |

---

## Technology Stack

| Layer        | Technology                     |
|--------------|-------------------------------|
| Markup       | HTML5 (semantic)              |
| Styling      | CSS3 (custom properties, grid, flexbox) |
| Behavior     | Vanilla JavaScript (ES6+)     |
| Data         | JSON files                    |
| Fonts        | Google Fonts (self-hostable)  |
| Icons        | CSS + Unicode / SVG inline    |
| No build     | Static files, no bundler      |

**Explicitly excluded:** Bootstrap, Tailwind, React, Vue, Angular, jQuery.

---

## Repository Structure

```
paxvia-pilgrimage/
├── index.html                  ← Homepage / tour listing
├── tour.html                   ← Single tour page (dynamic)
├── terms.html                  ← Terms & Conditions page
│
├── assets/
│   ├── css/
│   │   ├── tokens.css          ← Design tokens (variables)
│   │   ├── reset.css           ← Minimal CSS reset
│   │   ├── base.css            ← Typography, global styles
│   │   ├── layout.css          ← Grid, containers, sections
│   │   ├── components/
│   │   │   ├── navbar.css
│   │   │   ├── hero.css
│   │   │   ├── destination-strip.css
│   │   │   ├── tour-info-bar.css
│   │   │   ├── itinerary.css
│   │   │   ├── pricing.css
│   │   │   ├── inclusions.css
│   │   │   ├── why-us.css
│   │   │   ├── photo-grid.css
│   │   │   ├── tour-card.css
│   │   │   ├── payment-table.css
│   │   │   ├── footer.css
│   │   │   └── terms.css
│   │   └── responsive.css      ← All media queries
│   │
│   ├── js/
│   │   ├── main.js             ← Entry point, init
│   │   ├── tour-loader.js      ← Reads tour JSON, populates DOM
│   │   ├── nav.js              ← Sticky nav, mobile menu
│   │   ├── itinerary.js        ← Day-by-day interactions
│   │   └── utils.js            ← Shared helpers
│   │
│   ├── images/
│   │   ├── logo/
│   │   │   └── paxvia-badge.png
│   │   ├── tours/
│   │   │   ├── poland-czech-medjugorje/
│   │   │   │   ├── cover-1.jpg   ← Prague Charles Bridge
│   │   │   │   ├── cover-2.jpg   ← Warsaw Old Town
│   │   │   │   ├── cover-3.jpg   ← Medjugorje statue
│   │   │   │   ├── cover-4.jpg   ← Krakow St. Mary's
│   │   │   │   └── pricing-hero.jpg ← Prague castle at dusk
│   │   │   └── [other-tours]/
│   │   └── shared/
│
├── data/
│   ├── tours/
│   │   ├── poland-czech-medjugorje.json
│   │   └── [other-tours].json
│   └── company.json            ← Shared company info
│
└── docs/
    ├── README.md               ← This file
    ├── PROJECT_ARCHITECTURE.md
    ├── DESIGN_SYSTEM.md
    ├── COMPONENT_MAP.md
    ├── COUNTRY_SYSTEM.md
    ├── RESPONSIVE_STRATEGY.md
    └── IMPLEMENTATION_PLAN.md
```

---

## Development Workflow

1. Read `DESIGN_SYSTEM.md` — internalize all tokens before writing a single line of CSS.
2. Read `COMPONENT_MAP.md` — understand every component before writing HTML.
3. Read `COUNTRY_SYSTEM.md` — understand data flow before writing JavaScript.
4. Follow `IMPLEMENTATION_PLAN.md` phase by phase — do not skip phases.
5. Validate each phase against the brochure images before moving forward.

---

## Future Roadmap

- Add more pilgrimage tours as JSON files (Italy, Holy Land, Fatima, etc.)
- Booking/registration form integration
- Multi-language support (English/Spanish)
- Photo gallery lightbox per tour
- Tour comparison feature
- PDF brochure download generation
- Countdown timer to tour departure
