// Registration Form typography — reuses the Brochure Builder's existing
// typography DATA PATTERN (a flat defaults map + "stored override merged
// over default" + a style-computation function), the same pattern already
// implemented in src/data/typography.js (TYPOGRAPHY_DEFAULTS / getTypo /
// typoStyle) and driven by the same reducer-action shape
// (UPDATE_TYPOGRAPHY → here, UPDATE_REGISTRATION_TYPOGRAPHY).
//
// This is a SEPARATE, parallel module — not an extension of
// src/data/typography.js — because that file is the frozen source of truth
// for brochure.css-matching defaults (Pages 1-4) and must not be touched by
// this feature. FONT_STACKS/FONT_OPTIONS/WEIGHT_OPTIONS ARE reused directly
// from it (re-exported below) since those are genuinely shared constants,
// not brochure-specific.
//
// Two deliberate differences from the brochure system, both intentional:
//   1. No x/y position or margin/padding support — the Registration Form's
//      geometry is fixed; only content styling (font/color/emphasis/align)
//      is editable, never position.
//   2. Adds italic / underline / textAlign, which the brochure typography
//      system does not support — genuinely new capabilities the user asked
//      for, added by extending the existing pattern rather than replacing it.
import { FONT_STACKS, FONT_OPTIONS, WEIGHT_OPTIONS } from '../data/typography';

// The Registration Form's base font (matching registrationForm.css's
// .rf-page font-family) isn't one of the brochure's font options, so it's
// added here as one more selectable entry — the manager can still choose
// any brochure font too, but the true-to-PDF default stays available.
export const REGISTRATION_FONT_STACKS = {
  ...FONT_STACKS,
  Calibri: 'Calibri, Carlito, Arial, "Helvetica Neue", sans-serif',
};
export const REGISTRATION_FONT_OPTIONS = ['Calibri', ...FONT_OPTIONS];
export { WEIGHT_OPTIONS };

// Each default mirrors the CURRENT hard-coded CSS in registrationForm.css
// exactly, so an unedited form renders pixel-identical to before this
// feature — overrides only ever move the result away from today's look.
export const REGISTRATION_TYPOGRAPHY_DEFAULTS = Object.freeze({
  rfTitle:              { fontFamily: 'Calibri', fontSize: 27,   fontWeight: 800, italic: false, underline: false, textAlign: 'center' },
  rfLeader:              { fontFamily: 'Calibri', fontSize: 14,   fontWeight: 800, italic: false, underline: false, textAlign: 'center' },
  rfFormLabel:           { fontFamily: 'Calibri', fontSize: 15,   fontWeight: 800, italic: false, underline: false, textAlign: 'center' },
  rfTourNumber:          { fontFamily: 'Calibri', fontSize: 11,   fontWeight: 700, italic: false, underline: false, textAlign: 'left' },
  rfPassengerHeading:    { fontFamily: 'Calibri', fontSize: 14,   fontWeight: 800, italic: false, underline: false, textAlign: 'left' },
  rfPassengerLabel:      { fontFamily: 'Calibri', fontSize: 10.5, fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfPassengerInstruction:{ fontFamily: 'Calibri', fontSize: 9,    fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfPassengerNote:       { fontFamily: 'Calibri', fontSize: 8.5,  fontWeight: 400, italic: false, underline: false, textAlign: 'center' },
  rfPassengerValue:      { fontFamily: 'Calibri', fontSize: 10.5, fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfEmergencyBadge:      { fontFamily: 'Calibri', fontSize: 10.5, fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfDeposit:             { fontFamily: 'Calibri', fontSize: 11,   fontWeight: 700, italic: false, underline: false, textAlign: 'left' },
  rfCheckboxText:        { fontFamily: 'Calibri', fontSize: 9.5,  fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfPaymentHeading:      { fontFamily: 'Calibri', fontSize: 10,   fontWeight: 700, italic: false, underline: false, textAlign: 'left' },
  rfPaymentAddress:      { fontFamily: 'Calibri', fontSize: 10,   fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfCreditCard:          { fontFamily: 'Calibri', fontSize: 9.5,  fontWeight: 700, italic: false, underline: false, textAlign: 'left' },
  rfAcknowledgement:     { fontFamily: 'Calibri', fontSize: 8,    fontWeight: 400, italic: false, underline: false, textAlign: 'justify' },
  rfSignature:           { fontFamily: 'Calibri', fontSize: 11,   fontWeight: 700, italic: false, underline: false, textAlign: 'left' },
  rfPassportNotice:      { fontFamily: 'Calibri', fontSize: 11.5, fontWeight: 700, italic: false, underline: false, textAlign: 'left' },
  rfFooter:              { fontFamily: 'Calibri', fontSize: 7.5,  fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
});

/** Returns the effective typography for a section: stored override merged over its default. */
export function getRegTypo(typography, section) {
  const def = REGISTRATION_TYPOGRAPHY_DEFAULTS[section];
  if (!def) return {};
  const override = typography?.[section];
  return override ? { ...def, ...override } : def;
}

/** Converts a registration-form typography setting to a React inline style object. No position/spacing fields — geometry stays fixed. */
export function regTypoStyle(t) {
  if (!t) return {};
  const style = {
    fontFamily: REGISTRATION_FONT_STACKS[t.fontFamily] || t.fontFamily,
    fontSize: `${t.fontSize}px`,
    fontWeight: t.fontWeight,
    fontStyle: t.italic ? 'italic' : 'normal',
    textDecoration: t.underline ? 'underline' : 'none',
  };
  if (t.textAlign) style.textAlign = t.textAlign;
  if (t.color) style.color = t.color;
  return style;
}
