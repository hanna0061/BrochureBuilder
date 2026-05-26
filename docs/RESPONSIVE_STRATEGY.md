# Responsive Strategy
## Pax Via Tours — Pilgrimage Website

---

## 1. Philosophy

The brochure is a **fixed-size printed artifact** (8.5×11 in, portrait). The website
must translate this into a fluid, multi-device experience while preserving the
brochure's visual identity at every screen size.

**Guiding principles:**

1. **Mobile-first CSS** — all base styles are written for mobile. Breakpoints add complexity.
2. **Brochure proportions preserved** — the 2×2 grid, the navy bars, and the two-column
   itinerary are identity-defining. They must survive the translation.
3. **Typography scales smoothly** — no jarring jumps between sizes.
4. **Touch-friendly** — all interactive targets minimum 44×44px.
5. **No layout shift** — images have explicit width/height attributes to prevent CLS.

---

## 2. Breakpoint System

Defined as CSS custom properties in `tokens.css` and used as media query values
in `responsive.css`.

```
--bp-sm:   480px    Large mobile / landscape phones
--bp-md:   768px    Tablet portrait (iPad)
--bp-lg:  1024px    Tablet landscape / small laptop
--bp-xl:  1280px    Standard desktop
--bp-2xl: 1440px    Wide desktop (design target / brochure baseline)
```

Usage in CSS:
```css
/* Mobile base — no query */
.element { ... }

/* Tablet portrait and up */
@media (min-width: 768px) { .element { ... } }

/* Desktop and up */
@media (min-width: 1280px) { .element { ... } }
```

All media queries live in `responsive.css` only. Component CSS files contain
**zero media queries**. This keeps each component file clean and all responsive
overrides in one maintainable file.

---

## 3. Container Behavior

```css
.container {
  width: 100%;
  max-width: 1100px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 3rem);
}
```

| Viewport Width | Padding-inline | Effective Content Width |
|----------------|----------------|-------------------------|
| 360px          | 16px           | 328px                   |
| 480px          | 24px           | 432px                   |
| 768px          | 38px           | 692px                   |
| 1024px         | 51px           | 922px                   |
| 1280px         | 64px           | 1152px (capped at 1100) |
| 1440px+        | 3rem (48px)    | 1100px (max)            |

---

## 4. Component-by-Component Responsive Behavior

---

### 4.1 Navbar

**Mobile (< 768px)**
- Logo + brand name visible
- Nav links HIDDEN
- Hamburger button visible (top-right)
- "Book Now" CTA HIDDEN
- When open: full-width overlay, links stacked vertically, 48px tap height each
- Close button (×) top-right of overlay

**Tablet (768px–1279px)**
- Logo + abbreviated nav (3–4 key links) visible
- Hamburger HIDDEN
- "Book Now" CTA visible as compact button

**Desktop (1280px+)**
- Full logo + all nav links + full CTA button
- Sticky behavior: at `scrollY > 60`, navy background fades in

---

### 4.2 Hero Text Zone (Cover Page Top)

**Mobile (< 480px)**
```
[small leader text — 12px, italic, centered]
[main title — 2.5rem, EB Garamond, centered, wraps naturally]
padding: 24px top, 16px sides
```

**Tablet (480px–1023px)**
```
[small leader text — 13px]
[main title — clamp(2.5rem, 6vw, 3.5rem)]
padding: 32px top
```

**Desktop (1280px+)**
```
[small leader text — 14px]
[main title — clamp(3rem, 5vw, 4.5rem)]
padding: 40px top
```

**Constraint:** The title must always fit visually above the photo grid without
excessive whitespace. Test on actual screen at each breakpoint.

---

### 4.3 Photo Grid 2×2

This is the most critical responsive element. The 2×2 grid is the visual signature
of the brochure cover — it must be preserved at as many screen sizes as possible.

**Mobile (< 480px)**
```
Option A: 2×2 grid maintained at small scale (cells ~160px each)
Option B: 1×2 stack (two photos wide, two rows tall — but each row is taller)

DECISION: Use Option A (2×2) down to 320px.
Cells use aspect-ratio: 4/3 and shrink naturally with the viewport.
The grid gap reduces to 3px at mobile.
```

**Tablet (480px–1023px)**
```
2×2 grid maintained
Gap: 4px
Cell width: (viewport - container-pad × 2 - 4px) / 2
```

