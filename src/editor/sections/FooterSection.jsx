import React from 'react';
import TypoPanel from '../components/TypoPanel';
import { useBrochure } from '../../context/BrochureContext';
import { COLOR_DEFAULTS } from '../../data/colors';
import { getPosition } from '../../data/positions';
import { getLogo, LOGO_DEFAULTS } from '../../data/logos';
import { checkColors, checkFooterPosition, checkLogos } from '../../safety/checks';
import SafetyBadge from '../components/SafetyBadge';

const SIZE_MIN = 20, SIZE_MAX = 400;
const OFFSET_MIN = -150, OFFSET_MAX = 150;
const POS_MIN = -100, POS_MAX = 100;

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

export default function FooterSection() {
  const { state, dispatch } = useBrochure();

  // Colors
  const colors    = state.tour.colors ?? {};
  const getColor  = key => colors[key] ?? COLOR_DEFAULTS[key];
  const setColor  = (key, val) => dispatch({ type: 'UPDATE_COLOR', key, value: val });

  // Position
  const pos     = getPosition(state.tour.positions, 'footer');
  const setPos  = (axis, val) => dispatch({ type: 'UPDATE_POSITION', key: 'footer', axis, value: val });
  const resetPos = () => dispatch({ type: 'RESET_POSITION', key: 'footer' });

  // Logo
  const logo       = getLogo(state.tour.logos, 'footer');
  const setLogo    = (field, val) => dispatch({ type: 'UPDATE_LOGO', key: 'footer', field, value: val });
  const resetLogo  = () => dispatch({ type: 'RESET_LOGO', key: 'footer' });

  // Safety warnings for the footer section
  const footerWarnings = [
    ...checkColors(state.tour.colors).filter(w => w.section === 'footer'),
    ...checkFooterPosition(state.tour.positions),
    ...checkLogos(state.tour.logos).filter(w => w.section === 'footer'),
  ];

  return (
    <div>
      <SafetyBadge warnings={footerWarnings} />

      {/* Typography */}
      <TypoPanel keys={['termsFooter']}      resetLabel="Footer Heading"   label="Footer Heading" />
      <TypoPanel keys={['footerParagraph']}  resetLabel="Footer Paragraph" label="Footer Paragraph" />
      <TypoPanel keys={['footerContact']}    resetLabel="Footer Contact"   label="Footer Contact Info" />

      {/* Colors */}
      <span className="field-group-label">Footer Colors</span>
      <ColorField
        label="Background"
        value={getColor('footerBg')}
        onChange={v => setColor('footerBg', v)}
      />
      <ColorField
        label="Text"
        value={getColor('footerText')}
        onChange={v => setColor('footerText', v)}
      />

      {/* Position */}
      <span className="field-group-label">Footer Position</span>
      <div className="position-group">
        <div className="field">
          <label className="field__label">X — {pos.x}px</label>
          <input type="range" min={POS_MIN} max={POS_MAX} step={1} value={pos.x}
            onChange={e => setPos('x', parseInt(e.target.value, 10))}
            style={{ width: '100%' }} />
        </div>
        <div className="field">
          <label className="field__label">Y — {pos.y}px</label>
          <input type="range" min={POS_MIN} max={POS_MAX} step={1} value={pos.y}
            onChange={e => setPos('y', parseInt(e.target.value, 10))}
            style={{ width: '100%' }} />
        </div>
        <button type="button" className="position-group__reset" onClick={resetPos}
          style={{ marginTop: 4 }}>
          Reset Position
        </button>
      </div>

      {/* Logo */}
      <span className="field-group-label">Footer Logo</span>
      <div className="position-group">
        <div className="field">
          <label className="field__label">Width — {logo.width ?? logo.size ?? 100}px</label>
          <input type="range" min={SIZE_MIN} max={SIZE_MAX} step={2}
            value={logo.width ?? logo.size ?? 100}
            onChange={e => setLogo('width', parseInt(e.target.value, 10))}
            style={{ width: '100%' }} />
        </div>
        <div className="field">
          <label className="field__label">
            Height — {(logo.height > 0) ? `${logo.height}px` : 'auto'}
          </label>
          <input type="range" min={0} max={SIZE_MAX} step={2}
            value={logo.height ?? 0}
            onChange={e => setLogo('height', parseInt(e.target.value, 10))}
            style={{ width: '100%' }} />
          <span style={{ fontSize: 9, color: '#6B6B7A' }}>0 = auto (preserve aspect ratio)</span>
        </div>
        <div className="field">
          <label className="field__label">X Offset — {logo.x}px</label>
          <input type="range" min={OFFSET_MIN} max={OFFSET_MAX} step={1} value={logo.x}
            onChange={e => setLogo('x', parseInt(e.target.value, 10))}
            style={{ width: '100%' }} />
        </div>
        <div className="field">
          <label className="field__label">Y Offset — {logo.y}px</label>
          <input type="range" min={OFFSET_MIN} max={OFFSET_MAX} step={1} value={logo.y}
            onChange={e => setLogo('y', parseInt(e.target.value, 10))}
            style={{ width: '100%' }} />
        </div>
        <button type="button" className="position-group__reset" onClick={resetLogo}
          style={{ marginTop: 4 }}>
          Reset Logo
        </button>
      </div>
    </div>
  );
}
