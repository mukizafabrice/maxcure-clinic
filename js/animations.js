/* ============================================================
   ANIMATIONS — GSAP, AOS, counters, Vanta, particles, Lottie
   Defensive: every library is feature-checked before use.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Heavy WebGL/particle effects are skipped on phones & tablets for speed.
  var isMobile = window.matchMedia('(max-width: 900px)').matches;

  /* ---------- Loading screen ---------- */
  var loader = document.querySelector('.loader');
  function hideLoader() {
    if (!loader) return;
    if (window.gsap) {
      gsap.to(loader, { opacity: 0, duration: 0.5, delay: reduceMotion ? 0 : 1.5,
        onComplete: function () { loader.style.display = 'none'; } });
    } else {
      setTimeout(function () { loader.style.opacity = '0';
        setTimeout(function () { loader.style.display = 'none'; }, 500);
      }, reduceMotion ? 0 : 1500);
    }
  }

  /* ---------- AOS ---------- */
  function initAOS() {
    if (window.AOS) {
      AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 80,
        disable: reduceMotion });
    } else {
      // fallback: reveal everything
      document.documentElement.classList.add('no-aos');
    }
  }

  /* ---------- GSAP entrance ---------- */
  function initGSAP() {
    if (!window.gsap || reduceMotion) return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    gsap.from('.navbar', { y: -80, opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 });

    if (document.querySelector('.hero-headline')) {
      gsap.set('.hero-badge, .hero-headline, .hero-sub, .hero-buttons, .hero-stats', { opacity: 0, y: 30 });
      gsap.to('.hero-badge',    { opacity: 1, y: 0, duration: 0.6, delay: 0.05, ease: 'power2.out' });
      gsap.to('.hero-headline', { opacity: 1, y: 0, duration: 0.7, delay: 0.15, ease: 'power2.out' });
      gsap.to('.hero-sub',      { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' });
      gsap.to('.hero-buttons',  { opacity: 1, y: 0, duration: 0.6, delay: 0.45, ease: 'power2.out' });
      gsap.to('.hero-stats',    { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'power2.out' });

      if (document.querySelector('.hero-media')) {
        gsap.from('.hero-media', { opacity: 0, y: 24, duration: 0.7, delay: 0.2, ease: 'power2.out', clearProps: 'opacity,transform' });
      }
    }
  }

  /* ---------- Counter animation ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 2000, start = null;
      if (reduceMotion) { el.textContent = formatNum(target) + suffix; return; }
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = formatNum(Math.floor(eased * target)) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = formatNum(target) + suffix;
      }
      requestAnimationFrame(step);
    }
    function formatNum(n) { return n.toLocaleString('en-US'); }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(animate);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    var statsSection = document.querySelector('.stats-section');
    if (statsSection) io.observe(statsSection);
  }

  /* ---------- Vanta backgrounds ---------- */
  function initVanta() {
    if (reduceMotion || isMobile || !window.VANTA) return;
    var cells = document.querySelector('[data-vanta="cells"]');
    if (cells && VANTA.CELLS) {
      VANTA.CELLS({ el: cells, mouseControls: true, touchControls: true,
        minHeight: 200, minWidth: 200, scale: 1,
        color1: 0x8b0000, color2: 0xfdf8f5, size: 2.2, speed: 0.8 });
    }
    var waves = document.querySelector('[data-vanta="waves"]');
    if (waves && VANTA.WAVES) {
      VANTA.WAVES({ el: waves, mouseControls: true, touchControls: true,
        minHeight: 200, minWidth: 200, scale: 1,
        color: 0x8b0000, shininess: 35, waveHeight: 20, waveSpeed: 0.9, zoom: 0.92 });
    }
  }

  /* ---------- tsParticles (stats field) ---------- */
  function initParticles() {
    if (reduceMotion || isMobile || !window.tsParticles) return;
    var el = document.getElementById('stats-particles');
    if (!el) return;
    tsParticles.load({ id: 'stats-particles', options: {
      fullScreen: { enable: false },
      fpsLimit: 60,
      particles: {
        number: { value: 100, density: { enable: true, area: 900 } },
        color: { value: '#ffffff' },
        opacity: { value: 0.5 },
        size: { value: { min: 1, max: 3 } },
        move: { enable: true, speed: 0.6, direction: 'none', outModes: 'out' },
        links: { enable: false }
      },
      detectRetina: true,
      background: { color: 'transparent' }
    }});
  }

  /* ---------- Lottie service icons ---------- */
  function initLottie() {
    if (!window.lottie) return;
    document.querySelectorAll('[data-lottie]').forEach(function (el) {
      lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: !reduceMotion,
        path: el.getAttribute('data-lottie')
      });
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    hideLoader();
    initAOS();
    initGSAP();
    initCounters();
    initVanta();
    initParticles();
    initLottie();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  // safety: never let a stuck loader block the page
  window.addEventListener('load', function () {
    setTimeout(function () {
      if (loader && loader.style.display !== 'none') {
        loader.style.opacity = '0';
        setTimeout(function () { loader.style.display = 'none'; }, 400);
      }
    }, 2600);
  });
})();