**Desktop (1280px+)**
```
2×2 grid maintained
Gap: 5px (matches brochure)
Max total grid width: 1100px (container max)
```

**Image behavior at all sizes:**
```css
.photo-grid__cell { aspect-ratio: 4 / 3; overflow: hidden; }
.photo-grid__cell img { width: 100%; height: 100%; object-fit: cover; }
```

---

### 4.4 Destination Strip

**Mobile**
```
Wraps to multiple lines if stops are too many
Font: 12px, uppercase
Padding: 10px vertical
Text-align: center
Overflow: hidden, no horizontal scroll
```

**Tablet +**
```
Single line, no wrapping (7 stops or fewer typically fit)
Font: 14px
Padding: 12px vertical
```

**If stops overflow on mobile:** Use smaller font (11px) and tighter letter-spacing.
Never use horizontal scroll — the strip must always be fully visible.

---

### 4.5 Tour Info Bar

**Mobile (< 768px)**
```
Layout: Column stack
  [Dates — centered]
  [Badge logo — centered, smaller: 56px]
  [Price — centered]
  [CTA strip — full width below]
Padding: 20px vertical
```

**Tablet (768px–1023px)**
```
Layout: Row flex: [dates] [badge] [price]
Badge: 64px
Padding: 20px vertical
```

**Desktop (1280px+)**
```
Layout: Row flex: [dates] [badge] [price] — space-between
Badge: 72px (matches brochure)
Max-width: 1100px container
```

---

### 4.6 Itinerary Section

**Mobile (< 768px)**
```
Single column (all 12 days stacked)
Day header: visible
Day body: collapsed by default (expandable on tap)
"Day X:" label remains always visible
Chevron icon indicates expand/collapse state
Padding: 32px vertical
```

**Tablet (768px–1023px)**
```
Single column
Day body: expanded by default
No expand/collapse behavior
```

**Desktop (1280px+)**
```
Two columns (Days 1–6 left, Days 7–12 right)
Matches brochure Page 2 layout exactly
All content fully visible, no collapse
Column gap: 40px
```

**Day entry typography:**
| Breakpoint   | Day label  | Body text  | Overnight  |
|--------------|------------|------------|------------|
| Mobile       | 15px bold  | 14px       | 13px italic|
| Tablet       | 16px bold  | 15px       | 14px italic|
| Desktop      | 16px bold  | 16px       | 14px italic|

---

### 4.7 Pricing Hero Image

**Mobile (< 768px)**
```
Height: 200px
Object-fit: cover, object-position: center 60%
```

**Tablet**
```
Height: 280px
```

**Desktop**
```
Height: clamp(300px, 35vw, 480px)
```

The Prague castle image's most important region is the castle + sky silhouette
at the center-upper portion. `object-position: center 60%` ensures this region
remains visible at all heights.

---

### 4.8 Pricing Panel

**Mobile (< 768px)**
```
Single column:
  [PRICING header bar — full width]
  [Base price block]
  [Options block]
  [Payment table — full width, font 13px]
  [Inclusions list — below, full width]
```

**Tablet (768px–1023px)**
```
Two columns (as brochure)
Equal width: 1fr 1fr
Gap: 24px
```

**Desktop (1280px+)**
```
Two columns
Gap: 40px
Base price: var(--text-2xl)
```

**Payment Table responsive behavior:**
```
Mobile: 3 columns compressed (Label | Amount | Due)
        font-size: 13px
        Allow table to be full width
Tablet+: 3 columns comfortable spacing
Desktop: Add subtle column dividers
```

---

### 4.9 Inclusions List

**Mobile**
```
Single column list
Font: 15px
Item spacing: 10px
Bullet: visible (•)
```

**Desktop**
```
Single column (right half of two-column pricing grid)
Font: 16px
Item spacing: 12px
```

---

### 4.10 Why Travel With Us

**Mobile**
```
Background: --color-navy (full width)
Heading: centered, 22px
Body: 15px, line-height 1.7
Padding: 48px vertical, 16px horizontal
```

**Desktop**
```
Background: --color-navy (full bleed beyond container)
Heading: centered, var(--text-xl) = 28px
Body: 16px, max-width 760px, centered
Padding: 80px vertical
```

---

### 4.11 Tour Cards (Homepage)

