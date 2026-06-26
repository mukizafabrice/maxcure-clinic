/* ============================================================
   FORM — validation + submission (appointments & contact)
   ============================================================ */
(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var PHONE_RE = /^[+]?[\d\s().-]{7,}$/;

  function setError(field, msg) {
    field.classList.add('invalid');
    field.setAttribute('aria-invalid', 'true');
    var err = field.parentElement.querySelector('.field-error');
    if (err) { err.textContent = msg; err.classList.add('show'); }
  }
  function clearError(field) {
    field.classList.remove('invalid');
    field.removeAttribute('aria-invalid');
    var err = field.parentElement.querySelector('.field-error');
    if (err) err.classList.remove('show');
  }

  function validateField(field) {
    var val = (field.value || '').trim();
    var type = field.getAttribute('type');
    var required = field.hasAttribute('required');

    if (required && !val) { setError(field, 'This field is required.'); return false; }
    if (val && type === 'email' && !EMAIL_RE.test(val)) { setError(field, 'Please enter a valid email address.'); return false; }
    if (val && type === 'tel' && !PHONE_RE.test(val)) { setError(field, 'Please enter a valid phone number.'); return false; }
    if (required && field.tagName === 'SELECT' && !val) { setError(field, 'Please select an option.'); return false; }
    clearError(field);
    return true;
  }

  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    var fields = form.querySelectorAll('.form-control[required], .form-control[data-check]');

    // validate on blur
    fields.forEach(function (f) {
      f.addEventListener('blur', function () { validateField(f); });
      f.addEventListener('input', function () { if (f.classList.contains('invalid')) validateField(f); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var firstInvalid = null;
      fields.forEach(function (f) {
        if (!validateField(f)) { valid = false; if (!firstInvalid) firstInvalid = f; }
      });

      // required radio groups
      var radioGroups = form.querySelectorAll('[data-radio-required]');
      radioGroups.forEach(function (group) {
        var checked = group.querySelector('input[type="radio"]:checked');
        var err = group.querySelector('.field-error');
        if (!checked) {
          valid = false;
          if (err) { err.textContent = 'Please choose a preferred time.'; err.classList.add('show'); }
          if (!firstInvalid) firstInvalid = group.querySelector('input');
        } else if (err) { err.classList.remove('show'); }
      });

      if (!valid) {
        if (firstInvalid && firstInvalid.focus) firstInvalid.focus();
        return;
      }

      // submit UI: spinner -> success
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.classList.add('loading');

      setTimeout(function () {
        if (btn) btn.classList.remove('loading');
        var success = document.querySelector(form.getAttribute('data-success') || '.success-card');
        if (success) {
          form.style.transition = 'opacity 0.4s ease';
          form.style.opacity = '0';
          setTimeout(function () {
            form.style.display = 'none';
            success.classList.add('show');
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 400);
        }
        form.reset();
      }, 1400);
    });
  });
})();
