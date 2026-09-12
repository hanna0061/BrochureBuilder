# Design System
## Pax Via Tours — Pilgrimage Website

> **Source of truth:** Every token in this document was extracted directly from
> visual analysis of the printed brochure pages. Nothing is assumed or invented.

---

## 1. Brochure Visual Analysis Summary

The brochure establishes a clear, formal visual identity:

- **Tone:** Reverent, trustworthy, classical — appropriate for Catholic pilgrimage
- **Aesthetic:** Traditional editorial print — not trendy, not minimal-tech, not loud
- **Dominant colors:** Deep navy blue + clean white + warm off-white
- **Typography mood:** Classical serif headlines (editorial, authoritative), with clean
  supporting text for body and data
- **Layout:** Structured, content-forward, high information density with clear hierarchy
- **Photo treatment:** Full-bleed, edge-to-edge photography with no rounding or filters

---

## 2. Color System

### Primary Palette

Extracted directly from the brochure cover, banners, and section backgrounds.

| Token                  | Hex Value   | Usage                                              |
|------------------------|-------------|-----------------------------------------------------|
| `--color-navy`         | `#1A3160`   | Main brand color — all banner bars, dark sections   |
| `--color-navy-dark`    | `#112244`   | Hover states, deeper shadow overlays                |
| `--color-navy-light`   | `#1E3D70`   | Active/focus states, alternate sections             |
| `--color-white`        | `#FFFFFF`   | Main background, text on dark, photo borders        |
| `--color-off-white`    | `#F8F7F5`   | Warm background for alternating sections            |
| `--color-badge-gold`   | `#C4973A`   | Circular logo seal accent only                      |

### Text Colors

| Token                  | Hex Value   | Usage                                              |
|------------------------|-------------|-----------------------------------------------------|
| `--color-text-heading` | `#1A1A2E`   | All headings — very dark navy, near-black           |
| `--color-text-body`    | `#3A3A4A`   | All body paragraphs, itinerary text                 |
| `--color-text-muted`   | `#6B6B7A`   | Captions, fine print, metadata                      |
| `--color-text-on-dark` | `#FFFFFF`   | Text placed on navy backgrounds                     |
| `--color-text-label`   | `#4A4A5A`   | Day labels, section labels, table headers           |

### Functional Colors

| Token                  | Hex Value   | Usage                                              |
|------------------------|-------------|-----------------------------------------------------|
| `--color-divider`      | `#D0CFC8`   | Horizontal rules, table borders                     |
| `--color-overlay`      | `rgba(26,49,96,0.55)` | Image overlay for pricing hero              |
| `--color-row-alt`      | `#F3F2F0`   | Alternating table row background                    |

### Color Usage Rules

1. **Never use navy as a text color on white** — use `--color-text-heading` instead.
2. **Never use gold as a background** — it is badge-only.
3. **White borders** (4–8px) between photo grid cells are a core branding element.
4. **Only two section backgrounds** are used: white and `--color-navy`. No in-between.
5. The pricing hero image uses a **dark overlay** to maintain text legibility.

---

## 3. Typography System

### Font Selection

The brochure uses a classical serif for headlines and body text, consistent with the
traditional, reverent tone of Catholic pilgrimage materials.

```
Heading / Display: 'EB Garamond'
  Fallback chain:  'Garamond', 'Times New Roman', Georgia, serif

Body / UI / Labels: 'Inter'
  Fallback chain:  'Helvetica Neue', Arial, sans-serif
```

**Why EB Garamond:** It is the closest freely available match to the classical
oldstyle serif visible in the brochure's title treatment. It has the correct weight
contrast, elegant capitals, and historical gravitas.

**Why Inter for UI:** The brochure's banner text, labels, and data blocks use a
neutral, clean sans-serif that does not compete with the headline serif.

### Google Fonts Load Order

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Type Scale

All values are CSS custom properties defined in `tokens.css`.

