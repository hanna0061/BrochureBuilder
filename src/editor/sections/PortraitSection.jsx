import React from 'react';
import { ImageField } from '../fields/Field';
import { useBrochure } from '../../context/BrochureContext';

const DEFAULT = { src: null, size: 160, x: 0, y: 0 };

export default function PortraitSection() {
  const { state, dispatch } = useBrochure();
  const portrait = state.tour.coverPortrait ?? DEFAULT;

  const set = (field, value) =>
    dispatch({ type: 'UPDATE_COVER_PORTRAIT', field, value });

  return (
    <div>
      <p style={{ fontSize: 10, color: '#6B6B7A', lineHeight: 1.45, marginBottom: 'var(--space-3)' }}>
        Optional circular portrait centered over the cover photo grid. Leave blank to hide.
      </p>

      <ImageField
        label="Priest Portrait"
        value={portrait.src ?? ''}
        onChange={(v) => set('src', v || null)}
      />

      {portrait.src && (
        <>
          <span className="field-group-label">Size</span>
          <div className="field">
            <label className="field__label">Diameter — {portrait.size ?? 160}px</label>
            <input
              type="range"
              min={80}
              max={280}
              step={4}
              value={portrait.size ?? 160}
              onChange={(e) => set('size', parseInt(e.target.value, 10))}
              style={{ width: '100%' }}
            />
          </div>

          <span className="field-group-label">Position</span>
          <div className="field">
            <label className="field__label">X Offset — {portrait.x ?? 0}px</label>
            <input
              type="range"
              min={-150}
              max={150}
              step={1}
              value={portrait.x ?? 0}
              onChange={(e) => set('x', parseInt(e.target.value, 10))}
              style={{ width: '100%' }}
            />
          </div>
          <div className="field">
            <label className="field__label">Y Offset — {portrait.y ?? 0}px</label>
            <input
              type="range"
              min={-150}
              max={150}
              step={1}
              value={portrait.y ?? 0}
              onChange={(e) => set('y', parseInt(e.target.value, 10))}
              style={{ width: '100%' }}
            />
          </div>

          <button
            type="button"
            className="typo-panel__reset"
            onClick={() => set('src', null)}
            style={{ marginTop: 'var(--space-3)' }}
          >
            Remove Portrait
          </button>
        </>
      )}
    </div>
  );
}
