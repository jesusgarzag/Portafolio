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

  // ============================================
  // MOBILE PROJECTS CAROUSEL (centered, looping)
  // ============================================
  function setupProjectsCarousel() {
    const list = document.querySelector('.projects-list');
    if (!list) return;

    if (typeof list._carouselCleanup === 'function') {
      list._carouselCleanup();
    }

    const originalCards = Array.from(list.querySelectorAll('.project-card'));
    if (originalCards.length < 2) return;

    const beforeFragment = document.createDocumentFragment();
    const afterFragment = document.createDocumentFragment();
    originalCards.forEach((card) => {
      const beforeClone = card.cloneNode(true);
      beforeClone.classList.add('project-clone');
      beforeFragment.appendChild(beforeClone);

      const afterClone = card.cloneNode(true);
      afterClone.classList.add('project-clone');
      afterFragment.appendChild(afterClone);
    });

    list.insertBefore(beforeFragment, originalCards[0]);
    list.appendChild(afterFragment);
    list.dataset.carouselReady = 'true';

    const allCards = Array.from(list.querySelectorAll('.project-card'));
    let setWidth = 0;
    let startOffset = 0;
    let endOffset = 0;
    let isAdjusting = false;

    function getGap() {
      const styles = getComputedStyle(list);
      const gap = parseFloat(styles.columnGap || styles.gap || '0');
      return Number.isNaN(gap) ? 0 : gap;
    }

    function updateMetrics() {
      const gap = getGap();
      setWidth = originalCards.reduce((sum, card) => sum + card.offsetWidth, 0);
      if (originalCards.length > 1) {
        setWidth += gap * (originalCards.length - 1);
      }
      startOffset = setWidth;
      endOffset = startOffset + setWidth;
    }

    function centerOffset(card) {
      return card.offsetLeft - (list.clientWidth - card.clientWidth) / 2;
    }

    function snapToCard(card) {
      list.scrollTo({ left: centerOffset(card), behavior: 'auto' });
    }

    function adjustLoop() {
      if (isAdjusting || setWidth === 0) return;
      const threshold = setWidth * 0.15;

      if (list.scrollLeft < startOffset - threshold) {
        isAdjusting = true;
        list.classList.add('is-adjusting');
        list.scrollLeft += setWidth;
        requestAnimationFrame(() => {
          list.classList.remove('is-adjusting');
          isAdjusting = false;
        });
        return;
      }

      if (list.scrollLeft > endOffset + threshold) {
        isAdjusting = true;
        list.classList.add('is-adjusting');
        list.scrollLeft -= setWidth;
        requestAnimationFrame(() => {
          list.classList.remove('is-adjusting');
          isAdjusting = false;
        });
      }
    }

    requestAnimationFrame(() => {
      updateMetrics();
      snapToCard(originalCards[0]);
    });

    const controller = new AbortController();
    const signal = controller.signal;
    let scrollTimeout = null;
    let isPointerDown = false;

    list.addEventListener('touchstart', () => {
      isPointerDown = true;
    }, { passive: true, signal });

    list.addEventListener('touchend', () => {
      isPointerDown = false;
      adjustLoop();
    }, { passive: true, signal });

    list.addEventListener('mousedown', () => {
      isPointerDown = true;
    }, { signal });

    list.addEventListener('mouseup', () => {
      isPointerDown = false;
      adjustLoop();
    }, { signal });

    list.addEventListener('scroll', () => {
      if (isPointerDown) return;
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        adjustLoop();
      }, 120);
    }, { passive: true, signal });

    if ('onscrollend' in window) {
      list.addEventListener('scrollend', () => {
        if (!isPointerDown) {
          adjustLoop();
        }
      }, { signal });
    }

    window.addEventListener('resize', () => {
      const active = allCards.find((card) => !card.classList.contains('project-clone')) || originalCards[0];
      updateMetrics();
      snapToCard(active);
    }, { signal });

    list._carouselCleanup = () => {
      controller.abort();
      list.classList.remove('is-adjusting');
      list.querySelectorAll('.project-clone').forEach((clone) => clone.remove());
      delete list.dataset.carouselReady;
      list.scrollLeft = 0;
    };
  }

  function teardownProjectsCarousel() {
    const list = document.querySelector('.projects-list');
    if (!list) return;
    if (typeof list._carouselCleanup === 'function') {
      list._carouselCleanup();
      list._carouselCleanup = null;
    }
  }

  const projectsMedia = window.matchMedia('(max-width: 768px)');
  const handleProjectsMedia = () => {
    if (projectsMedia.matches) {
      setupProjectsCarousel();
    } else {
      teardownProjectsCarousel();
    }
  };

  handleProjectsMedia();
  projectsMedia.addEventListener('change', handleProjectsMedia);
})();
