import React from 'react';
import Page1Cover from '../templates/pages/Page1Cover';
import ItineraryPages from '../templates/ItineraryPages';
import { useBrochure } from '../context/BrochureContext';

/**
 * Page 1 + Page 2 folded-brochure spread export target.
 *
 * Renders ONE 1632×1056px (17in×11in at 96dpi) landscape sheet for a
 * physical brochure that gets folded once down the vertical center crease:
 *   LEFT slot  = Page 2 (Itinerary)
 *   RIGHT slot = Page 1 (Cover)
 *
 * This order is intentional and required: when the folded sheet is opened
 * from the right, Page 1 (the cover) is the page that becomes visible, so
 * Page 1 must sit on the physical right half of the sheet and Page 2 on the
 * left half. Both pages render fully upright — no CSS transform/rotation is
 * applied anywhere in this file (see PrintSpreadLayout.jsx's file-header
 * comment for why a content-level rotation is the wrong tool here; the same
 * reasoning applies to this target).
 *
 * Completely isolated from the existing Letter (.print-page) and 11×17
 * Full Spread (.print-spread-sheet) print targets: dedicated ref, dedicated
 * useReactToPrint call (see App.jsx), and dedicated CSS classes
 * (.print-page12-spread / .print-page12-spread__slot in brochure.css).
 * Reuses the existing Page1Cover and ItineraryPages (→ Page2Itinerary)
 * components as-is — no content is duplicated or rewritten.
 */
export default function PrintPage12SpreadLayout({ printPage12SpreadRef }) {
  const { state } = useBrochure();
  const { tour, company } = state;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: '-499999px',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <div ref={printPage12SpreadRef}>
        <div className="print-page12-spread">
          {/* LEFT slot — Page 2 (Itinerary) */}
          <div className="print-page12-spread__slot">
            <ItineraryPages
              tour={tour}
              company={company}
              renderPage={(pageEl) => pageEl}
            />
          </div>

          {/* RIGHT slot — Page 1 (Cover) */}
          <div className="print-page12-spread__slot">
            <Page1Cover tour={tour} company={company} />
          </div>
        </div>
      </div>
    </div>
  );
}
