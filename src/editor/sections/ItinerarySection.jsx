import React, { useState } from 'react';
import { TextField } from '../fields/Field';
import { useBrochure } from '../../context/BrochureContext';
import TypoPanel from '../components/TypoPanel';

function DayEditor({ day, index, dispatch }) {
  const [open, setOpen] = useState(false);

  const update = (field, value) =>
    dispatch({ type: 'UPDATE_ITINERARY_DAY', index, field, value });

  return (
    <div className={`itinerary-editor__day${open ? ' is-open' : ''}`}>
      <div
        className="itinerary-editor__day-header"
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
      >
        <span className="itinerary-editor__day-num">{String(day.day).padStart(2, '0')}</span>
        <span className="itinerary-editor__day-title">
          {day.heading || 'Untitled Day'}
        </span>
        <span className="itinerary-editor__day-chevron" />
      </div>

      {open && (
        <div className="itinerary-editor__day-body">
          <TextField
            label="Label (e.g. Day 1)"
            value={day.label}
            onChange={(v) => update('label', v)}
          />
          <TextField
            label="Heading"
            value={day.heading}
            onChange={(v) => update('heading', v)}
          />
          <TextField
            label="Body"
            value={day.body}
            onChange={(v) => update('body', v)}
            multiline
            rows={5}
          />
          <TextField
            label="Overnight"
            value={day.overnight || ''}
            onChange={(v) => update('overnight', v || null)}
            placeholder="City name"
          />
          <TextField
            label="Meals"
            value={day.meals || ''}
            onChange={(v) => update('meals', v || null)}
            placeholder="Breakfast, Dinner"
          />
          <button
            className="itinerary-editor__remove-btn"
            onClick={() => dispatch({ type: 'REMOVE_ITINERARY_DAY', index })}
            type="button"
          >
            Remove Day
          </button>
        </div>
      )}
    </div>
  );
}

export default function ItinerarySection() {
  const { state, dispatch } = useBrochure();

  return (
    <div>
      {state.tour.itinerary.map((day, i) => (
        <DayEditor key={i} day={day} index={i} dispatch={dispatch} />
      ))}
      <button
        className="array-field__add"
        onClick={() => dispatch({ type: 'ADD_ITINERARY_DAY' })}
        type="button"
        style={{ marginTop: 8 }}
      >
        + Add Day
      </button>

      <TypoPanel keys={['itineraryTitle', 'itinerarySubtitle', 'itineraryDayLabel', 'itineraryHeading', 'itineraryBody', 'itineraryOvernight']} resetLabel="Itinerary" positionKey="itinerary" />
    </div>
  );
}
