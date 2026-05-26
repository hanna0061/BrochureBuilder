# Country & Tour System
## Pax Via Tours — Dynamic Multi-Tour Architecture

---

## 1. System Overview

Pax Via Tours runs multiple pilgrimage tours each year, each targeting different
destinations. The brochure analyzed is one tour: **Poland, Czech & Medjugorje**.
Future tours may include Italy/Rome, Holy Land, Fatima, Ireland, Lourdes, and more.

The website is built around a **single HTML shell** (`tour.html`) that renders
any tour by reading its JSON data file. The shell is identical for every tour.
The tour's data file provides everything tour-specific.

**Core principle:**
```
One HTML shell + One CSS system + One JS renderer + N JSON files = N tour pages
```

---

## 2. Tour Identification & URL Strategy

### URL Pattern

```
/tour.html?tour=poland-czech-medjugorje
/tour.html?tour=rome-italy
/tour.html?tour=holy-land
/tour.html?tour=fatima-portugal
/tour.html?tour=ireland-scotland
```

### Tour ID Rules

- All lowercase
- Hyphen-separated
- Derived from destination names
- No special characters
- Must exactly match the JSON filename

### URL Reading (tour-loader.js)

```javascript
const params = new URLSearchParams(window.location.search);
const tourId = params.get('tour');

if (!tourId) {
  window.location.replace('/index.html');
  return;
}

fetch(`/data/tours/${tourId}.json`)
  .then(res => {
    if (!res.ok) throw new Error(`Tour not found: ${tourId}`);
    return res.json();
  })
  .then(data => renderTour(data))
  .catch(err => renderError(err));
```

---

## 3. JSON Schema — Full Tour Data Structure

This is the canonical schema. Every tour JSON file must follow this structure.
Optional fields are marked `// optional`.

