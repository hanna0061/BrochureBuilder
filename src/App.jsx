import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import EditorSidebar from './editor/EditorSidebar';
import BrochurePreview from './preview/BrochurePreview';
import PrintLayout from './print/PrintLayout';
import { useBrochure } from './context/BrochureContext';
import { useProjectSave } from './hooks/useProjectSave';

export default function App() {
  const { state } = useBrochure();
  const printLayoutRef = useRef(null);
  const { saveProject, loadProject } = useProjectSave();

  const handlePrint = useReactToPrint({
    content: () => printLayoutRef.current,
    documentTitle: `${state.tour.titleShort || 'Pax Via'} — Brochure`,
    pageStyle: `
      @page {
        size: 8.5in 11in;
        margin: 0;
      }
      @media print {
        html, body {
          width: 816px;
          margin: 0;
          padding: 0;
          background: white;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `,
  });

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <img
            src="/logos/pax-via-logo.png"
            alt="Pax Via"
            className="app-header__logo"
          />
          <span className="app-header__name">Brochure Builder</span>
        </div>
        <div className="app-header__actions">
          <span className="app-header__tour-name">{state.tour.titleShort}</span>
          <button
            className="btn btn--ghost btn--sm app-header__action-btn"
            onClick={saveProject}
            type="button"
          >
            Save Project
          </button>
          <label className="btn btn--ghost btn--sm app-header__action-btn">
            Load Project
            <input
              type="file"
              accept=".json"
              onChange={(e) => {
                if (e.target.files?.[0]) loadProject(e.target.files[0]);
                e.target.value = '';
              }}
              style={{ display: 'none' }}
            />
          </label>
          <button
            className="btn btn--cta-bar btn--sm"
            onClick={handlePrint}
            type="button"
          >
            Export PDF
          </button>
        </div>
      </header>

      <div className="app-body">
        <EditorSidebar />
        <BrochurePreview />
      </div>

      <PrintLayout printRef={printLayoutRef} />
    </div>
  );
}
