# Component Map
## Pax Via Tours — Pilgrimage Website

> Every component below was identified directly from the 4 brochure pages.
> No component is invented — each maps to a visible brochure element.

---

## Component Inventory Overview

| #  | Component              | Brochure Source         | Reuse Level |
|----|------------------------|-------------------------|-------------|
| 1  | Navbar                 | (site-wide wrapper)     | All pages   |
| 2  | Hero Text Zone         | Page 1 — top block      | tour.html   |
| 3  | Photo Grid 2×2         | Page 1 — center grid    | tour.html   |
| 4  | Destination Strip      | Page 1 — blue banner    | tour.html   |
| 5  | Tour Info Bar          | Page 1 — bottom bar     | tour.html   |
| 6  | Itinerary Section      | Page 2 — full page      | tour.html   |
| 7  | Itinerary Day Entry    | Page 2 — each day row   | tour.html   |
| 8  | Pricing Hero Image     | Page 3 — top photo      | tour.html   |
| 9  | Pricing Panel          | Page 3 — price + options| tour.html   |
| 10 | Payment Table          | Page 3 — schedule table | tour.html   |
| 11 | Inclusions List        | Page 3 — bullet list    | tour.html   |
| 12 | Why Travel With Us     | Page 3 — bottom section | tour.html   |
| 13 | Terms & Conditions     | Page 4 — full page      | terms.html  |
| 14 | Tour Card              | (homepage listing)      | index.html  |
| 15 | Footer                 | (site-wide wrapper)     | All pages   |

---

## Component 1 — Navbar

### Purpose
Top navigation bar. Provides site identity (logo + brand name), primary navigation
links, and a "Book Now" CTA. Becomes sticky after user scrolls.

### Structure

```html
<header class="navbar" id="navbar">
  <div class="container">
    <div class="navbar__inner">

      <a class="navbar__brand" href="/index.html">
        <img class="navbar__logo" src="assets/images/logo/paxvia-badge.png"
             alt="Pax Via Tours & Travel" width="48" height="48">
        <span class="navbar__brand-name">Pax Via Tours</span>
      </a>

      <nav class="navbar__nav" aria-label="Main navigation">
        <ul class="navbar__links">
          <li><a href="/index.html">All Tours</a></li>
          <li><a href="./terms.html">Terms</a></li>
          <li><a href="mailto:info@paxvia.com">Contact</a></li>
        </ul>
      </nav>

      <a class="navbar__cta" href="#book">Book Now</a>

      <button class="navbar__hamburger" aria-label="Open menu"
              aria-expanded="false" aria-controls="navbar__menu">
        <span></span><span></span><span></span>
      </button>

    </div>
  </div>
</header>
```

### Variants
- **Default:** transparent or light background, dark text
- **Sticky (`.is-sticky`):** navy background, white text
- **Mobile open (`.is-open`):** full-screen nav overlay

### Responsive Behavior
- Desktop: horizontal nav links + CTA visible
- Mobile (< 768px): links hidden, hamburger shows, CTA hidden
- Sticky triggers at `scrollY > 60px`

### Dependencies
- `navbar.css`, `nav.js`
- Logo image: `assets/images/logo/paxvia-badge.png`

---

## Component 2 — Hero Text Zone

### Purpose
Recreates the top block of the brochure cover: the small leader text + the large
multi-line destination title. This is the first thing a user sees on the tour page.

### Structure

```html
<section class="hero" aria-label="Tour overview">
  <div class="hero__text-zone">
    <p class="hero__leader" data-field="leader">
      Join Father Tito Cartagenas on a Pilgrimage to
    </p>
    <h1 class="hero__title" data-field="title">
      Poland, Czeck,<br>& Medjugorje
    </h1>
  </div>
  <!-- Destination Strip + Photo Grid + Tour Info Bar go here -->
</section>
```

### Visual Specs

| Property          | Value                                           |
|-------------------|-------------------------------------------------|
| Background        | White                                           |
| Leader text       | EB Garamond italic, 400, --text-sm, gray        |
| Title font        | EB Garamond, 600, --text-display, --color-text-heading |
| Title alignment   | Centered                                        |
| Title line breaks | Natural — allow wrapping at 2–3 lines           |
| Padding top       | var(--space-8)                                  |
| Padding bottom    | 0 (destination strip attaches directly below)  |

### Dynamic Content
`data-field="leader"` → `tourData.leader` — e.g., `"Join Father Tito Cartagenas on a Pilgrimage to"`
`data-field="title"` → `tourData.title` — e.g., `"Poland, Czeck,\n& Medjugorje"`

