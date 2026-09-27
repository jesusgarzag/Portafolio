(function () {
  var KEY = 'preferredLanguage';
  var SUPPORTED = ['es', 'en'];
  var cache = {};
  var current = 'es';

  function initial() {
    try {
      var v = localStorage.getItem(KEY);
      if (SUPPORTED.indexOf(v) >= 0) return v;
    } catch (e) {}
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || 'es';
    return /^en/i.test(nav) ? 'en' : 'es';
  }

  function load(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch('i18n/' + lang + '.json')
      .then(function (r) {
        if (!r.ok) throw new Error('i18n ' + r.status);
        return r.json();
      })
      .then(function (d) {
        cache[lang] = d;
        return d;
      });
  }

  function apply(dict) {
    document.dispatchEvent(new CustomEvent('i18n:before', { detail: { lang: current } }));
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = dict[el.getAttribute('data-i18n')];
      if (v != null && el.innerHTML !== v) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var p = pair.split(':');
        var attr = (p[0] || '').trim();
        var k = (p[1] || '').trim();
        if (attr && k && dict[k] != null) el.setAttribute(attr, dict[k]);
      });
    });
    if (dict.doc_title) document.title = dict.doc_title;
    var md = document.querySelector('meta[name="description"]');
    if (md && dict.doc_desc) md.setAttribute('content', dict.doc_desc);
    document.documentElement.lang = current;
    document.querySelectorAll('[data-cv]').forEach(function (a) {
      a.setAttribute('href', 'assets/certificados/cv_' + current + '.pdf');
    });
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === current ? 'true' : 'false');
    });
  }

  function set(lang, persist) {
    if (SUPPORTED.indexOf(lang) < 0) lang = 'es';
    current = lang;
    if (persist) {
      try { localStorage.setItem(KEY, lang); } catch (e) {}
    }
    return load(lang)
      .then(function (d) { apply(d); })
      .catch(function () {})
      .then(function () {
        document.dispatchEvent(new CustomEvent('i18n:applied', { detail: { lang: current } }));
      });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lang]');
    if (!b) return;
    e.preventDefault();
    if (b.getAttribute('data-lang') !== current) set(b.getAttribute('data-lang'), true);
  });

  window.i18n = {
    get current() { return current; },
    set: function (l) { return set(l, true); },
    t: function (k) {
      var d = cache[current];
      return d && d[k] != null ? d[k] : null;
    },
    ready: null
  };

  function start() {
    var first = initial();
    window.i18n.ready = first === 'es'
      ? load('es').then(function () { current = 'es'; apply(cache.es); }).catch(function () {})
      : set(first, false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
