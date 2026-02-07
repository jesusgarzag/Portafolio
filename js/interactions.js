(() => {
  // ============================================
  // COUNTER ANIMATION (Stats)
  // ============================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

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
  // REVEAL ON SCROLL
  // ============================================
  const revealItems = document.querySelectorAll(
    '.experience-card, .project-card, .skills-group, .education-card, ' +
    '.cert-card, .recognition-card, .testimonial-card, .content-text, ' +
    '.stats-row, .section-heading, .subsection-heading, .contact-links, .contact-form'
  );

  revealItems.forEach((el) => el.classList.add('reveal-item'));

  if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach((el) => revealObserver.observe(el));
  }

  // ============================================
  // EXPERIENCE EXPAND/COLLAPSE
  // ============================================
  document.querySelectorAll('.expand-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.exp-content') || btn.closest('.experience-card');
      const details = card.querySelector('.exp-details');
      const isExpanded = details.classList.toggle('expanded');
      btn.classList.toggle('active', isExpanded);

      const lang = localStorage.getItem('preferredLanguage') || 'es';
      const span = btn.querySelector('span');
      if (isExpanded) {
        span.textContent = lang === 'en' ? 'Show less' : 'Ver menos';
      } else {
        span.textContent = lang === 'en' ? 'Show more' : 'Ver más';
      }
    });
  });
})();
