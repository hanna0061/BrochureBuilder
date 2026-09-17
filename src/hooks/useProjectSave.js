import { useCallback, useState } from 'react';
import { useBrochure } from '../context/BrochureContext';

function slugifyFileName(name) {
  const base = (name || 'brochure')
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${base || 'brochure'}.json`;
}

// A compatible brochure project must carry the handful of top-level fields
// that page components dereference directly (no optional chaining) —
// itinerary, photos.grid/pricingHero (Page1Cover, ImagesSection), and
// dates.month/range (Page1Cover). BrochureContext's migrateTour() already
// backfills the optional fields (typography/colors/positions/logos/etc) on
// SET_TOUR, but not these, so a file missing them would otherwise dispatch
// successfully and then crash rendering — which is exactly the "overwrite
// the current project with something incompatible" case this must prevent.
function isValidTourJson(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  if (!Array.isArray(data.itinerary)) return false;
  if (!data.photos || typeof data.photos !== 'object') return false;
  if (!Array.isArray(data.photos.grid)) return false;
  if (!data.photos.pricingHero || typeof data.photos.pricingHero !== 'object') return false;
  if (!data.dates || typeof data.dates !== 'object') return false;
  if (typeof data.dates.month !== 'string' || typeof data.dates.range !== 'string') return false;
  return true;
}

/**
 * Project save/open/new — reuses the existing BrochureContext SET_TOUR /
 * RESET_TOUR actions and the existing project JSON schema unchanged.
 *
 * currentFileName is local UI state only (not persisted into the tour JSON
 * or localStorage draft) — it tracks the actual opened/saved project file
 * name and is the source of truth for the Navbar's project-name display,
 * the suggested Save filename, and what gets reported to Recent Projects.
 */
export function useProjectSave() {
  const { state, dispatch } = useBrochure();
  const [currentFileName, setCurrentFileName] = useState(null);

  const suggestedFileName = currentFileName || slugifyFileName(state.tour.titleShort || state.tour.tourCode);

  const downloadFallback = useCallback((fileName, json) => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // Saves state.tour via the native File System Access API save dialog when
  // available (lets the user pick filename AND destination folder), falling
  // back to a plain Blob + <a download> otherwise. Cancelling the native
  // dialog resolves { saved: false, cancelled: true } and changes nothing.
  const saveProject = useCallback(async () => {
    const json = JSON.stringify(state.tour, null, 2);
    const fileName = suggestedFileName;

    if (typeof window.showSaveFilePicker === 'function') {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: fileName,
          types: [
            {
              description: 'JSON Project',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });
        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
        setCurrentFileName(handle.name);
        return { saved: true, fileName: handle.name };
      } catch (err) {
        if (err && err.name === 'AbortError') {
          // User cancelled the native save dialog — do nothing.
          return { saved: false, cancelled: true };
        }
        // eslint-disable-next-line no-console
        console.error('[useProjectSave] Native save failed, falling back to browser download:', err);
        downloadFallback(fileName, json);
        setCurrentFileName(fileName);
        return { saved: true, fileName };
      }
    }

    downloadFallback(fileName, json);
    setCurrentFileName(fileName);
    return { saved: true, fileName };
  }, [state.tour, suggestedFileName, downloadFallback]);

  // Reads + validates a project JSON file, then loads it via the existing
  // SET_TOUR action. Invalid/incompatible JSON never touches state.tour.
  const loadProject = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        let data;
        try {
          data = JSON.parse(e.target.result);
        } catch {
          alert('Invalid brochure file — could not parse JSON.');
          resolve({ loaded: false });
          return;
        }
        if (!isValidTourJson(data)) {
          alert("This file doesn't look like a valid brochure project (missing required tour data, such as itinerary, photos, or dates). Please choose a different file.");
          resolve({ loaded: false });
          return;
        }
        dispatch({ type: 'SET_TOUR', payload: data });
        setCurrentFileName(file.name);
        resolve({ loaded: true, fileName: file.name, name: data.titleShort || data.tourCode || file.name });
      };
      reader.onerror = () => {
        alert('Could not read the selected file.');
        resolve({ loaded: false });
      };
      reader.readAsText(file);
    });
  }, [dispatch]);

  // Fresh project from the existing default template. No confirmation
  // dialog: the app has no dirty/unsaved-state tracking to guard against
  // losing (the sidebar's separate "Reset" control already owns its own
  // window.confirm for the destructive in-place reset case).
  const newProject = useCallback(() => {
    dispatch({ type: 'RESET_TOUR' });
    setCurrentFileName(null);
  }, [dispatch]);

  return { saveProject, loadProject, newProject, currentFileName, suggestedFileName };
}
