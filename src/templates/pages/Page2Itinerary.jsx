import React from 'react';
import { typoStyle, getTypo } from '../../data/typography';
import { colorVars } from '../../data/colors';
import { positionStyle, getPosition } from '../../data/positions';
import { getLogo, logoStyle, logoWrapperStyle } from '../../data/logos';

export default function Page2Itinerary({ tour, company, days, isFirstPage = true, colBreakIdx, daySpacing, pageScale = 1, gridColH = null, availableColH = null }) {
  const typo = tour.typography;
  const positions = tour.positions;
  const headingStyle      = typoStyle(getTypo(typo, 'itineraryHeading'));
  const bodyStyle         = typoStyle(getTypo(typo, 'itineraryBody'));
  const navbarStyle       = typoStyle(getTypo(typo, 'navbar'));
  const footerContactStyle = typoStyle(getTypo(typo, 'footerContact'));
  const navbarLogoStyle    = logoStyle(getLogo(tour.logos, 'navbar'));

  // days: the subset of itinerary days for this specific page.
  const pageDays = days ?? tour.itinerary;

  // colBreakIdx: the day index (within pageDays) that starts column 2.
  const breakAt = colBreakIdx ?? Math.ceil(pageDays.length / 2);

  return (
    <div className="brochure-page" style={colorVars(tour.colors)}>

      <div className="pg-header">
        <span className="pg-header__text" style={navbarStyle}>
          {company.name.toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;{tour.titleShort}
        </span>
        <div style={logoWrapperStyle('navbar')}>
          <img src="/logos/cir-logo.png" alt="Pax Via" className="pg-header__logo" style={navbarLogoStyle} />
        </div>
      </div>

      <div
        className="p2-body"
        style={{
          ...positionStyle(getPosition(positions, 'itinerary')),
          overflow: pageScale < 1 ? 'visible' : undefined,
        }}
      >
        {isFirstPage && (
          <header className="p2-section-header">
            <p className="p2-eyebrow">Pilgrimage Route</p>
            <h2 className="p2-heading">Day by Day Itinerary</h2>
          </header>
        )}

        <div
          className={`p2-grid${isFirstPage ? '' : ' p2-grid--full'}`}
          style={
            pageScale < 1 && gridColH
              ? {
                  // scaleY mode: full layout height for CSS columns, then compressed visually.
                  // Visual bottom = gridColH * pageScale = availableColH (fits within body).
                  height:          `${gridColH}px`,
                  transform:       `scaleY(${pageScale.toFixed(5)})`,
                  transformOrigin: 'top left',
                }
              : availableColH
              ? {
                  // Normal mode: use the measured available height instead of CSS calc fallback.
                  height: `${availableColH}px`,
                }
              : undefined
          }
        >
          {pageDays.map((day, index) => (
            <div
              key={day.day ?? index}
              className={`p2-day${index === breakAt ? ' p2-day--col-break' : ''}`}
              style={daySpacing != null ? { paddingBlock: daySpacing } : undefined}
            >
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
        <span className="pg-footer__text" style={footerContactStyle}>Tour Code: {tour.tourCode}</span>
        <span className="pg-footer__text" style={footerContactStyle}>
          {company.name}&nbsp;&nbsp;·&nbsp;&nbsp;{company.phone}&nbsp;&nbsp;·&nbsp;&nbsp;{company.email}
        </span>
      </div>

    </div>
  );
}
