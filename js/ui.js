/**
 * ui.js — DOM rendering and population helpers
 * Pax Via Tours & Travel
 *
 * All functions that write tour data into the DOM live here.
 * Each render function targets specific [data-field] elements
 * or known IDs, keeping rendering logic separate from data loading.
 */

import { createElement, formatCurrency } from './utils.js';
import { buildTourUrl } from './router.js';

/**
 * Populate all [data-field] text slots from a flat key→value map.
 * Fields whose values are null/undefined are silently skipped.
 */
export function populateFields(fieldMap) {
  Object.entries(fieldMap).forEach(([field, value]) => {
    if (value === null || value === undefined) return;
    document.querySelectorAll(`[data-field="${field}"]`).forEach(el => {
      el.textContent = value;
    });
  });
}

/**
 * Render the tour intro section: stat bar + overview paragraphs.
 * Targets #tour-intro-stats and #tour-intro-body by ID.
 */
export function renderTourIntro(tour) {
  const statsEl = document.getElementById('tour-intro-stats');
  const bodyEl = document.getElementById('tour-intro-body');

  if (statsEl) {
    const stats = [
      { label: 'Duration',     value: tour.duration.display },
      { label: 'Travel Dates', value: tour.dates.display },
      { label: 'Departure',    value: tour.departure.display },
      { label: 'Price From',   value: formatCurrency(tour.price.base) + '*', sub: 'per person, double occ.' },
    ];
    statsEl.innerHTML = '';
    stats.forEach(({ label, value, sub }) => {
      const item = createElement('div', { class: 'tour-intro__stat', role: 'listitem' });
      item.appendChild(createElement('span', { class: 'tour-intro__stat-label' }, label));
      item.appendChild(createElement('span', { class: 'tour-intro__stat-value' }, value));
      if (sub) item.appendChild(createElement('span', { class: 'tour-intro__stat-sub' }, sub));
      statsEl.appendChild(item);
    });
  }

  if (bodyEl && tour.overview) {
    bodyEl.innerHTML = '';
    tour.overview.forEach(text => {
      bodyEl.appendChild(createElement('p', { class: 'tour-intro__paragraph' }, text));
    });
  }
}

/**
 * Render the destination strip stops.
 * Writes stop spans and separator spans into [data-field="stops"].
 */
export function renderStops(stops) {
  const container = document.querySelector('[data-field="stops"]');
  if (!container || !stops) return;
  container.innerHTML = '';
  stops.forEach((stop, i) => {
    container.appendChild(createElement('span', { class: 'destination-strip__stop' }, stop));
    if (i < stops.length - 1) {
      container.appendChild(createElement('span', { class: 'destination-strip__sep', 'aria-hidden': 'true' }, ' · '));
    }
  });
}

/**
 * Render the 2×2 photo grid.
 * Writes 4 photo cells into [data-field="photos"].
 * Unsplash URLs get a responsive srcset automatically.
 */
export function renderPhotoGrid(photos) {
  const container = document.querySelector('[data-field="photos"]');
  if (!container || !photos || !photos.grid) return;
  container.innerHTML = '';
  photos.grid.slice(0, 4).forEach((photo, i) => {
    const cell = createElement('div', { class: 'photo-grid__cell' });
    const img = createElement('img');

    if (photo.src && photo.src.includes('images.unsplash.com')) {
      const base = photo.src.split('?')[0];
      img.src = `${base}?auto=format&fit=crop&w=800&h=600&q=80`;
      img.srcset = [
        `${base}?auto=format&fit=crop&w=400&h=300&q=80 400w`,
        `${base}?auto=format&fit=crop&w=800&h=600&q=80 800w`,
        `${base}?auto=format&fit=crop&w=1200&h=900&q=80 1200w`,
      ].join(', ');
      img.sizes = '(max-width: 1100px) 50vw, 550px';
    } else {
      img.src = photo.src;
    }

    img.alt = photo.alt;
    img.width = 612;
    img.height = 459;
    img.loading = i < 2 ? 'eager' : 'lazy';
    img.onerror = () => { img.src = 'assets/images/shared/placeholder.jpg'; };
    cell.appendChild(img);
    container.appendChild(cell);
  });
}