### Dependencies
- `hero.css`

---

## Component 3 — Photo Grid 2×2

### Purpose
The defining visual element of the brochure cover. A 2×2 grid of destination
photos, separated by thin white gaps, showing the four key tour locations.

### Structure

```html
<div class="photo-grid" data-field="photos">
  <div class="photo-grid__cell">
    <img src="assets/images/tours/[id]/grid-1.jpg"
         alt="Prague — Charles Bridge"
         loading="eager" width="612" height="459">
  </div>
  <div class="photo-grid__cell">
    <img src="assets/images/tours/[id]/grid-2.jpg"
         alt="Warsaw — Old Town Square"
         loading="eager" width="612" height="459">
  </div>
  <div class="photo-grid__cell">
    <img src="assets/images/tours/[id]/grid-3.jpg"
         alt="Medjugorje — Our Lady statue"
         loading="lazy" width="612" height="459">
  </div>
  <div class="photo-grid__cell">
    <img src="assets/images/tours/[id]/grid-4.jpg"
         alt="Krakow — St. Mary's Basilica"
         loading="lazy" width="612" height="459">
  </div>
</div>
```

### Visual Specs

| Property         | Value                                        |
|------------------|----------------------------------------------|
| Grid             | 2 columns × 2 rows, `1fr 1fr`                |
| Gap              | 5px (white — critical to brochure identity)  |
| Background       | `var(--color-white)` (shows as gap)          |
| Cell aspect      | 4:3 (`aspect-ratio: 4 / 3`)                  |
| Image fit        | `object-fit: cover`                          |
| Hover effect     | `img { transform: scale(1.04) }`             |
| Border radius    | 0 — sharp corners throughout                 |
| Max width        | Contained within page (not full-bleed)       |

### Responsive Behavior
- Desktop: 2×2 equal grid as per brochure
- Tablet (≤ 768px): 2×2 maintained (key identity element)
- Mobile (≤ 480px): 1×4 stack OR 2×2 at smaller size — see RESPONSIVE_STRATEGY.md

### Dependencies
- `photo-grid.css`
- 4 tour-specific images in `assets/images/tours/{tourId}/`

---

## Component 4 — Destination Strip

### Purpose
The narrow navy banner below the hero title that lists all cities/stops in the tour.
Exact replica of the brochure's "Warsaw - Czestochowa - Krakow - Prague - Medjugorje" bar.

### Structure

```html
<div class="destination-strip" role="banner" aria-label="Tour destinations">
  <div class="destination-strip__inner" data-field="stops">
    <!-- JS renders: -->
    <span class="destination-strip__stop">Warsaw</span>
    <span class="destination-strip__sep" aria-hidden="true"> · </span>
    <span class="destination-strip__stop">Czestochowa</span>
    <span class="destination-strip__sep" aria-hidden="true"> · </span>
    <!-- ... etc. -->
  </div>
</div>
```

### Visual Specs

| Property         | Value                                              |
|------------------|----------------------------------------------------|
| Background       | `var(--color-navy)`                                |
| Text color       | `var(--color-white)`                               |
| Font             | Inter 500, uppercase                               |
| Letter spacing   | `var(--ls-banner)` = 0.06em                        |
| Font size        | `var(--text-sm)` = 14px                            |
| Height           | 44–48px, content-centered vertically              |
| Width            | Full bleed (stretches edge-to-edge)                |
| Separator        | " · " styled as `--color-badge-gold` (subtle gold) |

### Variants
- `destination-strip--compact` — used in sticky nav on scroll

### Dependencies
- `destination-strip.css`, `tour-loader.js`

---

## Component 5 — Tour Info Bar

### Purpose
The bottom section of the brochure cover. Displays the tour dates, the company badge
logo, the price, and the CTA "Book Now." Full-width, dark navy background.

### Structure

```html
<div class="tour-info-bar" data-field="tourInfo">
  <div class="tour-info-bar__main">

    <div class="tour-info-bar__dates">
      <span class="tour-info-bar__month" data-field="month">October</span>
      <span class="tour-info-bar__range" data-field="dateRange">12–23, 2026</span>
    </div>

    <div class="tour-info-bar__badge">
      <img src="assets/images/logo/paxvia-badge.png"
           alt="Pax Via Tours & Travel" width="72" height="72">
    </div>

    <div class="tour-info-bar__price-block">
      <span class="tour-info-bar__price" data-field="price">$4699</span>
      <span class="tour-info-bar__from" data-field="departure">From San Francisco</span>
    </div>

  </div>
  <div class="tour-info-bar__cta">
    <a href="#book" class="btn btn--cta-bar" data-field="bookUrl">
      Book Now at PaxVia.com
    </a>
  </div>
</div>
```

