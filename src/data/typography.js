// Immutable typography defaults — these are the source of truth for all reset operations.
// Values match the exact current CSS rules in brochure.css.

export const FONT_STACKS = {
  'EB Garamond':      "'EB Garamond', Georgia, serif",
  'Inter':            "'Inter', 'Helvetica Neue', Arial, sans-serif",
  'Times New Roman':  "'Times New Roman', Georgia, serif",
  'Georgia':          'Georgia, serif',
  'Playfair Display': "'Playfair Display', Georgia, serif",
};

export const FONT_OPTIONS = [
  'EB Garamond',
  'Inter',
  'Times New Roman',
  'Georgia',
  'Playfair Display',
];

export const WEIGHT_OPTIONS = [300, 400, 500, 600, 700, 800, 900];

// Each value: { fontFamily, fontSize (px), fontWeight, lineHeight, letterSpacing (em) }
export const TYPOGRAPHY_DEFAULTS = Object.freeze({
  // Cover page
  coverTitle:       { fontFamily: 'EB Garamond', fontSize: 44,   fontWeight: 600, lineHeight: 1.08, letterSpacing: -0.02  },
  coverSubtitle:    { fontFamily: 'EB Garamond', fontSize: 13,   fontWeight: 400, lineHeight: 1.30, letterSpacing:  0.02  },
  destinationStrip: { fontFamily: 'Inter',        fontSize: 10,   fontWeight: 500, lineHeight: 1.00, letterSpacing:  0.08  },

  // Cover info bar
  infobarMonth:     { fontFamily: 'EB Garamond', fontSize: 26,   fontWeight: 400, lineHeight: 1.00, letterSpacing: -0.01  },
  infobarDateRange: { fontFamily: 'EB Garamond', fontSize: 15,   fontWeight: 400, lineHeight: 1.20, letterSpacing:  0.01  },
  infobarPrice:     { fontFamily: 'EB Garamond', fontSize: 30,   fontWeight: 600, lineHeight: 1.00, letterSpacing: -0.02  },
  infobarDeparture: { fontFamily: 'EB Garamond', fontSize: 15,   fontWeight: 400, lineHeight: 1.20, letterSpacing:  0.01  },
  infobarBookNow:   { fontFamily: 'EB Garamond', fontSize: 22,   fontWeight: 400, lineHeight: 1.30, letterSpacing:  0.01  },

  // Itinerary pages
  itineraryTitle:     { fontFamily: 'EB Garamond', fontSize: 23,  fontWeight: 600, lineHeight: 1.20, letterSpacing:  0     },
  itinerarySubtitle:  { fontFamily: 'Inter',       fontSize: 9,   fontWeight: 600, lineHeight: 1.00, letterSpacing:  0.10  },
  itineraryDayLabel:  { fontFamily: 'Inter',       fontSize: 10,   fontWeight: 600, lineHeight: 1.00, letterSpacing:  0.08  },
  itineraryHeading:   { fontFamily: 'EB Garamond', fontSize: 12.5, fontWeight: 800, lineHeight: 1.25, letterSpacing:  0     },
  itineraryBody:      { fontFamily: 'EB Garamond', fontSize: 10,   fontWeight: 400, lineHeight: 1.50, letterSpacing:  0     },
  itineraryOvernight: { fontFamily: 'Inter',       fontSize: 8.5,  fontWeight: 400, lineHeight: 1.20, letterSpacing:  0.04  },

  // Pricing page — legacy shared keys (kept for backward compat; no longer used by Page 3 JSX)
  pricingBarTitle:  { fontFamily: 'Inter',        fontSize: 15,   fontWeight: 700, lineHeight: 1.20, letterSpacing:  0.10  },
  pricingPrice:     { fontFamily: 'EB Garamond',  fontSize: 24,   fontWeight: 700, lineHeight: 1.00, letterSpacing:  0     },
  pricingHeading:   { fontFamily: 'Inter',        fontSize: 12,   fontWeight: 700, lineHeight: 1.00, letterSpacing:  0.10  },
  pricingBody:      { fontFamily: 'Inter',        fontSize: 9,    fontWeight: 400, lineHeight: 1.40, letterSpacing:  0     },
  tourIncludes:     { fontFamily: 'EB Garamond',  fontSize: 12,   fontWeight: 400, lineHeight: 1.45, letterSpacing:  0     },
  whyTravelHeading: { fontFamily: 'EB Garamond',  fontSize: 15,   fontWeight: 600, lineHeight: 1.20, letterSpacing: -0.01  },
  whyTravel:        { fontFamily: 'Inter',        fontSize: 8.5,  fontWeight: 400, lineHeight: 1.55, letterSpacing:  0     },

  // Pricing page — isolated per-element keys (one key → one element on Page 3)
  priceAmount:        { fontFamily: 'EB Garamond',  fontSize: 24,   fontWeight: 700, lineHeight: 1.00, letterSpacing:  0     },
  priceLabel:         { fontFamily: 'Inter',        fontSize: 12,   fontWeight: 700, lineHeight: 1.00, letterSpacing:  0.10  },
  priceBasis:         { fontFamily: 'Inter',        fontSize: 9,    fontWeight: 400, lineHeight: 1.40, letterSpacing:  0     },
  optionsHeading:     { fontFamily: 'Inter',        fontSize: 12,   fontWeight: 700, lineHeight: 1.00, letterSpacing:  0.10  },
  optionsText:        { fontFamily: 'Inter',        fontSize: 9,    fontWeight: 400, lineHeight: 1.40, letterSpacing:  0     },
  includesHeading:    { fontFamily: 'Inter',        fontSize: 12,   fontWeight: 700, lineHeight: 1.00, letterSpacing:  0.10  },
  includesItems:      { fontFamily: 'EB Garamond',  fontSize: 12,   fontWeight: 400, lineHeight: 1.45, letterSpacing:  0     },
  notIncludedHeading: { fontFamily: 'Inter',        fontSize: 12,   fontWeight: 700, lineHeight: 1.00, letterSpacing:  0.10  },
  notIncludedItems:   { fontFamily: 'EB Garamond',  fontSize: 12,   fontWeight: 400, lineHeight: 1.45, letterSpacing:  0     },
  infoSectionTitle:   { fontFamily: 'Inter',        fontSize: 12,   fontWeight: 700, lineHeight: 1.00, letterSpacing:  0.10  },
  infoSectionBody:    { fontFamily: 'Inter',        fontSize: 9,    fontWeight: 400, lineHeight: 1.40, letterSpacing:  0     },
  paymentLabels:      { fontFamily: 'Inter',        fontSize: 9,    fontWeight: 500, lineHeight: 1.30, letterSpacing:  0     },
  paymentValues:      { fontFamily: 'Inter',        fontSize: 9,    fontWeight: 700, lineHeight: 1.30, letterSpacing:  0     },
  paymentDue:         { fontFamily: 'Inter',        fontSize: 9,    fontWeight: 400, lineHeight: 1.30, letterSpacing:  0     },

  // PAGE 4 LOCKED — APPROVED DESIGN
  // Do not modify without explicit approval.
  // Keys below (termsTitle → termsFooter) drive Page 4 layout.
  // footerContact and footerParagraph are also used by Page 4 footer — see note on those keys.
  // Terms page — 5 independent sections
  termsTitle:       { fontFamily: 'EB Garamond', fontSize: 25,   fontWeight: 400, lineHeight: 1.00, letterSpacing:  0     },
  termsIntro:       { fontFamily: 'Inter',        fontSize: 9,    fontWeight: 400, lineHeight: 1.45, letterSpacing:  0     },
  termsBody:        { fontFamily: 'Inter',        fontSize: 10,   fontWeight: 400, lineHeight: 1.20, letterSpacing:  0.025 },
  termsDisclaimer:  { fontFamily: 'Inter',        fontSize: 9.5,  fontWeight: 400, lineHeight: 1.40, letterSpacing:  0,     color: '#000000' },
  termsFooter:      { fontFamily: 'EB Garamond', fontSize: 25,   fontWeight: 600, lineHeight: 1.00, letterSpacing: -0.01  },

  // Footer (Pages 2–4)
  // NOTE: footerContact and footerParagraph are used by Page 4 footer (LOCKED).
  // Do not change footerContact or footerParagraph without verifying Page 4 is unaffected.
  footer:           { fontFamily: 'EB Garamond', fontSize: 25,   fontWeight: 600, lineHeight: 1.00, letterSpacing: -0.01  },
  footerParagraph:  { fontFamily: 'Inter',        fontSize: 12,   fontWeight: 400, lineHeight: 1.50, letterSpacing:  0     },
  footerContact:    { fontFamily: 'Inter',        fontSize: 11,   fontWeight: 400, lineHeight: 1.20, letterSpacing:  0.02,  color: '#000000' },

  // Navbar (Pages 2–3)
  navbar:           { fontFamily: 'Inter',        fontSize: 10,   fontWeight: 600, lineHeight: 1.00, letterSpacing:  0.10  },

  // Pricing payment table rows
  pricingTableLabel:  { fontFamily: 'Inter', fontSize: 9,   fontWeight: 500, lineHeight: 1.30, letterSpacing: 0     },
  pricingTableAmount: { fontFamily: 'Inter', fontSize: 9,   fontWeight: 700, lineHeight: 1.30, letterSpacing: 0     },
  pricingTableDue:    { fontFamily: 'Inter', fontSize: 9,   fontWeight: 400, lineHeight: 1.30, letterSpacing: 0     },
});

