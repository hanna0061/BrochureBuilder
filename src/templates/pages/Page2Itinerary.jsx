import React from 'react';
import { typoStyle, getTypo } from '../../data/typography';
import { colorVars } from '../../data/colors';
import { positionStyle, getPosition } from '../../data/positions';
import { useSelection } from '../../context/SelectionContext';
import TextgramLayer from '../components/TextgramLayer';

// Applies per-element position as CSS transform (for label, body, overnight, meals).
// When per-day x/y is set: strips global transform and replaces with per-day translate.
// When per-day x/y is (0,0): returns baseStyle unchanged, preserving any global transform.
function perDayStyle(baseStyle, pos) {
  const x = pos?.x ?? 0;
  const y = pos?.y ?? 0;
  if (x === 0 && y === 0) return baseStyle;
  const { transform: _global, ...fontProps } = baseStyle;
  return { ...fontProps, transform: `translate(${x}px, ${y}px)` };
}

// Heading-specific variant: uses position:relative + left/top instead of transform.
// The heading span has `overflow-wrap:break-word; word-break:break-word` which causes
// the browser to create fragmented inline line-boxes inside the CSS column context.
// CSS transform on fragmented inline boxes in column-count:2 produces no visual offset
// (computed style shows the value but the element does not move).
// position:relative shifts inline elements correctly in all fragmentation contexts.
function headingPerDayStyle(baseStyle, pos) {
  const x = pos?.x ?? 0;
  const y = pos?.y ?? 0;
  if (x === 0 && y === 0) return baseStyle;
  const { transform: _global, ...fontProps } = baseStyle;
  return { ...fontProps, position: 'relative', left: `${x}px`, top: `${y}px` };
}

// Default text for the bottom black info box. Stored per-tour as
// itineraryInfoLine1..3 so each line is editable from the floating editor.
export const P2_INFO_DEFAULTS = {
  itineraryInfoLine1: 'Tour Number: SFO-0411-13D',
  itineraryInfoLine2: 'Pax Via Tours and Travel - info@paxvia.com',
  itineraryInfoLine3: 'Tel (844) 218-8162',
};
const P2_INFO_FIELDS = Object.keys(P2_INFO_DEFAULTS);

/**
 * Page 2 right-column footer: "*Time Permitting" footnote + solid black info box.
 * Pinned to the inner bottom-right corner of the Page 2 frame, one right-column
 * width wide, so it sits under the RIGHT itinerary column (see .p2-footer). Also
 * rendered off-screen by ItineraryPages so its real height is reserved in the
 * right column's spacing math only — the right column's days end above it,
 * and the left column keeps its full height.
 * `floatSel` is omitted for the off-screen measurement copy.
 */
export function Page2Footer({ tour, floatSel = () => ({}) }) {
  const footnoteStyle = typoStyle(getTypo(tour.typography, 'itineraryFootnote'));
  const infoStyle     = typoStyle(getTypo(tour.typography, 'itineraryInfoBox'));
  const footnote      = (tour.footnotes ?? []).join('  ');

  return (
    <footer className="p2-footer">
      {footnote && (
        <p className="p2-footnote" style={footnoteStyle}
          {...floatSel({
            id: 'itinerary', label: 'Footnote', typographyKey: 'itineraryFootnote',
            getValue: (t) => (t.footnotes ?? []).join('  '),
            setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'footnotes', value: val ? [val] : [] }),
          })}
        >{footnote}</p>
      )}
      <div className="p2-infobox">
        {P2_INFO_FIELDS.map((field, i) => (
          <p key={field} className="p2-infobox__line" style={infoStyle}
            {...floatSel({
              id: 'itinerary', label: `Info Box Line ${i + 1}`, typographyKey: 'itineraryInfoBox',
              getValue: (t) => t[field] ?? P2_INFO_DEFAULTS[field],
              setValue: (d, val) => d({ type: 'UPDATE_FIELD', field, value: val }),
            })}
          >{tour[field] ?? P2_INFO_DEFAULTS[field]}</p>
        ))}
      </div>
    </footer>
  );
}