### Visual Specs

| Property               | Value                                         |
|------------------------|-----------------------------------------------|
| Background             | `var(--color-navy)`                           |
| Main row layout        | CSS flex, space-between, align-center         |
| Dates font             | EB Garamond italic 400, white                 |
| Month size             | `var(--text-lg)`                              |
| Date range size        | `var(--text-md)`                              |
| Badge size             | 72px × 72px                                   |
| Price size             | `var(--text-2xl)`, EB Garamond 600, white     |
| "From" text size       | `var(--text-sm)`, EB Garamond 400, white      |
| CTA strip background   | Same navy (no separator)                      |
| CTA text               | Inter 700, uppercase, white, `var(--ls-label)`|
| CTA size               | `var(--text-md)`                              |
| Padding (main row)     | 20px vertical, container-pad horizontal       |
| Padding (CTA strip)    | 12px vertical                                 |

### Dynamic Content
- `data-field="month"` → `tourData.dates.month`
- `data-field="dateRange"` → `tourData.dates.range`
- `data-field="price"` → formatted `tourData.price.base`
- `data-field="departure"` → `tourData.departure.city`
- `data-field="bookUrl"` → `tourData.bookingUrl`

### Dependencies
- `tour-info-bar.css`, `tour-loader.js`

---

## Component 6 — Itinerary Section

### Purpose
Full recreation of brochure Page 2. Contains the section header and the two-column
day-entry grid. This is the core information architecture of the tour page.

### Structure

```html
<section class="itinerary" aria-labelledby="itinerary-heading">

  <div class="container">
    <h2 class="itinerary__heading" id="itinerary-heading">
      Day by Day Itinerary
    </h2>

    <div class="itinerary__grid" data-field="itinerary">
      <!-- Component 7 (Day Entry) repeated per day -->
    </div>

    <div class="itinerary__meta">
      <div class="itinerary__tour-code" data-field="tourCode">
        Tour Number: SFO-1012/12D
      </div>
      <div class="itinerary__contact" data-field="companyContact">
        Pax Via Tours &amp; Travel — info@paxvia.com — Tel. 844-212-8162
      </div>
    </div>

  </div>
</section>
```

### Visual Specs

| Property             | Value                                         |
|----------------------|-----------------------------------------------|
| Background           | `var(--color-white)`                          |
| Section heading font | EB Garamond 600, `var(--text-2xl)`            |
| Section heading align| Left (as in brochure)                         |
| Grid columns         | 2 equal columns (desktop), 1 (mobile)         |
| Grid gap             | `var(--space-6)` column, `var(--space-2)` row |
| Meta block           | `var(--text-sm)`, Inter 400, muted color      |
| Section padding      | `var(--section-py)` top and bottom            |

### Dependencies
- `itinerary.css`, `itinerary.js`, `tour-loader.js`

---

## Component 7 — Itinerary Day Entry

### Purpose
A single day's entry in the itinerary. Renders the day label, location name(s),
description text, and overnight note — exactly matching the brochure's format.

### Structure

```html
<article class="itinerary__day" data-day="1">
  <div class="itinerary__day-header">
    <span class="itinerary__day-label">Day 1:</span>
    <span class="itinerary__day-location">Departure: Depart USA</span>
  </div>
  <p class="itinerary__day-body">
    Our spiritual pilgrimage begins as we board our transatlantic
    flight to Warsaw. Meals and refreshments will be served aloft.
  </p>
  <p class="itinerary__day-overnight">
    <!-- Only rendered when overnight exists in data -->
    <span class="itinerary__overnight-label">Overnight:</span>
    Warsaw (Dinner*)
  </p>
</article>
```

### Visual Specs

| Property              | Value                                         |
|-----------------------|-----------------------------------------------|
| Day label font        | EB Garamond 700, `var(--text-base)`           |
| Day location font     | EB Garamond 700, `var(--text-base)`           |
| Body font             | EB Garamond 400, `var(--text-base)`, --lh-body|
| Overnight font        | EB Garamond 400 italic, `var(--text-sm)`      |
| "Overnight:" label    | EB Garamond 700, same size                    |
| Bottom border         | 1px `var(--color-divider)` (between days)     |
| Padding per entry     | `var(--space-4)` bottom                       |

