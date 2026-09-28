import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Page2Itinerary, { Page2Footer, P2_INFO_DEFAULTS } from './pages/Page2Itinerary';
import { typoStyle, getTypo } from '../data/typography';

// ── Page geometry — must match brochure.css ──────────────────────────────────
const PAGE_H          = 1056;
const PAGE_W          = 816;
const BODY_PAD_TOP    = 40;   // .p2-body { padding: 40px 25px 5px }
const SECTION_HDR_MARGIN_B = 2; // .p2-section-header { margin-bottom: 2px }
const COLUMN_WIDTH    = 373;  // (816 − 50 padding − 20 gap) / 2

// Both columns end GRID_BOTTOM px above the page bottom: 12px frame inset
// + 1px frame + 12px gap — the same ~12px frame gap as on the sides.
const GRID_BOTTOM = 25;

// Right-column footer (footnote + black info box) — .p2-footer is absolutely
// anchored to the bottom of the RIGHT column only. Its measured height plus
// P2_FOOTER_GAP is reserved in the right column's spacing math; the left
// column's available height is not affected.
const P2_FOOTER_GAP     = 8;
const FOOTER_H_ESTIMATE = 76; // footnote ~15px + 4px gap + box ~57px (wraps at column width)

// Height available for header + columns inside .p2-body.
const BODY_CONTENT_H = PAGE_H - BODY_PAD_TOP - GRID_BOTTOM; // 991

// Conservative initial estimate before the section header is measured.
// Real value is measured in useLayoutEffect below.
const SECTION_HDR_ESTIMATE = 46; // eyebrow ~14px + heading ~28px + margin 2px + slop
const INIT_AVAIL_COL_H =
  BODY_CONTENT_H - SECTION_HDR_ESTIMATE - SECTION_HDR_MARGIN_B - 4;

// Minimal day renderer for off-screen height measurement.
function MeasureDay({ day, headingStyle, bodyStyle, daySpacing }) {
  return (
    <div className="p2-day" style={daySpacing != null ? { paddingBlock: daySpacing } : undefined}>
      <p className="p2-day__title-line">
        <span className="p2-day__label">{day.label}:</span>
        {' '}
        <span className="p2-day__heading" style={headingStyle}>{day.heading}</span>
      </p>
      <p className="p2-day__body" style={bodyStyle}>{day.body}</p>
      {(day.overnight || day.meals) && (
        <p className="p2-day__overnight">
          {day.overnight && (
            <><span className="p2-overnight-lbl">Overnight:</span>{' '}{day.overnight}</>
          )}
          {day.overnight && day.meals && '  ·  '}
          {day.meals && (
            <><span className="p2-overnight-lbl">Meals:</span>{' '}{day.meals}</>
          )}
        </p>
      )}
    </div>
  );
}

/**
 * Compute spacing compression to reduce total day content height.
 *
 * Only day spacing is reduced (7px → 0). Typography is NEVER modified
 * automatically — user font size, line height, and letter spacing are
 * authoritative and must always reflect what the typography panel shows.
 */
function computeCompression(naturalHeight, typography, availableTotalH) {
  const shortage  = Math.max(0, 1 - availableTotalH / naturalHeight);
  const spaceFrac = Math.min(1, shortage / 0.35);
  return {
    compressedTypography: typography, // pass through unchanged
    daySpacing: Math.max(0, Math.round(7 * (1 - spaceFrac))),
  };
}

/**
 * ItineraryPages
 *
 * Three-phase layout engine:
 *   Phase 0: Measure actual section-header height → derive real available col height.
 *   Phase 1: Measure natural day heights → analytical compression if needed.
 *   Phase 2: Measure compressed heights → proportional font squeeze if still overflowing.
 *
 * Available column height is calculated as:
 *   PAGE_H − body-top-padding − GRID_BOTTOM − section-header-height
 * The right column additionally reserves room for its bottom footer
 * (col2Reserve); the left column uses the full available height.
 */
