import React from 'react';
import { ArrayField } from '../fields/Field';
import { useBrochure } from '../../context/BrochureContext';

export default function DestinationsSection() {
  const { state, dispatch } = useBrochure();

  return (
    <ArrayField
      label="Destination Cities"
      items={state.tour.stops}
      onChange={(i, v) => dispatch({ type: 'UPDATE_STOP', index: i, value: v })}
      onAdd={() => dispatch({ type: 'ADD_STOP' })}
      onRemove={(i) => dispatch({ type: 'REMOVE_STOP', index: i })}
      placeholder="City name…"
    />
  );
}