| Token           | Value (rem) | Pixels | Role                                           |
|-----------------|-------------|--------|------------------------------------------------|
| `--text-xs`     | 0.75rem     | 12px   | Legal fine print, T&C body                     |
| `--text-sm`     | 0.875rem    | 14px   | Captions, date/time labels, table data         |
| `--text-base`   | 1rem        | 16px   | Body copy, itinerary day text                  |
| `--text-md`     | 1.125rem    | 18px   | Lead body, pricing descriptions                |
| `--text-lg`     | 1.375rem    | 22px   | Day headings in itinerary                      |
| `--text-xl`     | 1.75rem     | 28px   | Section sub-titles ("Base Price Includes")     |
| `--text-2xl`    | 2.25rem     | 36px   | Section headers ("Day by Day Itinerary")       |
| `--text-3xl`    | 3rem        | 48px   | Hero title on tablet                           |
| `--text-4xl`    | 4rem        | 64px   | Hero title on desktop                          |
| `--text-display`| clamp(2.5rem, 7vw, 4.5rem) | fluid | Hero title "Poland, Czeck & Medjugorje" |

### Line Heights

| Use Case          | Line Height | Token              |
|-------------------|-------------|---------------------|
| Display headings  | 1.10        | `--lh-display`      |
| Section headings  | 1.25        | `--lh-heading`      |
| Body text         | 1.65        | `--lh-body`         |
| Dense table text  | 1.40        | `--lh-dense`        |
| Labels / caps     | 1.00        | `--lh-label`        |

### Letter Spacing

| Use Case            | Value       | Token                |
|---------------------|-------------|----------------------|
| Display headings    | -0.02em     | `--ls-display`       |
| Section headings    | -0.01em     | `--ls-heading`       |
| Body text           | 0           | (default)            |
| Uppercase labels    | 0.12em      | `--ls-label`         |
| Banner strip text   | 0.06em      | `--ls-banner`        |

### Typographic Roles (from brochure)

| Element                           | Font        | Weight | Size          | Style  |
|-----------------------------------|-------------|--------|---------------|--------|
| "Join Father Tito... on a Pilgrimage to" | EB Garamond | 400 | --text-sm | italic |
| "Poland, Czeck, & Medjugorje"     | EB Garamond | 600    | --text-display| normal |
| "Warsaw · Czestochowa · Krakow..." | Inter       | 500    | --text-sm     | uppercase |
| "October 12–23, 2026"             | EB Garamond | 400    | --text-lg     | italic |
| "$4699"                           | EB Garamond | 600    | --text-xl     | normal |
| "From San Francisco"              | EB Garamond | 400    | --text-sm     | normal |
| "Book Now at PaxVia.com"          | Inter       | 600    | --text-md     | uppercase |
| "Day by Day Itinerary"            | EB Garamond | 600    | --text-2xl    | normal |
| "Day 1:", "Day 2:" etc.           | EB Garamond | 700    | --text-base   | normal |
| Itinerary body                    | EB Garamond | 400    | --text-base   | normal |
| "PRICING"                         | Inter       | 700    | --text-md     | uppercase |
| "BASE PRICE PER PERSON"           | Inter       | 700    | --text-base   | uppercase |
| "$4699.00*"                       | EB Garamond | 700    | --text-2xl    | normal |
| Payment table labels              | Inter       | 600    | --text-sm     | uppercase |
| "Why Travel with Us?"             | EB Garamond | 600    | --text-xl     | normal |
| Why Us body text                  | Inter       | 400    | --text-base   | normal |
| "Terms & Conditions"              | EB Garamond | 400    | --text-2xl    | italic |
| T&C section labels                | Inter       | 700    | --text-base   | uppercase |
| T&C body                          | Inter       | 400    | --text-xs     | normal |

---

## 4. Spacing System

### Base Unit: 4px (0.25rem)

