import React from 'react';
import { TextField } from '../fields/Field';
import { useBrochure } from '../../context/BrochureContext';

export default function WhyTravelSection() {
  const { state, dispatch } = useBrochure();
  const whyUs = state.tour.whyUs ?? {};
  const {
    heading = 'Why Travel with Pax Via?',
    paragraphs = [],
  } = whyUs;

  const setField = (field, value) =>
    dispatch({ type: 'UPDATE_WHY_FIELD', field, value });

  return (
    <div>

      <span className="field-group-label" style={{ marginTop: 0, borderTop: 'none' }}>
        Section Heading
      </span>
      <TextField
        label="Heading"
        value={heading}
        onChange={(v) => setField('heading', v)}
        placeholder="Why Travel with Pax Via?"
      />

      <span className="field-group-label">Body Paragraphs</span>
      {paragraphs.map((para, i) => (
        <div key={i}>
          <TextField
            label={`Paragraph ${i + 1}`}
            value={para}
            onChange={(v) => dispatch({ type: 'UPDATE_WHY_PARAGRAPH', index: i, value: v })}
            multiline
            rows={5}
            placeholder="Enter paragraph text…"
          />
          <button
            className="itinerary-editor__remove-btn"
            onClick={() => dispatch({ type: 'REMOVE_WHY_PARAGRAPH', index: i })}
            type="button"
            style={{ marginBottom: 8 }}
          >
            Remove Paragraph
          </button>
        </div>
      ))}
      <button
        className="array-field__add"
        onClick={() => dispatch({ type: 'ADD_WHY_PARAGRAPH' })}
        type="button"
        style={{ marginTop: 4 }}
      >
        + Add Paragraph
      </button>

    </div>
  );
}
