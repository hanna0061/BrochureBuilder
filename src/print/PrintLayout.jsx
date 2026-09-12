import React from 'react';
import Page1Cover from '../templates/pages/Page1Cover';
import Page3Pricing from '../templates/pages/Page3Pricing';
import Page4Terms from '../templates/pages/Page4Terms';
import ItineraryPages from '../templates/ItineraryPages';
import { useBrochure } from '../context/BrochureContext';

export default function PrintLayout({ printRef }) {
  const { state } = useBrochure();
  const { tour, company, terms } = state;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: '-99999px',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <div ref={printRef}>

        <div className="print-page">
          <Page1Cover tour={tour} company={company} terms={terms} />
        </div>

        <ItineraryPages
          tour={tour}
          company={company}
          renderPage={(pageEl, idx) => (
            <div key={`itin-print-${idx}`} className="print-page">
              {pageEl}
            </div>
          )}
        />

        <div className="print-page">
          <Page3Pricing tour={tour} company={company} terms={terms} />
        </div>

        <div className="print-page print-page--last">
          <Page4Terms tour={tour} company={company} terms={terms} />
        </div>

      </div>
    </div>
  );
}