/**
 * Returns the effective typography setting for a section,
 * merging stored overrides on top of immutable defaults.
 */
export function getTypo(typography, section) {
  const def = TYPOGRAPHY_DEFAULTS[section];
  if (!def) return {};
  const override = typography?.[section];
  return override ? { ...def, ...override } : def;
}

/**
 * Converts a typography setting object to a React inline style object.
 * Emits font properties plus optional element-level offset, margin, and padding.
 * All spacing fields are omitted when zero so CSS defaults are not disturbed.
 */
export function typoStyle(t) {
  if (!t) return {};
  const style = {
    fontFamily:    FONT_STACKS[t.fontFamily] || t.fontFamily,
    fontSize:      `${t.fontSize}px`,
    fontWeight:    t.fontWeight,
    lineHeight:    t.lineHeight,
    letterSpacing: `${t.letterSpacing}em`,
  };
  if (t.color) style.color = t.color;

  // Element-level position offset — translate does not disturb layout flow
  const x = t.x ?? 0;
  const y = t.y ?? 0;
  if (x !== 0 || y !== 0) style.transform = `translate(${x}px, ${y}px)`;

  // Margin — only emitted when non-zero so CSS defaults are preserved
  if (t.marginTop    != null && t.marginTop    !== 0) style.marginTop    = `${t.marginTop}px`;
  if (t.marginBottom != null && t.marginBottom !== 0) style.marginBottom = `${t.marginBottom}px`;
  if (t.marginLeft   != null && t.marginLeft   !== 0) style.marginLeft   = `${t.marginLeft}px`;
  if (t.marginRight  != null && t.marginRight  !== 0) style.marginRight  = `${t.marginRight}px`;

  // Padding — only emitted when non-zero
  if (t.paddingTop    != null && t.paddingTop    !== 0) style.paddingTop    = `${t.paddingTop}px`;
  if (t.paddingBottom != null && t.paddingBottom !== 0) style.paddingBottom = `${t.paddingBottom}px`;
  if (t.paddingLeft   != null && t.paddingLeft   !== 0) style.paddingLeft   = `${t.paddingLeft}px`;
  if (t.paddingRight  != null && t.paddingRight  !== 0) style.paddingRight  = `${t.paddingRight}px`;

  return style;
}
