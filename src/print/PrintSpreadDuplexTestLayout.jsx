import React from 'react';
import Page1Cover from '../templates/pages/Page1Cover';
import Page3Pricing from '../templates/pages/Page3Pricing';
import Page4Terms from '../templates/pages/Page4Terms';
import ItineraryPages from '../templates/ItineraryPages';
import { useBrochure } from '../context/BrochureContext';

/**
 * ISOLATED test target — NOT the production Full Spread export
 * (PrintSpreadLayout.jsx, untouched by this file).
 *
 * Identical to PrintSpreadLayout.jsx in every respect (same two 1632×1056
 * sheets, same page order, same components, same @page geometry via its own
 * print handler in App.jsx) EXCEPT: Sheet 2's Page 2 (Itinerary) and Page 3
 * (Pricing) are each wrapped in `.print-spread-sheet__duplex-rotate180`
 * (rotate(180deg), scoped to this file only — see brochure.css) instead of
 * rendering upright.
 *
 * WHY THIS EXISTS: PrintSpreadLayout.jsx's own header comment documents that
 * a content-level rotation was tried twice before and reverted after
 * DuplexProofPreview.jsx's CSS-rotateY(180deg) simulation showed it produces
 * an upside-down physical result — but that simulation is still a browser
 * approximation of duplex mechanics, not the manager's actual printer. Since
 * the manager has reported Page 2/Page 3 physically printing upside-down
 * with NO rotation applied (today's production state), the only reliable
 * way to settle this is to print both versions on the real printer and
 * compare — hence a second, completely separate print target the manager
 * can generate without anyone touching PrintSpreadLayout.jsx or guessing.
 *
 * Sheet 1 (Page 4 | Page 1) is reproduced byte-for-byte identical to
 * PrintSpreadLayout.jsx's own Sheet 1 — this tool never touches the front
 * side, only Sheet 2.
 *
 * This component renders into its own hidden DOM (mounted once in App.jsx,
 * independent of PrintSpreadLayout.jsx's own hidden instance) and is driven
 * by its own useReactToPrint handler — it cannot affect the standard Full
 * Spread export, the Letter export, the Page 1 + 2 Spread export, or
 * Registration Form printing.
 */
export default function PrintSpreadDuplexTestLayout({ printSpreadDuplexTestRef }) {
  const { state } = useBrochure();
  const { tour, company, terms } = state;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: '-599999px',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <div ref={printSpreadDuplexTestRef}>

        {/* Sheet 1 / OUTSIDE — identical to PrintSpreadLayout.jsx's Sheet 1,
            never rotated, never part of what this tool is testing. */}
        <div className="print-spread-sheet">
          <Page4Terms tour={tour} company={company} terms={terms} />
          <Page1Cover tour={tour} company={company} />
        </div>

        {/* Sheet 2 / INSIDE — the ONLY difference from PrintSpreadLayout.jsx:
            Page 2 and Page 3 are each pre-rotated 180° here, to be compared
            physically against the unrotated production version. */}
        <div className="print-spread-sheet print-spread-sheet--last">
          <ItineraryPages
            tour={tour}
            company={company}
            renderPage={(pageEl, idx) => (
              <div key={`itin-duplex-test-${idx}`} className="print-spread-sheet__duplex-rotate180">
                {pageEl}
              </div>
            )}
          />
          <div className="print-spread-sheet__duplex-rotate180">
            <Page3Pricing tour={tour} company={company} terms={terms} />
          </div>
        </div>

      </div>
    </div>
  );
}
