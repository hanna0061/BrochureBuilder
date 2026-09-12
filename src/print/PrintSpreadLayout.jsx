import React from 'react';
import Page1Cover from '../templates/pages/Page1Cover';
import Page3Pricing from '../templates/pages/Page3Pricing';
import Page4Terms from '../templates/pages/Page4Terms';
import ItineraryPages from '../templates/ItineraryPages';
import { useBrochure } from '../context/BrochureContext';

/**
 * 11×17 landscape spread export target.
 *
 * Renders two sheets, each 1632×1056px (17in×11in at 96dpi) — the front and
 * back of a single physical 17×11 sheet, duplex-printed and folded in half
 * (vertical center crease) into a 4-page booklet:
 *   Sheet 1 (front / outside):  Terms (back cover) | Cover (front cover)
 *   Sheet 2 (back / inside):    Itinerary | Pricing
 *
 * Folded reading order is Cover → Itinerary → Pricing → Terms.
 *
 * IMPOSITION FIX — HISTORY (do not reintroduce a content-level rotation):
 * Sheet 2 used to carry `.print-spread-sheet--backside { transform:
 * rotate(180deg) }`, meant to pre-compensate a physical duplex unit's
 * mechanical flip. That broke Chrome Print Preview (and Save-to-PDF,
 * Microsoft Print to PDF, OneNote): react-to-print (v2.x) renders this
 * component into one hidden iframe and calls window.print() on it — the
 * SAME rendered content is what Print Preview displays and what any print
 * destination receives. There is no separate "preview" render vs "output"
 * render to diverge, so any CSS transform applied here shows up identically
 * everywhere, including the on-screen preview the user is looking at. A
 * physical duplex printer's mechanical fold/flip axis is a property of the
 * printer/driver, not of the page content, so it cannot be corrected by
 * rotating the source — doing so only ever makes the preview wrong too.
 *
 * Current behavior: both sheets render upright, matching what Chrome Print
 * Preview shows. If an actual physical duplex print run still comes out
 * misfolded, the fix belongs in the OS print dialog's duplex option (e.g.
 * "Flip on Short Edge" vs "Flip on Long Edge" for this 17×11 landscape job),
 * not in this file — that setting is exactly the printer-driver-level
 * decoupling point between "what the page looks like" and "how the
 * physical sheet gets flipped." This has not been re-verified against a
 * real physical duplex printer since the rotation was removed.
 *
 * This component is hidden off-screen and is only used by useReactToPrint
 * with @page { size: 17in 11in }. It has no effect on the letter export path.
 */
export default function PrintSpreadLayout({ printSpreadRef }) {
  const { state } = useBrochure();
  const { tour, company, terms } = state;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: '-299999px',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <div ref={printSpreadRef}>

        {/* Sheet 1 / OUTSIDE: Terms (back cover, left) | Cover (front cover, right) */}
        <div className="print-spread-sheet">
          <Page4Terms tour={tour} company={company} terms={terms} />
          <Page1Cover tour={tour} company={company} />
        </div>

        {/* Sheet 2 / INSIDE: Itinerary (left) | Pricing (right).
            Renders upright — no content-level rotation (see file header). */}
        <div className="print-spread-sheet print-spread-sheet--last">
          <ItineraryPages
            tour={tour}
            company={company}
            renderPage={(pageEl) => pageEl}
          />
          <Page3Pricing tour={tour} company={company} terms={terms} />
        </div>

      </div>
    </div>
  );
}
