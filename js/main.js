/* ============================================================
   MAIN — theme, scroll spy, smooth scroll, reveals, counters
   ============================================================ */

(function () {

  /* ── Color scheme (theme toggle + multiple schemes) ───── */
  const SCHEME_KEY = 'colorscheme';
  const LIGHT_SCHEMES = ['light', 'solarized'];
  const themeBtn = document.getElementById('themeToggle');

  function applyScheme(scheme) {
    document.documentElement.setAttribute('data-theme', scheme);
    document.body.classList.toggle('light', LIGHT_SCHEMES.includes(scheme));
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', LIGHT_SCHEMES.includes(scheme) ? 'true' : 'false');
    }
    document.querySelectorAll('.scheme[data-scheme]').forEach(el => {
      el.classList.toggle('is-active', el.dataset.scheme === scheme);
    });
    window.__currentScheme = scheme;
  }

  function getStoredScheme() {
    const v = localStorage.getItem(SCHEME_KEY);
    if (v) return v;
    // legacy: fall back to old "theme" key
    const legacy = localStorage.getItem('theme');
    if (legacy === 'light' || legacy === 'dark') return legacy;
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setScheme(name) {
    applyScheme(name);
    localStorage.setItem(SCHEME_KEY, name);
  }

  applyScheme(getStoredScheme());

  // Toggle button: cycles dark <-> light (most common case)
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const cur = window.__currentScheme || 'dark';
      const next = LIGHT_SCHEMES.includes(cur) ? 'dark' : 'light';
      setScheme(next);
    });
  }

  // Bind scheme picker buttons
  document.querySelectorAll('.scheme[data-scheme]').forEach(btn => {
    btn.addEventListener('click', () => {
      setScheme(btn.dataset.scheme);
    });
  });

  // Expose API for terminal.js
  window.scheme = { set: setScheme, get: () => window.__currentScheme };

  /* ── Smooth scroll (offset for sticky topbar) ──────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile sidebar if open
      if (document.body.classList.contains('sidebar-open')) closeSidebar();
    });
  });

  /* ── Scroll spy for sidebar commands ───────────────────── */
  const cmds = document.querySelectorAll('.cmd[data-section]');
  const sections = Array.from(cmds).map(c => document.getElementById(c.dataset.section)).filter(Boolean);

  function spy() {
    let activeId = sections[0]?.id;
    const offset = 140;
    sections.forEach(s => {
      if (s.getBoundingClientRect().top <= offset) activeId = s.id;
    });
    cmds.forEach(c => c.classList.toggle('is-active', c.dataset.section === activeId));
  }
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ── Reveal on scroll (IntersectionObserver) ───────────── */
  const reveals = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ── Counters (about stats) ────────────────────────────── */
  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const dur = 1200;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const counters = document.querySelectorAll('.stat__num[data-target]');
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCount(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => cio.observe(el));
  }

  /* ── Tree expand toggle ────────────────────────────────── */
  document.querySelectorAll('.tree__expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.target;
      const el = id && document.getElementById(id);
      if (!el) return;
      const open = el.classList.toggle('is-open');
      const span = btn.querySelector('span:first-child');
      const arrow = btn.querySelector('span[aria-hidden]');
      if (window.i18n) {
        const key = open ? 'show_less' : 'show_more';
        const txt = window.i18n.t(key);
        if (txt && span) span.textContent = txt;
      }
      if (arrow) arrow.textContent = open ? '▴' : '▾';
    });
  });

  /* ── ls group expand ───────────────────────────────────── */
  document.querySelectorAll('.ls__group-head').forEach(head => {
    head.addEventListener('click', () => {
      const group = head.closest('.ls__group');
      if (!group) return;
      const open = group.classList.toggle('is-open');
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
      const icon = head.querySelector('.ls__group-icon');
      if (icon) icon.textContent = open ? '▾' : '▸';
    });
  });

  // Open the first ls__group by default on desktop
  if (window.matchMedia('(min-width: 768px)').matches) {
    document.querySelector('.ls__group')?.classList.add('is-open');
    const firstHead = document.querySelector('.ls__group-head');
    if (firstHead) {
      firstHead.setAttribute('aria-expanded', 'true');
      const icon = firstHead.querySelector('.ls__group-icon');
      if (icon) icon.textContent = '▾';
    }
  }

  /* ── GitHub activity (last public push) ────────────────── */
  const ghEl = document.getElementById('ghLastPush');
  function relTime(iso) {
    const d = new Date(iso);
    const diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 60)        return Math.round(diff) + 's ago';
    if (diff < 3600)      return Math.round(diff / 60) + 'm ago';
    if (diff < 86400)     return Math.round(diff / 3600) + 'h ago';
    if (diff < 604800)    return Math.round(diff / 86400) + 'd ago';
    return Math.round(diff / 604800) + 'w ago';
  }
  function loadGitHub() {
    if (!ghEl) return;
    fetch('https://api.github.com/users/jesusgarzag/events/public?per_page=30', {
      headers: { 'Accept': 'application/vnd.github+json' }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(events => {
        const push = events.find(e => e.type === 'PushEvent');
        if (!push) {
          const any = events[0];
          if (!any) throw new Error('no events');
          ghEl.innerHTML = `<a href="https://github.com/${any.actor.login}" target="_blank" rel="noopener">${relTime(any.created_at)} · ${any.type.replace('Event','').toLowerCase()} on ${any.repo.name}</a>`;
          return;
        }
        const repo = push.repo.name;
        const repoShort = repo.split('/')[1] || repo;
        const time = relTime(push.created_at);
        ghEl.innerHTML = `<a href="https://github.com/${repo}" target="_blank" rel="noopener">${time} · ${repoShort}</a>`;
      })
      .catch(() => {
        ghEl.innerHTML = '<a href="https://github.com/jesusgarzag" target="_blank" rel="noopener">github.com/jesusgarzag</a>';
      });
  }
  loadGitHub();

  /* ── PWA service worker (cache-first shell) ────────────── */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
  }

  /* ── Mobile sidebar drawer ─────────────────────────────── */
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function openSidebar() {
    sidebar?.classList.add('is-open');
    sidebarBackdrop?.classList.add('is-open');
    document.body.classList.add('sidebar-open');
    sidebarToggle?.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebar?.classList.remove('is-open');
    sidebarBackdrop?.classList.remove('is-open');
    document.body.classList.remove('sidebar-open');
    sidebarToggle?.setAttribute('aria-expanded', 'false');
  }
  function toggleSidebar() {
    if (sidebar?.classList.contains('is-open')) closeSidebar();
    else openSidebar();
  }

  if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

  // Close drawer on Esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sidebar?.classList.contains('is-open')) closeSidebar();
  });

})();
