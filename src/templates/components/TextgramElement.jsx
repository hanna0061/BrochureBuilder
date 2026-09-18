import React, { useRef, useEffect, useCallback } from 'react';
import { typoStyle } from '../../data/typography';
import { useBrochure } from '../../context/BrochureContext';
import { usePreview } from '../../context/PreviewContext';
import { useSelection } from '../../context/SelectionContext';

const DRAG_THRESHOLD = 3; // px of real mouse movement before a mousedown counts as a drag, not a click
const MIN_W = 20;
const MIN_H = 16;

/**
 * TextgramElement — one freeform text box placed on a brochure page.
 *
 * Mirrors DraggableImage's mousedown/mousemove/mouseup drag pattern (same
 * scale-aware delta math), plus a corner handle for resizing. A plain click
 * (no movement) opens the same FloatingEditor panel used by every other
 * brochure text element, via SelectionContext.openFloating — see
 * FloatingEditor.jsx's TextgramContent branch.
 */
export default function TextgramElement({ element, dragModeActive }) {
  const { dispatch } = useBrochure();
  const { scale } = usePreview();
  const { selectedId, openFloating } = useSelection();
  const dragInfo = useRef(null);
  const resizeInfo = useRef(null);
  const moved = useRef(false);

  const selected = selectedId === element.id;

  const fontStyle = typoStyle({
    fontFamily: element.fontFamily,
    fontSize: element.fontSize,
    fontWeight: element.fontWeight,
    lineHeight: element.lineHeight,
    letterSpacing: element.letterSpacing,
    color: element.color,
  });

  const handleMouseDown = useCallback((e) => {
    if (dragModeActive || e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    moved.current = false;
    dragInfo.current = {
      startMX: e.clientX,
      startMY: e.clientY,
      startX: element.x,
      startY: element.y,
    };
  }, [dragModeActive, element.x, element.y]);

  const startResize = useCallback((e) => {
    if (dragModeActive || e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    resizeInfo.current = {
      startMX: e.clientX,
      startMY: e.clientY,
      startW: element.width,
      startH: element.height,
    };
  }, [dragModeActive, element.width, element.height]);

  useEffect(() => {
    const s = () => scale || 1;

    const onMove = (e) => {
      if (dragInfo.current) {
        const dx = (e.clientX - dragInfo.current.startMX) / s();
        const dy = (e.clientY - dragInfo.current.startMY) / s();
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) moved.current = true;
        if (moved.current) {
          dispatch({ type: 'UPDATE_TEXT_ELEMENT', id: element.id, field: 'x', value: Math.round(dragInfo.current.startX + dx) });
          dispatch({ type: 'UPDATE_TEXT_ELEMENT', id: element.id, field: 'y', value: Math.round(dragInfo.current.startY + dy) });
        }
      }
      if (resizeInfo.current) {
        const dx = (e.clientX - resizeInfo.current.startMX) / s();
        const dy = (e.clientY - resizeInfo.current.startMY) / s();
        dispatch({ type: 'UPDATE_TEXT_ELEMENT', id: element.id, field: 'width',  value: Math.max(MIN_W, Math.round(resizeInfo.current.startW + dx)) });
        dispatch({ type: 'UPDATE_TEXT_ELEMENT', id: element.id, field: 'height', value: Math.max(MIN_H, Math.round(resizeInfo.current.startH + dy)) });
      }
    };

    const onUp = (e) => {
      if (dragInfo.current && !moved.current) {
        openFloating({ id: element.id, type: 'textgram', label: 'Text Box' }, e);
      }
      dragInfo.current = null;
      resizeInfo.current = null;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [scale, dispatch, element.id, openFloating]);

  return (
    <div
      className={`textgram-el${selected ? ' textgram-el--selected' : ''}`}
      style={{
        position: 'absolute',
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        pointerEvents: dragModeActive ? 'none' : 'auto',
        cursor: dragModeActive ? undefined : 'move',
        outline: selected ? '1.5px dashed #4a7dff' : '1px dashed transparent',
        outlineOffset: 2,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflow: 'visible',
        userSelect: 'none',
        boxSizing: 'border-box',
        ...fontStyle,
      }}
      onMouseDown={handleMouseDown}
      data-textgram-id={element.id}
    >
      {element.text}

      {selected && !dragModeActive && (
        <div
          className="textgram-el__resize-handle"
          onMouseDown={startResize}
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: -6,
            bottom: -6,
            width: 12,
            height: 12,
            background: '#4a7dff',
            border: '1.5px solid #fff',
            borderRadius: '50%',
            cursor: 'nwse-resize',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      )}
    </div>
  );
}
