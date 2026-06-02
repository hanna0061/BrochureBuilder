import React, { useState } from 'react';
import { useBrochure } from '../../context/BrochureContext';
import { FONT_OPTIONS, WEIGHT_OPTIONS, getTypo } from '../../data/typography';

const FS_MIN = 6,  FS_MAX = 72;
const LH_MIN = 0.8, LH_MAX = 3;
const LS_MIN = -0.2, LS_MAX = 0.5;

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
  itineraryOvernight: 'Overnight / Meals',
  pricingBarTitle:  'Pricing Bar Title',
  pricingPrice:     'Price Amount Display',
  pricingHeading:   'Pricing Headings',
  pricingBody:      'Pricing Body Text',
  tourIncludes:     'Tour Includes List',
  whyTravel:        'Why Travel With Us',
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

function TypoGroup({ sectionKey, current, onSet }) {
  return (
    <div className="typo-group">
      <span className="typo-group__label">{GROUP_LABELS[sectionKey] || sectionKey}</span>

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
    </div>
  );
}

/**
 * TypoPanel — collapsible typography sub-panel, embedded at the bottom of any editor section.
 *
 * Props:
 *   keys: string[]      — typography section keys to render
 *   resetLabel: string  — used in the reset button text (e.g. "Itinerary")
 *   label: string       — toggle button label (defaults to "Typography")
 */
export default function TypoPanel({ keys, resetLabel, label }) {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useBrochure();
  const typo = state.tour.typography || {};

  const set = (section, field, value) =>
    dispatch({ type: 'UPDATE_TYPOGRAPHY', section, field, value });

  const resetAll = () => {
    for (const key of keys) {
      dispatch({ type: 'RESET_TYPOGRAPHY_SECTION', section: key });
    }
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
