import { createContext, useContext } from 'react';

export const PreviewContext = createContext({ dragMode: false, scale: 1 });

export function usePreview() {
  return useContext(PreviewContext);
}
