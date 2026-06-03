import React from 'react';
import { typoStyle, getTypo } from '../../data/typography';
import { colorVars } from '../../data/colors';
import { getImagePosition } from '../../data/imagePositions';
import { useBrochure } from '../../context/BrochureContext';
import { usePreview } from '../../context/PreviewContext';
import { useSelection } from '../../context/SelectionContext';
import DraggableImage from '../components/DraggableImage';

export default function Page3Pricing({ tour, company }) {
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

  const typo = tour.typography;
  const heroPos = getImagePosition(tour.imagePositions, 'pricingHero');

  // One style variable per element — no shared keys on Page 3
  const barTitleStyle        = typoStyle(getTypo(typo, 'pricingBarTitle'));
  const priceAmountStyle     = typoStyle(getTypo(typo, 'priceAmount'));
  const priceLabelStyle      = typoStyle(getTypo(typo, 'priceLabel'));
  const priceBasisStyle      = typoStyle(getTypo(typo, 'priceBasis'));
  const optionsHeadingStyle  = typoStyle(getTypo(typo, 'optionsHeading'));
  const optionsTextStyle     = typoStyle(getTypo(typo, 'optionsText'));
  const includesHeadingStyle = typoStyle(getTypo(typo, 'includesHeading'));
  const includesItemStyle    = typoStyle(getTypo(typo, 'includesItems'));
  const notInclHeadingStyle  = typoStyle(getTypo(typo, 'notIncludedHeading'));
  const notInclItemStyle     = typoStyle(getTypo(typo, 'notIncludedItems'));
  const infoTitleStyle       = typoStyle(getTypo(typo, 'infoSectionTitle'));
  const infoBodyStyle        = typoStyle(getTypo(typo, 'infoSectionBody'));
  const paymentLabelStyle    = typoStyle(getTypo(typo, 'paymentLabels'));
  const paymentValueStyle    = typoStyle(getTypo(typo, 'paymentValues'));
  const paymentDueStyle      = typoStyle(getTypo(typo, 'paymentDue'));

  const { pricingHero } = tour.photos;
  const notIncluded = tour.notIncluded ?? [];
  const infoBlocks  = tour.infoBlocks  ?? [];
  const hasLandOnly = !!(tour.price?.landOnlyDisplay || tour.price?.landOnly);

  return (
    <div className="brochure-page" style={colorVars(tour.colors)}>

      {/* ── Hero Image ── */}
      <div className={`p3-hero${hl('images')}`} {...floatSel({
        id: 'images', label: 'Pricing Hero Image', type: 'image',
        imagePositionKey: 'pricingHero',
        getSrc: (t) => t.photos.pricingHero?.src ?? '',
        setSrc: (d, val) => d({ type: 'UPDATE_PRICING_HERO', value: val }),
      })}>
        <DraggableImage
          src={pricingHero.src}
          alt={pricingHero.alt || 'Tour destination'}
          className="p3-hero__img"
          position={heroPos}
          onPositionChange={(v) => dispatch({ type: 'UPDATE_IMAGE_POSITION', key: 'pricingHero', value: v })}
        />
      </div>

      {/* ── Pricing Bar ── */}
      <div className="p3-price-bar">
        <p className="p3-price-bar__title" style={barTitleStyle}
          {...floatSel({
            id: 'pricing', label: 'Pricing Bar Title', typographyKey: 'pricingBarTitle',
            getValue: (t) => t.pricingBarTitle || 'PRICING',
            setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'pricingBarTitle', value: val }),
          })}
        >{tour.pricingBarTitle || 'PRICING'}</p>
      </div>

      {/* ── Two-Column Pricing Table ── */}
      <div className="p3-pricing-section">
        <div className="p3-pricing-table">

          {/* Left Column */}
          <div className="p3-pricing-col p3-pricing-col--left">

            {/* Base Price */}
            <div className="p3-price-block">
              <p className="p3-block-title" style={priceLabelStyle} {...floatSel({
                id: 'pricing', label: 'Price Label', typographyKey: 'priceLabel',
                getValue: (t) => t.priceLabel || 'Base Price Per Person',
                setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'priceLabel', value: val }),
              })}>
                {tour.priceLabel || 'Base Price Per Person'}
              </p>
              <p className="p3-price-amount" style={priceAmountStyle} {...floatSel({
                id: 'pricing', label: 'Base Price', typographyKey: 'priceAmount',
                getValue: (t) => t.price?.display ?? '',
                setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'price', field: 'display', value: val }),
              })}>
                {tour.price.display}
              </p>
              <p className="p3-price-note" style={priceBasisStyle} {...floatSel({
                id: 'pricing', label: 'Price Basis', typographyKey: 'priceBasis',
                getValue: (t) => t.price?.basis ?? '',
                setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'price', field: 'basis', value: val }),
              })}>
                {tour.price.basis}
              </p>
              {tour.price.note && (
                <p className="p3-discount-note" style={priceBasisStyle} {...floatSel({
                  id: 'pricing', label: 'Price Note', typographyKey: 'priceBasis',
                  getValue: (t) => t.price?.note ?? '',
                  setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'price', field: 'note', value: val }),
                })}>
                  {tour.price.note}
                </p>
              )}
            </div>

            {/* Land Only Price */}
            {hasLandOnly && (
              <div className="p3-price-block">
                <p className="p3-block-title" style={priceLabelStyle} {...floatSel({
                  id: 'pricing', label: 'Land Only Label', typographyKey: 'priceLabel',
                  getValue: (t) => t.landOnlyLabel || 'Land Only Per Person',
                  setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'landOnlyLabel', value: val }),
                })}>
                  {tour.landOnlyLabel || 'Land Only Per Person'}
                </p>
                <p className="p3-price-amount" style={priceAmountStyle} {...floatSel({
                  id: 'pricing', label: 'Land Only Price', typographyKey: 'priceAmount',
                  getValue: (t) => t.price?.landOnlyDisplay ?? '',
                  setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'price', field: 'landOnlyDisplay', value: val }),
                })}>
                  {tour.price.landOnlyDisplay}
                </p>
                {tour.price.landOnlyBasis && (
                  <p className="p3-price-note" style={priceBasisStyle} {...floatSel({
                    id: 'pricing', label: 'Land Only Basis', typographyKey: 'priceBasis',
                    getValue: (t) => t.price?.landOnlyBasis ?? '',
                    setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'price', field: 'landOnlyBasis', value: val }),
                  })}>
                    {tour.price.landOnlyBasis}
                  </p>
                )}
              </div>
            )}

            {/* Options */}
            {tour.options?.length > 0 && (
              <div className="p3-options-block">
                <p className="p3-block-title" style={optionsHeadingStyle}>OPTIONS</p>
                <ul className="p3-options-list">
                  {tour.options.map((opt, i) => (
                    <li key={i} className="p3-option-item" style={optionsTextStyle}>
                      <span className="p3-option-bullet">•</span>
                      <span className="p3-option-content">
                        <strong>{opt.label}</strong>
                        {opt.display ? `: ${opt.display}` : ''}
                        {opt.note && <span className="p3-option-note"> *{opt.note}</span>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Payment Schedule */}
            {tour.payments?.length > 0 && (
              <div className="p3-payment-block">
                <table className="p3-payment-table">
                  <tbody>
                    {tour.payments.map((payment, i) => (
                      <tr key={i} className="p3-payment-row">
                        <td className="p3-payment-label" style={paymentLabelStyle} {...floatSel({
                          id: 'pricing', label: `Payment ${i + 1} Label`, typographyKey: 'paymentLabels',
                          getValue: (t) => t.payments[i]?.label ?? '',
                          setValue: (d, val) => d({ type: 'UPDATE_PAYMENT', index: i, field: 'label', value: val }),
                        })}>
                          {payment.label}
                        </td>
                        <td className="p3-payment-amount" style={paymentValueStyle} {...floatSel({
                          id: 'pricing', label: `Payment ${i + 1} Amount`, typographyKey: 'paymentValues',
                          getValue: (t) => t.payments[i]?.display ?? '',
                          setValue: (d, val) => d({ type: 'UPDATE_PAYMENT', index: i, field: 'display', value: val }),
                        })}>
                          {payment.display}
                        </td>
                        <td className="p3-payment-due" style={paymentDueStyle} {...floatSel({
                          id: 'pricing', label: `Payment ${i + 1} Due`, typographyKey: 'paymentDue',
                          getValue: (t) => t.payments[i]?.dueDisplay ?? '',
                          setValue: (d, val) => d({ type: 'UPDATE_PAYMENT', index: i, field: 'dueDisplay', value: val }),
                        })}>
                          {payment.dueDisplay}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="p3-pricing-col p3-pricing-col--right">

            {/* Includes */}
            <div className="p3-includes-block">
              <p className="p3-block-title" style={includesHeadingStyle} {...floatSel({
                id: 'pricing', label: 'Includes Label', typographyKey: 'includesHeading',
                getValue: (t) => t.includesLabel || 'Base Price Includes',
                setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'includesLabel', value: val }),
              })}>
                {tour.includesLabel || 'Base Price Includes:'}
              </p>
              <ul className="p3-includes-list">
                {tour.inclusions.map((item, i) => (
                  <li key={i} className="p3-include-item" style={includesItemStyle}>
                    <span className="p3-include-bullet">•</span>
                    <span className="p3-include-text" {...floatSel({
                      id: 'pricing', label: `Inclusion ${i + 1}`, typographyKey: 'includesItems',
                      getValue: (t) => t.inclusions[i] ?? '',
                      setValue: (d, val) => d({ type: 'UPDATE_INCLUSION', index: i, value: val }),
                    })}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Not Included */}
            {notIncluded.length > 0 && (
              <div className="p3-not-included-block">
                <p className="p3-block-title" style={notInclHeadingStyle} {...floatSel({
                  id: 'pricing', label: 'Not Included Label', typographyKey: 'notIncludedHeading',
                  getValue: (t) => t.notIncludedLabel || 'Not Included',
                  setValue: (d, val) => d({ type: 'UPDATE_FIELD', field: 'notIncludedLabel', value: val }),
                })}>
                  {tour.notIncludedLabel || 'NOT INCLUDED'}
                </p>
                <ul className="p3-not-included-list">
                  {notIncluded.map((item, i) => (
                    <li key={i} className="p3-not-include-item" style={notInclItemStyle}>
                      <span className="p3-not-include-bullet">•</span>
                      <span className="p3-not-include-text" {...floatSel({
                        id: 'pricing', label: `Not Included ${i + 1}`, typographyKey: 'notIncludedItems',
                        getValue: (t) => t.notIncluded?.[i] ?? '',
                        setValue: (d, val) => d({ type: 'UPDATE_NOT_INCLUDED', index: i, value: val }),
                      })}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Blue divider ── */}
      <div className="p3-bottom-divider" />

      {/* ── Information Section ── */}
      {infoBlocks.length > 0 && (
        <div className="p3-info-section">
          {infoBlocks.map((block, i) => (
            <div key={i} className="p3-info-block">
              <p className="p3-info-block__title" style={infoTitleStyle}
                {...floatSel({
                  id: 'pricing', label: `Info ${i + 1} Title`, typographyKey: 'infoSectionTitle',
                  getValue: (t) => t.infoBlocks?.[i]?.title ?? '',
                  setValue: (d, val) => d({ type: 'UPDATE_INFO_BLOCK', index: i, field: 'title', value: val }),
                })}
              >{block.title}</p>

              {block.bullets?.length > 0 ? (
                <ul className="p3-info-block__bullets">
                  {block.bullets.map((bullet, j) => (
                    <li key={j} className="p3-info-block__bullet" style={infoBodyStyle}
                      {...floatSel({
                        id: 'pricing', label: `Info ${i + 1} Bullet ${j + 1}`, typographyKey: 'infoSectionBody',
                        getValue: (t) => t.infoBlocks?.[i]?.bullets?.[j] ?? '',
                        setValue: (d, val) => d({ type: 'UPDATE_INFO_BULLET', index: i, bulletIndex: j, value: val }),
                      })}
                    >{bullet}</li>
                  ))}
                </ul>
              ) : block.body ? (
                <p className="p3-info-block__body" style={infoBodyStyle}
                  {...floatSel({
                    id: 'pricing', label: `Info ${i + 1} Body`, typographyKey: 'infoSectionBody', textRows: 3,
                    getValue: (t) => t.infoBlocks?.[i]?.body ?? '',
                    setValue: (d, val) => d({ type: 'UPDATE_INFO_BLOCK', index: i, field: 'body', value: val }),
                  })}
                >{block.body}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
