import React, { createContext, useContext, useReducer, useEffect } from 'react';
import defaultBrochure from '../data/brochures/poland-czech-medjugorje.json';
import companyData from '../data/global/company.json';
import termsData from '../data/global/terms.json';
import { TYPOGRAPHY_DEFAULTS } from '../data/typography';
import { POSITION_DEFAULTS } from '../data/positions';

// Forward-migrate a loaded tour so all keys are present (typography, colors, positions).
function migrateTour(tour) {
  const typo = tour.typography ? { ...tour.typography } : {};
  for (const key of Object.keys(TYPOGRAPHY_DEFAULTS)) {
    // P4_TYPO_KEYS are owned by P4_TYPO in Page4Terms.jsx. Skipping auto-fill here
    // ensures that absent keys fall back to the frozen P4_TYPO approved defaults via
    // getP4Typo() rather than silently baking in old TYPOGRAPHY_DEFAULTS values.
    if (P4_TYPO_KEYS.has(key)) continue;
    if (!typo[key]) typo[key] = { ...TYPOGRAPHY_DEFAULTS[key] };
  }

  // Migrate logos: old 'size' field → new 'width' field
  const rawLogos = tour.logos ?? {};
  const logos = {};
  for (const key of Object.keys(rawLogos)) {
    const logo = rawLogos[key];
    if (logo && logo.size !== undefined && logo.width === undefined) {
      const { size, ...rest } = logo;
      logos[key] = { ...rest, width: size };
    } else {
      logos[key] = logo;
    }
  }

  // Normalize coverPortrait — ensure all four fields are present or the whole value is null.
  // Partial objects (e.g. from hand-edited JSON or future schema changes) get defaults filled in.
  // An absent src means "no portrait", so we collapse to null to keep state unambiguous.
  const rawPortrait = tour.coverPortrait;
  const coverPortrait =
    rawPortrait && rawPortrait.src
      ? {
          src:  rawPortrait.src,
          size: rawPortrait.size ?? 160,
          x:    rawPortrait.x   ?? 0,
          y:    rawPortrait.y   ?? 0,
        }
      : null;

  return {
    ...tour,
    typography:     typo,
    colors:         tour.colors         ?? {},
    positions:      tour.positions      ?? {},
    imagePositions: tour.imagePositions ?? {},
    logos,
    notIncluded:    tour.notIncluded    ?? [],
    infoBlocks:     tour.infoBlocks     ?? [],
    coverPortrait,
  };
}

const BrochureContext = createContext(null);
const STORAGE_KEY   = 'paxvia_brochure_draft';
const SCHEMA_VERSION = '2026.06.print-fix';

// P4 typography keys are owned by P4_TYPO in Page4Terms.jsx (frozen approved design 2026-06-04).
// migrateTour() must NOT auto-fill these from TYPOGRAPHY_DEFAULTS — doing so creates stored
// values that override P4_TYPO frozen defaults via getP4Typo(), causing old font sizes to
// persist across deployments. Old drafts that already have these set are cleared by
// applyLegacyMigration() so the frozen defaults take effect.
const P4_TYPO_KEYS = new Set([
  'termsTitle', 'termsIntro', 'termsBody', 'termsDisclaimer',
  'termsFooter', 'footerContact', 'footerParagraph',
]);

