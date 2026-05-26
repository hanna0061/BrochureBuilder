/**
 * router.js — URL routing and query parameter utilities
 * Pax Via Tours & Travel
 *
 * Reads the ?tour= query parameter to determine which tour to load.
 * On tour.html: if no valid ?tour= param, redirect to index.html.
 */

/**
 * Returns the value of a URL query parameter by name.
 * getTourId() on "/tour.html?tour=poland-czech-medjugorje" → "poland-czech-medjugorje"
 */
export function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * Returns the tour ID from the ?tour= param, or null if absent.
 */
export function getTourId() {
  return getQueryParam('tour');
}

/**
 * Returns the current page filename (basename only).
 * "tour.html", "index.html", "terms.html"
 */
export function getCurrentPage() {
  const path = window.location.pathname;
  return path.split('/').pop() || 'index.html';
}

/**
 * Returns true if the current page is the tour detail page.
 */
export function isTourPage() {
  return getCurrentPage() === 'tour.html';
}

/**
 * Returns true if the current page is the homepage.
 */
export function isHomePage() {
  const page = getCurrentPage();
  return page === 'index.html' || page === '' || page === '/';
}

/**
 * Redirect to the homepage.
 */
export function redirectToHome() {
  window.location.replace('index.html');
}

/**
 * Build a tour page URL for a given tour ID.
 * buildTourUrl("poland-czech-medjugorje") → "tour.html?tour=poland-czech-medjugorje"
 */
export function buildTourUrl(tourId) {
  return `tour.html?tour=${encodeURIComponent(tourId)}`;
}
