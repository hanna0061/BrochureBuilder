// =============================================================================
// PAGE 4 LOCKED — FINAL APPROVED DESIGN
//
// Status : FINAL TYPOGRAPHY LOCK — 2026-06-04
// Approved by: hanaodeh3@gmail.com
//
// APPROVED TYPOGRAPHY DEFAULTS (source of truth — P4_TYPO below):
//   Terms Title      Times New Roman  28px  400  lh 1.30  ls -0.04em
//   Terms Intro      Inter             9px  400  lh 1.45  ls 0em
//   Terms Body       Inter            10px  400  lh 1.15  ls -0.005em
//   Terms Disclaimer Inter           11.5px 400  lh 1.40  ls 0em
//   Terms Footer     EB Garamond      25px  600  lh 1.00  ls -0.01em
//   Footer Contact   Inter            11px  400  lh 1.20  ls 0.02em
//
// ISOLATION: This file does NOT import typoStyle() or TYPOGRAPHY_DEFAULTS.
// All style values come exclusively from P4_TYPO. getP4Typo() layers user
// overrides on top of the frozen defaults, honoring: fontFamily, fontSize,
// fontWeight, lineHeight, letterSpacing, color, x, y.
// margin* and padding* are not passed through (they affect document flow).
//
// What CANNOT change Page 4:
//   ✗ Layout, structure, spacing engine, footer layout, page sizing
//   ✗ Content distribution, Letter page sizing logic (1056px constant)
//   ✗ Global CSS changes outside .p4-* rules
//
// What CAN change Page 4 (requires explicit user action):
//   ✓ Typography — fontFamily, fontSize, fontWeight, lineHeight, letterSpacing,
//     color, x, y — all editable via click-to-edit panel and Typography sidebar
//   ✓ Content edits (title text, body text, disclaimer)
//   ✓ Bug fixes that prevent crashes or broken rendering
//   ✓ Any structural change with explicit written approval
//
// Shared dependencies:
//   src/styles/brochure.css   — .p4-* rules and .brochure-page
//   src/data/colors.js        — colorVars() / --color-* CSS variables used by .p4-*
//   src/data/positions.js     — positionStyle() for 'terms' and 'footer' keys
//   src/data/logos.js         — getLogo() / logoStyle() for footer logo
// =============================================================================

import React, { useLayoutEffect, useRef, useState } from 'react';
import { useSelection } from '../../context/SelectionContext';
import companyData from '../../data/global/company.json';
import defaultBrochure from '../../data/brochures/poland-czech-medjugorje.json';
import { colorVars } from '../../data/colors';
import { positionStyle, getPosition } from '../../data/positions';
import { getLogo, logoStyle } from '../../data/logos';
import TextgramLayer from '../components/TextgramLayer';

// =============================================================================
// PAGE 4 FROZEN TYPOGRAPHY — FINAL LOCK 2026-06-04
// These values match the approved design exactly. They are independent of
// TYPOGRAPHY_DEFAULTS and will never be affected by global typography changes.
// =============================================================================
const P4_FONT = Object.freeze({
  serif: "'EB Garamond', Georgia, serif",
  tnr:   "'Times New Roman', Georgia, serif",
  sans:  "'Inter', 'Helvetica Neue', Arial, sans-serif",
});

const P4_TYPO = Object.freeze({
  termsTitle:      { fontFamily: P4_FONT.tnr,   fontSize: 28,   fontWeight: 400, lineHeight: 1.30, letterSpacing: -0.04   }, // APPROVED 2026-06-04
  termsIntro:      { fontFamily: P4_FONT.sans,  fontSize: 9,    fontWeight: 400, lineHeight: 1.45, letterSpacing: 0       },
  termsBody:       { fontFamily: P4_FONT.sans,  fontSize: 10,   fontWeight: 400, lineHeight: 1.15, letterSpacing: -0.005  }, // APPROVED 2026-06-04
  termsDisclaimer: { fontFamily: P4_FONT.sans,  fontSize: 11.5, fontWeight: 400, lineHeight: 1.40, letterSpacing: 0,      color: '#000000' }, // APPROVED 2026-06-04
  termsFooter:     { fontFamily: P4_FONT.serif, fontSize: 25,   fontWeight: 600, lineHeight: 1.00, letterSpacing: -0.01   },
  footerContact:   { fontFamily: P4_FONT.sans,  fontSize: 11,   fontWeight: 400, lineHeight: 1.20, letterSpacing: 0.02,   color: '#000000' },
  footerParagraph: { fontFamily: P4_FONT.sans,  fontSize: 12,   fontWeight: 400, lineHeight: 1.50, letterSpacing: 0       },
});

