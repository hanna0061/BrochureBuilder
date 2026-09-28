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

    // Unrounded heights (offscreen copy is outside the preview's scale
    // transform, so these are true layout px). Each day's measured height
    // includes the CSS default padding-block (CSS_PAD top + bottom).
    const els = Array.from(measureRef.current.children);
    const heights = els.map((el) => el.getBoundingClientRect().height);
    const n = heights.length;
    if (n === 0) return;

    // ── Equal-baseline column balancing ─────────────────────────────────
    // Both columns' LAST LINE OF TEXT is aimed at the same level: the top of
    // the right column's footer (availableColH − col2Reserve). The left
    // column has no footer, but ending it at the same level is what makes
    // the two columns read as one balanced block above the footer.
    //
    // Only the existing per-column day spacing (paddingBlock) moves — fonts,
    // sizes and line-heights are untouched. For a column of k days whose
    // natural height is H (measured at CSS_PAD):
    //   text end = H − 2k·CSS_PAD + (2k − 1)·sp      (last day's bottom pad excluded)
    // Solving for text end = E gives each column's own sp, so both columns
    // finish at the same E regardless of how many days each holds.
    const CSS_PAD = 5;     // .p2-day { padding-block: 5px }
    const SP_MAX  = 14;    // never open day gaps wider than this — short itineraries end higher instead
    const colTarget = availableColH - col2Reserve;
    const sum = (a, b) => heights.slice(a, b).reduce((s, h) => s + h, 0);
    const bare   = (H, k) => H - 2 * k * CSS_PAD;                       // text end at sp = 0
    const spFor  = (E, H, k) => (E - bare(H, k)) / (2 * k - 1);         // sp giving text end E
    const spDiff = (H1, k1, H2, k2) => Math.abs(spFor(colTarget, H1, k1) - spFor(colTarget, H2, k2));

    // Pick the break whose two columns need the most similar spacing to
    // reach the shared target — i.e. the most even distribution of text, so
    // the day gaps look the same in both columns.
    //
    // Candidate A: between two whole days. Preferred when within ~1px of
    // the best line-level option (a clean break reads better).
    let best = { idx: Math.ceil(n / 2), m: 0, score: Infinity };
    for (let i = 1; i < n; i++) {
      const score = spDiff(sum(0, i), i, sum(i, n), n - i) - 1;
      if (score < best.score) best = { idx: i, m: 0, score };
    }

    // Candidate B: day d's body continues from the bottom of the left column
    // to the top of the right one after body line m — like a typeset page.
    // ≥2 body lines stay on each side (no orphan/widow); the "Day X:"
    // heading always stays with its first lines. Head block = everything
    // above the body + m lines + bottom pad; tail block = top pad + the
    // remaining lines + everything below the body (Overnight/Meals, pad).
    const geo = els.map((el) => {
      const body = el.querySelector('.p2-day__body');
      if (!body) return null;
      const lh = parseFloat(getComputedStyle(body).lineHeight);
      const dayR = el.getBoundingClientRect();
      const bR = body.getBoundingClientRect();
      if (!(lh > 0)) return null;
      return { body, lh, lines: Math.round(bR.height / lh), above: bR.top - dayR.top, below: dayR.bottom - bR.bottom };
    });
    for (let d = 0; d < n; d++) {
      const g = geo[d];
      if (!g) continue;
      for (let m = 2; m <= g.lines - 2; m++) {
        const headH = g.above + m * g.lh + CSS_PAD;
        const tailH = CSS_PAD + (g.lines - m) * g.lh + g.below;
        const score = spDiff(sum(0, d) + headH, d + 1, tailH + sum(d + 1, n), n - d);
        if (score < best.score) best = { idx: d, m, score, headH, tailH };
      }
    }

    // Resolve a line-level break to a character offset in the day's body:
    // the first word whose line box starts at body line m + 1.
    let splitAt = null;
    if (best.m) {
      const { body, lh } = geo[best.idx];
      const node = body.firstChild;
      const bTop = body.getBoundingClientRect().top;
      if (node && node.nodeType === Node.TEXT_NODE) {
        const range = document.createRange();
        const re = /\S+/g;
        let w;
        while ((w = re.exec(node.data))) {
          range.setStart(node, w.index);
          range.setEnd(node, w.index + w[0].length);
          const rc = range.getClientRects()[0];
          if (rc && rc.top - bTop >= best.m * lh - lh / 2) { if (w.index > 0) splitAt = w.index; break; }
        }
      }
    }

    let n1, n2, col1H, col2H;
    if (splitAt != null) {
      breakAtRef.current = best.idx + 1;              // day idx's heading + first lines sit in col 1
      n1 = best.idx + 1;
      n2 = n - best.idx;
      col1H = sum(0, best.idx) + best.headH;
      col2H = best.tailH + sum(best.idx + 1, n);
    } else {
      // Clean break (chosen, or a line break that couldn't be located —
      // fall back to the best whole-day break).
      let idx = best.m ? Math.ceil(n / 2) : best.idx;
      if (best.m) {
        let bd = Infinity;
        for (let i = 1; i < n; i++) {
          const s = spDiff(sum(0, i), i, sum(i, n), n - i);
          if (s < bd) { bd = s; idx = i; }
        }
      }
      breakAtRef.current = idx;
      n1 = idx;
      n2 = n - idx;
      col1H = sum(0, idx);
      col2H = sum(idx, n);
    }

    // Shared text-end level E: the footer line, lowered if reaching it would
    // need gaps wider than SP_MAX, raised (overflow — spacing exhausted, as
    // before) only if even zero spacing can't fit a column above it.
    let E = colTarget;
    if (n1 > 0) E = Math.min(E, bare(col1H, n1) + (2 * n1 - 1) * SP_MAX);
    if (n2 > 0) E = Math.min(E, bare(col2H, n2) + (2 * n2 - 1) * SP_MAX);
    E = Math.max(E, n1 > 0 ? bare(col1H, n1) : 0, n2 > 0 ? bare(col2H, n2) : 0);

    const sp1 = n1 > 0 ? Math.max(0, spFor(E, col1H, n1)) : CSS_PAD;
    const sp2 = n2 > 0 ? Math.max(0, spFor(E, col2H, n2)) : CSS_PAD;

    // eslint-disable-next-line no-console
    console.log('[Itinerary Debug][Phase1] col1H=', col1H.toFixed(1), 'col2H=', col2H.toFixed(1), 'target=', colTarget, 'E=', E.toFixed(1), 'sp1=', sp1.toFixed(2), 'sp2=', sp2.toFixed(2));

    setCompression({ compressedTypography: tour.typography, daySpacing: sp1, daySpacing2: sp2, splitAt });
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
          splitAt={compression?.splitAt ?? null}
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