/**
 * Render the pricing hero image.
 */
export function renderPricingHero(photos) {
  const container = document.querySelector('[data-field="pricingHero"]');
  if (!container || !photos || !photos.pricingHero) return;
  container.setAttribute('aria-label', photos.pricingHero.alt);
  const img = container.querySelector('[data-field="pricingHeroImg"]');
  if (img) {
    img.src = photos.pricingHero.src;
    img.alt = photos.pricingHero.alt;
    img.onerror = () => { img.src = 'assets/images/shared/placeholder.jpg'; };
  }
}

/**
 * Render the full itinerary grid.
 * Creates one .itinerary__day article per day entry.
 * The midpoint day gets .itinerary__day--col-break for CSS-columns split.
 */
export function renderItinerary(itinerary) {
  const container = document.querySelector('[data-field="itinerary"]');
  if (!container || !itinerary) return;
  container.innerHTML = '';

  const midpoint = Math.ceil(itinerary.length / 2);

  itinerary.forEach((day, index) => {
    const classes = index === midpoint
      ? 'itinerary__day itinerary__day--col-break'
      : 'itinerary__day';

    const article = createElement('article', {
      class: classes,
      'data-day': day.day,
    });

    // Header — click target on mobile (toggle added by initItineraryToggle)
    const header = createElement('div', { class: 'itinerary__day-header' });

    // Meta: zero-padded number + title block
    const meta = createElement('div', { class: 'itinerary__day-meta' });
    meta.appendChild(createElement('span', {
      class: 'itinerary__day-num',
      'aria-hidden': 'true',
    }, String(day.day).padStart(2, '0')));

    const titles = createElement('div', { class: 'itinerary__day-titles' });
    titles.appendChild(createElement('span', { class: 'itinerary__day-label' }, day.label));
    titles.appendChild(createElement('h3', { class: 'itinerary__day-heading' }, day.heading));
    meta.appendChild(titles);
    header.appendChild(meta);
    article.appendChild(header);

    // Expandable content wrapper
    const content = createElement('div', { class: 'itinerary__day-content' });

    if (day.body) {
      content.appendChild(createElement('p', { class: 'itinerary__day-body' }, day.body));
    }

    if (day.overnight) {
      const overnight = createElement('p', { class: 'itinerary__day-overnight' });
      overnight.appendChild(createElement('span', { class: 'itinerary__overnight-label' }, 'Overnight:'));
      overnight.appendChild(document.createTextNode(
        day.meals ? ` ${day.overnight} (${day.meals})` : ` ${day.overnight}`
      ));
      content.appendChild(overnight);
    }

    article.appendChild(content);
    container.appendChild(article);
  });
}

/**
 * Render the pricing options list.
 */
export function renderOptions(options) {
  const container = document.querySelector('[data-field="options"]');
  if (!container || !options) return;
  container.innerHTML = '';
  options.forEach(opt => {
    const li = createElement('li', { class: 'pricing__option-item' }, opt.label);
    if (opt.display) {
      li.appendChild(createElement('span', { class: 'pricing__option-note' }, `(${opt.display})`));
    }
    if (opt.note) {
      li.appendChild(createElement('span', { class: 'pricing__option-note' }, opt.note));
    }
    container.appendChild(li);
  });
}

/**
 * Render the payment schedule table rows.
 */
export function renderPayments(payments) {
  const tbody = document.querySelector('[data-field="payments"]');
  if (!tbody || !payments) return;
  tbody.innerHTML = '';
  payments.forEach((payment, i) => {
    const tr = createElement('tr', {
      class: i % 2 !== 0 ? 'payment-table__row payment-table__row--alt' : 'payment-table__row',
    });
    tr.appendChild(createElement('td', { class: 'payment-table__label' }, payment.label));
    tr.appendChild(createElement('td', { class: 'payment-table__amount' }, payment.display));
    tr.appendChild(createElement('td', { class: 'payment-table__due' }, payment.dueDisplay));
    tbody.appendChild(tr);
  });
}

