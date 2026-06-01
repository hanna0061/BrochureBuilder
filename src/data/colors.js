export const COLOR_DEFAULTS = Object.freeze({
  navy:       '#1A3160',
  gold:       '#C4973A',
  headings:   '#1A1A2E',
  bodyText:   '#3A3A4A',
  footerBg:   '#1A3160',
  footerText: '#FFFFFF',
  navbarBg:   '#1A3160',
  navbarText: '#FFFFFF',
});

export const COLOR_LABELS = {
  navy:       'Main Navy',
  gold:       'Gold / Accent',
  headings:   'Headings',
  bodyText:   'Body Text',
  footerBg:   'Footer Background',
  footerText: 'Footer Text',
  navbarBg:   'Navbar Background',
  navbarText: 'Navbar Text',
};

/**
 * Returns a React inline style object that sets all 8 color custom properties
 * on a .brochure-page element so they cascade to all children.
 */
export function colorVars(colors = {}) {
  const c = { ...COLOR_DEFAULTS, ...colors };
  return {
    '--color-navy':         c.navy,
    '--color-badge-gold':   c.gold,
    '--color-text-heading': c.headings,
    '--color-text-body':    c.bodyText,
    '--color-footer-bg':    c.footerBg,
    '--color-footer-text':  c.footerText,
    '--color-navbar-bg':    c.navbarBg,
    '--color-navbar-text':  c.navbarText,
  };
}
