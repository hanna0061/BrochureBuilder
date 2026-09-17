import React from 'react';
import './registrationForm.css';
import { getRegTypo, regTypoStyle } from './registrationFormTypography';

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
 * registrationFormTypography.js). No event handlers live here — this stays
 * a pure presentational template, used identically for both the on-screen
 * Preview and the print output (same component, same DOM node), so they
 * can never visually diverge. Editing happens only in RegistrationFormEditor.
 *
 * Fixed canvas: 816×1056px (8.5in×11in @96dpi), matching this app's
 * existing Letter-page convention. Fully independent of brochure.css.
 */

// "MM/DD/YYYY" (or any partial subset) -> ['MM','DD','YYYY'], each '' if absent.
// Keeps the 3 fixed blank segments correctly filled regardless of how much
// of the date the manager has typed so far.
function splitDate(value) {
  const parts = (value || '').split('/');
  return [parts[0] || '', parts[1] || '', parts[2] || ''];
}

function Checkbox({ checked }) {
  return <span className={`rf-checkbox${checked ? ' rf-checkbox--checked' : ''}`} aria-hidden="true" />;
}

function FormLine({ label, value, valueStyle }) {
  return (
    <div className="rf-field-row">
      <span className="rf-field-label">{label}</span>
      <span className="rf-field-blank">
        {value ? (
          <span className="rf-field-value" style={valueStyle}>
            {value}
          </span>
        ) : null}
      </span>
    </div>
  );
}

function DateLine({ label, hint, value, valueStyle }) {
  const [mm, dd, yyyy] = splitDate(value);
  return (
    <div className="rf-field-row">
      <span className="rf-field-label">{label}</span>
      <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 26 }}>
        {mm ? <span className="rf-field-value" style={valueStyle}>{mm}</span> : null}
      </span>
      <span className="rf-field-label">/</span>
      <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 26 }}>
        {dd ? <span className="rf-field-value" style={valueStyle}>{dd}</span> : null}
      </span>
      <span className="rf-field-label">/</span>
      <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 44 }}>
        {yyyy ? <span className="rf-field-value" style={valueStyle}>{yyyy}</span> : null}
      </span>
      <span className="rf-field-label" style={{ marginLeft: 4 }}>{hint}</span>
    </div>
  );
}

function PassengerColumn({ passenger, valueStyle, headingStyle, instructionStyle, noteStyle }) {
  const { labels: L, values: V, checked: C } = passenger;
  return (
    <div className="rf-column">
      <div className="rf-column-heading" style={headingStyle}>{passenger.title}</div>
      <div className="rf-instruction" style={instructionStyle}>{passenger.subtitle}</div>

      <FormLine label={L.lastName} value={V.lastName} valueStyle={valueStyle} />
      <FormLine label={L.middleName} value={V.middleName} valueStyle={valueStyle} />
      <FormLine label={L.firstName} value={V.firstName} valueStyle={valueStyle} />
      <DateLine label={L.birthDate} hint={L.dateHint} value={V.birthDate} valueStyle={valueStyle} />

      <div className="rf-field-row">
        <span className="rf-field-label">{L.sex}</span>
        <Checkbox checked={C.male} />
        <span className="rf-field-label">{L.male}</span>
        <Checkbox checked={C.female} />
        <span className="rf-field-label" style={{ marginRight: 8 }}>{L.female}</span>
        <span className="rf-field-label">{L.citizenship}</span>
        <span className="rf-field-blank">
          {V.citizenship ? <span className="rf-field-value" style={valueStyle}>{V.citizenship}</span> : null}
        </span>
      </div>

      <FormLine label={L.address} value={V.address} valueStyle={valueStyle} />

      <div className="rf-field-row">
        <span className="rf-field-label">{L.city}</span>
        <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 84 }}>
          {V.city ? <span className="rf-field-value" style={valueStyle}>{V.city}</span> : null}
        </span>
        <span className="rf-field-label" style={{ marginLeft: 6 }}>{L.state}</span>
        <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 34 }}>
          {V.state ? <span className="rf-field-value" style={valueStyle}>{V.state}</span> : null}
        </span>
        <span className="rf-field-label" style={{ marginLeft: 6 }}>{L.zip}</span>
        <span className="rf-field-blank">
          {V.zip ? <span className="rf-field-value" style={valueStyle}>{V.zip}</span> : null}
        </span>
      </div>

      <FormLine label={L.email} value={V.email} valueStyle={valueStyle} />

      <div className="rf-field-row" style={{ height: 18 }}>
        <Checkbox checked={C.consent} />
        <span className="rf-field-label" style={instructionStyle}>{L.consent}</span>
      </div>

      <div className="rf-field-row">
        <span className="rf-field-label">{L.homePhone} (</span>
        <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 30 }} />
        <span className="rf-field-label">)</span>
        <span className="rf-field-blank">
          {V.homePhone ? <span className="rf-field-value" style={valueStyle}>{V.homePhone}</span> : null}
        </span>
      </div>

      <div className="rf-field-row">
        <span className="rf-field-label">{L.cellPhone} (</span>
        <span className="rf-field-blank rf-field-blank--fixed" style={{ width: 30 }} />
        <span className="rf-field-label">)</span>
        <span className="rf-field-blank">
          {V.cellPhone ? <span className="rf-field-value" style={valueStyle}>{V.cellPhone}</span> : null}
        </span>
      </div>

      <FormLine label={L.passportNumber} value={V.passportNumber} valueStyle={valueStyle} />
      <DateLine label={L.expirationDate} hint={L.dateHint} value={V.expirationDate} valueStyle={valueStyle} />
      <div className="rf-field-note" style={noteStyle}>{L.expirationNote}</div>
    </div>
  );
}