```
--space-1:   4px     Micro — icon gaps, tight padding
--space-2:   8px     Tiny — inline gaps, badge padding
--space-3:   12px    Small — between related elements
--space-4:   16px    Base — standard inner padding
--space-5:   20px    Medium-small
--space-6:   24px    Medium — card padding, column gaps
--space-8:   32px    Large — sub-section spacing
--space-10:  40px    XL — section interior rhythm
--space-12:  48px    2XL — section padding mobile
--space-16:  64px    3XL — section padding tablet
--space-20:  80px    4XL — section padding desktop
--space-24:  96px    5XL — hero interior spacing
```

### Section Rhythm (from brochure proportions)

```
Section vertical padding:
  Mobile:    var(--space-12)   48px
  Tablet:    var(--space-16)   64px
  Desktop:   var(--space-20)   80px

Inner column gap (e.g., pricing two columns):
  Mobile:    var(--space-6)    24px
  Desktop:   var(--space-10)   40px

Photo grid gap (white borders between photos):
  All sizes: 4px–6px (thin, precise)

Tour info bar internal padding:
  All sizes: var(--space-6) vertical, var(--space-8) horizontal
```

---

## 5. Grid System

The brochure uses only two grid structures. No complex multi-breakpoint grids.

### 2×2 Photo Grid (Cover Page)

```css
.photo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 5px;                      /* white border effect */
  background-color: var(--color-white);  /* shows as border */
}

.photo-grid__cell {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.photo-grid__cell img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Two-Column Content Grid (Itinerary / Pricing)

```css
.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--grid-gap);
}