// Converts a P4_TYPO entry to a React inline style object.
// Intentionally does NOT call the global typoStyle() — this keeps Page 4
// isolated from future changes to that function (margin, padding, etc.).
function p4Style(t) {
  const s = {
    fontFamily:    t.fontFamily,
    fontSize:      `${t.fontSize}px`,
    fontWeight:    t.fontWeight,
    lineHeight:    t.lineHeight,
    letterSpacing: `${t.letterSpacing}em`,
  };
  if (t.color) s.color = t.color;
  const x = t.x ?? 0;
  const y = t.y ?? 0;
  if (x !== 0 || y !== 0) s.transform = `translate(${x}px, ${y}px)`;
  return s;
}

// Merges user-stored typography overrides on top of the frozen P4_TYPO base.
//
// WHY: P4_TYPO provides immutable defaults so global TYPOGRAPHY_DEFAULTS
// changes never silently alter Page 4. But intentional user edits made through
// the editor (font family, size, weight, x, y, etc.) must still take effect.
//
// margin* and padding* are excluded — they affect document flow and are not
// part of the standard typography editing model.
function getP4Typo(tour, key) {
  const base     = P4_TYPO[key];
  const override = tour?.typography?.[key];
  if (!override) return base;
  const merged = { ...base };
  if (override.fontFamily    != null) merged.fontFamily    = override.fontFamily;
  if (override.fontSize      != null) merged.fontSize      = override.fontSize;
  if (override.fontWeight    != null) merged.fontWeight    = override.fontWeight;
  if (override.lineHeight    != null) merged.lineHeight    = override.lineHeight;
  if (override.letterSpacing != null) merged.letterSpacing = override.letterSpacing;
  if (override.color         != null) merged.color         = override.color;
  if (override.x             != null) merged.x             = override.x;
  if (override.y             != null) merged.y             = override.y;
  return merged;
}

// =============================================================================
// FLOAT META CONSTANTS — content + typography editing
// typographyKey is restored so the floating editor shows font controls.
// Changes go into tour.typography and are applied via getP4Typo() above.
// Layout offsets (x, y, margin, padding) from the typography expansion are
// blocked inside getP4Typo so they cannot shift Page 4 elements.
// =============================================================================
const FLOAT_TERMS_HEADER = {
  id: 'terms', label: 'Terms Header', typographyKey: 'termsTitle', textRows: 2,
  getValue: (t) => t.terms?.headerTitle ?? 'Terms & Conditions of Travel',
  setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'terms', field: 'headerTitle', value: val }),
};
const FLOAT_TERMS_INTRO = {
  id: 'terms', label: 'Terms Intro', typographyKey: 'termsIntro', textRows: 5,
  getValue: (t) => t.terms?.intro ?? '',
  setValue: (d, val) => d({ type: 'UPDATE_TERMS_FIELD', field: 'intro', value: val }),
};
const FLOAT_TERMS_BODY = {
  id: 'terms', label: 'Terms Body', typographyKey: 'termsBody', textRows: 8,
  getValue: (t) => t.terms?.bodyText ?? '',
  setValue: (d, val) => d({ type: 'UPDATE_TERMS_FIELD', field: 'bodyText', value: val }),
};
const FLOAT_TERMS_DISCLAIMER = {
  id: 'terms', label: 'Disclaimer', typographyKey: 'termsDisclaimer', textRows: 3,
  getValue: (t) => t.terms?.disclaimer ?? '',
  setValue: (d, val) => d({ type: 'UPDATE_TERMS_FIELD', field: 'disclaimer', value: val }),
};
const FLOAT_FOOTER_LOGO = {
  id: 'logos', label: 'Footer Logo', type: 'logo', logoKey: 'footer',
};
const FLOAT_FOOTER_NAME = {
  id: 'footer', label: 'Footer Company Name', typographyKey: 'termsFooter',
  getValue: (t) => t.companyOverrides?.name ?? companyData.name,
  setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'companyOverrides', field: 'name', value: val }),
};
const FLOAT_FOOTER_ADDRESS = {
  id: 'footer', label: 'Footer Address', typographyKey: 'footerContact',
  getValue: (t) => t.companyOverrides?.addressFull ?? companyData.address.full,
  setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'companyOverrides', field: 'addressFull', value: val }),
};
const FLOAT_FOOTER_PHONE = {
  id: 'footer', label: 'Footer Phone', typographyKey: 'footerContact',
  getValue: (t) => t.companyOverrides?.phone ?? companyData.phone,
  setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'companyOverrides', field: 'phone', value: val }),
};
const FLOAT_FOOTER_EMAIL = {
  id: 'footer', label: 'Footer Email', typographyKey: 'footerContact',
  getValue: (t) => t.companyOverrides?.email ?? companyData.email,
  setValue: (d, val) => d({ type: 'UPDATE_NESTED', parent: 'companyOverrides', field: 'email', value: val }),
};

