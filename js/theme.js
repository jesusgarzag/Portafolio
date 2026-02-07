(() => {
  // ============================================
  // THEME TOGGLE
  // ============================================
  function setupThemeToggle(toggleEl) {
    if (!toggleEl) return;
    const body = document.body;

    toggleEl.addEventListener('click', () => {
      const isLight = body.classList.toggle('light');
      // Sync all theme icons
      document.querySelectorAll('.theme-btn i').forEach((icon) => {
        if (isLight) {
          icon.classList.replace('fa-sun', 'fa-moon');
        } else {
          icon.classList.replace('fa-moon', 'fa-sun');
        }
      });
      localStorage.setItem('theme', isLight ? 'day' : 'night');
    });
  }

  // Initialize theme
  const currentTheme = localStorage.getItem('theme') || 'night';
  if (currentTheme === 'day') {
    document.body.classList.add('light');
    document.querySelectorAll('.theme-btn i').forEach((icon) => {
      icon.classList.replace('fa-sun', 'fa-moon');
    });
  }

  setupThemeToggle(document.getElementById('themeToggle'));
  setupThemeToggle(document.getElementById('themeToggleMobile'));
})();
