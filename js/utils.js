/**
 * utils.js — Shared utility functions
 * Pax Via Tours & Travel
 */

/**
 * Format a number as US currency string.
 * formatCurrency(4699) → "$4,699"
 * formatCurrency(4699, true) → "$4,699.00"
 */
export function formatCurrency(amount, showCents = false) {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(amount);
}



/**
 * Format an ISO date string as a readable date.
 * formatDate("2026-05-15") → "May 15, 2026"
 */
export function formatDate(isoString) {
  if (!isoString || isoString === 'Now') return isoString;
  const date = new Date(isoString + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/**
 * Format a date range display.
 * formatDateRange("2026-10-12", "2026-10-23") → "October 12–23, 2026"
 */
export function formatDateRange(startIso, endIso) {
  const start = new Date(startIso + 'T00:00:00');
  const end = new Date(endIso + 'T00:00:00');
  const month = start.toLocaleDateString('en-US', { month: 'long' });
  const year = start.getFullYear();
  const startDay = start.getDate();
  const endDay = end.getDate();
  return `${month} ${startDay}–${endDay}, ${year}`;
}

/**
 * Create a DOM element with optional attributes and text content.
 * createElement('span', { class: 'foo', 'aria-hidden': 'true' }, 'Hello')
 */
export function createElement(tag, attrs = {}, text = '') {
  const el = document.createElement(tag);
  Object.entries(attrs).forEach(([key, val]) => el.setAttribute(key, val));
  if (text) el.textContent = text;
  return el;
}

/**
 * Safely get an element by ID — returns null without throwing.
 */
export function getById(id) {
  return document.getElementById(id);
}

/**
 * Show an element (removes .u-hidden).
 */
export function show(el) {
  if (el) el.classList.remove('u-hidden');
}

/**
 * Hide an element (adds .u-hidden).
 */
export function hide(el) {
  if (el) el.classList.add('u-hidden');
}

/**
 * Set the copyright year in any element with id="year".
 */
export function setCopyrightYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
