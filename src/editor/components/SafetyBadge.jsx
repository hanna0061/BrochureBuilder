import React, { useState } from 'react';

export default function SafetyBadge({ warnings }) {
  const [expanded, setExpanded] = useState(false);

  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="safety-badge">
      <button
        type="button"
        className="safety-badge__trigger"
        onClick={() => setExpanded(e => !e)}
      >
        <span className="safety-badge__icon">⚠</span>
        <span className="safety-badge__text">{warnings[0].message}</span>
        {warnings.length > 1 && (
          <span className="safety-badge__count">{warnings.length}</span>
        )}
        <span className="safety-badge__chevron">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <ul className="safety-badge__list">
          {warnings.map(w => (
            <li key={w.id} className="safety-badge__item">{w.detail}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
