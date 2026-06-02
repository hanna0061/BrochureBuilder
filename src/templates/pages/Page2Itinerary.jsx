import React from 'react';
import { typoStyle, getTypo } from '../../data/typography';
import { colorVars } from '../../data/colors';
import { positionStyle, getPosition } from '../../data/positions';
import { useSelection } from '../../context/SelectionContext';

export default function Page2Itinerary({ tour, company, days, isFirstPage = true, colBreakIdx, daySpacing, pageScale = 1, gridColH = null, availableColH = null }) {
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
  const footerContactStyle = typoStyle(getTypo(typo, 'footerContact'));

  const pageDays = days ?? tour.itinerary;
  const breakAt  = colBreakIdx ?? Math.ceil(pageDays.length / 2);

  return (
    <div className="brochure-page" style={colorVars(tour.colors)}>

      <div
        className={`p2-body${hl('itinerary')}`}
        style={{
          ...positionStyle(getPosition(positions, 'itinerary')),
          overflow: pageScale < 1 ? 'visible' : undefined,
        }}
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
          style={
            pageScale < 1 && gridColH
              ? {
                  height:          `${gridColH}px`,
                  transform:       `scaleY(${pageScale.toFixed(5)})`,
                  transformOrigin: 'top left',
                }
              : availableColH
              ? { height: `${availableColH}px` }
              : undefined
          }
        >
          {pageDays.map((day, index) => {
            const gi = tour.itinerary.findIndex(d => d.day === day.day);
            return (
              <div
                key={day.day ?? index}
                className={`p2-day${index === breakAt ? ' p2-day--col-break' : ''}`}
                style={daySpacing != null ? { paddingBlock: daySpacing } : undefined}
              >
                <div className="p2-day__meta">
                  <span className="p2-day__num" style={dayLabelStyle}>{String(day.day).padStart(2, '0')}</span>
                  <div className="p2-day__titles">
                    <span className="p2-day__label" style={dayLabelStyle}
                      {...floatSel({
                        id: 'itinerary', label: `Day ${day.day} Label`, typographyKey: 'itineraryDayLabel',
                        getValue: (t) => t.itinerary[gi]?.label ?? '',
                        setValue: (d, val) => d({ type: 'UPDATE_ITINERARY_DAY', index: gi, field: 'label', value: val }),
                      })}
                    >{day.label}</span>
                    <h3 className="p2-day__heading" style={headingStyle}
                      {...floatSel({
                        id: 'itinerary', label: `Day ${day.day} Heading`, typographyKey: 'itineraryHeading',
                        getValue: (t) => t.itinerary[gi]?.heading ?? '',
                        setValue: (d, val) => d({ type: 'UPDATE_ITINERARY_DAY', index: gi, field: 'heading', value: val }),
                      })}
                    >{day.heading}</h3>
                  </div>
                </div>
                <div className="p2-day__content">
                  <p className="p2-day__body" style={bodyStyle}
                    {...floatSel({
                      id: 'itinerary', label: `Day ${day.day} Body`, typographyKey: 'itineraryBody', textRows: 4,
                      getValue: (t) => t.itinerary[gi]?.body ?? '',
                      setValue: (d, val) => d({ type: 'UPDATE_ITINERARY_DAY', index: gi, field: 'body', value: val }),
                    })}
                  >{day.body}</p>
                  {(day.overnight || day.meals) && (
                    <p className="p2-day__overnight" style={overnightStyle}>
                      {day.overnight && (
                        <>
                          <span className="p2-overnight-lbl">Overnight:</span>{' '}
                          <span
                            {...floatSel({
                              id: 'itinerary', label: `Day ${day.day} Overnight`, typographyKey: 'itineraryOvernight',
                              getValue: (t) => t.itinerary[gi]?.overnight ?? '',
                              setValue: (d, val) => d({ type: 'UPDATE_ITINERARY_DAY', index: gi, field: 'overnight', value: val }),
                            })}
                          >{day.overnight}</span>
                        </>
                      )}
                      {day.overnight && day.meals && '  ·  '}
                      {day.meals && (
                        <>
                          <span className="p2-overnight-lbl">Meals:</span>{' '}
                          <span
                            {...floatSel({
                              id: 'itinerary', label: `Day ${day.day} Meals`, typographyKey: 'itineraryOvernight',
                              getValue: (t) => t.itinerary[gi]?.meals ?? '',
                              setValue: (d, val) => d({ type: 'UPDATE_ITINERARY_DAY', index: gi, field: 'meals', value: val }),
                            })}
                          >{day.meals}</span>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>



    </div>
  );
}
