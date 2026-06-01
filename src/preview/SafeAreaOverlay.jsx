import React from 'react';

// Matches the printable safe-area margin in brochure.css
const MARGIN = 18;

export default function SafeAreaOverlay() {
  const shade = { position: 'absolute', background: 'rgba(255,140,0,0.14)', pointerEvents: 'none' };
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}
    >
      {/* margin shading — top / bottom / left / right */}
      <div style={{ ...shade, top: 0,      left: 0, right: 0,      height: MARGIN }} />
      <div style={{ ...shade, bottom: 0,   left: 0, right: 0,      height: MARGIN }} />
      <div style={{ ...shade, top: MARGIN, left: 0, bottom: MARGIN, width: MARGIN  }} />
      <div style={{ ...shade, top: MARGIN, right: 0, bottom: MARGIN, width: MARGIN }} />

      {/* dashed safe-area border */}
      <div style={{
        position: 'absolute',
        top: MARGIN, left: MARGIN, right: MARGIN, bottom: MARGIN,
        border: '1.5px dashed rgba(255,140,0,0.70)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
