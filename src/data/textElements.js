// Textgram — freeform text boxes that can be placed anywhere on any brochure
// page. Each element is fully self-contained (no shared/keyed defaults like
// TYPOGRAPHY_DEFAULTS, since elements are created dynamically with generated
// ids) but reuses the exact same font fields as typography.js so the shared
// typoStyle()/FONT_OPTIONS/WEIGHT_OPTIONS machinery applies unchanged.

// Brochure pages only — the Registration Form is a separate document with
// its own dedicated Textgram UI (RegistrationFormEditor), so it isn't listed
// here; it uses page id 'registrationForm' directly (see TEXTGRAM_PAGE_LABELS
// below). Every other part of the Textgram system (createTextElement,
// TextgramLayer, TextgramElement, the reducer, FloatingEditor) is already
// page-id-agnostic and needed no changes to support it.
export const TEXTGRAM_PAGES = ['cover', 'itinerary', 'pricing', 'terms'];

export const TEXTGRAM_PAGE_LABELS = {
  cover:            'Page 1 — Cover',
  itinerary:        'Page 2 — Itinerary',
  pricing:          'Page 3 — Pricing',
  terms:            'Page 4 — Terms',
  registrationForm: 'Registration Form',
};

// Page canvas is always 816×1056px (8.5in × 11in at 96dpi) — see brochure.css.
const PAGE_W = 816;
const PAGE_H = 1056;

export const TEXT_ELEMENT_DEFAULTS = Object.freeze({
  width: 220,
  height: 70,
  fontFamily: 'Inter',
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.3,
  letterSpacing: 0,
  color: '#1a1a1a',
});

let counter = 0;
export function makeTextElementId() {
  counter += 1;
  return `txt_${Date.now().toString(36)}_${counter}`;
}

/** Creates a new text element on `page`, centered at (x, y) in page-local px. */
export function createTextElement(page, x = PAGE_W / 2, y = PAGE_H / 2) {
  return {
    id: makeTextElementId(),
    page,
    text: 'New text',
    x: Math.round(x - TEXT_ELEMENT_DEFAULTS.width / 2),
    y: Math.round(y - TEXT_ELEMENT_DEFAULTS.height / 2),
    width: TEXT_ELEMENT_DEFAULTS.width,
    height: TEXT_ELEMENT_DEFAULTS.height,
    fontFamily: TEXT_ELEMENT_DEFAULTS.fontFamily,
    fontSize: TEXT_ELEMENT_DEFAULTS.fontSize,
    fontWeight: TEXT_ELEMENT_DEFAULTS.fontWeight,
    lineHeight: TEXT_ELEMENT_DEFAULTS.lineHeight,
    letterSpacing: TEXT_ELEMENT_DEFAULTS.letterSpacing,
    color: TEXT_ELEMENT_DEFAULTS.color,
  };
}

/** Absolute-position/size box style — kept separate from typoStyle() so its
 *  left/top never collides with typoStyle's own x/y (translate-offset) fields. */
export function textElementBoxStyle(el) {
  return {
    position: 'absolute',
    left: `${el.x}px`,
    top: `${el.y}px`,
    width: `${el.width}px`,
    height: `${el.height}px`,
  };
}
