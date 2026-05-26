import React, { useRef, useEffect, useState } from 'react';
import Page1Cover from '../templates/pages/Page1Cover';
import Page3Pricing from '../templates/pages/Page3Pricing';
import Page4Terms from '../templates/pages/Page4Terms';
import ItineraryPages from '../templates/ItineraryPages';
import { useBrochure } from '../context/BrochureContext';

const PAGE_W = 816;
const PAGE_H = 1056;

function PreviewWrap({ label, scale, children }) {
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
    <div className="preview-panel" ref={panelRef}>
      <div className="preview-panel__inner">

        <PreviewWrap label="Page 1 — Cover" scale={scale}>
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
            >
              {pageEl}
            </PreviewWrap>
          )}
        />

        <PreviewWrap label="Pricing & Why Us" scale={scale}>
          <Page3Pricing tour={tour} company={company} />
        </PreviewWrap>

        <PreviewWrap label="Terms & Conditions" scale={scale}>
          <Page4Terms tour={tour} />
        </PreviewWrap>

      </div>
    </div>
  );
}
