import React from 'react';
import { typoStyle, getTypo } from '../data/typography';
import { colorVars } from '../data/colors';
import { getImagePosition } from '../data/imagePositions';
import { useBrochure } from '../context/BrochureContext';
import { usePreview } from '../context/PreviewContext';
import { useSelection } from '../context/SelectionContext';
import DraggableImage from './components/DraggableImage';
import TextgramLayer from './components/TextgramLayer';
// Supplied gold outline calendar (512×512 transparent PNG), used as-is.
import calendarIconSrc from '../assets/p1alt-calendar-outline.png';

// "Design 2 — Mexico City": a full-bleed photographic cover, visually
// reproducing Pax_Via_Mexico_City_Guadalupe_Cover_8.5x11.pdf as a REUSABLE
// TEMPLATE — every word on the page comes from the current tour's data,
// not hard-coded Mexico City copy. Reuses the same tour fields as the
// classic Page1Cover (title, leader, dates, departure, price, stops,
// duration) plus two Design-2-only fields — tour.spiritualDirector and
// tour.page1Design2Qr — for the director line and the cover QR slot. The
// background reuses photos.grid[0] / imagePositions.grid0 so it stays
// editable through the existing Images sidebar section instead of a
// second image system.
//
// EVERY text element below carries its own *Alt typography key (see
// TYPOGRAPHY_DEFAULTS in data/typography.js) so the floating editor's
// font/weight/size/color controls work on Design 2 exactly like they do
// everywhere else in the app, without ever sharing state with Design 1's
// coverTitle/coverSubtitle/infobar* keys. Elements with no tour field
// backing them (eyebrow, the director label phrase, the tagline) omit getValue/setValue so the panel shows typography
// controls only, not a text box with nothing real to save.

// Overflow protection for the large display title/secondary-title/subtitle
// is handled by plain CSS (.p1alt-title-primary/-secondary/.p1alt-subtitle
// all set max-width:100% + overflow-wrap:break-word, same as Design 1's
// .p1-title), NOT a JS measure-and-shrink function. An earlier version of
// this file used a canvas-measurement "fitFontSize" helper that silently
// capped every long title at the same fitted size no matter how large the
// manager set it via the floating editor — the shrink ratio it computed
// canceled out any increase to the stored font size once the text no
// longer fit on one line, so "increase font size" visibly did nothing.
// Letting the browser wrap the title across lines (and, in the pathological
// case of one unbreakably long word, break mid-word) is both simpler and
// actually respects the size the manager chooses; the fixed-size, clipped
// .brochure-page/.p1alt-page boxes remain the outer safety net that keeps
// everything on the 816×1056 canvas.

// Metadata line: the manager's own text (tour.page1Design2Meta) once they've
// edited it in the floating editor, otherwise the line derived from the
// tour's duration + first stop. Module-level so the floating editor's
// getValue reads the same text the page renders, from the live tour.
function getMetaLine(tour) {
  if (tour.page1Design2Meta != null) return tour.page1Design2Meta;
  const durationDays = tour.duration?.days;
  const metaDestination = tour.stops?.[0] || tour.titleShort || '';
  return [
    durationDays ? `${durationDays} Days` : tour.duration?.display,
    'Catholic Pilgrimage',
    metaDestination,
  ].filter(Boolean).join('  •  ');
}

const PlaneIcon = () => (
  <svg width="31" height="31" viewBox="2 2 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2.5 1.5V22l4-1 4 1v-1.5L13 19v-5.5l8 2.5z"
      fill="currentColor"
    />
  </svg>
);

