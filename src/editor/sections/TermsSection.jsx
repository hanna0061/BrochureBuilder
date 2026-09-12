import React from 'react';
import { TextField } from '../fields/Field';
import { useBrochure } from '../../context/BrochureContext';
import TypoPanel from '../components/TypoPanel';
// Typography changes go into tour.typography and are applied via getP4Typo() in Page4Terms.jsx.
// P4_TYPO provides the frozen defaults; user edits layer on top — so these panels have full effect.

export default function TermsSection() {
  const { state, dispatch } = useBrochure();
  const terms = state.tour.terms ?? {};
  const {
    headerTitle = 'Terms & Conditions of Travel',
    intro = '',
    bodyText = '',
    disclaimer = '',
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
      <TypoPanel keys={['termsTitle']} resetLabel="Terms Title" label="Terms Title" />

      <span className="field-group-label">Introduction</span>
      <TextField
        label="Intro Text"
        value={intro}
        onChange={(v) => set('intro', v)}
        multiline
        rows={4}
        placeholder="Opening paragraphs — separate with a blank line…"
      />
      <TypoPanel keys={['termsIntro']} resetLabel="Terms Intro" label="Terms Intro" />

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
      <TypoPanel keys={['termsBody']} resetLabel="Terms Body" label="Terms Body" />

      <span className="field-group-label">Disclaimer Note</span>
      <TextField
        label="Note"
        value={disclaimer}
        onChange={(v) => set('disclaimer', v)}
        multiline
        rows={3}
        placeholder="Note: While no changes are anticipated…"
      />
      <TypoPanel keys={['termsDisclaimer']} resetLabel="Terms Disclaimer" label="Terms Disclaimer" />

      <span className="field-group-label">Footer</span>
      <TypoPanel keys={['termsFooter']} resetLabel="Terms Footer" label="Terms Footer" />
    </div>
  );
}
