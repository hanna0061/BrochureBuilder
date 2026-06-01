// Each image position stores:
//   x, y      — object-position crop (0–100%)
//   offsetX   — translateX offset in px
//   offsetY   — translateY offset in px
//   scale     — scale multiplier (1 = no scale)
export const IMAGE_POSITION_DEFAULTS = Object.freeze({
  grid0:       { x: 50, y: 50, offsetX: 0, offsetY: 0, scale: 1 },
  grid1:       { x: 50, y: 50, offsetX: 0, offsetY: 0, scale: 1 },
  grid2:       { x: 50, y: 50, offsetX: 0, offsetY: 0, scale: 1 },
  grid3:       { x: 50, y: 50, offsetX: 0, offsetY: 0, scale: 1 },
  pricingHero: { x: 50, y: 50, offsetX: 0, offsetY: 0, scale: 1 },
});

export const IMAGE_POSITION_LABELS = {
  grid0:       'Cover Photo 1',
  grid1:       'Cover Photo 2',
  grid2:       'Cover Photo 3',
  grid3:       'Cover Photo 4',
  pricingHero: 'Pricing Hero',
};

export function getImagePosition(imagePositions, key) {
  const def = IMAGE_POSITION_DEFAULTS[key] ?? { x: 50, y: 50, offsetX: 0, offsetY: 0, scale: 1 };
  const override = imagePositions?.[key];
  return override ? { ...def, ...override } : def;
}

/** Returns the CSS object-position value for crop panning */
export function imageObjectPosition(pos) {
  return `${pos?.x ?? 50}% ${pos?.y ?? 50}%`;
}

/** Returns a CSS transform string for offset + scale, or undefined if none needed */
export function imageTransform(pos) {
  const ox = pos?.offsetX ?? 0;
  const oy = pos?.offsetY ?? 0;
  const s  = pos?.scale   ?? 1;
  if (ox === 0 && oy === 0 && s === 1) return undefined;
  return `translateX(${ox}px) translateY(${oy}px) scale(${s})`;
}
