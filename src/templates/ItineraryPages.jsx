import React, { useState, useLayoutEffect, useRef } from 'react';
import Page2Itinerary from './pages/Page2Itinerary';
import { typoStyle, getTypo } from '../data/typography';

// ── Page geometry — must match brochure.css ──────────────────────────────────
const PAGE_H         = 1056;
const HEADER_H       = 66;   // .pg-header { height: 66px }
const FOOTER_H       = 28;   // .pg-footer { min-height: 28px }
const BODY_PAD_TOP   = 18;   // .p2-body { padding: 18px 24px 12px }
const BODY_PAD_BOTTOM = 12;
const SECTION_HDR_MARGIN_B = 12; // .p2-section-header { margin-bottom: 12px }
const COLUMN_WIDTH   = 374;  // (816 − 48 padding − 20 gap) / 2

// Inner content height of .p2-body (fixed by flex layout).
// All day content + section header must fit within this.
const BODY_CONTENT_H =
  PAGE_H - HEADER_H - FOOTER_H - BODY_PAD_TOP - BODY_PAD_BOTTOM; // 932

// Conservative initial estimate before the section header is measured.
// Real value is measured in useLayoutEffect below.
const SECTION_HDR_ESTIMATE = 56; // eyebrow ~14px + heading ~28px + margin 12px + slop
const INIT_AVAIL_COL_H =
  BODY_CONTENT_H - SECTION_HDR_ESTIMATE - SECTION_HDR_MARGIN_B - 4; // 860

// Minimal day renderer for off-screen height measurement.
function MeasureDay({ day, headingStyle, bodyStyle, daySpacing }) {
  return (
    <div className="p2-day" style={daySpacing != null ? { paddingBlock: daySpacing } : undefined}>
      <div className="p2-day__meta">
        <span className="p2-day__num">{String(day.day).padStart(2, '0')}</span>
        <div className="p2-day__titles">
          <span className="p2-day__label">{day.label}</span>
          <h3 className="p2-day__heading" style={headingStyle}>{day.heading}</h3>
        </div>
      </div>
      <div className="p2-day__content">
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
    </div>
  );
}

/**
 * Analytically compress typography to reduce total day content height.
 *
 * Priority (most → least aggressive):
 *   1. day padding  7px → 0       (handles first ~35% of shortage)
 *   2. line-height  up to −10%    (next 20%)
 *   3. body font    up to −10%    (next 20%)
 *   4. heading font up to −8%     (last resort)
 *
 * Minimums keep text readable. scaleY fallback handles remaining overflow.
 */
function computeCompression(naturalHeight, typography, availableTotalH) {
  const factor   = availableTotalH / naturalHeight;
  const shortage = 1 - factor;

  const baseHeading = getTypo(typography, 'itineraryHeading');
  const baseBody    = getTypo(typography, 'itineraryBody');

  const spaceFrac  = Math.min(1, shortage / 0.35);
  const daySpacing = Math.max(0, Math.round(7 * (1 - spaceFrac)));

  const lhFrac   = shortage > 0.35 ? Math.min(1, (shortage - 0.35) / 0.20) : 0;
  const bodyFrac = shortage > 0.55 ? Math.min(1, (shortage - 0.55) / 0.20) : 0;
  const headFrac = shortage > 0.75 ? Math.min(1, (shortage - 0.75) / 0.15) : 0;

  const compressedHeading = {
    ...baseHeading,
    lineHeight: Math.max(1.1, baseHeading.lineHeight * (1 - lhFrac * 0.10)),
    fontSize:   Math.max(9,   baseHeading.fontSize   * (1 - headFrac * 0.08)),
  };
  const compressedBody = {
    ...baseBody,
    lineHeight: Math.max(1.1, baseBody.lineHeight * (1 - lhFrac * 0.10)),
    fontSize:   Math.max(9,   baseBody.fontSize   * (1 - bodyFrac * 0.10)),
  };

  return {
    compressedTypography: {
      ...typography,
      itineraryHeading: compressedHeading,
      itineraryBody:    compressedBody,
    },
    daySpacing,
  };
}

/**
 * ItineraryPages
 *
 * Three-phase layout engine:
 *   Phase 0: Measure actual section-header height → derive real available col height.
 *   Phase 1: Measure natural day heights → analytical compression if needed.
 *   Phase 2: Measure compressed heights → scaleY if still overflowing.
 *
 * The footer is a HARD BOUNDARY. Available height is calculated as:
 *   PAGE_H − HEADER_H − FOOTER_H − body-padding − section-header-height
 */
