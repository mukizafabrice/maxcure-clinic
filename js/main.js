/* ============================================================
   MAIN — navbar, mobile menu, accordion, shared logic
   ============================================================ */
(function () {
  'use strict';

  /* ---- Navbar scroll effect ---- */
  var navbar = document.querySelector('.navbar');
  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.mobile-menu');
  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var willOpen = !menu.classList.contains('open');
      menu.classList.toggle('open', willOpen);
      toggle.classList.toggle('open', willOpen);
      toggle.setAttribute('aria-expanded', String(willOpen));
      document.body.style.overflow = willOpen ? 'hidden' : '';
    });
    // close when a link is clicked
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    // close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---- Accordion (insurance FAQ) ---- */
  document.querySelectorAll('.acc-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var item = header.closest('.acc-item');
      var body = item.querySelector('.acc-body');
      var isOpen = item.classList.contains('open');
      // close siblings
      var siblings = item.parentElement.querySelectorAll('.acc-item.open');
      siblings.forEach(function (s) {
        if (s !== item) {
          s.classList.remove('open');
          s.querySelector('.acc-body').style.maxHeight = null;
          s.querySelector('.acc-header').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      header.setAttribute('aria-expanded', String(!isOpen));
      body.style.maxHeight = !isOpen ? body.scrollHeight + 'px' : null;
    });
  });

  /* ---- Footer year ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Date input min = today (appointments) ---- */
  var dateInput = document.querySelector('input[type="date"]');
  if (dateInput) {
    var today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
})();
