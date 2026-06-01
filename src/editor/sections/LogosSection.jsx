import React from 'react';
import { useBrochure } from '../../context/BrochureContext';
import { LOGO_DEFAULTS, LOGO_LABELS, getLogo } from '../../data/logos';
import { checkLogos } from '../../safety/checks';
import SafetyBadge from '../components/SafetyBadge';

// footer logo is controlled in FooterSection
const LOGO_KEYS = ['cover', 'navbar'];

const SIZE_MIN = 20, SIZE_MAX = 400;
const OFFSET_MIN = -150, OFFSET_MAX = 150;

function LogoGroup({ logoKey, logo, onSet, onReset, warning }) {
  return (
    <div className="position-group">
      <div className="position-group__header">
        <span className="position-group__label">{LOGO_LABELS[logoKey]}</span>
        <button type="button" className="position-group__reset" onClick={onReset}>Reset</button>
      </div>
      {warning && <SafetyBadge warnings={[warning]} />}

      <div className="field">
        <label className="field__label">Width — {logo.width ?? logo.size ?? 56}px</label>
        <input type="range" min={SIZE_MIN} max={SIZE_MAX} step={2}
          value={logo.width ?? logo.size ?? 56}
          onChange={e => onSet('width', parseInt(e.target.value, 10))}
          style={{ width: '100%' }} />
      </div>

      <div className="field">
        <label className="field__label">
          Height — {(logo.height > 0) ? `${logo.height}px` : 'auto'}
        </label>
        <input type="range" min={0} max={SIZE_MAX} step={2}
          value={logo.height ?? 0}
          onChange={e => onSet('height', parseInt(e.target.value, 10))}
          style={{ width: '100%' }} />
        <span style={{ fontSize: 9, color: '#6B6B7A' }}>0 = auto (preserve aspect ratio)</span>
      </div>

      <div className="field">
        <label className="field__label">X Offset — {logo.x}px</label>
        <input type="range" min={OFFSET_MIN} max={OFFSET_MAX} step={1} value={logo.x}
          onChange={e => onSet('x', parseInt(e.target.value, 10))}
          style={{ width: '100%' }} />
      </div>

      <div className="field">
        <label className="field__label">Y Offset — {logo.y}px</label>
        <input type="range" min={OFFSET_MIN} max={OFFSET_MAX} step={1} value={logo.y}
          onChange={e => onSet('y', parseInt(e.target.value, 10))}
          style={{ width: '100%' }} />
      </div>
    </div>
  );
}

export default function LogosSection() {
  const { state, dispatch } = useBrochure();
  const logos = state.tour.logos ?? {};

  const set = (key, field, value) =>
    dispatch({ type: 'UPDATE_LOGO', key, field, value });

  const reset = (key) =>
    dispatch({ type: 'RESET_LOGO', key });

  const logoWarnings = checkLogos(logos).filter(w => w.section === 'logos');
  const getLogoWarning = key => logoWarnings.find(w => w.id === `logo-${key}`) ?? null;

  const resetAll = () => {
    if (window.confirm('Reset cover and navbar logos to defaults?')) {
      dispatch({ type: 'RESET_ALL_LOGOS' });
    }
  };

  return (
    <div>
      <p style={{ fontSize: 10, color: '#6B6B7A', lineHeight: 1.45, marginBottom: 'var(--space-3)' }}>
        Footer logo is in the Footer section. Width/height changes stay within the logo's fixed layout slot.
      </p>

      {LOGO_KEYS.map(key => (
        <LogoGroup
          key={key}
          logoKey={key}
          logo={getLogo(logos, key)}
          onSet={(field, value) => set(key, field, value)}
          onReset={() => reset(key)}
          warning={getLogoWarning(key)}
        />
      ))}

      <button
        type="button"
        className="typo-panel__reset"
        onClick={resetAll}
        style={{ marginTop: 'var(--space-3)' }}
      >
        Reset All Logo Settings
      </button>
    </div>
  );
}