### Variants
- `itinerary__day--expandable` — mobile only, adds chevron icon

### Mobile Behavior
On mobile, each day entry is click-expandable. Body text collapses by default.
Day header remains visible. Tapping toggles `.is-expanded`.

### Dependencies
- `itinerary.css`, `itinerary.js`

---

## Component 8 — Pricing Hero Image

### Purpose
The dramatic full-width photograph that opens Page 3 of the brochure — Prague
Castle at dusk (golden-blue sky). On the website, this functions as a visual
chapter-break between the itinerary and pricing sections.

### Structure

```html
<div class="pricing-hero" data-field="pricingHero"
     role="img" aria-label="Prague Castle at dusk — a key pilgrimage destination">
  <img class="pricing-hero__img"
       src="assets/images/tours/[id]/pricing-hero.jpg"
       alt="Prague Castle at dusk"
       loading="lazy"
       width="1100" height="480">
  <div class="pricing-hero__overlay" aria-hidden="true"></div>
</div>
```

### Visual Specs

| Property         | Value                                              |
|------------------|----------------------------------------------------|
| Width            | Full container width                               |
| Height           | `clamp(300px, 40vw, 480px)`                        |
| Image fit        | `object-fit: cover`, `object-position: center 60%`|
| Overlay          | `rgba(26, 49, 96, 0.55)` linear gradient           |
| Border radius    | 0                                                  |

### Dependencies
- `pricing-hero.css`, `tour-loader.js`

---

## Component 9 — Pricing Panel

### Purpose
The two-column section on Page 3: left column has base price + options + payment
schedule; right column has inclusions list. Sits below the "PRICING" header bar.

### Structure

```html
<section class="pricing" aria-labelledby="pricing-heading">
  <div class="pricing__header-bar">
    <h2 class="pricing__heading" id="pricing-heading">PRICING</h2>
  </div>

  <div class="container">
    <div class="pricing__grid">

      <!-- LEFT COLUMN -->
      <div class="pricing__left">
        <div class="pricing__base-block">
          <h3 class="pricing__base-label">Base Price Per Person</h3>
          <p class="pricing__base-price" data-field="price">$4699.00*</p>
          <p class="pricing__base-note">Double occupancy with base airfare</p>
          <p class="pricing__discount-note">*Discount cash/check price</p>
        </div>

        <div class="pricing__options-block">
          <h4 class="pricing__options-label">Options</h4>
          <ul class="pricing__options-list" data-field="options">
            <!-- JS-generated from tourData.options -->
          </ul>
        </div>

        <!-- Component 10 — Payment Table inserted here -->
        <table class="payment-table" data-field="payments">...</table>
      </div>

      <!-- RIGHT COLUMN — Component 11 -->
      <div class="pricing__right">
        <h3 class="inclusions__title">Base Price Includes:</h3>
        <ul class="inclusions__list" data-field="inclusions">...</ul>
      </div>

    </div>
  </div>
</section>
```

### Visual Specs

| Property          | Value                                        |
|-------------------|----------------------------------------------|
| Background        | `var(--color-white)`                         |
| Header bar bg     | `var(--color-navy)`, full bleed              |
| "PRICING" text    | Inter 700, uppercase, white, `--ls-label`    |
| "PRICING" size    | `var(--text-md)`                             |
| Grid              | 2 equal columns (desktop), 1 col (mobile)    |
| Base price size   | `var(--text-2xl)`, EB Garamond 700           |
| Label size        | Inter 700, uppercase, `var(--text-sm)`       |
| Note text         | Inter 400, `var(--text-sm)`, muted           |

### Dependencies
- `pricing-table.css`, `tour-loader.js`

---

## Component 10 — Payment Table

### Purpose
The structured table from Page 3 showing the payment schedule: first payment,
second payment, third payment, final payment — with amounts and due dates.

### Structure

```html
<table class="payment-table" aria-label="Payment schedule">
  <thead class="u-visually-hidden">
    <tr>
      <th>Payment</th>
      <th>Amount</th>
      <th>Due Date</th>
    </tr>
  </thead>
  <tbody data-field="payments">
    <!-- JS renders from tourData.payments[] -->
    <tr class="payment-table__row">
      <td class="payment-table__label">First Payment</td>
      <td class="payment-table__amount">$500.00</td>
      <td class="payment-table__due">Due: Now</td>
    </tr>
    <tr class="payment-table__row payment-table__row--alt">
      <td class="payment-table__label">Second Payment</td>
      <td class="payment-table__amount">$1,249.00</td>
      <td class="payment-table__due">Due: May 15, 2026</td>
    </tr>
    <!-- etc. -->
  </tbody>
</table>
```

