/**
 * country-manager.js — Tour data fetching and state management
 * Pax Via Tours & Travel
 *
 * Responsible for:
 *  - Fetching the tour JSON from /data/tours/{tourId}.json
 *  - Fetching company data from /data/company.json
 *  - Fetching the tours manifest from /data/tours-manifest.json
 *  - Exposing the loaded data to the rest of the app
 */

const DATA_BASE = 'data/';
const TOURS_PATH = `${DATA_BASE}tours/`;
const COMPANY_PATH = `${DATA_BASE}company.json`;
const MANIFEST_PATH = `${DATA_BASE}tours-manifest.json`;

/**
 * Fetch a single tour's data by ID.
 * Returns the parsed JSON object.
 * Throws if the file is not found or cannot be parsed.
 */
export async function fetchTour(tourId) {
  const res = await fetch(`${TOURS_PATH}${tourId}.json`);
  if (!res.ok) {
    throw new Error(`Tour not found: "${tourId}" (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Fetch the company data.
 * Returns the parsed JSON object.
 */
export async function fetchCompany() {
  const res = await fetch(COMPANY_PATH);
  if (!res.ok) {
    throw new Error(`Company data unavailable (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Fetch the tours manifest (list of all available tours).
 * Returns an array of tour stub objects.
 */
export async function fetchManifest() {
  const res = await fetch(MANIFEST_PATH);
  if (!res.ok) {
    throw new Error(`Tours manifest unavailable (HTTP ${res.status})`);
  }
  return res.json();
}

/**
 * Fetch tour + company in parallel (used on tour.html).
 * Returns { tour, company }.
 */
export async function fetchTourWithCompany(tourId) {
  const [tour, company] = await Promise.all([
    fetchTour(tourId),
    fetchCompany(),
  ]);
  return { tour, company };
}

/**
 * Fetch manifest + company in parallel (used on index.html).
 * Returns { manifest, company }.
 */
export async function fetchHomeData() {
  const [manifest, company] = await Promise.all([
    fetchManifest(),
    fetchCompany(),
  ]);
  return { manifest, company };
}
