import React from 'react';

export default function Page1Cover({ tour, company }) {
  const { grid } = tour.photos;

  return (
    <div className="brochure-page">

      {/* Hero text zone */}
      <div className="p1-hero">
        <div className="p1-eyebrow">
          <span className="p1-eyebrow-line" />
          <p className="p1-leader">{tour.leader}</p>
          <span className="p1-eyebrow-line" />
        </div>
        <h1 className="p1-title">{tour.title}</h1>
      </div>

      {/* Destination strip */}
      <div className="p1-strip">
        {tour.stops.map((stop, i) => (
          <React.Fragment key={i}>
            <span className="p1-stop">{stop}</span>
            {i < tour.stops.length - 1 && <span className="p1-sep" aria-hidden="true">◆</span>}
          </React.Fragment>
        ))}
      </div>

      {/* 2×2 photo grid — fills remaining space via flex: 1 */}
      <div className="p1-grid">
        {grid.map((photo, i) => (
          <div key={i} className="p1-grid__cell">
            <img
              src={photo.src}
              alt={photo.alt || photo.city || `Photo ${i + 1}`}
              className="p1-grid__img"
            />
          </div>
        ))}
      </div>

      {/* Tour info bar */}
      <div className="p1-infobar">
        <div className="p1-infobar__main">
          <div className="p1-infobar__dates">
            <span className="p1-infobar__month">{tour.dates.month}</span>
            <span className="p1-infobar__range">{tour.dates.range}</span>
          </div>
          <img
            src="/logos/pax-via-logo.png"
            alt="Pax Via Tours & Travel"
            className="p1-infobar__badge"
          />
          <div className="p1-infobar__price-block">
            <span className="p1-infobar__price">{tour.price.display}</span>
            <span className="p1-infobar__from">{tour.departure?.display}</span>
          </div>
        </div>
        <div className="p1-infobar__cta">
          <span className="p1-infobar__cta-text">
            Book Now at {company.websiteDisplay}
          </span>
        </div>
      </div>

    </div>
  );
}
