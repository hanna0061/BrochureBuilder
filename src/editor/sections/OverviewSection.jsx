import React from 'react';
import { useBrochure } from '../../context/BrochureContext';

export default function OverviewSection() {
  const { state, dispatch } = useBrochure();
  const overview = state.tour.overview || [];

  return (
    <div>
      <div className="array-field__list">
        {overview.map((para, i) => (
          <div key={i} className="array-field__item" style={{ alignItems: 'flex-start' }}>
            <textarea
              className="field__textarea"
              value={para}
              onChange={(e) => dispatch({ type: 'UPDATE_OVERVIEW', index: i, value: e.target.value })}
              rows={4}
              style={{ flex: 1 }}
              placeholder="Overview paragraph…"
            />
            <button
              className="array-field__remove"
              onClick={() => dispatch({ type: 'REMOVE_OVERVIEW', index: i })}
              type="button"
              aria-label="Remove paragraph"
              style={{ marginTop: 4 }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        className="array-field__add"
        onClick={() => dispatch({ type: 'ADD_OVERVIEW' })}
        type="button"
        style={{ marginTop: overview.length > 0 ? 8 : 0 }}
      >
        + Add Paragraph
      </button>
    </div>
  );
}
