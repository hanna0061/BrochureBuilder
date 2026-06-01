import React, { useState } from 'react';
import TourInfoSection from './sections/TourInfoSection';
import DestinationsSection from './sections/DestinationsSection';
import ImagesSection from './sections/ImagesSection';
import ItinerarySection from './sections/ItinerarySection';
import PricingSection from './sections/PricingSection';
import TermsSection from './sections/TermsSection';
import NavbarSection from './sections/NavbarSection';
import FooterSection from './sections/FooterSection';
import ColorsSection from './sections/ColorsSection';
import PositionsSection from './sections/PositionsSection';
import LogosSection from './sections/LogosSection';
import { useBrochure } from '../context/BrochureContext';

const SECTIONS = [
  { id: 'tourInfo',      title: 'Tour Info',             Component: TourInfoSection },
  { id: 'destinations',  title: 'Destinations',           Component: DestinationsSection },
  { id: 'images',        title: 'Images',                 Component: ImagesSection },
  { id: 'itinerary',     title: 'Itinerary',              Component: ItinerarySection },
  { id: 'pricing',       title: 'Pricing & Inclusions',   Component: PricingSection },
  { id: 'terms',         title: 'Terms & Conditions',     Component: TermsSection },
  { id: 'navbar',        title: 'Navbar',                 Component: NavbarSection },
  { id: 'footer',        title: 'Footer',                 Component: FooterSection },
  { id: 'colors',        title: 'Colors',                 Component: ColorsSection },
  { id: 'positions',     title: 'Content Positions',      Component: PositionsSection },
  { id: 'logos',         title: 'Logos',                  Component: LogosSection },
];

export default function EditorSidebar() {
  const { dispatch } = useBrochure();
  const [openSections, setOpenSections] = useState(['tourInfo']);

  const toggle = (id) =>
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  const handleReset = () => {
    if (window.confirm('Reset all brochure data to the default template? This cannot be undone.')) {
      dispatch({ type: 'RESET_TOUR' });
    }
  };

  return (
    <aside className="editor-sidebar">
      <div className="editor-sidebar__header">
        <p className="editor-sidebar__title">Edit Brochure</p>
      </div>

      <div className="editor-sidebar__scroll">
        {SECTIONS.map(({ id, title, Component }) => {
          const isOpen = openSections.includes(id);
          return (
            <div key={id} className={`editor-section${isOpen ? ' is-open' : ''}`}>
              <button
                className="editor-section__toggle"
                onClick={() => toggle(id)}
                aria-expanded={isOpen}
                type="button"
              >
                <span className="editor-section__title">{title}</span>
                <span className="editor-section__chevron" aria-hidden="true" />
              </button>
              {isOpen && (
                <div className="editor-section__body">
                  <Component />
                </div>
              )}
            </div>
          );
        })}

        {/* Reset button at bottom of sidebar */}
        <div style={{ padding: '16px 20px 20px' }}>
          <button
            className="array-field__add"
            onClick={handleReset}
            type="button"
            style={{ color: '#6B6B7A', borderColor: '#D0CFC8' }}
          >
            Reset to Default Template
          </button>
        </div>
      </div>
    </aside>
  );
}
