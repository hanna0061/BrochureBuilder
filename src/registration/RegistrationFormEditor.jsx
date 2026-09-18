import React, { useCallback, useState } from 'react';
import { TextField, ImageField } from '../editor/fields/Field';
import { useBrochure } from '../context/BrochureContext';
import { getRegTypo, REG_TYPO_GROUP_LABELS } from './registrationFormTypography';
import RegTypoFields, { CHECKBOX_INPUT_STYLE } from './RegTypoFields';
import TextElementsSection from '../editor/sections/TextElementsSection';

// Textgram overlay on the Registration Form uses the exact same
// tour.textElements array / TextElementsSection / TextgramLayer /
// TextgramElement / FloatingEditor as the brochure — just scoped to this
// one page id, so its "Add Text Box" button and placed-elements list never
// mix with the brochure's own Textgram elements (see TextElementsSection's
// `pages` prop).
const REGISTRATION_FORM_TEXTGRAM_PAGES = ['registrationForm'];

/**
 * Registration Form editing panel — the left-hand pane of the Registration
 * Form workspace (App.jsx renders this alongside RegistrationFormWorkspace,
 * mirroring the brochure's EditorSidebar + BrochurePreview pairing).
 *
 * A flat set of grouped, fixed content fields — no field builder. The
 * manager edits CONTENT (text, values, checkbox states, font/color/style)
 * and never LAYOUT (every field here maps to a pre-existing key in
 * registrationFormDefaults.js; nothing here can add/remove/reorder a field
 * or move an element). Dispatches only UPDATE_REGISTRATION_FORM and
 * UPDATE_REGISTRATION_TYPOGRAPHY / RESET_REGISTRATION_TYPOGRAPHY_SECTION.
 */

// ── Collapsible group shell — reuses EditorSidebar's own accordion classes
// (.editor-section / .editor-section__toggle / __title / __chevron / __body)
// so this panel's interaction pattern matches the rest of the Builder.
function Group({ title, defaultOpen, children }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={`editor-section${open ? ' is-open' : ''}`}>
      <button className="editor-section__toggle" type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="editor-section__title">{title}</span>
        <span className="editor-section__chevron" aria-hidden="true" />
      </button>
      {open && <div className="editor-section__body">{children}</div>}
    </div>
  );
}

function CheckboxRow({ label, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, margin: '6px 0', cursor: 'pointer' }}>
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} style={CHECKBOX_INPUT_STYLE} />
      {label}
    </label>
  );
}

// ── Registration Form's own typography sub-panel — same interaction
// pattern as the brochure's TypoPanel (collapsible, font/weight/size/color/
// reset), deliberately WITHOUT that panel's X/Y position and margin/padding
// controls, since Registration Form geometry is fixed. Adds Italic/
// Underline/Alignment, which the brochure system doesn't have. Field
// rendering itself lives in RegTypoFields.jsx, shared with FloatingEditor's
// click-on-static-text branch.
function RegTypoGroup({ sectionKey, current, onSet }) {
  return (
    <div className="typo-group">
      <span className="typo-group__label">{REG_TYPO_GROUP_LABELS[sectionKey] || sectionKey}</span>
      <RegTypoFields current={current} onSet={onSet} />
    </div>
  );
}

