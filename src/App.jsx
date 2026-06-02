import React, { useRef, useState, useContext } from 'react';
import { AuthContext } from './components/AuthGate';
import { SelectionProvider } from './context/SelectionContext';
import { useReactToPrint } from 'react-to-print';
import EditorSidebar from './editor/EditorSidebar';
import FloatingEditor from './editor/FloatingEditor';
import BrochurePreview from './preview/BrochurePreview';
import PrintLayout from './print/PrintLayout';
import { useBrochure } from './context/BrochureContext';
import { useProjectSave } from './hooks/useProjectSave';
import { runAllChecks } from './safety/checks';

function ExportWarningDialog({ warnings, onExport, onCancel }) {
  return (
    <div className="export-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="export-dialog-title">
      <div className="export-dialog">
        <h2 className="export-dialog__title" id="export-dialog-title">
          Export Warnings
        </h2>
        <p className="export-dialog__subtitle">
          The following issues were detected. You can still export — these are warnings only.
        </p>
        <ul className="export-dialog__list">
          {warnings.map(w => (
            <li key={w.id} className="export-dialog__item">
              <span className="export-dialog__msg">{w.message}</span>
              <span className="export-dialog__detail">{w.detail}</span>
            </li>
          ))}
        </ul>
        <div className="export-dialog__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="btn btn--cta-bar btn--sm" onClick={onExport}>
            Export Anyway
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { state } = useBrochure();
  const auth = useContext(AuthContext);
  const logout = auth?.logout;
  const printLayoutRef = useRef(null);
  const { saveProject, loadProject } = useProjectSave();
  const [exportWarnings, setExportWarnings] = useState(null);

  const doPrint = useReactToPrint({
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

  const handleExportClick = () => {
    const warnings = runAllChecks(state.tour);
    if (warnings.length > 0) {
      setExportWarnings(warnings);
    } else {
      doPrint();
    }
  };

  const confirmExport = () => {
    setExportWarnings(null);
    doPrint();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <img
            src="/logos/cir-logo.png"
            alt="Pax Via"
            className="app-header__logo"
          />
          <span className="app-header__name">Brochure Builder</span>
        </div>
        <div className="app-header__actions">
          <span className="app-header__tour-name">{state.tour.titleShort}</span>
          <button
            className="btn btn--cta-bar btn--sm app-header__action-btn"
            onClick={saveProject}
            type="button"
          >
            Save Project
          </button>
          <label className="btn btn--cta-bar btn--sm app-header__action-btn">
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
            onClick={handleExportClick}
            type="button"
          >
            Export PDF
          </button>
          <button
            className="btn btn--cta-bar btn--sm app-header__action-btn"
            onClick={() => { if (logout) logout(); }}
            type="button"
          >
            Logout
          </button>
        </div>
      </header>

      <SelectionProvider>
        <div className="app-body">
          <EditorSidebar />
          <BrochurePreview />
        </div>
        <FloatingEditor />
      </SelectionProvider>

      <PrintLayout printRef={printLayoutRef} />

      {exportWarnings && (
        <ExportWarningDialog
          warnings={exportWarnings}
          onExport={confirmExport}
          onCancel={() => setExportWarnings(null)}
        />
      )}
    </div>
  );
}
