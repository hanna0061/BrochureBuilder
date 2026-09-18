import React, { useEffect, useRef, useState } from 'react';
import { useBrochure } from '../context/BrochureContext';
import { PreviewContext } from '../context/PreviewContext';
import RegistrationFormPrint from './RegistrationFormPrint';
import './registrationForm.css';

const PAGE_W = 816;
const PAGE_H = 1056;

/**
 * Registration Form workspace — the right-hand pane shown alongside
 * RegistrationFormEditor when the Registration Form view is active
 * (App.jsx), mirroring how BrochurePreview sits alongside EditorSidebar.
 *
 * This renders the ACTUAL RegistrationFormPrint template (same component,
 * same fixed 816×1056 internal canvas), scaled visually to fit the
 * available panel width — the canvas itself never changes size, only its
 * on-screen CSS transform does, so preview and print can never diverge.
 * Printing itself is handled by App.jsx's own isolated, always-mounted
 * hidden instance (Export ▾ → Print Registration Form), so this visible
 * instance doesn't need a print ref.
 *
 * Uses its own dedicated classes (.rf-workspace-*) in registrationForm.css
 * — intentionally not brochure.css's .preview-panel/.preview-page-* — to
 * keep the Registration Form fully isolated from brochure styling.
 *
 * Provides its own PreviewContext (dragMode always false — there's nothing
 * to image-drag here — plus this workspace's real `scale`) so the shared
 * TextgramLayer mounted inside RegistrationFormPrint still renders/drags/
 * resizes any EXISTING Textgram elements scale-aware, exactly like
 * BrochurePreview does for the brochure pages. `textAddMode` is hard-coded
 * false with no toggle exposed here — the Registration Form intentionally
 * has no "Aa Add Text" control, so no NEW Textgram elements can be created
 * from this workspace (existing ones, and the brochure's own Add Text
 * toolbar, are untouched — see TextgramLayer.jsx / BrochurePreview.jsx).
 */
export default function RegistrationFormWorkspace() {
  const { state } = useBrochure();
  const rf = state.tour.registrationForm;
  const panelRef = useRef(null);
  const [scale, setScale] = useState(0.65);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const calc = () => {
      const available = el.clientWidth - 48;
      setScale(Math.min(1, Math.max(0.3, available / PAGE_W)));
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <PreviewContext.Provider value={{ dragMode: false, scale, textAddMode: false, setTextAddMode: () => {} }}>
      <div className="rf-workspace-panel" ref={panelRef}>

        <div className="rf-workspace-page-wrap">
          <span className="rf-workspace-page-label">Registration Form</span>
          <div
            className="rf-workspace-page-clip"
            style={{ width: `${PAGE_W * scale}px`, height: `${PAGE_H * scale}px` }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${PAGE_W}px`,
                height: `${PAGE_H}px`,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <RegistrationFormPrint registrationForm={rf} />
            </div>
          </div>
        </div>
      </div>
    </PreviewContext.Provider>
  );
}
