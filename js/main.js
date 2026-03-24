/* ═══════════════════════════════════════════════════════
   GARIMA SHRESTHA — PORTFOLIO  |  main.js
   Custom cursor · Scroll progress · Nav · Reveals
   Mobile nav · WCAG accessibility
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const $ = (s, ctx) => (ctx || document).querySelector(s);
  const $$ = (s, ctx) => (ctx || document).querySelectorAll(s);
  const isFine = window.matchMedia('(pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Custom Cursor ───────────────────────────────────── */
  const cursor = $('.cursor');
  const ring   = $('.cursor-ring');

  if (isFine && cursor && ring && !reduced) {
    let mx = -300, my = -300, rx = -300, ry = -300;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    const lerp = (a, b, t) => a + (b - a) * t;
    (function animRing() {
      rx = lerp(rx, mx, 0.1);
      ry = lerp(ry, my, 0.1);
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();

    $$('a, button, .btn, .project-card, .skill-tag, .pain-card, .persona-card').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        ring.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        ring.classList.remove('is-hovering');
      });
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      ring.style.opacity   = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      ring.style.opacity   = '1';
    });
  }

  /* ── Scroll Progress Bar ─────────────────────────────── */
  const progressBar = $('.scroll-progress-bar');
  if (progressBar) {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.transform = 'scaleX(' + (total > 0 ? window.scrollY / total : 0) + ')';
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Nav: transparent → frosted on scroll ────────────── */
  const nav = $('.site-nav');
  if (nav) {
    const update = () => nav.classList.toggle('nav-scrolled', window.scrollY > 52);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ── Mobile Nav Toggle (WCAG 4.1.2 — Name, Role, Value) */
  const navToggle = $('.nav-toggle');
  const navMenu   = $('#nav-menu');

  if (navToggle && navMenu) {
    const openMenu = () => {
      navToggle.setAttribute('aria-expanded', 'true');
      navMenu.classList.add('is-open');
      // Move focus to first nav link for keyboard users
      const firstLink = navMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
    };

    navToggle.addEventListener('click', () => {
      navToggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
    });

    // Close on Escape key — WCAG 2.1.2 No Keyboard Trap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMenu();
        navToggle.focus();
      }
    });

    // Close when a nav link is activated
    navMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', closeMenu);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && navMenu.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* ── IntersectionObserver Scroll Reveals ─────────────── */
  const revealEls = $$('[data-reveal]');

  if (revealEls.length) {
    if ('IntersectionObserver' in window && !reduced) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const delay = parseInt(entry.target.dataset.delay, 10) || 0;
              setTimeout(() => entry.target.classList.add('is-visible'), delay);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  }

})();