function TermsParagraph({ text, style, ...rest }) {
  const match = text.match(/^\*\*(.+?)\*\*:?\s*([\s\S]*)/);
  if (match) {
    return (
      <p className="p4-section__body" style={style} {...rest}>
        <strong>{match[1]}:</strong>{' '}{match[2]}
      </p>
    );
  }
  return <p className="p4-section__body" style={style} {...rest}>{text}</p>;
}

export default function Page4Terms({ tour }) {
  const { selectedId, selectElement, openFloating } = useSelection();
  const hl = (id) => selectedId === id ? ' brochure-element--selected' : '';
  const sel = (id) => ({ 'data-sel': id, onClick: (e) => { e.stopPropagation(); selectElement(id); } });
  const floatSel = (meta) => ({
    onClick: (e) => { e.stopPropagation(); openFloating(meta, e); },
  });

  // Positions require explicit user action — still read from tour.
  const positions = tour?.positions;

  // Styles: P4_TYPO provides frozen defaults; getP4Typo layers user overrides.
  // x / y / margin / padding overrides are intentionally excluded (see getP4Typo).
  const termsTitleStyle      = p4Style(getP4Typo(tour, 'termsTitle'));
  const termsIntroStyle      = p4Style(getP4Typo(tour, 'termsIntro'));
  const termsBodyStyle       = p4Style(getP4Typo(tour, 'termsBody'));
  const termsDisclaimerStyle = p4Style(getP4Typo(tour, 'termsDisclaimer'));
  const termsFooterStyle     = p4Style(getP4Typo(tour, 'termsFooter'));
  const footerContactStyle   = p4Style(getP4Typo(tour, 'footerContact'));

  const footerLogo      = getLogo(tour?.logos, 'footer');
  const footerLogoStyle = logoStyle(footerLogo);

  const headerTitle = tour?.terms?.headerTitle ?? defaultBrochure.terms.headerTitle ?? 'Terms & Conditions of Travel';
  const intro       = tour?.terms?.intro       ?? defaultBrochure.terms.intro       ?? '';
  const bodyText    = tour?.terms?.bodyText     ?? defaultBrochure.terms.bodyText    ?? '';
  const disclaimer  = tour?.terms?.disclaimer  ?? defaultBrochure.terms.disclaimer  ?? '';

  const introParagraphs = intro
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const bodyParagraphs = bodyText
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Layout measurement/compression state
  const headerRef      = useRef(null);
  const footerRef      = useRef(null);
  const disclaimerRef  = useRef(null);
  const measureRef     = useRef(null);       // body paragraphs only, at column width
  const measureIntroRef = useRef(null);      // intro paragraphs at full content width
  const contentRef     = useRef(null);
  const [availableH,       setAvailableH]       = useState(null);
  const [introH,           setIntroH]           = useState(0);
  const [bodyColH,         setBodyColH]         = useState(null);
  const [termsCompression, setTermsCompression] = useState(null);
  // Line-level column break: { idx, head, tail } splits paragraph `idx` into
  // `head` (ends the left column) and `tail` (starts the right column);
  // head/tail null means the break falls cleanly between paragraphs.
  const [colBreak,         setColBreak]         = useState(null);
  const balanceRef     = useRef(null);       // body paragraphs, final style, at column width

  // Re-measure once web fonts (Inter) finish loading — fallback-font metrics
  // measured on first paint give different line counts. Same pattern as
  // ItineraryPages.
  const [fontsReady, setFontsReady] = useState(0);
  useLayoutEffect(() => {
    const fonts = typeof document !== 'undefined' ? document.fonts : null;
    if (!fonts?.addEventListener) return undefined;
    const bump = () => setFontsReady((n) => n + 1);
    fonts.addEventListener('loadingdone', bump);
    fonts.ready.then(bump);
    return () => fonts.removeEventListener('loadingdone', bump);
  }, []);

  // Correct column width for the new explicit flex layout.
  // .p4-content padding = 18px each side → content width = 816 - 36 = 780px
  // Two columns with 14px gap → (780 - 14) / 2 = 383px
  const BODY_COL_MEAS_W = 383;
  const INTRO_MEAS_W    = 780;

  // All measurements below use offsetHeight/offsetTop (layout px), not
  // getBoundingClientRect: the preview renders this page inside a CSS
  // scale() transform, which shrinks bounding rects but not layout sizes.

  // Phase 0 — available total height for .p4-content
  useLayoutEffect(() => {
    if (!headerRef.current || !footerRef.current || !disclaimerRef.current) return;
    const hH = headerRef.current.offsetHeight || 0;
    const fH = footerRef.current.offsetHeight || 0;
    const dH = disclaimerRef.current.offsetHeight || 0;
    const contentPad = 9 + 6;
    const avail = Math.max(200, Math.floor(1056 - hH - fH - dH - contentPad - 4));
    setAvailableH(avail);
  }, [fontsReady]);

  // Phase 1 — measure intro height at full content width
  useLayoutEffect(() => {
    if (!measureIntroRef.current || availableH == null) return;
    const iH = measureIntroRef.current.offsetHeight || 0;
    setIntroH(Math.ceil(iH));
  }, [availableH, introParagraphs.length, tour?.typography?.termsIntro, fontsReady]);

  // Phase 2 — measure body paragraphs at column width → compute compression.
  // Uses getP4Typo() so user font-size/line-height overrides are respected.
  useLayoutEffect(() => {
    if (!measureRef.current || availableH == null) return;

    // Per-column height = total available minus intro area minus safety gap
    const colH = Math.max(80, availableH - introH - 4);
    setBodyColH(colH);

    const els     = Array.from(measureRef.current.children);
    const heights = els.map(el => el.offsetHeight);
    const n       = heights.length;
    if (n === 0) return;

    const natural = heights.reduce((s, h) => s + h, 0);
    if (natural <= 2 * colH) {
      setTermsCompression(null);
      return;
    }

    const baseBody = getP4Typo(tour, 'termsBody');
    const gapFrac  = Math.min(1, (natural - 2 * colH) / natural);
    const newGap   = Math.max(0, Math.round(12 * (1 - gapFrac)));
    const compressedBody = {
      ...baseBody,
      lineHeight: Math.max(1.1, baseBody.lineHeight * (1 - Math.min(0.12, gapFrac * 0.5))),
      fontSize:   Math.max(8,   baseBody.fontSize   * (1 - Math.min(0.10, gapFrac * 0.8))),
    };
    setTermsCompression({ paragraphGap: newGap, compressedBody });
  }, [availableH, introH, bodyText, tour?.typography?.termsBody, fontsReady]);

  // contentStyle no longer carries maxHeight or columnFill — those were the
  // cross-engine incompatible properties. Only the user position offset remains.
  const contentStyle = positionStyle(getPosition(positions, 'terms'));

  // Compressed body style uses p4Style (not typoStyle) so it stays isolated
  const bodyStyleCompressed = termsCompression
    ? { ...p4Style(termsCompression.compressedBody), marginBottom: `${termsCompression.paragraphGap}px` }
    : termsBodyStyle;
  const bodyStyleKey = JSON.stringify(bodyStyleCompressed);

  // Phase 3 — balance the two columns to (nearly) the same final line.
  // Measures the paragraphs exactly as rendered (same TermsParagraph markup,
  // same final style incl. paragraph gap) at column width, then chooses the
  // column break that makes both columns' text end at the closest level:
  // either between two paragraphs, or — like a typeset page — part-way
  // through one paragraph, which then continues at the top of the right
  // column. Line-level breaks keep ≥2 lines on each side (no orphan/widow).
  useLayoutEffect(() => {
    const box = balanceRef.current;
    if (!box) return;
    const els = Array.from(box.children);
    const n   = els.length;
    if (n < 2) { setColBreak({ idx: n, at: null }); return; }

    const tops    = els.map((el) => el.offsetTop);
    const bottoms = els.map((el) => el.offsetTop + el.offsetHeight);
    const total   = bottoms[n - 1];
    const lh      = parseFloat(getComputedStyle(els[0]).lineHeight);

    // Candidate A: clean break before paragraph i. Preferred when it is
    // within about a line of perfect balance (score discounted by one line).
    let best = { idx: Math.ceil(n / 2), at: null, score: Infinity };
    for (let i = 1; i < n; i++) {
      const diff = Math.abs(bottoms[i - 1] - (total - tops[i]));
      const score = diff - (lh || 0);
      if (score < best.score) best = { idx: i, at: null, score, m: 0 };
    }

    // Candidate B: break after line m of paragraph k.
    if (lh > 0) {
      for (let k = 0; k < n; k++) {
        const lines = Math.round(els[k].offsetHeight / lh);
        for (let m = 2; m <= lines - 2; m++) {
          const c1 = tops[k] + m * lh;
          const c2 = (lines - m) * lh + (total - bottoms[k]);
          const score = Math.abs(c1 - c2);
          if (score < best.score) best = { idx: k, at: null, score, m };
        }
      }
    }

    // Resolve a line-level break to a character offset in the raw paragraph
    // text: find the first word whose line box starts at line m + 1. Only
    // the paragraph's trailing text node is searched, so the break always
    // falls after any bold "**HEADING:**" prefix.
    if (best.m) {
      const el   = els[best.idx];
      const raw  = bodyParagraphs[best.idx];
      const node = el.lastChild;
      const elRect = el.getBoundingClientRect();
      const scale  = el.offsetHeight ? elRect.height / el.offsetHeight : 1;
      let at = null;
      if (node && node.nodeType === Node.TEXT_NODE && raw.endsWith(node.data)) {
        const range = document.createRange();
        const re = /\S+/g;
        let w;
        while ((w = re.exec(node.data))) {
          range.setStart(node, w.index);
          range.setEnd(node, w.index + w[0].length);
          const r = range.getClientRects()[0];
          if (!r) continue;
          if ((r.top - elRect.top) / scale >= best.m * lh - lh / 2) {
            if (w.index > 0) at = raw.length - node.data.length + w.index;
            break;
          }
        }
      }
      if (at == null) {
        // Could not locate the line break — fall back to the best clean break.
        let fb = { idx: Math.ceil(n / 2), diff: Infinity };
        for (let i = 1; i < n; i++) {
          const diff = Math.abs(bottoms[i - 1] - (total - tops[i]));
          if (diff < fb.diff) fb = { idx: i, diff };
        }
        setColBreak({ idx: fb.idx, at: null });
        return;
      }
      setColBreak({ idx: best.idx, at });
      return;
    }
    setColBreak({ idx: best.idx, at: null });
  }, [bodyText, bodyStyleKey, fontsReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Resolve the column break into left/right paragraph lists. Before the
  // first measurement (or for one layout pass after an edit makes the stored
  // break stale) fall back to the midpoint so both columns show content.
  const n = bodyParagraphs.length;
  let col1Paras, col2Paras, headText = null, tailText = null;
  const brk = colBreak && colBreak.idx <= n ? colBreak : { idx: Math.ceil(n / 2), at: null };
  const splitPara = brk.at != null ? bodyParagraphs[brk.idx] : null;
  if (splitPara != null && brk.at > 0 && brk.at < splitPara.length) {
    col1Paras = bodyParagraphs.slice(0, brk.idx);
    col2Paras = bodyParagraphs.slice(brk.idx + 1);
    headText  = splitPara.slice(0, brk.at).trimEnd();
    tailText  = splitPara.slice(brk.at);
  } else {
    col1Paras = bodyParagraphs.slice(0, brk.idx);
    col2Paras = bodyParagraphs.slice(brk.idx);
  }
  // The continued paragraph's last left-column line is mid-paragraph, so it
  // is justified edge to edge like every other full line.
  const headStyle = { ...bodyStyleCompressed, textAlignLast: 'justify' };

  return (
    <div className="brochure-page brochure-page--full brochure-page--terms" style={colorVars(tour?.colors)}>

      <div className={`p4-header${hl('terms')}`} ref={headerRef} {...sel('terms')}>
        <p className="p4-header__title" style={termsTitleStyle} {...floatSel(FLOAT_TERMS_HEADER)}>{headerTitle}</p>
      </div>

      {/* Off-screen: intro paragraphs at full content width */}
      <div ref={measureIntroRef} aria-hidden="true" style={{ position: 'fixed', left: -9999, top: 0, width: INTRO_MEAS_W, visibility: 'hidden', pointerEvents: 'none' }}>
        {introParagraphs.map((para, i) => (
          <p key={`mi-${i}`} className="p4-intro" style={termsIntroStyle}>{para}</p>
        ))}
      </div>

      {/* Off-screen: body paragraphs at actual column width for compression */}
      <div ref={measureRef} aria-hidden="true" style={{ position: 'fixed', left: -9999, top: 0, width: BODY_COL_MEAS_W, visibility: 'hidden', pointerEvents: 'none' }}>
        {bodyParagraphs.map((para, i) => (
          <p key={`mb-${i}`} className="p4-section__body" style={termsBodyStyle}>{para}</p>
        ))}
      </div>

      {/* Off-screen: body paragraphs exactly as rendered (markup + final style)
          at column width, for the Phase 3 column balance */}
      <div ref={balanceRef} aria-hidden="true" style={{ position: 'fixed', left: -9999, top: 0, width: BODY_COL_MEAS_W, visibility: 'hidden', pointerEvents: 'none' }}>
        {bodyParagraphs.map((para, i) => (
          <TermsParagraph key={`bb-${i}`} text={para} style={bodyStyleCompressed} />
        ))}
      </div>

      <div ref={contentRef} className={`p4-content${hl('terms')}`} style={contentStyle} {...sel('terms')}>

        {/* Intro: full content width (above columns) */}
        {introParagraphs.map((para, i) => (
          <p key={`intro-${i}`} className="p4-intro" style={termsIntroStyle} {...floatSel(FLOAT_TERMS_INTRO)}>{para}</p>
        ))}

        {/* Explicit two-column flex layout — engine-safe replacement for column-count */}
        <div
          className="p4-columns"
          style={bodyColH ? { height: `${bodyColH}px` } : undefined}
        >
          <div className="p4-col">
            {col1Paras.map((para, i) => (
              <TermsParagraph key={i} text={para} style={bodyStyleCompressed} {...floatSel(FLOAT_TERMS_BODY)} />
            ))}
            {headText != null && (
              <TermsParagraph key="head" text={headText} style={headStyle} {...floatSel(FLOAT_TERMS_BODY)} />
            )}
          </div>
          <div className="p4-col">
            {tailText != null && (
              <TermsParagraph key="tail" text={tailText} style={bodyStyleCompressed} {...floatSel(FLOAT_TERMS_BODY)} />
            )}
            {col2Paras.map((para, i) => (
              <TermsParagraph key={i} text={para} style={bodyStyleCompressed} {...floatSel(FLOAT_TERMS_BODY)} />
            ))}
          </div>
        </div>

      </div>

      <div className="p4-disclaimer" ref={disclaimerRef}>
        <p className="p4-disclaimer__text" style={termsDisclaimerStyle} {...floatSel(FLOAT_TERMS_DISCLAIMER)}>{disclaimer}</p>
      </div>

      <div className={`p4-footer${hl('footer')}`} ref={footerRef} style={positionStyle(getPosition(positions, 'footer'))} {...sel('footer')}>
        <span className="p4-footer__name" style={footerContactStyle} {...floatSel(FLOAT_FOOTER_NAME)}>
          {tour?.companyOverrides?.name || companyData.name}
        </span>
        <span className="p4-footer__info" style={footerContactStyle}>
          <span {...floatSel(FLOAT_FOOTER_ADDRESS)}>{tour?.companyOverrides?.addressFull || companyData.address.full}</span>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <span {...floatSel(FLOAT_FOOTER_PHONE)}>{tour?.companyOverrides?.phone || companyData.phone}</span>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <span {...floatSel(FLOAT_FOOTER_EMAIL)}>{tour?.companyOverrides?.email || companyData.email}</span>
          &nbsp;&nbsp;·&nbsp;&nbsp;{companyData.cst}
        </span>
      </div>

      <TextgramLayer page="terms" />

    </div>
  );
}
