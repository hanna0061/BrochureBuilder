import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import Page2Itinerary, {
  Page2Footer, P2_INFO_DEFAULTS, ItineraryDay, itineraryDayStyles, ITINERARY_DAY_TYPO_KEYS,
} from './pages/Page2Itinerary';
import { typoStyle, getTypo } from '../data/typography';

// ── Page geometry — must match brochure.css ──────────────────────────────────
const PAGE_H          = 1056;
const PAGE_W          = 816;
const BODY_PAD_TOP    = 40;   // .p2-body { padding: 40px 25px 5px }
const BODY_PAD_X      = 25;
const GRID_GAP        = 20;   // .p2-grid { gap: 20px }
const SECTION_HDR_MARGIN_B = 2; // .p2-section-header { margin-bottom: 2px }
const COLUMN_WIDTH    = (PAGE_W - 2 * BODY_PAD_X - GRID_GAP) / 2; // 373

// Both columns end GRID_BOTTOM px above the page bottom: 12px frame inset
// + 1px frame + 12px gap — the same ~12px frame gap as on the sides.
const GRID_BOTTOM = 25;

// Right-column footer (footnote + black info box) — .p2-footer is absolutely
// anchored to the bottom of the RIGHT column only. Its measured height plus
// P2_FOOTER_GAP is reserved in the right column only; the left column's
// capacity is not affected.
const P2_FOOTER_GAP     = 8;
const FOOTER_H_ESTIMATE = 76; // first-paint estimate only — measured in Phase 0
// The footer is pinned to the frame's INNER bottom edge (.p2-frame inset
// 12px + 1px border), which is lower than the grid's bottom (GRID_BOTTOM).
const FRAME_INNER_BOTTOM = PAGE_H - 12 - 1; // 1043

// Height available for header + columns inside .p2-body.
const BODY_CONTENT_H = PAGE_H - BODY_PAD_TOP - GRID_BOTTOM; // 991

// First-paint estimate before the section header is measured (Phase 0).
const SECTION_HDR_ESTIMATE = 46;
const INIT_AVAIL_COL_H = BODY_CONTENT_H - SECTION_HDR_ESTIMATE - SECTION_HDR_MARGIN_B - 4;

// Day spacing (each .p2-day's paddingBlock) — the only thing the balancer
// adjusts. Typography is never modified automatically.
const CSS_PAD = 5;   // .p2-day { padding-block: 5px } — measured heights include it
const SP_MAX  = 14;  // widest day gap when stretching a short itinerary

/**
 * ItineraryPages — Page 2 column-flow engine.
 *
 * Phase 0: measure the real section-header and footer heights → the left
 *          column's capacity (availableColH) and the right column's footer
 *          reserve.
 * Phase 1: measure every day's real rendered height (same <ItineraryDay>
 *          markup and typography as Page 2, inside the same text context,
 *          after fonts load) → choose the column split and per-column day
 *          spacing so EVERY day fits, or report the overflow.
 *
 * Nothing is ever hidden: all days are always rendered; if they genuinely
 * cannot fit on one page at the chosen typography, the preview shows a
 * "Content exceeds Page 2" warning (onOverflow / renderPage's 4th argument).
 */
