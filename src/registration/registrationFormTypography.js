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

// Each default originally mirrored the hard-coded CSS in registrationForm.css
// exactly (an unedited form rendered pixel-identical to the source PDF).
// Sizes below were then bumped twice — once across the whole form, then
// again for this lower-page readability pass (signature/passport-notice/
// footer/small-info) — modestly and proportionally (preserving which
// element is bigger than which: main title still largest, section headings
// still bigger than plain labels, notes/hints/footer still smallest).
// rfPassengerValue got only a small +0.5px this round: it renders inside a
// fixed 12px-tall `.rf-field-blank` box, the tightest overflow margin on
// the page — verified visually (no clipping) rather than pushed further.
export const REGISTRATION_TYPOGRAPHY_DEFAULTS = Object.freeze({
  rfTitle:              { fontFamily: 'Calibri', fontSize: 29,   fontWeight: 800, italic: false, underline: false, textAlign: 'center' },
  rfLeader:              { fontFamily: 'Calibri', fontSize: 15,   fontWeight: 800, italic: false, underline: false, textAlign: 'center' },
  rfFormLabel:           { fontFamily: 'Calibri', fontSize: 16,   fontWeight: 800, italic: false, underline: false, textAlign: 'center' },
  rfTourNumber:          { fontFamily: 'Calibri', fontSize: 12,   fontWeight: 700, italic: false, underline: false, textAlign: 'left' },
  rfPassengerHeading:    { fontFamily: 'Calibri', fontSize: 15,   fontWeight: 800, italic: false, underline: false, textAlign: 'left' },
  rfPassengerLabel:      { fontFamily: 'Calibri', fontSize: 11.5, fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfPassengerInstruction:{ fontFamily: 'Calibri', fontSize: 10,   fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfPassengerNote:       { fontFamily: 'Calibri', fontSize: 9.5,  fontWeight: 400, italic: false, underline: false, textAlign: 'center' },
  rfPassengerValue:      { fontFamily: 'Calibri', fontSize: 11,   fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfEmergencyBadge:      { fontFamily: 'Calibri', fontSize: 11.5, fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfDeposit:             { fontFamily: 'Calibri', fontSize: 12,   fontWeight: 700, italic: false, underline: false, textAlign: 'left' },
  rfCheckboxText:        { fontFamily: 'Calibri', fontSize: 11,   fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfPaymentHeading:      { fontFamily: 'Calibri', fontSize: 11,   fontWeight: 700, italic: false, underline: false, textAlign: 'left' },
  rfPaymentAddress:      { fontFamily: 'Calibri', fontSize: 11,   fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfCreditCard:          { fontFamily: 'Calibri', fontSize: 10.5, fontWeight: 700, italic: false, underline: false, textAlign: 'left' },
  rfAcknowledgement:     { fontFamily: 'Calibri', fontSize: 9,    fontWeight: 400, italic: false, underline: false, textAlign: 'justify' },
  rfSignature:           { fontFamily: 'Calibri', fontSize: 13,   fontWeight: 700, italic: false, underline: false, textAlign: 'left' },
  // New key (Passenger 1:/Passenger 2: signature labels) — previously had no
  // typography binding at all and inherited a hard-coded 10px from
  // .rf-signature-row's own CSS (see registrationForm.css). Sits one tier
  // below rfSignature's heading size, preserving "Signature" as the more
  // prominent of the two per the requested hierarchy.
  rfSignatureLabel:      { fontFamily: 'Calibri', fontSize: 12,   fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
  rfPassportNotice:      { fontFamily: 'Calibri', fontSize: 13.5, fontWeight: 700, italic: false, underline: false, textAlign: 'center' },
  rfFooter:              { fontFamily: 'Calibri', fontSize: 10,   fontWeight: 400, italic: false, underline: false, textAlign: 'left' },
});

// Human-readable label per typography section key — shared by the sidebar's
// RegistrationTypoPanel and FloatingEditor's click-on-static-text branch
// (RegTextContent in FloatingEditor.jsx), so both name each group the same way.
export const REG_TYPO_GROUP_LABELS = {
  rfTitle: 'Pilgrimage Title',
  rfLeader: 'Leader',
  rfFormLabel: 'Form Label',
  rfTourNumber: 'Tour Number',
  rfPassengerHeading: 'Passenger Heading (both columns)',
  rfPassengerLabel: 'Field Labels (both columns)',
  rfPassengerInstruction: 'Instruction / Consent Text (both columns)',
  rfPassengerNote: 'Expiration Note (both columns)',
  rfPassengerValue: 'Field Values (both columns)',
  rfEmergencyBadge: 'Emergency Contact / Badge',
  rfDeposit: 'Deposit Line',
  rfCheckboxText: 'Checkbox Option Text',
  rfPaymentHeading: 'Payment Headings',
  rfPaymentAddress: 'Payment Address',
  rfCreditCard: 'Credit Card Instruction',
  rfAcknowledgement: 'Acknowledgement Paragraph',
  rfSignature: 'Signature Heading',
  rfSignatureLabel: 'Signature Labels (Passenger 1 / 2)',
  rfPassportNotice: 'Passport Notice',
  rfFooter: 'Footer',
};

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