export default function RegistrationFormPrint({ registrationForm: rf, printRef }) {
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
  const passportNoticeStyle = regTypoStyle(getRegTypo(typo, 'rfPassportNotice'));
  const footerStyle = regTypoStyle(getRegTypo(typo, 'rfFooter'));

  return (
    <div className="rf-page" ref={printRef}>
      <div className="rf-header">
        <div className="rf-tour-number" style={tourNumberStyle}>Tour # {rf.tourNumber}</div>
        <div className="rf-title">
          <div className="rf-title-line" style={titleStyle}>{rf.titleLine1}</div>
          <div className="rf-title-line" style={titleStyle}>{rf.titleLine2}</div>
          <div className="rf-title-line" style={titleStyle}>{rf.titleLine3}</div>
          <div className="rf-leader-line" style={leaderStyle}>{rf.leaderLine1}</div>
          <div className="rf-leader-line" style={leaderStyle}>{rf.leaderLine2}</div>
          <div className="rf-form-label" style={formLabelStyle}>{rf.formLabel}</div>
        </div>
      </div>

      <div className="rf-columns" style={passengerLabelStyle}>
        <PassengerColumn
          passenger={rf.passenger1}
          valueStyle={passengerValueStyle}
          headingStyle={passengerHeadingStyle}
          instructionStyle={passengerInstructionStyle}
          noteStyle={passengerNoteStyle}
        />
        <PassengerColumn
          passenger={rf.passenger2}
          valueStyle={passengerValueStyle}
          headingStyle={passengerHeadingStyle}
          instructionStyle={passengerInstructionStyle}
          noteStyle={passengerNoteStyle}
        />
      </div>

      <div className="rf-emergency-row" style={emergencyBadgeStyle}>
        <span className="rf-field-label">Emergency Contact:</span>
        <span className="rf-field-blank" style={{ flex: '2 1 auto' }}>
          {rf.emergencyContact.contact ? (
            <span className="rf-field-value" style={emergencyBadgeStyle}>{rf.emergencyContact.contact}</span>
          ) : null}
        </span>
        <span className="rf-field-label" style={{ marginLeft: 8 }}>Relation:</span>
        <span className="rf-field-blank" style={{ flex: '1 1 auto' }}>
          {rf.emergencyContact.relation ? (
            <span className="rf-field-value" style={emergencyBadgeStyle}>{rf.emergencyContact.relation}</span>
          ) : null}
        </span>
        <span className="rf-field-label" style={{ marginLeft: 8 }}>Phone:</span>
        <span className="rf-field-blank" style={{ flex: '1.5 1 auto' }}>
          {rf.emergencyContact.phone ? (
            <span className="rf-field-value" style={emergencyBadgeStyle}>{rf.emergencyContact.phone}</span>
          ) : null}
        </span>
      </div>

      <div className="rf-badge-row" style={emergencyBadgeStyle}>
        <div className="rf-field-row">
          <span className="rf-field-label">Name for Badge (Nickname)</span>
          <span className="rf-field-blank">
            {rf.badgeNames.passenger1 ? (
              <span className="rf-field-value" style={emergencyBadgeStyle}>{rf.badgeNames.passenger1}</span>
            ) : null}
          </span>
        </div>
        <div className="rf-field-row">
          <span className="rf-field-label">Name for Badge (Nickname)</span>
          <span className="rf-field-blank">
            {rf.badgeNames.passenger2 ? (
              <span className="rf-field-value" style={emergencyBadgeStyle}>{rf.badgeNames.passenger2}</span>
            ) : null}
          </span>
        </div>
      </div>

      <div className="rf-middle">
        <div className="rf-middle-col">
          <div className="rf-deposit" style={depositStyle}>FIRST DEPOSIT (DUE NOW): {rf.payment.deposit}</div>

          <div className="rf-check-line" style={checkboxTextStyle}>
            <Checkbox />
            <span className="rf-check-line__body">Check Discount/Check Price: {rf.payment.checkPrice}</span>
          </div>
          <div className="rf-check-line" style={checkboxTextStyle}>
            <Checkbox />
            <span className="rf-check-line__body">
              <strong>Travel Insurance:</strong> {rf.payment.insuranceText}
            </span>
          </div>

          <div className="rf-payable" style={paymentHeadingStyle}>Make Check Payable to: {rf.payment.payableTo}</div>
          <div className="rf-mail-to" style={paymentHeadingStyle}>Mail Check to:</div>
          <div className="rf-mail-address" style={paymentAddressStyle}>
            <div>{rf.payment.mailingAddressLine1}</div>
            <div>{rf.payment.mailingAddressLine2}</div>
          </div>
        </div>

        <div className="rf-middle-col">
          <div className="rf-accommodation-heading" style={paymentHeadingStyle}>Accomodation Desired:</div>

          <div className="rf-check-line" style={checkboxTextStyle}>
            <Checkbox />
            <span className="rf-check-line__body">
              {rf.accommodation.doubleRoomText}
              <span className="rf-check-line__blank" />
            </span>
          </div>
          <div className="rf-check-line" style={checkboxTextStyle}>
            <Checkbox />
            <span className="rf-check-line__body">{rf.accommodation.singleRoomText}</span>
          </div>
          <div className="rf-check-line" style={checkboxTextStyle}>
            <Checkbox />
            <span className="rf-check-line__body">{rf.accommodation.randomRoommateText}</span>
          </div>

          <div className="rf-creditcard-row">
            <div className="rf-creditcard" style={creditCardStyle}>{rf.creditCardInstruction}</div>
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

      <div className="rf-terms" style={acknowledgementStyle}>
        {rf.acknowledgementText}{' '}
        <strong>
          For Pre-Existing Medical Conditions Exclusion Waiver, insurance plan must be purchased at or before the
          final trip payment.
        </strong>
      </div>

      <div className="rf-signature-heading" style={signatureStyle}>Signature</div>
      <div className="rf-signature-row">
        <div className="rf-field-row" style={{ flex: 1 }}>
          <span className="rf-field-label">Passenger 1:</span>
          <span className="rf-signature-blank" />
        </div>
        <div className="rf-field-row" style={{ flex: 1 }}>
          <span className="rf-field-label">Passenger 2:</span>
          <span className="rf-signature-blank" />
        </div>
      </div>

      <div className="rf-passport-notice" style={passportNoticeStyle}>{rf.passportNotice}</div>

      <div className="rf-footer">
        <div className="rf-footer-rule" />
        <div className="rf-footer-content">
          <div className="rf-footer-accent" />
          <div className="rf-footer-text" style={footerStyle}>
            <div>{rf.footer.address}</div>
            <div>
              Tel: {rf.footer.phone} Email: {rf.footer.email} website: {rf.footer.website} CST- {rf.footer.cst}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
