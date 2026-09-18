import React from 'react';
import './registrationForm.css';
import { getRegTypo, regTypoStyle } from './registrationFormTypography';
import { useBrochure } from '../context/BrochureContext';
import { useSelection } from '../context/SelectionContext';
import TextgramLayer from '../templates/components/TextgramLayer';

/**
 * Fixed, pixel-oriented recreation of "Registration Form - Father Adrian.pdf".
 *
 * This is a TEMPLATE, not a form builder: every structural element (field
 * ORDER, underline lengths/positions, checkbox positions/size, column
 * widths, Emergency Contact / Badge Name row geometry, section positions)
 * is hard-coded here and never changes. What IS data-driven: every piece of
 * text content (labels, values, headings, paragraphs), every checkbox's
 * checked state, and every element's typography (font/size/weight/
 * italic/underline/color/align) — all read from `registrationForm` and
 * `registrationForm.typography` (see registrationFormDefaults.js and
 * registrationFormTypography.js).
 *
 * SMART FORM FIELDS: every blank line/box below (passenger values, dates,
 * phones, emergency contact, badge names) is a real controlled <input>,
 * absolutely positioned exactly where the old plain-text <span> sat (same
 * `.rf-field-value` class, same `left:2px; bottom:1px` inside
 * `.rf-field-blank`, same `overflow:hidden` clipping), dispatching the
 * SAME `UPDATE_REGISTRATION_FORM` action the sidebar already used. Sex/
 * Consent/Check Discount/Travel Insurance/Accommodation checkboxes are
 * similarly directly clickable. Static template text (labels/headings/
 * paragraphs) opens the existing brochure-style FloatingEditor for BOTH
 * content and typography editing (see the `openTypo` helper below and
 * FloatingEditor.jsx's `RegTextContent` branch — same `meta.getValue(tour)`/
 * `meta.setValue(dispatch, val)` function-pair pattern the brochure's own
 * TextContent already uses, so a still-open panel always reflects live
 * state instead of a stale click-time snapshot) — nothing here can add,
 * remove, resize, or reposition a field; only VALUES and TYPOGRAPHY change.
 * A handful of purely-fixed PDF boilerplate strings with no backing data
 * field (e.g. "Mail Check to:", "Accomodation Desired:", "Signature") stay
 * typography-only, same as before this feature.
 * This is one shared component for the on-screen Preview and the print
 * output (same DOM, same props), so they can never visually diverge, and
 * since react-to-print copies live input values/checked state into the
 * print clone (and controlled inputs already match state exactly), values
 * print correctly with no separate print-only code path.
 *
 * Fixed canvas: 816×1056px (8.5in×11in @96dpi), matching this app's
 * existing Letter-page convention. Fully independent of brochure.css.
 *
 * Textgram: a <TextgramLayer page="registrationForm"> overlay is mounted as
 * the last child, absolutely positioned over this fixed template (same
 * technique as the brochure's Page1Cover/Page2Itinerary/Page3Pricing/
 * Page4Terms). It reads/writes the same shared tour.textElements array —
 * no separate Textgram system — and `.rf-page`'s own `overflow: hidden`
 * (the one-page guarantee above) clips it to this exact 816×1056 canvas in
 * both the workspace preview and print, so it can never add a second page
 * or move any fixed element. Textgram remains a separate, optional tool for
 * freeform text that isn't one of the predefined fields below.
 */

// "MM/DD/YYYY" (or any partial subset) -> ['MM','DD','YYYY'], each '' if absent.
// Keeps the 3 fixed blank segments correctly filled regardless of how much
// of the date the manager has typed so far.
function splitDate(value) {
  const parts = (value || '').split('/');
  return [parts[0] || '', parts[1] || '', parts[2] || ''];
}

function Checkbox({ checked, onToggle }) {
  return (
    <span
      className={`rf-checkbox${checked ? ' rf-checkbox--checked' : ''}`}
      aria-hidden="true"
      onClick={onToggle ? (e) => { e.stopPropagation(); onToggle(!checked); } : undefined}
      style={onToggle ? { cursor: 'pointer' } : undefined}
    />
  );
}

