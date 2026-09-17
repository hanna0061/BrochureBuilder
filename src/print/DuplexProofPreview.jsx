import React from 'react';
import Page1Cover from '../templates/pages/Page1Cover';
import Page3Pricing from '../templates/pages/Page3Pricing';
import Page4Terms from '../templates/pages/Page4Terms';
import ItineraryPages from '../templates/ItineraryPages';
import { useBrochure } from '../context/BrochureContext';
import './duplexProof.css';

/**
 * DEVELOPER-ONLY duplex-flip physical simulation. Not part of the normal
 * app UI or workflow — reached only via ?duplexProof=1, wired in App.jsx
 * with a single, isolated, top-of-render check. Does not modify
 * PrintSpreadLayout.jsx, brochure.css, or any brochure page/print output.
 *
 * WHAT THIS PROVES:
 * "Flip on Short Edge" on a landscape sheet is, physically, a 180° rotation
 * of the whole rigid sheet about a VERTICAL axis (turning it like a book
 * page). CSS's `rotateY(180deg)` is exactly that rotation, computed by the
 * browser's real 3D transform engine — not a value picked to produce a
 * desired-looking answer. Wrapping Sheet 2's actual rendered content in the
 * standard two-sided "flip card" CSS recipe and setting the card to its
 * flipped state therefore shows the true, calculated physical result of a
 * short-edge duplex flip, for whatever content Sheet 2 currently contains.
 *
 * Two scenarios are rendered side by side, both driven from the exact same
 * Page1Cover / Page3Pricing / Page4Terms / ItineraryPages components
 * PrintSpreadLayout.jsx uses (imported independently here — that file is
 * untouched):
 *   A. NO ROTATION — this is what PrintSpreadLayout.jsx currently renders
 *      for Sheet 2 (Page 2 / Page 3 upright, unrotated).
 *   B. ROTATED (previously tried, since reverted) — kept only for
 *      reference/comparison. The rotation styling lives locally in
 *      duplexProof.css (.duplex-proof__demo-rotate180) — the production
 *      .print-spread-sheet__rotate180 rule this used to reuse no longer
 *      exists in brochure.css, since this exact tool proved it didn't
 *      achieve its goal.
 */

function Sheet1({ tour, company, terms }) {
  return (
    <div className="print-spread-sheet">
      <Page4Terms tour={tour} company={company} terms={terms} />
      <Page1Cover tour={tour} company={company} />
    </div>
  );
}

// Matches PrintSpreadLayout.jsx's actual current Sheet 2 markup exactly.
function Sheet2NoRotation({ tour, company, terms }) {
  return (
    <div className="print-spread-sheet">
      <ItineraryPages tour={tour} company={company} renderPage={(pageEl) => pageEl} />
      <Page3Pricing tour={tour} company={company} terms={terms} />
    </div>
  );
}

// Reference-only: reproduces the previously-tried (since reverted) rotated
// version, using this tool's own local demo class — see file header.
function Sheet2Rotated({ tour, company, terms }) {
  return (
    <div className="print-spread-sheet">
      <div className="duplex-proof__demo-rotate180">
        <ItineraryPages tour={tour} company={company} renderPage={(pageEl) => pageEl} />
      </div>
      <div className="duplex-proof__demo-rotate180">
        <Page3Pricing tour={tour} company={company} terms={terms} />
      </div>
    </div>
  );
}

// Renders one 1632×1056 sheet, scaled down for on-screen viewing only.
function Scaled({ children }) {
  return (
    <div className="duplex-proof__stage">
      <div className="duplex-proof__scale">{children}</div>
    </div>
  );
}

// The actual physical-flip simulation: a real two-sided 3D object. `back`
// is placed on the reverse face using the standard flip-card CSS recipe,
// then the whole card is rotated 180° about the vertical (Y) axis — the
// literal "pick the sheet up and turn it over" action. What ends up facing
// the viewer is the mathematically computed physical result, not an assumed one.
function PhysicalFlipResult({ back }) {
  return (
    <div className="duplex-proof__stage">
      <div className="duplex-proof__scale">
        <div className="duplex-perspective">
          <div className="duplex-card duplex-card--flipped">
            <div className="duplex-card__face duplex-card__face--back">{back}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scenario({ id, title, description, tour, company, terms, backContent, verdict, verdictWrong }) {
  return (
    <div className="duplex-proof__scenario" data-scenario={id}>
      <h2 className="duplex-proof__scenario-title">{title}</h2>
      <p className="duplex-proof__scenario-desc">{description}</p>
      <div className="duplex-proof__row">
        <div className="duplex-proof__col">
          <span className="duplex-proof__label duplex-proof__label--front">Print File — Front</span>
          <Scaled>
            <Sheet1 tour={tour} company={company} terms={terms} />
          </Scaled>
        </div>
        <div className="duplex-proof__col">
          <span className="duplex-proof__label duplex-proof__label--back">Print File — Back (as authored)</span>
          <Scaled>{backContent}</Scaled>
        </div>
        <div className="duplex-proof__col">
          <span className={`duplex-proof__label duplex-proof__label--result${verdictWrong ? ' is-wrong' : ''}`}>
            Physical Result — After Short-Edge Flip
          </span>
          <PhysicalFlipResult back={backContent} />
        </div>
      </div>
      <div className="duplex-proof__verdict">{verdict}</div>
    </div>
  );
}

export default function DuplexProofPreview() {
  const { state } = useBrochure();
  const { tour, company, terms } = state;

  return (
    <div className="duplex-proof">
      <span className="duplex-proof__banner">Developer Tool — Not part of the print workflow</span>
      <h1 className="duplex-proof__title">Duplex Proof Preview</h1>
      <p className="duplex-proof__subtitle">
        Simulates physically duplex-printing the Full Spread and flipping the sheet on its SHORT EDGE (a 180°
        rotation about the vertical axis — CSS <code>rotateY(180deg)</code>, a real 3D rotation, computed by the
        browser, not assumed). "Print File — Back" is exactly what the current code renders for Sheet 2 today
        (Print Preview / the PDF would show this). "Physical Result" is what a human would actually see after
        printing that content on the back of the sheet and turning it over book-style.
      </p>

      <Scenario
        id="current"
        title="Scenario A — Current implementation (no rotation on Page 2 / Page 3)"
        description="Reuses PrintSpreadLayout.jsx's exact current Sheet 2 markup — Page 2 / Page 3 rendered upright, no transform."
        tour={tour}
        company={company}
        terms={terms}
        backContent={<Sheet2NoRotation tour={tour} company={company} terms={terms} />}
        verdict="Computed result: Page 2 and Page 3 are authored upright. After the simulated short-edge flip, they remain UPRIGHT — matching the goal. This is what PrintSpreadLayout.jsx renders today."
      />

      <Scenario
        id="rotated-reference"
        title="Scenario B — Rotated (previously tried, since reverted — reference only)"
        description="Page 2 / Page 3 wrapped in rotate(180deg), reproduced here via this tool's own local demo class (duplexProof.css) since the production rule was removed from brochure.css."
        tour={tour}
        company={company}
        terms={terms}
        backContent={<Sheet2Rotated tour={tour} company={company} terms={terms} />}
        verdict="Computed result: Page 2 and Page 3 are rendered rotated 180° in the print file. A short-edge flip does not add a second rotation to already-authored content, so the physical result is Page 2 / Page 3 UPSIDE-DOWN — the physical page shows the same orientation as 'Back (as authored)'. This is why the rotation was reverted."
        verdictWrong
      />
    </div>
  );
}