/* Collapses to single column on mobile */
@media (max-width: 768px) {
  .two-col-grid {
    grid-template-columns: 1fr;
  }
}
```

### Container

```css
.container {
  width: 100%;
  max-width: var(--container-max);   /* 1100px */
  margin-inline: auto;
  padding-inline: var(--container-pad);
}
```

---

## 6. Component Visual Specifications

### Destination Strip (Banner Bar)

```
Height:          48px desktop / 44px mobile
Background:      var(--color-navy)
Text:            var(--color-white), Inter 500, uppercase, var(--ls-banner)
Separator:       " · " or " - " between city names
Width:           Full bleed (100% width, breakout from container)
Padding:         12px vertical, container-pad horizontal
```

### Tour Info Bar

```
Height:          auto (content-driven) ~80–100px
Background:      var(--color-navy)
Layout:          3-column flex: [dates] [badge] [price]
Dates section:   EB Garamond italic, white, left-aligned
Badge section:   Centered, circular logo image 72px diameter
Price section:   EB Garamond, white, right-aligned
CTA strip:       Full-width sub-row, white text Inter 600, uppercase, centered
Width:           Full bleed
```

### PRICING Header Bar

```
Background:      var(--color-navy)
Text:            "PRICING" — Inter 700, white, uppercase, --ls-label, centered
Padding:         16px vertical
Width:           Full bleed
```

### Payment Table

```
Columns:         [Label] [Amount] [Due Date]
Row spacing:     12px vertical padding per row
Font:            Inter for labels, EB Garamond for amounts
Alt rows:        --color-row-alt background
Border:          1px var(--color-divider) between rows
```

### Why Travel With Us Section

```
Background:      var(--color-navy)
Text color:      var(--color-text-on-dark)
Heading:         EB Garamond 600, centered, --text-xl
Body:            Inter 400, --text-base, max-width ~760px centered, --lh-body
Padding:         var(--section-py) vertical
```

---

## 7. Border Radius System

The brochure has an intentionally **sharp, formal aesthetic**. Rounded corners are
minimal — they appear only on interactive UI elements.

```
--radius-sm:   4px    Buttons, small tags
--radius-md:   8px    Cards on index page only
--radius-lg:   16px   Reserved for modals/overlays
--radius-none: 0      Default for all structural elements
```

**Rule:** Photo grid, banners, and pricing section have **zero border radius**.
This is faithful to the print brochure's hard-edge layout.

---

## 8. Shadow System

Shadows are subtle and used only to lift interactive elements.

```
--shadow-sm:  0 2px 8px rgba(26, 49, 96, 0.08)    Tour cards on homepage
--shadow-md:  0 4px 20px rgba(26, 49, 96, 0.12)   Card hover state
--shadow-lg:  0 8px 40px rgba(26, 49, 96, 0.18)   Modal / overlay
```

**Rule:** No shadows on structural sections (hero, banners, pricing). Those
elements use background color and negative space for visual separation.

---

## 9. Button System

Derived from the "Book Now at PaxVia.com" CTA on the brochure cover.

### Primary CTA Button (Book Now style)

```
Background:    var(--color-navy)
Text:          var(--color-white), Inter 600, uppercase, --ls-label
Padding:       14px 32px
Border:        2px solid var(--color-white)   ← subtle white border
Border-radius: var(--radius-sm)
Hover:         Background lightens to var(--color-navy-light)
Active:        Background darkens to var(--color-navy-dark)
```

### Secondary / Ghost Button

```
Background:    transparent
Text:          var(--color-navy), Inter 600
Border:        2px solid var(--color-navy)
Padding:       12px 28px
Hover:         Background fills with var(--color-navy), text turns white
```

### CTA in Dark Sections

```
Background:    var(--color-white)
Text:          var(--color-navy), Inter 700
Padding:       14px 32px
Border-radius: var(--radius-sm)
Hover:         Slight opacity drop (0.92)
```

---

## 10. Animation & Transition Principles

The brochure is formal print. The website should not contradict this with flashy
animations. All motion must be **purposeful and subtle**.

### Transition Speeds

```
--transition-fast:    150ms ease         Hover color changes
--transition-base:    250ms ease         Most interactions
--transition-slow:    400ms ease         Section reveals, menu open
--transition-expand:  300ms ease-in-out  Itinerary day expand
```

### Allowed Animations

| Element                   | Animation                           |
|---------------------------|--------------------------------------|
| Photo grid images         | `scale(1.04)` on hover, 400ms        |
| Nav link underline        | Width grow from 0 → 100%, 250ms      |
| CTA button                | Background color shift, 150ms        |
| Itinerary day expand      | `max-height` transition, 300ms       |
| Scroll entrance           | `opacity 0→1 + translateY 20px→0`, once |
| Mobile menu               | `translateY` slide in, 300ms         |
| Sticky nav                | Background opacity transition, 200ms |

### Forbidden

- Parallax scrolling
- Auto-playing carousels
- Spinning loaders visible to user
- Continuous keyframe loops (except a single subtle pulse on badge)
- Heavy entrance animations with long delays

---

## 11. Image Treatment

Based on brochure photo grid analysis:

```
Photo grid:      4:3 aspect ratio per cell, object-fit: cover
Pricing hero:    16:9 or wider, object-fit: cover, dark overlay
No filters:      No grayscale, sepia, or color treatments applied
No captions:     Photos in grid have no text overlaid
No rounding:     All photo corners are sharp (border-radius: 0)
White gaps:      5px white border between grid photos (brochure signature)
```

---

## 12. Iconography

The brochure uses **no icons** — it is pure text and photography. The website
may introduce minimal icons only for navigation and utility elements.

```
Source:    Inline SVG only (no icon fonts, no external icon libraries)
Size:      16px — inline UI (nav, footer links)
           24px — section utility icons
Color:     currentColor (inherits from parent text color)
Usage:     Phone, email, external link, chevron, hamburger menu only
```

---

## 13. Responsive Breakpoints

```
--bp-sm:   480px    Large mobile (landscape)
--bp-md:   768px    Tablet portrait
--bp-lg:   1024px   Tablet landscape / small laptop
--bp-xl:   1280px   Standard desktop
--bp-2xl:  1440px   Wide desktop (design baseline)
```

**Mobile-first approach:** base styles are mobile. Each breakpoint adds layout
complexity. See `RESPONSIVE_STRATEGY.md` for full breakpoint behavior per section.