/**
 * Render the inclusions list.
 */
export function renderInclusions(inclusions) {
  const container = document.querySelector('[data-field="inclusions"]');
  if (!container || !inclusions) return;
  container.innerHTML = '';
  inclusions.forEach(item => {
    const li = createElement('li', { class: 'inclusions__item' });
    li.appendChild(createElement('span', { class: 'inclusions__bullet', 'aria-hidden': 'true' }, '•'));
    li.appendChild(document.createTextNode(item));
    container.appendChild(li);
  });
}

/**
 * Render the "Why Travel With Us" section body paragraphs.
 */
export function renderWhyUs(paragraphs) {
  const container = document.querySelector('[data-field="whyUs"]');
  if (!container || !paragraphs) return;
  container.innerHTML = '';
  paragraphs.forEach(text => {
    container.appendChild(createElement('p', {}, text));
  });
}

/**
 * Render tour cards on the homepage grid.
 */
export function renderTourCards(manifest) {
  const grid = document.getElementById('tours-grid');
  if (!grid || !manifest) return;
  grid.innerHTML = '';
  manifest.forEach(tour => {
    const card = createElement('article', { class: 'tour-card' });
    const link = createElement('a', {
      class: 'tour-card__link',
      href: buildTourUrl(tour.id),
    });

    const imageWrap = createElement('div', { class: 'tour-card__image-wrap' });
    const img = createElement('img');
    img.className = 'tour-card__image';
    img.src = tour.thumbnail;
    img.alt = tour.thumbnailAlt || tour.titleShort;
    img.loading = 'lazy';
    img.width = 400;
    img.height = 300;
    img.onerror = () => { img.src = 'assets/images/shared/placeholder.jpg'; };
    imageWrap.appendChild(img);
    link.appendChild(imageWrap);

    const body = createElement('div', { class: 'tour-card__body' });
    body.appendChild(createElement('h2', { class: 'tour-card__title' }, tour.titleShort));
    if (tour.leader) {
      body.appendChild(createElement('p', { class: 'tour-card__leader' }, `Led by ${tour.leader}`));
    }
    body.appendChild(createElement('p', { class: 'tour-card__dates' },
      `${tour.dates.display} · ${tour.duration.display}`));

    const footer = createElement('div', { class: 'tour-card__footer' });
    footer.appendChild(createElement('span', { class: 'tour-card__price' }, `From ${tour.price.display}`));
    footer.appendChild(createElement('span', { class: 'tour-card__from' }, tour.departure.display));
    body.appendChild(footer);

    link.appendChild(body);
    card.appendChild(link);
    grid.appendChild(card);
  });
}

/**
 * Wire up itinerary expand/collapse on mobile.
 * Called after itinerary is rendered into the DOM.
 * Targets .itinerary__day-content as the expandable region.
 */
export function initItineraryToggle() {
  document.querySelectorAll('.itinerary__day').forEach(day => {
    const header = day.querySelector('.itinerary__day-header');
    const content = day.querySelector('.itinerary__day-content');
    if (!header || !content) return;

    // Assign stable IDs for aria-controls
    const dayNum = day.dataset.day;
    const contentId = `itinerary-day-${dayNum}-content`;
    content.id = contentId;

    // Append chevron indicator
    header.appendChild(createElement('span', { class: 'itinerary__day-chevron', 'aria-hidden': 'true' }));

    // Make header the toggle target
    header.classList.add('itinerary__day-toggle');
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', contentId);

    const toggle = () => {
      const expanded = day.classList.toggle('is-expanded');
      header.setAttribute('aria-expanded', expanded.toString());
    };

    header.addEventListener('click', toggle);
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
}
