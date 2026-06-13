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

  /* ── now_working: módulo al azar en cada carga ─────────── */
  // Lista de trabajo real (ES/EN). Se elige uno por carga y se respeta el idioma.
  const NOW_WORKING = [
    { es: 'módulo IMSS/SUA · Recavisa',                          en: 'IMSS/SUA module · Recavisa' },
    { es: 'cálculo de PTU · Avalia',                             en: 'profit-sharing (PTU) · Avalia' },
    { es: 'timbrado de nómina en paralelo · Avalia',            en: 'parallel payroll stamping · Avalia' },
    { es: 'corrección de tipo de cambio Banxico/DOF · Avalia',  en: 'Banxico/DOF rate fix · Avalia' },
    { es: 'reportes SAT XML (Complementario) · Avalia',         en: 'SAT XML reports (Complementary) · Avalia' },
    { es: 'sincronización de cancelación intercompañía · Avalia', en: 'intercompany cancellation sync · Avalia' },
    { es: 'conciliación bancaria · Avalia',                     en: 'bank reconciliation · Avalia' },
    { es: 'recepción masiva de series/lotes · Interenter',     en: 'bulk serial/lot reception · Interenter' },
    { es: 'reporte dinámico de nómina · Casa Guerra',          en: 'dynamic payroll report · Casa Guerra' },
  ];
  const nowIdx = Math.floor(Math.random() * NOW_WORKING.length);
  function applyNowWorking() {
    const el = document.querySelector('.sidebar__working-val');
    if (!el) return;
    const lang = (window.i18n && window.i18n.current) || 'es';
    el.textContent = NOW_WORKING[nowIdx][lang] || NOW_WORKING[nowIdx].es;
  }
  applyNowWorking();
  // Re-aplica al cambiar de idioma (i18n.js emite este evento tras traducir).
  document.addEventListener('i18n:applied', applyNowWorking);

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

  // Todos los grupos de módulos arrancan colapsados (el usuario los abre con clic).

  /* ── Live clock (Monterrey, UTC-6) ─────────────────────── */
  const clockEl = document.getElementById('topbarClock');
  if (clockEl) {
    const fmt = new Intl.DateTimeFormat('es-MX', {
      timeZone: 'America/Monterrey',
      hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    function tickClock() {
      const parts = fmt.formatToParts(new Date());
      const get = t => parts.find(p => p.type === t)?.value;
      const date = `${get('year')}-${get('month')}-${get('day')}`;
      const time = `${get('hour')}:${get('minute')}:${get('second')}`;
      clockEl.textContent = `${date} ${time} CST`;
    }
    tickClock();
    setInterval(tickClock, 1000);
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

  /* ── GitHub contribution heatmap (last 12 months) ──────── */
  const contribGrid = document.getElementById('contribGrid');
  const contribTotal = document.getElementById('contribTotal');
  if (contribGrid) {
    fetch('https://github-contributions-api.jogruber.de/v4/jesusgarzag?y=last')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const days = data.contributions || [];
        if (!days.length) throw new Error('empty');
        // Render columns of 7 rows (Sun → Sat). Pad start so each column starts on Sunday.
        const startDow = new Date(days[0].date).getDay();
        const padded = Array(startDow).fill(null).concat(days);
        contribGrid.innerHTML = '';
        padded.forEach((d, i) => {
          const cell = document.createElement('span');
          cell.className = 'contrib__cell';
          if (d) {
            cell.dataset.level = d.level || 0;
            cell.title = `${d.count} contributions on ${d.date}`;
          } else {
            cell.dataset.level = 0;
            cell.style.visibility = 'hidden';
          }
          contribGrid.appendChild(cell);
        });
        if (contribTotal) {
          contribTotal.textContent = `${data.total?.lastYear || days.reduce((a, b) => a + (b.count||0), 0)} contributions`;
        }
      })
      .catch(() => {
        if (contribTotal) contribTotal.textContent = 'github.com/jesusgarzag';
        // Render an empty grid so the layout doesn't collapse
        for (let i = 0; i < 53 * 7; i++) {
          const c = document.createElement('span');
          c.className = 'contrib__cell';
          c.dataset.level = '0';
          contribGrid.appendChild(c);
        }
      });
  }

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
  if (sidebarBackdrop) {
    // pointerdown is more reliable than click on touch devices
    sidebarBackdrop.addEventListener('pointerdown', closeSidebar);
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  // Close drawer on Esc
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && sidebar?.classList.contains('is-open')) closeSidebar();
  });

})();
