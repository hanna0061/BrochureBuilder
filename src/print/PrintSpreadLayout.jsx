import React from 'react';
import Page1Cover from '../templates/pages/Page1Cover';
import Page3Pricing from '../templates/pages/Page3Pricing';
import Page4Terms from '../templates/pages/Page4Terms';
import ItineraryPages from '../templates/ItineraryPages';
import { useBrochure } from '../context/BrochureContext';

/**
 * 11×17 landscape spread export target.
 *
 * Renders two sheets, each 1632×1056px (17in×11in at 96dpi), each containing
 * two brochure pages side by side:
 *   Sheet 1: Cover | Itinerary
 *   Sheet 2: Pricing | Terms
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

        {/* Sheet 1: Cover (left) | Itinerary (right) */}
        <div className="print-spread-sheet">
          <Page1Cover tour={tour} company={company} />
          <ItineraryPages
            tour={tour}
            company={company}
            renderPage={(pageEl) => pageEl}
          />
        </div>

        {/* Sheet 2: Pricing (left) | Terms (right) */}
        <div className="print-spread-sheet print-spread-sheet--last">
          <Page3Pricing tour={tour} company={company} terms={terms} />
          <Page4Terms tour={tour} company={company} terms={terms} />
        </div>

      </div>
    </div>
  );
}
