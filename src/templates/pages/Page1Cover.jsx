import React from 'react';
import { typoStyle, getTypo } from '../../data/typography';
import { colorVars } from '../../data/colors';
import { positionStyle, getPosition } from '../../data/positions';
import { getImagePosition } from '../../data/imagePositions';
import { getLogo, logoStyle, logoWrapperStyle } from '../../data/logos';
import { useBrochure } from '../../context/BrochureContext';
import { usePreview } from '../../context/PreviewContext';
import { useSelection } from '../../context/SelectionContext';
import DraggableImage from '../components/DraggableImage';

const FLOAT_TITLE = {
  id: 'tourInfo', label: 'Cover Title', typographyKey: 'coverTitle', positionKey: 'coverTitle',
  getValue: (t) => t.title,
  setValue: (dispatch, val) => dispatch({ type: 'UPDATE_FIELD', field: 'title', value: val }),
};
const FLOAT_SUBTITLE = {
  id: 'tourInfo', label: 'Cover Subtitle', typographyKey: 'coverSubtitle', positionKey: 'coverSubtitle',
  getValue: (t) => t.leader,
  setValue: (dispatch, val) => dispatch({ type: 'UPDATE_FIELD', field: 'leader', value: val }),
};
const FLOAT_PRICE = {
  id: 'tourInfo', label: 'Price', typographyKey: 'infobarPrice', positionKey: 'infoBar',
  getValue: (t) => t.price?.display ?? '',
  setValue: (dispatch, val) => dispatch({ type: 'UPDATE_NESTED', parent: 'price', field: 'display', value: val }),
};
const FLOAT_MONTH = {
  id: 'tourInfo', label: 'Month', typographyKey: 'infobarMonth',
  getValue: (t) => t.dates?.month ?? '',
  setValue: (dispatch, val) => dispatch({ type: 'UPDATE_NESTED', parent: 'dates', field: 'month', value: val }),
};
const FLOAT_DATE_RANGE = {
  id: 'tourInfo', label: 'Date Range', typographyKey: 'infobarDateRange',
  getValue: (t) => t.dates?.range ?? '',
  setValue: (dispatch, val) => dispatch({ type: 'UPDATE_NESTED', parent: 'dates', field: 'range', value: val }),
};
const FLOAT_DEPARTURE = {
  id: 'tourInfo', label: 'Departure', typographyKey: 'infobarDeparture',
  getValue: (t) => t.departure?.display ?? '',
  setValue: (dispatch, val) => dispatch({ type: 'UPDATE_NESTED', parent: 'departure', field: 'display', value: val }),
};
const FLOAT_COVER_LOGO = {
  id: 'logos', label: 'Cover Logo', type: 'logo', logoKey: 'cover',
};

