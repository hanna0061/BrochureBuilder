import React, { useEffect, useState } from 'react';

/**
 * PrintResolutionInfo — read-only print-quality readout for one image slot.
 *
 * Measures the slot exactly as it is rendered in the live preview, so it
 * follows the active Page 1 design, crop and zoom automatically:
 *   - intrinsic pixels  = the <img>'s decoded naturalWidth/Height
 *   - printed size      = its layout box (offsetWidth/Height — unaffected by
 *                         the preview's shrink-to-fit transform) at 96 CSS px/in
 *   - object-fit: cover = the image is scaled by max(boxW/natW, boxH/natH),
 *                         i.e. DPI is computed on the cropped area actually shown
 *   - zoom              = the image's own Scale setting magnifies it further
 * Effective DPI = natural px per printed inch. Nothing here resizes, converts
 * or replaces the image — it only reads.
 *
 * `findImg` returns the slot's <img> inside the preview, null when the slot
 * isn't used by the current layout, or undefined when the preview isn't
 * mounted (then nothing is shown rather than a wrong "not used" message).
 */
const CSS_PX_PER_INCH = 96;

function measure(img) {
  if (!img || !img.naturalWidth || !img.offsetWidth) return null;
  const natW = img.naturalWidth;
  const natH = img.naturalHeight;
  const boxW = img.offsetWidth;
  const boxH = img.offsetHeight;
  const fit = getComputedStyle(img).objectFit;
  const t = getComputedStyle(img).transform;
  const zoom = t && t !== 'none' ? Math.abs(new DOMMatrix(t).a) || 1 : 1;
  const k = fit === 'contain'
    ? Math.min(boxW / natW, boxH / natH)
    : Math.max(boxW / natW, boxH / natH);
  const dpi = Math.round(CSS_PX_PER_INCH / (k * zoom));
  // Pixel dimensions that would reach 300 DPI with the same crop/zoom.
  const factor = 300 / dpi;
  return {
    natW, natH, dpi,
    printW: (boxW / CSS_PX_PER_INCH).toFixed(1),
    printH: (boxH / CSS_PX_PER_INCH).toFixed(1),
    needW: Math.ceil(natW * factor),
    needH: Math.ceil(natH * factor),
  };
}

export default function PrintResolutionInfo({ src, findImg, deps = [] }) {
  const [info, setInfo] = useState(null);
  const [unused, setUnused] = useState(false);

  useEffect(() => {
    if (!src) { setInfo(null); setUnused(false); return undefined; }
    let img = null;
    let frame = 0;
    const update = () => {
      const found = findImg();
      img = found || null;
      setUnused(found === null);
      setInfo(measure(img));
    };
    // Wait a frame so the preview has rendered the current state first.
    frame = requestAnimationFrame(() => {
      update();
      if (img && !img.complete) img.addEventListener('load', update, { once: true });
    });
    return () => {
      cancelAnimationFrame(frame);
      if (img) img.removeEventListener('load', update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, ...deps]);

  if (!src) return null;
  if (unused) {
    return (
      <div className="print-res print-res--neutral">
        Not used by the current Page 1 design — no print check needed.
      </div>
    );
  }
  if (!info) return null;

  const status = info.dpi >= 300 ? 'good' : info.dpi >= 200 ? 'ok' : 'low';
  return (
    <div className={`print-res print-res--${status}`}>
      <div className="print-res__line">
        <span className="print-res__icon">{status === 'good' ? '✓' : '⚠'}</span>
        <span className="print-res__stats">
          {info.natW} × {info.natH} px · <strong>{info.dpi} DPI</strong> at print
          ({info.printW} × {info.printH} in)
        </span>
      </div>
      {status === 'good' && (
        <div className="print-res__msg">Print-ready.</div>
      )}
      {status === 'ok' && (
        <div className="print-res__msg">
          Acceptable, but may look slightly soft in print. For best results use a
          larger original (≈ {info.needW} × {info.needH} px for 300 DPI).
        </div>
      )}
      {status === 'low' && (
        <div className="print-res__msg">
          Low resolution — this will print blurry. Replace it with the original
          full-resolution photo before printing (≈ {info.needW} × {info.needH} px
          or larger for 300 DPI).
        </div>
      )}
    </div>
  );
}