export default function Page1Design2({ tour, company }) {
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

  const FLOAT_EYEBROW = {
    id: 'tourInfo', label: 'Eyebrow', typographyKey: 'eyebrowAlt',
  };
  const FLOAT_TITLE = {
    id: 'tourInfo', label: 'Cover Title', typographyKey: 'coverTitleAlt',
    // Design 2's title default (100px) already exceeds the shared 6-72px
    // slider range every other typography field uses — this opts just
    // this one field into a taller ceiling so it can actually be
    // increased further, per the floating editor's fontSizeMax support.
    fontSizeMax: 160,
    getValue: (t) => t.title,
    setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'title', value: val }),
  };
  const FLOAT_TITLE_SECONDARY = {
    id: 'tourInfo', label: 'Secondary Title', typographyKey: 'coverTitleSecondaryAlt',
    fontSizeMax: 120,
  };
  const FLOAT_SUBTITLE = {
    id: 'tourInfo', label: 'Cover Subtitle', typographyKey: 'coverSubtitleAlt',
    getValue: (t) => t.leader,
    setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'leader', value: val }),
  };
  const FLOAT_DIRECTOR_LABEL = {
    id: 'tourInfo', label: 'Spiritual Direction Label', typographyKey: 'directorLabelAlt',
  };
  const FLOAT_DIRECTOR_NAME = {
    id: 'tourInfo', label: 'Spiritual Director', typographyKey: 'directorNameAlt',
    getValue: (t) => t.spiritualDirector,
    setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'spiritualDirector', value: val }),
  };
  const FLOAT_MONTH = {
    id: 'tourInfo', label: 'Date', typographyKey: 'infobarDateAlt',
    getValue: (t) => t.dates?.month ?? '',
    setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'dates', field: 'month', value: val }),
  };
  const FLOAT_DATE_RANGE = {
    id: 'tourInfo', label: 'Date', typographyKey: 'infobarDateAlt',
    getValue: (t) => t.dates?.range ?? '',
    setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'dates', field: 'range', value: val }),
  };
  const FLOAT_FROM_LABEL = {
    id: 'tourInfo', label: 'From Label', typographyKey: 'infobarFromLabelAlt',
  };
  const FLOAT_AIRPORT = {
    id: 'tourInfo', label: 'Departure Airport', typographyKey: 'infobarAirportAlt',
    getValue: (t) => t.departure?.airport ?? '',
    setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'departure', field: 'airport', value: val }),
  };
  const FLOAT_PRICE = {
    id: 'tourInfo', label: 'Price', typographyKey: 'infobarPriceAlt',
    getValue: (t) => t.price?.display ?? '',
    setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'price', field: 'display', value: val }),
  };
  const FLOAT_META = {
    id: 'tourInfo', label: 'Metadata Line', typographyKey: 'metaAlt',
    getValue: (t) => getMetaLine(t),
    setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'page1Design2Meta', value: val }),
  };
  const FLOAT_TAGLINE = {
    id: 'tourInfo', label: 'Travel in Peace', typographyKey: 'taglineAlt',
  };
  const FLOAT_QR = {
    id: 'images', label: 'QR Code', type: 'qr',
    getSrc: (t) => t.page1Design2Qr?.src ?? '',
    setSrc: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'page1Design2Qr', field: 'src', value: val }),
    getSize: (t) => t.page1Design2Qr?.size ?? 60,
    setSize: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'page1Design2Qr', field: 'size', value: val }),
  };

  const typo = tour.typography;
  const bgPos = getImagePosition(tour.imagePositions, 'grid0');
  const bgPhoto = tour.photos?.grid?.[0];
  const qr = tour.page1Design2Qr ?? { src: null, size: 60 };
  // Split a leading "$" into its own span (render-only; the stored price
  // string is untouched) so it can be raised relative to the digits.
  const priceDisplay = tour.price?.display ?? '';

  const titleLines = (tour.title || '').split('\n');
  const titlePrimary = titleLines[0] || '';
  const titleSecondary = titleLines.slice(1).join(' ');

  const metaLine = getMetaLine(tour);

  // Design 2's title/subtitle are large display type — their family,
  // weight, size, color and letter-spacing are all fully editable via the
  // same floating panel Design 1 uses (typographyKey:
  // coverTitleAlt/coverTitleSecondaryAlt/coverSubtitleAlt), with the
  // stored fontSize applied directly (see the note above the icons for
  // why — CSS wrap/break-word is the overflow safety net, not a JS
  // measure-and-shrink step that would cancel out size increases).
  const coverTitleTypo = getTypo(typo, 'coverTitleAlt');
  const coverTitleSecondaryTypo = getTypo(typo, 'coverTitleSecondaryAlt');
  const coverSubtitleTypo = getTypo(typo, 'coverSubtitleAlt');
  const eyebrowTypo = getTypo(typo, 'eyebrowAlt');
  const directorLabelTypo = getTypo(typo, 'directorLabelAlt');
  const directorNameTypo = getTypo(typo, 'directorNameAlt');
  const dateTypo = getTypo(typo, 'infobarDateAlt');
  const fromLabelTypo = getTypo(typo, 'infobarFromLabelAlt');
  const airportTypo = getTypo(typo, 'infobarAirportAlt');
  const priceTypo = getTypo(typo, 'infobarPriceAlt');
  const metaTypo = getTypo(typo, 'metaAlt');
  const taglineTypo = getTypo(typo, 'taglineAlt');

  return (
    <div className="brochure-page brochure-page--full p1alt-page" style={colorVars(tour.colors)}>

      {/* Full-bleed background photo — reuses existing Cover Photo 1 field/workflow */}
      <div className={`p1alt-bg-layer${hl('images')}`} {...sel('images')}
        {...floatSel({
          id: 'images', label: 'Cover Background Photo', type: 'image', imagePositionKey: 'grid0',
          getSrc: (t) => t.photos.grid[0]?.src ?? '',
          setSrc: (d, val) => d({ type: 'UPDATE_GRID_PHOTO', index: 0, value: val }),
        })}
      >
        <DraggableImage
          src={bgPhoto?.src}
          alt={bgPhoto?.alt || 'Cover background'}
          position={bgPos}
          onPositionChange={(v) => dispatch({ type: 'UPDATE_IMAGE_POSITION', key: 'grid0', value: v })}
        />
      </div>

      <div className="p1alt-top-veil" aria-hidden="true" />
      <div className="p1alt-bottom-veil" aria-hidden="true" />

      {/* Hero text zone */}
      <div className={`p1alt-hero${hl('tourInfo')}`} {...sel('tourInfo')}>
        <p className="p1alt-eyebrow" style={typoStyle(eyebrowTypo)} {...floatSel(FLOAT_EYEBROW)}>
          A Catholic Pilgrimage To
        </p>

        <h1
          className="p1alt-title-primary"
          style={typoStyle(coverTitleTypo)}
          {...floatSel(FLOAT_TITLE)}
        >
          {titlePrimary}
        </h1>
        {titleSecondary && (
          <p
            className="p1alt-title-secondary"
            style={typoStyle(coverTitleSecondaryTypo)}
            {...floatSel(FLOAT_TITLE_SECONDARY)}
          >
            {titleSecondary}
          </p>
        )}

        <div className="p1alt-subtitle-row">
          <span className="p1alt-subtitle-line" />
          <p
            className="p1alt-subtitle"
            style={typoStyle(coverSubtitleTypo)}
            {...floatSel(FLOAT_SUBTITLE)}
          >
            {tour.leader}
          </p>
          <span className="p1alt-subtitle-line" />
        </div>
      </div>

      {/* Bottom info zone, over the dark gradient veil */}
      <div className={`p1alt-bottom${hl('tourInfo')}`} {...sel('tourInfo')}>
        <p className="p1alt-director">
          <span className="p1alt-director-label" style={typoStyle(directorLabelTypo)} {...floatSel(FLOAT_DIRECTOR_LABEL)}>
            Under the Spiritual Direction of
          </span>
          <strong className="p1alt-director-name" style={typoStyle(directorNameTypo)} {...floatSel(FLOAT_DIRECTOR_NAME)}>
            {tour.spiritualDirector}
          </strong>
        </p>

        <div className="p1alt-infobar">
          <div className="p1alt-infobar__item p1alt-infobar__item--dates">
            <span className="p1alt-infobar__icon"><img className="p1alt-infobar__calendar" src={calendarIconSrc} alt="" /></span>
            <span className="p1alt-infobar__date">
              <span style={typoStyle(dateTypo)} {...floatSel(FLOAT_MONTH)}>{tour.dates?.month}</span>{' '}
              <span style={typoStyle(dateTypo)} {...floatSel(FLOAT_DATE_RANGE)}>{tour.dates?.range}</span>
            </span>
          </div>

          <div className="p1alt-infobar__item p1alt-infobar__item--departure">
            <span className="p1alt-infobar__icon"><PlaneIcon /></span>
            <span>
              <span className="p1alt-infobar__label" style={typoStyle(fromLabelTypo)} {...floatSel(FLOAT_FROM_LABEL)}>From</span>
              <span className="p1alt-infobar__airport" style={typoStyle(airportTypo)} {...floatSel(FLOAT_AIRPORT)}>{tour.departure?.airport}</span>
            </span>
          </div>

          <div className="p1alt-infobar__item p1alt-infobar__item--price">
            <span className="p1alt-infobar__price" style={typoStyle(priceTypo)} {...floatSel(FLOAT_PRICE)}>
              {priceDisplay.startsWith('$')
                ? <><span className="p1alt-infobar__price-currency">$</span>{priceDisplay.slice(1)}</>
                : priceDisplay}
            </span>
          </div>
        </div>

        <div className="p1alt-divider" />

        <p className="p1alt-meta" style={typoStyle(metaTypo)} {...floatSel(FLOAT_META)}>{metaLine}</p>
        <div className="p1alt-tagline-rule" aria-hidden="true" />
        <p className="p1alt-tagline" style={typoStyle(taglineTypo)} {...floatSel(FLOAT_TAGLINE)}>Travel in Peace.</p>

        {/* QR slot — fixed anchor position/footprint (never moves the
            director/date/price/meta/tagline flow above); the visual layer
            inside grows/shrinks from the anchor's own center via
            translate(-50%,-50%), the same decoupled anchor-vs-visual
            pattern Registration Form's QR already uses. Empty placeholder
            is editor/preview-only — hidden in print via CSS. */}
        <div
          className={`p1alt-qr-slot${hl('images')}${qr.src ? '' : ' p1alt-qr-slot--empty'}`}
          {...floatSel(FLOAT_QR)}
        >
          <div className="p1alt-qr-visual" style={{ width: qr.size ?? 60, height: qr.size ?? 60 }}>
            {qr.src
              ? <img src={qr.src} alt="QR code" />
              : <span className="p1alt-qr-slot__label">QR</span>
            }
          </div>
        </div>
      </div>

      <TextgramLayer page="cover" />

    </div>
  );
}
