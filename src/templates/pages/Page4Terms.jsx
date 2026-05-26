import React from 'react';
import companyData from '../../data/global/company.json';
import defaultBrochure from '../../data/brochures/poland-czech-medjugorje.json';

function TermsParagraph({ text }) {
  const match = text.match(/^\*\*(.+?)\*\*:?\s*([\s\S]*)/);
  if (match) {
    return (
      <p className="p4-section__body">
        <strong>{match[1]}:</strong>{' '}{match[2]}
      </p>
    );
  }
  return <p className="p4-section__body">{text}</p>;
}

export default function Page4Terms({ tour }) {
  const terms = (tour?.terms?.bodyText) ? tour.terms : defaultBrochure.terms;
  const {
    headerTitle = 'Terms & Conditions of Travel',
    intro = '',
    bodyText = '',
    disclaimer = '',
  } = terms;

  const introParagraphs = intro
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const bodyParagraphs = bodyText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="brochure-page">

      <div className="p4-header">
        <p className="p4-header__title">{headerTitle}</p>
      </div>

      <div className="p4-content">
        {introParagraphs.map((para, i) => (
          <p key={`intro-${i}`} className="p4-intro">{para}</p>
        ))}

        {bodyParagraphs.map((para, i) => (
          <TermsParagraph key={i} text={para} />
        ))}
      </div>

      <div className="p4-disclaimer">
        <p className="p4-disclaimer__text">{disclaimer}</p>
      </div>

      <div className="p4-footer">
        <div className="p4-footer__brand">
          <img src="/logos/pax-via-logo.png" alt="Pax Via" className="p4-footer__logo" />
          <span className="p4-footer__name">{companyData.name}</span>
        </div>
        <div className="p4-footer__info">
          <div>{companyData.address.full}</div>
          <div>{companyData.phone}&nbsp;&nbsp;·&nbsp;&nbsp;{companyData.email}</div>
        </div>
      </div>

    </div>
  );
}
