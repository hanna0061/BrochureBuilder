import React, { useState } from 'react';
import { useBrochure } from '../../context/BrochureContext';
import { FONT_OPTIONS, WEIGHT_OPTIONS, getTypo } from '../../data/typography';
import { getPosition } from '../../data/positions';

const FS_MIN  = 6,    FS_MAX  = 72;
const LH_MIN  = 0.8,  LH_MAX  = 3;
const LS_MIN  = -0.2, LS_MAX  = 0.5;
const POS_MIN = -200, POS_MAX = 200;
const MAR_MIN = -100, MAR_MAX = 200;
const PAD_MIN = 0,    PAD_MAX = 100;

function clamp(v, min, max) {
  const n = parseFloat(v);
  return isNaN(n) ? min : Math.max(min, Math.min(max, n));
}

const GROUP_LABELS = {
  coverTitle:       'Cover Title',
  coverSubtitle:    'Cover Subtitle',
  destinationStrip: 'Destination Strip',
  infobarMonth:     'Info Bar — Month',
  infobarDateRange: 'Info Bar — Date Range',
  infobarPrice:     'Info Bar — Price',
  infobarDeparture: 'Info Bar — Departure',
  infobarBookNow:   'Info Bar — Book Now',
  itineraryTitle:     'Section Title',
  itinerarySubtitle:  'Section Subtitle',
  itineraryDayLabel:  'Day Label',
  itineraryHeading:   'Itinerary Headings',
  itineraryBody:      'Itinerary Body Text',
  itineraryOvernight: 'Overnight',
  itineraryMeals:     'Meals',
  pricingBarTitle:    'Pricing Bar Title',
  pricingPrice:       'Price Amount Display',
  pricingHeading:     'Pricing Headings',
  pricingBody:        'Pricing Body Text',
  tourIncludes:       'Tour Includes List',
  whyTravel:          'Why Travel With Us',
  // Isolated Page 3 keys
  priceAmount:        'Price Amount',
  priceLabel:         'Price Label',
  priceBasis:         'Price Basis / Note',
  optionsHeading:     'Options Heading',
  optionsText:        'Options Text',
  includesHeading:    'Includes Heading',
  includesItems:      'Includes Items',
  notIncludedHeading: 'Not Included Heading',
  notIncludedItems:   'Not Included Items',
  infoSectionTitle:   'Info Section Title',
  infoSectionBody:    'Info Section Body',
  paymentLabels:      'Payment Labels',
  paymentValues:      'Payment Amounts',
  paymentDue:         'Payment Due Dates',
  termsTitle:       'Terms Title',
  termsIntro:       'Terms Intro',
  termsBody:        'Terms Body',
  termsDisclaimer:  'Terms Disclaimer',
  termsFooter:      'Terms Footer',
  terms:            'Terms & Conditions',
  footer:              'Footer Heading',
  footerParagraph:     'Footer Paragraph',
  footerContact:       'Footer Contact Info',
  navbar:              'Navbar Text',
  pricingTableLabel:   'Payment Table — Label',
  pricingTableAmount:  'Payment Table — Amount',
  pricingTableDue:     'Payment Table — Due Date',
};

// Compact number input used for margin and padding fields
function SpacingInput({ label, value, min, max, onChange }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 9, color: '#999', letterSpacing: '0.03em', textTransform: 'uppercase' }}>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={{
          width: '100%',
          padding: '3px 5px',
          fontSize: 11,
          border: '1px solid #d5d5e0',
          borderRadius: 3,
          background: '#fafafa',
          boxSizing: 'border-box',
        }}
      />
    </label>
  );
}

