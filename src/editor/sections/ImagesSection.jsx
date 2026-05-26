import React from 'react';
import { ImageField } from '../fields/Field';
import { useBrochure } from '../../context/BrochureContext';

export default function ImagesSection() {
  const { state, dispatch } = useBrochure();
  const { grid } = state.tour.photos;

  return (
    <div>
      <div className="field__label" style={{ marginBottom: 8 }}>Cover Grid (2×2)</div>

      {grid.map((photo, i) => (
        <ImageField
          key={i}
          label={`Photo ${i + 1}${photo.city ? ` — ${photo.city}` : ''}`}
          value={photo.src}
          onChange={(v) => dispatch({ type: 'UPDATE_GRID_PHOTO', index: i, value: v })}
        />
      ))}
    </div>
  );
}
