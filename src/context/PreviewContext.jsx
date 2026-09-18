import { createContext, useContext } from 'react';

export const PreviewContext = createContext({
  dragMode: false,
  scale: 1,
  textAddMode: false,
  setTextAddMode: () => {},
});

export function usePreview() {
  return useContext(PreviewContext);
}