export default function Page1Cover({ tour, company }) {
  const { dispatch } = useBrochure();
  const { dragMode } = usePreview();
  const { selectedId, selectElement, openFloating } = useSelection();
  const hl = (id) => selectedId === id ? ' brochure-element--selected' : '';
  const sel = (id) => dragMode ? {} : {
    'data-sel': id,
    onClick: (e) => { e.stopPropagation(); selectElement(id); },
  };
  const floatSel = (meta) => dragMode ? {} : {
    onClick: (e) => { e.stopPropagation(); openFloating(meta, e); },
  };

  const FLOAT_BOOK_NOW = {
    id: 'tourInfo', label: 'Book Now Text', typographyKey: 'infobarBookNow',
    getValue: (t) => t.bookNowText || `Book Now at ${company.websiteDisplay}`,
    setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'bookNowText', value: val }),
  };

  const typo = tour.typography;
  const positions = tour.positions;
  const { grid } = tour.photos;
  const coverLogo = getLogo(tour.logos, 'cover');
  const coverLogoStyle = logoStyle(coverLogo);
  const portrait = tour.coverPortrait;

  return (
    <div className="brochure-page brochure-page--full" style={colorVars(tour.colors)}>

      {/* Hero text zone */}
      <div className={`p1-hero${hl('tourInfo')}`} {...sel('tourInfo')}>
        <div className="p1-eyebrow" style={positionStyle(getPosition(positions, 'coverSubtitle'))}>
          <span className="p1-eyebrow-line" />
          <p className="p1-leader" style={typoStyle(getTypo(typo, 'coverSubtitle'))} {...floatSel(FLOAT_SUBTITLE)}>
            {tour.leader}
          </p>
          <span className="p1-eyebrow-line" />
        </div>
        <h1 className="p1-title" style={{ ...typoStyle(getTypo(typo, 'coverTitle')), ...positionStyle(getPosition(positions, 'coverTitle')) }} {...floatSel(FLOAT_TITLE)}>
          {tour.title}
        </h1>
      </div>

      {/* Destination strip */}
      <div className={`p1-strip${hl('destinations')}`} style={positionStyle(getPosition(positions, 'destinationStrip'))} {...sel('destinations')}>
        {tour.stops.map((stop, i) => (
          <React.Fragment key={i}>
            <span className="p1-stop" style={typoStyle(getTypo(typo, 'destinationStrip'))}
              {...floatSel({
                id: 'destinations', label: `Stop ${i + 1}`, typographyKey: 'destinationStrip',
                getValue: (t) => t.stops[i] ?? '',
                setValue: (d, val) => d({ type: 'UPDATE_STOP', index: i, value: val }),
              })}
            >
              {stop}
            </span>
            {i < tour.stops.length - 1 && <span className="p1-sep" aria-hidden="true">◆</span>}
          </React.Fragment>
        ))}
      </div>

      {/* 2×2 photo grid — fills remaining space via flex: 1 */}
      <div className={`p1-grid${hl('images')}`} {...sel('images')}>
        {grid.map((photo, i) => {
          const key = `grid${i}`;
          const pos = getImagePosition(tour.imagePositions, key);
          return (
            <div key={i} className="p1-grid__cell"
              {...floatSel({
                id: 'images', label: `Cover Photo ${i + 1}`, type: 'image', imagePositionKey: key,
                getSrc: (t) => t.photos.grid[i]?.src ?? '',
                setSrc: (d, val) => d({ type: 'UPDATE_GRID_PHOTO', index: i, value: val }),
              })}
            >
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

        {/* Portrait overlay — explicit grid-column/row 1/-1 anchors it to the full
            grid area so position:absolute always resolves to the grid container,
            not an auto-placed single cell (cross-browser fix). */}
        <div className="p1-grid__portrait-layer">
          {portrait?.src && (
            <div
              className={`p1-portrait${hl('portrait')}`}
              style={{
                transform: `translate(calc(-50% + ${portrait.x ?? 0}px), calc(-50% + ${portrait.y ?? 0}px))`,
              }}
              {...sel('portrait')}
            >
              <img
                src={portrait.src}
                alt=""
                className="p1-portrait__img"
                style={{
                  width:  `${portrait.size ?? 160}px`,
                  height: `${portrait.size ?? 160}px`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tour info bar */}
      <div className={`p1-infobar${hl('tourInfo')}`} style={positionStyle(getPosition(positions, 'infoBar'))} {...sel('tourInfo')}>
        <div className="p1-infobar__main">
          <div className="p1-infobar__dates">
            <span
              className="p1-infobar__month"
              style={typoStyle(getTypo(typo, 'infobarMonth'))}
              {...floatSel(FLOAT_MONTH)}
            >
              {tour.dates.month}
            </span>
            <span
              className="p1-infobar__range"
              style={typoStyle(getTypo(typo, 'infobarDateRange'))}
              {...floatSel(FLOAT_DATE_RANGE)}
            >
              {tour.dates.range}
            </span>
          </div>
          <div
            style={logoWrapperStyle('cover')}
            className={selectedId === 'logos' ? 'brochure-element--selected' : undefined}
            {...floatSel(FLOAT_COVER_LOGO)}
          >
            <img
              src={coverLogo.src ?? '/logos/cir-logo.png'}
              alt="Pax Via Tours & Travel"
              className="p1-infobar__badge"
              style={coverLogoStyle}
            />
          </div>
          <div className="p1-infobar__price-block">
            <span
              className="p1-infobar__price"
              style={typoStyle(getTypo(typo, 'infobarPrice'))}
              {...floatSel(FLOAT_PRICE)}
            >
              {tour.price.display}
            </span>
            <span
              className="p1-infobar__from"
              style={typoStyle(getTypo(typo, 'infobarDeparture'))}
              {...floatSel(FLOAT_DEPARTURE)}
            >
              {tour.departure?.display}
            </span>
          </div>
        </div>
        <div className="p1-infobar__cta">
          <span
            className="p1-infobar__cta-text"
            style={typoStyle(getTypo(typo, 'infobarBookNow'))}
            {...floatSel(FLOAT_BOOK_NOW)}
          >
            {tour.bookNowText || `Book Now at ${company.websiteDisplay}`}
          </span>
        </div>
      </div>

    </div>
  );
}