export default function ItineraryPages({ tour, company, renderPage }) {
  const measureRef      = useRef(null); // Phase 1: natural styles
  const measureRef2     = useRef(null); // Phase 2: compressed styles
  const sectionHdrRef   = useRef(null); // Phase 0: section header measurement
  const footerRef       = useRef(null); // Phase 0: bottom footer measurement
  const lastInput       = useRef({ itinerary: null, headTypo: null, bodyTypo: null, colH: 0 });
  const breakAtRef      = useRef(0);

  const [availableColH, setAvailableColH] = useState(INIT_AVAIL_COL_H);
  const [compression,   setCompression]   = useState(null);
  const [pageScale,     setPageScale]     = useState(1);
  const [gridColH,      setGridColH]      = useState(INIT_AVAIL_COL_H);
  const [footerH,       setFooterH]       = useState(FOOTER_H_ESTIMATE);
  const col2Reserve = Math.ceil(footerH) + P2_FOOTER_GAP; // right column only

  // Web fonts (EB Garamond / Inter) start downloading only once text uses
  // them, so they usually finish AFTER the first measurement pass. Fallback
  // fonts set wider, so heights measured before then are inflated and the
  // column spacing gets over-compressed. Bump a counter whenever a font batch
  // finishes loading so Phases 0–1 re-measure with the real metrics.
  const [fontsReady, setFontsReady] = useState(0);
  useEffect(() => {
    const fonts = typeof document !== 'undefined' ? document.fonts : null;
    if (!fonts?.addEventListener) return;
    const bump = () => setFontsReady((n) => n + 1);
    fonts.addEventListener('loadingdone', bump);
    fonts.ready.then(bump);
    return () => fonts.removeEventListener('loadingdone', bump);
  }, []);

  const itHeadingTypo = tour.typography?.itineraryHeading;
  const itBodyTypo    = tour.typography?.itineraryBody;

  const activeTour = compression
    ? { ...tour, typography: compression.compressedTypography }
    : tour;

  const headingStyle = typoStyle(getTypo(activeTour.typography, 'itineraryHeading'));
  const bodyStyle    = typoStyle(getTypo(activeTour.typography, 'itineraryBody'));
  const daySpacing    = compression?.daySpacing  ?? null;
  const daySpacing2   = compression?.daySpacing2 ?? null; // col2 (right) — null means same as daySpacing

  // Inputs that change the header/footer heights — Phase 0 re-measures when they do.
  const footerTypoKey = JSON.stringify([
    tour.typography?.itinerarySubtitle, tour.typography?.itineraryTitle,
    tour.itinerarySubtitleText, tour.itineraryTitleText,
    tour.typography?.itineraryFootnote, tour.typography?.itineraryInfoBox, tour.footnotes,
    ...Object.keys(P2_INFO_DEFAULTS).map((k) => tour[k]),
  ]);

  // ── Phase 0: measure actual section-header + footer heights ─
  useLayoutEffect(() => {
    if (!sectionHdrRef.current || !footerRef.current) return;
    const shH = sectionHdrRef.current.getBoundingClientRect().height;
    const ftH = footerRef.current.querySelector('.p2-footer')?.getBoundingClientRect().height;
    if (ftH > 10) setFooterH(ftH);
    if (shH < 10) return; // fonts/styles not loaded yet — skip
    // Available column height = body content area minus section header and its margin.
    // The footer is NOT subtracted here — only the right column reserves it (Phase 1).
    const realColH = Math.max(
      760,
      Math.floor(BODY_CONTENT_H - shH - SECTION_HDR_MARGIN_B - 2) // 2px safety
    );
    setAvailableColH(realColH);
    setGridColH(realColH); // sync default gridColH
    // eslint-disable-next-line no-console
    console.log('[Itinerary Debug][Phase0] realColH=', realColH, 'shH=', shH, 'ftH=', ftH, 'BODY_CONTENT_H=', BODY_CONTENT_H);
  }, [footerTypoKey, fontsReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Phase 1: measure natural day heights → compute analytical compression ──
  useLayoutEffect(() => {
    if (!measureRef.current) return;

    if (
      lastInput.current.itinerary === tour.itinerary &&
      lastInput.current.headTypo  === itHeadingTypo  &&
      lastInput.current.bodyTypo  === itBodyTypo      &&
      lastInput.current.colH      === availableColH  &&
      lastInput.current.fonts     === fontsReady     &&
      lastInput.current.reserve   === col2Reserve
    ) return;

    lastInput.current = {
      itinerary: tour.itinerary,
      headTypo: itHeadingTypo,
      bodyTypo: itBodyTypo,
      colH: availableColH,
      fonts: fontsReady,
      reserve: col2Reserve,
    };

    const els = Array.from(measureRef.current.children);
    const heights = els.map((el) => Math.ceil(el.getBoundingClientRect().height));
    const n = heights.length;
    if (n === 0) return;

    // Choose break index that minimizes the max column height (best balance).
    // The right column's height includes its bottom footer reserve.
    let bestIdx = Math.ceil(n / 2);
    let bestMax = Infinity;
    for (let i = 1; i < n; i++) {
      const c1 = heights.slice(0, i).reduce((s, h) => s + h, 0);
      const c2 = heights.slice(i).reduce((s, h) => s + h, 0) + col2Reserve;
      const m = Math.max(c1, c2);
      if (m < bestMax) {
        bestMax = m;
        bestIdx = i;
      }
    }

    breakAtRef.current = bestIdx;

    const naturalHeight = heights.reduce((s, h) => s + h, 0);

    // eslint-disable-next-line no-console
    console.log('[Itinerary Debug][Phase1] naturalHeight=', naturalHeight, 'availableColH=', availableColH, 'bestIdx=', bestIdx);

    // Per-column spacing — each column fills exactly availableColH.
    //
    // CSS_BASE is intentionally set 1px below the CSS padding-block (5px) to produce
    // a tighter, more compact appearance while keeping both columns balanced.
    //
    // Formula (same for expansion and compression):
    //   sp = CSS_BASE + (availableColH − colH_nat) / (2 × n)
    //
    // When colH_nat < availableColH → sp > CSS_BASE  (expand, more inter-day padding)
    // When colH_nat > availableColH → sp < CSS_BASE  (compress, less padding, clamped ≥ 0)
    //
    // A forced break-before:column at bestIdx enforces this per-column split.
    // Lowering CSS_BASE reduces sp by ~2px per day (~10–15% spacing reduction) and
    // leaves a small (~24px) balanced gap at the bottom of both columns.
    const CSS_BASE = 3;
    const col1H = heights.slice(0, bestIdx).reduce((s, h) => s + h, 0);
    const col2H = naturalHeight - col1H;
    const n1    = bestIdx;
    const n2    = n - bestIdx;
    const sp1 = n1 > 0 ? Math.max(0, CSS_BASE + (availableColH - col1H) / (2 * n1)) : CSS_BASE;
    const col2AvailH = availableColH - col2Reserve; // right column stops above its footer
    const sp2 = n2 > 0 ? Math.max(0, CSS_BASE + (col2AvailH - col2H) / (2 * n2)) : CSS_BASE;

    // eslint-disable-next-line no-console
    console.log('[Itinerary Debug][Phase1] col1H=', col1H, 'col2H=', col2H, 'sp1=', sp1.toFixed(2), 'sp2=', sp2.toFixed(2));

    const THRESHOLD = 0.4;
    if (Math.abs(sp1 - CSS_BASE) > THRESHOLD || Math.abs(sp2 - CSS_BASE) > THRESHOLD) {
      setCompression({ compressedTypography: tour.typography, daySpacing: sp1, daySpacing2: sp2 });
    } else {
      setCompression(null);
    }
    setPageScale(1);
    setGridColH(availableColH);
  }, [tour.itinerary, itHeadingTypo, itBodyTypo, availableColH, fontsReady, col2Reserve]);

  // ── Phase 2: measure compressed heights → proportional font squeeze if still overflowing ──
  useLayoutEffect(() => {
    if (!measureRef2.current) return;

    if (!compression) {
      setPageScale(1);
      setGridColH(availableColH);
      return;
    }

    const breakAt = breakAtRef.current;
    const els     = Array.from(measureRef2.current.children);
    const col1H   = els.slice(0, breakAt).reduce((s, el) => s + el.getBoundingClientRect().height, 0);
    const col2H   = els.slice(breakAt).reduce((s, el)    => s + el.getBoundingClientRect().height, 0) + col2Reserve;
    const maxColH = Math.max(col1H, col2H, 1);

    // Diagnostics: log column heights and current available height
    // eslint-disable-next-line no-console
    console.log('[Itinerary Debug][Phase2] col1H=', col1H, 'col2H=', col2H, 'maxColH=', maxColH, 'availableColH=', availableColH, 'currentGridColH=', gridColH);

    if (maxColH <= availableColH) {
      setPageScale(1);
      setGridColH(availableColH);
      // eslint-disable-next-line no-console
      console.log('[Itinerary Debug][Phase2] No scaling needed; pageScale=1');
    } else {
      // Spacing compression is exhausted; content exceeds availableColH.
      // User typography is authoritative — no automatic overrides. Accept the result.
      setPageScale(1);
      setGridColH(availableColH);
      // eslint-disable-next-line no-console
      console.log('[Itinerary Debug][Phase2] Overflow; spacing exhausted, typography preserved.');
    }
  }, [compression, availableColH, col2Reserve]);

  const colBreakIdx = breakAtRef.current || Math.ceil(tour.itinerary.length / 2);

  const offScreenStyle = {
    position: 'fixed',
    left: '-9999px',
    top: 0,
    width: COLUMN_WIDTH,
    visibility: 'hidden',
    pointerEvents: 'none',
  };

  return (
    <>
      {/* Phase 0: section-header measurement — same markup as Page2Itinerary */}
      <div ref={sectionHdrRef} aria-hidden="true" style={offScreenStyle}>
        <header className="p2-section-header">
          <p className="p2-eyebrow" style={typoStyle(getTypo(tour.typography, 'itinerarySubtitle'))}>{tour.itinerarySubtitleText ?? 'Pilgrimage Route'}</p>
          <h2 className="p2-heading" style={typoStyle(getTypo(tour.typography, 'itineraryTitle'))}>{tour.itineraryTitleText ?? 'Day by Day Itinerary'}</h2>
        </header>
      </div>

      {/* Phase 0: bottom footer measurement — same component as Page2Itinerary */}
      {/* Off-screen copy of the footer (fixed 373px width) for height measurement. */}
      <div ref={footerRef} aria-hidden="true" style={{ ...offScreenStyle, width: PAGE_W, height: 200 }}>
        <Page2Footer tour={tour} />
      </div>

      {/* Phase 1: natural (uncompressed) measurement */}
      <div ref={measureRef} aria-hidden="true" style={offScreenStyle}>
        {tour.itinerary.map((day, i) => (
          <MeasureDay
            key={i}
            day={day}
            headingStyle={typoStyle(getTypo(tour.typography, 'itineraryHeading'))}
            bodyStyle={typoStyle(getTypo(tour.typography, 'itineraryBody'))}
          />
        ))}
      </div>

      {/* Phase 2: compressed measurement */}
      <div ref={measureRef2} aria-hidden="true" style={offScreenStyle}>
        {tour.itinerary.map((day, i) => (
          <MeasureDay
            key={i}
            day={day}
            headingStyle={headingStyle}
            bodyStyle={bodyStyle}
            daySpacing={daySpacing}
          />
        ))}
      </div>

      {renderPage(
        <Page2Itinerary
          tour={activeTour}
          company={company}
          days={tour.itinerary}
          isFirstPage={true}
          colBreakIdx={colBreakIdx}
          daySpacing={daySpacing}
          daySpacingCol2={daySpacing2}
          pageScale={pageScale}
          gridColH={gridColH}
          availableColH={availableColH}
        />,
        0,
        'Itinerary',
      )}
    </>
  );
}
