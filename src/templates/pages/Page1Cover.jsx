import React from 'react';
import { typoStyle, getTypo } from '../../data/typography';
import { colorVars } from '../../data/colors';
import { positionStyle, getPosition } from '../../data/positions';
import { getImagePosition } from '../../data/imagePositions';
import { getLogo, logoStyle, logoWrapperStyle } from '../../data/logos';
import { useBrochure } from '../../context/BrochureContext';
import DraggableImage from '../components/DraggableImage';

export default function Page1Cover({ tour, company }) {
  const { dispatch } = useBrochure();
  const typo = tour.typography;
  const positions = tour.positions;
  const { grid } = tour.photos;
  const coverLogoStyle = logoStyle(getLogo(tour.logos, 'cover'));

  return (
    <div className="brochure-page" style={colorVars(tour.colors)}>

      {/* Hero text zone */}
      <div className="p1-hero">
        <div className="p1-eyebrow" style={positionStyle(getPosition(positions, 'coverSubtitle'))}>
          <span className="p1-eyebrow-line" />
          <p className="p1-leader" style={typoStyle(getTypo(typo, 'coverSubtitle'))}>
            {tour.leader}
          </p>
          <span className="p1-eyebrow-line" />
        </div>
        <h1 className="p1-title" style={{ ...typoStyle(getTypo(typo, 'coverTitle')), ...positionStyle(getPosition(positions, 'coverTitle')) }}>
          {tour.title}
        </h1>
      </div>

      {/* Destination strip */}
      <div className="p1-strip" style={positionStyle(getPosition(positions, 'destinationStrip'))}>
        {tour.stops.map((stop, i) => (
          <React.Fragment key={i}>
            <span className="p1-stop" style={typoStyle(getTypo(typo, 'destinationStrip'))}>
              {stop}
            </span>
            {i < tour.stops.length - 1 && <span className="p1-sep" aria-hidden="true">◆</span>}
          </React.Fragment>
        ))}
      </div>

      {/* 2×2 photo grid — fills remaining space via flex: 1 */}
      <div className="p1-grid">
        {grid.map((photo, i) => {
          const key = `grid${i}`;
          const pos = getImagePosition(tour.imagePositions, key);
          return (
            <div key={i} className="p1-grid__cell">
              <DraggableImage
                src={photo.src}
                alt={photo.alt || photo.city || `Photo ${i + 1}`}
                className="p1-grid__img"
                position={pos}
                onPositionChange={(v) => dispatch({ type: 'UPDATE_IMAGE_POSITION', key, value: v })}
              />
            </div>
          );
        })}
      </div>

      {/* Tour info bar */}
      <div className="p1-infobar" style={positionStyle(getPosition(positions, 'infoBar'))}>
        <div className="p1-infobar__main">
          <div className="p1-infobar__dates">
            <span
              className="p1-infobar__month"
              style={typoStyle(getTypo(typo, 'infobarMonth'))}
            >
              {tour.dates.month}
            </span>
            <span
              className="p1-infobar__range"
              style={typoStyle(getTypo(typo, 'infobarDateRange'))}
            >
              {tour.dates.range}
            </span>
          </div>
          <div style={logoWrapperStyle('cover')}>
            <img
              src="/logos/cir-logo.png"
              alt="Pax Via Tours & Travel"
              className="p1-infobar__badge"
              style={coverLogoStyle}
            />
          </div>
          <div className="p1-infobar__price-block">
            <span
              className="p1-infobar__price"
              style={typoStyle(getTypo(typo, 'infobarPrice'))}
            >
              {tour.price.display}
            </span>
            <span
              className="p1-infobar__from"
              style={typoStyle(getTypo(typo, 'infobarDeparture'))}
            >
              {tour.departure?.display}
            </span>
          </div>
        </div>
        <div className="p1-infobar__cta">
          <span
            className="p1-infobar__cta-text"
            style={typoStyle(getTypo(typo, 'infobarBookNow'))}
          >
            Book Now at {company.websiteDisplay}
          </span>
        </div>
      </div>

    </div>
  );
}
