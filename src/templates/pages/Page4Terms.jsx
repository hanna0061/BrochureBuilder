import React, { useLayoutEffect, useRef, useState } from 'react';
import companyData from '../../data/global/company.json';
import defaultBrochure from '../../data/brochures/poland-czech-medjugorje.json';
import { typoStyle, getTypo } from '../../data/typography';
import { colorVars } from '../../data/colors';
import { positionStyle, getPosition } from '../../data/positions';
import { getLogo, logoStyle, logoWrapperStyle } from '../../data/logos';

function TermsParagraph({ text, style }) {
  const match = text.match(/^\*\*(.+?)\*\*:?\s*([\s\S]*)/);
  if (match) {
    return (
      <p className="p4-section__body" style={style}>
        <strong>{match[1]}:</strong>{' '}{match[2]}
      </p>
    );
  }
  return <p className="p4-section__body" style={style}>{text}</p>;
}

export default function Page4Terms({ tour }) {
  const typo = tour?.typography;
  const positions = tour?.positions;
  const termsTitleStyle      = typoStyle(getTypo(typo, 'termsTitle'));
  const termsIntroStyle      = typoStyle(getTypo(typo, 'termsIntro'));
  const termsBodyStyle       = typoStyle(getTypo(typo, 'termsBody'));
  const termsDisclaimerStyle = typoStyle(getTypo(typo, 'termsDisclaimer'));
  const termsFooterStyle     = typoStyle(getTypo(typo, 'termsFooter'));
  const footerParagraphStyle = typoStyle(getTypo(typo, 'footerParagraph'));
  const footerLogoStyle      = logoStyle(getLogo(tour?.logos, 'footer'));

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

  // Layout measurement/compression state
  const headerRef = useRef(null);
  const footerRef = useRef(null);
  const disclaimerRef = useRef(null);
  const measureRef = useRef(null);
  const [availableH, setAvailableH] = useState(null);
  const [termsCompression, setTermsCompression] = useState(null);

  // compute available vertical space for terms content (accounts for header/disclaimer/footer)
  useLayoutEffect(() => {
    if (!headerRef.current || !footerRef.current || !disclaimerRef.current) return;
    const hH = headerRef.current.getBoundingClientRect().height || 0;
    const fH = footerRef.current.getBoundingClientRect().height || 0;
    const dH = disclaimerRef.current.getBoundingClientRect().height || 0;
    // paddings inside .p4-content: 9px top, 6px bottom
    const contentPad = 9 + 6;
    const avail = Math.max(200, Math.floor(1056 - hH - fH - dH - contentPad - 4));
    setAvailableH(avail);
  }, []);

  // Measure natural content height and compute light compression if it overflows
  useLayoutEffect(() => {
    if (!measureRef.current || availableH == null) return;
    const els = Array.from(measureRef.current.children);
    const natural = els.reduce((s, el) => s + el.getBoundingClientRect().height, 0);
    if (natural <= availableH) {
      setTermsCompression(null);
      return;
    }

    // Priority: reduce paragraph gaps -> reduce line-height -> reduce body font-size
    const baseBody = getTypo(typo, 'termsBody');
    const maxGap = 12; // assume up to 12px gap
    const gapFrac = Math.min(1, (natural - availableH) / natural);
    const newGap = Math.max(0, Math.round(maxGap * (1 - gapFrac)));

    const lhReduction = Math.min(0.12, gapFrac * 0.5); // up to 12%
    const fontReduction = Math.min(0.10, gapFrac * 0.8); // up to 10%

    const compressedBody = {
      ...baseBody,
      lineHeight: Math.max(1.1, baseBody.lineHeight * (1 - lhReduction)),
      fontSize: Math.max(8, baseBody.fontSize * (1 - fontReduction)),
    };

    setTermsCompression({ paragraphGap: newGap, compressedBody });
  }, [availableH, introParagraphs.length, bodyParagraphs.length, typo]);

  const contentStyle = {
    ...positionStyle(getPosition(positions, 'terms')),
    height: availableH ? `${availableH}px` : undefined,
    overflow: availableH ? 'visible' : undefined,
    columnFill: 'balance',
  };

  const bodyStyleCompressed = termsCompression
    ? { ...termsBodyStyle, ...typoStyle(termsCompression.compressedBody), marginBottom: `${termsCompression.paragraphGap}px` }
    : termsBodyStyle;

  const contentRef = useRef(null);

  // Diagnostic measurement: print container/column metrics to console for investigation
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const cs = window.getComputedStyle(el);
    const children = Array.from(el.children);
    const rect = el.getBoundingClientRect();
    const scrollH = el.scrollHeight;
    const clientH = el.clientHeight;
    const offsetH = el.offsetHeight;
    // Estimate column height by max bottom of children relative to container top
    const childRects = children.map(c => c.getBoundingClientRect());
    const containerTop = rect.top;
    const maxChildBottom = childRects.reduce((m, r) => Math.max(m, r.bottom), containerTop);
    const estimatedColumnHeight = Math.max(0, Math.round(maxChildBottom - containerTop));

    // Find nearest ancestor with overflow hidden
    let anc = el.parentElement;
    let overflowHiddenAncestor = null;
    while (anc) {
      const aCs = window.getComputedStyle(anc);
      if (aCs.overflow === 'hidden' || aCs.overflowY === 'hidden' || aCs.overflowX === 'hidden') {
        overflowHiddenAncestor = anc;
        break;
      }
      anc = anc.parentElement;
    }

    // Check for transforms on element or ancestors
    let transformAncestor = null;
    anc = el;
    while (anc) {
      const aCs = window.getComputedStyle(anc);
      if (aCs.transform && aCs.transform !== 'none') {
        transformAncestor = { node: anc, transform: aCs.transform };
        break;
      }
      anc = anc.parentElement;
    }

    // Log requested metrics
    // eslint-disable-next-line no-console
    console.log('[Terms Debug] contentRect.height=', Math.round(rect.height), 'containerRect=', rect);
    // eslint-disable-next-line no-console
    console.log('[Terms Debug] computedStyles: columnCount=', cs.columnCount, 'columnFill=', cs.columnFill, 'columnGap=', cs.columnGap, 'overflow=', cs.overflow, 'height=', cs.height, 'maxHeight=', cs.maxHeight, 'transform=', cs.transform);
    // eslint-disable-next-line no-console
    console.log('[Terms Debug] scrollHeight=', scrollH, 'clientHeight=', clientH, 'offsetHeight=', offsetH, 'estimatedColumnHeight=', estimatedColumnHeight);
    // eslint-disable-next-line no-console
    console.log('[Terms Debug] overflowHiddenAncestor=', overflowHiddenAncestor ? overflowHiddenAncestor.tagName : null, 'transformAncestor=', transformAncestor ? transformAncestor.transform : null);
  }, [availableH, termsCompression, introParagraphs.length, bodyParagraphs.length]);

  return (
    <div className="brochure-page" style={colorVars(tour?.colors)}>

      <div className="p4-header" ref={headerRef}>
        <p className="p4-header__title" style={termsTitleStyle}>{headerTitle}</p>
      </div>

      {/* Off-screen measurement container */}
      <div ref={measureRef} aria-hidden="true" style={{ position: 'fixed', left: -9999, top: 0, width: 374, visibility: 'hidden' }}>
        {introParagraphs.map((para, i) => (
          <p key={`m-intro-${i}`} className="p4-intro" style={termsIntroStyle}>{para}</p>
        ))}
        {bodyParagraphs.map((para, i) => (
          <p key={`m-body-${i}`} className="p4-section__body" style={termsBodyStyle}>{para}</p>
        ))}
      </div>

      <div ref={contentRef} className="p4-content" style={contentStyle}>
        {introParagraphs.map((para, i) => (
          <p key={`intro-${i}`} className="p4-intro" style={termsIntroStyle}>{para}</p>
        ))}

        {bodyParagraphs.map((para, i) => (
          <TermsParagraph key={i} text={para} style={bodyStyleCompressed} />
        ))}
      </div>

      <div className="p4-disclaimer" ref={disclaimerRef}>
        <p className="p4-disclaimer__text" style={termsDisclaimerStyle}>{disclaimer}</p>
      </div>

      <div className="p4-footer" ref={footerRef} style={positionStyle(getPosition(positions, 'footer'))}>
        <div className="p4-footer__brand">
          <div style={logoWrapperStyle('footer')}>
            <img src="/logos/cir-logo.png" alt="Pax Via" className="p4-footer__logo" style={footerLogoStyle} />
          </div>
          <span className="p4-footer__name" style={termsFooterStyle}>{companyData.name}</span>
        </div>
        <div className="p4-footer__info" style={footerParagraphStyle}>
          <div>{companyData.address.full}</div>
          <div>{companyData.phone}&nbsp;&nbsp;·&nbsp;&nbsp;{companyData.email}</div>
        </div>
      </div>

    </div>
  );
}
