import React from 'react';
import { useBrochure } from '../../context/BrochureContext';
import { COLOR_DEFAULTS, COLOR_LABELS } from '../../data/colors';
import { checkColors } from '../../safety/checks';
import SafetyBadge from '../components/SafetyBadge';

// footerBg and footerText are now controlled in FooterSection
const COLOR_KEYS = ['navy', 'gold', 'headings', 'bodyText', 'navbarBg', 'navbarText'];

function ColorField({ label, value, onChange }) {
  return (
    <div className="color-field">
      <label className="field__label">{label}</label>
      <div className="color-field__row">
        <input
          type="color"
          className="color-field__picker"
          value={value}
          onChange={e => onChange(e.target.value)}
        />
        <input
          type="text"
          className="color-field__hex field__input"
          value={value}
          onChange={e => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && onChange(e.target.value)}
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export default function ColorsSection() {
  const { state, dispatch } = useBrochure();
  const colors = state.tour.colors ?? {};

  const getColor = (key) => colors[key] ?? COLOR_DEFAULTS[key];
  const set = (key, value) => dispatch({ type: 'UPDATE_COLOR', key, value });
  const warnings = checkColors(colors).filter(w => w.section === 'colors');
  const resetAll = () => {
    if (window.confirm('Reset all colors to defaults?')) {
      dispatch({ type: 'RESET_COLORS' });
    }
  };

  return (
    <div>
      <SafetyBadge warnings={warnings} />
      {COLOR_KEYS.map(key => (
        <ColorField
          key={key}
          label={COLOR_LABELS[key]}
          value={getColor(key)}
          onChange={v => set(key, v)}
        />
      ))}

      <button
        type="button"
        className="typo-panel__reset"
        onClick={resetAll}
        style={{ marginTop: 'var(--space-3)' }}
      >
        Reset All Colors
      </button>
    </div>
  );
}
