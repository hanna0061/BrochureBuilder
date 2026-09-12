import { useBrochure } from '../context/BrochureContext';

export function useProjectSave() {
  const { state, dispatch } = useBrochure();

  const saveProject = () => {
    const json = JSON.stringify(state.tour, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.tour.tourCode || 'brochure'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadProject = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        dispatch({ type: 'SET_TOUR', payload: data });
      } catch {
        alert('Invalid brochure file — could not parse JSON.');
      }
    };
    reader.readAsText(file);
  };

  return { saveProject, loadProject };
}
