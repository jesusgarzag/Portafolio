/* ============================================================
   i18n — language switcher (ES / EN) with JSON dictionaries
   Reads/writes data-i18n attributes; persists in localStorage.
   ============================================================ */

(function () {
  const STORAGE_KEY = 'preferredLanguage';
  const DEFAULT = 'es';
  const SUPPORTED = ['es', 'en'];

  const cache = {};

  function getStored() {
    const v = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED.includes(v) ? v : DEFAULT;
  }

  function load(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch(`i18n/${lang}.json`)
      .then(r => r.json())
      .then(dict => { cache[lang] = dict; return dict; });
  }

  function applyDict(dict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = dict[key];
      if (val == null) return;
      // input/textarea: set placeholder if applicable
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        if (el.placeholder !== undefined) el.placeholder = val;
        else el.value = val;
      } else {
        el.innerHTML = val;
      }
    });
    // copyright
    const cp = document.getElementById('copyright');
    if (cp && dict.rights) {
      cp.textContent = dict.rights.replace('{year}', new Date().getFullYear());
    }
    // CV link
    const cv = document.getElementById('btnCv');
    if (cv) cv.setAttribute('href', `assets/cv_${currentLang}.pdf`);
    // html lang attr
    document.documentElement.lang = currentLang;
  }

  let currentLang = getStored();

  function setLang(lang, persist = true) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT;
    currentLang = lang;
    if (persist) localStorage.setItem(STORAGE_KEY, lang);

    document.querySelectorAll('[data-lang]').forEach(btn => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    return load(lang).then(applyDict);
  }

  // Bind language buttons
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-lang]');
    if (!btn) return;
    e.preventDefault();
    setLang(btn.dataset.lang);
  });

  // Public API
  window.i18n = {
    get current() { return currentLang; },
    set: setLang,
    t(key) {
      return cache[currentLang] ? cache[currentLang][key] : null;
    }
  };

  // Initial load
  setLang(currentLang, false);
})();
