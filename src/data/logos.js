// Default dimensions — height 0 means auto (preserve aspect ratio).
export const LOGO_DEFAULTS = Object.freeze({
  cover:  { width: 90, height: 0, x: 0, y: 0, src: '/logos/cir-logo.png' },
  navbar: { width: 56, height: 0, x: 0, y: 0 },
  footer: { width: 100, height: 0, x: 0, y: 0 },
});

// Fixed-size "slot" that holds its space in the layout regardless of logo size.
// The logo img is centered inside via flexbox and can overflow visually.
const LOGO_SLOTS = {
  cover:  { width:  90, height:  90 },
  navbar: { width:  56, height:  56 },
  footer: { width: 100, height:  76 },
};

export const LOGO_LABELS = {
  cover:  'Cover Logo',
  navbar: 'Navbar Logo (Pages 2–3)',
  footer: 'Footer Logo (Page 4)',
};

export function getLogo(logos, key) {
  const def = LOGO_DEFAULTS[key];
  if (!def) return def;
  const override = logos?.[key];
  if (!override) return def;
  // Migrate old 'size' field → 'width'
  const migrated = (override.size !== undefined && override.width === undefined)
    ? { ...override, width: override.size }
    : override;
  return { ...def, ...migrated };
}

/**
 * Fixed-size flex wrapper — always occupies the same layout slot.
 * Logo img is flex-centered inside and can visually overflow without
 * pushing any surrounding content.
 */
export function logoWrapperStyle(key) {
  const slot = LOGO_SLOTS[key] ?? { width: 56, height: 56 };
  return {
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    width:           `${slot.width}px`,
    height:          `${slot.height}px`,
    flexShrink:      0,
    overflow:        'visible',
  };
}

/**
 * Style for the <img> element inside the wrapper.
 * X/Y offsets are applied via transform (doesn't affect sibling layout).
 */
export function logoStyle(logo) {
  if (!logo) return {};
  const w = logo.width ?? logo.size ?? 56;
  const h = (logo.height != null && logo.height > 0) ? `${logo.height}px` : 'auto';
  const x = logo.x || 0;
  const y = logo.y || 0;
  const style = {
    width:      `${w}px`,
    height:     h,
    maxWidth:   'none',
    maxHeight:  'none',
    objectFit:  'contain',
    flexShrink: 0,
  };
  if (x !== 0 || y !== 0) {
    style.transform = `translateX(${x}px) translateY(${y}px)`;
  }
  return style;
}
