(() => {
  // ============================================
  // 1. THEME TOGGLE
  // ============================================
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

  function syncThemeIcons(isLight) {
    document.querySelectorAll('.theme-toggle i').forEach((icon) => {
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
    if (persist) localStorage.setItem('theme', isLight ? 'day' : 'night');
  }

  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'day') {
    applyTheme(true, false);
  } else if (storedTheme === 'night') {
    applyTheme(false, false);
  } else {
    applyTheme(prefersLight.matches, false);
    prefersLight.addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) applyTheme(e.matches, false);
    });
  }

  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('light'), true);
    });
  }

  // ============================================
  // 2. NAV SCROLL (blur on scroll)
  // ============================================
  const nav = document.getElementById('nav');
  const heroSection = document.getElementById('hero');

  if (nav && heroSection) {
    const navObserver = new IntersectionObserver(([entry]) => {
      nav.classList.toggle('nav--scrolled', !entry.isIntersecting);
    }, { threshold: 0, rootMargin: '-80px 0px 0px 0px' });
    navObserver.observe(heroSection);
  }

  // ============================================
  // 3. ACTIVE NAV LINK ON SCROLL
  // ============================================
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav__link[data-section]');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    }, { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // ============================================
  // 4. MOBILE NAV TOGGLE
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  if (hamburger && navLinksEl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinksEl.classList.toggle('active');
    });

    navLinksEl.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksEl.classList.remove('active');
      });
    });
  }

  // ============================================
  // 5. SMOOTH SCROLL
  // ============================================
  document.querySelectorAll('.nav__link, .hero__cta a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // 6. SCROLL REVEAL
  // ============================================
  const revealElements = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // ============================================
  // 7. COUNTER ANIMATION
  // ============================================
  const statNumbers = document.querySelectorAll('.stats__number[data-target]');

  if (statNumbers.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'));
          let current = 0;
          const duration = 1500;
          const step = Math.ceil(target / (duration / 30));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = current;
          }, 30);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach((el) => counterObserver.observe(el));
  }

  // ============================================
  // 8. EXPERIENCE EXPAND/COLLAPSE
  // ============================================
  document.querySelectorAll('.timeline__toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.timeline__entry');
      const details = card.querySelector('.timeline__details');
      const isExpanded = details.classList.toggle('expanded');
      btn.classList.toggle('active', isExpanded);

      const lang = localStorage.getItem('preferredLanguage') || 'es';
      const span = btn.querySelector('span');
      if (isExpanded) {
        span.textContent = lang === 'en' ? 'Show less' : 'Ver menos';
      } else {
        span.textContent = lang === 'en' ? 'Show more' : 'Ver mas';
      }
    });
  });

  // ============================================
  // 9. FLUID BACKGROUND (subtle, optional)
  // ============================================
  const fluidCanvas = document.getElementById('fluidBg');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (fluidCanvas && !prefersReduced && hasFinePointer && typeof FluidSimulation !== 'undefined') {
    fluidCanvas.width = window.innerWidth;
    fluidCanvas.height = window.innerHeight;
    fluidCanvas.style.display = 'block';
    try {
      FluidSimulation.start(fluidCanvas);
    } catch (e) { /* graceful fallback */ }

    window.addEventListener('resize', () => {
      fluidCanvas.width = window.innerWidth;
      fluidCanvas.height = window.innerHeight;
    });
  }

  // ============================================
  // 10. FOOTER COPYRIGHT
  // ============================================
  const copyright = document.querySelector('.footer__copy');
  if (copyright) {
    const year = new Date().getFullYear();
    copyright.textContent = `\u00A9 ${year} Jesus Gerardo Garza Garcia. Todos los derechos reservados.`;
  }
})();
