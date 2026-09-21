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
 * Sheet 2 has carried a rotate(180deg) rule intended to compensate a
 * physical duplex unit's mechanical flip — first whole-sheet, then scoped
 * to just Page 2/Page 3's own boxes. Both were removed and rotation was
 * also trialed via a separate isolated test export. CONFIRMED: the manager
 * has physically duplex-printed this exact unrotated file on their real
 * printer and the resulting folded brochure is correct — Page 2 and Page 3
 * both print upright. Do not add a rotation to Page 2 or Page 3 again.
 *
 * This component is hidden off-screen and is only used by useReactToPrint
 * with @page { size: 17in 11in }. It has no effect on the letter export,
 * the Page 1 + 2 Spread export, or Registration Form printing.
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

        {/* Sheet 1 / OUTSIDE: Terms (back cover, left) | Cover (front cover, right).
            Front side of the duplex sheet — never rotated. */}
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