**Mobile (< 480px)**
```
1 card per row, full width
Image: 4:3 ratio
Card padding: 16px
```

**Tablet (480px–1023px)**
```
2 cards per row
Grid gap: 24px
```

**Desktop (1280px+)**
```
3 cards per row
Grid gap: 32px
Card max-width: ~340px
```

---

### 4.12 Terms & Conditions Page

**Mobile**
```
Single column
Font: 13px body (T&C is dense text — legible minimum)
Line height: 1.5
Section headings: 14px bold uppercase
Padding: 32px vertical, 16px horizontal
```

**Desktop**
```
Max-width: 900px (long-form readable width)
Font: 14px–15px body
Section headings: 14px bold uppercase
Padding: 64px vertical
```

---

### 4.13 Footer

**Mobile (< 768px)**
```
Single column, centered
Order: [Badge + name] → [Address] → [Legal]
Font: 13px
Padding: 32px vertical
```

**Desktop**
```
3 columns flex, space-between
Font: 14px
Padding: 48px vertical
```

---

## 5. Typography Responsive Scale

All heading sizes use `clamp()` for smooth fluid scaling.

| Element                | Mobile          | Tablet          | Desktop            |
|------------------------|-----------------|-----------------|--------------------|
| Hero title             | 2.5rem (40px)   | 3.5rem (56px)   | clamp(3rem, 5vw, 4.5rem) |
| Section heading (h2)   | 1.75rem (28px)  | 2rem (32px)     | 2.25rem (36px)     |
| Sub-heading (h3)       | 1.375rem (22px) | 1.5rem (24px)   | 1.75rem (28px)     |
| Body                   | 1rem (16px)     | 1rem (16px)     | 1rem (16px)        |
| Small/caption          | 0.8125rem (13px)| 0.875rem (14px) | 0.875rem (14px)    |

**Rule:** Never drop body text below 14px. Never drop caption text below 12px.

---

## 6. Touch Interaction Rules

All clickable elements on mobile must meet these minimums:

| Element              | Min Size         | Implementation                     |
|----------------------|------------------|------------------------------------|
| Navbar links         | 44×44px          | `padding: 10px 16px` minimum       |
| Hamburger button     | 44×44px          | `width: 44px; height: 44px`        |
| Itinerary day header | 44px height      | `padding: 12px 0`                  |
| Tour card            | Full card tappable| `<a>` wraps entire card            |
| CTA buttons          | 44px height      | `padding: 12px 32px`               |
| Footer links         | 44px height      | `padding: 10px 0` per link         |

---

## 7. Image Performance by Breakpoint

```html
<!-- Photo grid: different sizes for mobile vs desktop -->
<picture>
  <source srcset="grid-1-sm.jpg" media="(max-width: 480px)">
  <source srcset="grid-1-md.jpg" media="(max-width: 1024px)">
  <img src="grid-1-lg.jpg" alt="..." width="612" height="459">
</picture>
```

Image size targets:
- Mobile grid cell: ~400×300px (saves bandwidth)
- Desktop grid cell: ~600×450px
- Pricing hero mobile: ~800×400px
- Pricing hero desktop: ~1200×480px

---

## 8. Print Media Query

The Terms & Conditions page should print well, as users may print T&C documents.

```css
@media print {
  .navbar,
  .footer { display: none; }

  .terms {
    font-size: 11pt;
    line-height: 1.4;
    color: #000;
  }

  .terms__title { font-size: 18pt; }
  .terms__section-heading { font-size: 10pt; }
}
```

---

## 9. Viewport Meta Tag

Required in all HTML files:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

---

## 10. Common Responsive Pitfalls to Avoid

| Pitfall                                | Solution                                     |
|----------------------------------------|----------------------------------------------|
| Photo grid crushing to unrecognizable  | Maintain 2×2 even on 320px — just smaller    |
| Long destination strip overflowing     | Allow wrap, reduce font-size before wrapping |
| Tour info bar dates wrapping badly     | Stack vertically on mobile, not mid-word     |
| Itinerary text unreadably dense mobile | Collapse days on mobile, expand on tap       |
| Pricing table bleeding off-screen      | Allow table to scroll horizontally as fallback |
| Hero title too large for viewport      | `clamp()` prevents this                      |
| CTA bar text too small to tap          | 44px minimum touch target always             |
