/* XS landing page — progressive enhancements only. The page works without JS. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header state ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('nav-menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (menu.classList.contains('is-open') && !e.target.closest('.nav')) setMenu(false);
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  /* ---------- Flavour selector ---------- */
  var FLAVOURS = {
    cgb: { name: 'Cranberry-Grape Blast', word: 'CRANBERRY', code: 'CGB—01 / Blast series', notes: 'Tart | Jammy | Bold',
      label: 'CRANBERRY-GRAPE BLAST',
      desc: 'Sharp cranberry folded into deep, jammy grape. A berry hit with real backbone.' },
    ctb: { name: 'Citrus Blast', word: 'CITRUS', code: 'CTB—02 / Blast series', notes: 'Zesty | Sunny | Crisp',
      label: 'CITRUS BLAST',
      desc: 'Orange, mandarin and a squeeze of lime. Bright, juicy and endlessly sippable.' },
    trb: { name: 'Tropical Blast', word: 'TROPICAL', code: 'TRB—03 / Blast series', notes: 'Lush | Juicy | Sun-ripe',
      label: 'TROPICAL BLAST',
      desc: 'Mango and passion fruit with a pineapple finish. A holiday in 200 ml.' },
    chb: { name: 'Cherry Blast', word: 'CHERRY', code: 'CHB—04 / Blast series', notes: 'Dark | Sweet-tart | Smooth',
      label: 'CHERRY BLAST',
      desc: 'Ripe black cherry with a tart edge. Rich and rounded, with zero sugar.' },
    elb: { name: 'Electric Lemon Blast', word: 'LEMON', code: 'ELB—05 / Blast series', notes: 'Sharp | Electric | Clean',
      label: 'ELECTRIC LEMON BLAST',
      desc: 'Bright, zingy lemon with a sherbet-sharp edge that wakes up your whole palate.' },
    grt: { name: 'Green Tea', word: 'GREEN TEA', code: 'GRT—06 / Tea series', notes: 'Fresh | Grassy | Light',
      label: 'GREEN TEA',
      desc: 'Green-tea flavour with a soft citrus lift. Clean, cool and quietly refreshing — still zero caffeine.' },
    vnt: { name: 'Vanilla Tea', word: 'VANILLA', code: 'VNT—07 / Tea series', notes: 'Creamy | Mellow | Smooth',
      label: 'VANILLA TEA',
      desc: 'Smooth tea notes and warm vanilla. Mellow, rounded and unexpectedly refreshing.' },
    rlt: { name: 'Raspberry Leaf Tea', word: 'RASPBERRY', code: 'RLT—08 / Tea series', notes: 'Floral | Berry | Delicate',
      label: 'RASPBERRY LEAF TEA',
      desc: 'Herbal raspberry-leaf notes with a bright, berry finish. Delicate, floral, different.' }
  };

  var stage = document.getElementById('flavour-stage');
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.picker__btn'));
  var field = function (key) { return stage.querySelector('[data-f="' + key + '"]'); };
  var can = field('can');
  var swapTimer;

  function render(id) {
    var f = FLAVOURS[id];
    ['word', 'code', 'name', 'notes', 'desc', 'label'].forEach(function (k) {
      field(k).textContent = f[k];
    });
    Object.keys(FLAVOURS).forEach(function (key) {
      can.classList.toggle('f-' + key, key === id);
    });
    can.setAttribute('aria-label', 'XS ' + f.name + ' can');
  }

  function select(tab, focus) {
    var id = tab.dataset.flavour;
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    stage.setAttribute('aria-labelledby', tab.id);
    if (focus) tab.focus();

    clearTimeout(swapTimer);
    if (reduceMotion) { render(id); return; }
    can.classList.add('is-swapping');
    swapTimer = setTimeout(function () {
      render(id);
      can.classList.remove('is-swapping');
    }, 220);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(tab, false); });
    tab.addEventListener('keydown', function (e) {
      var next;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        select(next, true);
      }
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Footer year ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
