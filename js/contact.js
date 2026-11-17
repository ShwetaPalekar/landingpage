/* XS contact page — front-end only. Nothing is sent or stored (no network, no browser storage). */
(function () {
  'use strict';

  var form = document.getElementById('contact-form');
  if (!form) return;

  var formPanel = document.getElementById('contact-form-panel');
  var thanks = document.getElementById('contact-thanks');
  var returnBtn = document.getElementById('contact-return');
  var FIELDS = ['name', 'email', 'message'];
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function input(key) { return form.elements[key]; }

  function messageFor(key, value) {
    if (key === 'name' && !value) return 'Please enter your name.';
    if (key === 'email') {
      if (!value) return 'Please enter your email address.';
      if (!EMAIL.test(value)) return 'Please enter a valid email address, like name@example.com.';
    }
    if (key === 'message' && !value) return 'Please enter a message.';
    return '';
  }

  function setError(key, msg) {
    var el = input(key);
    document.getElementById(key + '-error').textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    el.closest('.field').classList.toggle('has-error', Boolean(msg));
  }

  function validate(key) {
    var msg = messageFor(key, input(key).value.trim());
    setError(key, msg);
    return !msg;
  }

  // Clears every field and every validation message.
  function resetForm() {
    form.reset();
    FIELDS.forEach(function (key) {
      input(key).value = '';
      setError(key, '');
    });
  }

  function showForm() {
    thanks.hidden = true;
    formPanel.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    FIELDS.forEach(function (key) {
      if (!validate(key) && !firstInvalid) firstInvalid = input(key);
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    formPanel.hidden = true;
    thanks.hidden = false;
    thanks.querySelector('.thanks__title').focus();
  });

  // Once a field shows an error, re-check it as the user fixes it.
  FIELDS.forEach(function (key) {
    input(key).addEventListener('input', function () {
      if (input(key).getAttribute('aria-invalid') === 'true') validate(key);
    });
  });

  returnBtn.addEventListener('click', function () {
    resetForm();
    showForm();
    input('name').focus();
  });

  // Always start empty: on first load, on refresh, and when the page is restored from the back/forward cache.
  resetForm();
  showForm();
  window.addEventListener('pageshow', function () {
    resetForm();
    showForm();
  });
})();
