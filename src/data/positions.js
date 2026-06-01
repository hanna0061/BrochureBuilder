export const POSITION_DEFAULTS = Object.freeze({
  coverTitle:       { x: 0, y: 0 },
  coverSubtitle:    { x: 0, y: 0 },
  destinationStrip: { x: 0, y: 0 },
  infoBar:          { x: 0, y: 0 },
  itinerary:        { x: 0, y: 0 },
  pricing:          { x: 0, y: 0 },
  whyTravel:        { x: 0, y: 0 },
  terms:            { x: 0, y: 0 },
  footer:           { x: 0, y: 0 },
});

export const POSITION_LABELS = {
  coverTitle:       'Cover Title',
  coverSubtitle:    'Cover Subtitle',
  destinationStrip: 'Destination Strip',
  infoBar:          'Info Bar',
  itinerary:        'Itinerary Section',
  pricing:          'Pricing Section',
  whyTravel:        'Why Travel Section',
  terms:            'Terms Section',
  footer:           'Footer',
};

export function getPosition(positions, key) {
  const def = POSITION_DEFAULTS[key];
  if (!def) return { x: 0, y: 0 };
  const override = positions?.[key];
  return override ? { ...def, ...override } : def;
}

export function positionStyle(pos) {
  if (!pos || (pos.x === 0 && pos.y === 0)) return {};
  return { transform: `translateX(${pos.x}px) translateY(${pos.y}px)` };
}
