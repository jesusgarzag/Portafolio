(function () {
  var box = document.getElementById('console');
  var log = document.getElementById('consoleLog');
  var input = document.getElementById('consoleInput');
  var closeBtn = document.getElementById('consoleClose');
  if (!box || !log || !input) return;
  var D = window.PORTFOLIO || { stats: {}, modules: [], areas: {} };
  var hist = [];
  var hi = -1;
  var greeted = false;
  var CASES = ['tesoreria', 'edi', 'cfdi', 'imss', 'ptu', 'banxico', 'sepomex'];

  function lang() { return (window.i18n && window.i18n.current) || 'es'; }
  function tr(es, en) { return lang() === 'en' ? en : es; }
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }

  function out(html, cls) {
    var p = document.createElement('div');
    p.className = 'console__out' + (cls ? ' console__out--' + cls : '');
    p.innerHTML = html;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
  }

  var CMDS = {
    help: function () {
      out(tr('Comandos disponibles:', 'Available commands:'), 'dim');
      [
        ['whoami', tr('quién soy', 'who I am')],
        ['stats', tr('números del último año', 'last year in numbers')],
        ['ls', tr('casos en video', 'video case studies')],
        ['play &lt;caso&gt;', tr('reproduce un caso', 'plays a case')],
        ['code &lt;caso&gt;', tr('abre el código real', 'opens the real code')],
        ['modules [texto|v19|área]', tr('busca en el catálogo', 'searches the catalog')],
        ['theme [dark|light]', tr('cambia el tema', 'switches theme')],
        ['lang [es|en]', tr('cambia el idioma', 'switches language')],
        ['cv', tr('descarga el CV', 'downloads the résumé')],
        ['mail', tr('escríbeme', 'email me')],
        ['v3', tr('abre la versión terminal', 'opens the terminal version')],
        ['clear · exit', '']
      ].forEach(function (r) { out('<span class="console__k">' + r[0] + '</span><span class="console__d">' + r[1] + '</span>', 'row'); });
    },
    whoami: function () {
      out('<b>Jesús Gerardo Garza García</b> · ' + tr('desarrollador Odoo · Monterrey, MX', 'Odoo developer · Monterrey, MX'));
      out(tr('CFDI 4.0, nómina e IMSS, tesorería, EDI e integraciones sobre Odoo 17, 18 y 19.', 'CFDI 4.0, payroll & IMSS, treasury, EDI and integrations on Odoo 17, 18 and 19.'), 'dim');
    },
    stats: function () {
      var s = D.stats || {};
      out('modules   <b>' + s.modules + '</b>');
      out('clients   <b>' + s.clients + '</b>');
      out('python    <b>' + (s.py || 0).toLocaleString('en-US') + '</b> ' + tr('líneas', 'lines'));
      out('total     <b>' + (s.loc || 0).toLocaleString('en-US') + '</b> ' + tr('líneas', 'lines'));
      out('tests     <b>' + s.tests + '</b>');
      out('odoo      v17 ' + s.v17 + ' · v18 ' + s.v18 + ' · v19 ' + s.v19);
    },
    ls: function () {
      CASES.forEach(function (k) {
        var sc = window.Scenes && window.Scenes[k];
        if (sc) out('<span class="console__k">' + k + '</span><span class="console__d">' + esc((sc.title && (sc.title[lang()] || sc.title.es)) || '') + '</span>', 'row');
      });
      out(tr('usa: play tesoreria', 'try: play tesoreria'), 'dim');
    },
    play: function (a) {
      var k = norm(a[0]);
      if (CASES.indexOf(k) < 0) { out(tr('caso desconocido. prueba: ls', 'unknown case. try: ls'), 'err'); return; }
      out('▶ ' + k, 'ok');
      close();
      setTimeout(function () { window.goScene && window.goScene(k); }, 200);
    },
    code: function (a) {
      var k = norm(a[0]);
      if (!D.snippets || !D.snippets[k]) { out(tr('sin código para ese caso', 'no code for that case'), 'err'); return; }
      close();
      setTimeout(function () {
        var b = document.createElement('button');
        b.setAttribute('data-code', k === 'cfdi' ? 'cfdi,hidro' : k);
        b.hidden = true;
        document.body.appendChild(b);
        b.click();
        b.remove();
      }, 150);
    },
    modules: function (a) {
      var q = norm(a.join(' '));
      var list = D.modules.filter(function (m) {
        if (!q) return true;
        if (/^v1[789]$/.test(q)) return 'v' + m.v === q;
        var hay = norm([m.t.es, m.t.en, m.d.es, m.d.en, m.a, (D.areas[m.a] || {}).es, (D.areas[m.a] || {}).en].join(' '));
        return q.split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
      });
      out(list.length + ' ' + tr('módulos', 'modules'), 'ok');
      list.slice(0, 12).forEach(function (m) {
        out('<span class="console__k">v' + m.v + '</span><span class="console__d">' + esc(m.t[lang()] || m.t.es) + ' <span class="console__dim">' + esc((D.areas[m.a] || {})[lang()] || '') + '</span></span>', 'row');
      });
      if (list.length > 12) out('… +' + (list.length - 12), 'dim');
    },
    theme: function (a) {
      var want = norm(a[0]);
      var cur = document.documentElement.getAttribute('data-theme');
      if (want && want === cur) { out('theme: ' + cur, 'dim'); return; }
      var btn = document.getElementById('themeBtn');
      if (btn) btn.click();
      out('theme → ' + (cur === 'light' ? 'dark' : 'light'), 'ok');
    },
    lang: function (a) {
      var want = norm(a[0]) || (lang() === 'es' ? 'en' : 'es');
      if (want !== 'es' && want !== 'en') { out('lang es | en', 'err'); return; }
      if (window.i18n) window.i18n.set(want);
      out('lang → ' + want, 'ok');
    },
    cv: function () {
      var x = document.createElement('a');
      x.href = 'assets/certificados/cv_' + lang() + '.pdf';
      x.download = '';
      document.body.appendChild(x);
      x.click();
      x.remove();
      out(tr('descargando CV…', 'downloading résumé…'), 'ok');
    },
    mail: function () {
      out('jesusgarzacia@hotmail.com', 'ok');
      location.href = 'mailto:jesusgarzacia@hotmail.com';
    },
    v3: function () {
      out(tr('abriendo la versión terminal…', 'opening the terminal version…'), 'ok');
      window.open('https://terminal.jesusgarza.pages.dev/', '_blank', 'noopener');
    },
    sudo: function (a) {
      if (norm(a.join(' ')) === 'hire') {
        out(tr('[sudo] contraseña para reclutador: ••••••••', '[sudo] password for recruiter: ••••••••'), 'dim');
        out(tr('acceso concedido. te llevo al formulario ✓', 'access granted. taking you to the form ✓'), 'ok');
        close();
        setTimeout(function () { var c = document.getElementById('contacto'); if (c) c.scrollIntoView({ behavior: 'smooth' }); }, 300);
        return;
      }
      out(tr('jesus no está en el archivo sudoers. este incidente será reportado.', 'jesus is not in the sudoers file. this incident will be reported.'), 'err');
    },
    clear: function () { log.innerHTML = ''; },
    exit: function () { close(); }
  };
  CMDS.terminal = CMDS.v3;
  CMDS.contact = CMDS.mail;

  function run(line) {
    var raw = line.trim();
    out('<span class="console__ps">jesus@sello:~$</span> ' + esc(raw), 'cmd');
    if (!raw) return;
    hist.unshift(raw);
    hi = -1;
    var parts = raw.split(/\s+/);
    var name = norm(parts.shift());
    var fn = CMDS[name];
    if (fn) fn(parts);
    else out(name + ': ' + tr('comando no encontrado. escribe help', 'command not found. type help'), 'err');
  }

  function complete() {
    var v = input.value;
    var parts = v.split(/\s+/);
    if (parts.length === 1) {
      var m = Object.keys(CMDS).filter(function (k) { return k.indexOf(norm(parts[0])) === 0; });
      if (m.length === 1) input.value = m[0] + ' ';
      else if (m.length > 1) out(m.join('  '), 'dim');
    } else if (parts[0] === 'play' || parts[0] === 'code') {
      var c = CASES.filter(function (k) { return k.indexOf(norm(parts[1])) === 0; });
      if (c.length === 1) input.value = parts[0] + ' ' + c[0];
      else if (c.length > 1) out(c.join('  '), 'dim');
    }
  }

  function open() {
    if (!box.hidden) { input.focus(); return; }
    box.hidden = false;
    if (window.gsap && !document.documentElement.classList.contains('reduced')) {
      window.gsap.fromTo(box, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'expo.out' });
    }
    if (!greeted) {
      greeted = true;
      out(tr('sello v4 · consola. escribe <b>help</b> para ver comandos.', 'sello v4 · console. type <b>help</b> to see commands.'), 'dim');
    }
    setTimeout(function () { input.focus(); }, 30);
  }
  function close() {
    if (box.hidden) return;
    if (window.gsap && !document.documentElement.classList.contains('reduced')) {
      window.gsap.to(box, { y: 20, opacity: 0, duration: 0.25, ease: 'power2.in', onComplete: function () { box.hidden = true; } });
    } else box.hidden = true;
  }

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi < hist.length - 1) { hi++; input.value = hist[hi]; } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (hi > 0) { hi--; input.value = hist[hi]; } else { hi = -1; input.value = ''; } }
    else if (e.key === 'Tab') { e.preventDefault(); complete(); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); log.innerHTML = ''; }
  });
  if (closeBtn) closeBtn.addEventListener('click', close);
  log.addEventListener('click', function () { input.focus(); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== '`' && e.key !== 'Dead') return;
    if (e.key === 'Dead' && e.code !== 'Backquote' && e.code !== 'BracketLeft') return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) && t !== input) return;
    e.preventDefault();
    if (box.hidden) open(); else close();
  });

  window.Console = { open: open, close: close, run: run };
})();