export default function ItineraryPages({ tour, company, renderPage }) {
  const measureRef    = useRef(null); // Phase 1: day heights
  const sectionHdrRef = useRef(null); // Phase 0: section header
  const footerRef     = useRef(null); // Phase 0: right-column footer
  const lastInput     = useRef(null);

  const [availableColH, setAvailableColH] = useState(INIT_AVAIL_COL_H);
  const [gridTop,       setGridTop]       = useState(BODY_PAD_TOP + SECTION_HDR_ESTIMATE + SECTION_HDR_MARGIN_B);
  const [footerH,       setFooterH]       = useState(FOOTER_H_ESTIMATE);
  const [layout,        setLayout]        = useState(null); // { breakAt, splitAt, sp1, sp2, overflowPx }
  const col2Reserve = Math.ceil(footerH) + P2_FOOTER_GAP; // right column only
  // True room for the right column's text: from the grid top down to
  // P2_FOOTER_GAP above the footer's actual top edge.
  const col2RoomTrue = Math.floor(FRAME_INNER_BOTTOM - footerH - P2_FOOTER_GAP - gridTop);

  // Web fonts load lazily — only once text actually uses them — so the first
  // measurement usually runs with fallback metrics. Re-measure every time a
  // font batch finishes loading (this also covers switching an itinerary
  // style to a family that hasn't been used yet).
  const [fontsReady, setFontsReady] = useState(0);
  useEffect(() => {
    const fonts = typeof document !== 'undefined' ? document.fonts : null;
    if (!fonts?.addEventListener) return undefined;
    const bump = () => setFontsReady((n) => n + 1);
    fonts.addEventListener('loadingdone', bump);
    fonts.ready.then(bump);
    return () => fonts.removeEventListener('loadingdone', bump);
  }, []);

  const itinerary = tour.itinerary ?? [];
  const dayStyles = itineraryDayStyles(tour.typography);
  // Every typography input that can change a day's height.
  const dayTypoKey = JSON.stringify(ITINERARY_DAY_TYPO_KEYS.map((k) => tour.typography?.[k] ?? null));

  // Inputs that change the header/footer heights — Phase 0 re-measures when they do.
  const headerFooterKey = JSON.stringify([
    tour.typography?.itinerarySubtitle, tour.typography?.itineraryTitle,
    tour.itinerarySubtitleText, tour.itineraryTitleText,
    tour.typography?.itineraryFootnote, tour.typography?.itineraryInfoBox, tour.footnotes,
    ...Object.keys(P2_INFO_DEFAULTS).map((k) => tour[k]),
  ]);

  // ── Phase 0: measure actual section-header + footer heights ──
  useLayoutEffect(() => {
    if (!sectionHdrRef.current || !footerRef.current) return;
    const shH = sectionHdrRef.current.getBoundingClientRect().height;
    const ftH = footerRef.current.querySelector('.p2-footer')?.getBoundingClientRect().height;
    if (ftH > 10) setFooterH(ftH);
    if (shH < 10) return;
    setAvailableColH(Math.floor(BODY_CONTENT_H - shH - SECTION_HDR_MARGIN_B - 2)); // 2px safety
    setGridTop(BODY_PAD_TOP + shH + SECTION_HDR_MARGIN_B);
  }, [headerFooterKey, fontsReady]);

  // ── Phase 1: measure day heights → split + spacing ──
  useLayoutEffect(() => {
    const box = measureRef.current;
    if (!box) return;

    const inputKey = [itinerary, dayTypoKey, availableColH, col2Reserve, col2RoomTrue, fontsReady];
    if (lastInput.current && inputKey.every((v, i) => v === lastInput.current[i])) return;
    lastInput.current = inputKey;

    // Real rendered heights (the measurement copy sits outside the preview's
    // scale transform, so these are true layout px). Each includes CSS_PAD
    // top + bottom.
    const els = Array.from(box.children);
    const heights = els.map((el) => el.getBoundingClientRect().height);
    const n = heights.length;
    if (n === 0) { setLayout({ breakAt: 0, splitAt: null, sp1: CSS_PAD, sp2: CSS_PAD, overflowPx: 0 }); return; }

    const capL = availableColH; // left column: full height
    // Right column capacity = its real room above the footer. The LEVEL
    // target (where both columns end when content fits comfortably) keeps
    // the established position: footer height + gap above the grid bottom.
    const capR     = Math.max(0, col2RoomTrue);
    const levelTop = Math.min(capR, availableColH - col2Reserve);
    const sum  = (a, b) => heights.slice(a, b).reduce((s, h) => s + h, 0);
    // A column of k blocks with natural height H (measured at CSS_PAD):
    //   last text line ends at  H − 2k·CSS_PAD + (2k − 1)·sp
    const bare  = (H, k) => (k > 0 ? H - 2 * k * CSS_PAD : 0);           // text end at sp = 0
    const spFor = (E, H, k) => (k > 0 ? (E - bare(H, k)) / (2 * k - 1) : 0);

    // Candidate column breaks: between whole days, or part-way through one
    // day's body (≥2 lines each side; the heading stays with its first lines).
    const cands = [];
    const addCand = (c) => {
      c.bare1 = bare(c.H1, c.k1);
      c.bare2 = bare(c.H2, c.k2);
      cands.push(c);
    };
    for (let i = 1; i < n; i++) addCand({ idx: i, m: 0, H1: sum(0, i), k1: i, H2: sum(i, n), k2: n - i });
    if (n === 1) addCand({ idx: 1, m: 0, H1: sum(0, 1), k1: 1, H2: 0, k2: 0 });
    const geo = els.map((el) => {
      const body = el.querySelector('.p2-day__body');
      if (!body || !body.firstChild) return null;
      const lh = parseFloat(getComputedStyle(body).lineHeight);
      if (!(lh > 0)) return null;
      const dR = el.getBoundingClientRect();
      const bR = body.getBoundingClientRect();
      return { body, lh, lines: Math.round(bR.height / lh), above: bR.top - dR.top, below: dR.bottom - bR.bottom };
    });
    for (let d = 0; d < n; d++) {
      const g = geo[d];
      if (!g) continue;
      for (let m = 2; m <= g.lines - 2; m++) {
        const headH = g.above + m * g.lh + CSS_PAD;
        const tailH = CSS_PAD + (g.lines - m) * g.lh + g.below;
        addCand({ idx: d + 1, m, d, H1: sum(0, d) + headH, k1: d + 1, H2: tailH + sum(d + 1, n), k2: n - d });
      }
    }

    // Choose a mode, then the best candidate within it:
    //  A. LEVEL — both columns fit above the footer line: end both columns'
    //     text at the same level (the footer line, or higher if reaching it
    //     would need gaps wider than SP_MAX). Best = most similar day gaps.
    //  B. FIT — too tall for A, but fits when the LEFT column uses its full
    //     height beside the footer. Best = the most even spare room.
    //  C. OVERFLOW — cannot fit at the chosen typography even with zero day
    //     spacing. Best = least overflow; every day is still rendered and a
    //     warning is raised. Typography is never shrunk automatically.
    const over = (c) => Math.max(c.bare1 - capL, c.bare2 - capR);
    let mode;
    let pool = cands.filter((c) => c.bare1 <= levelTop && c.bare2 <= levelTop);
    if (pool.length) {
      mode = 'level';
      pool.forEach((c) => {
        const d = c.k1 && c.k2 ? Math.abs(spFor(levelTop, c.H1, c.k1) - spFor(levelTop, c.H2, c.k2)) : 0;
        c.score = d - (c.m ? 0 : 1); // prefer a clean break when within ~1px
      });
    } else {
      pool = cands.filter((c) => c.bare1 <= capL && c.bare2 <= capR);
      mode = pool.length ? 'fit' : 'overflow';
      if (!pool.length) pool = cands;
      pool.forEach((c) => { c.score = over(c) - (c.m ? 0 : 1); });
    }
    pool.sort((a, b) => a.score - b.score);

    // Resolve the first candidate that works (a line-level break needs the
    // character offset of body line m + 1 — skip it if it can't be located).
    let pick = null;
    let splitAt = null;
    for (const c of pool) {
      if (!c.m) { pick = c; break; }
      const { body, lh } = geo[c.d];
      const node = body.firstChild;
      if (!node || node.nodeType !== Node.TEXT_NODE) continue;
      const bTop = body.getBoundingClientRect().top;
      const range = document.createRange();
      const re = /\S+/g;
      let w;
      let at = null;
      while ((w = re.exec(node.data))) {
        range.setStart(node, w.index);
        range.setEnd(node, w.index + w[0].length);
        const rc = range.getClientRects()[0];
        if (rc && rc.top - bTop >= c.m * lh - lh / 2) { if (w.index > 0) at = w.index; break; }
      }
      if (at != null) { pick = c; splitAt = at; break; }
    }
    if (!pick) pick = pool[0];

    // Day spacing per column.
    let sp1;
    let sp2;
    if (mode === 'level') {
      let E = levelTop;
      if (pick.k1) E = Math.min(E, pick.bare1 + (2 * pick.k1 - 1) * SP_MAX);
      if (pick.k2) E = Math.min(E, pick.bare2 + (2 * pick.k2 - 1) * SP_MAX);
      E = Math.max(E, pick.bare1, pick.bare2);
      sp1 = spFor(E, pick.H1, pick.k1);
      sp2 = spFor(E, pick.H2, pick.k2);
    } else {
      // Each column: default spacing if it fits, else tightened to its own capacity.
      sp1 = Math.min(CSS_PAD, spFor(capL, pick.H1, pick.k1));
      sp2 = Math.min(CSS_PAD, spFor(capR, pick.H2, pick.k2));
    }
    sp1 = Math.max(0, sp1);
    sp2 = Math.max(0, sp2);
    const overflowPx = mode === 'overflow' ? Math.ceil(over(pick)) : 0;

    // eslint-disable-next-line no-console
    console.log('[Itinerary Debug][Phase1]', mode, 'days=', n, 'capL=', capL, 'capR=', capR, 'level=', levelTop,
      'break=', pick.idx, pick.m ? `(+${pick.m} lines)` : '', 'bare=', pick.bare1.toFixed(1), pick.bare2.toFixed(1),
      'sp=', sp1.toFixed(2), sp2.toFixed(2), overflowPx ? `OVERFLOW ${overflowPx}px` : '');

    setLayout({ breakAt: pick.idx, splitAt: pick.m ? splitAt : null, sp1, sp2, overflowPx });
  }, [itinerary, dayTypoKey, availableColH, col2Reserve, col2RoomTrue, fontsReady]); // eslint-disable-line react-hooks/exhaustive-deps

  const n = itinerary.length;
  // Before the first measurement: a midpoint split at CSS default spacing.
  const cur = layout && layout.breakAt <= n ? layout : { breakAt: Math.ceil(n / 2), splitAt: null, sp1: null, sp2: null, overflowPx: 0 };
  const overflowWarning = cur.overflowPx > 0
    ? `Content exceeds Page 2 by about ${cur.overflowPx}px at the current itinerary typography — reduce the font size, line height or text so every day fits on the page.`
    : null;

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
      <div ref={sectionHdrRef} aria-hidden="true" className="p2-measure" style={offScreenStyle}>
        <header className="p2-section-header">
          <p className="p2-eyebrow" style={typoStyle(getTypo(tour.typography, 'itinerarySubtitle'))}>{tour.itinerarySubtitleText ?? 'Pilgrimage Route'}</p>
          <h2 className="p2-heading" style={typoStyle(getTypo(tour.typography, 'itineraryTitle'))}>{tour.itineraryTitleText ?? 'Day by Day Itinerary'}</h2>
        </header>
      </div>

      {/* Phase 0: footer measurement — same component as Page2Itinerary */}
      <div ref={footerRef} aria-hidden="true" className="p2-measure" style={{ ...offScreenStyle, width: PAGE_W, height: 200 }}>
        <Page2Footer tour={tour} />
      </div>

      {/* Phase 1: every day, rendered with the exact <ItineraryDay> markup and
          typography Page 2 uses, at the real column width, in the same text
          context (.p2-measure mirrors .brochure-page's text settings). */}
      <div ref={measureRef} aria-hidden="true" className="p2-measure p2-col" style={offScreenStyle}>
        {itinerary.map((day, gi) => (
          <ItineraryDay key={gi} day={day} gi={gi} styles={dayStyles} />
        ))}
      </div>

      {renderPage(
        <Page2Itinerary
          tour={tour}
          company={company}
          isFirstPage={true}
          colBreakIdx={cur.breakAt}
          splitAt={cur.splitAt}
          daySpacing={cur.sp1}
          daySpacingCol2={cur.sp2}
          availableColH={availableColH}
        />,
        0,
        'Itinerary',
        overflowWarning,
      )}
    </>
  );
}
