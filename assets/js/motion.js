/* ==========================================================================
   PHASE 03 — MOTION PRIMITIVES (behaviour)
   Reusable wrappers for the seven scroll-reveal patterns. Every primitive has
   its reduced-motion path here rather than bolted on afterwards: when motion
   is off, `motion-on` is never added, so the CSS initial states never apply
   and content renders finished.
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Read the numeric value of a motion token so JS and CSS cannot drift. */
  function token(name, fallback) {
    var raw = getComputedStyle(root).getPropertyValue(name).trim();
    var n = parseFloat(raw);
    return isNaN(n) ? fallback : n;
  }

  var MOTION = {
    stagger: token('--stagger', 80),
    count: token('--motion-count', 1800)
  };

  var enabled = !reduceQuery.matches;

  /* -----------------------------------------------------------------------
     Count-up — runs on every path. Under reduced motion the final value is
     displayed instantly rather than skipped, so the numbers are never absent.
     ----------------------------------------------------------------------- */

  function formatValue(el, value) {
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var out = value.toFixed(decimals);
    if (el.dataset.separator !== 'false') {
      var parts = out.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      out = parts.join('.');
    }
    return out;
  }

  function countUp(el, duration) {
    if (el.dataset.counted === 'true') return;   /* single-fire */
    el.dataset.counted = 'true';

    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;

    if (!enabled) { el.textContent = formatValue(el, target); return; }

    var ms = duration || MOTION.count;
    var start = null;

    function frame(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / ms, 1);
      var eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);   /* easeOutExpo */
      el.textContent = formatValue(el, target * eased);
      if (t < 1) requestAnimationFrame(frame);
      else el.textContent = formatValue(el, target);
    }
    requestAnimationFrame(frame);
  }

  /* Reserve the final width before counting so there is zero layout shift. */
  function reserveWidth(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    el.style.minWidth = '';
    var final = formatValue(el, target);
    var probe = el.cloneNode(false);
    probe.textContent = final;
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.whiteSpace = 'nowrap';
    document.body.appendChild(probe);
    el.style.minWidth = probe.getBoundingClientRect().width + 'px';
    probe.remove();
  }

  /* -----------------------------------------------------------------------
     Word-rise — split a headline into lines, each in its own clipping box.
     Splitting happens on the finished layout so real line breaks are used,
     and it is skipped entirely when motion is off.
     ----------------------------------------------------------------------- */

  function splitLines(el) {
    if (el.dataset.split === 'true') return;
    var lines = el.innerHTML.split(/<br\s*\/?>/i);
    if (lines.length < 2 && !el.dataset.forceSplit) {
      /* No authored break: treat the whole headline as one rising line. */
      lines = [el.innerHTML];
    }
    el.innerHTML = lines.map(function (line, i) {
      return '<span class="line-clip"><span style="--reveal-delay:' +
             (i * 60) + 'ms">' + line.trim() + '</span></span>';
    }).join('');
    el.dataset.split = 'true';
  }

  /* -----------------------------------------------------------------------
     Reveal observer — fires once at 20% viewport entry, never on scroll-up.
     ----------------------------------------------------------------------- */

  function applyStagger(group) {
    var step = parseFloat(group.dataset.stagger) || MOTION.stagger;
    Array.prototype.forEach.call(group.children, function (child, i) {
      /* Nothing waits longer than 400ms total — content is never gated. */
      child.style.setProperty('--reveal-delay', Math.min(i * step, 400) + 'ms');
    });
  }

  function reveal(el) {
    el.classList.add('is-revealed');
    el.querySelectorAll('[data-count]').forEach(function (n) {
      countUp(n, parseFloat(n.dataset.duration) || undefined);
    });
    if (el.hasAttribute('data-count')) countUp(el);
  }

  function observe() {
    var targets = document.querySelectorAll(
      '[data-reveal], [data-reveal-group], [data-line-draw], .mask-wipe'
    );

    if (!enabled || !('IntersectionObserver' in window)) {
      targets.forEach(reveal);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        io.unobserve(entry.target);        /* fire once — never replays */
      });
    }, { threshold: 0, rootMargin: '0px 0px -20% 0px' });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* -----------------------------------------------------------------------
     Parallax-soft — 0.88× or 1.12× within the element's own section, capped
     at 60px total displacement. Disabled below 768px and under reduced
     motion; suspends when the element is off-screen.
     ----------------------------------------------------------------------- */

  function parallax() {
    if (!enabled) return;
    var mq = window.matchMedia('(min-width: 768px)');
    var items = [];
    var ticking = false;

    function collect() {
      items = [];
      if (!mq.matches) {
        document.querySelectorAll('[data-parallax]').forEach(function (el) {
          el.style.setProperty('--parallax', '0px');
        });
        return;
      }
      document.querySelectorAll('[data-parallax]').forEach(function (el) {
        items.push({
          el: el,
          amount: Math.min(Math.abs(parseFloat(el.dataset.parallax) || 40), 60),
          sign: (parseFloat(el.dataset.parallax) || 40) < 0 ? -1 : 1,
          visible: false
        });
      });

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var item = items.filter(function (i) { return i.el === entry.target; })[0];
          if (item) item.visible = entry.isIntersecting;   /* off-screen work pauses */
        });
      }, { rootMargin: '10% 0px' });
      items.forEach(function (i) { io.observe(i.el); });
    }

    function update() {
      var vh = window.innerHeight;
      items.forEach(function (item) {
        if (!item.visible) return;
        var rect = item.el.getBoundingClientRect();
        var progress = (vh - rect.top) / (vh + rect.height);   /* 0 → 1 */
        var offset = (progress - .5) * 2 * item.amount * item.sign;
        item.el.style.setProperty('--parallax', offset.toFixed(2) + 'px');
      });
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    collect();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { collect(); update(); });
    mq.addEventListener('change', function () { collect(); update(); });
  }

  /* -----------------------------------------------------------------------
     Boot
     ----------------------------------------------------------------------- */

  function init() {
    if (enabled) root.classList.add('motion-on');

    document.querySelectorAll('[data-count]').forEach(reserveWidth);

    if (enabled) {
      document.querySelectorAll('[data-word-rise]').forEach(splitLines);
    }

    document.querySelectorAll('[data-reveal-group]').forEach(applyStagger);

    observe();
    parallax();
  }

  /* Expose the primitives so page scripts reuse them rather than reinventing. */
  window.Motion = {
    get enabled() { return enabled; },
    token: token,
    countUp: countUp,
    reveal: reveal,
    applyStagger: applyStagger,
    tokens: MOTION
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* If the user turns reduced motion on mid-session, drop to the static path. */
  reduceQuery.addEventListener('change', function (e) {
    enabled = !e.matches;
    if (!enabled) {
      root.classList.remove('motion-on');
      document.querySelectorAll('[data-parallax]').forEach(function (el) {
        el.style.setProperty('--parallax', '0px');
      });
    }
  });
})();
