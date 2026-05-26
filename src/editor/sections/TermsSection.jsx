import React from 'react';
import { TextField } from '../fields/Field';
import { useBrochure } from '../../context/BrochureContext';

export default function TermsSection() {
  const { state, dispatch } = useBrochure();
  const terms = state.tour.terms ?? {};
  const {
    headerTitle = 'Terms & Conditions of Travel',
    intro = '',
    bodyText = '',
    disclaimer = '',
    fontSize = 7,
    lineHeight = 1.45,
  } = terms;

  const set = (field, value) =>
    dispatch({ type: 'UPDATE_TERMS_FIELD', field, value });

  return (
    <div>

      <span className="field-group-label" style={{ marginTop: 0, borderTop: 'none' }}>
        Page Header
      </span>
      <TextField
        label="Title"
        value={headerTitle}
        onChange={(v) => set('headerTitle', v)}
        placeholder="Terms & Conditions of Travel"
      />

      <span className="field-group-label">Introduction</span>
      <TextField
        label="Intro Text"
        value={intro}
        onChange={(v) => set('intro', v)}
        multiline
        rows={4}
        placeholder="Opening paragraphs — separate with a blank line…"
      />

      <span className="field-group-label">Legal Body Text</span>
      <p style={{ fontSize: 10, color: '#6B6B7A', padding: '0 0 6px', lineHeight: 1.45 }}>
        Separate paragraphs with a blank line. Start a paragraph with{' '}
        <code style={{ background: '#f0f0ee', padding: '1px 3px', borderRadius: 2 }}>
          **HEADING:**
        </code>{' '}
        to bold its heading inline.
      </p>
      <TextField
        label=""
        value={bodyText}
        onChange={(v) => set('bodyText', v)}
        multiline
        rows={20}
        placeholder={"**DOCUMENTS:** US citizens require a valid passport.\n\n**REGISTRATION AND DEPOSIT:** Deposit of $500 per person…"}
      />

      <span className="field-group-label">Disclaimer Note</span>
      <TextField
        label="Note"
        value={disclaimer}
        onChange={(v) => set('disclaimer', v)}
        multiline
        rows={3}
        placeholder="Note: While no changes are anticipated…"
      />

      <span className="field-group-label">Typography</span>
      <div className="field">
        <label className="field__label">Font Size — {fontSize}px</label>
        <input
          type="range"
          min={5}
          max={12}
          step={0.5}
          value={fontSize}
          onChange={(e) => set('fontSize', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
      <div className="field">
        <label className="field__label">Line Height — {lineHeight}</label>
        <input
          type="range"
          min={1.1}
          max={2.0}
          step={0.05}
          value={lineHeight}
          onChange={(e) => set('lineHeight', parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>

    </div>
  );
}
