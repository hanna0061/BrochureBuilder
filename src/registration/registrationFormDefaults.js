/**
 * Default Registration Form content — reproduced verbatim from
 * "Registration Form - Father Adrian.pdf" (the visual/textual source of
 * truth for this feature). Wording, spelling, and phrasing are preserved
 * exactly as they appear in the source document, including "CZECK" and
 * "Accomodation" — these are NOT typos to silently correct.
 *
 * This object only carries EDITABLE CONTENT. Everything structural — the
 * passenger field set, labels, order, underline lengths, checkboxes,
 * Emergency Contact / Badge Name rows, Signature labels, section geometry —
 * is fixed and hard-coded directly in RegistrationFormPrint.jsx, not here.
 */
// Passenger #1 and Passenger #2 are structurally identical (same fixed field
// set/order per the PDF) — this factory is the single source of truth for
// that shared shape, instantiated twice below into independent objects so
// editing one passenger's content/checkboxes never touches the other's.
function makePassengerDefaults(title) {
  return {
    title,
    subtitle: 'Clearly print your full name as it appears on your passport',
    labels: {
      lastName: 'Last Name:',
      middleName: 'Middle Name:',
      firstName: 'First Name:',
      birthDate: 'Birth Date',
      dateHint: '(MM/DD/YYYY)',
      sex: 'Sex:',
      male: 'M',
      female: 'F',
      citizenship: 'Country of Citizenship',
      address: 'Address',
      city: 'City',
      state: 'State',
      zip: 'Zip',
      email: 'Email',
      consent: 'I consent to receive promotional emails about your services',
      homePhone: 'Home Phone',
      cellPhone: 'Cell Phone',
      passportNumber: 'Passport #',
      expirationDate: 'Expiration Date',
      expirationNote: '(Must be valid for 6 months post return)',
    },
    // Blank on a fresh/default form — these are the traveler's own answers,
    // filled in by the manager (or left blank for hand-writing on a print).
    values: {
      lastName: '',
      middleName: '',
      firstName: '',
      birthDate: '', // free-typed as MM/DD/YYYY; split across the fixed 3-blank line in RegistrationFormPrint.jsx
      citizenship: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      email: '',
      homePhone: '',
      cellPhone: '',
      passportNumber: '',
      expirationDate: '', // same MM/DD/YYYY split as birthDate
    },
    checked: {
      male: false,
      female: false,
      consent: false,
    },
  };
}

const registrationFormDefaults = {
  tourNumber: 'BOI-0405/10D',

  titleLine1: 'A PILGRIMAGE TO',
  titleLine2: 'POLAND, CZECK &',
  titleLine3: 'MEDJUGORJE',

  leaderLine1: 'WITH REV. ADRIAN',
  leaderLine2: 'VAZQUEZ',

  formLabel: 'REGISTRATION FORM',

  payment: {
    deposit: '$500.00',
    checkPrice: '$4999 per traveler',
    insuranceText:
      'Visit www.paxvia.com/travel-protection For pre-departure cancellation coverage and for pre-existing medical condition exclusion waiver, the plan insurance must be purchased at or before final payment.',
    payableTo: 'Pax Via Tours & Travel',
    mailingAddressLine1: '9939 Hibert Street Suite 106',
    mailingAddressLine2: 'San Diego, CA 92131',
    // Same checked-state pattern as passenger1/passenger2.checked below —
    // one boolean per selectable option, defaulting to unchecked.
    checked: {
      checkDiscount: false,
      travelInsurance: false,
    },
  },

  accommodation: {
    doubleRoomText: 'Double room sharing with',
    singleRoomText: 'Single Room ($1050 extra per person)',
    randomRoommateText:
      'Random Roommate (I understand if no roommate is found, the single supplement charge will be added to my account)',
    checked: {
      doubleRoom: false,
      singleRoom: false,
      randomRoommate: false,
    },
  },

  creditCardInstruction: 'For Credit Card Payment: Scan Code or go to www.paxvia.com to register',

  // Data URL of an uploaded QR image, or '' when none has been provided.
  // No default QR asset exists in this project (none could be reliably
  // extracted from the source PDF), so this starts empty — the manager
  // must upload one via the Registration Form editor's QR Code field.
  qrImage: '',

  // The PDF's final sentence ("For Pre-Existing Medical Conditions Exclusion
  // Waiver, insurance plan must be purchased at or before the final trip
  // payment.") is fixed legal boilerplate, always bold, always appended —
  // it is NOT part of this editable string and is hard-coded in
  // RegistrationFormPrint.jsx instead, so it can never be accidentally
  // edited away.
  acknowledgementText:
    'This registration form serves as your acceptance of the policies, terms and conditions as outlined in this brochure. I acknowledge that airline tickets are non-refundable, non-transferable, and are subject to airline cancellation fees and policies. No registrations will be accepted without signed acknowledgement.',

  passportNotice: 'PLEASE INCLUDE A CLEAR PHOTOCOPY OF YOUR PASSPORT WITH THIS REGISTRATION FORM',

  footer: {
    address: '9939 Hibert Street Suite 106 San Diego, CA 92131',
    phone: '(844) 212-8162',
    email: 'info@paxvia.com',
    website: 'paxvia.com',
    cst: '2161770-50',
  },

  passenger1: makePassengerDefaults('Passenger #1:'),
  passenger2: makePassengerDefaults('Passenger #2:'),

  // The row's own labels are now editable too (via FloatingEditor's TEXT
  // field on the label itself — see RegistrationFormPrint.jsx's openTypo
  // calls), same as passenger1/passenger2.labels below.
  emergencyContact: {
    contact: '',
    relation: '',
    phone: '',
    labels: {
      contact: 'Emergency Contact:',
      relation: 'Relation:',
      phone: 'Phone:',
    },
  },

  // Single shared label — the PDF uses identical wording for both passenger
  // badge rows, so one editable string covers both.
  badgeNames: {
    passenger1: '',
    passenger2: '',
    label: 'Name for Badge (Nickname)',
  },

  // Populated on demand by UPDATE_REGISTRATION_TYPOGRAPHY, keyed by the
  // section keys in registrationFormTypography.js. Empty by default — every
  // key falls back to REGISTRATION_TYPOGRAPHY_DEFAULTS until overridden.
  typography: {},
};

export default registrationFormDefaults;
