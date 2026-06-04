import React from 'react';
import { typoStyle, getTypo } from '../../data/typography';
import { colorVars } from '../../data/colors';
import { positionStyle, getPosition } from '../../data/positions';
import { useSelection } from '../../context/SelectionContext';

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

  return (
    <div className="brochure-page brochure-page--full" style={colorVars(tour.colors)}>

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

        <div
          className={`p2-grid${isFirstPage ? '' : ' p2-grid--full'}`}
          style={availableColH ? { height: `${availableColH}px` } : undefined}
        >
          {pageDays.map((day, index) => {
            const gi  = tour.itinerary.findIndex(d => d.day === day.day);
            const sp  = (daySpacingCol2 != null && index >= breakAt) ? daySpacingCol2 : daySpacing;
            const pos = day.positions ?? {};


            // Per-element position helpers bound to this day's index (gi).
            const elemPos  = (field) => pos[field] ?? { x: 0, y: 0 };
            const getEP    = (field) => (t) => t.itinerary[gi]?.positions?.[field] ?? { x: 0, y: 0 };
            const setEP    = (field) => (d, axis, value) => d({ type: 'UPDATE_ITINERARY_ELEMENT_POS', index: gi, field, axis, value });
            const resetEP  = (field) => (d) => d({ type: 'RESET_ITINERARY_ELEMENT_POS', index: gi, field });

            return (
              <div
                key={day.day ?? index}
                className={`p2-day${index === breakAt ? ' p2-day--col-break' : ''}`}
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
          })}
        </div>
      </div>

    </div>
  );
}
