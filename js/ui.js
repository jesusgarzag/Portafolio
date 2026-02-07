(() => {
  // ============================================
  // LOADING SCREEN
  // ============================================
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;

    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 2000);
  });

  // ============================================
  // SCROLL PROGRESS BAR
  // ============================================
  const scrollProgress = document.getElementById('scrollProgress');

  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = scrollPercent + '%';
    });
  }

  // ============================================
  // ACTIVE NAV ON SCROLL (Brittany Chiang style)
  // ============================================
  const sections = document.querySelectorAll('.content-section');
  const panelNavLinks = document.querySelectorAll('.panel-nav-link');

  function updateActiveNav() {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 200;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionBottom) {
        current = section.getAttribute('id');
      }
    });

    panelNavLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  }

  if (sections.length && panelNavLinks.length) {
    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);
  }

  // ============================================
  // MOBILE NAV
  // ============================================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('active');
      hamburger.innerHTML = isOpen
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    document.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR NAV LINKS
  // ============================================
  document.querySelectorAll('.panel-nav-link, .mobile-nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
