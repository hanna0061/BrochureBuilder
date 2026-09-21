import React, { useEffect, useRef, useState } from 'react';
import { useSelection } from '../context/SelectionContext';
import { useBrochure } from '../context/BrochureContext';
import { getTypo, FONT_OPTIONS, WEIGHT_OPTIONS } from '../data/typography';
import { getPosition } from '../data/positions';
import { getLogo } from '../data/logos';
import { getImagePosition, IMAGE_POSITION_DEFAULTS } from '../data/imagePositions';
import { COLOR_DEFAULTS } from '../data/colors';
import { ImageField } from './fields/Field';
import { getRegTypo, REG_TYPO_GROUP_LABELS } from '../registration/registrationFormTypography';
import RegTypoFields from '../registration/RegTypoFields';
import { QR_DEFAULT_SIZE } from '../registration/registrationFormDefaults';

const PANEL_W   = 268;
const FS_MIN    = 6,    FS_MAX    = 72;
const LH_MIN    = 0.8,  LH_MAX    = 3;
const LS_MIN    = -0.2, LS_MAX    = 0.5;
const POS_MIN   = -200, POS_MAX   = 200;
const LOGO_SZ_MIN  = 20,  LOGO_SZ_MAX  = 400;
const LOGO_OFF_MIN = -150, LOGO_OFF_MAX = 150;
const QR_SZ_MIN = 40, QR_SZ_MAX = 200;

function clamp(v, min, max) {
  const n = parseFloat(v);
  return isNaN(n) ? min : Math.max(min, Math.min(max, n));
}

const lbl = {
  display: 'block', fontSize: 9, fontWeight: 600, color: '#888',
  marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em',
};
const selSt = {
  width: '100%', padding: '4px 6px', border: '1px solid #d5d5e0',
  borderRadius: 4, fontSize: 10, fontFamily: "'Inter',sans-serif",
  background: '#fff', color: '#222', boxSizing: 'border-box',
};
const row2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 };
const resetBtn = {
  padding: '4px 10px', background: 'none', border: '1px solid #d5d5e0',
  borderRadius: 4, cursor: 'pointer', fontSize: 10, fontWeight: 600,
  color: '#888', letterSpacing: '0.04em', textTransform: 'uppercase',
  alignSelf: 'flex-start', fontFamily: "'Inter',sans-serif",
};
const textareaSt = {
  width: '100%', padding: '5px 7px', border: '1px solid #d5d5e0', borderRadius: 4,
  fontSize: 11, fontFamily: 'inherit', boxSizing: 'border-box', resize: 'vertical',
  lineHeight: 1.4, color: '#222',
};