// Applies to drafts saved before SCHEMA_VERSION was introduced.
// Clears stale auto-filled P4 typography overrides so P4_TYPO frozen defaults
// (Page4Terms.jsx) take effect rather than old TYPOGRAPHY_DEFAULTS values.
// Portrait positioning is re-normalized by the coverPortrait block in migrateTour().
// This function mutates `parsed` in place — called only from load/import paths.
function applyLegacyMigration(parsed) {
  if (parsed.typography) {
    const typo = { ...parsed.typography };
    for (const key of P4_TYPO_KEYS) delete typo[key];
    parsed.typography = typo;
  }
  // eslint-disable-next-line no-console
  console.warn('[BrochureContext] Legacy draft migrated to schema', SCHEMA_VERSION,
    '— Page 4 typography reset to approved locked defaults. User edits on other pages are preserved.');
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_TOUR': {
      const payload = { ...action.payload };
      // Imported project files (useProjectSave.loadProject) may be old drafts
      // without _schemaVersion. Apply the same migration as loadSavedTour().
      if (!payload._schemaVersion) {
        applyLegacyMigration(payload);
        payload._schemaVersion = SCHEMA_VERSION;
      }
      return { ...state, tour: migrateTour(payload) };
    }

    case 'RESET_TOUR':
      return { ...state, tour: migrateTour({ ...defaultBrochure, _schemaVersion: SCHEMA_VERSION }) };

    case 'UPDATE_TYPOGRAPHY': {
      const currentSection = state.tour.typography?.[action.section] || {};
      return {
        ...state,
        tour: {
          ...state.tour,
          typography: {
            ...state.tour.typography,
            [action.section]: { ...currentSection, [action.field]: action.value },
          },
        },
      };
    }

    case 'RESET_TYPOGRAPHY_SECTION':
      return {
        ...state,
        tour: {
          ...state.tour,
          typography: {
            ...state.tour.typography,
            [action.section]: { ...TYPOGRAPHY_DEFAULTS[action.section] },
          },
        },
      };

    case 'UPDATE_COLOR':
      return {
        ...state,
        tour: {
          ...state.tour,
          colors: { ...state.tour.colors, [action.key]: action.value },
        },
      };

    case 'RESET_COLORS':
      return {
        ...state,
        tour: { ...state.tour, colors: {} },
      };

    case 'UPDATE_POSITION':
      return {
        ...state,
        tour: {
          ...state.tour,
          positions: {
            ...state.tour.positions,
            [action.key]: {
              ...(state.tour.positions?.[action.key] ?? POSITION_DEFAULTS[action.key]),
              [action.axis]: action.value,
            },
          },
        },
      };

    case 'RESET_POSITION':
      return {
        ...state,
        tour: {
          ...state.tour,
          positions: { ...state.tour.positions, [action.key]: { x: 0, y: 0 } },
        },
      };

    case 'RESET_ALL_POSITIONS':
      return {
        ...state,
        tour: { ...state.tour, positions: {} },
      };

    case 'UPDATE_IMAGE_POSITION':
      return {
        ...state,
        tour: {
          ...state.tour,
          imagePositions: { ...state.tour.imagePositions, [action.key]: action.value },
        },
      };

    case 'RESET_IMAGE_POSITIONS':
      return {
        ...state,
        tour: { ...state.tour, imagePositions: {} },
      };

    case 'UPDATE_LOGO':
      return {
        ...state,
        tour: {
          ...state.tour,
          logos: {
            ...state.tour.logos,
            [action.key]: { ...(state.tour.logos?.[action.key] ?? {}), [action.field]: action.value },
          },
        },
      };

    case 'RESET_LOGO':
      return {
        ...state,
        tour: { ...state.tour, logos: { ...state.tour.logos, [action.key]: {} } },
      };

    case 'RESET_ALL_LOGOS':
      return {
        ...state,
        tour: { ...state.tour, logos: {} },
      };

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

    case 'UPDATE_ITINERARY_ELEMENT_POS':
      return {
        ...state,
        tour: {
          ...state.tour,
          itinerary: state.tour.itinerary.map((day, i) => {
            if (i !== action.index) return day;
            const curPos = day.positions ?? {};
            return {
              ...day,
              positions: {
                ...curPos,
                [action.field]: {
                  ...(curPos[action.field] ?? { x: 0, y: 0 }),
                  [action.axis]: action.value,
                },
              },
            };
          }),
        },
      };

    case 'RESET_ITINERARY_ELEMENT_POS': {
      return {
        ...state,
        tour: {
          ...state.tour,
          itinerary: state.tour.itinerary.map((day, i) => {
            if (i !== action.index) return day;
            const { [action.field]: _removed, ...restPos } = day.positions ?? {};
            return { ...day, positions: restPos };
          }),
        },
      };
    }

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

    case 'UPDATE_COVER_PORTRAIT':
      return {
        ...state,
        tour: {
          ...state.tour,
          coverPortrait: {
            ...(state.tour.coverPortrait ?? { src: null, size: 160, x: 0, y: 0 }),
            [action.field]: action.value,
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

    case 'UPDATE_NOT_INCLUDED':
      return {
        ...state,
        tour: {
          ...state.tour,
          notIncluded: (state.tour.notIncluded || []).map((item, i) =>
            i === action.index ? action.value : item
          ),
        },
      };

    case 'ADD_NOT_INCLUDED':
      return {
        ...state,
        tour: { ...state.tour, notIncluded: [...(state.tour.notIncluded || []), ''] },
      };

    case 'REMOVE_NOT_INCLUDED':
      return {
        ...state,
        tour: {
          ...state.tour,
          notIncluded: (state.tour.notIncluded || []).filter((_, i) => i !== action.index),
        },
      };

    case 'UPDATE_INFO_BLOCK':
      return {
        ...state,
        tour: {
          ...state.tour,
          infoBlocks: (state.tour.infoBlocks || []).map((block, i) =>
            i === action.index ? { ...block, [action.field]: action.value } : block
          ),
        },
      };

    case 'UPDATE_INFO_BULLET':
      return {
        ...state,
        tour: {
          ...state.tour,
          infoBlocks: (state.tour.infoBlocks || []).map((block, i) =>
            i === action.index
              ? {
                  ...block,
                  bullets: (block.bullets || []).map((bullet, j) =>
                    j === action.bulletIndex ? action.value : bullet
                  ),
                }
              : block
          ),
        },
      };

    case 'UPDATE_WHY_PARAGRAPH':
      return {
        ...state,
        tour: {
          ...state.tour,
          whyUs: {
            ...state.tour.whyUs,
            paragraphs: (state.tour.whyUs?.paragraphs || []).map((para, i) =>
              i === action.index ? action.value : para
            ),
          },
        },
      };

    case 'ADD_INFO_BLOCK':
      return {
        ...state,
        tour: {
          ...state.tour,
          infoBlocks: [...(state.tour.infoBlocks || []), { title: 'New Block', body: '' }],
        },
      };

    case 'REMOVE_INFO_BLOCK':
      return {
        ...state,
        tour: {
          ...state.tour,
          infoBlocks: (state.tour.infoBlocks || []).filter((_, i) => i !== action.index),
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

      // Schema version check — any draft without _schemaVersion is pre-versioning
      // and must be migrated before use. Subsequent schema bumps can add else-if
      // branches here for incremental migrations.
      if (!parsed._schemaVersion) {
        applyLegacyMigration(parsed);
        parsed._schemaVersion = SCHEMA_VERSION;
      }

      if (!parsed.terms) parsed.terms = defaultBrochure.terms;
      if (!parsed.whyUs) parsed.whyUs = defaultBrochure.whyUs;
      if (!parsed.notIncluded?.length) parsed.notIncluded = defaultBrochure.notIncluded;
      // Migrate infoBlocks: old format used plain body strings; new format uses bullets arrays.
      // If any block is missing bullets, replace the entire array from the default JSON.
      const needsInfoMigration = !parsed.infoBlocks?.length ||
        parsed.infoBlocks.some(b => !b.bullets && b.body !== undefined);
      if (needsInfoMigration) parsed.infoBlocks = defaultBrochure.infoBlocks;
      return migrateTour(parsed);
    }
  } catch {
    // ignore parse errors — fall through to default
  }
  return migrateTour({ ...defaultBrochure, _schemaVersion: SCHEMA_VERSION });
}

export function BrochureProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, {
    tour: loadSavedTour(),
    company: companyData,
    terms: termsData,
  });

  // Persist tour to localStorage on every change.
  // Always stamps _schemaVersion so future loads can detect and migrate old drafts.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state.tour, _schemaVersion: SCHEMA_VERSION }));
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