function TypoGroup({ sectionKey, current, onSet }) {
  return (
    <div className="typo-group">
      <span className="typo-group__label">{GROUP_LABELS[sectionKey] || sectionKey}</span>

      {/* ── Font Styling ─────────────────────────────── */}
      <div className="field">
        <label className="field__label">Font Family</label>
        <select
          className="field__input"
          value={current.fontFamily}
          onChange={e => onSet('fontFamily', e.target.value)}
        >
          {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div className="field">
        <label className="field__label">Weight</label>
        <select
          className="field__input"
          value={current.fontWeight}
          onChange={e => onSet('fontWeight', parseInt(e.target.value, 10))}
        >
          {WEIGHT_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      <div className="field">
        <label className="field__label">Size — {current.fontSize}px</label>
        <input
          type="range"
          min={FS_MIN} max={FS_MAX} step={0.5}
          value={current.fontSize}
          onChange={e => onSet('fontSize', clamp(e.target.value, FS_MIN, FS_MAX))}
          style={{ width: '100%' }}
        />
      </div>

      <div className="field">
        <label className="field__label">
          Line Height — {(current.lineHeight ?? LH_MIN).toFixed(2)}
        </label>
        <input
          type="range"
          min={LH_MIN} max={LH_MAX} step={0.05}
          value={current.lineHeight}
          onChange={e => onSet('lineHeight', clamp(e.target.value, LH_MIN, LH_MAX))}
          style={{ width: '100%' }}
        />
      </div>

      <div className="field">
        <label className="field__label">
          Letter Spacing — {(current.letterSpacing ?? 0).toFixed(3)}em
        </label>
        <input
          type="range"
          min={LS_MIN} max={LS_MAX} step={0.005}
          value={current.letterSpacing}
          onChange={e => onSet('letterSpacing', clamp(e.target.value, LS_MIN, LS_MAX))}
          style={{ width: '100%' }}
        />
      </div>

      <div className="field">
        <label className="field__label">Color</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <input
            type="color"
            value={current.color || '#000000'}
            onChange={e => onSet('color', e.target.value)}
            style={{ width: 32, height: 26, border: '1px solid #d5d5e0', borderRadius: 3, cursor: 'pointer', padding: 0, flexShrink: 0 }}
          />
          {current.color
            ? <button type="button" onClick={() => onSet('color', null)} style={{ fontSize: 9, color: '#888', background: 'none', border: '1px solid #d5d5e0', borderRadius: 3, cursor: 'pointer', padding: '2px 6px' }}>Clear</button>
            : <span style={{ fontSize: 9, color: '#aaa' }}>inherited from CSS</span>
          }
        </div>
      </div>

      {/* ── Position ─────────────────────────────────── */}
      <div className="field">
        <label className="field__label">X Position — {current.x ?? 0}px</label>
        <input
          type="range"
          min={POS_MIN} max={POS_MAX} step={1}
          value={current.x ?? 0}
          onChange={e => onSet('x', parseInt(e.target.value, 10))}
          style={{ width: '100%' }}
        />
      </div>

      <div className="field">
        <label className="field__label">Y Position — {current.y ?? 0}px</label>
        <input
          type="range"
          min={POS_MIN} max={POS_MAX} step={1}
          value={current.y ?? 0}
          onChange={e => onSet('y', parseInt(e.target.value, 10))}
          style={{ width: '100%' }}
        />
      </div>

      {/* ── Margin ───────────────────────────────────── */}
      <div className="field">
        <label className="field__label">Margin</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
          <SpacingInput label="Top"    value={current.marginTop    ?? 0} min={MAR_MIN} max={MAR_MAX} onChange={v => onSet('marginTop',    v)} />
          <SpacingInput label="Bottom" value={current.marginBottom ?? 0} min={MAR_MIN} max={MAR_MAX} onChange={v => onSet('marginBottom', v)} />
          <SpacingInput label="Left"   value={current.marginLeft   ?? 0} min={MAR_MIN} max={MAR_MAX} onChange={v => onSet('marginLeft',   v)} />
          <SpacingInput label="Right"  value={current.marginRight  ?? 0} min={MAR_MIN} max={MAR_MAX} onChange={v => onSet('marginRight',  v)} />
        </div>
      </div>

      {/* ── Padding ──────────────────────────────────── */}
      <div className="field">
        <label className="field__label">Padding</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px' }}>
          <SpacingInput label="Top"    value={current.paddingTop    ?? 0} min={PAD_MIN} max={PAD_MAX} onChange={v => onSet('paddingTop',    v)} />
          <SpacingInput label="Bottom" value={current.paddingBottom ?? 0} min={PAD_MIN} max={PAD_MAX} onChange={v => onSet('paddingBottom', v)} />
          <SpacingInput label="Left"   value={current.paddingLeft   ?? 0} min={PAD_MIN} max={PAD_MAX} onChange={v => onSet('paddingLeft',   v)} />
          <SpacingInput label="Right"  value={current.paddingRight  ?? 0} min={PAD_MIN} max={PAD_MAX} onChange={v => onSet('paddingRight',  v)} />
        </div>
      </div>
    </div>
  );
}

/**
 * TypoPanel — collapsible typography sub-panel, embedded at the bottom of any editor section.
 *
 * Props:
 *   keys: string[]        — typography section keys to render
 *   resetLabel: string    — used in the reset button text (e.g. "Itinerary")
 *   label: string         — toggle button label (defaults to "Typography")
 *   positionKey: string   — optional block-level position key (moves the whole section)
 */
export default function TypoPanel({ keys, resetLabel, label, positionKey }) {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useBrochure();
  const typo = state.tour.typography || {};
  const pos  = positionKey ? getPosition(state.tour.positions || {}, positionKey) : null;

  const set = (section, field, value) =>
    dispatch({ type: 'UPDATE_TYPOGRAPHY', section, field, value });

  const setPos = (axis, value) =>
    dispatch({ type: 'UPDATE_POSITION', key: positionKey, axis, value });

  const resetAll = () => {
    for (const key of keys) {
      dispatch({ type: 'RESET_TYPOGRAPHY_SECTION', section: key });
    }
    if (positionKey) dispatch({ type: 'RESET_POSITION', key: positionKey });
  };

  return (
    <div className="typo-panel">
      <button
        type="button"
        className={`typo-panel__toggle${open ? ' is-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="typo-panel__toggle-label">{label || 'Typography'}</span>
        <span className="typo-panel__chevron" aria-hidden="true" />
      </button>

      {open && (
        <div className="typo-panel__body">
          {keys.map(key => (
            <TypoGroup
              key={key}
              sectionKey={key}
              current={getTypo(typo, key)}
              onSet={(f, v) => set(key, f, v)}
            />
          ))}

          {pos && (
            <div className="typo-group">
              <span className="typo-group__label">Section Position</span>
              <div className="field">
                <label className="field__label">X — {pos.x}px</label>
                <input
                  type="range"
                  min={POS_MIN} max={POS_MAX} step={1}
                  value={pos.x}
                  onChange={e => setPos('x', parseInt(e.target.value, 10))}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="field">
                <label className="field__label">Y — {pos.y}px</label>
                <input
                  type="range"
                  min={POS_MIN} max={POS_MAX} step={1}
                  value={pos.y}
                  onChange={e => setPos('y', parseInt(e.target.value, 10))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

          <button
            type="button"
            className="typo-panel__reset"
            onClick={resetAll}
          >
            Reset {resetLabel} Typography
          </button>
        </div>
      )}
    </div>
  );
}
