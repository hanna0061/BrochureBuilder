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
  itineraryDayLabel:  { fontFamily: 'Inter',       fontSize: 9,   fontWeight: 600, lineHeight: 1.00, letterSpacing:  0.08  },
  itineraryHeading:   { fontFamily: 'EB Garamond', fontSize: 11,  fontWeight: 800, lineHeight: 1.25, letterSpacing:  0     },
  itineraryBody:      { fontFamily: 'EB Garamond', fontSize: 12,  fontWeight: 400, lineHeight: 1.50, letterSpacing:  0     },
  itineraryOvernight: { fontFamily: 'Inter',       fontSize: 7,   fontWeight: 400, lineHeight: 1.20, letterSpacing:  0.04  },

  // Pricing page
  pricingBarTitle:  { fontFamily: 'Inter',        fontSize: 15,   fontWeight: 700, lineHeight: 1.20, letterSpacing:  0.10  },
  pricingPrice:     { fontFamily: 'EB Garamond',  fontSize: 24,   fontWeight: 700, lineHeight: 1.00, letterSpacing:  0     },
  pricingHeading:   { fontFamily: 'Inter',        fontSize: 12,   fontWeight: 700, lineHeight: 1.00, letterSpacing:  0.10  },
  pricingBody:      { fontFamily: 'Inter',        fontSize: 9,    fontWeight: 400, lineHeight: 1.40, letterSpacing:  0     },
  tourIncludes:     { fontFamily: 'EB Garamond', fontSize: 12,   fontWeight: 400, lineHeight: 1.45, letterSpacing:  0     },
  whyTravelHeading: { fontFamily: 'EB Garamond',  fontSize: 15,   fontWeight: 600, lineHeight: 1.20, letterSpacing: -0.01  },
  whyTravel:        { fontFamily: 'Inter',        fontSize: 8.5,  fontWeight: 400, lineHeight: 1.55, letterSpacing:  0     },

  // Terms page — 5 independent sections
  termsTitle:       { fontFamily: 'EB Garamond', fontSize: 25,   fontWeight: 400, lineHeight: 1.00, letterSpacing:  0     },
  termsIntro:       { fontFamily: 'Inter',        fontSize: 9,    fontWeight: 400, lineHeight: 1.45, letterSpacing:  0     },
  termsBody:        { fontFamily: 'Inter',        fontSize: 9,    fontWeight: 400, lineHeight: 1.45, letterSpacing:  0     },
  termsDisclaimer:  { fontFamily: 'Inter',        fontSize: 8,    fontWeight: 400, lineHeight: 1.40, letterSpacing:  0     },
  termsFooter:      { fontFamily: 'EB Garamond', fontSize: 25,   fontWeight: 600, lineHeight: 1.00, letterSpacing: -0.01  },

  // Footer (Pages 2–4)
  footer:           { fontFamily: 'EB Garamond', fontSize: 25,   fontWeight: 600, lineHeight: 1.00, letterSpacing: -0.01  },
  footerParagraph:  { fontFamily: 'Inter',        fontSize: 12,   fontWeight: 400, lineHeight: 1.50, letterSpacing:  0     },
  footerContact:    { fontFamily: 'Inter',        fontSize: 7.5,  fontWeight: 400, lineHeight: 1.20, letterSpacing:  0.02  },

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
 * Only emits font-related properties — color, padding, etc. remain from CSS.
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
  return style;
}
