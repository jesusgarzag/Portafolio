/* ============================================================
   TERMINAL — typing effect, command palette, status bar updates
   ============================================================ */

(function () {

  /* ── Typing effect (hero whoami) ──────────────────────── */
  function typeOnce(el) {
    const text = el.dataset.typed || el.textContent;
    if (!text) return;
    el.textContent = '';
    el.classList.remove('is-done');
    let i = 0;
    const speed = 55;
    const tick = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speed + Math.random() * 35);
      } else {
        setTimeout(() => el.classList.add('is-done'), 1400);
      }
    };
    tick();
  }

  function initTyping() {
    document.querySelectorAll('.typed[data-typed]').forEach(typeOnce);
  }

  /* ── Status bar (vim-like) ────────────────────────────── */
  const STATUS = {
    mode:   document.getElementById('statusMode'),
    file:   document.getElementById('statusFile'),
    line:   document.getElementById('statusLine'),
    pct:    document.getElementById('statusPct'),
  };

  const FILE_BY_SECTION = {
    top:        'portfolio.md',
    about:      'about.md',
    experience: 'experience/',
    modules:    'modules/odoo/',
    projects:   'projects.json',
    skills:     'skills.list',
    education:  'education.man',
    contact:    'mail.draft',
  };

  function updateStatus() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    const pct = Math.min(100, Math.round((scrollTop / max) * 100));
    if (STATUS.pct) STATUS.pct.textContent = pct + '%';

    // approximate line/col by section
    const sections = document.querySelectorAll('main section');
    let activeId = 'top';
    let idx = 0;
    sections.forEach((s, i) => {
      const top = s.getBoundingClientRect().top;
      if (top <= 120) { activeId = s.id; idx = i; }
    });

    if (STATUS.line) STATUS.line.textContent = `ln ${idx + 1}, col ${pct}`;
    if (STATUS.file) STATUS.file.textContent = FILE_BY_SECTION[activeId] || 'portfolio.md';
  }

  function setMode(text) {
    if (STATUS.mode) STATUS.mode.textContent = text;
  }

  /* ── Command palette ──────────────────────────────────── */
  const PALETTE_COMMANDS = [
    { cmd: 'cat about.md',          desc_key: 'cmd_about',     target: '#about' },
    { cmd: 'tree experience/',      desc_key: 'cmd_experience', target: '#experience' },
    { cmd: 'ls -la modules/',       desc_key: 'cmd_modules',    target: '#modules' },
    { cmd: 'cat projects.json',     desc_key: 'cmd_projects',   target: '#projects' },
    { cmd: 'pacman -Qq tech',       desc_key: 'cmd_skills',     target: '#skills' },
    { cmd: 'man certifications',    desc_key: 'cmd_education',  target: '#education' },
    { cmd: 'mail jesus',            desc_key: 'cmd_contact',    target: '#contact' },
    { cmd: ':set background=toggle', desc_key: 'cmd_theme',     action: 'theme' },
    { cmd: 'LANG=es_MX.UTF-8',      desc_key: 'cmd_lang_es',    action: 'lang:es' },
    { cmd: 'LANG=en_US.UTF-8',      desc_key: 'cmd_lang_en',    action: 'lang:en' },
    { cmd: 'wget cv.pdf',           desc_key: 'cmd_cv',         action: 'cv' },
    { cmd: 'gh repo open',          desc_key: 'cmd_github',     href: 'https://github.com/jesusgarzag' },
    { cmd: 'mailto:',               desc_key: 'cmd_mail',       href: 'mailto:jesusgarzacia@hotmail.com' },
    { cmd: 'git branch -v',         desc_key: 'cmd_branches',   action: 'branches' },
  ];

  const palette       = document.getElementById('palette');
  const paletteInput  = document.getElementById('paletteInput');
  const paletteList   = document.getElementById('paletteList');
  const paletteOpen   = document.getElementById('paletteOpen');

  let paletteFiltered = PALETTE_COMMANDS.slice();
  let paletteIndex = 0;

  function describe(cmd) {
    const dict = (window.i18n && window.i18n.t(cmd.desc_key)) || '';
    return dict;
  }

  function renderPalette() {
    if (!paletteList) return;
    paletteList.innerHTML = '';
    paletteFiltered.forEach((cmd, i) => {
      const item = document.createElement('div');
      item.className = 'palette__item' + (i === paletteIndex ? ' is-active' : '');
      item.innerHTML = `
        <span class="palette__item-cmd">$ ${cmd.cmd}</span>
        <span class="palette__item-desc">${describe(cmd) || ''}</span>
      `;
      item.addEventListener('click', () => {
        paletteIndex = i;
        runActive();
      });
      paletteList.appendChild(item);
    });
  }

  function filterPalette(q) {
    const term = q.toLowerCase().trim();
    paletteFiltered = !term
      ? PALETTE_COMMANDS.slice()
      : PALETTE_COMMANDS.filter(c =>
          c.cmd.toLowerCase().includes(term) ||
          (describe(c) || '').toLowerCase().includes(term)
        );
    paletteIndex = 0;
    renderPalette();
  }

  function openPalette() {
    if (!palette) return;
    palette.classList.add('is-open');
    paletteInput.value = '';
    filterPalette('');
    setTimeout(() => paletteInput.focus(), 50);
    setMode('CMD');
  }

  function closePalette() {
    if (!palette) return;
    palette.classList.remove('is-open');
    setMode('NORMAL');
  }

  function runActive() {
    const cmd = paletteFiltered[paletteIndex];
    if (!cmd) return;
    closePalette();

    if (cmd.target) {
      const t = document.querySelector(cmd.target);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (cmd.href) {
      window.open(cmd.href, '_blank', 'noopener');
    } else if (cmd.action === 'theme') {
      document.getElementById('themeToggle')?.click();
    } else if (cmd.action && cmd.action.startsWith('lang:')) {
      window.i18n?.set(cmd.action.split(':')[1]);
    } else if (cmd.action === 'cv') {
      const cv = document.getElementById('btnCv');
      cv?.click();
    } else if (cmd.action === 'branches') {
      openBranches();
    }
  }

  /* ── Branch picker (other portfolio versions) ─────────── */
  const branches = document.getElementById('branches');
  const openBranchesBtn = document.getElementById('openBranches');
  const closeBranchesBtn = document.getElementById('closeBranches');

  function openBranches() {
    if (!branches) return;
    branches.classList.add('is-open');
    document.body.classList.add('branches-open');
    setMode('BRANCH');
    document.body.style.overflow = 'hidden';
  }

  function closeBranches() {
    if (!branches) return;
    branches.classList.remove('is-open');
    document.body.classList.remove('branches-open');
    setMode('NORMAL');
    document.body.style.overflow = '';
  }

  if (openBranchesBtn) openBranchesBtn.addEventListener('click', openBranches);
  if (closeBranchesBtn) closeBranchesBtn.addEventListener('click', closeBranches);
  if (branches) {
    branches.addEventListener('click', e => {
      if (e.target === branches) closeBranches();
    });
  }

  if (paletteOpen) paletteOpen.addEventListener('click', openPalette);

  if (paletteInput) {
    paletteInput.addEventListener('input', e => filterPalette(e.target.value));
    paletteInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closePalette(); return; }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        paletteIndex = Math.min(paletteIndex + 1, paletteFiltered.length - 1);
        renderPalette();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        paletteIndex = Math.max(paletteIndex - 1, 0);
        renderPalette();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        runActive();
      }
    });
  }

  if (palette) {
    palette.addEventListener('click', e => {
      if (e.target === palette) closePalette();
    });
  }

  // Global shortcuts
  document.addEventListener('keydown', e => {
    // Ctrl/Cmd + K → command palette
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (palette?.classList.contains('is-open')) closePalette();
      else openPalette();
      return;
    }
    // Ctrl/Cmd + B → branch picker
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      if (branches?.classList.contains('is-open')) closeBranches();
      else openBranches();
      return;
    }
    // Esc → close any open overlay
    if (e.key === 'Escape') {
      if (palette?.classList.contains('is-open')) closePalette();
      if (branches?.classList.contains('is-open')) closeBranches();
    }
  });

  /* ── Mail form: Ctrl+Enter submits + status feedback ─── */
  const mailForm   = document.getElementById('form-contacto');
  const mailStatus = document.getElementById('mailStatus');
  const mailSubmit = document.getElementById('mailSubmit');
  const mailBtnLabel = mailSubmit?.querySelector('.mail__btn-label');

  function setMailStatus(state, key) {
    if (!mailStatus) return;
    mailStatus.hidden = !state;
    mailStatus.classList.remove('mail__status--pending', 'mail__status--ok', 'mail__status--err');
    if (!state) { mailStatus.innerHTML = ''; return; }
    mailStatus.classList.add(`mail__status--${state}`);
    const text = (window.i18n && window.i18n.t(key)) || key;
    // allow simple HTML (e.g. fallback link in error)
    mailStatus.innerHTML = `<span>${text}</span>`;
  }

  function setMailBusy(busy) {
    if (!mailSubmit) return;
    mailSubmit.disabled = busy;
    mailSubmit.setAttribute('aria-busy', busy ? 'true' : 'false');
    if (mailBtnLabel) {
      const key = busy ? 'mail_btn_sending' : 'send_message';
      const txt = (window.i18n && window.i18n.t(key));
      if (txt) mailBtnLabel.textContent = txt;
    }
  }

  if (mailForm) {
    mailForm.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        mailForm.requestSubmit();
      }
    });

    mailForm.addEventListener('submit', e => {
      e.preventDefault();
      setMailBusy(true);
      setMailStatus('pending', 'mail_status_sending');
      setMode('SEND');

      const data = new FormData(mailForm);
      fetch(mailForm.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      }).then(r => {
        if (r.ok) {
          mailForm.reset();
          setMailStatus('ok', 'mail_status_sent');
          setMode('SENT');
        } else {
          setMailStatus('err', 'mail_status_error');
          setMode('ERROR');
        }
      }).catch(() => {
        setMailStatus('err', 'mail_status_error');
        setMode('ERROR');
      }).finally(() => {
        setMailBusy(false);
        setTimeout(() => setMode('NORMAL'), 2400);
      });
    });
  }

  /* ── Boot ──────────────────────────────────────────────── */
  initTyping();
  updateStatus();
  window.addEventListener('scroll', updateStatus, { passive: true });
  window.addEventListener('resize', updateStatus);

  // Re-run typing on language change so the typed prompt stays in sync
  // (whoami is the same in both languages, so we only re-run if data-typed changed)
})();