function TextContent({ meta, tour, dispatch }) {
  const typo = meta.typographyKey ? getTypo(tour.typography, meta.typographyKey) : null;
  const pos  = meta.positionKey   ? getPosition(tour.positions, meta.positionKey) : null;

  const setT = (f, v) => dispatch({ type: 'UPDATE_TYPOGRAPHY', section: meta.typographyKey, field: f, value: v });
  const setP = (axis, v) => dispatch({ type: 'UPDATE_POSITION', key: meta.positionKey, axis, value: v });
  const reset = () => {
    if (meta.typographyKey) dispatch({ type: 'RESET_TYPOGRAPHY_SECTION', section: meta.typographyKey });
    if (meta.positionKey)   dispatch({ type: 'RESET_POSITION', key: meta.positionKey });
    if (meta.resetElemPos)  meta.resetElemPos(dispatch);
  };

  return (
    <>
      {/* Text */}
      <div>
        <label style={lbl}>Text</label>
        <textarea
          value={meta.getValue(tour) ?? ''}
          onChange={e => meta.setValue(dispatch, e.target.value)}
          rows={meta.textRows || 2}
          style={textareaSt}
        />
      </div>

      {/* Typography */}
      {typo && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 76px', gap:6 }}>
            <div>
              <label style={lbl}>Font</label>
              <select value={typo.fontFamily ?? ''} onChange={e => setT('fontFamily', e.target.value)} style={selSt}>
                {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Weight</label>
              <select value={typo.fontWeight ?? 400} onChange={e => setT('fontWeight', parseInt(e.target.value, 10))} style={selSt}>
                {WEIGHT_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
          </div>
          <div style={row2}>
            <div>
              <label style={lbl}>Size — {typo.fontSize}px</label>
              <input type="range" min={FS_MIN} max={FS_MAX} step={0.5} value={typo.fontSize ?? 12}
                onChange={e => setT('fontSize', clamp(e.target.value, FS_MIN, FS_MAX))} style={{ width:'100%' }} />
            </div>
            <div>
              <label style={lbl}>Line Ht — {(typo.lineHeight ?? LH_MIN).toFixed(2)}</label>
              <input type="range" min={LH_MIN} max={LH_MAX} step={0.05} value={typo.lineHeight ?? 1.4}
                onChange={e => setT('lineHeight', clamp(e.target.value, LH_MIN, LH_MAX))} style={{ width:'100%' }} />
            </div>
          </div>
          <div>
            <label style={lbl}>Spacing — {(typo.letterSpacing ?? 0).toFixed(3)}em</label>
            <input type="range" min={LS_MIN} max={LS_MAX} step={0.005} value={typo.letterSpacing ?? 0}
              onChange={e => setT('letterSpacing', clamp(e.target.value, LS_MIN, LS_MAX))} style={{ width:'100%' }} />
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:7 }}>
            <label style={{ ...lbl, marginBottom:0 }}>Color</label>
            <input type="color"
              value={typo.color || '#000000'}
              onChange={e => setT('color', e.target.value)}
              style={{ width:32, height:24, border:'1px solid #d5d5e0', borderRadius:3, cursor:'pointer', padding:0 }} />
            {typo.color
              ? <button type="button" onClick={() => setT('color', null)} style={resetBtn}>Clear</button>
              : <span style={{ fontSize:9, color:'#aaa' }}>inherited</span>
            }
          </div>

          {/* X/Y: per-element override when available (itinerary fields), else global typography.
              Suppressed when meta.noPosition is true — used by Page 4 locked elements. */}
          {!meta.noPosition && (
            meta.getElemPos ? (() => {
              const ep = meta.getElemPos(tour);
              return (
                <div style={row2}>
                  <div>
                    <label style={lbl}>X — {ep.x ?? 0}px</label>
                    <input type="range" min={POS_MIN} max={POS_MAX} step={1} value={ep.x ?? 0}
                      onChange={e => meta.setElemPos(dispatch, 'x', parseInt(e.target.value, 10))} style={{ width:'100%' }} />
                  </div>
                  <div>
                    <label style={lbl}>Y — {ep.y ?? 0}px</label>
                    <input type="range" min={POS_MIN} max={POS_MAX} step={1} value={ep.y ?? 0}
                      onChange={e => meta.setElemPos(dispatch, 'y', parseInt(e.target.value, 10))} style={{ width:'100%' }} />
                  </div>
                </div>
              );
            })() : (
              <div style={row2}>
                <div>
                  <label style={lbl}>X — {typo.x ?? 0}px</label>
                  <input type="range" min={POS_MIN} max={POS_MAX} step={1} value={typo.x ?? 0}
                    onChange={e => setT('x', parseInt(e.target.value, 10))} style={{ width:'100%' }} />
                </div>
                <div>
                  <label style={lbl}>Y — {typo.y ?? 0}px</label>
                  <input type="range" min={POS_MIN} max={POS_MAX} step={1} value={typo.y ?? 0}
                    onChange={e => setT('y', parseInt(e.target.value, 10))} style={{ width:'100%' }} />
                </div>
              </div>
            )
          )}
        </>
      )}

      {/* Color (global colorKey) */}
      {meta.colorKey && (
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <label style={{ ...lbl, marginBottom:0 }}>Color</label>
          <input type="color"
            value={tour.colors?.[meta.colorKey] ?? COLOR_DEFAULTS[meta.colorKey] ?? '#000000'}
            onChange={e => dispatch({ type:'UPDATE_COLOR', key:meta.colorKey, value:e.target.value })}
            style={{ width:32, height:24, border:'1px solid #d5d5e0', borderRadius:3, cursor:'pointer', padding:0 }} />
          <span style={{ fontSize:9, color:'#aaa' }}>global</span>
        </div>
      )}

      {/* Block-level position (section offset, rare) */}
      {pos && (
        <div style={row2}>
          <div>
            <label style={lbl}>Section X — {pos.x}px</label>
            <input type="range" min={POS_MIN} max={POS_MAX} step={1} value={pos.x}
              onChange={e => setP('x', parseInt(e.target.value, 10))} style={{ width:'100%' }} />
          </div>
          <div>
            <label style={lbl}>Section Y — {pos.y}px</label>
            <input type="range" min={POS_MIN} max={POS_MAX} step={1} value={pos.y}
              onChange={e => setP('y', parseInt(e.target.value, 10))} style={{ width:'100%' }} />
          </div>
        </div>
      )}

      <button type="button" onClick={reset} style={resetBtn}>Reset</button>
    </>
  );
}

