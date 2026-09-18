import React, { useRef } from 'react';
import { useBrochure } from '../../context/BrochureContext';
import { usePreview } from '../../context/PreviewContext';
import { useSelection } from '../../context/SelectionContext';
import { createTextElement } from '../../data/textElements';
import TextgramElement from './TextgramElement';

/**
 * TextgramLayer — overlays a brochure page with its placed Textgram text
 * boxes, and (in Add Text mode) turns clicks on empty page space into new
 * boxes. Mounted once per page component (Page1Cover, Page2Itinerary,
 * Page3Pricing, Page4Terms) so it renders identically in preview AND every
 * print target, since all of those reuse the same page components.
 *
 * `page` is one of the fixed physical page ids from textElements.js
 * ('cover' | 'itinerary' | 'pricing' | 'terms').
 */
export default function TextgramLayer({ page }) {
  const { state, dispatch } = useBrochure();
  const { dragMode, scale, textAddMode, setTextAddMode } = usePreview();
  const { openFloating } = useSelection();
  const layerRef = useRef(null);

  const elements = (state.tour.textElements ?? []).filter((el) => el.page === page);

  const handleLayerClick = (e) => {
    if (!textAddMode || !layerRef.current) return;
    e.stopPropagation();
    const rect = layerRef.current.getBoundingClientRect();
    const s = scale || 1;
    const x = (e.clientX - rect.left) / s;
    const y = (e.clientY - rect.top) / s;
    const newEl = createTextElement(page, x, y);
    dispatch({ type: 'ADD_TEXT_ELEMENT', element: newEl });
    setTextAddMode(false);
    // Open the same floating editor a click-to-select would, so the user can
    // start typing/styling immediately instead of having to click it again.
    openFloating({ id: newEl.id, type: 'textgram', label: 'Text Box' }, e);
  };

  return (
    <div
      ref={layerRef}
      className="textgram-layer"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: textAddMode ? 'auto' : 'none',
        cursor: textAddMode ? 'crosshair' : undefined,
        zIndex: 30,
      }}
      onClick={handleLayerClick}
    >
      {elements.map((el) => (
        <TextgramElement key={el.id} element={el} dragModeActive={dragMode} />
      ))}
    </div>
  );
}
