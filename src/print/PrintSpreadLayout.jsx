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
 * Print duplex using "flip on short edge" so the back side aligns with the
 * front for a book-style (left-right) page turn on this landscape sheet.
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

        {/* Sheet 2 / INSIDE: Itinerary (left) | Pricing (right) */}
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