// A field's VALUE — a real controlled <input>, positioned identically to the
// old plain-text span it replaces (see .rf-inline-input in registrationForm.css).
// Native input behavior (click-to-focus, type, backspace, select, horizontal
// scroll-on-overflow) gives "click the line -> type" for free, and the fixed
// field geometry (the .rf-field-blank it sits inside) never changes size.
function InlineValue({ value, onChange, valueStyle, maxLength }) {
  return (
    <input
      type="text"
      className="rf-field-value"
      value={value ?? ''}
      maxLength={maxLength}
      autoComplete="off"
      spellCheck="false"
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      style={valueStyle}
    />
  );
}

function FormLine({ label, value, onChange, valueStyle, labelProps, maxLength }) {
  return (
    <div className="rf-field-row">
      <span className="rf-field-label" {...labelProps}>{label}</span>
      <span className="rf-field-blank">
        <InlineValue value={value} onChange={onChange} valueStyle={valueStyle} maxLength={maxLength} />
      </span>
    </div>
  );
}

// One digits-only segment of a date field — same box, same position as
// before; only digits are kept and length is clamped to the segment's fixed
// width (2/2/4), so the 3-segment layout never grows or shifts.
function DateSegment({ value, maxLength, valueStyle, onChange }) {
  return (
    <InlineValue
      value={value}
      maxLength={maxLength}
      valueStyle={valueStyle}
      onChange={(v) => onChange(v.replace(/\D/g, '').slice(0, maxLength))}
    />
  );
}

// Distributes a single typed date across the PDF's existing 3 fixed blanks
// (MM/DD/YYYY) and recombines them back into the one stored "MM/DD/YYYY"
// string on every keystroke — the manager never positions 3 separate boxes.
function DateLine({ label, hint, value, onChange, valueStyle, labelProps, hintProps }) {
  const [mm, dd, yyyy] = splitDate(value);
  const setSeg = (idx, v) => {
    const segs = [mm, dd, yyyy];
    segs[idx] = v;
    onChange(segs.join('/'));
  };
  return (
    <div className="rf-field-row">
      <span className="rf-field-label" {...labelProps}>{label}</span>
      <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 26 }}>
        <DateSegment value={mm} maxLength={2} valueStyle={valueStyle} onChange={(v) => setSeg(0, v)} />
      </span>
      <span className="rf-field-label">/</span>
      <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 26 }}>
        <DateSegment value={dd} maxLength={2} valueStyle={valueStyle} onChange={(v) => setSeg(1, v)} />
      </span>
      <span className="rf-field-label">/</span>
      <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 44 }}>
        <DateSegment value={yyyy} maxLength={4} valueStyle={valueStyle} onChange={(v) => setSeg(2, v)} />
      </span>
      <span className="rf-field-label" style={{ marginLeft: 4 }} {...hintProps}>{hint}</span>
    </div>
  );
}

