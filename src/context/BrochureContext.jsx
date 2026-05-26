import React, { createContext, useContext, useReducer, useEffect } from 'react';
import defaultBrochure from '../data/brochures/poland-czech-medjugorje.json';
import companyData from '../data/global/company.json';
import termsData from '../data/global/terms.json';

const BrochureContext = createContext(null);
const STORAGE_KEY = 'paxvia_brochure_draft';

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TOUR':
      return { ...state, tour: action.payload };

    case 'RESET_TOUR':
      return { ...state, tour: defaultBrochure };

    case 'UPDATE_FIELD':
      return { ...state, tour: { ...state.tour, [action.field]: action.value } };

    case 'UPDATE_NESTED':
      return {
        ...state,
        tour: {
          ...state.tour,
          [action.parent]: {
            ...state.tour[action.parent],
            [action.field]: action.value,
          },
        },
      };

    case 'UPDATE_ITINERARY_DAY':
      return {
        ...state,
        tour: {
          ...state.tour,
          itinerary: state.tour.itinerary.map((day, i) =>
            i === action.index ? { ...day, [action.field]: action.value } : day
          ),
        },
      };

    case 'ADD_ITINERARY_DAY': {
      const len = state.tour.itinerary.length;
      return {
        ...state,
        tour: {
          ...state.tour,
          itinerary: [
            ...state.tour.itinerary,
            {
              day: len + 1,
              label: `Day ${len + 1}`,
              heading: 'New Day',
              body: '',
              overnight: null,
              meals: null,
            },
          ],
        },
      };
    }

    case 'REMOVE_ITINERARY_DAY':
      return {
        ...state,
        tour: {
          ...state.tour,
          itinerary: state.tour.itinerary.filter((_, i) => i !== action.index),
        },
      };

    case 'UPDATE_GRID_PHOTO':
      return {
        ...state,
        tour: {
          ...state.tour,
          photos: {
            ...state.tour.photos,
            grid: state.tour.photos.grid.map((photo, i) =>
              i === action.index ? { ...photo, src: action.value } : photo
            ),
          },
        },
      };

    case 'UPDATE_PRICING_HERO':
      return {
        ...state,
        tour: {
          ...state.tour,
          photos: {
            ...state.tour.photos,
            pricingHero: { ...state.tour.photos.pricingHero, src: action.value },
          },
        },
      };

    case 'UPDATE_INCLUSION':
      return {
        ...state,
        tour: {
          ...state.tour,
          inclusions: state.tour.inclusions.map((item, i) =>
            i === action.index ? action.value : item
          ),
        },
      };

    case 'ADD_INCLUSION':
      return {
        ...state,
        tour: { ...state.tour, inclusions: [...state.tour.inclusions, ''] },
      };

    case 'REMOVE_INCLUSION':
      return {
        ...state,
        tour: {
          ...state.tour,
          inclusions: state.tour.inclusions.filter((_, i) => i !== action.index),
        },
      };

    case 'UPDATE_STOP':
      return {
        ...state,
        tour: {
          ...state.tour,
          stops: state.tour.stops.map((stop, i) =>
            i === action.index ? action.value : stop
          ),
        },
      };

    case 'ADD_STOP':
      return {
        ...state,
        tour: { ...state.tour, stops: [...state.tour.stops, ''] },
      };

    case 'REMOVE_STOP':
      return {
        ...state,
        tour: {
          ...state.tour,
          stops: state.tour.stops.filter((_, i) => i !== action.index),
        },
      };

    case 'UPDATE_OVERVIEW':
      return {
        ...state,
        tour: {
          ...state.tour,
          overview: state.tour.overview.map((para, i) =>
            i === action.index ? action.value : para
          ),
        },
      };

    case 'ADD_OVERVIEW':
      return {
        ...state,
        tour: { ...state.tour, overview: [...(state.tour.overview || []), ''] },
      };

    case 'REMOVE_OVERVIEW':
      return {
        ...state,
        tour: {
          ...state.tour,
          overview: (state.tour.overview || []).filter((_, i) => i !== action.index),
        },
      };

    case 'UPDATE_OPTION':
      return {
        ...state,
        tour: {
          ...state.tour,
          options: (state.tour.options || []).map((opt, i) =>
            i === action.index ? { ...opt, [action.field]: action.value } : opt
          ),
        },
      };

    case 'ADD_OPTION':
      return {
        ...state,
        tour: {
          ...state.tour,
          options: [...(state.tour.options || []), { label: 'New Option', display: '', note: '' }],
        },
      };

    case 'REMOVE_OPTION':
      return {
        ...state,
        tour: {
          ...state.tour,
          options: (state.tour.options || []).filter((_, i) => i !== action.index),
        },
      };

    case 'UPDATE_PAYMENT':
      return {
        ...state,
        tour: {
          ...state.tour,
          payments: (state.tour.payments || []).map((payment, i) =>
            i === action.index ? { ...payment, [action.field]: action.value } : payment
          ),
        },
      };

    case 'ADD_PAYMENT':
      return {
        ...state,
        tour: {
          ...state.tour,
          payments: [
            ...(state.tour.payments || []),
            { label: 'Payment', display: '$0.00', dueDisplay: 'Due: TBD' },
          ],
        },
      };

    case 'REMOVE_PAYMENT':
      return {
        ...state,
        tour: {
          ...state.tour,
          payments: (state.tour.payments || []).filter((_, i) => i !== action.index),
        },
      };

    case 'UPDATE_TERMS_FIELD':
      return {
        ...state,
        tour: {
          ...state.tour,
          terms: { ...state.tour.terms, [action.field]: action.value },
        },
      };

    case 'UPDATE_WHY_FIELD':
      return {
        ...state,
        tour: {
          ...state.tour,
          whyUs: { ...state.tour.whyUs, [action.field]: action.value },
        },
      };

    case 'UPDATE_WHY_PARAGRAPH':
      return {
        ...state,
        tour: {
          ...state.tour,
          whyUs: {
            ...state.tour.whyUs,
            paragraphs: (state.tour.whyUs?.paragraphs ?? []).map((p, i) =>
              i === action.index ? action.value : p
            ),
          },
        },
      };

    case 'ADD_WHY_PARAGRAPH':
      return {
        ...state,
        tour: {
          ...state.tour,
          whyUs: {
            ...state.tour.whyUs,
            paragraphs: [...(state.tour.whyUs?.paragraphs ?? []), ''],
          },
        },
      };

    case 'REMOVE_WHY_PARAGRAPH':
      return {
        ...state,
        tour: {
          ...state.tour,
          whyUs: {
            ...state.tour.whyUs,
            paragraphs: (state.tour.whyUs?.paragraphs ?? []).filter((_, i) => i !== action.index),
          },
        },
      };

    default:
      return state;
  }
}

function loadSavedTour() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Forward-migrate: inject new top-level fields that didn't exist in older saves.
      // This runs once; on next save the full object is persisted and this is a no-op.
      if (!parsed.terms)  parsed.terms  = defaultBrochure.terms;
      if (!parsed.whyUs)  parsed.whyUs  = defaultBrochure.whyUs;
      return parsed;
    }
  } catch {
    // ignore parse errors — fall through to default
  }
  return defaultBrochure;
}

export function BrochureProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    tour: loadSavedTour(),
    company: companyData,
    terms: termsData,
  });

  // Persist tour to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tour));
    } catch {
      // quota exceeded or private browsing — silently ignore
    }
  }, [state.tour]);

  return (
    <BrochureContext.Provider value={{ state, dispatch }}>
      {children}
    </BrochureContext.Provider>
  );
}

export function useBrochure() {
  const ctx = useContext(BrochureContext);
  if (!ctx) throw new Error('useBrochure must be used within BrochureProvider');
  return ctx;
}
