import React from 'react';
import { ArrayField } from '../fields/Field';
import { useBrochure } from '../../context/BrochureContext';
import TypoPanel from '../components/TypoPanel';

export default function DestinationsSection() {
  const { state, dispatch } = useBrochure();

  return (
    <div>
      <ArrayField
        label="Destination Cities"
        items={state.tour.stops}
        onChange={(i, v) => dispatch({ type: 'UPDATE_STOP', index: i, value: v })}
        onAdd={() => dispatch({ type: 'ADD_STOP' })}
        onRemove={(i) => dispatch({ type: 'REMOVE_STOP', index: i })}
        placeholder="City name…"
      />
      <TypoPanel keys={['destinationStrip']} resetLabel="Destination Strip" positionKey="destinationStrip" />
    </div>
  );
}
