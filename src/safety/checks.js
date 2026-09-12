import { COLOR_DEFAULTS } from '../data/colors';
import { LOGO_DEFAULTS } from '../data/logos';

// ── WCAG relative luminance ──────────────────────────────────────────────────

function linearize(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  if (!hex || hex.length < 7) return 0;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(hex1, hex2) {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker  = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ── Color checks ─────────────────────────────────────────────────────────────

// bg can be a hex literal or a key name in the colors object
const COLOR_PAIRS = [
  { bg: 'navbarBg', fg: 'navbarText', label: 'Navbar text',   section: 'colors' },
  { bg: 'footerBg', fg: 'footerText', label: 'Footer text',   section: 'footer' },
  { bg: '#FFFFFF',  fg: 'headings',   label: 'Headings',       section: 'colors' },
  { bg: '#FFFFFF',  fg: 'bodyText',   label: 'Body text',      section: 'colors' },
];

const CONTRAST_THRESHOLD = 3.0;

export function checkColors(colors) {
  const c = { ...COLOR_DEFAULTS, ...colors };
  const warnings = [];

  for (const pair of COLOR_PAIRS) {
    const bg = pair.bg.startsWith('#') ? pair.bg : c[pair.bg];
    const fg = c[pair.fg];
    if (!bg || !fg || bg.length < 7 || fg.length < 7) continue;

    try {
      const ratio = contrastRatio(bg, fg);
      if (ratio < CONTRAST_THRESHOLD) {
        warnings.push({
          id:       `color-${pair.bg}-${pair.fg}`,
          category: 'color',
          section:  pair.section,
          message:  'Low contrast detected.',
          detail:   `${pair.label}: ${ratio.toFixed(1)}:1 (min ${CONTRAST_THRESHOLD}:1)`,
        });
      }
    } catch {
      // invalid hex — skip
    }
  }

  return warnings;
}

// ── Position checks ──────────────────────────────────────────────────────────

const POS_SAFE_X = 60;
const POS_SAFE_Y = 70;

const POSITION_LABELS = {
  coverTitle:       'Cover Title',
  coverSubtitle:    'Cover Subtitle',
  destinationStrip: 'Destination Strip',
  infoBar:          'Info Bar',
  itinerary:        'Itinerary',
  pricing:          'Pricing',
  whyTravel:        'Why Travel',
  terms:            'Terms',
  footer:           'Footer',
};

const GENERAL_POSITION_KEYS = [
  'coverTitle', 'coverSubtitle', 'destinationStrip', 'infoBar',
  'itinerary', 'pricing', 'whyTravel', 'terms',
];

function positionWarning(positions, key, section) {
  const pos = positions?.[key] ?? { x: 0, y: 0 };
  if (Math.abs(pos.x ?? 0) > POS_SAFE_X || Math.abs(pos.y ?? 0) > POS_SAFE_Y) {
    return {
      id:       `pos-${key}`,
      category: 'position',
      section,
      message:  'Content exceeds safe area.',
      detail:   `${POSITION_LABELS[key]}: X=${pos.x}px, Y=${pos.y}px`,
    };
  }
  return null;
}

export function checkPositions(positions) {
  return GENERAL_POSITION_KEYS
    .map(key => positionWarning(positions, key, 'positions'))
    .filter(Boolean);
}

export function checkFooterPosition(positions) {
  const w = positionWarning(positions, 'footer', 'footer');
  return w ? [w] : [];
}

// ── Logo checks ──────────────────────────────────────────────────────────────

const LOGO_SAFE_X = 80;
const LOGO_SAFE_Y = 60;

const LOGO_LABELS = { cover: 'Cover Logo', navbar: 'Navbar Logo', footer: 'Footer Logo' };

export function checkLogos(logos) {
  const warnings = [];
  for (const key of ['cover', 'navbar', 'footer']) {
    const def  = LOGO_DEFAULTS[key] ?? { x: 0, y: 0 };
    const logo = { ...def, ...(logos?.[key] ?? {}) };
    if (Math.abs(logo.x ?? 0) > LOGO_SAFE_X || Math.abs(logo.y ?? 0) > LOGO_SAFE_Y) {
      warnings.push({
        id:       `logo-${key}`,
        category: 'logo',
        section:  key === 'footer' ? 'footer' : 'logos',
        message:  'Logo outside safe area.',
        detail:   `${LOGO_LABELS[key]}: X=${logo.x}px, Y=${logo.y}px`,
      });
    }
  }
  return warnings;
}

// ── Image checks ─────────────────────────────────────────────────────────────

const IMAGE_SAFE_OFFSET = 120;
const IMAGE_SAFE_SCALE  = 1.5;

const IMAGE_LABELS = {
  grid0: 'Cover Photo 1', grid1: 'Cover Photo 2',
  grid2: 'Cover Photo 3', grid3: 'Cover Photo 4',
  pricingHero: 'Pricing Hero',
};

export function checkImages(imagePositions) {
  const warnings = [];
  for (const key of Object.keys(IMAGE_LABELS)) {
    const pos = imagePositions?.[key];
    if (!pos) continue;
    const ox = Math.abs(pos.offsetX ?? 0);
    const oy = Math.abs(pos.offsetY ?? 0);
    const s  = pos.scale ?? 1;
    if (ox > IMAGE_SAFE_OFFSET || oy > IMAGE_SAFE_OFFSET || s > IMAGE_SAFE_SCALE) {
      warnings.push({
        id:       `img-${key}`,
        category: 'image',
        section:  'images',
        message:  'Image may overlap content.',
        detail:   `${IMAGE_LABELS[key]}: scale=${s.toFixed(2)}×, offset=(${pos.offsetX ?? 0}, ${pos.offsetY ?? 0})px`,
      });
    }
  }
  return warnings;
}

// ── Combined ──────────────────────────────────────────────────────────────────

export function runAllChecks(tour) {
  return [
    ...checkColors(tour.colors),
    ...checkPositions(tour.positions),
    ...checkFooterPosition(tour.positions),
    ...checkLogos(tour.logos),
    ...checkImages(tour.imagePositions),
  ];
}
