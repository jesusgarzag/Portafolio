(function () {
  var root = document.documentElement;
  var reduced = root.classList.contains('reduced');
  var D = window.PORTFOLIO || { stats: {}, modules: [], clients: [], cadence: [], areas: {}, snippets: {} };
  var gsap = window.gsap;
  var hasGsap = !!gsap;
  var mqFine = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : { matches: false };

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function lang() { return (window.i18n && window.i18n.current) || 'es'; }
  function L(o) { if (o == null) return ''; if (typeof o === 'string') return o; return o[lang()] != null ? o[lang()] : o.es; }
  function t(key, fallback) { var v = window.i18n && window.i18n.t(key); return v != null ? v : fallback; }
  function fmt(n) { return Number(n).toLocaleString('en-US'); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function norm(s) { return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  }
  function debounce(fn, ms) {
    var id;
    return function () { var a = arguments, s = this; clearTimeout(id); id = setTimeout(function () { fn.apply(s, a); }, ms); };
  }

  if (hasGsap) {
    var plugins = [window.ScrollTrigger, window.MotionPathPlugin, window.DrawSVGPlugin, window.SplitText, window.ScrambleTextPlugin, window.CustomEase].filter(Boolean);
    gsap.registerPlugin.apply(gsap, plugins);
    if (window.CustomEase) CustomEase.create('sello', 'M0,0 C0.16,1 0.3,1 1,1');
    gsap.defaults({ ease: 'power3.out' });
  }

  if (window.Guilloche) Guilloche.textures();

  var toastEl = $('#toast');
  var toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    if (hasGsap) gsap.fromTo(toastEl, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 });
    clearTimeout(toastT);
    toastT = setTimeout(function () {
      if (hasGsap) gsap.to(toastEl, { y: 10, opacity: 0, duration: 0.3, onComplete: function () { toastEl.hidden = true; } });
      else toastEl.hidden = true;
    }, 2200);
  }

  var seal = null;

  function setTheme(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    $$('meta[name="theme-color"]').forEach(function (m) { m.setAttribute('content', next === 'light' ? '#f3eee4' : '#07090c'); });
    if (window.Guilloche) Guilloche.retheme();
    if (seal) { seal.build(); seal.draw(); }
    if (introSeal) { introSeal.build(); introSeal.draw(); }
  }
  var themeBtn = $('#themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', function (e) {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      var r = themeBtn.getBoundingClientRect();
      root.style.setProperty('--vt-x', (r.left + r.width / 2) + 'px');
      root.style.setProperty('--vt-y', (r.top + r.height / 2) + 'px');
      if (document.startViewTransition && !reduced) {
        document.startViewTransition(function () { setTheme(next); });
      } else {
        setTheme(next);
      }
    });
  }

  var hdr = $('#hdr');
  var bar = $('#progressBar');
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.parentNode.style.setProperty('--p', h > 0 ? (y / h).toFixed(4) : 0);
    if (hdr) {
      hdr.classList.toggle('is-scrolled', y > 8);
      var menuOpen = document.body.classList.contains('menu-open');
      if (!menuOpen && y > window.innerHeight * 0.9 && y > lastY + 4) hdr.classList.add('is-hidden');
      else if (y < lastY - 4 || y < window.innerHeight * 0.5) hdr.classList.remove('is-hidden');
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  var navLinks = $$('.nav a[data-nav]');
  var idxLinks = $$('.cases__index a');
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-nav') === id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['impacto', 'casos', 'modulos', 'perfil', 'contacto'].forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
    var hero = $('#top');
    if (hero) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) navLinks.forEach(function (a) { a.classList.remove('is-active'); }); });
      }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
    }
    var caseSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        idxLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    $$('.case[id]').forEach(function (c) { caseSpy.observe(c); });
  }

  var menu = $('#menu');
  var menuBtn = $('#menuBtn');
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('menu-open', open);
    document.body.classList.toggle('is-locked', open);
    if (open) {
      menu.hidden = false;
      if (hdr) hdr.classList.remove('is-hidden');
      if (hasGsap && !reduced) {
        gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'expo.out' });
        gsap.fromTo($$('.menu__nav a', menu), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, delay: 0.1, ease: 'expo.out' });
      }
    } else if (hasGsap && !reduced && !menu.hidden) {
      gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.45, ease: 'expo.in', onComplete: function () { menu.hidden = true; menu.style.clipPath = ''; } });
    } else {
      menu.hidden = true;
    }
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
  if (menu) menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) setMenu(false); });
  window.addEventListener('resize', debounce(function () { if (window.innerWidth >= 1024 && document.body.classList.contains('menu-open')) setMenu(false); }, 150));

  var sealCanvas = $('#seal');
  if (sealCanvas && window.Guilloche) {
    seal = new Guilloche.Seal(sealCanvas, { maxDpr: 1.75, reveal: reduced ? 1 : 0 });
    var heroEl = $('#top');
    var sealVisible = true;
    if ('IntersectionObserver' in window && heroEl) {
      new IntersectionObserver(function (en) {
        sealVisible = en[0].isIntersecting;
        if (reduced) return;
        if (sealVisible && !document.hidden) seal.start(); else seal.stop();
      }).observe(heroEl);
    }
    document.addEventListener('visibilitychange', function () {
      if (reduced) return;
      if (document.hidden) seal.stop(); else if (sealVisible) seal.start();
    });
    if (mqFine.matches && !reduced) {
      window.addEventListener('pointermove', function (e) {
        seal.pointer((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
      }, { passive: true });
    }
    window.addEventListener('resize', debounce(function () { seal.resize(); }, 200));
    if (reduced) { seal.reveal = 1; seal.draw(); }
    if (hasGsap && !reduced) {
      var art = $('.hero__art');
      gsap.set(art, { y: 0, yPercent: -54 });
      gsap.to(art, { yPercent: -42, ease: 'none', scrollTrigger: { trigger: '#top', start: 'top top', end: 'bottom top', scrub: true } });
    }
  }

  var introSeal = null;
  var intro = $('#intro');
  function heroIn() {
    var items = $$('[data-hero]');
    if (!hasGsap || reduced) {
      items.forEach(function (i) { i.style.opacity = 1; });
      if (seal) { seal.reveal = 1; seal.draw(); }
      runCounters($$('.hero__stats [data-count]'), true);
      startRot();
      return;
    }
    gsap.set(items, { opacity: 1 });
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    var nameSpans = $$('.hero__name .split-line > span');
    tl.from(nameSpans, { yPercent: 110, duration: 1.2, stagger: 0.09 }, 0);
    tl.from($$('.hero__eyebrow, .hero__claim, .hero__lead, .hero__cta, .hero__status'), { y: 26, opacity: 0, duration: 1, stagger: 0.07 }, 0.15);
    tl.from($('.hero__stats'), { y: 20, opacity: 0, duration: 1 }, 0.45);
    tl.from($$('.hero__ring, .hero__mono'), { opacity: 0, scale: 0.92, transformOrigin: '50% 50%', duration: 1.6 }, 0);
    if (seal) {
      seal.start();
      tl.to(seal, { reveal: 1, duration: 2.2, ease: 'power2.inOut' }, 0);
    }
    tl.add(function () { runCounters($$('.hero__stats [data-count]')); }, 0.5);
    tl.add(startRot, 1.2);
  }

  var folio = uuid();
  var folioEl = $('#folioUuid');
  if (folioEl) folioEl.textContent = folio;
  var folioSeal = $('#folioSeal');
  if (folioSeal) folioSeal.textContent = '||1.1|' + folio + '|' + new Date().toISOString().slice(0, 19) + '|JG|ODOO|MX|91|22||';

  var introDone = new Promise(function (resolve) {
    var seen = root.classList.contains('intro-skip');
    if (!intro || seen || reduced || !hasGsap || !window.Guilloche) {
      if (intro) intro.classList.add('is-done');
      resolve();
      return;
    }
    try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
    var c = $('#introSeal');
    introSeal = new Guilloche.Seal(c, { maxDpr: 2, reveal: 0, small: true });
    introSeal.start();
    var u = $('#introUuid');
    var tl = gsap.timeline({ onComplete: function () { intro.classList.add('is-done'); if (introSeal) introSeal.stop(); introSeal = null; } });
    tl.to(introSeal, { reveal: 1, duration: 1.15, ease: 'power2.inOut' }, 0);
    if (u && window.ScrambleTextPlugin) tl.to(u, { duration: 1.1, scrambleText: { text: folio, chars: '0123456789abcdef', speed: 0.6 } }, 0.05);
    else if (u) u.textContent = folio;
    tl.to(c, { scale: 0.84, duration: 0.5, ease: 'power3.in' }, 1.2);
    tl.to(intro, { clipPath: 'inset(0 0 100% 0)', duration: 0.75, ease: 'expo.inOut' }, 1.35);
    tl.add(resolve, 1.45);
  });
  var ROT = {
    es: ['el SAT', 'el IMSS', 'Banxico', 'SEPOMEX', 'tu banco', 'SAP', 'el PAC'],
    en: ['the SAT', 'IMSS', 'Banxico', 'SEPOMEX', 'your bank', 'SAP', 'the PAC']
  };
  var rotIdx = 0;
  var rotTimer = null;
  var rotEl = $('#rot');
  function rotWord() { return rotEl && $('.rot__word', rotEl); }
  function setRot(i, animate) {
    var w = rotWord();
    if (!w) return;
    var list = ROT[lang()] || ROT.es;
    var text = list[i % list.length];
    if (!animate || !hasGsap || reduced) { w.textContent = text; return; }
    var from = rotEl.getBoundingClientRect().width;
    gsap.to(w, {
      yPercent: -60, opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: function () {
        w.textContent = text;
        rotEl.style.width = 'auto';
        var to = rotEl.getBoundingClientRect().width;
        gsap.fromTo(rotEl, { width: from }, { width: to, duration: 0.45, ease: 'power3.inOut', onComplete: function () { rotEl.style.width = ''; } });
        gsap.fromTo(w, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: 'expo.out' });
      }
    });
  }
  var heroOnScreen = true;
  var claimEl = $('.hero__claim');
  function stabilizeClaim() {
    var w = rotWord();
    if (!claimEl || !w) return;
    var keep = w.textContent;
    claimEl.style.minHeight = '';
    var max = 0;
    (ROT[lang()] || ROT.es).forEach(function (word) {
      w.textContent = word;
      max = Math.max(max, claimEl.offsetHeight);
    });
    w.textContent = keep;
    claimEl.style.minHeight = max + 'px';
  }
  stabilizeClaim();
  window.addEventListener('resize', debounce(stabilizeClaim, 200));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(stabilizeClaim);
  if ('IntersectionObserver' in window && $('#top')) {
    new IntersectionObserver(function (en) { heroOnScreen = en[0].isIntersecting; }).observe($('#top'));
  }
  function startRot() {
    if (rotTimer || reduced) return;
    rotTimer = setInterval(function () {
      if (document.hidden || !heroOnScreen) return;
      rotIdx++;
      setRot(rotIdx, true);
    }, 2600);
  }

  function runCounters(els, instant) {
    els.forEach(function (el) {
      if (el.__counted) return;
      el.__counted = true;
      var target = parseFloat(el.getAttribute('data-count'));
      if (!hasGsap || reduced || instant) { el.textContent = fmt(target); return; }
      var o = { v: 0 };
      gsap.to(o, { v: target, duration: target > 1000 ? 1.8 : 1.3, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(Math.round(o.v)); } });
    });
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounters([en.target]); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    $$('[data-count]').forEach(function (el) { if (!el.closest('.hero__stats')) cio.observe(el); });
  }

  var reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); rio.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { rio.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  var splits = [];
  function makeSplit(el, animate) {
    if (!window.SplitText || reduced) return null;
    var rec = { el: el, done: !animate };
    rec.split = SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'sl',
      autoSplit: true,
      onSplit: function (self) {
        if (rec.done) return null;
        return gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.15,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true, onEnter: function () { rec.done = true; } }
        });
      }
    });
    return rec;
  }
  function initSplits() {
    splits = $$('[data-split]').map(function (el) { return makeSplit(el, true); }).filter(Boolean);
  }
  document.addEventListener('i18n:before', function () {
    splits.forEach(function (s) { if (s.split) s.split.revert(); });
  });
  document.addEventListener('i18n:applied', function () {
    var prev = splits;
    splits = prev.map(function (s) { return s.done ? null : makeSplit(s.el, true); }).filter(Boolean);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });

  function monthName(m, short) {
    var es = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    var en = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    var esL = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    var enL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var i = +m.slice(5, 7) - 1;
    if (short) return (lang() === 'en' ? en : es)[i];
    return (lang() === 'en' ? enL : esL)[i] + ' ' + m.slice(0, 4);
  }

  var cad = $('#cadenceChart');
  var tip = $('#cadenceTip');
  var cadDrawn = false;
  function drawCadence(animate) {
    if (!cad || !D.cadence.length) return;
    var W = Math.max(300, cad.clientWidth);
    var small = W < 640;
    var H = small ? 260 : 320;
    var pl = small ? 8 : 24, pr = small ? 40 : 64, pt = 30, pb = 44;
    var n = D.cadence.length;
    var colW = (W - pl - pr) / n;
    var bw = Math.min(46, colW * 0.56);
    var maxN = Math.max.apply(null, D.cadence.map(function (c) { return c.n; }));
    var total = D.cadence.reduce(function (a, c) { return a + c.n; }, 0);
    var ih = H - pt - pb;
    var cum = 0;
    var pts = [];
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '" role="none"><defs><linearGradient id="cadGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--jade)" stop-opacity=".22"/><stop offset="1" stop-color="var(--jade)" stop-opacity="0"/></linearGradient></defs>';
    svg += '<line class="cad-axis" aria-hidden="true" x1="' + pl + '" y1="' + (H - pb) + '" x2="' + (W - pr + 20) + '" y2="' + (H - pb) + '"/>';
    D.cadence.forEach(function (c, i) {
      var cx = pl + colW * i + colW / 2;
      var h = maxN ? ih * 0.78 * c.n / maxN : 0;
      cum += c.n;
      pts.push([cx, pt + ih - ih * cum / total]);
      var yr = c.m.slice(2, 4);
      var label = monthName(c.m, true);
      svg += '<g class="cad-col" tabindex="0" data-i="' + i + '" role="button" aria-label="' + esc(monthName(c.m) + ': ' + c.n + ' ' + t('st_modules', 'módulos')) + '">';
      svg += '<rect class="cad-hit" x="' + (cx - colW / 2) + '" y="' + pt + '" width="' + colW + '" height="' + ih + '" rx="8"/>';
      svg += '<rect class="cad-bar' + (c.n ? '' : ' cad-bar--dim') + '" x="' + (cx - bw / 2) + '" y="' + (H - pb - Math.max(h, 2)) + '" width="' + bw + '" height="' + Math.max(h, 2) + '" rx="' + Math.min(6, bw / 3) + '"/>';
      if (c.n) svg += '<text class="cad-n" x="' + cx + '" y="' + (H - pb - h - 8) + '" text-anchor="middle">' + c.n + '</text>';
      var showM = !small || i % 2 === 0;
      var yearHere = small ? (i === 0 || (c.m.slice(0, 4) !== D.cadence[0].m.slice(0, 4) && i % 2 === 0 && D.cadence[i - 2] && D.cadence[i - 2].m.slice(0, 4) !== c.m.slice(0, 4))) : (i === 0 || c.m.slice(5) === '01');
      if (showM) svg += '<text class="cad-m" x="' + cx + '" y="' + (H - pb + 20) + '" text-anchor="middle">' + label + '</text>';
      if (yearHere) svg += '<text class="cad-m" x="' + cx + '" y="' + (H - pb + 36) + '" text-anchor="middle" opacity=".6">20' + yr + '</text>';
      svg += '</g>';
    });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    var area = line + ' L' + pts[pts.length - 1][0].toFixed(1) + ',' + (H - pb) + ' L' + pts[0][0].toFixed(1) + ',' + (H - pb) + ' Z';
    svg += '<g aria-hidden="true"><path class="cad-area" d="' + area + '"/>';
    svg += '<path class="cad-line" d="' + line + '"/>';
    pts.forEach(function (p, i) { svg += '<circle class="cad-dot" cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i === pts.length - 1 ? 5 : 3.2) + '"/>'; });
    var last = pts[pts.length - 1];
    svg += '<text class="cad-total" x="' + (last[0] + 14) + '" y="' + (last[1] + 10) + '">' + total + '</text></g>';
    svg += '</svg>';
    cad.innerHTML = svg;
    bindCadence();
    if (animate && hasGsap && !reduced) {
      var s = cad.querySelector('svg');
      gsap.from(s.querySelectorAll('.cad-bar'), { scaleY: 0, transformOrigin: '50% 100%', duration: 0.9, stagger: 0.05, ease: 'expo.out' });
      gsap.from(s.querySelectorAll('.cad-n'), { opacity: 0, y: 8, duration: 0.5, stagger: 0.05, delay: 0.3 });
      var lp = s.querySelector('.cad-line');
      var len = lp.getTotalLength();
      gsap.fromTo(lp, { strokeDasharray: len + ' ' + len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', delay: 0.2 });
      gsap.from(s.querySelector('.cad-area'), { opacity: 0, duration: 1, delay: 0.9 });
      gsap.from(s.querySelectorAll('.cad-dot'), { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.08, delay: 0.3, ease: 'back.out(3)' });
      gsap.from(s.querySelector('.cad-total'), { opacity: 0, x: -8, duration: 0.6, delay: 1.6 });
    }
  }
  function bindCadence() {
    $$('.cad-col', cad).forEach(function (g) {
      function show() {
        var c = D.cadence[+g.getAttribute('data-i')];
        var mods = D.modules.filter(function (m) { return m.f.slice(0, 7) === c.m; });
        var items = mods.slice(0, 7).map(function (m) {
          return '<li><span class="dot" style="--c:var(--area-' + m.a + ')"></span><span>' + esc(L(m.t)) + '</span></li>';
        }).join('');
        if (mods.length > 7) items += '<li class="muted">+' + (mods.length - 7) + ' ' + esc(t('cad_more', 'más')) + '</li>';
        if (!mods.length) items = '<li class="muted">' + esc(t('cad_none', 'Sin altas este mes')) + '</li>';
        tip.innerHTML = '<b>' + esc(monthName(c.m)) + ' · ' + c.n + '</b><ul>' + items + '</ul>';
        tip.hidden = false;
        var r = g.getBoundingClientRect();
        var pr = cad.parentNode.getBoundingClientRect();
        var x = r.left + r.width / 2 - pr.left;
        var tw = Math.min(300, pr.width - 16);
        x = Math.max(tw / 2 + 8, Math.min(pr.width - tw / 2 - 8, x));
        tip.style.left = x + 'px';
        tip.style.top = (r.top - pr.top + 24) + 'px';
      }
      function hide() { tip.hidden = true; }
      g.addEventListener('mouseenter', show);
      g.addEventListener('focus', show);
      g.addEventListener('mouseleave', hide);
      g.addEventListener('blur', hide);
      function choose() {
        var c = D.cadence[+g.getAttribute('data-i')];
        if (!c.n) return;
        ledger.q = '';
        ledger.area = 'all';
        ledger.ver = 'all';
        ledger.month = c.m;
        ledger.expanded = true;
        renderLedger();
        var s = $('#modulos');
        if (s) s.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
      }
      g.addEventListener('click', choose);
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); }
      });
    });
  }
  if (cad) {
    if ('IntersectionObserver' in window) {
      var cadIO = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting && !cadDrawn) { cadDrawn = true; drawCadence(true); cadIO.disconnect(); }
      }, { threshold: 0.3 });
      cadIO.observe(cad);
    } else { cadDrawn = true; drawCadence(false); }
    var lastCadW = 0;
    window.addEventListener('resize', debounce(function () {
      if (!cadDrawn || Math.abs(cad.clientWidth - lastCadW) < 8) return;
      lastCadW = cad.clientWidth;
      drawCadence(false);
    }, 200));
  }

  function renderClients() {
    var ul = $('#clientsGrid');
    if (!ul) return;
    var max = Math.max.apply(null, D.clients.map(function (c) { return c.n; }));
    ul.innerHTML = D.clients.map(function (c) {
      var areas = c.a.map(function (a) {
        return '<span><i class="dot" style="--c:var(--area-' + a + ')"></i>' + esc(L(D.areas[a])) + '</span>';
      }).join('');
      return '<li class="client"><span class="client__name">' + esc(c.name) + '</span><span class="client__n tnum">' + c.n + '</span><span class="client__areas">' + areas + '</span><span class="client__bar" style="--w:' + (c.n / max * 100).toFixed(1) + '%"></span></li>';
    }).join('');
  }

  var ledger = { area: 'all', ver: 'all', q: '', sort: 'date', expanded: false, month: null, open: {} };
  var LIMIT = 16;
  var maxLoc = Math.max.apply(null, D.modules.map(function (m) { return m.loc; }).concat([1]));
  var clientName = {};
  D.clients.forEach(function (c) { clientName[c.id] = c.name; });

  function renderAreas() {
    var barBox = $('#areasBar');
    var filters = $('#areaFilters');
    var keys = Object.keys(D.areas);
    var total = D.modules.length;
    if (barBox) {
      barBox.innerHTML = '<div class="areas__bar" role="img" aria-label="' + esc(t('led_area_label', 'Área')) + '">' + keys.map(function (k) {
        return '<span class="areas__seg" style="--w:' + (D.areas[k].n / total * 100).toFixed(2) + '%;--c:var(--area-' + k + ')" title="' + esc(L(D.areas[k]) + ' · ' + D.areas[k].n) + '"></span>';
      }).join('') + '</div>';
    }
    if (filters) {
      filters.innerHTML = '<button type="button" class="afilter" data-area="all" aria-pressed="' + (ledger.area === 'all') + '" style="--c:var(--fg-3)">' + esc(t('led_all_areas', 'Todas las áreas')) + ' <span class="afilter__n">' + total + '</span></button>' +
        keys.map(function (k) {
          return '<button type="button" class="afilter" data-area="' + k + '" aria-pressed="' + (ledger.area === k) + '" style="--c:var(--area-' + k + ')"><span class="dot" style="--c:var(--area-' + k + ')"></span>' + esc(L(D.areas[k])) + ' <span class="afilter__n">' + D.areas[k].n + '</span></button>';
        }).join('');
    }
  }

  function dateLabel(f) {
    var d = f.slice(8, 10);
    return d + ' ' + monthName(f, true).toUpperCase() + ' ' + f.slice(2, 4);
  }

  function matches(m) {
    if (ledger.area !== 'all' && m.a !== ledger.area) return false;
    if (ledger.ver !== 'all' && m.v !== ledger.ver) return false;
    if (ledger.month && m.f.slice(0, 7) !== ledger.month) return false;
    if (ledger.q) {
      var hay = norm([m.t.es, m.t.en, m.d.es, m.d.en, m.c.map(function (c) { return clientName[c] || c; }).join(' '), D.areas[m.a].es, D.areas[m.a].en, 'v' + m.v].join(' '));
      var words = norm(ledger.q).split(/\s+/).filter(Boolean);
      for (var i = 0; i < words.length; i++) if (hay.indexOf(words[i]) < 0) return false;
    }
    return true;
  }

  function rowHTML(m) {
    var clients = m.c.length ? m.c.map(function (c) { return clientName[c] || c; }) : [t('led_internal', 'Integra · interno')];
    var cl = clients[0] + (clients.length > 1 ? ' +' + (clients.length - 1) : '');
    var w = (Math.log(m.loc + 1) / Math.log(maxLoc + 1) * 100).toFixed(1);
    var open = !!ledger.open[m.id];
    var vid = m.scene ? '<span class="lrow__vid">▶ ' + esc(t('led_video', 'video')) + '</span>' : '';
    var chips = '<span class="chip"><span class="dot" style="--c:var(--area-' + m.a + ')"></span>' + esc(L(D.areas[m.a])) + '</span>' +
      '<span class="chip">Odoo ' + m.v + '</span>' +
      '<span class="chip">' + fmt(m.loc) + ' ' + esc(t('led_lines', 'líneas')) + '</span>' +
      (m.tests ? '<span class="chip chip--accent">' + m.tests + ' ' + esc(t('led_tests', 'pruebas')) + '</span>' : '') +
      (clients.length > 1 ? '<span class="chip">' + esc(clients.join(' · ')) + '</span>' : '');
    var acts = '';
    if (m.scene) acts += '<button type="button" class="btn btn--primary btn--sm" data-goscene="' + m.scene + '">▶ <span>' + esc(t('led_watch', 'Ver el caso')) + '</span></button>';
    if (m.scene && D.snippets[m.scene]) acts += '<button type="button" class="btn btn--ghost btn--sm" data-code="' + m.scene + '"><span class="btn__ico mono">&lt;/&gt;</span><span>' + esc(t('btn_code', 'Ver código real')) + '</span></button>';
    return '<div class="lrow' + (open ? ' is-open' : '') + '" role="row" data-id="' + m.id + '">' +
      '<button type="button" class="lrow__main" aria-expanded="' + open + '" aria-controls="lr-' + m.id + '">' +
      '<span class="lrow__date" role="cell">' + dateLabel(m.f) + '</span>' +
      '<span class="lrow__concept" role="cell"><span class="lrow__t"><span class="dot" style="--c:var(--area-' + m.a + ')"></span><span>' + esc(L(m.t)) + '</span>' + vid + '</span><span class="lrow__ref">' + esc(L(D.areas[m.a])) + '</span></span>' +
      '<span class="lrow__client" role="cell">' + esc(cl) + '</span>' +
      '<span class="lrow__ver" role="cell" data-v="' + m.v + '">v' + m.v + '</span>' +
      '<span class="lrow__loc" role="cell">' + fmt(m.loc) + '<span class="lrow__bar"><i style="--w:' + w + '%;--c:var(--area-' + m.a + ')"></i></span></span>' +
      '</button>' +
      '<div class="lrow__detail" id="lr-' + m.id + '"><div><div class="lrow__inner">' +
      '<p class="lrow__desc">' + esc(L(m.d)) + '</p>' +
      '<div class="lrow__meta">' + chips + '</div>' +
      (acts ? '<div class="lrow__act">' + acts + '</div>' : '') +
      '</div></div></div></div>';
  }

  function renderLedger() {
    var body = $('#ledgerBody');
    if (!body) return;
    var list = D.modules.filter(matches);
    if (ledger.sort === 'loc') list = list.slice().sort(function (a, b) { return b.loc - a.loc; });
    var filtered = ledger.area !== 'all' || ledger.ver !== 'all' || ledger.q || ledger.month;
    var shown = ledger.expanded || filtered ? list : list.slice(0, LIMIT);
    body.innerHTML = shown.length ? shown.map(rowHTML).join('') : '<p class="ltable__empty">' + esc(t('led_empty', 'Ningún módulo coincide con el filtro.')) + '</p>';
    var cnt = $('#ledgerCount');
    if (cnt) {
      var txt = t('led_count', 'Mostrando {n} de {t}').replace('{n}', shown.length).replace('{t}', D.modules.length);
      if (ledger.month) txt += ' · ' + monthName(ledger.month);
      cnt.textContent = txt;
    }
    var more = $('#ledgerMore');
    if (more) {
      if (filtered) {
        more.hidden = false;
        more.textContent = t('led_clear', 'Quitar filtros');
        more.setAttribute('data-mode', 'clear');
      } else {
        more.hidden = list.length <= LIMIT;
        more.textContent = ledger.expanded ? t('led_less', 'Mostrar menos') : t('led_more', 'Mostrar todos');
        more.setAttribute('data-mode', 'toggle');
      }
    }
    $$('.afilter', $('#areaFilters')).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-area') === ledger.area)); });
    $$('#verSeg button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-ver') === ledger.ver)); });
    $$('#sortSeg button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-sort') === ledger.sort)); });
    var s = $('#ledgerSearch');
    if (s && s.value !== ledger.q) s.value = ledger.q;
  }

  function bindLedger() {
    var body = $('#ledgerBody');
    if (!body) return;
    body.addEventListener('click', function (e) {
      var go = e.target.closest('[data-goscene]');
      if (go) { e.stopPropagation(); goScene(go.getAttribute('data-goscene')); return; }
      var main = e.target.closest('.lrow__main');
      if (!main) return;
      var row = main.parentNode;
      var id = row.getAttribute('data-id');
      var open = !row.classList.contains('is-open');
      row.classList.toggle('is-open', open);
      main.setAttribute('aria-expanded', String(open));
      if (open) ledger.open[id] = 1; else delete ledger.open[id];
    });
    var af = $('#areaFilters');
    if (af) af.addEventListener('click', function (e) {
      var b = e.target.closest('[data-area]');
      if (!b) return;
      ledger.area = b.getAttribute('data-area');
      ledger.month = null;
      renderLedger();
    });
    $$('#verSeg button').forEach(function (b) { b.addEventListener('click', function () { ledger.ver = b.getAttribute('data-ver'); renderLedger(); }); });
    $$('#sortSeg button').forEach(function (b) { b.addEventListener('click', function () { ledger.sort = b.getAttribute('data-sort'); renderLedger(); }); });
    var s = $('#ledgerSearch');
    if (s) s.addEventListener('input', debounce(function () { ledger.q = s.value.trim(); ledger.month = null; renderLedger(); }, 120));
    var more = $('#ledgerMore');
    if (more) more.addEventListener('click', function () {
      if (more.getAttribute('data-mode') === 'clear') {
        ledger.area = 'all'; ledger.ver = 'all'; ledger.q = ''; ledger.month = null; ledger.expanded = false;
      } else {
        ledger.expanded = !ledger.expanded;
        if (!ledger.expanded) { var sec = $('#modulos'); if (sec) sec.scrollIntoView({ behavior: 'auto' }); }
      }
      renderLedger();
    });
  }

  function renderLangs() {
    var ext = (D.stats && D.stats.ext) || {};
    var total = Object.keys(ext).reduce(function (a, k) { return a + ext[k]; }, 0);
    var items = [['.py', 'Python', 'var(--blue)'], ['.xml', 'XML · QWeb', 'var(--gold)'], ['.css', 'CSS · SCSS', 'var(--jade)'], ['.js', 'JavaScript · OWL', 'var(--violet)']];
    var barEl = $('#langBar');
    var leg = $('#langLegend');
    if (!barEl || !total) return;
    barEl.innerHTML = items.map(function (i) {
      return '<span style="--w:' + ((ext[i[0]] || 0) / total * 100).toFixed(2) + '%;--c:' + i[2] + '"></span>';
    }).join('');
    if (leg) leg.innerHTML = items.map(function (i) {
      var pct = ((ext[i[0]] || 0) / total * 100).toFixed(1);
      return '<li><span class="dot" style="--c:' + i[2] + '"></span>' + i[1] + ' <b>' + pct + '%</b> <span class="muted">' + fmt(ext[i[0]] || 0) + '</span></li>';
    }).join('');
    if (hasGsap && !reduced && window.ScrollTrigger) {
      gsap.from(barEl.children, { scaleX: 0, transformOrigin: '0 50%', duration: 1.1, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: barEl, start: 'top 90%', once: true } });
    }
  }

  var stampEl = $('#ledgerStamp');
  if (stampEl) {
    if (hasGsap && !reduced && window.ScrollTrigger) {
      ScrollTrigger.create({
        trigger: '.stmt',
        start: 'top 72%',
        once: true,
        onEnter: function () {
          stampEl.classList.add('is-on');
          var ss = parseFloat(getComputedStyle(stampEl).getPropertyValue('--stamp-s')) || 1;
          gsap.fromTo(stampEl, { scale: ss * 2.4, rotation: -22, opacity: 0 }, { scale: ss, rotation: -9, opacity: 0.88, duration: 0.42, ease: 'power4.in', clearProps: 'transform', onComplete: function () {
            var card = $('.stmt');
            if (card && card.animate) card.animate([{ translate: '0 0' }, { translate: '3px 1px' }, { translate: '-3px 0' }, { translate: '2px -1px' }, { translate: '0 0' }], { duration: 240, easing: 'linear' });
          } });
        }
      });
    } else {
      stampEl.classList.add('is-on');
    }
  }

  $$('.metric').forEach(function (m) {
    m.addEventListener('pointermove', function (e) {
      var r = m.getBoundingClientRect();
      m.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      m.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  var KW = /\b(False|None|True|and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g;
  var BI = /\b(abs|all|any|bool|dict|enumerate|filter|float|getattr|int|isinstance|len|list|map|max|min|range|round|set|sorted|str|sum|super|tuple|zip)\b(?=\()/g;
  function hiCode(code) {
    return esc(code)
      .replace(/\b(\d+\.?\d*)\b/g, '\u0001num\u0002$1\u0003')
      .replace(KW, '\u0001kw\u0002$1\u0003')
      .replace(BI, '\u0001bi\u0002$1\u0003')
      .replace(/\b(self|cls)\b/g, '\u0001self\u0002$1\u0003')
      .replace(/\u0001(\w+)\u0002/g, '<span class="tk-$1">')
      .replace(/\u0003/g, '</span>');
  }
  function highlight(src) {
    var lines = src.split('\n');
    var out = [];
    var inTriple = null;
    lines.forEach(function (line) {
      var html = '';
      var i = 0;
      if (inTriple) {
        var end = line.indexOf(inTriple);
        if (end < 0) { out.push('<span class="tk-str">' + esc(line) + '</span>'); return; }
        html += '<span class="tk-str">' + esc(line.slice(0, end + 3)) + '</span>';
        i = end + 3;
        inTriple = null;
      }
      var m = /^(\s*)@([\w.]+)/.exec(line);
      if (m && i === 0) {
        out.push(esc(m[1]) + '<span class="tk-dec">@' + esc(m[2]) + '</span>' + hiCode(line.slice(m[0].length)));
        return;
      }
      var buf = '';
      function flush() { if (buf) { html += hiCode(buf).replace(/\b(def|class)<\/span>\s+(\w+)/g, '$1</span> <span class="tk-fn">$2</span>'); buf = ''; } }
      while (i < line.length) {
        var ch = line[i];
        if (ch === '#') { flush(); html += '<span class="tk-com">' + esc(line.slice(i)) + '</span>'; i = line.length; break; }
        var pre = '';
        var j = i;
        if (/[fFrRbBuU]/.test(ch) && (line[i + 1] === '"' || line[i + 1] === "'")) { pre = ch; j = i + 1; }
        var q = line[j];
        if (q === '"' || q === "'") {
          flush();
          var triple = line.substr(j, 3) === q + q + q;
          if (triple) {
            var close = line.indexOf(q + q + q, j + 3);
            if (close < 0) { html += '<span class="tk-str">' + esc(line.slice(i)) + '</span>'; inTriple = q + q + q; i = line.length; break; }
            html += '<span class="tk-str">' + esc(line.slice(i, close + 3)) + '</span>';
            i = close + 3;
            continue;
          }
          var k = j + 1;
          while (k < line.length && line[k] !== q) { if (line[k] === '\\') k++; k++; }
          html += '<span class="tk-str">' + esc(line.slice(i, k + 1)) + '</span>';
          i = k + 1;
          continue;
        }
        buf += ch;
        i++;
      }
      flush();
      out.push(html);
    });
    return out.map(function (l) { return '<span class="code__ln">' + (l || ' ') + '</span>'; }).join('');
  }

  var codeDlg = $('#codeDialog');
  var lastFocus = null;
  var codeKeys = [];
  var codeCur = null;
  function showSnippet(key) {
    var s = D.snippets[key];
    if (!s) return;
    codeCur = key;
    $('#codeTitle').textContent = codeKeys.length > 1 ? s.file : L(s.name) + ' · ' + s.file;
    $('#codeBody').innerHTML = highlight(s.code);
    $('#codeMeta').textContent = 'python · ' + s.code.split('\n').length + ' ' + t('led_lines', 'líneas');
    $$('.code__tab', $('#codeTabs')).forEach(function (b) { b.setAttribute('aria-selected', String(b.getAttribute('data-k') === key)); });
    $('#codePre').scrollTop = 0;
  }
  function openCode(keys) {
    if (!codeDlg) return;
    codeKeys = keys.filter(function (k) { return D.snippets[k]; });
    if (!codeKeys.length) return;
    lastFocus = document.activeElement;
    var tabs = $('#codeTabs');
    tabs.innerHTML = codeKeys.length > 1 ? codeKeys.map(function (k) {
      return '<button type="button" class="code__tab" role="tab" data-k="' + k + '" aria-selected="false">' + esc(L(D.snippets[k].name)) + '</button>';
    }).join('') : '';
    showSnippet(codeKeys[0]);
    openDialog(codeDlg, $('#codePre'));
  }
  if (codeDlg) {
    $('#codeTabs').addEventListener('click', function (e) { var b = e.target.closest('.code__tab'); if (b) showSnippet(b.getAttribute('data-k')); });
    $('#codeCopy').addEventListener('click', function () {
      var s = D.snippets[codeCur];
      if (s && navigator.clipboard) navigator.clipboard.writeText(s.code).then(function () { toast(t('copied', 'Copiado')); });
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-code]');
    if (b) { e.preventDefault(); openCode(b.getAttribute('data-code').split(',')); }
  });

  var openDialogs = [];
  function focusables(el) {
    return $$('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])', el).filter(function (x) { return x.offsetParent !== null || x === document.activeElement; });
  }
  function openDialog(dlg, focusEl) {
    dlg.hidden = false;
    document.body.classList.add('is-locked');
    openDialogs.push(dlg);
    var box = $('.dialog__box', dlg);
    if (hasGsap && !reduced) {
      gsap.fromTo($('.dialog__scrim', dlg), { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(box, { y: 24, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out' });
    }
    setTimeout(function () { (focusEl || focusables(dlg)[0] || box).focus(); }, 30);
  }
  function closeDialog(dlg) {
    if (!dlg || dlg.hidden) return;
    var done = function () {
      dlg.hidden = true;
      openDialogs = openDialogs.filter(function (d) { return d !== dlg; });
      if (!openDialogs.length && !document.body.classList.contains('menu-open')) document.body.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    if (hasGsap && !reduced) {
      gsap.to($('.dialog__box', dlg), { y: 12, opacity: 0, duration: 0.22, ease: 'power2.in' });
      gsap.to($('.dialog__scrim', dlg), { opacity: 0, duration: 0.25, onComplete: done });
    } else done();
  }
  $$('.dialog').forEach(function (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeDialog(dlg); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeDialog(dlg); }
      if (e.key === 'Tab') {
        var f = focusables(dlg);
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  });

  function goScene(key) {
    var el = document.getElementById('caso-' + key);
    if (!el) return;
    if (window.Players) Players.pauseAll();
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    setTimeout(function () {
      var p = window.Players && Players.get(key);
      if (p) p.userPlay();
    }, reduced ? 50 : 900);
  }
  window.goScene = goScene;

  var pal = $('#palette');
  var palInput = $('#paletteInput');
  var palList = $('#paletteList');
  var palSel = 0;
  var palItems = [];
  function palCommands() {
    var cmds = [];
    function add(group, icon, label, hint, run, extra) { cmds.push({ group: group, icon: icon, label: label, hint: hint || '', run: run, extra: extra || '' }); }
    var go = t('pal_g_go', 'Ir a');
    [['#top', t('pal_home', 'Inicio'), '00'], ['#impacto', t('nav_impact', 'Impacto'), '01'], ['#casos', t('nav_cases', 'Casos'), '02'], ['#modulos', t('nav_modules', 'Módulos'), '03'], ['#perfil', t('nav_profile', 'Perfil'), '04'], ['#contacto', t('nav_contact', 'Contacto'), '05']].forEach(function (s) {
      add(go, s[2], s[1], s[0], function () { var el = $(s[0]); if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); });
    });
    var cg = t('pal_g_cases', 'Casos en video');
    ['tesoreria', 'edi', 'cfdi', 'imss', 'ptu', 'banxico', 'sepomex'].forEach(function (k) {
      var sc = window.Scenes && Scenes[k];
      if (sc) add(cg, '▶', L(sc.title), '', function () { goScene(k); });
    });
    var ag = t('pal_g_actions', 'Acciones');
    add(ag, '◐', t('pal_theme', 'Cambiar tema claro / oscuro'), '', function () { themeBtn && themeBtn.click(); });
    add(ag, 'Aa', lang() === 'es' ? 'Switch to English' : 'Cambiar a español', '', function () { window.i18n && i18n.set(lang() === 'es' ? 'en' : 'es'); });
    add(ag, '↓', t('cta_cv', 'Descargar CV'), 'PDF', function () { var a = document.createElement('a'); a.href = 'assets/certificados/cv_' + lang() + '.pdf'; a.download = ''; document.body.appendChild(a); a.click(); a.remove(); });
    add(ag, '@', t('pal_copy_mail', 'Copiar correo'), 'jesusgarzacia@hotmail.com', function () { copyText('jesusgarzacia@hotmail.com'); });
    add(ag, '>_', t('pal_console', 'Abrir consola'), '`', function () { window.Console && Console.open(); });
    var lg = t('pal_g_links', 'Enlaces');
    add(lg, 'gh', 'GitHub', 'github.com/jesusgarzag', function () { window.open('https://github.com/jesusgarzag', '_blank', 'noopener'); });
    add(lg, 'in', 'LinkedIn', '/in/jesusgarzacia', function () { window.open('https://www.linkedin.com/in/jesusgarzacia', '_blank', 'noopener'); });
    add(lg, 'v3', t('pal_v3', 'Versión anterior: terminal'), 'v3', function () { window.open('https://terminal.jesusgarza.pages.dev/', '_blank', 'noopener'); });
    add(lg, 'v2', t('pal_v2', 'Versión minimalista'), 'v2', function () { window.open('https://minimalist.jesusgarza.pages.dev/', '_blank', 'noopener'); });
    add(lg, 'v1', t('pal_v1', 'Versión gateway'), 'v1', function () { window.open('https://gateway.jesusgarza.pages.dev/', '_blank', 'noopener'); });
    var mg = t('pal_g_modules', 'Módulos');
    D.modules.forEach(function (m) {
      add(mg, 'v' + m.v, L(m.t), L(D.areas[m.a]), function () {
        ledger.q = L(m.t);
        ledger.area = 'all'; ledger.ver = 'all'; ledger.month = null;
        ledger.open[m.id] = 1;
        renderLedger();
        var row = $('.lrow[data-id="' + m.id + '"]');
        (row || $('#modulos')).scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
      }, norm(m.d.es + ' ' + m.d.en + ' ' + m.c.join(' ')));
    });
    return cmds;
  }
  function score(q, text) {
    if (!q) return 1;
    var s = norm(text);
    var idx = s.indexOf(q);
    if (idx >= 0) return 100 - idx;
    var pos = 0, sc = 0;
    for (var i = 0; i < q.length; i++) {
      var f = s.indexOf(q[i], pos);
      if (f < 0) return 0;
      sc += f === pos ? 3 : 1;
      pos = f + 1;
    }
    return sc;
  }
  function markText(text, q) {
    if (!q) return esc(text);
    var s = norm(text);
    var idx = s.indexOf(q);
    if (idx < 0) return esc(text);
    return esc(text.slice(0, idx)) + '<mark>' + esc(text.slice(idx, idx + q.length)) + '</mark>' + esc(text.slice(idx + q.length));
  }
  function renderPalette() {
    var q = norm(palInput.value.trim());
    var all = palCommands();
    var scored = all.map(function (c) {
      var s = Math.max(score(q, c.label), score(q, c.hint) * 0.8, q && c.extra && c.extra.indexOf(q) >= 0 ? 20 : 0);
      return { c: c, s: s };
    }).filter(function (x) { return x.s > 0; });
    if (!q) scored = scored.filter(function (x) { return x.c.group !== t('pal_g_modules', 'Módulos'); }).concat(scored.filter(function (x) { return x.c.group === t('pal_g_modules', 'Módulos'); }).slice(0, 5));
    else scored.sort(function (a, b) { return b.s - a.s; });
    palItems = scored.slice(0, 40).map(function (x) { return x.c; });
    if (palSel >= palItems.length) palSel = 0;
    var html = '';
    var lastGroup = null;
    palItems.forEach(function (c, i) {
      if (!q && c.group !== lastGroup) { html += '<li class="palette__group" role="presentation">' + esc(c.group) + '</li>'; lastGroup = c.group; }
      html += '<li class="palette__item" role="option" id="pal-' + i + '" data-i="' + i + '" aria-selected="' + (i === palSel) + '"><span class="palette__ico">' + esc(c.icon) + '</span><span>' + markText(c.label, q) + '</span><span class="palette__hint">' + esc(c.hint) + '</span></li>';
    });
    palList.innerHTML = html || '<li class="palette__empty">' + esc(t('pal_empty', 'Sin resultados')) + '</li>';
    palInput.setAttribute('aria-activedescendant', palItems.length ? 'pal-' + palSel : '');
  }
  function movePal(d) {
    if (!palItems.length) return;
    palSel = (palSel + d + palItems.length) % palItems.length;
    $$('.palette__item', palList).forEach(function (li) { li.setAttribute('aria-selected', String(+li.getAttribute('data-i') === palSel)); });
    var cur = $('#pal-' + palSel);
    if (cur) cur.scrollIntoView({ block: 'nearest' });
    palInput.setAttribute('aria-activedescendant', 'pal-' + palSel);
  }
  function runPal(i) {
    var c = palItems[i];
    if (!c) return;
    closeDialog(pal);
    setTimeout(c.run, 120);
  }
  function openPalette() {
    if (!pal) return;
    lastFocus = document.activeElement;
    palInput.value = '';
    palSel = 0;
    renderPalette();
    openDialog(pal, palInput);
  }
  if (pal) {
    palInput.addEventListener('input', function () { palSel = 0; renderPalette(); });
    palInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); movePal(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); movePal(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); runPal(palSel); }
    });
    palList.addEventListener('click', function (e) { var li = e.target.closest('.palette__item'); if (li) runPal(+li.getAttribute('data-i')); });
    palList.addEventListener('mousemove', function (e) {
      var li = e.target.closest('.palette__item');
      if (li && +li.getAttribute('data-i') !== palSel) { palSel = +li.getAttribute('data-i'); movePal(0); }
    });
    var pb = $('#paletteBtn');
    if (pb) pb.addEventListener('click', openPalette);
  }
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault();
      if (pal && !pal.hidden) closeDialog(pal); else openPalette();
    }
  });
  window.openPalette = openPalette;

  function copyText(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { toast(t('copied', 'Copiado')); }).catch(function () { toast(text); });
    else toast(text);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    e.preventDefault();
    e.stopPropagation();
    copyText(b.getAttribute('data-copy'));
  });

  var form = $('#form-contacto');
  if (form) {
    var status = $('#formStatus');
    var submit = $('#formSubmit');
    var label = submit && $('.btn__label', submit);
    var folioN = 1;
    try { folioN = parseInt(localStorage.getItem('folio') || '1', 10) || 1; } catch (e) {}
    var folioOut = $('#formFolio');
    function setFolio() { if (folioOut) folioOut.textContent = String(folioN).padStart(4, '0'); }
    setFolio();
    function setStatus(kind, key, fb) {
      if (!status) return;
      status.hidden = !kind;
      status.setAttribute('data-s', kind || '');
      status.innerHTML = kind ? t(key, fb) : '';
    }
    form.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); form.requestSubmit ? form.requestSubmit() : form.dispatchEvent(new Event('submit', { cancelable: true })); }
    });
    form.addEventListener('input', function (e) { var f = e.target.closest('.field'); if (f) f.classList.remove('is-invalid'); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = $$('.field__i', form).filter(function (i) { return !i.checkValidity(); });
      $$('.field', form).forEach(function (f) { f.classList.remove('is-invalid'); });
      if (bad.length) {
        bad.forEach(function (i) { i.closest('.field').classList.add('is-invalid'); });
        bad[0].focus();
        setStatus('err', 'form_invalid', 'Revisa los campos marcados.');
        return;
      }
      submit.disabled = true;
      if (label) label.textContent = t('form_sending', 'Timbrando…');
      setStatus('pending', 'form_pending', 'Enviando tu solicitud…');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error(String(r.status));
          form.reset();
          setStatus('ok', 'form_ok', 'Solicitud timbrada. Te respondo pronto.');
          var st = $('#formStamp');
          $('#formUuid').textContent = uuid().toUpperCase();
          if (st && hasGsap) gsap.fromTo(st, { opacity: 0, scale: 1.8, rotation: -20 }, { opacity: 0.92, scale: 1, rotation: -8, duration: 0.4, ease: 'power4.in' });
          else if (st) st.style.opacity = 0.92;
          folioN++;
          try { localStorage.setItem('folio', String(folioN)); } catch (x) {}
          setTimeout(setFolio, 1800);
        })
        .catch(function () { setStatus('err', 'form_err', 'No se pudo enviar. Escríbeme directo a <a href="mailto:jesusgarzacia@hotmail.com">jesusgarzacia@hotmail.com</a>.'); })
        .then(function () {
          submit.disabled = false;
          if (label) label.textContent = t('form_send', 'Timbrar y enviar');
        });
    });
  }

  var lt = $('#localTime');
  function tick() {
    if (!lt) return;
    try {
      var s = new Intl.DateTimeFormat(lang() === 'en' ? 'en-US' : 'es-MX', { timeZone: 'America/Monterrey', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
      lt.textContent = 'Monterrey · ' + s + ' · UTC−6';
    } catch (e) {}
  }
  tick();
  setInterval(tick, 30000);

  var cp = $('#copyright');
  if (cp) cp.textContent = '© ' + new Date().getFullYear() + ' Jesús Gerardo Garza García';

  $$('[data-play-first]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      goScene('tesoreria');
    });
  });

  document.addEventListener('i18n:applied', function () {
    renderClients();
    renderAreas();
    renderLedger();
    if (cadDrawn) drawCadence(false);
    setRot(rotIdx, false);
    stabilizeClaim();
    tick();
  });

  renderClients();
  renderAreas();
  bindLedger();
  renderLedger();
  renderLangs();
  if (hasGsap && !reduced && window.ScrollTrigger) {
    ScrollTrigger.batch('.client', { start: 'top 92%', once: true, onEnter: function (els) { gsap.from(els, { y: 18, opacity: 0, stagger: 0.03, duration: 0.6, ease: 'expo.out', clearProps: 'transform,opacity' }); } });
  }

  var heroStarted = false;
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    heroIn();
  }
  function boot() {
    initSplits();
    if (window.Players) Players.init();
    introDone.then(startHero);
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  var fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  var i18nReady = (window.i18n && window.i18n.ready) || Promise.resolve();
  var timeout = new Promise(function (r) { setTimeout(r, 900); });
  Promise.race([Promise.all([fontsReady, i18nReady]), timeout]).then(boot);
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }
})();
