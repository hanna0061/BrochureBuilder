import React from 'react';

export default function Page3Pricing({ tour, company }) {
  const { pricingHero } = tour.photos;

  const whyContent = tour?.whyUs;
  const whyHeading = whyContent?.heading ?? `Why Travel with ${company.shortName}?`;
  const whyParagraphs = whyContent?.paragraphs?.length > 0
    ? whyContent.paragraphs
    : (company.whyUs ?? []);
  const whyFontSize = `${whyContent?.fontSize ?? 8.5}px`;
  const whyLineHeight = whyContent?.lineHeight ?? 1.55;

  return (
    <div className="brochure-page">

      {/* Page header bar */}
      <div className="pg-header">
        <span className="pg-header__text">
          {company.name.toUpperCase()}&nbsp;&nbsp;·&nbsp;&nbsp;{tour.titleShort}
        </span>
        <img src="/logos/pax-via-logo.png" alt="Pax Via" className="pg-header__logo" />
      </div>

      {/* Pricing hero image */}
      <div className="p3-hero">
        <img
          src={pricingHero.src}
          alt={pricingHero.alt || 'Tour destination'}
          className="p3-hero__img"
        />
        <div className="p3-hero__overlay" />
      </div>

      {/* Pricing header bar */}
      <div className="p3-price-bar">
        <p className="p3-price-bar__title">Tour Pricing</p>
      </div>

      {/* Two-column pricing grid */}
      <div className="p3-pricing">

        {/* Left: base price, options, payment table */}
        <div>
          <p className="p3-base-label">Tour Price</p>
          <p className="p3-base-price">{tour.price.display}</p>
          <p className="p3-base-note">{tour.price.basis}</p>
          <p className="p3-discount-note">{tour.price.note}</p>

          {tour.options && tour.options.length > 0 && (
            <>
              <p className="p3-options-label">Options</p>
              {tour.options.map((opt, i) => (
                <div key={i} className="p3-option">
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
                  <td className="p3-pay-label">{payment.label}</td>
                  <td className="p3-pay-amount">{payment.display}</td>
                  <td className="p3-pay-due">{payment.dueDisplay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: inclusions */}
        <div>
          <p className="p3-incl-title">Tour Includes</p>
          <ul className="p3-incl-list">
            {tour.inclusions.map((item, i) => (
              <li key={i} className="p3-incl-item">
                <span className="p3-incl-bullet">◆</span>
                <span className="p3-incl-text">{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Why Us — navy section fills remaining space */}
      {whyParagraphs.length > 0 && (
        <div className="p3-why">
          <h3 className="p3-why__title">{whyHeading}</h3>
          <div className="p3-why__body">
            {whyParagraphs.map((para, i) => (
              <p key={i} style={{ fontSize: whyFontSize, lineHeight: whyLineHeight }}>{para}</p>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
