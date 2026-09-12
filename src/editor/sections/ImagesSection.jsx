import React from 'react';
import { ImageField } from '../fields/Field';
import { useBrochure } from '../../context/BrochureContext';
import { getImagePosition, IMAGE_POSITION_LABELS } from '../../data/imagePositions';
import { checkImages } from '../../safety/checks';
import SafetyBadge from '../components/SafetyBadge';

const IMAGE_KEYS = ['grid0', 'grid1', 'grid2', 'grid3', 'pricingHero'];
const DEFAULT_POS = { x: 50, y: 50, offsetX: 0, offsetY: 0, scale: 1 };

function ImagePositionSliders({ label, pos, onSet, onReset, warning }) {
  return (
    <div className="position-group" style={{ marginTop: 'var(--space-3)' }}>
      <div className="position-group__header">
        <span className="position-group__label">{label}</span>
        <button type="button" className="position-group__reset" onClick={onReset}>Reset</button>
      </div>
      {warning && <SafetyBadge warnings={[warning]} />}

      <div className="field">
        <label className="field__label">Crop Horizontal — {Math.round(pos.x)}%</label>
        <input type="range" min={0} max={100} step={1} value={pos.x}
          onChange={e => onSet({ ...pos, x: parseInt(e.target.value, 10) })}
          style={{ width: '100%' }} />
      </div>
      <div className="field">
        <label className="field__label">Crop Vertical — {Math.round(pos.y)}%</label>
        <input type="range" min={0} max={100} step={1} value={pos.y}
          onChange={e => onSet({ ...pos, y: parseInt(e.target.value, 10) })}
          style={{ width: '100%' }} />
      </div>
      <div className="field">
        <label className="field__label">X Offset — {pos.offsetX ?? 0}px</label>
        <input type="range" min={-200} max={200} step={1} value={pos.offsetX ?? 0}
          onChange={e => onSet({ ...pos, offsetX: parseInt(e.target.value, 10) })}
          style={{ width: '100%' }} />
      </div>
      <div className="field">
        <label className="field__label">Y Offset — {pos.offsetY ?? 0}px</label>
        <input type="range" min={-200} max={200} step={1} value={pos.offsetY ?? 0}
          onChange={e => onSet({ ...pos, offsetY: parseInt(e.target.value, 10) })}
          style={{ width: '100%' }} />
      </div>
      <div className="field">
        <label className="field__label">Scale — {(pos.scale ?? 1).toFixed(2)}×</label>
        <input type="range" min={0.5} max={2.0} step={0.05} value={pos.scale ?? 1}
          onChange={e => onSet({ ...pos, scale: parseFloat(e.target.value) })}
          style={{ width: '100%' }} />
      </div>
    </div>
  );
}

export default function ImagesSection() {
  const { state, dispatch } = useBrochure();
  const { grid } = state.tour.photos;
  const imagePositions = state.tour.imagePositions ?? {};

  const setPos = (key, value) =>
    dispatch({ type: 'UPDATE_IMAGE_POSITION', key, value });

  const resetPos = (key) =>
    dispatch({ type: 'UPDATE_IMAGE_POSITION', key, value: { ...DEFAULT_POS } });

  const resetAll = () =>
    dispatch({ type: 'RESET_IMAGE_POSITIONS' });

  const imgWarnings = checkImages(imagePositions);
  const getImgWarning = key => imgWarnings.find(w => w.id === `img-${key}`) ?? null;

  return (
    <div>
      <div className="field__label" style={{ marginBottom: 8 }}>Cover Grid (2×2)</div>

      {grid.map((photo, i) => {
        const key = `grid${i}`;
        return (
          <div key={i}>
            <ImageField
              label={`Photo ${i + 1}${photo.city ? ` — ${photo.city}` : ''}`}
              value={photo.src}
              onChange={(v) => dispatch({ type: 'UPDATE_GRID_PHOTO', index: i, value: v })}
            />
            <ImagePositionSliders
              label={`Photo ${i + 1}`}
              pos={getImagePosition(imagePositions, key)}
              onSet={(v) => setPos(key, v)}
              onReset={() => resetPos(key)}
              warning={getImgWarning(key)}
            />
          </div>
        );
      })}

      <span className="field-group-label">Pricing Hero</span>
      <ImageField
        label="Pricing Hero Image"
        value={state.tour.photos.pricingHero?.src}
        onChange={(v) => dispatch({ type: 'UPDATE_PRICING_HERO', value: v })}
      />
      <ImagePositionSliders
        label="Pricing Hero"
        pos={getImagePosition(imagePositions, 'pricingHero')}
        onSet={(v) => setPos('pricingHero', v)}
        onReset={() => resetPos('pricingHero')}
        warning={getImgWarning('pricingHero')}
      />

      <button
        type="button"
        className="typo-panel__reset"
        onClick={resetAll}
        style={{ marginTop: 'var(--space-4)' }}
      >
        Reset All Image Positions
      </button>

      <p style={{ fontSize: 10, color: '#6B6B7A', lineHeight: 1.45, marginTop: 'var(--space-3)' }}>
        Tip: Use <strong>⤢ Drag Images</strong> in the preview toolbar to drag-to-pan images directly.
        Crop pans within the frame; X/Y Offset moves the image element; Scale zooms it.
      </p>
    </div>
  );
}