export default function ItineraryPages({ tour, company, renderPage }) {
  const measureRef      = useRef(null); // Phase 1: natural styles
  const measureRef2     = useRef(null); // Phase 2: compressed styles
  const sectionHdrRef   = useRef(null); // Phase 0: section header measurement
  const footerRef       = useRef(null); // Phase 0: footer measurement
  const lastInput       = useRef({ itinerary: null, headTypo: null, bodyTypo: null, colH: 0 });
  const breakAtRef      = useRef(0);

  const [availableColH, setAvailableColH] = useState(INIT_AVAIL_COL_H);
  const [compression,   setCompression]   = useState(null);
  const [pageScale,     setPageScale]     = useState(1);
  const [gridColH,      setGridColH]      = useState(INIT_AVAIL_COL_H);

  const itHeadingTypo = tour.typography?.itineraryHeading;
  const itBodyTypo    = tour.typography?.itineraryBody;

  const activeTour = compression
    ? { ...tour, typography: compression.compressedTypography }
    : tour;

  const headingStyle = typoStyle(getTypo(activeTour.typography, 'itineraryHeading'));
  const bodyStyle    = typoStyle(getTypo(activeTour.typography, 'itineraryBody'));
  const daySpacing   = compression?.daySpacing ?? null;

  // ── Phase 0: measure actual section-header height (once, after fonts load) ─
  useLayoutEffect(() => {
    if (!sectionHdrRef.current || !footerRef.current) return;
    const shH = sectionHdrRef.current.getBoundingClientRect().height;
    const fH  = footerRef.current.getBoundingClientRect().height;
    if (shH < 10 || fH < 6) return; // fonts/styles not loaded yet — skip
    // Total space consumed by section header = element height + its margin-bottom
    const realColH = Math.max(
      760,
      Math.floor(BODY_CONTENT_H - shH - SECTION_HDR_MARGIN_B - fH - 2) // 2px safety
    );
    setAvailableColH(realColH);
    setGridColH(realColH); // sync default gridColH
    // Runtime diagnostics for investigation
    // Print availableColH, measured section header height, footer reserved height
    // NOTE: realColH is the computed available column height used for layout
    // and BODY_CONTENT_H is the full space inside the page body.
    // These logs help reproduce clipping issues.
    // eslint-disable-next-line no-console
    console.log('[Itinerary Debug][Phase0] realColH=', realColH, 'shH=', shH, 'fH=', fH, 'BODY_CONTENT_H=', BODY_CONTENT_H);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Phase 1: measure natural day heights → compute analytical compression ──
  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const availableTotalH = availableColH * 2;

    if (
      lastInput.current.itinerary === tour.itinerary &&
      lastInput.current.headTypo  === itHeadingTypo  &&
      lastInput.current.bodyTypo  === itBodyTypo      &&
      lastInput.current.colH      === availableColH
    ) return;

    lastInput.current = {
      itinerary: tour.itinerary,
      headTypo: itHeadingTypo,
      bodyTypo: itBodyTypo,
      colH: availableColH,
    };

    const els = Array.from(measureRef.current.children);
    const heights = els.map((el) => Math.ceil(el.getBoundingClientRect().height));
    const n = heights.length;
    if (n === 0) return;

    // Choose break index that minimizes the max column height (best balance).
    let bestIdx = Math.ceil(n / 2);
    let bestMax = Infinity;
    for (let i = 1; i < n; i++) {
      const c1 = heights.slice(0, i).reduce((s, h) => s + h, 0);
      const c2 = heights.slice(i).reduce((s, h) => s + h, 0);
      const m = Math.max(c1, c2);
      if (m < bestMax) {
        bestMax = m;
        bestIdx = i;
      }
    }

    breakAtRef.current = bestIdx;

    const naturalHeight = heights.reduce((s, h) => s + h, 0);

    // Diagnostics: log measured heights and chosen break
    // eslint-disable-next-line no-console
    console.log('[Itinerary Debug][Phase1] naturalHeight=', naturalHeight, 'availableTotalH=', availableTotalH, 'availableColH=', availableColH, 'bestBreak=', bestIdx, 'bestMaxColH=', bestMax);

    // If rebalanced columns already fit, no compression needed.
    if (bestMax <= availableColH) {
      setCompression(null);
      setPageScale(1);
      setGridColH(availableColH);
      // eslint-disable-next-line no-console
      console.log('[Itinerary Debug][Phase1] Rebalanced columns fit; skipping compression.');
      return;
    }

    // Otherwise compute compression analytically (last resort after rebalance).
    const factor = availableTotalH / naturalHeight;
    // eslint-disable-next-line no-console
    console.log('[Itinerary Debug][Phase1] compressionFactor=', factor);
    setCompression(computeCompression(naturalHeight, tour.typography, availableTotalH));
  }, [tour.itinerary, itHeadingTypo, itBodyTypo, availableColH]);

  // ── Phase 2: measure compressed heights → scaleY if still overflowing ──────
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
    const col2H   = els.slice(breakAt).reduce((s, el)    => s + el.getBoundingClientRect().height, 0);
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
      // scaleY fallback: give grid full layout height so CSS columns place all days,
      // then scale it visually to fit within availableColH.
      const scale = Math.max(0.78, availableColH / maxColH);
      setPageScale(scale);
      setGridColH(maxColH);
      // eslint-disable-next-line no-console
      console.log('[Itinerary Debug][Phase2] Applied scaleY:', scale, 'computedGridColH=', maxColH);
    }
  }, [compression, availableColH]);

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
          <p className="p2-eyebrow">Pilgrimage Route</p>
          <h2 className="p2-heading">Day by Day Itinerary</h2>
        </header>
      </div>

      {/* Off-screen footer measurement (to compute exact footer height) */}
      <div ref={footerRef} aria-hidden="true" style={offScreenStyle}>
        <div className="pg-footer">
          <span className="pg-footer__text">Tour Code: DEMO</span>
          <span className="pg-footer__text">Company · 000-000-0000 · email@demo.com</span>
        </div>
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
