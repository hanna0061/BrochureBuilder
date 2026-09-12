import React from 'react';
import { useBrochure } from '../../context/BrochureContext';
import { POSITION_DEFAULTS, POSITION_LABELS, getPosition } from '../../data/positions';
import { checkPositions } from '../../safety/checks';
import SafetyBadge from '../components/SafetyBadge';

const POS_MIN = -100, POS_MAX = 100;
// 'footer' position is now controlled in FooterSection
const POSITION_KEYS = ['coverTitle', 'coverSubtitle', 'destinationStrip', 'infoBar', 'itinerary', 'pricing', 'whyTravel', 'terms'];

function PositionGroup({ posKey, pos, onSet, onReset, warning }) {
  return (
    <div className="position-group">
      <div className="position-group__header">
        <span className="position-group__label">{POSITION_LABELS[posKey]}</span>
        <button type="button" className="position-group__reset" onClick={onReset}>
          Reset
        </button>
      </div>
      {warning && <SafetyBadge warnings={[warning]} />}

      <div className="field">
        <label className="field__label">X — {pos.x}px</label>
        <input
          type="range"
          min={POS_MIN} max={POS_MAX} step={1}
          value={pos.x}
          onChange={e => onSet('x', parseInt(e.target.value, 10))}
          style={{ width: '100%' }}
        />
      </div>

      <div className="field">
        <label className="field__label">Y — {pos.y}px</label>
        <input
          type="range"
          min={POS_MIN} max={POS_MAX} step={1}
          value={pos.y}
          onChange={e => onSet('y', parseInt(e.target.value, 10))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

export default function PositionsSection() {
  const { state, dispatch } = useBrochure();
  const positions = state.tour.positions ?? {};

  const set = (key, axis, value) =>
    dispatch({ type: 'UPDATE_POSITION', key, axis, value });

  const reset = (key) =>
    dispatch({ type: 'RESET_POSITION', key });

  const posWarnings = checkPositions(positions);
  const getWarning = key => posWarnings.find(w => w.id === `pos-${key}`) ?? null;

  const resetAll = () => {
    if (window.confirm('Reset all content positions to default?')) {
      dispatch({ type: 'RESET_ALL_POSITIONS' });
    }
  };

  return (
    <div>
      <p style={{ fontSize: 10, color: '#6B6B7A', lineHeight: 1.45, marginBottom: 'var(--space-3)' }}>
        Nudge content sections within the page. X moves left/right, Y moves up/down.
      </p>

      {POSITION_KEYS.map(key => (
        <PositionGroup
          key={key}
          posKey={key}
          pos={getPosition(positions, key)}
          onSet={(axis, value) => set(key, axis, value)}
          onReset={() => reset(key)}
          warning={getWarning(key)}
        />
      ))}

      <button
        type="button"
        className="typo-panel__reset"
        onClick={resetAll}
        style={{ marginTop: 'var(--space-3)' }}
      >
        Reset All Positions
      </button>
    </div>
  );
}
