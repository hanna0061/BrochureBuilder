import React, { useRef, useEffect, useCallback } from 'react';
import { usePreview } from '../../context/PreviewContext';

/**
 * DraggableImage — an <img> that supports:
 *   - Drag-to-pan in Drag Mode (updates x/y crop via object-position)
 *   - X/Y offset translate + scale via position.offsetX/offsetY/scale
 *
 * Props:
 *   src, alt, className  — passed through to <img>
 *   style                — additional styles
 *   position             — { x, y, offsetX, offsetY, scale }
 *   onPositionChange     — (newPosition) => void
 */
export default function DraggableImage({ src, alt, className, style, position, onPositionChange }) {
  const { dragMode, scale } = usePreview();
  const isDragging = useRef(false);
  const start = useRef({ mx: 0, my: 0, px: 50, py: 50 });
  const stableOnChange = useRef(onPositionChange);
  stableOnChange.current = onPositionChange;

  const handleMouseDown = useCallback((e) => {
    if (!dragMode) return;
    isDragging.current = true;
    start.current = {
      mx: e.clientX,
      my: e.clientY,
      px: position?.x ?? 50,
      py: position?.y ?? 50,
    };
    e.preventDefault();
  }, [dragMode, position]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const brochoureScale = scale || 1;
      const dx = (e.clientX - start.current.mx) / brochoureScale;
      const dy = (e.clientY - start.current.my) / brochoureScale;
      const newX = Math.max(0, Math.min(100, start.current.px - dx * 0.15));
      const newY = Math.max(0, Math.min(100, start.current.py - dy * 0.15));
      stableOnChange.current({
        ...(position ?? {}),
        x: Math.round(newX * 10) / 10,
        y: Math.round(newY * 10) / 10,
      });
    };
    const onMouseUp = () => { isDragging.current = false; };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [scale, position]);

  const ox = position?.offsetX ?? 0;
  const oy = position?.offsetY ?? 0;
  const s  = position?.scale   ?? 1;
  const hasTransform = ox !== 0 || oy !== 0 || s !== 1;

  const imgStyle = {
    objectPosition: `${position?.x ?? 50}% ${position?.y ?? 50}%`,
    transform: hasTransform
      ? `translateX(${ox}px) translateY(${oy}px) scale(${s})`
      : undefined,
    cursor: dragMode ? (isDragging.current ? 'grabbing' : 'grab') : undefined,
    userSelect: 'none',
    ...style,
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={imgStyle}
      onMouseDown={handleMouseDown}
      draggable={false}
    />
  );
}