```json
{
  "id": "poland-czech-medjugorje",
  "slug": "poland-czech-medjugorje",
  "title": "Poland, Czeck,\n& Medjugorje",
  "titleShort": "Poland, Czech & Medjugorje",
  "leader": "Join Father Tito Cartagenas on a Pilgrimage to",
  "tourCode": "SFO-1012/12D",

  "dates": {
    "start": "2026-10-12",
    "end": "2026-10-23",
    "month": "October",
    "range": "12–23, 2026",
    "display": "October 12–23, 2026"
  },

  "duration": {
    "days": 12,
    "nights": 10,
    "display": "12 Days / 10 Nights"
  },

  "departure": {
    "city": "San Francisco",
    "airport": "SFO",
    "display": "From San Francisco"
  },

  "price": {
    "base": 4699,
    "currency": "USD",
    "basis": "per person, double occupancy",
    "note": "*Discount cash/check price",
    "display": "$4,699.00*"
  },

  "options": [
    {
      "label": "Single Room Supplement",
      "note": "*Subject to availability",
      "addAmount": 950,
      "display": "add $950"
    },
    {
      "label": "Travel Insurance",
      "note": "Available only for travelers with primary residence in USA or Canada",
      "linkLabel": "visit www.paxvia.com/travel-protection",
      "linkUrl": "https://www.paxvia.com/travel-protection"
    }
  ],

  "payments": [
    {
      "label": "First Payment",
      "amount": 500,
      "due": "Now",
      "display": "$500.00",
      "dueDisplay": "Due: Now"
    },
    {
      "label": "Second Payment",
      "amount": 1249,
      "due": "2026-05-15",
      "display": "$1,249.00",
      "dueDisplay": "Due: May 15, 2026"
    },
    {
      "label": "Third Payment",
      "amount": 1000,
      "due": "2026-07-14",
      "display": "$1,000.00",
      "dueDisplay": "Due: July 14, 2026"
    },
    {
      "label": "Final Payment",
      "amount": null,
      "due": "2026-08-28",
      "display": "Remaining",
      "dueDisplay": "Due: Aug 28, 2026"
    }
  ],

  "stops": [
    "Warsaw",
    "Czestochowa",
    "Krakow",
    "Prague",
    "Medjugorje"
  ],

  "photos": {
    "grid": [
      {
        "src": "assets/images/tours/poland-czech-medjugorje/grid-1.jpg",
        "alt": "Prague — Charles Bridge over the Vltava River"
      },
      {
        "src": "assets/images/tours/poland-czech-medjugorje/grid-2.jpg",
        "alt": "Warsaw — Royal Castle at Old Town Square"
      },
      {
        "src": "assets/images/tours/poland-czech-medjugorje/grid-3.jpg",
        "alt": "Medjugorje — Our Lady's statue and St. James Church"
      },
      {
        "src": "assets/images/tours/poland-czech-medjugorje/grid-4.jpg",
        "alt": "Krakow — St. Mary's Basilica at golden hour"
      }
    ],
    "pricingHero": {
      "src": "assets/images/tours/poland-czech-medjugorje/pricing-hero.jpg",
      "alt": "Prague Castle illuminated at dusk"
    },
    "thumbnail": {
      "src": "assets/images/tours/poland-czech-medjugorje/grid-1.jpg",
      "alt": "Poland, Czech & Medjugorje Pilgrimage"
    }
  },

  "inclusions": [
    "Roundtrip airfare from San Francisco (SFO)",
    "Excursions per itinerary",
    "10-Nights accommodation",
    "Meals per itinerary",
    "English-Speaking tour guides",
    "Entrance Fees as per itinerary",
    "Spiritual director",
    "Whisper Headsets",
    "Pilgrims' Backpack"
  ],

  "itinerary": [
    {
      "day": 1,
      "label": "Day 1",
      "heading": "Departure: Depart USA",
      "body": "Our spiritual pilgrimage begins as we board our transatlantic flight to Warsaw. Meals and refreshments will be served aloft.",
      "overnight": null,
      "meals": null
    },
    {
      "day": 2,
      "label": "Day 2",
      "heading": "Arrive Warsaw",
      "body": "After arrival in Warsaw, we are met by our representative and transferred to our hotel. Delighting the \"new\" Warsaw, which has been lovingly restored after the devastation of World War II.",
      "overnight": "Warsaw",
      "meals": "Dinner"
    },
    {
      "day": 3,
      "label": "Day 3",
      "heading": "Warsaw: St. Stanislaw Kostka Church, Old Town Square, Royal Castle",
      "body": "We begin with morning mass at St. Stanislaw Kostka Church, where martyred Solidarity priest Father Popieluszko worked and is buried. Visit the bustling Old Town Square, where horse-drawn carriages carry visitors past beautifully rebuilt Baroque houses and Renaissance-style storefronts. Traditional Polish cafes and shops surround the square, which has been restored to its 13th-century charm. Stroll the streets of this historic area, which is mostly closed to traffic, and explore its beautiful churches and castle. See the birthplace of Madame Curie, Chopin's monument and the Royal Castle (exterior view) which was the residence of Polish Kings.",
      "overnight": "Warsaw",
      "meals": "Breakfast, Dinner"
    },
    {
      "day": 4,
      "label": "Day 4",
      "heading": "Warsaw / Krakow: Czestochowa, Jasna Gora Monastery, Black Madonna",
      "body": "Depart Warsaw and drive to Czestochowa, a city which has been for the last 600 years the principal center of the Catholic religion in Poland and is a shrine for pilgrims. Visit Jasna Gora Monastery with religious, historic and artistic value, and participate in the unveiling of the Black Madonna. Our guide will show us the Gothic Chapel of Our Lady in which hangs the famous Black Madonna icon on a magnificent silver and ebony altar. Tour the treasury and celebrate mass at the Shrine. After Lunch proceed to Auschwitz for a guided tour of the infamous death camp where millions were killed during World War II. Continue to Krakow, our home for the next three nights.",
      "overnight": "Krakow",
      "meals": "Breakfast, Dinner"
    },
    {
      "day": 5,
      "label": "Day 5",
      "heading": "Krakow: Wawel Hill, Church of St. Stanislaw, Kanonicza Street, St. Faustina Shrine",
      "body": "Following breakfast, proceed to Wawel Hill and celebrate mass at the Church of St. Stanislaw, Poland's second most important pilgrimage shrine. Visit Krakow's cathedral which serves as the nation's spiritual capital and has witnessed most of the royal coronations and funerals of the last millennium. See the Cathedral's Treasury and continue to Krakow's Old Town to see Kanonicza Street where Pope John Paul II resided while living in Krakow. Visit the courtyard of the Collegium Maius; see the ancient Market Square and Cloth Hall. This afternoon stops at Lagwieniki to visit St. Faustina Shrine before returning to Krakow.",
      "overnight": "Krakow",
      "meals": "Breakfast, Dinner"
    },
    {
      "day": 6,
      "label": "Day 6",
      "heading": "Krakow: Wieliczka Salt Mines, Wadowice, Kalwaria Zebrzydowska",
      "body": "This morning we drive to Wieliczka to see the oldest salt mine in Europe, a world-class tourist attraction. It is a unique place where many generations of Polish miners have created a world of underground salt lakes with a rich interior of decorated chapels including the famous Blessed Kings Chapel, plus other galleries and workings made of salt. Wieliczka salt mine is listed by UNESCO as a World Cultural Heritage Site. Then proceed to Wadowice, birthplace of Karol Wojtla, the late Pope John Paul II. His museum is in his family house. Continue to Kalwaria Zebrzydowska, where in the 17th century the Palatine of Krakow founded a Franciscan Monastery.",
      "overnight": "Krakow",
      "meals": "Breakfast, Dinner"
    },
    {
      "day": 7,
      "label": "Day 7",
      "heading": "Krakow / Prague: Velehrad, Prague",
      "body": "Depart this morning for the Czech capital of Prague. En route stop at Velehrad to visit the Shrine in memory of the two missionaries from Byzantium, \"Cyril and Methodius\", who brought Christianity to the Czech lands. In 1985 His Holiness Pope John Paul II conferred the \"Golden Rose\" on Velehrad, a Papal distinction conveyed to only three other venerable places of pilgrimage; Lourdes, Guadalupe and Czestochowa. Continue to the \"Golden City\" of Prague, one of Europe's most attractive capitals.",
      "overnight": "Prague",
      "meals": "Breakfast, Dinner"
    },
    {
      "day": 8,
      "label": "Days 8",
      "heading": "Prague: Prague Castle, St. Vitus Cathedral, the Church of Our Lady of Victory",
      "body": "Spanning the River Vltava, Prague ranks as one of the most beautifully preserved cities in Europe. The town is famous for its Gothic and Baroque architecture. Wonder at the graceful enormity of Prague Castle and St. Vitus Cathedral, the Church of Our Lady of Victory and the statue of the Infant Jesus of Prague. After mass, cross the historic Charles Bridge, built in 1400, and admire its Baroque statuary. Continue to the Loreto Shrine, one of the most important places of pilgrimage in Eastern Europe.",
      "overnight": "Prague",
      "meals": "Breakfast, Dinner"
    },
    {
      "day": 9,
      "label": "Days 9",
      "heading": "Depart Prague: Flights to Medjugorje",
      "body": "Today, you will depart early in the morning for your flights to Medjugorje. Upon arrival, you'll be greeted by our guide and/or driver who will then take you to a scenic transfer to the serene town of Medjugorje. Upon Arrival, check in to your hotel, where you can unwind and refresh. As evening falls, savor a delicious dinner featuring local cuisine, followed by a restful overnight stay in the peaceful ambiance of Medjugorje.",
      "overnight": "Medjugorje",
      "meals": "Breakfast, Dinner"
    },
    {
      "day": 10,
      "label": "Day 10",
      "heading": "Medjugorje: St. James Church, Apparition Hill",
      "body": "Welcome to Medjugorje, a place known for its simplicity, peace, and powerful spiritual renewal. During your stay, a local guide will accompany the group as we enter into prayer and the sacramental life of this holy village. This morning, we will attend Holy Mass at St. James Church (English-speaking at 10:00 AM), with the special blessing of religious articles after Mass. Later, pilgrims will have the opportunity to climb Apparition Hill, where Our Lady first appeared to the visionaries, and spend time in quiet prayer and reflection.",
      "overnight": "Medjugorje",
      "meals": "Breakfast, Dinner"
    },
    {
      "day": 11,
      "label": "Day 11",
      "heading": "Medjugorje: Mt. Krizevac, Cenacolo",
      "body": "Today we continue our pilgrimage with deeper moments of conversion and healing. We will have the opportunity to climb Mt. Krizevac (Cross Mountain) and pray the Stations of the Cross, honoring Christ's Passion at the summit cross. We will also visit the inspiring Community of Cenacolo, where pilgrims hear powerful testimonies of young people whose lives were transformed through faith and prayer.",
      "overnight": "Medjugorje",
      "meals": "Breakfast, Dinner"
    },
    {
      "day": 12,
      "label": "Day 12",
      "heading": "Return Flights Home",
      "body": "After an early breakfast and heartfelt farewells, we transfer to Split airport for our return flight to the USA.",
      "overnight": null,
      "meals": "Breakfast"
    }
  ],

  "footnotes": [
    "*Time Permitting"
  ],

  "meta": {
    "pageTitle": "Poland, Czech & Medjugorje Pilgrimage | Pax Via Tours",
    "description": "Join Father Tito Cartagenas on a 12-day Catholic pilgrimage to Poland, Czech Republic, and Medjugorje. October 12–23, 2026 from San Francisco. From $4,699.",
    "keywords": "pilgrimage Poland Czech Medjugorje Father Tito Pax Via Tours"
  }
}
```

