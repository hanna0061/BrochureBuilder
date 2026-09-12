/**
 * animations.js — Scroll entrance and interactive animations
 * Pax Via Tours & Travel
 *
 * Uses IntersectionObserver for performant scroll-triggered
 * entrance animations. All transforms are CSS-driven;
 * JS only adds/removes state classes.
 */

/**
 * Initialize scroll-triggered entrance animations.
 * Elements with [data-animate] receive .is-visible when they
 * enter the viewport.
 *
 * Usage in HTML:
 *   <div data-animate>...</div>
 *   (optional) data-animate-delay="200" — stagger delay in ms
 */
export function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.animateDelay, 10) || 0;
        if (delay > 0) {
          setTimeout(() => el.classList.add('is-visible'), delay);
        } else {
          el.classList.add('is-visible');
        }
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

/**
 * Initialize the sticky navbar behavior.
 * Adds .is-sticky to #navbar when scrollY exceeds threshold.
 * Skips the update while the mobile menu is open to avoid state conflicts.
 */
export function initStickyNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const THRESHOLD = 60;

  const update = () => {
    if (navbar.classList.contains('is-open')) return;
    navbar.classList.toggle('is-sticky', window.scrollY > THRESHOLD);
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/**
 * Initialize the mobile hamburger menu toggle.
 * Toggles .is-open on #navbar; locks body scroll while open.
 * Closes on: hamburger click, nav link click, Escape key.
 */
export function initHamburgerMenu() {
  const navbar = document.getElementById('navbar');
  const hamburger = navbar && navbar.querySelector('.navbar__hamburger');
  if (!hamburger) return;

  const close = () => {
    navbar.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  };

  const toggle = () => {
    const isOpen = navbar.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);

  navbar.querySelectorAll('.navbar__links a').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navbar.classList.contains('is-open')) {
      close();
      hamburger.focus();
    }
  });

  document.addEventListener('click', e => {
    if (navbar.classList.contains('is-open') && !navbar.contains(e.target)) {
      close();
    }
  });
}
