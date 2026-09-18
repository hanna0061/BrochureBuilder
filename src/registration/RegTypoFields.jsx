import React from 'react';
import { REGISTRATION_FONT_OPTIONS, WEIGHT_OPTIONS } from './registrationFormTypography';

// reset.css sets `appearance: none` on every <input>, which collapses a
// native checkbox to 0×0 with no visible chrome. Restoring `appearance: auto`
// locally (inline styles win over the class-based reset rule) brings back a
// normal, clickable native checkbox without touching reset.css itself.
export const CHECKBOX_INPUT_STYLE = { appearance: 'auto', WebkitAppearance: 'auto', width: 14, height: 14, cursor: 'pointer', flexShrink: 0 };

/**
 * The Registration Form's typography control set — Font/Weight/Size/Italic/
 * Underline/Alignment/Color — factored out of RegistrationFormEditor's
 * sidebar panel so FloatingEditor's click-on-static-text branch can present
 * the exact same controls instead of a second, duplicate implementation.
 * Pure props in (`current`, `onSet(field, value)`), no dispatch/state of its
 * own, so it drops into either the sidebar's `.typo-group` or FloatingEditor's
 * panel body unchanged.
 */
export default function RegTypoFields({ current, onSet }) {
  return (
    <>
      <div className="field">
        <label className="field__label">Font Family</label>
        <select className="field__input" value={current.fontFamily} onChange={(e) => onSet('fontFamily', e.target.value)}>
          {REGISTRATION_FONT_OPTIONS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label">Weight</label>
        <select
          className="field__input"
          value={current.fontWeight}
          onChange={(e) => onSet('fontWeight', parseInt(e.target.value, 10))}
        >
          {WEIGHT_OPTIONS.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label">Size — {current.fontSize}px</label>
        <input
          type="range"
          min={6}
          max={40}
          step={0.5}
          value={current.fontSize}
          onChange={(e) => onSet('fontSize', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

      <div className="field" style={{ display: 'flex', gap: 16 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={!!current.italic}
            onChange={(e) => onSet('italic', e.target.checked)}
            style={CHECKBOX_INPUT_STYLE}
          />
          Italic
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={!!current.underline}
            onChange={(e) => onSet('underline', e.target.checked)}
            style={CHECKBOX_INPUT_STYLE}
          />
          Underline
        </label>
      </div>

      <div className="field">
        <label className="field__label">Alignment</label>
        <select className="field__input" value={current.textAlign || 'left'} onChange={(e) => onSet('textAlign', e.target.value)}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
      </div>

      <div className="field">
        <label className="field__label">Color</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <input
            type="color"
            value={current.color || '#000000'}
            onChange={(e) => onSet('color', e.target.value)}
            style={{ width: 32, height: 26, border: '1px solid #d5d5e0', borderRadius: 3, cursor: 'pointer', padding: 0, flexShrink: 0 }}
          />
          {current.color ? (
            <button
              type="button"
              onClick={() => onSet('color', null)}
              style={{ fontSize: 9, color: '#888', background: 'none', border: '1px solid #d5d5e0', borderRadius: 3, cursor: 'pointer', padding: '2px 6px' }}
            >
              Clear
            </button>
          ) : (
            <span style={{ fontSize: 9, color: '#aaa' }}>default (black)</span>
          )}
        </div>
      </div>
    </>
  );
}
