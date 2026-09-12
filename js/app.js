/**
 * app.js — Application entry point
 * Pax Via Tours & Travel
 *
 * Bootstraps the application based on which page is loaded.
 * Imports all modules and coordinates the startup flow.
 */

import { getTourId, isTourPage, isHomePage, redirectToHome } from './router.js';
import { fetchTourWithCompany, fetchHomeData } from './country-manager.js';
import {
  populateFields,
  renderTourIntro,
  renderStops,
  renderPhotoGrid,
  renderPricingHero,
  renderItinerary,
  renderOptions,
  renderPayments,
  renderInclusions,
  renderWhyUs,
  renderTourCards,
  initItineraryToggle,
} from './ui.js';
import { setCopyrightYear, show, hide } from './utils.js';
import {
  initScrollAnimations,
  initStickyNavbar,
  initHamburgerMenu,
} from './animations.js';


/** Initialize site-wide features common to every page. */
function initGlobal() {
  setCopyrightYear();
  initStickyNavbar();
  initHamburgerMenu();
}


/**
 * Tour page startup flow (tour.html).
 * 1. Read ?tour= from URL
 * 2. Fetch tour JSON + company JSON in parallel
 * 3. Populate all [data-field] slots
 * 4. Show tour content, hide loading state
 */
async function initTourPage() {
  const tourId = getTourId();
  if (!tourId) {
    redirectToHome();
    return;
  }

  const loadingEl = document.getElementById('page-loading');
  const errorEl = document.getElementById('page-error');
  const contentEl = document.getElementById('tour-content');

  try {
    const { tour, company } = await fetchTourWithCompany(tourId);

    // Update document title and meta
    if (tour.meta) {
      document.title = tour.meta.pageTitle || document.title;
      const metaDesc = document.getElementById('meta-description');
      if (metaDesc) metaDesc.content = tour.meta.description || '';
      const ogTitle = document.getElementById('og-title');
      if (ogTitle) ogTitle.content = tour.meta.pageTitle || '';
      const ogDesc = document.getElementById('og-description');
      if (ogDesc) ogDesc.content = tour.meta.description || '';
    }

    // Populate simple text fields
    populateFields({
      leader: tour.leader,
      title: tour.title,
      month: tour.dates.month,
      dateRange: tour.dates.range,
      price: tour.price.display,
      departure: tour.departure.display,
      basePrice: tour.price.display,
      tourCode: `Tour Number: ${tour.tourCode}`,
      companyContact: company
        ? `${company.name} — ${company.email} — Tel. ${company.phone}`
        : null,
    });

    // Render complex components
    renderTourIntro(tour);
    renderStops(tour.stops);
    renderPhotoGrid(tour.photos);
    renderPricingHero(tour.photos);
    renderItinerary(tour.itinerary);
    renderOptions(tour.options);
    renderPayments(tour.payments);
    renderInclusions(tour.inclusions);

    if (company && company.whyUs) {
      renderWhyUs(company.whyUs);
    }

    // Show content, hide loading
    hide(loadingEl);
    show(contentEl);

    // Wire up mobile itinerary toggles
    initItineraryToggle();
    initScrollAnimations();

  } catch (err) {
    console.error('[Pax Via] Tour load failed:', err);
    hide(loadingEl);
    show(errorEl);
  }
}


/**
 * Homepage startup flow (index.html).
 * 1. Fetch tours manifest + company data
 * 2. Render tour cards
 * 3. Populate Why Us section from company data
 */
async function initHomePage() {
  const loadingEl = document.getElementById('tours-loading');
  const errorEl = document.getElementById('tours-error');
  const whyUsEl = document.getElementById('why-us-body');

  try {
    const { manifest, company } = await fetchHomeData();

    hide(loadingEl);
    renderTourCards(manifest);

    if (company && company.whyUs && whyUsEl) {
      whyUsEl.innerHTML = '';
      company.whyUs.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        whyUsEl.appendChild(p);
      });
    }

    initScrollAnimations();

  } catch (err) {
    console.error('[Pax Via] Home load failed:', err);
    hide(loadingEl);
    show(errorEl);
  }
}


/** Main entry point */
function main() {
  initGlobal();

  if (isTourPage()) {
    initTourPage();
  } else if (isHomePage()) {
    initHomePage();
  }
}

main();