---

## 4. Company JSON (Shared Across Tours)

```json
{
  "name": "Pax Via Tours & Travel",
  "shortName": "Pax Via",
  "tagline": "Bringing Pilgrims Closer to Christ",
  "address": {
    "street": "9939 Hibert Street Suite 106",
    "city": "San Diego",
    "state": "CA",
    "zip": "92131",
    "full": "9939 Hibert Street Suite 106, San Diego, CA 92131"
  },
  "phone": "(844) 212-8162",
  "phoneTel": "8442128162",
  "email": "info@paxvia.com",
  "website": "https://www.paxvia.com",
  "cst": "CST-2161770-50",
  "whyUs": [
    "PAX VIA Tours & Travel is a family-run Catholic pilgrimage company with over 20 years of experience. We have guided thousands of pilgrims on life-changing journeys that deepen faith and transform lives. Our tours deliver the highest quality in travel and lodging, paired with a truly personal and spiritual experience. From the moment you arrive, pilgrims are treated like family — welcomed with warm hospitality, introduced to inspiring stories of faith, and guided with unmatched care and access to the world's most sacred Christian destinations.",
    "With Pax Via, no time is wasted. From day one, pilgrims feel confident, connected, and spiritually focused. Every detail is thoughtfully planned so you can fully immerse yourself in the grace of the pilgrimage. For us, this is not simply business, it is a passion and mission to bring pilgrims closer to Christ through sacred places around the world, offering an experience that is deeply enriching in both body and soul, without ever compromising tour excellence."
  ]
}
```

