import React, { useState, useLayoutEffect, useRef } from 'react';
import Page2Itinerary from './pages/Page2Itinerary';

// ── Layout constants — must match brochure.css ──────────────────────────────
// Column width: (816px page - 48px body h-padding - 20px col-gap) / 2
const COLUMN_WIDTH = 374;

// Available column height per page type:
//   page 1056 - header 66 - footer 28 = p2-body flex size 962
//   p2-body content: 962 - 18(top) - 12(bottom) = 932px
//   First page subtracts 48px for section header  → 884px
//   Continuation pages: no section header         → 932px
const FIRST_COL_H = 884;
const CONT_COL_H  = 932;

/**
 * Simulate CSS column-count:2 filling to determine which days
 * fit on each page, and exactly where the column break falls.
 */
function computePageChunks(heights) {
  if (!heights.length) return [];

  const pages = [];
  let dayIdx = 0;
  let isFirst = true;

  while (dayIdx < heights.length) {
    const colH = isFirst ? FIRST_COL_H : CONT_COL_H;
    let col1 = 0, col2 = 0, inCol2 = false;
    let colBreakIdx = null;
    const chunk = [];

    while (dayIdx < heights.length) {
      const h = heights[dayIdx];
      if (!inCol2) {
        if (col1 + h <= colH) {
          col1 += h;
          chunk.push(dayIdx++);
        } else {
          inCol2 = true;
          colBreakIdx = chunk.length;
          if (col2 + h <= colH) {
            col2 += h;
            chunk.push(dayIdx++);
          } else {
            break;
          }
        }
      } else {
        if (col2 + h <= colH) {
          col2 += h;
          chunk.push(dayIdx++);
        } else {
          break;
        }
      }
    }

    if (chunk.length === 0) {
      // Safety: force-include one day to avoid infinite loop
      chunk.push(dayIdx++);
      colBreakIdx = 1;
    }

    pages.push({
      indices: chunk,
      isFirstPage: isFirst,
      colBreakIdx: colBreakIdx ?? Math.ceil(chunk.length / 2),
    });
    isFirst = false;
  }

  return pages;
}

// Minimal day renderer used only for height measurement.
function MeasureDay({ day }) {
  return (
    <div className="p2-day">
      <div className="p2-day__meta">
        <span className="p2-day__num">{String(day.day).padStart(2, '0')}</span>
        <div className="p2-day__titles">
          <span className="p2-day__label">{day.label}</span>
          <h3 className="p2-day__heading">{day.heading}</h3>
        </div>
      </div>
      <div className="p2-day__content">
        <p className="p2-day__body">{day.body}</p>
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
 * ItineraryPages — auto-paginating itinerary renderer.
 *
 * Measures each day's rendered height in a hidden off-screen container,
 * computes page splits, then calls renderPage() once per page so the
 * caller (BrochurePreview or PrintLayout) can wrap each page however it needs.
 *
 * renderPage(pageElement, pageIndex, label) → React element
 */
export default function ItineraryPages({ tour, company, renderPage }) {
  const measureRef = useRef(null);

  // chunkState stores both the computed chunks AND the itinerary reference
  // they were computed for. This lets us detect staleness via reference equality
  // and immediately use a safe fallback on the first render after any itinerary
  // mutation (remove day, reset template, load project, etc.) — before the
  // useLayoutEffect re-measurement fires.
  const [chunkState, setChunkState] = useState({ chunks: null, measuredFor: null });

  useLayoutEffect(() => {
    if (!measureRef.current) return;
    const els = Array.from(measureRef.current.children);
    const heights = els.map((el) => el.getBoundingClientRect().height);
    setChunkState({ chunks: computePageChunks(heights), measuredFor: tour.itinerary });
  }, [tour.itinerary]);

  // Chunks are valid only if they were measured for the exact current itinerary
  // reference. Any mutation creates a new array reference, making this false and
  // causing an immediate fallback to safe defaults while re-measurement fires.
  const chunksValid =
    chunkState.measuredFor === tour.itinerary && chunkState.chunks !== null;

  const effectiveChunks = chunksValid
    ? chunkState.chunks
    : [
        {
          indices: tour.itinerary.map((_, i) => i),
          isFirstPage: true,
          colBreakIdx: Math.ceil(tour.itinerary.length / 2),
        },
      ];

  return (
    <>
      {/* Off-screen measurement container — position:fixed keeps it outside any
          CSS transform that could skew getBoundingClientRect() results. */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          width: COLUMN_WIDTH,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {tour.itinerary.map((day, i) => (
          <MeasureDay key={i} day={day} />
        ))}
      </div>

      {effectiveChunks.map((chunk, pageIdx) =>
        renderPage(
          <Page2Itinerary
            tour={tour}
            company={company}
            days={chunk.indices.map((i) => tour.itinerary[i])}
            isFirstPage={chunk.isFirstPage}
            colBreakIdx={chunk.colBreakIdx}
          />,
          pageIdx,
          pageIdx === 0 ? 'Itinerary' : 'Itinerary (cont.)',
        )
      )}
    </>
  );
}
