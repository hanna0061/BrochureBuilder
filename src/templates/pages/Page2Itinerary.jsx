import React from 'react';

export default function Page2Itinerary({ tour, company, days, isFirstPage = true, colBreakIdx }) {
  // days: the subset of itinerary days for this specific page.
  // Falls back to full itinerary for backward-compatibility.
  const pageDays = days ?? tour.itinerary;

  // colBreakIdx: the day index (within pageDays) that starts column 2.
  // Falls back to midpoint if not provided.
  const breakAt = colBreakIdx ?? Math.ceil(pageDays.length / 2);

  return (
    <div className="brochure-page">

      <div className="pg-header">
        <span className="pg-header__text">
          {company.name.toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;{tour.titleShort}
        </span>
        <img src="/logos/pax-via-logo.png" alt="Pax Via" className="pg-header__logo" />
      </div>

      <div className="p2-body">
        {isFirstPage && (
          <header className="p2-section-header">
            <p className="p2-eyebrow">Pilgrimage Route</p>
            <h2 className="p2-heading">Day by Day Itinerary</h2>
          </header>
        )}

        {/* p2-grid--full removes the section-header height offset on continuation pages */}
        <div className={`p2-grid${isFirstPage ? '' : ' p2-grid--full'}`}>
          {pageDays.map((day, index) => (
            <div
              key={day.day ?? index}
              className={`p2-day${index === breakAt ? ' p2-day--col-break' : ''}`}
            >
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
                      <>
                        <span className="p2-overnight-lbl">Overnight:</span>{' '}
                        {day.overnight}
                      </>
                    )}
                    {day.overnight && day.meals && '  ·  '}
                    {day.meals && (
                      <>
                        <span className="p2-overnight-lbl">Meals:</span>{' '}
                        {day.meals}
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pg-footer">
        <span className="pg-footer__text">Tour Code: {tour.tourCode}</span>
        <span className="pg-footer__text">
          {company.name}&nbsp;&nbsp;·&nbsp;&nbsp;{company.phone}&nbsp;&nbsp;·&nbsp;&nbsp;{company.email}
        </span>
      </div>

    </div>
  );
}
