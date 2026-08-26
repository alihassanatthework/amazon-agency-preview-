/* ==========================================================================
   PHASE 04 — SHELL BEHAVIOUR
   Header scroll states, mobile drawer (focus trap, scroll lock, Escape),
   footer accordions.
   ========================================================================== */

(function () {
  'use strict';

  var header = document.querySelector('[data-header]');

  /* --- Header: transparent → scrolled, and hide-on-down / show-on-up ------ */

  if (header) {
    var solid = header.hasAttribute('data-header-solid');   /* C0 opaque from load */
    var last = window.scrollY;
    var ticking = false;

    function onScroll() {
      var y = window.scrollY;

      if (!solid) header.classList.toggle('is-scrolled', y > 64);

      /* Past 400px, leave on downward scroll and return on any upward scroll.
         The drawer being open pins the bar in place. */
      if (!document.body.classList.contains('is-locked')) {
        if (y > 400 && y > last) header.classList.add('is-hidden');
        else header.classList.remove('is-hidden');
      }

      last = y;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    }, { passive: true });

    onScroll();
  }

  /* --- Mobile drawer ------------------------------------------------------ */

  var toggle = document.querySelector('[data-drawer-toggle]');
  var drawer = document.querySelector('[data-drawer]');
  var backdrop = document.querySelector('[data-drawer-backdrop]');

  if (toggle && drawer) {
    var FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
    var stagger = 50;   /* links rise-stagger at 50ms */

    function setLinkDelays() {
      drawer.querySelectorAll('.drawer__links a').forEach(function (a, i) {
        a.style.transitionDelay = (i * stagger) + 'ms';
      });
    }

    function open() {
      drawer.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('is-locked');
      header && header.classList.remove('is-hidden');
      setLinkDelays();

      var first = drawer.querySelector(FOCUSABLE);
      if (first) first.focus();
      document.addEventListener('keydown', onKeydown);
    }

    function close() {
      drawer.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      document.removeEventListener('keydown', onKeydown);
      toggle.focus();                       /* focus restored to the trigger */
    }

    function onKeydown(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;

      /* Focus is trapped while the drawer is open. */
      var items = Array.prototype.filter.call(
        drawer.querySelectorAll(FOCUSABLE),
        function (el) { return el.offsetParent !== null; }
      );
      if (!items.length) return;

      var first = items[0];
      var lastItem = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); lastItem.focus();
      } else if (!e.shiftKey && document.activeElement === lastItem) {
        e.preventDefault(); first.focus();
      }
    }

    toggle.addEventListener('click', function () {
      drawer.classList.contains('is-open') ? close() : open();
    });
    if (backdrop) backdrop.addEventListener('click', close);
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });

    /* Leaving the mobile breakpoint with the drawer open would strand it. */
    window.matchMedia('(min-width: 1280px)').addEventListener('change', function (e) {
      if (e.matches && drawer.classList.contains('is-open')) close();
    });
  }

  /* --- Footer accordions — mobile only ------------------------------------ */

  var accordionQuery = window.matchMedia('(max-width: 767px)');

  function syncFooter() {
    document.querySelectorAll('[data-footer-toggle]').forEach(function (btn, i) {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;

      if (accordionQuery.matches) {
        var openFirst = i === 0;             /* first expanded by default */
        btn.setAttribute('aria-expanded', String(openFirst));
        panel.dataset.open = String(openFirst);
        panel.hidden = false;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        panel.dataset.open = 'true';
        panel.hidden = false;
      }
    });
  }

  document.querySelectorAll('[data-footer-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!accordionQuery.matches) return;
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.dataset.open = String(!isOpen);
    });
  });

  accordionQuery.addEventListener('change', syncFooter);
  syncFooter();

  /* --- Current year ------------------------------------------------------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