function PassengerColumn({ passengerKey, passenger, valueStyle, headingStyle, instructionStyle, noteStyle, dispatch, openTypo }) {
  const { labels: L, values: V, checked: C } = passenger;
  const setValue = (field, value) => dispatch({ type: 'UPDATE_REGISTRATION_FORM', group: passengerKey, subgroup: 'values', field, value });
  const setChecked = (field, value) => dispatch({ type: 'UPDATE_REGISTRATION_FORM', group: passengerKey, subgroup: 'checked', field, value });

  // One label key -> its own TEXT-editable FloatingEditor click, still
  // scoped to the shared 'rfPassengerLabel' typography group (or whichever
  // sectionKey is passed) exactly like every other rendered instance of
  // that group, but each with content bound to ITS OWN labels.<key> string.
  const fieldLabel = (labelKey, sectionKey = 'rfPassengerLabel', groupLabel = 'Field Labels (both columns)') => openTypo(
    sectionKey,
    groupLabel,
    (tour) => tour.registrationForm[passengerKey].labels[labelKey],
    (d, val) => d({ type: 'UPDATE_REGISTRATION_FORM', group: passengerKey, subgroup: 'labels', field: labelKey, value: val }),
  );
  // Same idea for the passenger's own top-level fields (title/subtitle),
  // which aren't under .labels.
  const topLevelText = (sectionKey, groupLabel, field) => openTypo(
    sectionKey,
    groupLabel,
    (tour) => tour.registrationForm[passengerKey][field],
    (d, val) => d({ type: 'UPDATE_REGISTRATION_FORM', group: passengerKey, field, value: val }),
  );

  return (
    <div className="rf-column">
      <div className="rf-column-heading" style={headingStyle} {...topLevelText('rfPassengerHeading', 'Passenger Heading (both columns)', 'title')}>
        {passenger.title}
      </div>
      <div className="rf-instruction" style={instructionStyle} {...topLevelText('rfPassengerInstruction', 'Instruction / Consent Text (both columns)', 'subtitle')}>
        {passenger.subtitle}
      </div>

      <FormLine label={L.lastName} value={V.lastName} onChange={(v) => setValue('lastName', v)} valueStyle={valueStyle} labelProps={fieldLabel('lastName')} />
      <FormLine label={L.middleName} value={V.middleName} onChange={(v) => setValue('middleName', v)} valueStyle={valueStyle} labelProps={fieldLabel('middleName')} />
      <FormLine label={L.firstName} value={V.firstName} onChange={(v) => setValue('firstName', v)} valueStyle={valueStyle} labelProps={fieldLabel('firstName')} />
      <DateLine
        label={L.birthDate} hint={L.dateHint} value={V.birthDate} onChange={(v) => setValue('birthDate', v)} valueStyle={valueStyle}
        labelProps={fieldLabel('birthDate')} hintProps={fieldLabel('dateHint')}
      />

      <div className="rf-field-row">
        <span className="rf-field-label" {...fieldLabel('sex')}>{L.sex}</span>
        <Checkbox checked={C.male} onToggle={(v) => setChecked('male', v)} />
        <span className="rf-field-label" {...fieldLabel('male')}>{L.male}</span>
        <Checkbox checked={C.female} onToggle={(v) => setChecked('female', v)} />
        <span className="rf-field-label" style={{ marginRight: 8 }} {...fieldLabel('female')}>{L.female}</span>
        <span className="rf-field-label" {...fieldLabel('citizenship')}>{L.citizenship}</span>
        <span className="rf-field-blank">
          <InlineValue value={V.citizenship} onChange={(v) => setValue('citizenship', v)} valueStyle={valueStyle} />
        </span>
      </div>

      <FormLine label={L.address} value={V.address} onChange={(v) => setValue('address', v)} valueStyle={valueStyle} labelProps={fieldLabel('address')} />

      <div className="rf-field-row">
        <span className="rf-field-label" {...fieldLabel('city')}>{L.city}</span>
        <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 84 }}>
          <InlineValue value={V.city} onChange={(v) => setValue('city', v)} valueStyle={valueStyle} />
        </span>
        <span className="rf-field-label" style={{ marginLeft: 6 }} {...fieldLabel('state')}>{L.state}</span>
        <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 34 }}>
          <InlineValue value={V.state} onChange={(v) => setValue('state', v)} valueStyle={valueStyle} />
        </span>
        <span className="rf-field-label" style={{ marginLeft: 6 }} {...fieldLabel('zip')}>{L.zip}</span>
        <span className="rf-field-blank">
          <InlineValue value={V.zip} onChange={(v) => setValue('zip', v)} valueStyle={valueStyle} />
        </span>
      </div>

      <FormLine label={L.email} value={V.email} onChange={(v) => setValue('email', v)} valueStyle={valueStyle} labelProps={fieldLabel('email')} />

      {/* align-items: center overrides .rf-field-row's default flex-end —
          that bottom-aligns the fixed 9x9 checkbox against the taller
          instruction-text line box, which is correct for underlined value
          rows but visibly misaligns a plain checkbox + label row. Row
          height (18px) is unchanged, so nothing below this shifts. */}
      <div className="rf-field-row" style={{ height: 18, alignItems: 'center' }}>
        <Checkbox checked={C.consent} onToggle={(v) => setChecked('consent', v)} />
        <span className="rf-field-label" style={instructionStyle} {...fieldLabel('consent', 'rfPassengerInstruction', 'Instruction / Consent Text (both columns)')}>
          {L.consent}
        </span>
      </div>

      <div className="rf-field-row">
        <span className="rf-field-label" {...fieldLabel('homePhone')}>{L.homePhone} (</span>
        <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 30 }} />
        <span className="rf-field-label" {...openTypo('rfPassengerLabel', 'Field Labels (both columns)')}>)</span>
        <span className="rf-field-blank">
          <InlineValue value={V.homePhone} onChange={(v) => setValue('homePhone', v)} valueStyle={valueStyle} />
        </span>
      </div>

      <div className="rf-field-row">
        <span className="rf-field-label" {...fieldLabel('cellPhone')}>{L.cellPhone} (</span>
        <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 30 }} />
        <span className="rf-field-label" {...openTypo('rfPassengerLabel', 'Field Labels (both columns)')}>)</span>
        <span className="rf-field-blank">
          <InlineValue value={V.cellPhone} onChange={(v) => setValue('cellPhone', v)} valueStyle={valueStyle} />
        </span>
      </div>

      <FormLine label={L.passportNumber} value={V.passportNumber} onChange={(v) => setValue('passportNumber', v)} valueStyle={valueStyle} labelProps={fieldLabel('passportNumber')} />
      <DateLine
        label={L.expirationDate} hint={L.dateHint} value={V.expirationDate} onChange={(v) => setValue('expirationDate', v)} valueStyle={valueStyle}
        labelProps={fieldLabel('expirationDate')} hintProps={fieldLabel('dateHint')}
      />
      <div className="rf-field-note" style={noteStyle} {...fieldLabel('expirationNote', 'rfPassengerNote', 'Expiration Note (both columns)')}>
        {L.expirationNote}
      </div>
    </div>
  );
}

