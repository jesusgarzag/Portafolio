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

  const WHOAMI_ROTATION = ['whoami', 'id -un', 'echo $USER', 'getent passwd $UID'];

  function initTyping() {
    document.querySelectorAll('.typed[data-typed]').forEach(el => {
      const seed = (el.dataset.typed || '').trim().toLowerCase();
      if (seed === 'whoami') {
        const pick = WHOAMI_ROTATION[Math.floor(Math.random() * WHOAMI_ROTATION.length)];
        el.dataset.typed = pick;
      }
      typeOnce(el);
    });
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

  const FORTUNES = [
    '"Premature optimization is the root of all evil." — D. Knuth',
    '"Talk is cheap. Show me the code." — Linus Torvalds',
    '"Simplicity is prerequisite for reliability." — E. Dijkstra',
    '"Controlling complexity is the essence of programming." — B. Kernighan',
  ];

  function showFortune() {
    const info = document.getElementById('statusInfo');
    if (!info) return;
    const original = info.textContent;
    const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    info.textContent = quote;
    info.classList.add('statusbar__fortune');
    setTimeout(() => {
      info.textContent = original;
      info.classList.remove('statusbar__fortune');
    }, 4000);
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
    { cmd: ':colorscheme',          desc_key: 'cmd_colorscheme', action: 'colorscheme' },
    { cmd: 'LANG=es_MX.UTF-8',      desc_key: 'cmd_lang_es',    action: 'lang:es' },
    { cmd: 'LANG=en_US.UTF-8',      desc_key: 'cmd_lang_en',    action: 'lang:en' },
    { cmd: 'wget cv.pdf',           desc_key: 'cmd_cv',         action: 'cv' },
    { cmd: 'gh repo open',          desc_key: 'cmd_github',     href: 'https://github.com/jesusgarzag' },
    { cmd: 'mailto:',               desc_key: 'cmd_mail',       href: 'mailto:jesusgarzacia@hotmail.com' },
    { cmd: 'git branch -v',         desc_key: 'cmd_branches',   action: 'branches' },
    { cmd: 'help --keys',           desc_key: 'cmd_help',       action: 'help' },
    { cmd: 'history',               desc_key: 'cmd_history',    action: 'history' },
    { cmd: 'man jesus',             desc_key: 'cmd_man',        action: 'man' },
    { cmd: 'htop',                  desc_key: 'cmd_htop',       action: 'htop' },
    { cmd: './rubik',               desc_key: 'cmd_rubik',      action: 'rubik' },
    { cmd: './build --all',         desc_key: 'cmd_build',      action: 'build' },
    { cmd: 'vim ~/modules/aged_days.py', desc_key: 'cmd_vim',   action: 'vim' },
    { cmd: './hire',                desc_key: 'cmd_hire',       action: 'hire' },
    { cmd: './shell',               desc_key: 'cmd_shell',      action: 'shell' },
  ];

  const palette       = document.getElementById('palette');
  const paletteInput  = document.getElementById('paletteInput');
  const paletteList   = document.getElementById('paletteList');
  const paletteOpen   = document.getElementById('paletteOpen');
  const cheatsheetOpenBtn = document.getElementById('cheatsheetOpen');
  const historyList = document.getElementById('historyList');
  const historyEmpty = document.getElementById('historyEmpty');

  let paletteFiltered = PALETTE_COMMANDS.slice();
  let paletteIndex = 0;
  const commandHistory = [];
  const HISTORY_MAX = 80;
  let historyIndex = -1;

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
    overlayLastFocus = document.activeElement;
    palette.classList.add('is-open');
    document.body.classList.add('palette-open');
    document.body.style.overflow = 'hidden';
    paletteInput.value = '';
    filterPalette('');
    setTimeout(() => paletteInput.focus(), 50);
    setMode('CMD');
  }

  function closePalette() {
    if (!palette) return;
    palette.classList.remove('is-open');
    document.body.classList.remove('palette-open');
    document.body.style.overflow = '';
    setMode('NORMAL');
    restoreFocus();
  }

  function pushHistoryEntry(commandText) {
    if (!commandText) return;
    commandHistory.push(commandText);
    if (commandHistory.length > HISTORY_MAX) commandHistory.shift();
    historyIndex = commandHistory.length - 1;
    renderHistory();
  }

  function renderHistory() {
    if (!historyList || !historyEmpty) return;
    historyList.innerHTML = '';
    if (!commandHistory.length) {
      historyEmpty.hidden = false;
      return;
    }
    historyEmpty.hidden = true;
    commandHistory.forEach((cmdText, i) => {
      const item = document.createElement('li');
      item.className = 'history__item' + (i === historyIndex ? ' is-active' : '');
      item.innerHTML = `<span class="history__idx">${String(i + 1).padStart(2, '0')}</span><span class="history__cmd">$ ${cmdText}</span>`;
      item.addEventListener('click', () => {
        historyIndex = i;
        renderHistory();
      });
      item.addEventListener('dblclick', () => runHistorySelection());
      historyList.appendChild(item);
    });
    const active = historyList.querySelector('.history__item.is-active');
    active?.scrollIntoView({ block: 'nearest' });
  }

  function runCommand(cmd) {
    if (!cmd) return;
    pushHistoryEntry(cmd.cmd);
    closePalette();
    if (history.isOpen()) closeHistory();

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
    } else if (cmd.action === 'help') {
      openCheatsheet();
    } else if (cmd.action === 'history') {
      openHistory();
    } else if (cmd.action === 'colorscheme') {
      openScheme();
    } else if (cmd.action === 'man') {
      openMan();
    } else if (cmd.action === 'htop') {
      openHtop();
    } else if (cmd.action === 'rubik') {
      openRubik();
    } else if (cmd.action === 'build') {
      openBuild();
    } else if (cmd.action === 'vim') {
      openVim();
    } else if (cmd.action === 'hire') {
      openHire();
    } else if (cmd.action === 'shell') {
      document.getElementById('shell')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => document.getElementById('shellInput')?.focus(), 420);
    }
  }

  function runActive() {
    const cmd = paletteFiltered[paletteIndex];
    if (!cmd) return;
    runCommand(cmd);
  }

  function runHistorySelection() {
    if (!commandHistory.length || historyIndex < 0) return;
    const cmdText = commandHistory[historyIndex];
    const cmd = PALETTE_COMMANDS.find(c => c.cmd === cmdText);
    if (!cmd) return;
    runCommand(cmd);
  }

  /* ── Focus trap (a11y) para overlays modales ───────────── */
  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let overlayLastFocus = null;   // a dónde devolver el foco al cerrar

  function getOpenModal() {
    return document.querySelector('[role="dialog"][aria-modal="true"].is-open');
  }
  function modalFocusables(modal) {
    // solo elementos realmente visibles
    return Array.from(modal.querySelectorAll(FOCUSABLE))
      .filter(el => el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }
  function focusFirstIn(modal) {
    requestAnimationFrame(() => {
      if (!modal.classList.contains('is-open')) return;
      const f = modalFocusables(modal);
      (f[0] || modal).focus?.();
    });
  }
  function restoreFocus() {
    if (overlayLastFocus && typeof overlayLastFocus.focus === 'function') overlayLastFocus.focus();
    overlayLastFocus = null;
  }
  // Atrapa Tab / Shift+Tab dentro del overlay modal abierto.
  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const modal = getOpenModal();
    if (!modal) return;
    const f = modalFocusables(modal);
    if (!f.length) { e.preventDefault(); modal.focus?.(); return; }
    const first = f[0], last = f[f.length - 1];
    const active = document.activeElement;
    if (e.shiftKey) {
      if (active === first || !modal.contains(active)) { e.preventDefault(); last.focus(); }
    } else {
      if (active === last || !modal.contains(active)) { e.preventDefault(); first.focus(); }
    }
  });

  /* ── Generic overlay helpers ───────────────────────────── */
  function makeOverlayToggle(id, bodyClass, modeLabel) {
    const el = document.getElementById(id);
    return {
      el,
      open() {
        if (!el) return;
        overlayLastFocus = document.activeElement;
        el.classList.add('is-open');
        document.body.classList.add(bodyClass);
        setMode(modeLabel);
        document.body.style.overflow = 'hidden';
        focusFirstIn(el);
      },
      close() {
        if (!el) return;
        el.classList.remove('is-open');
        document.body.classList.remove(bodyClass);
        setMode('NORMAL');
        document.body.style.overflow = '';
        restoreFocus();
      },
      isOpen: () => el?.classList.contains('is-open'),
    };
  }

  /* ── Scheme picker ─────────────────────────────────────── */
  const scheme = makeOverlayToggle('schemePicker', 'scheme-open', 'COLORS');
  function openScheme() { scheme.open(); }
  function closeScheme() { scheme.close(); }
  document.getElementById('closeScheme')?.addEventListener('click', closeScheme);
  scheme.el?.addEventListener('click', e => { if (e.target === scheme.el) closeScheme(); });

  /* ── Man page overlay ──────────────────────────────────── */
  const man = makeOverlayToggle('manPage', 'man-open', 'MAN');
  function openMan() { man.open(); }
  function closeMan() { man.close(); }
  document.getElementById('closeMan')?.addEventListener('click', closeMan);
  man.el?.addEventListener('click', e => { if (e.target === man.el) closeMan(); });

  /* ── htop overlay ──────────────────────────────────────── */
  const htop = makeOverlayToggle('htopOverlay', 'htop-open', 'HTOP');
  function openHtop() {
    htop.open();
    // Animate bars
    requestAnimationFrame(() => {
      htop.el?.querySelectorAll('.htop__bar-track').forEach(t => {
        t.style.setProperty('--htop-pct', (t.dataset.load || 0) + '%');
      });
    });
  }
  function closeHtop() {
    htop.el?.querySelectorAll('.htop__bar-track').forEach(t => t.style.setProperty('--htop-pct', '0%'));
    htop.close();
  }
  document.getElementById('closeHtop')?.addEventListener('click', closeHtop);
  htop.el?.addEventListener('click', e => { if (e.target === htop.el) closeHtop(); });
  // q key closes htop (vim-like)
  document.addEventListener('keydown', e => {
    if (e.key === 'q' && htop.isOpen() && !e.target.matches('input, textarea')) closeHtop();
  });

  /* ── Keyboard cheatsheet overlay ──────────────────────── */
  const cheatsheet = makeOverlayToggle('cheatsheetOverlay', 'cheatsheet-open', 'HELP');
  function openCheatsheet() {
    cheatsheet.open();
  }
  function closeCheatsheet() {
    cheatsheet.close();
  }
  document.getElementById('closeCheatsheet')?.addEventListener('click', closeCheatsheet);
  cheatsheet.el?.addEventListener('click', e => { if (e.target === cheatsheet.el) closeCheatsheet(); });

  /* ── Branch picker (other portfolio versions) ─────────── */
  const branches = document.getElementById('branches');
  const openBranchesBtn = document.getElementById('openBranches');
  const closeBranchesBtn = document.getElementById('closeBranches');

  function openBranches() {
    if (!branches) return;
    overlayLastFocus = document.activeElement;
    branches.classList.add('is-open');
    document.body.classList.add('branches-open');
    setMode('BRANCH');
    document.body.style.overflow = 'hidden';
    focusFirstIn(branches);
  }

  function closeBranches() {
    if (!branches) return;
    branches.classList.remove('is-open');
    document.body.classList.remove('branches-open');
    setMode('NORMAL');
    document.body.style.overflow = '';
    restoreFocus();
  }

  if (openBranchesBtn) openBranchesBtn.addEventListener('click', openBranches);
  if (closeBranchesBtn) closeBranchesBtn.addEventListener('click', closeBranches);
  if (branches) {
    branches.addEventListener('click', e => {
      if (e.target === branches) closeBranches();
    });
  }

  /* ── Command history overlay ───────────────────────────── */
  const history = makeOverlayToggle('historyOverlay', 'history-open', 'HISTORY');
  function openHistory() {
    history.open();
    if (commandHistory.length) historyIndex = commandHistory.length - 1;
    renderHistory();
  }
  function closeHistory() {
    history.close();
  }
  document.getElementById('closeHistory')?.addEventListener('click', closeHistory);
  history.el?.addEventListener('click', e => { if (e.target === history.el) closeHistory(); });

  if (paletteOpen) paletteOpen.addEventListener('click', openPalette);
  if (cheatsheetOpenBtn) cheatsheetOpenBtn.addEventListener('click', openCheatsheet);

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
    const isTypingTarget = e.target.matches('input, textarea, [contenteditable="true"]');

    if (history.isOpen()) {
      if (!commandHistory.length && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter')) {
        e.preventDefault();
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        historyIndex = Math.max(0, historyIndex - 1);
        renderHistory();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        historyIndex = Math.min(commandHistory.length - 1, historyIndex + 1);
        renderHistory();
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        runHistorySelection();
        return;
      }
    }

    if (!e.ctrlKey && !e.metaKey && !e.altKey && !isTypingTarget && (e.key === '?' || e.key === '/')) {
      e.preventDefault();
      if (cheatsheet.isOpen()) closeCheatsheet();
      else openCheatsheet();
      return;
    }

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
    // Ctrl/Cmd + H → command history
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
      e.preventDefault();
      if (history.isOpen()) closeHistory();
      else openHistory();
      return;
    }
    // Esc → close any open overlay
    if (e.key === 'Escape') {
      if (palette?.classList.contains('is-open')) closePalette();
      if (branches?.classList.contains('is-open')) closeBranches();
      if (history.isOpen()) closeHistory();
      if (cheatsheet.isOpen()) closeCheatsheet();
      if (scheme.isOpen()) closeScheme();
      if (man.isOpen()) closeMan();
      if (htop.isOpen()) { closeHtop(); }
      if (rubik.isOpen()) closeRubik();
      if (build.isOpen()) closeBuild();
      if (vim.isOpen()) closeVim();
      if (hire.isOpen()) closeHire();
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

  /* ── Konami code easter egg → CRT glitch ──────────────── */
  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiBuf = [];
  document.addEventListener('keydown', e => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    konamiBuf.push(k);
    if (konamiBuf.length > KONAMI.length) konamiBuf.shift();
    if (konamiBuf.length === KONAMI.length && KONAMI.every((v, i) => v === konamiBuf[i])) {
      triggerCRT();
      konamiBuf = [];
    }
  });
  function triggerCRT() {
    document.body.classList.add('crt-mode');
    setMode('CRT');
    setTimeout(() => {
      document.body.classList.remove('crt-mode');
      setMode('NORMAL');
    }, 3200);
  }

  /* ── Logo x5 click → dev panel ─────────────────────────── */
  const devPanel = document.getElementById('devPanel');
  const logo = document.querySelector('.sidebar__logo');
  let logoClicks = 0;
  let logoTimer = null;
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      logoClicks++;
      clearTimeout(logoTimer);
      logoTimer = setTimeout(() => { logoClicks = 0; }, 1500);
      if (logoClicks >= 5) {
        logoClicks = 0;
        openDevPanel();
      }
    });
  }
  document.getElementById('closeDev')?.addEventListener('click', () => devPanel?.classList.remove('is-open'));

  function fmtBytes(n) {
    if (!n && n !== 0) return '—';
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function openDevPanel() {
    if (!devPanel) return;
    devPanel.classList.add('is-open');
    document.getElementById('devScheme').textContent = window.scheme?.get() || 'dark';
    document.getElementById('devLang').textContent = window.i18n?.current || 'es';
    document.getElementById('devVp').textContent = `${window.innerWidth}×${window.innerHeight}`;
    document.getElementById('devDpr').textContent = (window.devicePixelRatio || 1).toFixed(2);
    const nav = performance.getEntriesByType?.('navigation')?.[0];
    document.getElementById('devLoad').textContent = nav ? Math.round(nav.duration) + ' ms' : '—';
    document.getElementById('devHtml').textContent = fmtBytes(document.documentElement.outerHTML.length);
    const mem = performance.memory;
    document.getElementById('devMem').textContent = mem
      ? `${(mem.usedJSHeapSize / 1048576).toFixed(1)} / ${(mem.jsHeapSizeLimit / 1048576).toFixed(0)} MB`
      : '—';
    const c = navigator.connection;
    document.getElementById('devConn').textContent = c ? `${c.effectiveType || '—'} · ${c.downlink || '?'} Mbps` : '—';
  }

  /* ── Build log overlay ─────────────────────────────────── */
  const build = makeOverlayToggle('buildOverlay', 'build-open', 'BUILD');
  function openBuild() { build.open(); buildRun(); }
  function closeBuild() { build.close(); }
  document.getElementById('closeBuild')?.addEventListener('click', closeBuild);
  build.el?.addEventListener('click', e => { if (e.target === build.el) closeBuild(); });

  // 17 modules (matches the ls section). status: ok | warn | fail.
  const BUILD_MODULES = [
    { n: 'iia_formatos',           v: 'v18', s: 'ok',   d: 2.4, c: 'avalia',     a: '9 reports · openpyxl · OWL dashboard' },
    { n: 'iia_bank_balance',       v: 'v18', s: 'ok',   d: 1.7, c: 'avalia',     a: 'bidirectional sync · mail.thread audit' },
    { n: 'iia_aged_days',          v: 'v18', s: 'ok',   d: 0.8, c: 'avalia',     a: 'report engine · custom expressions' },
    { n: 'iia_base_efectivo',      v: 'v17', s: 'ok',   d: 0.6, c: 'dimex',      a: '_compute_max_date override · DIOT' },
    { n: 'iia_anticipo',           v: 'v17', s: 'ok',   d: 1.2, c: 'dimex',      a: 'action_post + cash basis + tax tags' },
    { n: 'iia_rep',                v: 'v17', s: 'warn', d: 2.9, c: 'casaguerra', a: 'CFDI 4.0 · Pagos20 · QR (DEPRECATION: lxml.etree)' },
    { n: 'iia_holidays',           v: 'v17', s: 'ok',   d: 0.7, c: 'casaguerra', a: 'QWeb half-letter · hr.leave binding' },
    { n: 'iia_payroll_report',     v: 'v18', s: 'ok',   d: 1.4, c: 'casaguerra', a: 'xlsxwriter · dynamic columns · wizard' },
    { n: 'iia_odessa',             v: 'v18', s: 'ok',   d: 1.8, c: 'avalia',     a: '3 wizards · MOPER · 5 salary rules' },
    { n: 'iia_stock_location',     v: 'v17', s: 'ok',   d: 3.1, c: 'forrajera',  a: 'boundary-crossing · BOM kits' },
    { n: 'iia_pedimento',          v: 'v17', s: 'ok',   d: 1.6, c: 'recavisa',   a: 'web_search_read · _auto_init · CFDI' },
    { n: 'iia_quant_unrestrict',   v: 'v19', s: 'ok',   d: 0.3, c: 'interenter', a: '_get_forbidden_fields_write override' },
    { n: 'iia_stock_import_lots',  v: 'v19', s: 'ok',   d: 0.5, c: 'interenter', a: 'split_lots · stock.move' },
    { n: 'iia_catalogo',           v: 'v17', s: 'ok',   d: 1.1, c: 'fgh',        a: '_name_search · context-based filter' },
    { n: 'iia_compras_proyecto',   v: 'v17', s: 'warn', d: 1.9, c: 'invent',     a: 'analytic_distribution · auto chain (NOTE: TODO refactor _create_picking)' },
    { n: 'iia_ikigai_edi',         v: 'v19', s: 'ok',   d: 0.9, c: 'ikigai',     a: 'webhook edi.ready · 944/945 · idempotencia · cron retry' },
    { n: 'iia_columns',            v: 'v19', s: 'ok',   d: 0.4, c: 'interenter', a: 'OWL patch · getActiveColumns · mixin' },
    { n: 'iia_currency_mx_fix',    v: 'v18', s: 'ok',   d: 0.6, c: 'avalia',     a: 'Banxico SIE API · DOF date shift (-1d)' },
    { n: 'iia_mx_reports_compl',   v: 'v18', s: 'ok',   d: 1.3, c: 'avalia',     a: 'SAT XML · Balance Complementario · Pólizas' },
    { n: 'iia_intercompany_cancel',v: 'v18', s: 'ok',   d: 0.7, c: 'avalia',     a: 'auto-cancel intercompany vendor bill' },
    { n: 'iia_custom_sua',         v: 'v18', s: 'ok',   d: 2.6, c: 'recavisa',   a: 'IMSS/SUA · 8 wizards · INFONAVIT · FONACOT' },
    { n: 'iia_hr_ptu',             v: 'v18', s: 'ok',   d: 1.0, c: 'avalia',     a: 'PTU · días/salarios · import Excel' },
    { n: 'iia_nomina_timbrado_par',v: 'v18', s: 'warn', d: 1.5, c: 'avalia',     a: 'concurrent PAC · fast mode (NOTE: ORM writes kept serial)' },
  ];

  let build_running = false;
  function buildLine(html) {
    const log = document.getElementById('buildLog');
    if (!log) return;
    const div = document.createElement('span');
    div.className = 'build__line';
    div.innerHTML = html;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }
  function buildPad(s, n) {
    s = String(s);
    return s + ' '.repeat(Math.max(0, n - s.length));
  }
  function buildTs() {
    const d = new Date();
    return d.toTimeString().slice(0, 8);
  }
  async function buildRun() {
    if (build_running) return;
    build_running = true;
    const log = document.getElementById('buildLog');
    const foot = document.getElementById('buildFoot');
    if (log) log.innerHTML = '';
    if (foot) foot.innerHTML = '<span class="build__status is-running">running</span>';
    const buildId = '#' + (1240 + Math.floor(Math.random() * 30));
    buildLine(`<span class="build__t">[${buildTs()}]</span> <span class="build__info">[INFO]</span> Starting Odoo CI run ${buildId} · 23 modules · target Odoo 17/18/19`);
    buildLine(`<span class="build__t">[${buildTs()}]</span> <span class="build__info">[INFO]</span> Resolving dependencies...`);
    await new Promise(r => setTimeout(r, 280));
    buildLine(`<span class="build__t">[${buildTs()}]</span> <span class="build__ok">[OK]</span>   Dependencies resolved (PostgreSQL 14, Python 3.11)`);
    await new Promise(r => setTimeout(r, 200));
    buildLine(`<span class="build__t">[${buildTs()}]</span> <span class="build__info">[INFO]</span> Compiling assets...`);
    await new Promise(r => setTimeout(r, 220));

    let warns = 0, fails = 0, totalDur = 0;
    for (const m of BUILD_MODULES) {
      if (!build.isOpen()) break;
      const tag = m.s === 'ok' ? '<span class="build__ok">[OK]</span>  '
                : m.s === 'warn' ? '<span class="build__warn">[WARN]</span>'
                : '<span class="build__fail">[FAIL]</span>';
      buildLine(
        `<span class="build__t">[${buildTs()}]</span> ${tag} ` +
        `<span class="build__name">${buildPad(m.n, 26)}</span> ` +
        `<span class="build__ver">${m.v}</span> ` +
        `<span class="build__d">· ${m.c} · ${m.a} · ${m.d.toFixed(1)}s</span>`
      );
      if (m.s === 'warn') warns++;
      if (m.s === 'fail') fails++;
      totalDur += m.d;
      await new Promise(r => setTimeout(r, 110 + Math.random() * 160));
    }

    if (!build.isOpen()) { build_running = false; return; }
    buildLine(``);
    buildLine(`<span class="build__t">[${buildTs()}]</span> <span class="build__info">[INFO]</span> Running odoo-bin --test-enable...`);
    await new Promise(r => setTimeout(r, 320));
    buildLine(`<span class="build__t">[${buildTs()}]</span> <span class="build__ok">[OK]</span>   142 tests passed in 14.7s`);
    await new Promise(r => setTimeout(r, 200));
    const ok = fails === 0;
    const status = ok ? 'passed' : 'failed';
    const cls = ok ? 'is-done' : 'is-fail';
    buildLine(`<span class="build__t">[${buildTs()}]</span> <span class="build__${ok ? 'ok' : 'fail'}">[${ok ? 'DONE' : 'FAIL'}]</span> Build ${buildId} ${status} · 23/23 modules · ${warns} warnings · ${totalDur.toFixed(1)}s`);
    if (foot) foot.innerHTML = `<span class="build__status ${cls}">${status}</span> &nbsp; build ${buildId} · 23 modules · ${warns} warnings · ${totalDur.toFixed(1)}s`;
    build_running = false;
  }

  /* ── Vim overlay ───────────────────────────────────────── */
  const vim = makeOverlayToggle('vimOverlay', 'vim-open', 'VIM');
  let vimCurrent = 'aged_days';
  function openVim(key) {
    vimCurrent = (key && MODULE_SNIPPETS[key]) ? key : 'aged_days';
    vim.open();
    vimRender();
  }
  function closeVim() { vim.close(); }
  document.getElementById('closeVim')?.addEventListener('click', closeVim);
  vim.el?.addEventListener('click', e => { if (e.target === vim.el) closeVim(); });

  // Real Odoo override snippet (anonymized + slightly compressed for display).
  const VIM_LINES = [
    [1,  '<span class="py-com"># ~/modules/iia_aged_days/models/account_report.py</span>'],
    [2,  '<span class="py-com"># Adds "days overdue" computed expression to the AR Aging report.</span>'],
    [3,  '<span class="py-com"># Critical for cash-flow visibility — Odoo natively shows aged buckets only.</span>'],
    [4,  ''],
    [5,  '<span class="py-kw">from</span> odoo <span class="py-kw">import</span> models, fields, api, _'],
    [6,  '<span class="py-kw">from</span> dateutil.relativedelta <span class="py-kw">import</span> relativedelta'],
    [7,  ''],
    [8,  ''],
    [9,  '<span class="py-kw">class</span> <span class="py-cls">AccountReport</span>(models.Model):'],
    [10, '    _inherit <span class="py-op">=</span> <span class="py-str">"account.report"</span>'],
    [11, ''],
    [12, '    <span class="py-kw">def</span> <span class="py-fn">_report_custom_engine_aged_days</span>('],
    [13, '            <span class="py-self">self</span>, expressions, options, date_scope, current_groupby, next_groupby,'],
    [14, '            offset<span class="py-op">=</span><span class="py-num">0</span>, limit<span class="py-op">=</span><span class="py-kw">None</span>, warnings<span class="py-op">=</span><span class="py-kw">None</span>):'],
    [15, '        <span class="py-str">""" Returns days overdue per AR line at the report date.</span>'],
    [16, '<span class="py-str">            Used as &lt;expression engine="custom"&gt; in the report XML.</span>'],
    [17, '<span class="py-str">        """</span>'],
    [18, '        report_date <span class="py-op">=</span> fields.Date.from_string(options[<span class="py-str">"date"</span>][<span class="py-str">"date_to"</span>])'],
    [19, '        results <span class="py-op">=</span> []'],
    [20, ''],
    [21, '        <span class="py-kw">for</span> grouping_key, lines <span class="py-kw">in</span> <span class="py-self">self</span><span class="py-op">.</span>_aged_partner_balance_query('],
    [22, '                options, current_groupby, next_groupby, offset, limit):'],
    [23, '            partner_total <span class="py-op">=</span> <span class="py-num">0</span>'],
    [24, '            <span class="py-kw">for</span> aml <span class="py-kw">in</span> lines:'],
    [25, '                due <span class="py-op">=</span> aml<span class="py-op">.</span>date_maturity <span class="py-kw">or</span> aml<span class="py-op">.</span>date'],
    [26, '                days <span class="py-op">=</span> (report_date <span class="py-op">-</span> due)<span class="py-op">.</span>days <span class="py-kw">if</span> due <span class="py-kw">else</span> <span class="py-num">0</span>'],
    [27, '                partner_total <span class="py-op">+=</span> <span class="py-fn">max</span>(days, <span class="py-num">0</span>)'],
    [28, ''],
    [29, '            results<span class="py-op">.</span>append((grouping_key, {'],
    [30, '                <span class="py-str">"days_overdue"</span>: partner_total <span class="py-op">/</span> <span class="py-fn">max</span>(<span class="py-fn">len</span>(lines), <span class="py-num">1</span>),'],
    [31, '            }))'],
    [32, ''],
    [33, '        <span class="py-kw">return</span> results'],
    [34, ''],
    [35, '    <span class="py-com"># post_init_hook installs the column once and keeps it idempotent.</span>'],
    [36, '    <span class="py-kw">def</span> <span class="py-fn">_install_overdue_column</span>(<span class="py-self">self</span>):'],
    [37, '        report <span class="py-op">=</span> <span class="py-self">self</span><span class="py-op">.</span>env<span class="py-op">.</span>ref(<span class="py-str">"account.aged_receivable_report"</span>)'],
    [38, '        <span class="py-kw">if</span> <span class="py-kw">not</span> report<span class="py-op">.</span>column_ids<span class="py-op">.</span>filtered(<span class="py-kw">lambda</span> c: c<span class="py-op">.</span>expression_label <span class="py-op">==</span> <span class="py-str">"days_overdue"</span>):'],
    [39, '            report<span class="py-op">.</span>column_ids <span class="py-op">=</span> [(<span class="py-num">0</span>, <span class="py-num">0</span>, {'],
    [40, '                <span class="py-str">"name"</span>: _(<span class="py-str">"Days Overdue"</span>),'],
    [41, '                <span class="py-str">"expression_label"</span>: <span class="py-str">"days_overdue"</span>,'],
    [42, '                <span class="py-str">"figure_type"</span>: <span class="py-str">"integer"</span>,'],
    [43, '                <span class="py-str">"sortable"</span>: <span class="py-kw">True</span>,'],
    [44, '            })]'],
    [45, ''],
    [46, '    <span class="py-com"># uninstall_hook keeps the database clean — no residual columns.</span>'],
    [47, '    <span class="py-kw">def</span> <span class="py-fn">_remove_overdue_column</span>(<span class="py-self">self</span>):'],
    [48, '        <span class="py-self">self</span><span class="py-op">.</span>env[<span class="py-str">"account.report.column"</span>]<span class="py-op">.</span>search(['],
    [49, '            (<span class="py-str">"expression_label"</span>, <span class="py-str">"="</span>, <span class="py-str">"days_overdue"</span>)'],
    [50, '        ])<span class="py-op">.</span>unlink()'],
  ];

  // Resaltado mínimo de Python para los snippets en crudo (raw).
  function pyHi(line) {
    const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const hiCode = code => esc(code)
      .replace(/\b(from|import|class|def|return|for|in|if|elif|else|not|and|or|with|as|None|True|False|lambda|while|try|except|raise)\b/g, '<span class="py-kw">$1</span>')
      .replace(/\bself\b/g, '<span class="py-self">self</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="py-num">$1</span>');
    let out = '';
    let i = 0;
    const n = line.length;
    while (i < n) {
      const ch = line[i];
      if (ch === '#') {                       // comentario hasta fin de linea
        out += '<span class="py-com">' + esc(line.slice(i)) + '</span>';
        break;
      }
      if (ch === '"' || ch === "'") {         // string entre comillas
        let j = i + 1;
        while (j < n && line[j] !== ch) j++;
        out += '<span class="py-str">' + esc(line.slice(i, Math.min(j + 1, n))) + '</span>';
        i = j + 1;
        continue;
      }
      let j = i;                              // tramo de codigo normal
      while (j < n && line[j] !== '#' && line[j] !== '"' && line[j] !== "'") j++;
      out += hiCode(line.slice(i, j));
      i = j;
    }
    return out;
  }

  // Código real (currency / import_lots) y representaciones fieles del override
  // documentado para los demás módulos. Cada fila de `ls` con [data-vim] lo abre.
  const MODULE_SNIPPETS = {
    aged_days: { file: 'aged_days.py', lines: VIM_LINES, cursor: 26 },

    currency: { file: 'res_company.py', cursor: 18, raw: [
      '# ~/modules/iia_currency_mx_fix/models/res_company.py',
      '# Banxico etiqueta el Fix (SF43718) con la fecha de aplicación (día siguiente).',
      '# El DOF lo publica un día antes. Aquí empatamos ambas fechas.',
      '',
      'BANXICO_SIE_URL = "https://www.banxico.org.mx/SieAPIRest/.../SF43718/datos/oportuno"',
      '',
      '',
      'class ResCompany(models.Model):',
      '    _inherit = "res.company"',
      '',
      '    def _get_banxico_fix_usd(self):',
      '        """Trae el Fix directo de Banxico -> (rate, fecha) o None."""',
      '        token = self.env["ir.config_parameter"].sudo().get_param("banxico.token")',
      '        if not token:',
      '            return None',
      '        resp = requests.get(BANXICO_SIE_URL, headers={"Bmx-Token": token}, timeout=30)',
      '        dato = resp.json()["bmx"]["series"][0]["datos"][0]',
      '        fecha = datetime.strptime(dato["fecha"], "%d/%m/%Y").strftime("%Y-%m-%d")',
      '        return (1.0 / float(dato["dato"]), fecha)',
      '',
      '    def _parse_banxico_data(self, available_currencies):',
      '        # Usa el Fix con la fecha correcta; si falla, cae al nativo.',
      '        fix_usd = self._get_banxico_fix_usd()',
      '        result = super()._parse_banxico_data(available_currencies)',
      '        if result and fix_usd:',
      '            result["USD"] = fix_usd',
      '        return result',
    ]},

    import_lots: { file: 'stock_move.py', cursor: 11, raw: [
      '# ~/modules/iia_stock_import_lots/models/stock_move.py',
      '# Acelera la recepción: permite pegar lotes separados por coma.',
      '',
      'from odoo import models',
      '',
      '',
      'class StockMove(models.Model):',
      '    _inherit = "stock.move"',
      '',
      '    def split_lots(self, lots):',
      '        # Normaliza comas a saltos de línea antes del método nativo.',
      '        if lots:',
      '            lots = lots.replace(",", "\\n")',
      '        return super().split_lots(lots)',
    ]},

    quant_unrestrict: { file: 'stock_quant.py', cursor: 12, raw: [
      '# ~/modules/iia_quant_unrestrict/models/stock_quant.py',
      '# Permite corregir el lote de un quant sin un ajuste de inventario completo.',
      '',
      'from odoo import models',
      '',
      '',
      'class StockQuant(models.Model):',
      '    _inherit = "stock.quant"',
      '',
      '    def _get_forbidden_fields_write(self):',
      '        # Saca lot_id de los campos bloqueados: edición directa y segura.',
      '        fields = super()._get_forbidden_fields_write()',
      '        return fields - {"lot_id"}',
    ]},

    intercompany: { file: 'account_move.py', cursor: 13, raw: [
      '# ~/modules/iia_intercompany_cancel_sync/models/account_move.py',
      '# Al cancelar la factura de cliente, cancela también la de proveedor',
      '# generada automáticamente en la otra empresa del grupo.',
      '',
      'from odoo import models',
      '',
      '',
      'class AccountMove(models.Model):',
      '    _inherit = "account.move"',
      '',
      '    def button_cancel(self):',
      '        res = super().button_cancel()',
      '        for move in self:',
      '            mirror = move.auto_invoice_id   # factura espejo en la otra empresa',
      '            if mirror and mirror.state != "cancel":',
      '                mirror.with_company(mirror.company_id).button_cancel()',
      '        return res',
    ]},

    sua: { file: 'wizard_imss_mensual.py', cursor: 11, raw: [
      '# ~/modules/iia_custom_sua/wizard/wizard_imss_mensual.py',
      '# Calcula cuotas IMSS / INFONAVIT del mes y exporta al formato del SUA.',
      '',
      'class WizardImssMensual(models.TransientModel):',
      '    _name = "iia.wizard.imss.mensual"',
      '    _description = "Cálculo IMSS mensual"',
      '',
      '    period_id = fields.Many2one("hr.period", required=True)',
      '    registro_patronal_id = fields.Many2one("iia.registro.patronal", required=True)',
      '',
      '    def action_calcular(self):',
      '        uma = self.env["iia.valor.uma"]._vigente(self.period_id.date_to)',
      '        lines = self.env["wizard.imss.nomina.lines"]',
      '        for emp in self._employees():',
      '            sbc = emp._sbc(self.period_id)            # salario base de cotización',
      '            lines.create({',
      '                "employee_id": emp.id,',
      '                "cuota_imss": emp._cuota_imss(sbc, uma),',
      '                "infonavit": emp._descuento_infonavit(sbc),',
      '                "fonacot": emp._descuento_fonacot(),',
      '            })',
      '        return self._open_lines(lines)',
    ]},

    ptu: { file: 'hr_ptu_wizard.py', cursor: 13, raw: [
      '# ~/modules/iia_hr_ptu/wizards/hr_ptu_import_wizard.py',
      '# Reparte la PTU: 50% por días trabajados, 50% por salarios devengados.',
      '',
      'class HrPtuWizard(models.TransientModel):',
      '    _name = "iia.hr.ptu.wizard"',
      '',
      '    amount = fields.Monetary(string="Monto a repartir", required=True)',
      '',
      '    def action_compute(self):',
      '        emps = self._eligible_employees()',
      '        total_days = sum(e.worked_days for e in emps)',
      '        total_wage = sum(e.earned_wage for e in emps)',
      '        half = self.amount / 2.0',
      '        for e in emps:',
      '            by_days = half * (e.worked_days / total_days)',
      '            by_wage = half * (e.earned_wage / total_wage)',
      '            e._register_ptu(by_days + by_wage)',
    ]},

    timbrado: { file: 'hr_payslip_run.py', cursor: 14, raw: [
      '# ~/modules/iia_nomina_timbrado_paralelo/models/hr_payslip_run.py',
      '# Timbra el lote llamando al PAC en paralelo; las escrituras ORM se',
      '# mantienen en el hilo principal (el cursor de PostgreSQL no es thread-safe).',
      '',
      'from concurrent.futures import ThreadPoolExecutor',
      '',
      '',
      'class HrPayslipRun(models.Model):',
      '    _inherit = "hr.payslip.run"',
      '',
      '    def action_timbrar_paralelo(self):',
      '        slips = self.slip_ids.filtered(lambda s: not s.cfdi_uuid)',
      '        with ThreadPoolExecutor(max_workers=8) as pool:',
      '            xmls = list(pool.map(self._call_pac, slips))   # solo I/O al PAC',
      '        for slip, xml in zip(slips, xmls):                 # writes en serie',
      '            slip._store_cfdi(xml, fast_mode=True)          # omite PDF/chatter',
      '        return True',
    ]},

    edi: { file: 'edi_event.py', cursor: 18, raw: [
      '# ~/modules/iia_ikigai_edi/models/edi_event.py',
      '# Odoo NO arma el EDI: avisa al middleware que un albarán quedó listo.',
      '# El middleware consulta Odoo, genera el X12 (944/945) y lo manda por AS2.',
      '',
      'def _send_one(self, raise_on_error=False):',
      '    self.ensure_one()',
      '    url, token, timeout = self._get_config()   # config por cliente (res.partner)',
      '    payload = {',
      '        "event_type": "edi.ready",',
      '        "edi_document_type": self.x_edi_document_type,   # 944 / 945 / 947 / 852',
      '        "res_model": self.x_res_model,',
      '        "res_id": self.x_res_id,',
      '        "idempotency_key": self.x_idempotency_key,       # modelo:id:doc:ready (único)',
      '        "source": "odoo",',
      '    }',
      '    headers = {"Content-Type": "application/json",',
      '               "X-IKIGAI-Webhook-Token": token}',
      '    resp = requests.post(url, data=json.dumps(payload), headers=headers, timeout=timeout)',
      '    # 202 = aceptado, 200 = duplicado ya recibido -> ambos se dan por acusados',
      '    if resp.status_code in (200, 202):',
      '        self.x_status = "acknowledged"',
      '        return True',
      '    # 400 payload / 401 token / 500 interno -> el cron reintenta (idempotente)',
      '    self.write({"x_status": "failed",',
      '                "x_error_message": "HTTP %s" % resp.status_code})',
      '    return False',
    ]},
  };

  function vimRender() {
    const buf = document.getElementById('vimBuffer');
    if (!buf) return;
    const snip = MODULE_SNIPPETS[vimCurrent] || MODULE_SNIPPETS.aged_days;
    const lines = snip.lines || snip.raw.map((src, i) => [i + 1, pyHi(src)]);
    const cursor = snip.cursor || 0;
    buf.innerHTML = lines.map(([n, src]) => {
      const isCursor = n === cursor;
      return `<div class="line${isCursor ? ' is-cursor' : ''}"><span class="ln">${n}</span><span class="src">${src || ' '}</span></div>`;
    }).join('');
    buf.scrollTop = 0;
    // Actualiza la pestaña activa + status bar con el archivo del módulo.
    const tab = vim.el?.querySelector('.vim__tab.is-active');
    if (tab) tab.textContent = snip.file;
    const fileEl = vim.el?.querySelector('.vim__file');
    if (fileEl) fileEl.textContent = snip.file;
    const meta = document.getElementById('vimMeta');
    if (meta) meta.textContent = `utf-8 · py · ${lines.length} ln · 100%`;
  }

  // Clic en una fila de módulos con [data-vim] -> abre su código en vim.
  document.querySelectorAll('.ls__row[data-vim]').forEach(row => {
    const key = row.dataset.vim;
    if (!MODULE_SNIPPETS[key]) return;
    row.classList.add('ls__row--vim');
    row.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      openVim(key);
    });
  });

  /* ── Hire overlay ──────────────────────────────────────── */
  const hire = makeOverlayToggle('hireOverlay', 'hire-open', 'HIRE');
  function openHire() { hire.open(); }
  function closeHire() { hire.close(); }
  document.getElementById('closeHire')?.addEventListener('click', closeHire);
  hire.el?.addEventListener('click', e => { if (e.target === hire.el) closeHire(); });
  document.getElementById('hireCv')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('btnCv')?.click();
  });

  /* ── Rubik 2x2 functional ──────────────────────────────── */
  const rubik = makeOverlayToggle('rubikOverlay', 'rubik-open', 'RUBIK');
  function openRubik() { rubik.open(); rubikInit(); updateRubikSolveButton(); }
  function closeRubik() {
    rb_abortSolve = true;
    rb_solving = false;
    setRubikControlsDisabled(false);
    rubik.close();
  }
  document.getElementById('closeRubik')?.addEventListener('click', closeRubik);
  rubik.el?.addEventListener('click', e => { if (e.target === rubik.el) closeRubik(); });

  // 2x2 / 3x3 state and rendering
  const RB_ANIM = 280;         // ms
  const RB_FACES = ['U','D','L','R','F','B'];
  // Per-mode geometry. faceVal is the value of pos[coord] on the outer face.
  // 2x2: positions are ±0.5 (centers between unit ticks). faceVal=0.5.
  // 3x3: positions are -1, 0, +1. faceVal=1. The middle slice (0) is unaffected.
  const RB_MODES = {
    2: { size: 64, half: 32, faceVal: 0.5, posVals: [-0.5, 0.5] },
    3: { size: 44, half: 22, faceVal: 1,   posVals: [-1, 0, 1]   },
  };
  // Move direction signs. coord+sign+deg. The sign is multiplied by faceVal at apply time.
  const RB_MOVES = {
    U:  { axis:'y', coord:1, sign:-1, deg: -90, inv:'Up' },
    Up: { axis:'y', coord:1, sign:-1, deg:  90, inv:'U'  },
    D:  { axis:'y', coord:1, sign: 1, deg:  90, inv:'Dp' },
    Dp: { axis:'y', coord:1, sign: 1, deg: -90, inv:'D'  },
    L:  { axis:'x', coord:0, sign:-1, deg: -90, inv:'Lp' },
    Lp: { axis:'x', coord:0, sign:-1, deg:  90, inv:'L'  },
    R:  { axis:'x', coord:0, sign: 1, deg:  90, inv:'Rp' },
    Rp: { axis:'x', coord:0, sign: 1, deg: -90, inv:'R'  },
    F:  { axis:'z', coord:2, sign: 1, deg:  90, inv:'Fp' },
    Fp: { axis:'z', coord:2, sign: 1, deg: -90, inv:'F'  },
    B:  { axis:'z', coord:2, sign:-1, deg: -90, inv:'Bp' },
    Bp: { axis:'z', coord:2, sign:-1, deg:  90, inv:'B'  },
    // Middle slices (3x3 only). Direction conventions:
    //   M follows L (axis x, slice center 0)
    //   E follows D (axis y, slice center 0)
    //   S follows F (axis z, slice center 0)
    M:  { axis:'x', coord:0, mid: true, deg: -90, inv:'Mp' },
    Mp: { axis:'x', coord:0, mid: true, deg:  90, inv:'M'  },
    E:  { axis:'y', coord:1, mid: true, deg:  90, inv:'Ep' },
    Ep: { axis:'y', coord:1, mid: true, deg: -90, inv:'E'  },
    S:  { axis:'z', coord:2, mid: true, deg:  90, inv:'Sp' },
    Sp: { axis:'z', coord:2, mid: true, deg: -90, inv:'S'  },
  };

  function rotVec(v, axis, deg) {
    const [x, y, z] = v;
    if (axis === 'x') return deg ===  90 ? [x, -z,  y] : [x,  z, -y];
    if (axis === 'y') return deg ===  90 ? [z,  y, -x] : [-z,  y,  x];
    return                   deg ===  90 ? [-y,  x,  z] : [ y, -x,  z];
  }

  let rb_mode = 2;
  let rb_state = null;       // [{el, pos:[x,y,z], rot: string}, ...]
  let rb_busy = false;
  let rb_count = 0;
  let rb_initialized = false;
  let rb_history = [];
  let rb_solving = false;
  let rb_abortSolve = false;
  // Camera rotation (drag-to-rotate). Initial values match CSS defaults.
  let rb_camX = -22;
  let rb_camY = -32;
  // PB timer: starts on first user move after a scramble, stops when solved.
  let rb_timerStart = 0;     // perf.now timestamp
  let rb_timerActive = false;
  let rb_timerScrambled = false; // true after a scramble; false after reset/solve
  let rb_timerRAF = 0;

  function rubikRenderTransform(c) {
    const [x, y, z] = c.pos;
    const cfg = RB_MODES[rb_mode];
    // Multiplier such that adjacent cubies touch: centers are SIZE apart.
    // For 2x2 pos = ±0.5 → centers ±SIZE/2 = ±half. Box = 2·half = size. ✓
    // For 3x3 pos ∈ {-1,0,+1} → centers separated by SIZE. ✓
    const k = cfg.size;
    return `translate3d(${x * k}px, ${y * k}px, ${z * k}px) ${c.rot}`;
  }

  function rubikBuild() {
    const root = document.getElementById('rubikCubies');
    if (!root) return;
    const cfg = RB_MODES[rb_mode];
    root.style.setProperty('--rb-size', cfg.size + 'px');
    root.style.setProperty('--rb-half', cfg.half + 'px');
    root.innerHTML = '';
    rb_state = [];
    for (const x of cfg.posVals) for (const y of cfg.posVals) for (const z of cfg.posVals) {
      // Skip fully internal cubies (only matters for 3x3+: the very center).
      const isInner = cfg.posVals.includes(0) && x === 0 && y === 0 && z === 0;
      if (isInner) continue;
      const el = document.createElement('div');
      el.className = 'rubik__cubie';
      // Each cubie carries 6 stickers; only the outward-facing ones are visible (others overlap inside).
      for (const f of RB_FACES) {
        const s = document.createElement('span');
        s.className = `rubik__sticker rubik__sticker--${f}`;
        el.appendChild(s);
      }
      const c = { el, pos: [x, y, z], rot: '' };
      el.style.transform = rubikRenderTransform(c);
      root.appendChild(el);
      rb_state.push(c);
    }
  }

  function rubikUpdateStats(lastMove) {
    const cnt = document.getElementById('rubikCount');
    const lst = document.getElementById('rubikLast');
    if (cnt) cnt.textContent = rb_count;
    if (lst && lastMove) lst.textContent = lastMove.replace('p', "'");
    updateRubikSolveButton();
  }

  function setRubikControlsDisabled(disabled) {
    const controls = document.querySelectorAll('#rubikMovePad button, #rubikScramble, #rubikReset, [data-rb-mode], #rubikSolve');
    controls.forEach(btn => {
      const isSolve = btn.id === 'rubikSolve';
      btn.disabled = isSolve
        ? disabled || rb_history.length === 0
        : disabled;
    });
  }

  function updateRubikSolveButton() {
    const solveBtn = document.getElementById('rubikSolve');
    if (!solveBtn) return;
    const disabled = rb_solving || rb_busy || rb_history.length === 0;
    solveBtn.disabled = disabled;
    solveBtn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  }

  function fmtMs(ms) {
    const totalCs = Math.floor(ms / 10);          // centiseconds
    const cs = totalCs % 100;
    const totalSec = Math.floor(totalCs / 100);
    const sec = totalSec % 60;
    const min = Math.floor(totalSec / 60);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  }

  function rubikIsSolved() {
    if (!rb_state) return true;
    // Solved when every cubie is back to its initial position with identity orientation.
    // We track orientation via the appended rotation string: empty string == identity.
    return rb_state.every(c => {
      // pos must equal "initial" position. We don't store initial separately, but the build
      // function created cubies in canonical positions matching their indices.
      // Easier check: each cubie's rot string must collapse to a multiple-of-360 rotation.
      // We compare against a snapshot taken at build time — simpler.
      return c.rot === '' || c.rot.replace(/\s/g, '') === '';
    });
  }

  function rubikTimerTick() {
    if (!rb_timerActive) return;
    const el = document.getElementById('rubikTime');
    if (el) el.textContent = fmtMs(performance.now() - rb_timerStart);
    rb_timerRAF = requestAnimationFrame(rubikTimerTick);
  }

  function rubikTimerStart() {
    if (rb_timerActive) return;
    rb_timerActive = true;
    rb_timerStart = performance.now();
    rubikTimerTick();
  }

  function rubikTimerStop() {
    if (!rb_timerActive) return performance.now();
    rb_timerActive = false;
    cancelAnimationFrame(rb_timerRAF);
    return performance.now();
  }

  function rubikTimerReset() {
    rubikTimerStop();
    rb_timerScrambled = false;
    const el = document.getElementById('rubikTime');
    if (el) el.textContent = '00:00.00';
  }

  function rubikLoadPB() {
    const key = `rubik_pb_${rb_mode}`;
    const v = parseFloat(localStorage.getItem(key) || '0');
    const el = document.getElementById('rubikPB');
    if (el) el.textContent = v > 0 ? fmtMs(v) : '—';
  }

  function rubikSavePB(ms) {
    const key = `rubik_pb_${rb_mode}`;
    const prev = parseFloat(localStorage.getItem(key) || '0');
    if (prev === 0 || ms < prev) {
      localStorage.setItem(key, String(ms));
      const el = document.getElementById('rubikPB');
      if (el) el.textContent = fmtMs(ms);
      return true;
    }
    return false;
  }

  function rubikResetState() {
    rb_abortSolve = true;
    rb_solving = false;
    setRubikControlsDisabled(false);
    rubikBuild();
    rb_count = 0;
    rb_history = [];
    rubikUpdateStats();
    const lst = document.getElementById('rubikLast');
    if (lst) lst.textContent = '—';
    rubikTimerReset();
    rubikLoadPB();
    updateRubikSolveButton();
  }

  function rubikSetMode(m) {
    if (rb_busy || rb_solving) return;
    if (m !== 2 && m !== 3) return;
    if (m === rb_mode) return;
    rb_mode = m;
    rubik.el?.setAttribute('data-rb-mode', String(m));
    document.querySelectorAll('.rubik__mode [data-rb-mode]').forEach(b => {
      const active = parseInt(b.dataset.rbMode, 10) === m;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    rubikResetState();
  }

  function rubikInit() {
    if (rb_initialized) return;
    rb_initialized = true;
    rubikBuild();
    rubikUpdateStats();
    rubikLoadPB();
    updateRubikSolveButton();

    document.getElementById('rubikMovePad')?.addEventListener('click', e => {
      const btn = e.target.closest('button[data-move]');
      if (!btn || rb_busy || rb_solving) return;
      applyMove(btn.dataset.move, true);
    });
    document.getElementById('rubikScramble')?.addEventListener('click', () => {
      if (rb_busy || rb_solving) return;
      rubikScramble(rb_mode === 3 ? 25 : 15);
    });
    document.getElementById('rubikSolve')?.addEventListener('click', () => {
      if (rb_busy || rb_solving || rb_history.length === 0) return;
      rubikAutoSolve();
    });
    document.getElementById('rubikReset')?.addEventListener('click', () => {
      if (rb_busy || rb_solving) return;
      rubikResetState();
    });
    document.querySelectorAll('[data-rb-mode]').forEach(b => {
      b.addEventListener('click', () => {
        rubikSetMode(parseInt(b.dataset.rbMode, 10));
      });
    });

    // Drag-to-rotate camera (pointer events: covers mouse + touch + pen)
    const stage = rubik.el?.querySelector('.rubik__stage');
    const scene = rubik.el?.querySelector('.rubik__scene');
    if (stage && scene) {
      let dragging = false, lastX = 0, lastY = 0, ptrId = null;

      const applyCam = () => {
        scene.style.transform = `rotateX(${rb_camX}deg) rotateY(${rb_camY}deg)`;
      };
      // Apply once so JS owns the transform from the start.
      applyCam();

      stage.addEventListener('pointerdown', e => {
        dragging = true;
        ptrId = e.pointerId;
        lastX = e.clientX;
        lastY = e.clientY;
        stage.setPointerCapture(ptrId);
        stage.classList.add('is-dragging');
      });
      stage.addEventListener('pointermove', e => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        rb_camY += dx * 0.5;
        rb_camX -= dy * 0.5;
        // Clamp pitch so we never look exactly along the Y axis (avoids gimbal weirdness).
        if (rb_camX >  85) rb_camX =  85;
        if (rb_camX < -85) rb_camX = -85;
        applyCam();
      });
      const endDrag = e => {
        if (!dragging) return;
        dragging = false;
        try { stage.releasePointerCapture(ptrId); } catch (_) {}
        stage.classList.remove('is-dragging');
      };
      stage.addEventListener('pointerup', endDrag);
      stage.addEventListener('pointercancel', endDrag);
      stage.addEventListener('lostpointercapture', endDrag);

      // Double-click resets the camera to default angle.
      stage.addEventListener('dblclick', () => {
        rb_camX = -22;
        rb_camY = -32;
        scene.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        applyCam();
        setTimeout(() => { scene.style.transition = ''; }, 420);
      });
    }
  }

  function applyMove(name, fromUser) {
    const m = RB_MOVES[name];
    if (!m || rb_busy) return Promise.resolve();
    rb_busy = true;

    // Pick affected cubies
    const layer = document.createElement('div');
    layer.className = 'rubik__layer';
    const root = document.getElementById('rubikCubies');
    if (!root) { rb_busy = false; return Promise.resolve(); }

    // Slice moves only exist on 3×3 (nothing has pos === 0 in 2×2).
    if (m.mid && rb_mode !== 3) { rb_busy = false; return Promise.resolve(); }

    const faceVal = RB_MODES[rb_mode].faceVal;
    const targetVal = m.mid ? 0 : m.sign * faceVal;
    const affected = rb_state.filter(c => c.pos[m.coord] === targetVal);
    affected.forEach(c => layer.appendChild(c.el));
    root.appendChild(layer);

    // Force layout to register the layer with current transforms
    // before applying its rotation.
    void layer.offsetWidth;

    // Animate the layer rotating around the cube center on the chosen axis
    const axisMap = { x: 'X', y: 'Y', z: 'Z' };
    layer.style.transform = `rotate${axisMap[m.axis]}(${m.deg}deg)`;

    return new Promise(resolve => {
      setTimeout(() => {
        // Commit: compute final pos/rot for each affected cubie, set transform,
        // and reparent back to root (without flicker).
        affected.forEach(c => {
          c.pos = rotVec(c.pos, m.axis, m.deg);
          c.rot = `rotate${axisMap[m.axis]}(${m.deg}deg) ${c.rot}`;
          // Apply final transform BEFORE reparenting (still in rotated layer it
          // would render wrong, so we move it to root immediately after).
          c.el.style.transform = rubikRenderTransform(c);
          root.appendChild(c.el);
        });
        layer.remove();

        if (fromUser) {
          rb_count++;
          rb_history.push(name);
          rubikUpdateStats(name);
          // Start timer on first user move after a scramble
          if (rb_timerScrambled && !rb_timerActive) rubikTimerStart();
          // Detect solved state
          if (rb_timerActive && rubikIsSolved()) {
            const elapsed = rubikTimerStop() - rb_timerStart;
            rb_timerScrambled = false;
            const isPB = rubikSavePB(elapsed);
            const tEl = document.getElementById('rubikTime');
            if (tEl) tEl.textContent = fmtMs(elapsed) + (isPB ? ' · PB!' : '');
          }
        }
        rb_busy = false;
        updateRubikSolveButton();
        resolve();
      }, RB_ANIM + 20);
    });
  }

  async function rubikScramble(n) {
    if (rb_busy || rb_solving) return;
    rb_abortSolve = false;
    rubikTimerReset();
    // Only face moves in scrambles (no slices), and only the ones that make sense per mode.
    const moves = Object.keys(RB_MOVES).filter(k => !RB_MOVES[k].mid);
    let last = '';
    for (let i = 0; i < n; i++) {
      let m;
      do { m = moves[Math.floor(Math.random() * moves.length)]; }
      while (m === last || m === RB_MOVES[last]?.inv);
      last = m;
      rb_count++;
      rb_history.push(m);
      rubikUpdateStats(m);
      await applyMove(m, false);
    }
    // Ready for the user's solve attempt
    rb_timerScrambled = true;
    const tEl = document.getElementById('rubikTime');
    if (tEl) tEl.textContent = '00:00.00';
    updateRubikSolveButton();
  }

  async function rubikAutoSolve() {
    if (rb_solving || rb_busy || rb_history.length === 0) return;
    rb_solving = true;
    rb_abortSolve = false;
    rubikTimerStop();
    rb_timerScrambled = false;
    setMode('SOLVE');
    setRubikControlsDisabled(true);

    while (rb_history.length && !rb_abortSolve && rubik.isOpen()) {
      const last = rb_history[rb_history.length - 1];
      const inv = RB_MOVES[last]?.inv;
      if (!inv) {
        rb_history.pop();
        continue;
      }
      await applyMove(inv, false);
      rb_history.pop();
      rb_count++;
      rubikUpdateStats(inv);
      await new Promise(r => setTimeout(r, 180));
    }

    if (!rb_abortSolve && rubik.isOpen()) {
      const lastEl = document.getElementById('rubikLast');
      if (lastEl) lastEl.textContent = '✓';
    }

    rb_solving = false;
    setRubikControlsDisabled(false);
    updateRubikSolveButton();
    if (rubik.isOpen()) setMode('RUBIK');
  }

  // Keyboard shortcuts inside the overlay
  document.addEventListener('keydown', e => {
    if (!rubik.isOpen()) return;
    if (e.target.matches('input, textarea')) return;
    const k = e.key;
    if (k === 'Escape') return; // global handler closes
    if (rb_solving) return;
    const upper = k.toUpperCase();
    if ('UDLRFB'.includes(upper)) {
      e.preventDefault();
      const move = e.shiftKey ? upper + 'p' : upper;
      if (RB_MOVES[move]) applyMove(move, true);
    } else if ('MES'.includes(upper) && rb_mode === 3) {
      e.preventDefault();
      const move = e.shiftKey ? upper + 'p' : upper;
      if (RB_MOVES[move]) applyMove(move, true);
    } else if (k === ' ') {
      e.preventDefault();
      rubikScramble(rb_mode === 3 ? 25 : 15);
    } else if (k === '0') {
      e.preventDefault();
      document.getElementById('rubikReset')?.click();
    }
  });

  /* ── Interactive shell (hero) ──────────────────────────── */
  function initShell() {
    const input = document.getElementById('shellInput');
    const log = document.getElementById('shellLog');
    const line = document.querySelector('.shell__inputline');
    if (!input || !log) return;

    const shHistory = [];
    let shIdx = 0;
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const t = (key, fb) => (window.i18n && window.i18n.t(key)) || fb;

    function print(html, cls) {
      const div = document.createElement('div');
      div.className = 'shell__line' + (cls ? ' shell__line--' + cls : '');
      div.innerHTML = html;
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;
    }
    function printCmd(cmd) { print('<span class="shell__ps">$</span>' + esc(cmd), 'cmd'); }
    function goto(sel, label) {
      const target = document.querySelector(sel);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return '→ ' + esc(label);
    }

    // Comandos que devuelven texto (HTML) o disparan un overlay.
    const COMMANDS = {
      help() {
        return 'navegación: <span class="ansi-cyan">about · experience · modules · projects · skills · education · contact</span><br>'
             + 'programas:  <span class="ansi-cyan">hire · man · htop · rubik · build · branches · history · vim &lt;módulo&gt;</span><br>'
             + 'sistema:    <span class="ansi-cyan">ls · cat about · whoami · neofetch · date · uname · echo · theme · lang · clear</span><br>'
             + 'enlaces:    <span class="ansi-cyan">gh · linkedin · cv</span>';
      },
      ls() { return '<span class="ansi-blue">about.md  experience/  modules/  projects.json  skills.list  education.man  contact</span>'; },
      whoami() { return 'jesus'; },
      id() { return 'uid=1000(jesus) gid=1000(devs) groups=27(sudo),999(odoo)'; },
      pwd() { return '/home/jesus'; },
      uname() { return 'Linux portfolio 6.x x86_64 GNU/Linux · RHEL certified'; },
      date() { return esc(document.getElementById('topbarClock')?.textContent || new Date().toString()); },
      neofetch() {
        return [
          'os        Linux x86_64 · RHEL Certified',
          'stack     Python · PostgreSQL · Odoo 17/18/19',
          'specialty CFDI · ERP · REST · XML-RPC',
          'uptime    ' + esc(t('neofetch_uptime', '23 módulos · 10 clientes · 3 certs')),
        ].join('<br>');
      },
      about() { return [t('about_desc1', ''), t('about_desc2', '')].filter(Boolean).map(esc).join('<br>'); },
      skills() { return goto('#skills', t('cmd_skills', 'skills')); },
      projects() { return goto('#projects', t('cmd_projects', 'projects')); },
      experience() { return goto('#experience', t('cmd_experience', 'experience')); },
      modules() { return goto('#modules', t('cmd_modules', 'modules')); },
      education() { return goto('#education', t('cmd_education', 'education')); },
      contact() { return goto('#contact', t('cmd_contact', 'contact')); },
      cv() { document.getElementById('btnCv')?.click(); return 'wget cv.pdf … ✓'; },
      hire() { openHire(); return './hire --info-pack'; },
      man() { openMan(); return 'man jesus'; },
      htop() { openHtop(); return 'htop'; },
      rubik() { openRubik(); return './rubik'; },
      build() { openBuild(); return './build --all'; },
      branches() { openBranches(); return 'git branch -v'; },
      colorscheme() { openScheme(); return ':colorscheme'; },
      gh() { window.open('https://github.com/jesusgarzag', '_blank', 'noopener'); return 'github.com/jesusgarzag ↗'; },
      linkedin() { window.open('https://www.linkedin.com/in/jesusgarzacia', '_blank', 'noopener'); return '/in/jesusgarzacia ↗'; },
      fortune() { return esc(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]); },
      exit() { return 'No hay salida 😄 (Esc cierra los overlays)'; },
      sl() { return '🚂💨  choo choo — (¿quisiste decir <span class="ansi-cyan">ls</span>?)'; },
    };
    // Alias de comandos.
    const ALIAS = { git: 'branches', github: 'gh', mail: 'contact', certs: 'education', exp: 'experience', historia: 'history' };

    function run(raw) {
      const argv = raw.trim().split(/\s+/);
      let cmd = (argv.shift() || '').toLowerCase();
      const arg = argv.join(' ');
      if (ALIAS[cmd]) cmd = ALIAS[cmd];
      if (cmd === '') return;

      if (cmd === 'clear') { log.innerHTML = ''; return; }
      if (cmd === 'history') { openHistory(); print('history'); return; }
      if (cmd === 'echo') { print(esc(arg) || ' '); return; }
      if (cmd === 'ls' && /mod/.test(arg)) { print(goto('#modules', 'modules/')); return; }
      if (cmd === 'cat') {
        const f = (argv[0] || '').replace('.md', '').replace('/', '');
        if (f === 'about') print(COMMANDS.about());
        else if (!f) print('uso: cat &lt;archivo&gt;', 'err');
        else print('cat: ' + esc(argv[0]) + ': No such file or directory', 'err');
        return;
      }
      if (cmd === 'theme') {
        if (arg === 'light' || arg === 'dark') { window.scheme?.set(arg); print('theme → ' + arg); }
        else { document.getElementById('themeToggle')?.click(); print('theme toggled'); }
        return;
      }
      if (cmd === 'lang') {
        const l = (argv[0] || '').toLowerCase();
        if (l === 'es' || l === 'en') { window.i18n?.set(l); print('lang → ' + l); }
        else print('uso: lang [es|en]', 'err');
        return;
      }
      if (cmd === 'vim') {
        const key = (argv[0] || 'aged_days').replace(/\.py$/, '');
        openVim(key);
        print('vim ~/modules/' + esc(key));
        return;
      }
      if (cmd === 'sudo') {
        if (argv[0] === 'hire') { openHire(); print('[sudo] acceso concedido · ./hire'); }
        else print('jesus is not in the sudoers file. This incident will be reported. 👀', 'err');
        return;
      }

      const fn = COMMANDS[cmd];
      if (typeof fn === 'function') {
        const out = fn(arg);
        if (Array.isArray(out)) out.forEach(o => print(o));
        else if (out != null) print(out);
      } else {
        print(esc(cmd) + ': command not found — escribe <span class="ansi-cyan">help</span>', 'err');
      }
    }

    function submit() {
      const raw = input.value;
      printCmd(raw);
      if (raw.trim()) shHistory.push(raw);
      shIdx = shHistory.length;
      input.value = '';
      run(raw);
    }

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); submit(); return; }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (shHistory.length && shIdx > 0) { shIdx--; input.value = shHistory[shIdx]; }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (shIdx < shHistory.length - 1) { shIdx++; input.value = shHistory[shIdx]; }
        else { shIdx = shHistory.length; input.value = ''; }
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const cur = input.value.trim().toLowerCase();
        if (!cur) return;
        const names = Object.keys(COMMANDS).concat(Object.keys(ALIAS));
        const matches = names.filter(k => k.startsWith(cur));
        if (matches.length === 1) input.value = matches[0];
        else if (matches.length > 1) print(matches.sort().join('  '), 'sys');
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') { e.preventDefault(); log.innerHTML = ''; }
    });

    // Clic en cualquier parte de la línea enfoca el input.
    line?.addEventListener('click', () => input.focus());
  }

  /* ── Boot ──────────────────────────────────────────────── */
  initTyping();
  initShell();
  renderHistory();
  showFortune();
  updateStatus();
  window.addEventListener('scroll', updateStatus, { passive: true });
  window.addEventListener('resize', updateStatus);

  // Re-run typing on language change so the typed prompt stays in sync
  // (whoami is the same in both languages, so we only re-run if data-typed changed)
})();
