const I18N_FILES = {
  es: 'i18n/es.json',
  en: 'i18n/en.json'
};

const i18nCache = new Map();

async function loadTranslations(lang) {
  const normalized = I18N_FILES[lang] ? lang : 'es';
  if (i18nCache.has(normalized)) {
    return i18nCache.get(normalized);
  }

  const response = await fetch(I18N_FILES[normalized], { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`Failed to load i18n for ${normalized}`);
  }

  const data = await response.json();
  i18nCache.set(normalized, data);
  return data;
}

function applyTranslations(lang, translations) {
  document.documentElement.lang = lang;
  localStorage.setItem('preferredLanguage', lang);

  document.querySelectorAll('.language-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  const year = String(new Date().getFullYear());

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!translations[key]) return;
    const value = translations[key].replace('{year}', year);
    el.textContent = value;
  });

  // Update portal tooltip
  const portalTrigger = document.getElementById('portalTrigger');
  if (portalTrigger) {
    const tooltip = translations.portal_title || (lang === 'en' ? 'Parallel dimension' : 'Dimensión paralela');
    portalTrigger.setAttribute('data-tooltip', tooltip);
  }

  // Update CV download links
  const cvFile = lang === 'en' ? 'assets/certificados/cv_en.pdf' : 'assets/certificados/cv_es.pdf';
  document.querySelectorAll('.btn-cv').forEach((btn) => {
    btn.href = cvFile;
  });

  // Update expand/collapse buttons
  document.querySelectorAll('.expand-toggle').forEach((btn) => {
    const span = btn.querySelector('span');
    if (!span) return;
    const isExpanded = btn.classList.contains('active');
    span.textContent = isExpanded ? translations.show_less : translations.show_more;
  });
}

async function changeLanguage(lang) {
  const normalized = I18N_FILES[lang] ? lang : 'es';

  try {
    const translations = await loadTranslations(normalized);
    applyTranslations(normalized, translations);

    const secondary = normalized === 'es' ? 'en' : 'es';
    loadTranslations(secondary).catch(() => {});
  } catch (error) {
    if (normalized !== 'es') {
      const fallback = await loadTranslations('es');
      applyTranslations('es', fallback);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const preferredLanguage = localStorage.getItem('preferredLanguage') || 'es';
  changeLanguage(preferredLanguage);

  document.querySelectorAll('.language-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      changeLanguage(btn.dataset.lang);
    });
  });
});