export default function Page2Itinerary({ tour, company, days, isFirstPage = true, colBreakIdx, daySpacing, daySpacingCol2 = null, pageScale = 1, gridColH = null, availableColH = null }) {
  const typo = tour.typography;
  const { selectedId, selectElement, openFloating } = useSelection();
  const hl = (id) => selectedId === id ? ' brochure-element--selected' : '';
  const sel = (id) => ({ 'data-sel': id, onClick: (e) => { e.stopPropagation(); selectElement(id); } });
  const floatSel = (meta) => ({
    onClick: (e) => { e.stopPropagation(); openFloating(meta, e); },
  });
  const positions = tour.positions;

  const titleStyle         = typoStyle(getTypo(typo, 'itineraryTitle'));
  const subtitleStyle      = typoStyle(getTypo(typo, 'itinerarySubtitle'));
  const dayLabelStyle      = typoStyle(getTypo(typo, 'itineraryDayLabel'));
  const headingStyle       = typoStyle(getTypo(typo, 'itineraryHeading'));
  const bodyStyle          = typoStyle(getTypo(typo, 'itineraryBody'));
  const overnightStyle     = typoStyle(getTypo(typo, 'itineraryOvernight'));
  const mealsStyle         = typoStyle(getTypo(typo, 'itineraryMeals'));

  const pageDays = days ?? tour.itinerary;
  const breakAt  = colBreakIdx ?? Math.ceil(pageDays.length / 2);
  const col1Days = pageDays.slice(0, breakAt);
  const col2Days = pageDays.slice(breakAt);

  // Renders one day card. Called for each column separately so column-specific
  // spacing (sp) is pre-resolved before the call.
  const renderDay = (day, gi, sp) => {
    const pos     = day.positions ?? {};
    const elemPos = (field) => pos[field] ?? { x: 0, y: 0 };
    const getEP   = (field) => (t) => t.itinerary[gi]?.positions?.[field] ?? { x: 0, y: 0 };
    const setEP   = (field) => (d, axis, value) => d({ type: 'UPDATE_ITINERARY_ELEMENT_POS', index: gi, field, axis, value });
    const resetEP = (field) => (d) => d({ type: 'RESET_ITINERARY_ELEMENT_POS', index: gi, field });

    return (
      <div
        key={day.day ?? gi}
        className="p2-day"
        style={sp != null ? { paddingBlock: sp } : undefined}
      >
        <p className="p2-day__title-line">
          <span
            className="p2-day__label"
            style={headingPerDayStyle(dayLabelStyle, elemPos('label'))}
            {...floatSel({
              id: 'itinerary', label: `Day ${day.day} Label`, typographyKey: 'itineraryDayLabel',
              getValue: (t) => t.itinerary[gi]?.label ?? '',
              setValue: (d, val) => d({ type: 'UPDATE_ITINERARY_DAY', index: gi, field: 'label', value: val }),
              getElemPos: getEP('label'), setElemPos: setEP('label'), resetElemPos: resetEP('label'),
            })}
          >{day.label}:</span>
          {' '}
          <span
            className="p2-day__heading"
            style={headingPerDayStyle(headingStyle, elemPos('heading'))}
            {...floatSel({
              id: 'itinerary', label: `Day ${day.day} Heading`, typographyKey: 'itineraryHeading',
              getValue: (t) => t.itinerary[gi]?.heading ?? '',
              setValue: (d, val) => d({ type: 'UPDATE_ITINERARY_DAY', index: gi, field: 'heading', value: val }),
              getElemPos: getEP('heading'), setElemPos: setEP('heading'), resetElemPos: resetEP('heading'),
            })}
          >{day.heading}</span>
        </p>
        <p
          className="p2-day__body"
          style={perDayStyle(bodyStyle, elemPos('body'))}
          {...floatSel({
            id: 'itinerary', label: `Day ${day.day} Body`, typographyKey: 'itineraryBody', textRows: 4,
            getValue: (t) => t.itinerary[gi]?.body ?? '',
            setValue: (d, val) => d({ type: 'UPDATE_ITINERARY_DAY', index: gi, field: 'body', value: val }),
            getElemPos: getEP('body'), setElemPos: setEP('body'), resetElemPos: resetEP('body'),
          })}
        >{day.body}</p>
        {(day.overnight || day.meals) && (
          <p className="p2-day__overnight">
            {day.overnight && (
              <span style={{ display: 'inline-block', ...perDayStyle(overnightStyle, elemPos('overnight')) }}>
                <span className="p2-overnight-lbl">Overnight:</span>{' '}
                <span
                  {...floatSel({
                    id: 'itinerary', label: `Day ${day.day} Overnight`, typographyKey: 'itineraryOvernight',
                    getValue: (t) => t.itinerary[gi]?.overnight ?? '',
                    setValue: (d, val) => d({ type: 'UPDATE_ITINERARY_DAY', index: gi, field: 'overnight', value: val }),
                    getElemPos: getEP('overnight'), setElemPos: setEP('overnight'), resetElemPos: resetEP('overnight'),
                  })}
                >{day.overnight}</span>
              </span>
            )}
            {day.overnight && day.meals && '  ·  '}
            {day.meals && (
              <span style={{ display: 'inline-block', ...perDayStyle(mealsStyle, elemPos('meals')) }}>
                <span className="p2-overnight-lbl">Meals:</span>{' '}
                <span
                  {...floatSel({
                    id: 'itinerary', label: `Day ${day.day} Meals`, typographyKey: 'itineraryMeals',
                    getValue: (t) => t.itinerary[gi]?.meals ?? '',
                    setValue: (d, val) => d({ type: 'UPDATE_ITINERARY_DAY', index: gi, field: 'meals', value: val }),
                    getElemPos: getEP('meals'), setElemPos: setEP('meals'), resetElemPos: resetEP('meals'),
                  })}
                >{day.meals}</span>
              </span>
            )}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="brochure-page brochure-page--full brochure-page--itinerary" style={colorVars(tour.colors)}>

      {/* Page 2 frame. The right-column footer is its child, pinned to the
          frame's inner bottom-right corner so the box shares the frame's edges. */}
      <div className="p2-frame">
        <Page2Footer tour={tour} floatSel={floatSel} />
      </div>

      <div
        className={`p2-body${hl('itinerary')}`}
        style={{ ...positionStyle(getPosition(positions, 'itinerary')) }}
        {...sel('itinerary')}
      >
        {isFirstPage && (
          <header className="p2-section-header">
            <p className="p2-eyebrow" style={subtitleStyle}
              {...floatSel({
                id: 'itinerary', label: 'Section Subtitle', typographyKey: 'itinerarySubtitle',
                getValue: (t) => t.itinerarySubtitleText ?? 'Pilgrimage Route',
                setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'itinerarySubtitleText', value: val }),
              })}
            >{tour.itinerarySubtitleText ?? 'Pilgrimage Route'}</p>
            <h2 className="p2-heading" style={titleStyle}
              {...floatSel({
                id: 'itinerary', label: 'Section Title', typographyKey: 'itineraryTitle',
                getValue: (t) => t.itineraryTitleText ?? 'Day by Day Itinerary',
                setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'itineraryTitleText', value: val }),
              })}
            >{tour.itineraryTitleText ?? 'Day by Day Itinerary'}</h2>
          </header>
        )}

        {/* Explicit two-column flex layout — engine-safe replacement for column-count.
            The JS-computed breakAt index pre-determines which days go in each column
            so no print engine needs to run a column-balance algorithm. */}
        <div
          className={`p2-grid${isFirstPage ? '' : ' p2-grid--full'}`}
          style={availableColH ? { height: `${availableColH}px` } : undefined}
        >
          <div className="p2-col">
            {col1Days.map((day) => {
              const gi = tour.itinerary.findIndex(d => d.day === day.day);
              return renderDay(day, gi, daySpacing);
            })}
          </div>
          <div className="p2-col">
            {col2Days.map((day) => {
              const gi = tour.itinerary.findIndex(d => d.day === day.day);
              return renderDay(day, gi, daySpacingCol2 ?? daySpacing);
            })}
          </div>
        </div>
      </div>

      <TextgramLayer page="itinerary" />

    </div>
  );
}