export default function RegistrationFormPrint({ registrationForm: rf, printRef }) {
  const { dispatch } = useBrochure();
  const { openFloating } = useSelection();

  // Click on any piece of FIXED/STATIC template text -> the same FloatingEditor
  // used everywhere else in the app, scoped to the typography group that
  // governs it (one group commonly styles several rendered labels at once,
  // e.g. every field label shares 'rfPassengerLabel' — same convention the
  // sidebar's RegistrationTypoPanel already uses) for TYPOGRAPHY, plus an
  // optional (getValue, setValue) function pair — same shape as the
  // brochure's own floatSel meta — for that SPECIFIC element's TEXT content.
  // getValue/setValue are called with the FloatingEditor's own live
  // (tour, dispatch), never a value captured at click time, so a panel left
  // open stays correct even if something else changes the same field.
  // Omitting them (most call sites still need only typography) makes
  // RegTextContent hide the TEXT field, same as before this feature.
  const openTypo = (sectionKey, label, getValue, setValue) => ({
    onClick: (e) => {
      e.stopPropagation();
      openFloating({ id: sectionKey, type: 'regText', label, sectionKey, getValue, setValue }, e);
    },
  });

  // Shorthand for the common case: a top-level registrationForm.<field>
  // string (tourNumber, titleLine1..3, leaderLine1..2, formLabel, etc).
  const topField = (sectionKey, label, field) => openTypo(
    sectionKey,
    label,
    (tour) => tour.registrationForm[field],
    (d, val) => d({ type: 'UPDATE_REGISTRATION_FORM', field, value: val }),
  );
  // Shorthand for a one-level-nested registrationForm.<group>.<field> string
  // (payment.deposit, accommodation.singleRoomText, emergencyContact.labels.*, etc).
  const groupField = (sectionKey, label, group, field, subgroup) => openTypo(
    sectionKey,
    label,
    (tour) => (subgroup ? tour.registrationForm[group][subgroup][field] : tour.registrationForm[group][field]),
    (d, val) => d({ type: 'UPDATE_REGISTRATION_FORM', group, subgroup, field, value: val }),
  );

  const updateGroup = (group, field, value) => dispatch({ type: 'UPDATE_REGISTRATION_FORM', group, field, value });
  // Same checked-state pattern as the passenger Sex/Consent checkboxes
  // (UPDATE_REGISTRATION_FORM with group+subgroup+field+value) — no second
  // checkbox system, just two more (group, subgroup) targets.
  const setPaymentChecked = (field, value) => dispatch({ type: 'UPDATE_REGISTRATION_FORM', group: 'payment', subgroup: 'checked', field, value });
  const setAccommodationChecked = (field, value) => dispatch({ type: 'UPDATE_REGISTRATION_FORM', group: 'accommodation', subgroup: 'checked', field, value });

  const typo = rf.typography;
  const titleStyle = regTypoStyle(getRegTypo(typo, 'rfTitle'));
  const leaderStyle = regTypoStyle(getRegTypo(typo, 'rfLeader'));
  const formLabelStyle = regTypoStyle(getRegTypo(typo, 'rfFormLabel'));
  const tourNumberStyle = regTypoStyle(getRegTypo(typo, 'rfTourNumber'));
  const passengerHeadingStyle = regTypoStyle(getRegTypo(typo, 'rfPassengerHeading'));
  const passengerLabelStyle = regTypoStyle(getRegTypo(typo, 'rfPassengerLabel'));
  const passengerInstructionStyle = regTypoStyle(getRegTypo(typo, 'rfPassengerInstruction'));
  const passengerNoteStyle = regTypoStyle(getRegTypo(typo, 'rfPassengerNote'));
  const passengerValueStyle = regTypoStyle(getRegTypo(typo, 'rfPassengerValue'));
  const emergencyBadgeStyle = regTypoStyle(getRegTypo(typo, 'rfEmergencyBadge'));
  const depositStyle = regTypoStyle(getRegTypo(typo, 'rfDeposit'));
  const checkboxTextStyle = regTypoStyle(getRegTypo(typo, 'rfCheckboxText'));
  const paymentHeadingStyle = regTypoStyle(getRegTypo(typo, 'rfPaymentHeading'));
  const paymentAddressStyle = regTypoStyle(getRegTypo(typo, 'rfPaymentAddress'));
  const creditCardStyle = regTypoStyle(getRegTypo(typo, 'rfCreditCard'));
  const acknowledgementStyle = regTypoStyle(getRegTypo(typo, 'rfAcknowledgement'));
  const signatureStyle = regTypoStyle(getRegTypo(typo, 'rfSignature'));
  const signatureLabelStyle = regTypoStyle(getRegTypo(typo, 'rfSignatureLabel'));
  const passportNoticeStyle = regTypoStyle(getRegTypo(typo, 'rfPassportNotice'));
  const footerStyle = regTypoStyle(getRegTypo(typo, 'rfFooter'));

  return (
    <div className="rf-page" ref={printRef}>
      <div className="rf-header">
        <div className="rf-tour-number" style={tourNumberStyle} {...topField('rfTourNumber', 'Tour Number', 'tourNumber')}>Tour # {rf.tourNumber}</div>
        <div className="rf-title">
          <div className="rf-title-line" style={titleStyle} {...topField('rfTitle', 'Pilgrimage Title', 'titleLine1')}>{rf.titleLine1}</div>
          <div className="rf-title-line" style={titleStyle} {...topField('rfTitle', 'Pilgrimage Title', 'titleLine2')}>{rf.titleLine2}</div>
          <div className="rf-title-line" style={titleStyle} {...topField('rfTitle', 'Pilgrimage Title', 'titleLine3')}>{rf.titleLine3}</div>
          <div className="rf-leader-line" style={leaderStyle} {...topField('rfLeader', 'Leader', 'leaderLine1')}>{rf.leaderLine1}</div>
          <div className="rf-leader-line" style={leaderStyle} {...topField('rfLeader', 'Leader', 'leaderLine2')}>{rf.leaderLine2}</div>
          <div className="rf-form-label" style={formLabelStyle} {...topField('rfFormLabel', 'Form Label', 'formLabel')}>{rf.formLabel}</div>
        </div>
      </div>

      <div className="rf-columns" style={passengerLabelStyle}>
        <PassengerColumn
          passengerKey="passenger1"
          passenger={rf.passenger1}
          valueStyle={passengerValueStyle}
          headingStyle={passengerHeadingStyle}
          instructionStyle={passengerInstructionStyle}
          noteStyle={passengerNoteStyle}
          dispatch={dispatch}
          openTypo={openTypo}
        />
        <PassengerColumn
          passengerKey="passenger2"
          passenger={rf.passenger2}
          valueStyle={passengerValueStyle}
          headingStyle={passengerHeadingStyle}
          instructionStyle={passengerInstructionStyle}
          noteStyle={passengerNoteStyle}
          dispatch={dispatch}
          openTypo={openTypo}
        />
      </div>

      <div className="rf-emergency-row" style={emergencyBadgeStyle}>
        <span className="rf-field-label" {...groupField('rfEmergencyBadge', 'Emergency Contact / Badge', 'emergencyContact', 'contact', 'labels')}>
          {rf.emergencyContact.labels.contact}
        </span>
        <span className="rf-field-blank" style={{ flex: '2 1 auto' }}>
          <InlineValue
            value={rf.emergencyContact.contact}
            onChange={(v) => updateGroup('emergencyContact', 'contact', v)}
            valueStyle={emergencyBadgeStyle}
          />
        </span>
        <span className="rf-field-label" style={{ marginLeft: 8 }} {...groupField('rfEmergencyBadge', 'Emergency Contact / Badge', 'emergencyContact', 'relation', 'labels')}>
          {rf.emergencyContact.labels.relation}
        </span>
        <span className="rf-field-blank" style={{ flex: '1 1 auto' }}>
          <InlineValue
            value={rf.emergencyContact.relation}
            onChange={(v) => updateGroup('emergencyContact', 'relation', v)}
            valueStyle={emergencyBadgeStyle}
          />
        </span>
        <span className="rf-field-label" style={{ marginLeft: 8 }} {...groupField('rfEmergencyBadge', 'Emergency Contact / Badge', 'emergencyContact', 'phone', 'labels')}>
          {rf.emergencyContact.labels.phone}
        </span>
        <span className="rf-field-blank" style={{ flex: '1.5 1 auto' }}>
          <InlineValue
            value={rf.emergencyContact.phone}
            onChange={(v) => updateGroup('emergencyContact', 'phone', v)}
            valueStyle={emergencyBadgeStyle}
          />
        </span>
      </div>

      <div className="rf-badge-row" style={emergencyBadgeStyle}>
        <div className="rf-field-row">
          <span className="rf-field-label" {...groupField('rfEmergencyBadge', 'Emergency Contact / Badge', 'badgeNames', 'label')}>
            {rf.badgeNames.label}
          </span>
          <span className="rf-field-blank">
            <InlineValue
              value={rf.badgeNames.passenger1}
              onChange={(v) => updateGroup('badgeNames', 'passenger1', v)}
              valueStyle={emergencyBadgeStyle}
            />
          </span>
        </div>
        <div className="rf-field-row">
          <span className="rf-field-label" {...groupField('rfEmergencyBadge', 'Emergency Contact / Badge', 'badgeNames', 'label')}>
            {rf.badgeNames.label}
          </span>
          <span className="rf-field-blank">
            <InlineValue
              value={rf.badgeNames.passenger2}
              onChange={(v) => updateGroup('badgeNames', 'passenger2', v)}
              valueStyle={emergencyBadgeStyle}
            />
          </span>
        </div>
      </div>

      <div className="rf-middle">
        <div className="rf-middle-col">
          <div className="rf-deposit" style={depositStyle} {...groupField('rfDeposit', 'Deposit Line', 'payment', 'deposit')}>
            FIRST DEPOSIT (DUE NOW): {rf.payment.deposit}
          </div>

          <div className="rf-check-line" style={checkboxTextStyle} {...groupField('rfCheckboxText', 'Checkbox Option Text', 'payment', 'checkPrice')}>
            <Checkbox checked={rf.payment.checked?.checkDiscount} onToggle={(v) => setPaymentChecked('checkDiscount', v)} />
            <span className="rf-check-line__body">Check Discount/Check Price: {rf.payment.checkPrice}</span>
          </div>
          <div className="rf-check-line" style={checkboxTextStyle} {...groupField('rfCheckboxText', 'Checkbox Option Text', 'payment', 'insuranceText')}>
            <Checkbox checked={rf.payment.checked?.travelInsurance} onToggle={(v) => setPaymentChecked('travelInsurance', v)} />
            <span className="rf-check-line__body">
              <strong>Travel Insurance:</strong> {rf.payment.insuranceText}
            </span>
          </div>

          <div className="rf-payable" style={paymentHeadingStyle} {...groupField('rfPaymentHeading', 'Payment Headings', 'payment', 'payableTo')}>
            Make Check Payable to: {rf.payment.payableTo}
          </div>
          <div className="rf-mail-to" style={paymentHeadingStyle} {...openTypo('rfPaymentHeading', 'Payment Headings')}>Mail Check to:</div>
          <div className="rf-mail-address" style={paymentAddressStyle}>
            <div {...groupField('rfPaymentAddress', 'Payment Address', 'payment', 'mailingAddressLine1')}>{rf.payment.mailingAddressLine1}</div>
            <div {...groupField('rfPaymentAddress', 'Payment Address', 'payment', 'mailingAddressLine2')}>{rf.payment.mailingAddressLine2}</div>
          </div>
        </div>

        <div className="rf-middle-col">
          <div className="rf-accommodation-heading" style={paymentHeadingStyle} {...openTypo('rfPaymentHeading', 'Payment Headings')}>
            Accomodation Desired:
          </div>

          <div className="rf-check-line" style={checkboxTextStyle} {...groupField('rfCheckboxText', 'Checkbox Option Text', 'accommodation', 'doubleRoomText')}>
            <Checkbox checked={rf.accommodation.checked?.doubleRoom} onToggle={(v) => setAccommodationChecked('doubleRoom', v)} />
            <span className="rf-check-line__body">
              {rf.accommodation.doubleRoomText}
              <span className="rf-check-line__blank" />
            </span>
          </div>
          <div className="rf-check-line" style={checkboxTextStyle} {...groupField('rfCheckboxText', 'Checkbox Option Text', 'accommodation', 'singleRoomText')}>
            <Checkbox checked={rf.accommodation.checked?.singleRoom} onToggle={(v) => setAccommodationChecked('singleRoom', v)} />
            <span className="rf-check-line__body">{rf.accommodation.singleRoomText}</span>
          </div>
          <div className="rf-check-line" style={checkboxTextStyle} {...groupField('rfCheckboxText', 'Checkbox Option Text', 'accommodation', 'randomRoommateText')}>
            <Checkbox checked={rf.accommodation.checked?.randomRoommate} onToggle={(v) => setAccommodationChecked('randomRoommate', v)} />
            <span className="rf-check-line__body">{rf.accommodation.randomRoommateText}</span>
          </div>

          <div className="rf-creditcard-row">
            <div className="rf-creditcard" style={creditCardStyle} {...topField('rfCreditCard', 'Credit Card Instruction', 'creditCardInstruction')}>
              {rf.creditCardInstruction}
            </div>
            <div className={`rf-qr-slot${rf.qrImage ? '' : ' rf-qr-slot--empty'}`}>
              {rf.qrImage ? (
                <img src={rf.qrImage} alt="Registration QR code" />
              ) : (
                'QR CODE'
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="rf-terms" style={acknowledgementStyle} {...topField('rfAcknowledgement', 'Acknowledgement Paragraph', 'acknowledgementText')}>
        {rf.acknowledgementText}{' '}
        <strong>
          For Pre-Existing Medical Conditions Exclusion Waiver, insurance plan must be purchased at or before the
          final trip payment.
        </strong>
      </div>

      <div className="rf-signature-heading" style={signatureStyle} {...openTypo('rfSignature', 'Signature Heading')}>Signature</div>
      <div className="rf-signature-row">
        <div className="rf-field-row" style={{ flex: 1 }}>
          <span className="rf-field-label" style={signatureLabelStyle} {...openTypo('rfSignatureLabel', 'Signature Labels (Passenger 1 / 2)')}>Passenger 1:</span>
          <span className="rf-signature-blank" />
        </div>
        <div className="rf-field-row" style={{ flex: 1 }}>
          <span className="rf-field-label" style={signatureLabelStyle} {...openTypo('rfSignatureLabel', 'Signature Labels (Passenger 1 / 2)')}>Passenger 2:</span>
          <span className="rf-signature-blank" />
        </div>
      </div>

      <div className="rf-passport-notice" style={passportNoticeStyle} {...topField('rfPassportNotice', 'Passport Notice', 'passportNotice')}>
        {rf.passportNotice}
      </div>

      <div className="rf-footer">
        <div className="rf-footer-rule" />
        <div className="rf-footer-content">
          <div className="rf-footer-accent" />
          <div className="rf-footer-text" style={footerStyle} {...openTypo('rfFooter', 'Footer')}>
            <div>{rf.footer.address}</div>
            <div>
              Tel: {rf.footer.phone} Email: {rf.footer.email} website: {rf.footer.website} CST- {rf.footer.cst}
            </div>
          </div>
        </div>
      </div>

      <TextgramLayer page="registrationForm" />
    </div>
  );
}
