export const COLOR_DEFAULTS = Object.freeze({
  navy:             '#1A3160',
  gold:             '#C4973A',
  headings:         '#1A1A2E',
  bodyText:         '#3A3A4A',
  footerBg:         '#1A3160',
  footerText:       '#FFFFFF',
  navbarBg:         '#1A3160',
  navbarText:       '#FFFFFF',
  page3AccentColor: null, // null = CSS defaults (blue gradient bar + navy divider)
});

export const COLOR_LABELS = {
  navy:             'Main Navy',
  gold:             'Gold / Accent',
  headings:         'Headings',
  bodyText:         'Body Text',
  footerBg:         'Footer Background',
  footerText:       'Footer Text',
  navbarBg:         'Navbar Background',
  navbarText:       'Navbar Text',
  page3AccentColor: 'Page 3 Accent Color',
};

/**
 * Converts a #rrggbb hex color to a CSS-ready "R, G, B" string.
 * Used to parameterize rgba() gradient stops while preserving opacity layers.
 */
export function hexToRgbString(hex) {
  if (!hex || hex.length < 7) return null;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return `${r}, ${g}, ${b}`;
}

/**
 * Returns a React inline style object that sets CSS custom properties on a
 * .brochure-page element so they cascade to all children.
 *
 * page3AccentColor drives both Page 3 bars simultaneously:
 *
 *   --color-pricing-bar-rgb  R, G, B string injected into rgba() gradient stops.
 *     Opacity layers (0.45 / 0.65 / 0.90), gradient direction, and
 *     backdrop-filter: blur() are NEVER modified — only the hue changes.
 *     When absent, CSS fallbacks restore the original blue-family values.
 *
 *   --color-divider-bar  full hex, isolated from --color-navy.
 *     When absent, .p3-bottom-divider falls back to var(--color-navy).
 *
 * Pages 1, 2, 4 are unaffected — neither CSS variable is used outside Page 3.
 */
export function colorVars(colors = {}) {
  const c = { ...COLOR_DEFAULTS, ...colors };
  const style = {
    '--color-navy':         c.navy,
    '--color-badge-gold':   c.gold,
    '--color-text-heading': c.headings,
    '--color-text-body':    c.bodyText,
    '--color-footer-bg':    c.footerBg,
    '--color-footer-text':  c.footerText,
    '--color-navbar-bg':    c.navbarBg,
    '--color-navbar-text':  c.navbarText,
  };

  if (c.page3AccentColor) {
    const rgb = hexToRgbString(c.page3AccentColor);
    if (rgb) style['--color-pricing-bar-rgb'] = rgb;   // pricing bar gradient tint
    style['--color-divider-bar'] = c.page3AccentColor; // divider bar solid color
  }

  return style;
}
