import { useCallback, useEffect, useState } from 'react';

const RECENT_PROJECTS_KEY = 'paxvia_recent_projects';
const MAX_RECENT = 8;

function readRecent() {
  try {
    const raw = localStorage.getItem(RECENT_PROJECTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecent(list) {
  try {
    localStorage.setItem(RECENT_PROJECTS_KEY, JSON.stringify(list));
  } catch {
    // quota exceeded or private browsing — silently ignore, same tolerance
    // BrochureContext's own localStorage draft-persistence already uses.
  }
}

// Display name is always the file name with its .json extension removed —
// never brochure content (e.g. titleShort), so two files that happen to
// share the same tour title still show up as distinct, correctly-named
// entries.
function nameFromFileName(fileName) {
  return fileName.replace(/\.json$/i, '');
}

/**
 * Lightweight "recently opened/saved" project list.
 *
 * Stores ONLY metadata (name, filename, last-opened timestamp) in
 * localStorage — never the brochure content itself, and never a filesystem
 * path, since browsers don't provide one reliably. Reopening a recent entry
 * still requires the user to re-select the file via the native picker.
 */
export function useRecentProjects() {
  const [recentProjects, setRecentProjects] = useState(readRecent);

  useEffect(() => {
    writeRecent(recentProjects);
  }, [recentProjects]);

  // Takes only fileName — the name is always derived from it here, never
  // passed in, so a caller can't accidentally store a titleShort-based name.
  const addRecentProject = useCallback(({ fileName }) => {
    if (!fileName) return;
    setRecentProjects((prev) => {
      const withoutDup = prev.filter((p) => p.fileName !== fileName);
      const next = [{ name: nameFromFileName(fileName), fileName, lastOpened: new Date().toISOString() }, ...withoutDup];
      return next.slice(0, MAX_RECENT);
    });
  }, []);

  // Removes a single entry from the Recent Projects metadata list only —
  // never touches the actual file on disk, the currently loaded project, or
  // anything outside the RECENT_PROJECTS_KEY localStorage entry.
  const removeRecentProject = useCallback((fileName) => {
    setRecentProjects((prev) => prev.filter((p) => p.fileName !== fileName));
  }, []);

  // Clears the entire Recent Projects metadata list only — same scope
  // guarantee as removeRecentProject above.
  const clearRecentProjects = useCallback(() => {
    setRecentProjects([]);
  }, []);

  return { recentProjects, addRecentProject, removeRecentProject, clearRecentProjects };
}
