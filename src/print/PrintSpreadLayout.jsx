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
 * Sheet 2 has twice carried a rotate(180deg) rule intended to compensate a
 * physical duplex unit's mechanical flip — first whole-sheet, then scoped
 * to just Page 2/Page 3's own boxes via `.print-spread-sheet__rotate180`.
 * Both were removed.
 *
 * `src/print/DuplexProofPreview.jsx` (reachable at ?duplexProof=1) exists
 * specifically to settle this without needing a physical printer: it models
 * "duplex + Flip on Short Edge" on a landscape sheet as the real physical
 * operation it is — a 180° rotation of the whole rigid sheet about a
 * VERTICAL axis (the short edges) — using CSS `rotateY(180deg)`, a genuine
 * 3D rotation computed by the browser, applied to Sheet 2's actual rendered
 * content via the standard two-sided "flip card" technique. That computed
 * (not assumed) result: content already rotated 180° in the print file
 * stays upside-down after the simulated flip (the flip-card's own
 * compensation cancels at the container level, it does not undo an
 * additional rotation baked into the content); content authored upright
 * stays upright after the flip. Both sheets render upright here, matching
 * that finding and matching Chrome Print Preview / Save-to-PDF.
 *
 * UPDATE — a browser simulation is still not the manager's actual printer.
 * The manager has reported Page 2/Page 3 physically printing upside-down
 * from THIS exact (unrotated) file on their real duplex hardware. Rather
 * than editing this file again on a guess, `src/print/
 * PrintSpreadDuplexTestLayout.jsx` provides a second, fully isolated export
 * ("Export ▾ → Full Spread — Duplex Test (Rotate Page 2/3)") that renders
 * this same Sheet 1 + Sheet 2 layout with Page 2/Page 3 rotated 180°, so the
 * manager can physically print BOTH versions with identical printer
 * settings and keep whichever one actually comes out upright. This file
 * (the standard, default Full Spread export) is untouched by that tool —
 * do not fold the rotation back in here until a real physical print
 * confirms which version is correct on that printer.
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
