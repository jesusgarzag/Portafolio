// ============================================
// LOADING SCREEN
// ============================================
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
  }, 2000);
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = scrollPercent + '%';
});

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

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// ============================================
// COUNTER ANIMATION (Stats)
// ============================================
const statNumbers = document.querySelectorAll('.stat-number[data-target]');

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

// ============================================
// REVEAL ON SCROLL
// ============================================
const revealItems = document.querySelectorAll(
  '.experience-card, .project-card, .skills-group, .education-card, ' +
  '.cert-card, .recognition-card, .testimonial-card, .content-text, ' +
  '.stats-row, .section-heading, .subsection-heading, .contact-links, .contact-form'
);

revealItems.forEach((el) => el.classList.add('reveal-item'));

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

// ============================================
// THEME TOGGLE
// ============================================
function setupThemeToggle(toggleEl) {
  if (!toggleEl) return;
  const icon = toggleEl.querySelector('i');
  const body = document.body;

  toggleEl.addEventListener('click', () => {
    const isLight = body.classList.toggle('light');
    // Sync all theme icons
    document.querySelectorAll('.theme-btn i').forEach((i) => {
      if (isLight) {
        i.classList.replace('fa-sun', 'fa-moon');
      } else {
        i.classList.replace('fa-moon', 'fa-sun');
      }
    });
    localStorage.setItem('theme', isLight ? 'day' : 'night');
  });
}

// Initialize theme
const currentTheme = localStorage.getItem('theme') || 'night';
if (currentTheme === 'day') {
  document.body.classList.add('light');
  document.querySelectorAll('.theme-btn i').forEach((i) => {
    i.classList.replace('fa-sun', 'fa-moon');
  });
}

setupThemeToggle(document.getElementById('themeToggle'));
setupThemeToggle(document.getElementById('themeToggleMobile'));

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
// SPOTLIGHT EFFECT (follows cursor on right panel)
// ============================================
const panelRight = document.getElementById('panelRight');

if (panelRight && window.innerWidth > 768) {
  panelRight.addEventListener('mousemove', (e) => {
    const rect = panelRight.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    panelRight.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(16, 185, 129, 0.03), transparent 40%)`;
  });

  panelRight.addEventListener('mouseleave', () => {
    panelRight.style.background = '';
  });
}

// ============================================
// MAGIC PORTAL — Wormhole Canvas + Interactions
// ============================================
const portalTrigger = document.getElementById('portalTrigger');
const portalExpanded = document.getElementById('portalExpanded');
const portalClose = document.getElementById('portalClose');
const portalCanvas = document.getElementById('portalCanvas');

let portalAnimationId = null;

// Wormhole / starfield animation on canvas
function initWormhole(canvas) {
  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const cx = () => w / 2;
  const cy = () => h / 2;

  const stars = [];
  const STAR_COUNT = 300;
  const SPEED = 8;

  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: (Math.random() - 0.5) * w * 2,
      y: (Math.random() - 0.5) * h * 2,
      z: Math.random() * w,
      pz: 0,
      hue: 160 + Math.random() * 40
    });
  }

  function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);

  function draw() {
    // Fade trail
    ctx.fillStyle = 'rgba(5, 5, 8, 0.25)';
    ctx.fillRect(0, 0, w, h);

    for (const star of stars) {
      star.pz = star.z;
      star.z -= SPEED;

      if (star.z <= 0) {
        star.x = (Math.random() - 0.5) * w * 2;
        star.y = (Math.random() - 0.5) * h * 2;
        star.z = w;
        star.pz = w;
        star.hue = 160 + Math.random() * 40;
      }

      // Project
      const sx = (star.x / star.z) * (w / 2) + cx();
      const sy = (star.y / star.z) * (h / 2) + cy();
      const px = (star.x / star.pz) * (w / 2) + cx();
      const py = (star.y / star.pz) * (h / 2) + cy();

      // Size and brightness based on depth
      const size = Math.max(0.5, (1 - star.z / w) * 3);
      const alpha = Math.max(0, (1 - star.z / w) * 0.9);

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = `hsla(${star.hue}, 80%, 70%, ${alpha})`;
      ctx.lineWidth = size;
      ctx.stroke();

      // Star glow dot
      ctx.beginPath();
      ctx.arc(sx, sy, size * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${star.hue}, 90%, 80%, ${alpha})`;
      ctx.fill();
    }

    // Center glow (wormhole mouth)
    const gradient = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), 200);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.06)');
    gradient.addColorStop(0.4, 'rgba(16, 185, 129, 0.02)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Concentric rings
    for (let i = 1; i <= 4; i++) {
      const radius = 60 + i * 50 + Math.sin(Date.now() * 0.001 + i) * 15;
      ctx.beginPath();
      ctx.arc(cx(), cy(), radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(16, 185, 129, ${0.05 - i * 0.01})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    portalAnimationId = requestAnimationFrame(draw);
  }

  // Clear canvas initially
  ctx.fillStyle = 'rgb(5, 5, 8)';
  ctx.fillRect(0, 0, w, h);

  draw();

  return () => {
    if (portalAnimationId) {
      cancelAnimationFrame(portalAnimationId);
      portalAnimationId = null;
    }
  };
}

let stopWormhole = null;

if (portalTrigger && portalExpanded) {
  const lang = localStorage.getItem('preferredLanguage') || 'es';
  portalTrigger.setAttribute('data-tooltip', lang === 'en' ? 'Explore projects' : 'Explorar proyectos');

  portalTrigger.addEventListener('click', () => {
    portalExpanded.classList.add('active');
    document.body.classList.add('portal-open');
    document.body.style.overflow = 'hidden';
    // Start wormhole animation
    if (portalCanvas && !stopWormhole) {
      stopWormhole = initWormhole(portalCanvas);
    }
  });

  function closePortal() {
    portalExpanded.classList.remove('active');
    document.body.classList.remove('portal-open');
    document.body.style.overflow = '';
    // Stop wormhole animation after transition
    setTimeout(() => {
      if (stopWormhole) {
        stopWormhole();
        stopWormhole = null;
      }
    }, 700);
  }

  portalClose.addEventListener('click', closePortal);

  portalExpanded.addEventListener('click', (e) => {
    if (e.target === portalExpanded || e.target === portalCanvas || e.target.classList.contains('portal-mask')) {
      closePortal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && portalExpanded.classList.contains('active')) {
      closePortal();
    }
  });
}
