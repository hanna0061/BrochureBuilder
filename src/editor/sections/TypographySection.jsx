import React from 'react';
import { useBrochure } from '../../context/BrochureContext';
import { FONT_OPTIONS, WEIGHT_OPTIONS, TYPOGRAPHY_DEFAULTS, getTypo } from '../../data/typography';

const FS_MIN  = 6;
const FS_MAX  = 72;
const LH_MIN  = 0.8;
const LH_MAX  = 3;
const LS_MIN  = -0.2;
const LS_MAX  = 0.5;
const POS_MIN = -200;
const POS_MAX = 200;

function clamp(v, min, max) {
  const n = parseFloat(v);
  if (isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function TypoGroup({ label, sectionKey, current, onSet, onReset }) {
  return (
    <div className="typo-group">
      <div className="typo-group__header">
        <span className="typo-group__label">{label}</span>
        <button
          type="button"
          className="typo-group__reset"
          onClick={onReset}
          title={`Reset ${label} to default`}
        >
          Reset
        </button>
      </div>

      {/* Font Family */}
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

      {/* Font Size */}
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

      {/* Font Weight */}
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

      {/* Line Height */}
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

      {/* Letter Spacing */}
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

      {/* Color */}
      <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
        <label className="field__label" style={{ marginBottom: 0 }}>Color</label>
        <input
          type="color"
          value={current.color || '#000000'}
          onChange={e => onSet('color', e.target.value)}
          style={{ width: 32, height: 24, border: '1px solid #d5d5e0', borderRadius: 3, cursor: 'pointer', padding: 0 }}
        />
        {current.color
          ? <button type="button" className="typo-group__reset" onClick={() => onSet('color', null)}>Clear</button>
          : <span style={{ fontSize: 9, color: '#aaa', fontFamily: "'Inter', sans-serif" }}>default</span>
        }
      </div>

      {/* X / Y Position */}
      <div className="field" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div>
          <label className="field__label">X — {current.x ?? 0}px</label>
          <input
            type="range"
            min={POS_MIN} max={POS_MAX} step={1}
            value={current.x ?? 0}
            onChange={e => onSet('x', parseInt(e.target.value, 10))}
            style={{ width: '100%' }}
          />
        </div>
        <div>
          <label className="field__label">Y — {current.y ?? 0}px</label>
          <input
            type="range"
            min={POS_MIN} max={POS_MAX} step={1}
            value={current.y ?? 0}
            onChange={e => onSet('y', parseInt(e.target.value, 10))}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TypographySection() {
  const { state, dispatch } = useBrochure();
  const typo = state.tour.typography || {};

  const set = (section, field, value) =>
    dispatch({ type: 'UPDATE_TYPOGRAPHY', section, field, value });

  const reset = (section) =>
    dispatch({ type: 'RESET_TYPOGRAPHY_SECTION', section });

  const group = (label, key) => (
    <TypoGroup
      key={key}
      label={label}
      sectionKey={key}
      current={getTypo(typo, key)}
      onSet={(f, v) => set(key, f, v)}
      onReset={() => reset(key)}
    />
  );

  return (
    <div>

      <span className="field-group-label" style={{ marginTop: 0, borderTop: 'none' }}>
        Cover Page
      </span>
      {group('Cover Title', 'coverTitle')}
      {group('Cover Subtitle', 'coverSubtitle')}
      {group('Destination Strip', 'destinationStrip')}

      <span className="field-group-label">Cover Info Bar</span>
      {group('Month', 'infobarMonth')}
      {group('Date Range', 'infobarDateRange')}
      {group('Price', 'infobarPrice')}
      {group('Departure Text', 'infobarDeparture')}
      {group('Book Now Text', 'infobarBookNow')}

      <span className="field-group-label">Itinerary Pages</span>
      {group('Itinerary Headings', 'itineraryHeading')}
      {group('Itinerary Body Text', 'itineraryBody')}

      <span className="field-group-label">Pricing Page</span>
      {group('Pricing Headings', 'pricingHeading')}
      {group('Pricing Body Text', 'pricingBody')}
      {group('Tour Includes List', 'tourIncludes')}
      {group('Why Travel Heading', 'whyTravelHeading')}
      {group('Why Travel Body Text', 'whyTravel')}

      <span className="field-group-label">Terms &amp; Conditions — Page 4</span>
      {group('Terms Title', 'termsTitle')}
      {group('Terms Intro', 'termsIntro')}
      {group('Terms Body', 'termsBody')}
      {group('Terms Disclaimer', 'termsDisclaimer')}
      {group('Footer Company Name', 'termsFooter')}
      {group('Footer Contact', 'footerContact')}

    </div>
  );
}