### Visual Specs

| Property          | Value                                        |
|-------------------|----------------------------------------------|
| Label column      | Inter 600, uppercase, `var(--text-sm)`       |
| Amount column     | EB Garamond 700, `var(--text-md)`            |
| Due date column   | Inter 400, `var(--text-sm)`, muted           |
| Row padding       | 10px vertical, 4px horizontal                |
| Alt row bg        | `var(--color-row-alt)`                       |
| Border            | 1px `var(--color-divider)` between rows      |
| No outer border   | Table is borderless on outer edges           |

### Dependencies
- `payment-table.css`, `tour-loader.js`

---

## Component 11 — Inclusions List

### Purpose
The right column of the pricing section. Bullet list of everything included in
the base tour price. Directly matches the brochure "Base Price Includes:" list.

### Structure

```html
<div class="inclusions">
  <h3 class="inclusions__title">Base Price Includes:</h3>
  <ul class="inclusions__list" data-field="inclusions">
    <!-- JS renders from tourData.inclusions[] -->
    <li class="inclusions__item">
      <span class="inclusions__bullet" aria-hidden="true">•</span>
      Roundtrip airfare from San Francisco (SFO)
    </li>
    <li class="inclusions__item">
      <span class="inclusions__bullet" aria-hidden="true">•</span>
      Excursions per itinerary
    </li>
    <!-- etc. -->
  </ul>
</div>
```

### Visual Specs

| Property       | Value                                            |
|----------------|--------------------------------------------------|
| Title font     | Inter 700, uppercase, `var(--text-base)`         |
| Item font      | EB Garamond 400, `var(--text-base)`, `--lh-body` |
| Bullet         | "•" character, `var(--color-badge-gold)` colored |
| Item spacing   | `var(--space-3)` between items                   |
| List indent    | `var(--space-5)` padding-left                    |
| No border      | Pure text list, no box decoration                |

### Dependencies
- `inclusions.css`, `tour-loader.js`

---

## Component 12 — Why Travel With Us

### Purpose
Recreates the bottom section of brochure Page 3. Full-width navy background with
centered company description text. Two paragraphs explaining the company mission.

### Structure

```html
<section class="why-us" aria-labelledby="why-us-heading">
  <div class="container">
    <h2 class="why-us__heading" id="why-us-heading">
      Why Travel with Us?
    </h2>
    <div class="why-us__body" data-field="whyUs">
      <p>PAX VIA Tours &amp; Travel is a family-run Catholic pilgrimage
         company with over 20 years of experience...</p>
      <p>With Pax Via, no time is wasted. From day one, pilgrims feel
         confident, connected, and spiritually focused...</p>
    </div>
  </div>
</section>
```

### Visual Specs

| Property       | Value                                            |
|----------------|--------------------------------------------------|
| Background     | `var(--color-navy)` — full bleed                 |
| Heading font   | EB Garamond 600, `var(--text-xl)`, white         |
| Heading align  | Centered                                         |
| Body font      | Inter 400, `var(--text-base)`, white, `--lh-body`|
| Body max-width | 760px, centered                                  |
| Section padding| `var(--section-py)` top and bottom               |

### Dependencies
- `why-us.css`, `tour-loader.js`

---

## Component 13 — Terms & Conditions

### Purpose
Recreates brochure Page 4. A standalone document page with the formal terms
of travel, section-labeled legal text, and contact footer.

### Structure

```html
<main class="terms" aria-labelledby="terms-heading">
  <div class="container">

    <h1 class="terms__title" id="terms-heading">Terms &amp; Conditions</h1>
    <p class="terms__intro">Below are the general terms &amp; conditions...</p>

    <section class="terms__section">
      <h2 class="terms__section-heading">Documents</h2>
      <p class="terms__body">US citizens require a valid passport...</p>
    </section>

    <!-- Repeated for each section -->

    <address class="terms__footer">
      Pax Via Tours &amp; Travel<br>
      9939 Hibert Street Suite 106 San Diego, CA 92131<br>
      Tel: (844) 212-8162 · Email: info@paxvia.com · CST-2161770-50
    </address>

  </div>
</main>
```

### Visual Specs