function TextgramContent({ meta, tour, dispatch }) {
  const el = (tour.textElements ?? []).find((e) => e.id === meta.id);
  if (!el) return null;

  const set = (field, value) => dispatch({ type: 'UPDATE_TEXT_ELEMENT', id: el.id, field, value });
  const reset = () => dispatch({ type: 'RESET_TEXT_ELEMENT_STYLE', id: el.id });
  const duplicate = () => dispatch({ type: 'DUPLICATE_TEXT_ELEMENT', id: el.id });
  const remove = () => dispatch({ type: 'DELETE_TEXT_ELEMENT', id: el.id });

  return (
    <>
      {/* Text */}
      <div>
        <label style={lbl}>Text</label>
        <textarea
          value={el.text ?? ''}
          onChange={e => set('text', e.target.value)}
          rows={3}
          style={{ width:'100%', padding:'5px 7px', border:'1px solid #d5d5e0', borderRadius:4,
            fontSize:11, fontFamily:'inherit', boxSizing:'border-box', resize:'vertical',
            lineHeight:1.4, color:'#222' }}
        />
      </div>

      {/* Typography — same fields/ranges as every other brochure text element */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 76px', gap:6 }}>
        <div>
          <label style={lbl}>Font</label>
          <select value={el.fontFamily ?? ''} onChange={e => set('fontFamily', e.target.value)} style={selSt}>
            {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label style={lbl}>Weight</label>
          <select value={el.fontWeight ?? 400} onChange={e => set('fontWeight', parseInt(e.target.value, 10))} style={selSt}>
            {WEIGHT_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
        </div>
      </div>
      <div style={row2}>
        <div>
          <label style={lbl}>Size — {el.fontSize}px</label>
          <input type="range" min={FS_MIN} max={FS_MAX} step={0.5} value={el.fontSize ?? 16}
            onChange={e => set('fontSize', clamp(e.target.value, FS_MIN, FS_MAX))} style={{ width:'100%' }} />
        </div>
        <div>
          <label style={lbl}>Line Ht — {(el.lineHeight ?? LH_MIN).toFixed(2)}</label>
          <input type="range" min={LH_MIN} max={LH_MAX} step={0.05} value={el.lineHeight ?? 1.3}
            onChange={e => set('lineHeight', clamp(e.target.value, LH_MIN, LH_MAX))} style={{ width:'100%' }} />
        </div>
      </div>
      <div>
        <label style={lbl}>Spacing — {(el.letterSpacing ?? 0).toFixed(3)}em</label>
        <input type="range" min={LS_MIN} max={LS_MAX} step={0.005} value={el.letterSpacing ?? 0}
          onChange={e => set('letterSpacing', clamp(e.target.value, LS_MIN, LS_MAX))} style={{ width:'100%' }} />
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
        <label style={{ ...lbl, marginBottom:0 }}>Color</label>
        <input type="color"
          value={el.color || '#000000'}
          onChange={e => set('color', e.target.value)}
          style={{ width:32, height:24, border:'1px solid #d5d5e0', borderRadius:3, cursor:'pointer', padding:0 }} />
      </div>

      {/* Position — freeform absolute placement, unique to Textgram boxes.
          Number inputs (not sliders) since page-absolute coords span 0–816/1056,
          well beyond the ±200px range used by every other element's offset. */}
      <div style={row2}>
        <div>
          <label style={lbl}>X — {Math.round(el.x)}px</label>
          <input type="number" value={Math.round(el.x)} step={1}
            onChange={e => set('x', parseFloat(e.target.value) || 0)} style={selSt} />
        </div>
        <div>
          <label style={lbl}>Y — {Math.round(el.y)}px</label>
          <input type="number" value={Math.round(el.y)} step={1}
            onChange={e => set('y', parseFloat(e.target.value) || 0)} style={selSt} />
        </div>
      </div>
      <div style={row2}>
        <div>
          <label style={lbl}>Width — {Math.round(el.width)}px</label>
          <input type="number" min={20} value={Math.round(el.width)} step={1}
            onChange={e => set('width', Math.max(20, parseFloat(e.target.value) || 20))} style={selSt} />
        </div>
        <div>
          <label style={lbl}>Height — {Math.round(el.height)}px</label>
          <input type="number" min={16} value={Math.round(el.height)} step={1}
            onChange={e => set('height', Math.max(16, parseFloat(e.target.value) || 16))} style={selSt} />
        </div>
      </div>

      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        <button type="button" onClick={reset} style={resetBtn}>Reset Style</button>
        <button type="button" onClick={duplicate} style={resetBtn}>Duplicate</button>
        <button type="button" onClick={remove} style={{ ...resetBtn, color:'#c0392b', borderColor:'#e0b4ae' }}>Delete</button>
      </div>
    </>
  );
}

// Registration Form static text (labels/headings/paragraphs) — clicking any
// of it opens this branch instead of TextContent, since RF typography is a
// separate, parallel system (registrationForm.typography / getRegTypo /
// UPDATE_REGISTRATION_TYPOGRAPHY — see registrationFormTypography.js) with
// its own fields (italic/underline/textAlign, no x/y — RF geometry is
// fixed). `meta.sectionKey` is one of REGISTRATION_TYPOGRAPHY_DEFAULTS' keys;
// one key styles every rendered instance of that label/heading at once,
// exactly like the sidebar's RegistrationTypoPanel already does — this
// branch reuses that same RegTypoFields control set, not a second copy.
//
// TEXT content: same `meta.getValue(tour)` / `meta.setValue(dispatch, val)`
// function-pair pattern as the brochure's own TextContent above — called
// with THIS panel's own live (tour, dispatch) on every render, never a
// value captured back when the click happened, so the field stays correct
// even if the panel is left open while something else changes. Most RF
// static text supplies these (see RegistrationFormPrint.jsx's openTypo call
// sites); the handful of purely-fixed PDF boilerplate strings with no
// backing data field (e.g. "Mail Check to:") omit them, so only the
// typography controls show — exactly like before this feature.
function RegTextContent({ meta, tour, dispatch }) {
  const typo = getRegTypo(tour.registrationForm?.typography, meta.sectionKey);

  const setT = (field, value) => dispatch({ type: 'UPDATE_REGISTRATION_TYPOGRAPHY', section: meta.sectionKey, field, value });
  const reset = () => dispatch({ type: 'RESET_REGISTRATION_TYPOGRAPHY_SECTION', section: meta.sectionKey });

  return (
    <>
      {meta.getValue && (
        <div>
          <label style={lbl}>Text</label>
          <textarea
            value={meta.getValue(tour) ?? ''}
            onChange={e => meta.setValue(dispatch, e.target.value)}
            rows={meta.textRows || 2}
            style={textareaSt}
          />
        </div>
      )}
      <RegTypoFields current={typo} onSet={setT} />
      <button type="button" onClick={reset} style={resetBtn}>Reset</button>
    </>
  );
}

function ImageContent({ meta, tour, dispatch }) {
  const imgPos = meta.imagePositionKey
    ? getImagePosition(tour.imagePositions, meta.imagePositionKey)
    : null;

  const updPos = (field, value) => {
    if (!meta.imagePositionKey || !imgPos) return;
    dispatch({ type:'UPDATE_IMAGE_POSITION', key:meta.imagePositionKey, value:{ ...imgPos, [field]:value } });
  };

  const resetPos = () => {
    if (!meta.imagePositionKey) return;
    const def = IMAGE_POSITION_DEFAULTS[meta.imagePositionKey] ?? { x:50, y:50, offsetX:0, offsetY:0, scale:1 };
    dispatch({ type:'UPDATE_IMAGE_POSITION', key:meta.imagePositionKey, value:def });
  };

  return (
    <>
      <ImageField label="Image" value={meta.getSrc(tour)} onChange={val => meta.setSrc(dispatch, val)} />
      {imgPos && (
        <>
          <div>
            <label style={lbl}>Crop X — {imgPos.x}%</label>
            <input type="range" min={0} max={100} step={1} value={imgPos.x ?? 50}
              onChange={e => updPos('x', parseInt(e.target.value, 10))} style={{ width:'100%' }} />
          </div>
          <div>
            <label style={lbl}>Crop Y — {imgPos.y}%</label>
            <input type="range" min={0} max={100} step={1} value={imgPos.y ?? 50}
              onChange={e => updPos('y', parseInt(e.target.value, 10))} style={{ width:'100%' }} />
          </div>
          <div>
            <label style={lbl}>Scale — {(imgPos.scale ?? 1).toFixed(2)}×</label>
            <input type="range" min={0.5} max={3} step={0.05} value={imgPos.scale ?? 1}
              onChange={e => updPos('scale', parseFloat(e.target.value))} style={{ width:'100%' }} />
          </div>
          <button type="button" onClick={resetPos} style={resetBtn}>Reset Position</button>
        </>
      )}
    </>
  );
}

function LogoContent({ meta, tour, dispatch }) {
  const logo = getLogo(tour.logos, meta.logoKey);

  const setL = (field, value) => dispatch({ type:'UPDATE_LOGO', key:meta.logoKey, field, value });
  const reset = () => dispatch({ type:'RESET_LOGO', key:meta.logoKey });

  return (
    <>
      <ImageField
        label="Logo Image"
        value={logo.src ?? '/logos/cir-logo.png'}
        onChange={val => setL('src', val)}
      />
      <div>
        <label style={lbl}>Width — {logo.width ?? logo.size ?? 56}px</label>
        <input type="range" min={LOGO_SZ_MIN} max={LOGO_SZ_MAX} step={2}
          value={logo.width ?? logo.size ?? 56}
          onChange={e => setL('width', parseInt(e.target.value, 10))} style={{ width:'100%' }} />
      </div>
      <div style={row2}>
        <div>
          <label style={lbl}>X — {logo.x ?? 0}px</label>
          <input type="range" min={LOGO_OFF_MIN} max={LOGO_OFF_MAX} step={1}
            value={logo.x ?? 0}
            onChange={e => setL('x', parseInt(e.target.value, 10))} style={{ width:'100%' }} />
        </div>
        <div>
          <label style={lbl}>Y — {logo.y ?? 0}px</label>
          <input type="range" min={LOGO_OFF_MIN} max={LOGO_OFF_MAX} step={1}
            value={logo.y ?? 0}
            onChange={e => setL('y', parseInt(e.target.value, 10))} style={{ width:'100%' }} />
        </div>
      </div>
      <button type="button" onClick={reset} style={resetBtn}>Reset</button>
    </>
  );
}

// Registration Form QR Code — same architecture as ImageContent/LogoContent
// above (an image the user can replace, via the same ImageField + FileReader
// upload path), but no typography controls (font/weight/color/etc. make no
// sense for an image) and a single square SIZE instead of position offsets.
// Width and Height both read/write the exact same meta.getSize/setSize pair,
// which is what keeps them permanently equal — there is only one underlying
// number, so the QR can never become a rectangle.
function QrContent({ meta, tour, dispatch }) {
  const size = meta.getSize(tour);
  const src = meta.getSrc(tour);

  // Draft text the user is actively typing, kept separate from the
  // committed `size` above so an intermediate keystroke — an empty field,
  // or an out-of-range partial like "1"/"12" on the way to "120" — is never
  // clamped/forced to a limit. Resyncs whenever the committed size changes
  // from elsewhere (Reset Size, an external dispatch); it does NOT resync on
  // every render, so a still-being-typed value is never clobbered.
  const [draft, setDraft] = useState(String(size));
  useEffect(() => { setDraft(String(size)); }, [size]);

  const resetSize = () => meta.setSize(dispatch, QR_DEFAULT_SIZE);
  const remove = () => meta.setSrc(dispatch, '');

  // Only a value that's already a genuine, in-range number gets committed
  // live — this is what lets the spinner arrows (which always emit a
  // complete valid number) update the QR immediately, while a still-typing
  // value that isn't a number yet, or is out of range so far, is left alone
  // as draft-only text instead of snapping to QR_SZ_MIN/QR_SZ_MAX.
  const handleChange = (e) => {
    const raw = e.target.value;
    setDraft(raw);
    const n = parseFloat(raw);
    if (!isNaN(n) && n >= QR_SZ_MIN && n <= QR_SZ_MAX) {
      meta.setSize(dispatch, n);
    }
  };

  // Finalize on blur/Enter: parse + clamp whatever's currently typed. An
  // empty/non-numeric draft reverts to the last committed size rather than
  // being forced to a limit.
  const finalize = (raw) => {
    const n = parseFloat(raw);
    const next = isNaN(n) ? size : clamp(n, QR_SZ_MIN, QR_SZ_MAX);
    meta.setSize(dispatch, next);
    setDraft(String(next));
  };

  const sizeInputProps = {
    type: 'number', min: QR_SZ_MIN, max: QR_SZ_MAX, step: 1, value: draft,
    onChange: handleChange,
    onBlur: (e) => finalize(e.target.value),
    onKeyDown: (e) => { if (e.key === 'Enter') { finalize(e.target.value); e.target.blur(); } },
    style: selSt,
  };

  return (
    <>
      <ImageField label="QR Code Image" value={src} onChange={val => meta.setSrc(dispatch, val)} />
      {src && (
        <button type="button" onClick={remove} style={{ ...resetBtn, color: '#c0392b', borderColor: '#e0b4ae' }}>
          Remove QR Image
        </button>
      )}
      <div style={row2}>
        <div>
          <label style={lbl}>Width — {size}px</label>
          <input {...sizeInputProps} />
        </div>
        <div>
          <label style={lbl}>Height — {size}px</label>
          <input {...sizeInputProps} />
        </div>
      </div>
      <button type="button" onClick={resetSize} style={resetBtn}>Reset Size</button>
    </>
  );
}

// Clamp panel to stay within the visible viewport with a safe margin.
function clampToViewport(x, y) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  return {
    x: Math.max(8, Math.min(vw - PANEL_W - 8, x)),
    y: Math.max(8, Math.min(vh - 60, y)),
  };
}

export default function FloatingEditor() {
  const { floatingMeta, floatingPos, closeFloating } = useSelection();
  const { state, dispatch } = useBrochure();
  const panelRef  = useRef(null);
  const dragInfo  = useRef(null); // set on mousedown, cleared on mouseup
  const [manualPos, setManualPos] = useState(null); // null = follow click position

  // Click-outside → close
  useEffect(() => {
    if (!floatingMeta) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) closeFloating();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [floatingMeta, closeFloating]);

  // Global drag move / release — registered once, stable for component lifetime
  useEffect(() => {
    const onMove = (e) => {
      if (!dragInfo.current) return;
      const dx = e.clientX - dragInfo.current.startMX;
      const dy = e.clientY - dragInfo.current.startMY;
      const clamped = clampToViewport(
        dragInfo.current.startPX + dx,
        dragInfo.current.startPY + dy,
      );
      setManualPos(clamped);
    };
    const onUp = () => {
      if (dragInfo.current) {
        dragInfo.current = null;
        document.body.style.cursor = '';
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  if (!floatingMeta || !floatingPos) return null;

  const { tour } = state;
  const type = floatingMeta.type || 'text';

  // Compute auto-position from click coordinates
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let autoPx = floatingPos.x + 14;
  let autoPy = floatingPos.y - 20;
  if (autoPx + PANEL_W > vw - 8) autoPx = Math.max(8, floatingPos.x - PANEL_W - 10);
  if (autoPy < 8) autoPy = 8;
  if (autoPy > vh - 100) autoPy = Math.max(8, vh - 100);

  // Use dragged position if user has moved the panel; otherwise follow the click
  const px = manualPos ? manualPos.x : autoPx;
  const py = manualPos ? manualPos.y : autoPy;

  // Start drag — captures current panel position at the moment of mousedown
  const startDrag = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragInfo.current = {
      startMX: e.clientX,
      startMY: e.clientY,
      startPX: px,
      startPY: py,
    };
    document.body.style.cursor = 'grabbing';
  };

  return (
    <div
      ref={panelRef}
      onMouseDown={e => e.stopPropagation()}
      style={{
        position: 'fixed', left: px, top: py, width: PANEL_W,
        background: '#fff', border: '1px solid #d5d5e0', borderRadius: 8,
        boxShadow: '0 8px 32px rgba(0,0,0,0.16), 0 2px 8px rgba(0,0,0,0.08)',
        zIndex: 9999, fontFamily: "'Inter',sans-serif", fontSize: 11, color: '#222',
      }}
    >
      {/* Drag handle header */}
      <div
        onMouseDown={startDrag}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '7px 12px', borderBottom: '1px solid #e8e8f0',
          background: '#f6f6fa', borderRadius: '8px 8px 0 0',
          cursor: 'grab', userSelect: 'none',
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 11, letterSpacing: '0.04em', color: '#333' }}>
          {floatingMeta.label}
        </span>
        <button
          type="button"
          onClick={closeFloating}
          onMouseDown={e => e.stopPropagation()} // don't start drag when clicking ×
          style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:16, lineHeight:1, padding:'0 2px' }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {type === 'image'
          ? <ImageContent   meta={floatingMeta} tour={tour} dispatch={dispatch} />
          : type === 'logo'
          ? <LogoContent    meta={floatingMeta} tour={tour} dispatch={dispatch} />
          : type === 'qr'
          ? <QrContent      meta={floatingMeta} tour={tour} dispatch={dispatch} />
          : type === 'textgram'
          ? <TextgramContent meta={floatingMeta} tour={tour} dispatch={dispatch} />
          : type === 'regText'
          ? <RegTextContent meta={floatingMeta} tour={tour} dispatch={dispatch} />
          : <TextContent    meta={floatingMeta} tour={tour} dispatch={dispatch} />
        }
      </div>
    </div>
  );
}
