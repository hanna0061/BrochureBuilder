import React from 'react';
import { TextField } from '../fields/Field';
import { useBrochure } from '../../context/BrochureContext';
import TypoPanel from '../components/TypoPanel';

const COVER_TYPO_KEYS = [
  'coverTitle',
  'coverSubtitle',
  'infobarMonth',
  'infobarDateRange',
  'infobarPrice',
  'infobarDeparture',
  'infobarBookNow',
];

export default function TourInfoSection() {
  const { state, dispatch } = useBrochure();
  const { tour } = state;

  const update = (field, value) => dispatch({ type: 'UPDATE_FIELD', field, value });
  const nested = (parent, field, value) => dispatch({ type: 'UPDATE_NESTED', parent, field, value });

  return (
    <div>
      <TextField
        label="Leader / Intro Line"
        value={tour.leader}
        onChange={(v) => update('leader', v)}
        multiline
        rows={2}
        placeholder="Join Father… on a Pilgrimage to"
      />
      <TextField
        label="Tour Title"
        value={tour.title}
        onChange={(v) => update('title', v)}
        multiline
        rows={2}
        placeholder="Poland, Czech\n& Medjugorje"
      />
      <TextField
        label="Short Title"
        value={tour.titleShort}
        onChange={(v) => update('titleShort', v)}
        placeholder="Poland, Czech & Medjugorje"
      />
      <TextField
        label="Tour Code"
        value={tour.tourCode}
        onChange={(v) => update('tourCode', v)}
        placeholder="SFO-1012/12D"
      />

      <span className="field-group-label">Dates</span>

      <TextField
        label="Month"
        value={tour.dates.month}
        onChange={(v) => nested('dates', 'month', v)}
        placeholder="October"
      />
      <TextField
        label="Date Range (e.g. 12–23, 2026)"
        value={tour.dates.range}
        onChange={(v) => nested('dates', 'range', v)}
        placeholder="12–23, 2026"
      />

      <span className="field-group-label">Duration</span>

      <TextField
        label="Duration Display"
        value={tour.duration.display}
        onChange={(v) => nested('duration', 'display', v)}
        placeholder="12 Days / 10 Nights"
      />

      <span className="field-group-label">Departure</span>

      <TextField
        label="Departure Display"
        value={tour.departure.display}
        onChange={(v) => nested('departure', 'display', v)}
        placeholder="From San Francisco"
      />

      <span className="field-group-label">Pricing</span>

      <TextField
        label="Price Display (e.g. $4,699*)"
        value={tour.price.display}
        onChange={(v) => nested('price', 'display', v)}
        placeholder="$4,699*"
      />

      <TypoPanel keys={COVER_TYPO_KEYS} resetLabel="Cover" />
    </div>
  );
}