---

## 5. Tours Manifest (Homepage Data)

```json
[
  {
    "id": "poland-czech-medjugorje",
    "titleShort": "Poland, Czech & Medjugorje",
    "leader": "Fr. Tito Cartagenas",
    "dates": { "display": "October 12–23, 2026" },
    "duration": { "display": "12 Days" },
    "departure": { "display": "San Francisco" },
    "price": { "display": "$4,699" },
    "thumbnail": "assets/images/tours/poland-czech-medjugorje/grid-1.jpg",
    "thumbnailAlt": "Prague Charles Bridge"
  }
]
```

When a new tour is added, append its stub here. The homepage reads only this file.

---

## 6. Tour Switching / Navigation Flow

```
Homepage (index.html)
  └── Reads tours-manifest.json
  └── Renders tour cards
  └── User clicks a card
         │
         ▼
tour.html?tour=poland-czech-medjugorje
  └── tour-loader.js reads ?tour= param
  └── Fetches /data/tours/poland-czech-medjugorje.json
  └── Renders all sections
  └── Sets document.title, meta description
```

A "View All Tours" link in the navbar always returns to `index.html`.

---

## 7. Error Handling & Fallbacks

| Scenario                        | Behavior                                          |
|---------------------------------|---------------------------------------------------|
| Missing `?tour=` param          | Redirect to `index.html`                          |
| JSON file not found (404)       | Show error section with contact info from company.json |
| JSON parse error                | Show error section                                |
| Image 404                       | `onerror` → `shared/placeholder.jpg`              |
| Missing optional JSON field     | Component skips rendering that element            |
| Empty `itinerary` array         | Itinerary section shows "Itinerary coming soon"   |

---

## 8. Adding a Future Tour — Step-by-Step

```
1. Copy the JSON schema above
2. Fill in all required fields for the new tour
3. Save as: /data/tours/[new-tour-id].json
4. Collect 5 images:
      grid-1.jpg, grid-2.jpg, grid-3.jpg, grid-4.jpg  (2×2 cover photos)
      pricing-hero.jpg  (full-width pricing section photo)
5. Resize and compress images (see PROJECT_ARCHITECTURE.md)
6. Place images in: /assets/images/tours/[new-tour-id]/
7. Add the tour stub to: /data/tours-manifest.json
8. Done — the new tour is live at /tour.html?tour=[new-tour-id]
```

---

## 9. SEO Considerations

Each tour page is a unique URL and can be indexed separately.

- `document.title` is set dynamically from `tourData.meta.pageTitle`
- `<meta name="description">` is set from `tourData.meta.description`
- The JSON fetch uses relative URLs — works in both file:// and server environments
- Open Graph tags can optionally be pre-populated server-side if ever needed
- `terms.html` is a static, always-indexed page with no dynamic content

---

## 10. Scalability Rules

1. **Never hardcode tour content in HTML** — every tour-specific value comes from JSON.
2. **Never add a new JS render function per tour** — the renderer is generic.
3. **The JSON schema is the contract** — any new field requires a schema version increment and a backward-compatible JS fallback.
4. **Image naming is convention, not config** — don't add image URLs to manifest; keep them inferred from `{tourId}/{role}.jpg`.
5. **All tours share the same CSS** — do not create per-tour stylesheets.
6. **Company info is never hardcoded** — always sourced from `company.json`.
