(() => {
  // ============================================
  // THEME TOGGLE
  // ============================================
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

  function syncThemeIcons(isLight) {
    document.querySelectorAll('.theme-btn i').forEach((icon) => {
      if (isLight) {
        icon.classList.replace('fa-sun', 'fa-moon');
      } else {
        icon.classList.replace('fa-moon', 'fa-sun');
      }
    });
  }

  function applyTheme(isLight, persist) {
    document.body.classList.toggle('light', isLight);
    syncThemeIcons(isLight);
    if (persist) {
      localStorage.setItem('theme', isLight ? 'day' : 'night');
    }
  }

  function setupThemeToggle(toggleEl) {
    if (!toggleEl) return;
    toggleEl.addEventListener('click', () => {
      const isLight = !document.body.classList.contains('light');
      applyTheme(isLight, true);
    });
  }

  // Initialize theme
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'day') {
    applyTheme(true, false);
  } else if (storedTheme === 'night') {
    applyTheme(false, false);
  } else {
    // If no user choice, use browser preference; default to dark otherwise
    applyTheme(prefersLight.matches, false);

    prefersLight.addEventListener('change', (event) => {
      const hasStored = localStorage.getItem('theme');
      if (!hasStored) {
        applyTheme(event.matches, false);
      }
    });
  }

  setupThemeToggle(document.getElementById('themeToggle'));
  setupThemeToggle(document.getElementById('themeToggleMobile'));
  setupThemeToggle(document.getElementById('themeToggleDimension'));
})();
