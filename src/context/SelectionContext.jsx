import React, { createContext, useCallback, useContext, useState } from 'react';

export const SelectionContext = createContext({
  selectedId: null,
  selectElement: () => {},
  floatingMeta: null,
  floatingPos: null,
  openFloating: () => {},
  closeFloating: () => {},
});

export function SelectionProvider({ children }) {
  const [selectedId, setSelectedId] = useState(null);
  const [floatingMeta, setFloatingMeta] = useState(null);
  const [floatingPos, setFloatingPos] = useState(null);

  const selectElement = useCallback((id) => {
    setSelectedId(prev => prev === id ? null : id);
  }, []);

  const openFloating = useCallback((meta, event) => {
    setSelectedId(meta.id);
    setFloatingMeta(meta);
    setFloatingPos({ x: event.clientX, y: event.clientY });
  }, []);

  const closeFloating = useCallback(() => {
    setFloatingMeta(null);
    setFloatingPos(null);
  }, []);

  return (
    <SelectionContext.Provider value={{ selectedId, selectElement, floatingMeta, floatingPos, openFloating, closeFloating }}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  return useContext(SelectionContext);
}
