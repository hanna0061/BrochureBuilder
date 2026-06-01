import React from 'react';
import { typoStyle, getTypo } from '../../data/typography';
import { colorVars } from '../../data/colors';
import { positionStyle, getPosition } from '../../data/positions';
import { getImagePosition } from '../../data/imagePositions';
import { getLogo, logoStyle, logoWrapperStyle } from '../../data/logos';
import { useBrochure } from '../../context/BrochureContext';
import DraggableImage from '../components/DraggableImage';

export default function Page3Pricing({ tour, company }) {
  const { dispatch } = useBrochure();
  const typo = tour.typography;
  const positions = tour.positions;
  const heroPos = getImagePosition(tour.imagePositions, 'pricingHero');
  const navbarStyle          = typoStyle(getTypo(typo, 'navbar'));
  const pricingHeadingStyle  = typoStyle(getTypo(typo, 'pricingHeading'));
  const pricingBodyStyle     = typoStyle(getTypo(typo, 'pricingBody'));
  const includesStyle        = typoStyle(getTypo(typo, 'tourIncludes'));
  const whyHeadingStyle      = typoStyle(getTypo(typo, 'whyTravelHeading'));
  const whyStyle             = typoStyle(getTypo(typo, 'whyTravel'));
  const footerContactStyle   = typoStyle(getTypo(typo, 'footerContact'));
  const tableLabel           = typoStyle(getTypo(typo, 'pricingTableLabel'));
  const tableAmount          = typoStyle(getTypo(typo, 'pricingTableAmount'));
  const tableDue             = typoStyle(getTypo(typo, 'pricingTableDue'));
  const navbarLogoStyle      = logoStyle(getLogo(tour.logos, 'navbar'));

  const { pricingHero } = tour.photos;
  const whyContent   = tour?.whyUs;
  const whyHeading   = whyContent?.heading ?? `Why Travel with ${company.shortName}?`;
  const whyParagraphs = whyContent?.paragraphs?.length > 0
    ? whyContent.paragraphs
    : (company.whyUs ?? []);

  return (
    <div className="brochure-page" style={colorVars(tour.colors)}>

      {/* Page header bar */}
      <div className="pg-header">
        <span className="pg-header__text" style={navbarStyle}>
          {company.name.toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;{tour.titleShort}
        </span>
        <div style={logoWrapperStyle('navbar')}>
          <img src="/logos/cir-logo.png" alt="Pax Via" className="pg-header__logo" style={navbarLogoStyle} />
        </div>
      </div>

      {/* Pricing hero image */}
      <div className="p3-hero">
        <DraggableImage
          src={pricingHero.src}
          alt={pricingHero.alt || 'Tour destination'}
          className="p3-hero__img"
          position={heroPos}
          onPositionChange={(v) => dispatch({ type: 'UPDATE_IMAGE_POSITION', key: 'pricingHero', value: v })}
        />
        <div className="p3-hero__overlay" />
      </div>

      {/* Pricing header bar */}
      <div className="p3-price-bar">
        <p className="p3-price-bar__title">Tour Pricing</p>
      </div>

      {/* Two-column pricing grid */}
      <div className="p3-pricing" style={positionStyle(getPosition(positions, 'pricing'))}>

        {/* Left: base price, options, payment table */}
        <div>
          <p className="p3-base-label" style={pricingHeadingStyle}>Tour Price</p>
          <p className="p3-base-price">{tour.price.display}</p>
          <p className="p3-base-note" style={pricingBodyStyle}>{tour.price.basis}</p>
          <p className="p3-discount-note" style={pricingBodyStyle}>{tour.price.note}</p>

          {tour.options && tour.options.length > 0 && (
            <>
              <p className="p3-options-label" style={pricingHeadingStyle}>Options</p>
              {tour.options.map((opt, i) => (
                <div key={i} className="p3-option" style={pricingBodyStyle}>
                  <strong>{opt.label}</strong>
                  {opt.display ? ` — ${opt.display}` : ''}
                  {opt.note && <span className="p3-option__note">{opt.note}</span>}
                  {opt.linkLabel && (
                    <span className="p3-option__note">{opt.linkLabel}</span>
                  )}
                </div>
              ))}
            </>
          )}

          <table className="p3-pay-table">
            <tbody>
              {tour.payments.map((payment, i) => (
                <tr
                  key={i}
                  className={`p3-pay-row${i % 2 === 1 ? ' p3-pay-row--alt' : ''}`}
                >
                  <td className="p3-pay-label" style={tableLabel}>{payment.label}</td>
                  <td className="p3-pay-amount" style={tableAmount}>{payment.display}</td>
                  <td className="p3-pay-due" style={tableDue}>{payment.dueDisplay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: inclusions */}
        <div>
          <p className="p3-incl-title" style={pricingHeadingStyle}>Tour Includes</p>
          <ul className="p3-incl-list">
            {tour.inclusions.map((item, i) => (
              <li key={i} className="p3-incl-item">
                <span className="p3-incl-bullet">◆</span>
                <span className="p3-incl-text" style={includesStyle}>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Why Us — navy section fills remaining space */}
      {whyParagraphs.length > 0 && (
        <div className="p3-why" style={positionStyle(getPosition(positions, 'whyTravel'))}>
          <h3 className="p3-why__title" style={whyHeadingStyle}>{whyHeading}</h3>
          <div className="p3-why__body">
            {whyParagraphs.map((para, i) => (
              <p key={i} style={whyStyle}>{para}</p>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