function RegistrationTypoPanel({ keys, resetLabel, label }) {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useBrochure();
  const typo = state.tour.registrationForm.typography || {};

  const set = (section, field, value) => dispatch({ type: 'UPDATE_REGISTRATION_TYPOGRAPHY', section, field, value });
  const resetAll = () => {
    for (const key of keys) dispatch({ type: 'RESET_REGISTRATION_TYPOGRAPHY_SECTION', section: key });
  };

  return (
    <div className="typo-panel">
      <button
        type="button"
        className={`typo-panel__toggle${open ? ' is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="typo-panel__toggle-label">{label || 'Text Formatting'}</span>
        <span className="typo-panel__chevron" aria-hidden="true" />
      </button>
      {open && (
        <div className="typo-panel__body">
          {keys.map((key) => (
            <RegTypoGroup key={key} sectionKey={key} current={getRegTypo(typo, key)} onSet={(f, v) => set(key, f, v)} />
          ))}
          <button type="button" className="typo-panel__reset" onClick={resetAll}>
            Reset {resetLabel} Formatting
          </button>
        </div>
      )}
    </div>
  );
}

// Fixed, non-configurable field lists — exactly the PDF's field set, used
// only to avoid hand-repeating near-identical TextField blocks below. Not
// exposed to the manager; there is no UI to add/remove/reorder entries here.
const PASSENGER_LABEL_FIELDS = [
  ['lastName', 'Last Name Label'],
  ['middleName', 'Middle Name Label'],
  ['firstName', 'First Name Label'],
  ['birthDate', 'Birth Date Label'],
  ['dateHint', 'Date Hint'],
  ['sex', 'Sex Label'],
  ['male', 'Male Label'],
  ['female', 'Female Label'],
  ['citizenship', 'Citizenship Label'],
  ['address', 'Address Label'],
  ['city', 'City Label'],
  ['state', 'State Label'],
  ['zip', 'Zip Label'],
  ['email', 'Email Label'],
  ['consent', 'Promotional Consent Text'],
  ['homePhone', 'Home Phone Label'],
  ['cellPhone', 'Cell Phone Label'],
  ['passportNumber', 'Passport Label'],
  ['expirationDate', 'Expiration Date Label'],
  ['expirationNote', 'Expiration Hint'],
];

const PASSENGER_VALUE_FIELDS = [
  ['lastName', 'Last Name'],
  ['middleName', 'Middle Name'],
  ['firstName', 'First Name'],
  ['birthDate', 'Birth Date (MM/DD/YYYY)'],
  ['citizenship', 'Country of Citizenship'],
  ['address', 'Address'],
  ['city', 'City'],
  ['state', 'State'],
  ['zip', 'Zip'],
  ['email', 'Email'],
  ['homePhone', 'Home Phone'],
  ['cellPhone', 'Cell Phone'],
  ['passportNumber', 'Passport #'],
  ['expirationDate', 'Expiration Date (MM/DD/YYYY)'],
];

function PassengerFields({ passengerKey, passenger, dispatch }) {
  const updateTop = (field, value) => dispatch({ type: 'UPDATE_REGISTRATION_FORM', group: passengerKey, field, value });
  const updateSub = (subgroup, field, value) =>
    dispatch({ type: 'UPDATE_REGISTRATION_FORM', group: passengerKey, subgroup, field, value });

  return (
    <>
      <TextField label="Section Title" value={passenger.title} onChange={(v) => updateTop('title', v)} />
      <TextField label="Subtitle" value={passenger.subtitle} onChange={(v) => updateTop('subtitle', v)} />

      <span className="field-group-label">Field Labels</span>
      {PASSENGER_LABEL_FIELDS.map(([key, title]) => (
        <TextField
          key={key}
          label={title}
          value={passenger.labels[key]}
          onChange={(v) => updateSub('labels', key, v)}
        />
      ))}

      <span className="field-group-label">Field Values</span>
      {PASSENGER_VALUE_FIELDS.map(([key, title]) => (
        <TextField
          key={key}
          label={title}
          value={passenger.values[key]}
          onChange={(v) => updateSub('values', key, v)}
        />
      ))}

      <span className="field-group-label">Checkboxes</span>
      <CheckboxRow label="Male Checked" checked={passenger.checked.male} onChange={(v) => updateSub('checked', 'male', v)} />
      <CheckboxRow label="Female Checked" checked={passenger.checked.female} onChange={(v) => updateSub('checked', 'female', v)} />
      <CheckboxRow
        label="Promotional Consent Checked"
        checked={passenger.checked.consent}
        onChange={(v) => updateSub('checked', 'consent', v)}
      />
    </>
  );
}

export default function RegistrationFormEditor() {
  const { state, dispatch } = useBrochure();
  const rf = state.tour.registrationForm;

  const update = (field, value) => dispatch({ type: 'UPDATE_REGISTRATION_FORM', field, value });
  const updateGroup = (group, field, value) => dispatch({ type: 'UPDATE_REGISTRATION_FORM', group, field, value });

  const removeQrImage = useCallback(() => update('qrImage', ''), [update]);

  return (
    <aside className="editor-sidebar">
      <div className="editor-sidebar__header">
        <p className="editor-sidebar__title">Edit Registration Form</p>
      </div>

      <div className="editor-sidebar__scroll">
        <Group title="Tour Information" defaultOpen>
          <TextField label="Tour Number" value={rf.tourNumber} onChange={(v) => update('tourNumber', v)} />
          <TextField label="Title Line 1" value={rf.titleLine1} onChange={(v) => update('titleLine1', v)} />
          <TextField label="Title Line 2" value={rf.titleLine2} onChange={(v) => update('titleLine2', v)} />
          <TextField label="Title Line 3" value={rf.titleLine3} onChange={(v) => update('titleLine3', v)} />
          <TextField label="Leader Line 1" value={rf.leaderLine1} onChange={(v) => update('leaderLine1', v)} />
          <TextField label="Leader Line 2" value={rf.leaderLine2} onChange={(v) => update('leaderLine2', v)} />
          <TextField label="Form Label" value={rf.formLabel} onChange={(v) => update('formLabel', v)} />
          <RegistrationTypoPanel
            keys={['rfTitle', 'rfLeader', 'rfFormLabel', 'rfTourNumber']}
            resetLabel="Tour Information"
          />
        </Group>

        <Group title="Passenger Formatting">
          <p style={{ fontSize: 11, color: '#888', margin: '0 0 10px' }}>
            Shared formatting for both Passenger #1 and Passenger #2 — their content stays independent below.
          </p>
          <RegistrationTypoPanel
            keys={['rfPassengerHeading', 'rfPassengerLabel', 'rfPassengerInstruction', 'rfPassengerNote', 'rfPassengerValue']}
            resetLabel="Passenger"
            label="Passenger Text Formatting"
          />
        </Group>

        <Group title="Passenger #1">
          <PassengerFields passengerKey="passenger1" passenger={rf.passenger1} dispatch={dispatch} />
        </Group>

        <Group title="Passenger #2">
          <PassengerFields passengerKey="passenger2" passenger={rf.passenger2} dispatch={dispatch} />
        </Group>

        <Group title="Emergency Contact">
          <TextField
            label="Contact"
            value={rf.emergencyContact.contact}
            onChange={(v) => updateGroup('emergencyContact', 'contact', v)}
          />
          <TextField
            label="Relation"
            value={rf.emergencyContact.relation}
            onChange={(v) => updateGroup('emergencyContact', 'relation', v)}
          />
          <TextField
            label="Phone"
            value={rf.emergencyContact.phone}
            onChange={(v) => updateGroup('emergencyContact', 'phone', v)}
          />
        </Group>

        <Group title="Badge Names">
          <TextField
            label="Passenger #1 Badge Name"
            value={rf.badgeNames.passenger1}
            onChange={(v) => updateGroup('badgeNames', 'passenger1', v)}
          />
          <TextField
            label="Passenger #2 Badge Name"
            value={rf.badgeNames.passenger2}
            onChange={(v) => updateGroup('badgeNames', 'passenger2', v)}
          />
          <RegistrationTypoPanel keys={['rfEmergencyBadge']} resetLabel="Emergency/Badge" />
        </Group>

        <Group title="Payment">
          <TextField label="Deposit" value={rf.payment.deposit} onChange={(v) => updateGroup('payment', 'deposit', v)} />
          <TextField
            label="Check Price"
            value={rf.payment.checkPrice}
            onChange={(v) => updateGroup('payment', 'checkPrice', v)}
          />
          <TextField
            label="Insurance Text"
            value={rf.payment.insuranceText}
            onChange={(v) => updateGroup('payment', 'insuranceText', v)}
            multiline
            rows={3}
          />
          <TextField
            label="Payable To"
            value={rf.payment.payableTo}
            onChange={(v) => updateGroup('payment', 'payableTo', v)}
          />
          <TextField
            label="Mailing Address Line 1"
            value={rf.payment.mailingAddressLine1}
            onChange={(v) => updateGroup('payment', 'mailingAddressLine1', v)}
          />
          <TextField
            label="Mailing Address Line 2"
            value={rf.payment.mailingAddressLine2}
            onChange={(v) => updateGroup('payment', 'mailingAddressLine2', v)}
          />
          <RegistrationTypoPanel
            keys={['rfDeposit', 'rfCheckboxText', 'rfPaymentHeading', 'rfPaymentAddress']}
            resetLabel="Payment"
          />
        </Group>

        <Group title="Accommodation">
          <TextField
            label="Double Room Text"
            value={rf.accommodation.doubleRoomText}
            onChange={(v) => updateGroup('accommodation', 'doubleRoomText', v)}
          />
          <TextField
            label="Single Room Text"
            value={rf.accommodation.singleRoomText}
            onChange={(v) => updateGroup('accommodation', 'singleRoomText', v)}
          />
          <TextField
            label="Random Roommate Text"
            value={rf.accommodation.randomRoommateText}
            onChange={(v) => updateGroup('accommodation', 'randomRoommateText', v)}
            multiline
            rows={3}
          />
        </Group>

        <Group title="Credit Card">
          <TextField
            label="Payment Instruction"
            value={rf.creditCardInstruction}
            onChange={(v) => update('creditCardInstruction', v)}
            multiline
            rows={2}
          />
          <RegistrationTypoPanel keys={['rfCreditCard']} resetLabel="Credit Card" />
        </Group>

        <Group title="QR Code">
          <ImageField label="QR Code Image" value={rf.qrImage} onChange={(v) => update('qrImage', v)} />
          {rf.qrImage && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={removeQrImage}>
              Remove QR Image
            </button>
          )}
        </Group>

        <Group title="Acknowledgement">
          <TextField
            label="Acknowledgement Text"
            value={rf.acknowledgementText}
            onChange={(v) => update('acknowledgementText', v)}
            multiline
            rows={4}
          />
          <RegistrationTypoPanel keys={['rfAcknowledgement', 'rfSignature', 'rfSignatureLabel']} resetLabel="Acknowledgement" />
        </Group>

        <Group title="Passport Notice">
          <TextField
            label="Passport Notice"
            value={rf.passportNotice}
            onChange={(v) => update('passportNotice', v)}
            multiline
            rows={2}
          />
          <RegistrationTypoPanel keys={['rfPassportNotice']} resetLabel="Passport Notice" />
        </Group>

        <Group title="Footer">
          <TextField
            label="Address"
            value={rf.footer.address}
            onChange={(v) => updateGroup('footer', 'address', v)}
          />
          <TextField label="Phone" value={rf.footer.phone} onChange={(v) => updateGroup('footer', 'phone', v)} />
          <TextField label="Email" value={rf.footer.email} onChange={(v) => updateGroup('footer', 'email', v)} />
          <TextField
            label="Website"
            value={rf.footer.website}
            onChange={(v) => updateGroup('footer', 'website', v)}
          />
          <TextField label="CST" value={rf.footer.cst} onChange={(v) => updateGroup('footer', 'cst', v)} />
          <RegistrationTypoPanel keys={['rfFooter']} resetLabel="Footer" />
        </Group>

        <Group title="Text Elements (Textgram)">
          <TextElementsSection pages={REGISTRATION_FORM_TEXTGRAM_PAGES} />
        </Group>
      </div>
    </aside>
  );
}
