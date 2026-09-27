import React from 'react';
import { useBrochure } from '../../context/BrochureContext';

const DESIGNS = [
  { id: 'classic',      label: 'Design 1 — Current' },
  { id: 'mexico-city',  label: 'Design 2 — Mexico City' },
];

// Small CSS-drawn thumbnails — no image asset needed, and they stay in sync
// with each design's actual layout shape (white hero + navy strip + grid
// for classic; full-bleed photo + top/bottom text bands for Mexico City).
function ClassicThumb() {
  return (
    <svg viewBox="0 0 68 88" className="p1design-thumb">
      <rect x="0" y="0" width="68" height="88" fill="#F8F7F5" />
      <rect x="0" y="0" width="68" height="30" fill="#ffffff" />
      <rect x="14" y="10" width="40" height="4" rx="1" fill="#1A1A2E" />
      <rect x="20" y="17" width="28" height="3" rx="1" fill="#C4973A" />
      <rect x="0" y="30" width="68" height="7" fill="#1A3160" />
      <rect x="0" y="37" width="34" height="25" fill="#D8D4C8" />
      <rect x="34" y="37" width="34" height="25" fill="#C9C3B4" />
      <rect x="0" y="62" width="34" height="0" fill="none" />
      <rect x="0" y="62" width="68" height="26" fill="#1A3160" />
      <rect x="8" y="70" width="18" height="4" rx="1" fill="#ffffff" />
      <rect x="8" y="76" width="14" height="3" rx="1" fill="#ffffff" opacity="0.6" />
      <rect x="44" y="70" width="16" height="6" rx="1" fill="#ffffff" />
    </svg>
  );
}

function MexicoCityThumb() {
  return (
    <svg viewBox="0 0 68 88" className="p1design-thumb">
      <defs>
        <linearGradient id="p1designMcSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE6D2" />
          <stop offset="100%" stopColor="#B79A6B" />
        </linearGradient>
        <linearGradient id="p1designMcShadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="68" height="88" fill="url(#p1designMcSky)" />
      <rect x="16" y="10" width="36" height="3" rx="1" fill="#3A3226" />
      <rect x="10" y="16" width="48" height="6" rx="1" fill="#3A3226" />
      <rect x="18" y="24" width="32" height="3" rx="1" fill="#8A6A3A" />
      <rect x="0" y="40" width="68" height="48" fill="url(#p1designMcShadow)" />
      <rect x="14" y="66" width="40" height="3" rx="1" fill="#ffffff" />
      <rect x="8" y="74" width="14" height="4" rx="1" fill="#ffffff" />
      <rect x="46" y="74" width="14" height="4" rx="1" fill="#ffffff" />
      <rect x="12" y="81" width="44" height="2.5" rx="1" fill="#ffffff" opacity="0.75" />
    </svg>
  );
}

const THUMBS = {
  classic: ClassicThumb,
  'mexico-city': MexicoCityThumb,
};

export default function Page1DesignSection() {
  const { state, dispatch } = useBrochure();
  const current = state.tour.page1Design ?? 'classic';

  const select = (id) => dispatch({ type: 'UPDATE_FIELD', field: 'page1Design', value: id });

  return (
    <div>
      <p style={{ fontSize: 11, color: '#6B6B7A', lineHeight: 1.45, margin: '0 0 12px' }}>
        Choose the layout used for the brochure cover (Page 1). Switching designs does not
        change any tour content — only how Page 1 is laid out.
      </p>
      <div className="p1design-grid">
        {DESIGNS.map(({ id, label }) => {
          const Thumb = THUMBS[id];
          const active = current === id;
          return (
            <button
              key={id}
              type="button"
              className={`p1design-card${active ? ' is-active' : ''}`}
              onClick={() => select(id)}
              aria-pressed={active}
            >
              <Thumb />
              <span className="p1design-card__label">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