| Property         | Value                                          |
|------------------|------------------------------------------------|
| Title font       | EB Garamond italic 400, `var(--text-2xl)`      |
| Section heading  | Inter 700, uppercase, `var(--text-base)`       |
| Body text        | Inter 400, `var(--text-xs)` → `var(--text-sm)`|
| Max content width| 900px (readable line length for dense text)    |
| Section spacing  | `var(--space-6)` between sections              |
| Background       | `var(--color-white)`                           |

### Dependencies
- `terms.css` — standalone page styles

---

## Component 14 — Tour Card (Homepage)

### Purpose
Used only on `index.html`. Each card represents one available pilgrimage tour,
linking to that tour's page.

### Structure

```html
<article class="tour-card">
  <a class="tour-card__link" href="/tour.html?tour=poland-czech-medjugorje">
    <div class="tour-card__image-wrap">
      <img class="tour-card__image"
           src="assets/images/tours/poland-czech-medjugorje/grid-1.jpg"
           alt="Poland, Czech & Medjugorje Pilgrimage"
           loading="lazy" width="400" height="300">
    </div>
    <div class="tour-card__body">
      <h2 class="tour-card__title">Poland, Czech &amp; Medjugorje</h2>
      <p class="tour-card__leader">Led by Fr. Tito Cartagenas</p>
      <p class="tour-card__dates">October 12–23, 2026 · 12 Days</p>
      <div class="tour-card__footer">
        <span class="tour-card__price">From $4,699</span>
        <span class="tour-card__from">San Francisco</span>
      </div>
    </div>
  </a>
</article>
```

### Visual Specs

| Property      | Value                                             |
|---------------|---------------------------------------------------|
| Background    | `var(--color-white)`                              |
| Border        | 1px `var(--color-divider)`                        |
| Border radius | `var(--radius-md)` = 8px                          |
| Shadow        | `var(--shadow-sm)` default, `--shadow-md` hover   |
| Image ratio   | 4:3 (`aspect-ratio: 4 / 3`)                       |
| Title font    | EB Garamond 600, `var(--text-lg)`                 |
| Meta font     | Inter 400, `var(--text-sm)`, muted                |
| Price font    | EB Garamond 700, `var(--text-base)`, navy         |
| Hover         | `translateY(-4px)`, shadow increases              |

### Reusability
Rendered by JS from `tours-manifest.json` on homepage. Grid: 1 col mobile →
2 col tablet → 3 col desktop.

### Dependencies
- `tour-card.css`, `main.js`

---

## Component 15 — Footer

### Purpose
Site-wide bottom bar. Contains company name, address, phone, email, CST number,
and copyright.

### Structure

```html
<footer class="footer" role="contentinfo">
  <div class="container">
    <div class="footer__inner">

      <div class="footer__brand">
        <img src="assets/images/logo/paxvia-badge.png"
             alt="Pax Via Tours" width="48" height="48">
        <p class="footer__tagline">Pax Via Tours &amp; Travel</p>
      </div>

      <address class="footer__address">
        9939 Hibert Street Suite 106<br>
        San Diego, CA 92131<br>
        <a href="tel:8442128162">(844) 212-8162</a> ·
        <a href="mailto:info@paxvia.com">info@paxvia.com</a>
      </address>

      <div class="footer__legal">
        <p>CST-2161770-50</p>
        <p>&copy; <span id="year"></span> Pax Via Tours &amp; Travel. All rights reserved.</p>
        <a href="/terms.html">Terms &amp; Conditions</a>
      </div>

    </div>
  </div>
</footer>
```

### Visual Specs

| Property      | Value                                             |
|---------------|---------------------------------------------------|
| Background    | `var(--color-navy)`                               |
| Text          | `var(--color-text-on-dark)` / white               |
| Link color    | White with opacity 0.8, hover: full white         |
| Font          | Inter 400, `var(--text-sm)`                       |
| Layout        | 3 columns flex (desktop), stacked (mobile)        |
| Padding       | `var(--space-10)` vertical                        |

### Dependencies
- `footer.css`

---

## Shared Utility Patterns

### `.u-visually-hidden`
```css
.u-visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```

### `.btn` base class
All CTA buttons extend `.btn`. Variants: `.btn--cta-bar`, `.btn--primary`, `.btn--ghost`.

### `[data-field]` attribute convention
Every DOM element that receives dynamic content from JSON has `data-field="key"`.
The `tour-loader.js` uses `document.querySelectorAll('[data-field]')` to find and
populate all slots from the tour data object.
