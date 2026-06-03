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

function InfoBlockEditor({ block, index, dispatch }) {
  const [open, setOpen] = useState(false);

  const update = (field, value) =>
    dispatch({ type: 'UPDATE_INFO_BLOCK', index, field, value });

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
          {block.title || 'Untitled Block'}
        </span>
        <span className="itinerary-editor__day-chevron" />
      </div>
      {open && (
        <div className="itinerary-editor__day-body">
          <TextField
            label="Title"
            value={block.title || ''}
            onChange={(v) => update('title', v)}
          />
          <TextField
            label="Body"
            value={block.body || ''}
            onChange={(v) => update('body', v)}
            multiline
            rows={3}
          />
          <button
            className="itinerary-editor__remove-btn"
            onClick={() => dispatch({ type: 'REMOVE_INFO_BLOCK', index })}
            type="button"
          >
            Remove Block
          </button>
        </div>
      )}
    </div>
  );
}

export default function PricingSection() {
  const { state, dispatch } = useBrochure();
  const { inclusions, options, payments, notIncluded, infoBlocks } = state.tour;
  const { pricingHero } = state.tour.photos;

  const page3AccentColor = state.tour.colors?.page3AccentColor ?? '';
  const setPage3AccentColor = (val) =>
    dispatch({ type: 'UPDATE_COLOR', key: 'page3AccentColor', value: val || null });

  return (
    <div>
      {/* Page 3 accent — drives both Pricing Bar and Divider Bar */}
      <span className="field-group-label" style={{ marginTop: 0, borderTop: 'none' }}>
        Page 3 Accent Color
      </span>
      <div className="color-field">
        <label className="field__label">Pricing Bar + Divider Bar</label>
        <div className="color-field__row">
          <input
            type="color"
            className="color-field__picker"
            value={page3AccentColor || '#286ebe'}
            onChange={e => setPage3AccentColor(e.target.value)}
          />
          <input
            type="text"
            className="color-field__hex field__input"
            value={page3AccentColor}
            placeholder="Default blue / navy"
            onChange={e => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && setPage3AccentColor(e.target.value)}
            maxLength={7}
            spellCheck={false}
          />
          {page3AccentColor && (
            <button
              type="button"
              onClick={() => setPage3AccentColor(null)}
              style={{ fontSize: 9, color: '#888', background: 'none', border: '1px solid #d5d5e0', borderRadius: 3, cursor: 'pointer', padding: '2px 6px', whiteSpace: 'nowrap' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Pricing page hero image */}
      <span className="field-group-label">
        Pricing Page Hero Image
      </span>
      <ImageField
        label="Hero Image"
        value={pricingHero.src}
        onChange={(v) => dispatch({ type: 'UPDATE_PRICING_HERO', value: v })}
        heroAspect
      />

      {/* Base price fields */}
      <span className="field-group-label">Base Price</span>
      <TextField
        label="Price Display"
        value={state.tour.price?.display || ''}
        onChange={(v) => dispatch({ type: 'UPDATE_NESTED', parent: 'price', field: 'display', value: v })}
        placeholder="e.g. $4,699.00*"
      />
      <TextField
        label="Price Basis"
        value={state.tour.price?.basis || ''}
        onChange={(v) => dispatch({ type: 'UPDATE_NESTED', parent: 'price', field: 'basis', value: v })}
        placeholder="per person, double occupancy"
      />
      <TextField
        label="Land Only Display"
        value={state.tour.price?.landOnlyDisplay || ''}
        onChange={(v) => dispatch({ type: 'UPDATE_NESTED', parent: 'price', field: 'landOnlyDisplay', value: v })}
        placeholder="e.g. $2,799.00* (leave blank to hide)"
      />
      <TextField
        label="Land Only Basis"
        value={state.tour.price?.landOnlyBasis || ''}
        onChange={(v) => dispatch({ type: 'UPDATE_NESTED', parent: 'price', field: 'landOnlyBasis', value: v })}
        placeholder="land only — no airfare"
      />
      <TextField
        label="Discount Note"
        value={state.tour.price?.note || ''}
        onChange={(v) => dispatch({ type: 'UPDATE_NESTED', parent: 'price', field: 'note', value: v })}
        placeholder="*Discount cash/check price"
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
      <span className="field-group-label">Tour Includes</span>
      <ArrayField
        items={inclusions}
        onChange={(i, v) => dispatch({ type: 'UPDATE_INCLUSION', index: i, value: v })}
        onAdd={() => dispatch({ type: 'ADD_INCLUSION' })}
        onRemove={(i) => dispatch({ type: 'REMOVE_INCLUSION', index: i })}
        placeholder="Included item…"
      />

      {/* Not included */}
      <span className="field-group-label">Not Included</span>
      <ArrayField
        items={notIncluded || []}
        onChange={(i, v) => dispatch({ type: 'UPDATE_NOT_INCLUDED', index: i, value: v })}
        onAdd={() => dispatch({ type: 'ADD_NOT_INCLUDED' })}
        onRemove={(i) => dispatch({ type: 'REMOVE_NOT_INCLUDED', index: i })}
        placeholder="Not included item…"
      />

      {/* Additional info blocks */}
      <span className="field-group-label">Additional Info Blocks</span>
      {(infoBlocks || []).map((block, i) => (
        <InfoBlockEditor key={i} block={block} index={i} dispatch={dispatch} />
      ))}
      <button
        className="array-field__add"
        onClick={() => dispatch({ type: 'ADD_INFO_BLOCK' })}
        type="button"
        style={{ marginTop: 8 }}
      >
        + Add Info Block
      </button>

      <TypoPanel
        keys={[
          'pricingBarTitle',
          'priceLabel', 'priceAmount', 'priceBasis',
          'optionsHeading', 'optionsText',
          'includesHeading', 'includesItems',
          'notIncludedHeading', 'notIncludedItems',
          'infoSectionTitle', 'infoSectionBody',
          'whyTravelHeading', 'whyTravel',
        ]}
        resetLabel="Pricing"
      />
      <TypoPanel
        keys={['paymentLabels', 'paymentValues', 'paymentDue']}
        resetLabel="Payment Table"
        label="Payment Table"
      />
    </div>
  );
}
