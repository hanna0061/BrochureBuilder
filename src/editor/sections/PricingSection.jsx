import React, { useState } from 'react';
import { TextField, ArrayField, ImageField } from '../fields/Field';
import { useBrochure } from '../../context/BrochureContext';
import TypoPanel from '../components/TypoPanel';

function OptionEditor({ opt, index, dispatch }) {
  const [open, setOpen] = useState(false);

  const update = (field, value) =>
    dispatch({ type: 'UPDATE_OPTION', index, field, value });

  return (
    <div className={`itinerary-editor__day${open ? ' is-open' : ''}`}>
      <div
        className="itinerary-editor__day-header"
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
      >
        <span className="itinerary-editor__day-title">
          {opt.label || 'Untitled Option'}
        </span>
        <span className="itinerary-editor__day-chevron" />
      </div>
      {open && (
        <div className="itinerary-editor__day-body">
          <TextField
            label="Label"
            value={opt.label || ''}
            onChange={(v) => update('label', v)}
          />
          <TextField
            label="Price Display"
            value={opt.display || ''}
            onChange={(v) => update('display', v)}
            placeholder="e.g. add $950"
          />
          <TextField
            label="Note"
            value={opt.note || ''}
            onChange={(v) => update('note', v)}
            multiline
            rows={2}
          />
          <button
            className="itinerary-editor__remove-btn"
            onClick={() => dispatch({ type: 'REMOVE_OPTION', index })}
            type="button"
          >
            Remove Option
          </button>
        </div>
      )}
    </div>
  );
}

function PaymentEditor({ payment, index, dispatch }) {
  const [open, setOpen] = useState(false);

  const update = (field, value) =>
    dispatch({ type: 'UPDATE_PAYMENT', index, field, value });

  return (
    <div className={`itinerary-editor__day${open ? ' is-open' : ''}`}>
      <div
        className="itinerary-editor__day-header"
        onClick={() => setOpen((o) => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((o) => !o)}
      >
        <span className="itinerary-editor__day-title">
          {payment.label || 'Untitled Payment'}
        </span>
        <span className="itinerary-editor__day-chevron" />
      </div>
      {open && (
        <div className="itinerary-editor__day-body">
          <TextField
            label="Label"
            value={payment.label || ''}
            onChange={(v) => update('label', v)}
            placeholder="e.g. First Payment"
          />
          <TextField
            label="Amount Display"
            value={payment.display || ''}
            onChange={(v) => update('display', v)}
            placeholder="e.g. $500.00"
          />
          <TextField
            label="Due Date"
            value={payment.dueDisplay || ''}
            onChange={(v) => update('dueDisplay', v)}
            placeholder="e.g. Due: Now"
          />
          <button
            className="itinerary-editor__remove-btn"
            onClick={() => dispatch({ type: 'REMOVE_PAYMENT', index })}
            type="button"
          >
            Remove Row
          </button>
        </div>
      )}
    </div>
  );
}

export default function PricingSection() {
  const { state, dispatch } = useBrochure();
  const { inclusions, options, payments } = state.tour;
  const { pricingHero } = state.tour.photos;

  return (
    <div>
      {/* Pricing page hero image */}
      <span className="field-group-label" style={{ marginTop: 0, borderTop: 'none' }}>
        Pricing Page Hero Image
      </span>
      <ImageField
        label="Hero Image"
        value={pricingHero.src}
        onChange={(v) => dispatch({ type: 'UPDATE_PRICING_HERO', value: v })}
        heroAspect
      />

      {/* Options */}
      <span className="field-group-label">Options</span>
      {(options || []).map((opt, i) => (
        <OptionEditor key={i} opt={opt} index={i} dispatch={dispatch} />
      ))}
      <button
        className="array-field__add"
        onClick={() => dispatch({ type: 'ADD_OPTION' })}
        type="button"
        style={{ marginTop: 8 }}
      >
        + Add Option
      </button>

      {/* Payment schedule */}
      <span className="field-group-label">Payment Schedule</span>
      {(payments || []).map((payment, i) => (
        <PaymentEditor key={i} payment={payment} index={i} dispatch={dispatch} />
      ))}
      <button
        className="array-field__add"
        onClick={() => dispatch({ type: 'ADD_PAYMENT' })}
        type="button"
        style={{ marginTop: 8 }}
      >
        + Add Payment Row
      </button>

      {/* Tour inclusions */}
      <span className="field-group-label">Tour Inclusions</span>
      <ArrayField
        items={inclusions}
        onChange={(i, v) => dispatch({ type: 'UPDATE_INCLUSION', index: i, value: v })}
        onAdd={() => dispatch({ type: 'ADD_INCLUSION' })}
        onRemove={(i) => dispatch({ type: 'REMOVE_INCLUSION', index: i })}
        placeholder="Included item…"
      />

      <TypoPanel
        keys={['pricingHeading', 'pricingBody', 'tourIncludes', 'whyTravel']}
        resetLabel="Pricing"
      />
      <TypoPanel
        keys={['pricingTableLabel', 'pricingTableAmount', 'pricingTableDue']}
        resetLabel="Payment Table"
        label="Payment Table"
      />
    </div>
  );
}
