import React from 'react';
import { useBrochure } from '../../context/BrochureContext';
import { useSelection } from '../../context/SelectionContext';
import { createTextElement, TEXTGRAM_PAGES, TEXTGRAM_PAGE_LABELS } from '../../data/textElements';

/**
 * Text Elements — sidebar list for Textgram freeform text boxes.
 * Primary placement still happens via the "Aa Add Text" preview toolbar
 * button (click-to-place, like Instagram's text tool); this section is the
 * discoverable list/management view, mirroring how Images/Logos get both a
 * direct-drag interaction AND a sidebar section for the same data.
 *
 * `pages` scopes both the "Add Text Box" buttons and the placed-elements
 * list to a specific set of page ids — defaults to the brochure's own pages
 * (unchanged behavior for EditorSidebar). RegistrationFormEditor renders
 * this same component with pages={['registrationForm']} so each document
 * only ever shows and manages its own Textgram elements.
 */
export default function TextElementsSection({ pages = TEXTGRAM_PAGES }) {
  const { state, dispatch } = useBrochure();
  const { selectedId, selectElement, openFloating } = useSelection();
  const elements = (state.tour.textElements ?? []).filter((el) => pages.includes(el.page));

  const addToPage = (page) =>
    dispatch({ type: 'ADD_TEXT_ELEMENT', element: createTextElement(page) });

  const openEditor = (el, e) =>
    openFloating({ id: el.id, type: 'textgram', label: 'Text Box' }, e);

  const duplicate = (id) => dispatch({ type: 'DUPLICATE_TEXT_ELEMENT', id });
  const remove = (id) => dispatch({ type: 'DELETE_TEXT_ELEMENT', id });

  return (
    <div>
      <div className="field__label" style={{ marginBottom: 8 }}>Add Text Box</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(pages.length, 2)}, 1fr)`, gap: 6, marginBottom: 12 }}>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className="array-field__add"
            onClick={() => addToPage(page)}
          >
            + {TEXTGRAM_PAGE_LABELS[page]}
          </button>
        ))}
      </div>

      <p style={{ fontSize: 10, color: '#6B6B7A', lineHeight: 1.45, marginBottom: 12 }}>
        Tip: Use <strong>Aa Add Text</strong> in the preview toolbar to click anywhere on a
        page and place a text box exactly where you want it.
      </p>

      {elements.length > 0 && (
        <>
          <span className="field-group-label" style={{ marginTop: 0 }}>
            Placed Text Boxes ({elements.length})
          </span>
          <div className="array-field__list">
            {elements.map((el) => (
              <div
                key={el.id}
                className="array-field__item"
                style={{
                  alignItems: 'center',
                  background: selectedId === el.id ? '#f0f4ff' : undefined,
                  borderRadius: 4,
                }}
              >
                <button
                  type="button"
                  className="field__input"
                  style={{ textAlign: 'left', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  title="Click to select and edit"
                  onClick={(e) => { selectElement(el.id); openEditor(el, e); }}
                >
                  <span style={{ color: '#999', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.03em', marginRight: 6 }}>
                    {TEXTGRAM_PAGE_LABELS[el.page]?.replace(/^Page \d — /, '') ?? el.page}
                  </span>
                  {el.text || <em style={{ color: '#aaa' }}>Empty text box</em>}
                </button>
                <button
                  type="button"
                  className="array-field__remove"
                  onClick={() => duplicate(el.id)}
                  title="Duplicate"
                  aria-label="Duplicate text box"
                  style={{ fontSize: 13 }}
                >
                  ⧉
                </button>
                <button
                  type="button"
                  className="array-field__remove"
                  onClick={() => remove(el.id)}
                  title="Delete"
                  aria-label="Delete text box"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
