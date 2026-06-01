import React, { useRef, useEffect, useState } from 'react';
import Page1Cover from '../templates/pages/Page1Cover';
import Page3Pricing from '../templates/pages/Page3Pricing';
import Page4Terms from '../templates/pages/Page4Terms';
import ItineraryPages from '../templates/ItineraryPages';
import { useBrochure } from '../context/BrochureContext';
import { PreviewContext } from '../context/PreviewContext';
import SafeAreaOverlay from './SafeAreaOverlay';

const PAGE_W = 816;
const PAGE_H = 1056;

function PreviewWrap({ label, scale, children, showSafeArea }) {
  return (
    <div className="preview-page-wrap">
      <span className="preview-page-label u-print-hidden">{label}</span>
      <div
        className="preview-page-clip"
        style={{
          width: `${PAGE_W * scale}px`,
          height: `${PAGE_H * scale}px`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${PAGE_W}px`,
            height: `${PAGE_H}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {children}
          {showSafeArea && <SafeAreaOverlay />}
        </div>
      </div>
    </div>
  );
}

export default function BrochurePreview() {
  const { state } = useBrochure();
  const { tour, company } = state;
  const panelRef = useRef(null);
  const [scale, setScale] = useState(0.65);
  const [dragMode, setDragMode] = useState(false);
  const [showSafeArea, setShowSafeArea] = useState(false);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const calc = () => {
      const available = el.clientWidth - 48;
      setScale(Math.min(1, Math.max(0.3, available / PAGE_W)));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <PreviewContext.Provider value={{ dragMode, scale }}>
      <div className="preview-panel" ref={panelRef}>

        <div className="preview-panel__toolbar u-print-hidden">
          <button
            type="button"
            className={`preview-toolbar__btn${dragMode ? ' is-active' : ''}`}
            onClick={() => setDragMode(m => !m)}
            title="Toggle drag mode to reposition images by dragging"
          >
            {dragMode ? '✕ Exit Drag Mode' : '⤢ Drag Images'}
          </button>
          <button
            type="button"
            className={`preview-toolbar__btn${showSafeArea ? ' is-active' : ''}`}
            onClick={() => setShowSafeArea(m => !m)}
            title="Show printable safe area margins on each page"
          >
            {showSafeArea ? '✕ Hide Safe Area' : '⬚ Show Safe Area'}
          </button>
          {dragMode && (
            <span className="preview-toolbar__hint">
              Click and drag any image to reposition it
            </span>
          )}
        </div>

        <div className="preview-panel__inner">

          <PreviewWrap label="Page 1 — Cover" scale={scale} showSafeArea={showSafeArea}>
            <Page1Cover tour={tour} company={company} />
          </PreviewWrap>

          <ItineraryPages
            tour={tour}
            company={company}
            renderPage={(pageEl, idx, label) => (
              <PreviewWrap
                key={`itinerary-${idx}`}
                label={`Page ${idx + 2} — ${label}`}
                scale={scale}
                showSafeArea={showSafeArea}
              >
                {pageEl}
              </PreviewWrap>
            )}
          />

          <PreviewWrap label="Pricing & Why Us" scale={scale} showSafeArea={showSafeArea}>
            <Page3Pricing tour={tour} company={company} />
          </PreviewWrap>

          <PreviewWrap label="Terms & Conditions" scale={scale} showSafeArea={showSafeArea}>
            <Page4Terms tour={tour} />
          </PreviewWrap>

        </div>
      </div>
    </PreviewContext.Provider>
  );
}
