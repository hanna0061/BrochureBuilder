import React, { useCallback, useRef, useState } from 'react';

/**
 * Navbar "Projects ▾" dropdown.
 *
 * Reuses the same dropdown markup/classes as the existing "Export ▾" menu
 * in App.jsx (.export-dropdown / .export-dropdown__menu / .export-dropdown__item)
 * for visual consistency with the existing design system, and the existing
 * useProjectSave hook (loadProject / newProject) for state — no second
 * project-state system.
 *
 * Recent Projects is metadata-only (see useRecentProjects): browsers give no
 * reliable way to reopen an arbitrary file from disk without the user
 * re-selecting it, so clicking a recent entry opens the native file picker
 * again rather than pretending to reload the file directly.
 *
 * Deleting a Recent Projects entry (single or "Clear All") only removes
 * localStorage metadata via useRecentProjects — it never touches the actual
 * file on disk and never touches the currently loaded project/tour state.
 * The confirm dialog reuses App.jsx's existing .export-dialog* classes
 * (same ones ExportWarningDialog already uses) so no new CSS is needed.
 */
export default function ProjectsMenu({
  loadProject,
  newProject,
  recentProjects,
  onProjectOpened,
  removeRecentProject,
  clearRecentProjects,
}) {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [confirmTarget, setConfirmTarget] = useState(null); // { type: 'single', fileName, name } | { type: 'all' } | null
  const fileInputRef = useRef(null);

  const openFilePicker = useCallback((recentFileName) => {
    setNotice(recentFileName ? `Select "${recentFileName}" to reopen this project.` : null);
    setOpen(false);
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      e.target.value = ''; // allow re-selecting the same file again later
      if (!file) return;
      const result = await loadProject(file);
      if (result?.loaded) {
        onProjectOpened?.({ fileName: result.fileName });
        setNotice(null);
      }
    },
    [loadProject, onProjectOpened]
  );

  const handleNewProject = useCallback(() => {
    setOpen(false);
    setNotice(null);
    newProject();
  }, [newProject]);

  const handleConfirmRemove = useCallback(() => {
    if (confirmTarget?.type === 'single') {
      removeRecentProject(confirmTarget.fileName);
    } else if (confirmTarget?.type === 'all') {
      clearRecentProjects();
    }
    setConfirmTarget(null);
  }, [confirmTarget, removeRecentProject, clearRecentProjects]);

  return (
    <div className={`export-dropdown${open ? ' export-dropdown--open' : ''}`}>
      <button
        className="btn btn--cta-bar btn--sm"
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={(e) => {
          if (!e.currentTarget.closest('.export-dropdown').contains(e.relatedTarget)) {
            setOpen(false);
          }
        }}
      >
        Projects ▾
      </button>
      <div className="export-dropdown__menu" role="menu">
        <button className="export-dropdown__item" type="button" role="menuitem" onClick={handleNewProject}>
          New Project
        </button>
        <button className="export-dropdown__item" type="button" role="menuitem" onClick={() => openFilePicker()}>
          Open Project
        </button>
        <div
          role="presentation"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 16px 4px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            Recent Projects
          </span>
          {recentProjects.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmTarget({ type: 'all' })}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.03em',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'underline',
                padding: 0,
              }}
            >
              Clear All
            </button>
          )}
        </div>
        {recentProjects.length === 0 ? (
          <div style={{ padding: '4px 16px 9px', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
            No recent projects
          </div>
        ) : (
          recentProjects.map((p) => {
            const displayName = p.fileName.replace(/\.json$/i, '');
            return (
              <div
                key={p.fileName}
                className="export-dropdown__item"
                style={{ display: 'flex', alignItems: 'center', paddingTop: 0, paddingBottom: 0, gap: 4 }}
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => openFilePicker(p.fileName)}
                  title={`Last opened ${new Date(p.lastOpened).toLocaleString()}`}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    color: 'inherit',
                    font: 'inherit',
                    padding: '9px 0',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayName}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmTarget({ type: 'single', fileName: p.fileName, name: displayName });
                  }}
                  aria-label={`Remove ${displayName} from Recent Projects`}
                  title="Remove from Recent Projects"
                  style={{
                    flexShrink: 0,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.4)',
                    fontSize: 12,
                    lineHeight: 1,
                    padding: '9px 4px',
                  }}
                >
                  🗑
                </button>
              </div>
            );
          })
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {notice && (
        <span
          role="status"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            right: 0,
            fontSize: 11,
            color: '#ffe19a',
            whiteSpace: 'nowrap',
            background: '#1A3160',
            padding: '4px 8px',
            borderRadius: 5,
            border: '1px solid rgba(255,255,255,0.18)',
            zIndex: 200,
          }}
        >
          {notice}
        </span>
      )}
      {confirmTarget && (
        <div
          className="export-dialog-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="recent-project-confirm-title"
        >
          <div className="export-dialog">
            <h2 className="export-dialog__title" id="recent-project-confirm-title">
              {confirmTarget.type === 'all' ? 'Remove all recent projects?' : `Remove "${confirmTarget.name}" from Recent Projects?`}
            </h2>
            <p className="export-dialog__subtitle">
              This only clears the shortcut from Recent Projects. The JSON file on your computer and your currently
              open project are not affected.
            </p>
            <div className="export-dialog__actions">
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirmTarget(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn--cta-bar btn--sm recent-confirm__remove-btn"
                onClick={handleConfirmRemove}
              >
                {confirmTarget.type === 'all' ? 'Remove All' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
