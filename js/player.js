(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var Scenes = window.Scenes = window.Scenes || {};
  var root = document.documentElement;
  var players = [];
  var UI = {
    play: { es: 'Reproducir', en: 'Play' },
    pause: { es: 'Pausar', en: 'Pause' },
    replay: { es: 'Ver de nuevo', en: 'Watch again' },
    watch: { es: 'Reproducir', en: 'Play' },
    live: { es: 'En vivo · SVG', en: 'Live · SVG' },
    cc: { es: 'Subtítulos', en: 'Captions' },
    fs: { es: 'Pantalla completa', en: 'Fullscreen' },
    seek: { es: 'Posición del video', en: 'Video position' },
    chapters: { es: 'Capítulos', en: 'Chapters' },
    chapter: { es: 'Capítulo', en: 'Chapter' },
    video: { es: 'Video explicativo', en: 'Explainer video' }
  };
  var ICON = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 5.5h3v13h-3zM13.5 5.5h3v13h-3z" fill="currentColor"/></svg>',
    replay: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12a7 7 0 1 0 2.05-4.95" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5 4.5v4h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    fs: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 9V4.5H9M15 4.5h4.5V9M19.5 15v4.5H15M9 19.5H4.5V15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  function lang() {
    return (window.i18n && window.i18n.current) || root.lang || 'es';
  }

  function pick(v) {
    if (v == null) return '';
    if (typeof v === 'string' || typeof v === 'number') return String(v);
    return v[lang()] != null ? v[lang()] : (v.es != null ? v.es : '');
  }

  function fmtTime(t) {
    t = Math.max(0, Math.floor(t + 0.001));
    var m = Math.floor(t / 60);
    var s = t % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function isReduced() {
    return root.classList.contains('reduced');
  }

  function h(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function money(n, dec) {
    var d = dec == null ? 2 : dec;
    var s = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    return (n < 0 ? '−$' : '$') + s;
  }

  function makeCtx(svg, layout, W, H) {
    var caps = [];
    var chaps = [];
    var S = {
      svg: svg,
      W: W,
      H: H,
      layout: layout,
      tall: layout === 'tall',
      lang: lang(),
      t: pick,
      money: money,
      caps: caps,
      chaps: chaps,
      el: function (tag, attrs, parent) {
        var e = document.createElementNS(NS, tag);
        if (attrs) {
          for (var k in attrs) {
            if (attrs[k] == null || attrs[k] === false) continue;
            if (k === 'text') e.textContent = attrs[k];
            else if (k === 'cls') e.setAttribute('class', attrs[k]);
            else e.setAttribute(k, attrs[k]);
          }
        }
        (parent || svg).appendChild(e);
        return e;
      },
      g: function (attrs, parent) {
        return S.el('g', attrs, parent);
      },
      rect: function (x, y, w, hh, r, cls, parent) {
        return S.el('rect', { x: x, y: y, width: w, height: hh, rx: r || 0, cls: cls }, parent);
      },
      circle: function (cx, cy, r, cls, parent) {
        return S.el('circle', { cx: cx, cy: cy, r: r, cls: cls }, parent);
      },
      line: function (x1, y1, x2, y2, cls, parent) {
        return S.el('line', { x1: x1, y1: y1, x2: x2, y2: y2, cls: cls }, parent);
      },
      path: function (d, cls, parent) {
        return S.el('path', { d: d, cls: cls }, parent);
      },
      text: function (x, y, str, o) {
        o = o || {};
        var fam = o.family === 'mono' ? ' sc-mono' : (o.family === 'serif' ? ' sc-serif' : ' sc-sans');
        var cls = (o.cls || 'sc-fg') + fam + (o.weight === 600 ? ' sc-b' : (o.weight === 500 ? ' sc-m' : ''));
        var e = S.el('text', {
          x: x,
          y: y,
          cls: cls,
          'font-size': o.size || 24,
          'text-anchor': o.anchor || 'start',
          'letter-spacing': o.ls != null ? o.ls : null,
          'font-style': o.italic ? 'italic' : null,
          opacity: o.opacity != null ? o.opacity : null
        }, o.parent);
        e.textContent = pick(str);
        return e;
      },
      mw: function (str, size) {
        return pick(str).length * size * 0.6;
      },
      chip: function (x, y, label, o) {
        o = o || {};
        var size = o.size || 20;
        var padX = o.padX != null ? o.padX : size * 0.7;
        var hh = o.h || Math.round(size * 1.75);
        var w = o.w || Math.round(S.mw(label, size) + padX * 2 + (o.ls ? pick(label).length * o.ls : 0));
        var ax = o.anchor === 'middle' ? x - w / 2 : (o.anchor === 'end' ? x - w : x);
        var g = S.g({ cls: o.gcls }, o.parent);
        var bg = S.rect(ax, y, w, hh, o.r != null ? o.r : hh / 2, o.cls || 'sc-card2', g);
        var tx = S.text(ax + w / 2, y + hh / 2 + size * 0.36, label, { size: size, family: 'mono', anchor: 'middle', cls: o.tcls || 'sc-fg2', weight: o.weight, ls: o.ls, parent: g });
        return { g: g, bg: bg, tx: tx, x: ax, y: y, w: w, h: hh, cx: ax + w / 2, cy: y + hh / 2 };
      },
      card: function (x, y, w, hh, o) {
        o = o || {};
        var g = S.g({ cls: o.gcls }, o.parent);
        var bg = S.rect(x, y, w, hh, o.r != null ? o.r : 16, o.cls || 'sc-card', g);
        var out = { g: g, bg: bg, x: x, y: y, w: w, h: hh, cx: x + w / 2, cy: y + hh / 2 };
        if (o.title) {
          out.title = S.text(x + (o.pad || 22), y + (o.ty || 40), o.title, { size: o.tsize || 26, weight: 600, cls: o.tcls || 'sc-fg', parent: g });
        }
        if (o.sub) {
          out.sub = S.text(x + (o.pad || 22), y + (o.sy || 70), o.sub, { size: o.ssize || 18, family: 'mono', cls: o.scls || 'sc-fg3', parent: g, ls: o.sls });
        }
        return out;
      },
      check: function (cx, cy, r, ok, parent) {
        var g = S.g({ cls: 'sc-check' }, parent);
        var c = S.circle(cx, cy, r, ok === false ? 'sc-card-err' : 'sc-card-ok', g);
        var d = ok === false
          ? 'M' + (cx - r * 0.38) + ',' + (cy - r * 0.38) + ' L' + (cx + r * 0.38) + ',' + (cy + r * 0.38) + ' M' + (cx + r * 0.38) + ',' + (cy - r * 0.38) + ' L' + (cx - r * 0.38) + ',' + (cy + r * 0.38)
          : 'M' + (cx - r * 0.45) + ',' + (cy + r * 0.02) + ' L' + (cx - r * 0.12) + ',' + (cy + r * 0.36) + ' L' + (cx + r * 0.48) + ',' + (cy - r * 0.34);
        var p = S.path(d, ok === false ? 'sc-stroke-err' : 'sc-stroke-ok', g);
        return { g: g, c: c, p: p };
      },
      curve: function (x1, y1, x2, y2, dir, k) {
        var kk = k == null ? 0.5 : k;
        if (dir === 'v') {
          var my = y1 + (y2 - y1) * kk;
          return 'M' + x1 + ',' + y1 + ' C' + x1 + ',' + my + ' ' + x2 + ',' + my + ' ' + x2 + ',' + y2;
        }
        var mx = x1 + (x2 - x1) * kk;
        return 'M' + x1 + ',' + y1 + ' C' + mx + ',' + y1 + ' ' + mx + ',' + y2 + ' ' + x2 + ',' + y2;
      },
      stamp: function (cx, cy, label, o) {
        o = o || {};
        var size = o.size || 30;
        var w = o.w || Math.round(S.mw(label, size) * 1.02 + size * 1.6 + pick(label).length * 3);
        var hh = o.h || Math.round(size * 2.1);
        var g = S.g({ cls: 'sc-stamp' }, o.parent);
        var kind = o.kind || 'ok';
        S.rect(cx - w / 2, cy - hh / 2, w, hh, 10, 'sc-stamp-' + kind, g);
        S.rect(cx - w / 2 + 5, cy - hh / 2 + 5, w - 10, hh - 10, 7, 'sc-stamp-' + kind, g).setAttribute('stroke-width', '1.2');
        S.text(cx, cy + size * 0.36, label, { size: size, family: 'mono', weight: 600, anchor: 'middle', cls: kind === 'ok' ? 'sc-ok' : (kind === 'err' ? 'sc-err' : 'sc-acc'), ls: 3, parent: g });
        g.setAttribute('transform', 'rotate(' + (o.rot != null ? o.rot : -7) + ' ' + cx + ' ' + cy + ')');
        return g;
      },
      counter: function (tl, el, from, to, o, pos) {
        o = o || {};
        var st = { v: from };
        var fmt = o.fmt || function (v) { return Math.round(v).toLocaleString('en-US'); };
        el.textContent = fmt(from);
        tl.to(st, {
          v: to,
          duration: o.duration || 1.2,
          ease: o.ease || 'power2.out',
          onUpdate: function () { el.textContent = fmt(st.v); }
        }, pos);
        return st;
      },
      scramble: function (tl, el, finalText, o, pos) {
        o = o || {};
        var chars = o.chars || '0123456789abcdef';
        var st = { p: 0 };
        var target = pick(finalText);
        el.textContent = o.startText != null ? o.startText : target.replace(/[^\s\-|]/g, '·');
        tl.to(st, {
          p: 1,
          duration: o.duration || 1.1,
          ease: 'none',
          onUpdate: function () {
            var n = Math.floor(st.p * target.length);
            var out = target.slice(0, n);
            for (var i = n; i < target.length; i++) {
              var c = target[i];
              out += /[\s\-|:.,]/.test(c) ? c : chars[(i * 7 + Math.floor(st.p * 60)) % chars.length];
            }
            el.textContent = st.p >= 1 ? target : out;
          }
        }, pos);
      },
      draw: function (tl, els, o, pos) {
        o = o || {};
        var list = [].concat(els);
        list.forEach(function (e) {
          var L = e.getTotalLength ? e.getTotalLength() : 0;
          e.style.strokeDasharray = L + ' ' + (L + 1);
          e.style.strokeDashoffset = o.reverse ? -L : L;
        });
        tl.to(list, { strokeDashoffset: 0, duration: o.duration || 0.9, ease: o.ease || 'power2.inOut', stagger: o.stagger || 0 }, pos);
      },
      cap: function (tl, text, offset) {
        caps.push({ time: tl.duration() + (offset || 0), text: text });
      },
      chapter: function (tl, index, offset) {
        var t = tl.duration() + (offset || 0);
        chaps.push({ time: t, index: index });
        tl.addLabel('ch' + index, t);
      },
      hold: function (tl, d) {
        tl.to({}, { duration: d });
      },
      dotgrid: function (parent, gap, cls) {
        var gg = gap || 40;
        var id = 'dg' + Math.random().toString(36).slice(2, 8);
        var defs = S.el('defs', null, parent);
        var pat = S.el('pattern', { id: id, width: gg, height: gg, patternUnits: 'userSpaceOnUse' }, defs);
        S.circle(gg / 2, gg / 2, 1.3, cls || 'sc-dotgrid', pat);
        return S.rect(0, 0, W, H, 0, null, parent).setAttribute('fill', 'url(#' + id + ')');
      },
      slide: function (parent) {
        var g = S.g({ cls: 'sc-slide' }, parent);
        g.style.opacity = 0;
        return g;
      },
      showSlide: function (tl, g, pos, o) {
        o = o || {};
        tl.fromTo(g, { opacity: 0, scale: o.from || 0.96, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: o.duration || 0.8, ease: 'power3.out' }, pos);
      },
      hideSlide: function (tl, g, pos, o) {
        o = o || {};
        tl.to(g, { opacity: 0, scale: o.to || 1.04, transformOrigin: '50% 50%', duration: o.duration || 0.6, ease: 'power2.in' }, pos);
      }
    };
    return S;
  }

  function Player(el) {
    this.el = el;
    this.key = el.getAttribute('data-scene');
    this.def = Scenes[this.key];
    this.tl = null;
    this.built = false;
    this.layout = null;
    this.userPaused = false;
    this.autoPaused = false;
    this.ratio = 0;
    this.capIndex = -1;
    this.chapIndex = -1;
    this.caps = [];
    this.chaps = [];
    this.ended = false;
    this.cc = true;
    try { this.cc = localStorage.getItem('cc') !== 'off'; } catch (e) {}
    this.renderChrome();
  }

  Player.prototype.renderChrome = function () {
    var self = this;
    var el = this.el;
    el.innerHTML = '';
    el.classList.add('is-idle');
    el.classList.toggle('cc-off', !this.cc);
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'region');
    el.setAttribute('aria-roledescription', pick(UI.video));
    if (this.def) el.setAttribute('aria-label', pick(UI.video) + ': ' + pick(this.def.title));
    var frame = h('div', 'player__frame');
    var stage = h('div', 'player__stage');
    stage.appendChild(h('div', 'player__poster'));
    var hud = h('div', 'player__hud');
    this.hudChap = h('span', 'player__chap', '<b>01</b> ' + (this.def ? pick(this.def.chapters[0]) : ''));
    hud.appendChild(this.hudChap);
    hud.appendChild(h('span', 'player__live', '<i></i>' + pick(UI.live)));
    var big = h('button', 'player__big');
    big.type = 'button';
    big.innerHTML = '<span>' + ICON.play + '<b>' + pick(UI.watch) + '</b></span>';
    big.setAttribute('aria-label', pick(UI.play));
    this.big = big;
    var cc = h('div', 'player__cc');
    this.ccP = h('p', null, this.def ? pick(this.def.intro || this.def.title) : '');
    cc.appendChild(this.ccP);
    frame.appendChild(stage);
    frame.appendChild(hud);
    frame.appendChild(big);
    frame.appendChild(cc);
    this.stage = stage;
    var bar = h('div', 'player__bar');
    var pp = h('button', 'player__btn player__pp', ICON.play);
    pp.type = 'button';
    pp.setAttribute('aria-label', pick(UI.play));
    this.pp = pp;
    this.timeEl = h('span', 'player__time', '<b>0:00</b> / 0:00');
    var track = h('div', 'player__track');
    track.setAttribute('role', 'slider');
    track.setAttribute('tabindex', '0');
    track.setAttribute('aria-label', pick(UI.seek));
    track.setAttribute('aria-valuemin', '0');
    track.innerHTML = '<div class="player__rail"><div class="player__fill"></div></div><div class="player__marks"></div><div class="player__knob"></div>';
    this.track = track;
    this.marks = track.querySelector('.player__marks');
    var ccb = h('button', 'player__btn player__ccbtn', 'CC');
    ccb.type = 'button';
    ccb.setAttribute('aria-pressed', this.cc ? 'true' : 'false');
    ccb.setAttribute('aria-label', pick(UI.cc));
    var fs = h('button', 'player__btn player__fsbtn', ICON.fs);
    fs.type = 'button';
    fs.setAttribute('aria-label', pick(UI.fs));
    bar.appendChild(pp);
    bar.appendChild(this.timeEl);
    bar.appendChild(track);
    bar.appendChild(ccb);
    bar.appendChild(fs);
    var chapters = h('ol', 'player__chapters');
    chapters.setAttribute('aria-label', pick(UI.chapters));
    this.chapBtns = [];
    if (this.def) {
      chapters.style.setProperty('--n', this.def.chapters.length);
      this.def.chapters.forEach(function (c, i) {
        var li = h('li');
        var b = h('button', null, '<span class="mono"><span>' + (i < 9 ? '0' : '') + (i + 1) + '</span><span class="ch-t"> · 0:00</span></span><span>' + pick(c) + '</span>');
        b.type = 'button';
        b.addEventListener('click', function () { self.goChapter(i); });
        li.appendChild(b);
        chapters.appendChild(li);
        self.chapBtns.push(b);
      });
    }
    el.appendChild(frame);
    el.appendChild(bar);
    el.appendChild(chapters);
    this.reserve();

    big.addEventListener('click', function () { self.userPlay(); });
    stage.addEventListener('click', function () { self.toggle(); });
    pp.addEventListener('click', function () { self.toggle(); });
    ccb.addEventListener('click', function () { self.setCC(!self.cc); });
    fs.addEventListener('click', function () { self.fullscreen(); });
    this.bindTrack();
    el.addEventListener('keydown', function (e) { self.onKey(e); });
  };

  Player.prototype.setCC = function (on) {
    this.cc = on;
    this.el.classList.toggle('cc-off', !on);
    var b = this.el.querySelector('.player__ccbtn');
    if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false');
    try { localStorage.setItem('cc', on ? 'on' : 'off'); } catch (e) {}
  };

  Player.prototype.fullscreen = function () {
    var el = this.el;
    if (document.fullscreenElement === el) {
      document.exitFullscreen && document.exitFullscreen();
    } else if (el.requestFullscreen) {
      el.requestFullscreen().catch(function () {});
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  };

  Player.prototype.bindTrack = function () {
    var self = this;
    var track = this.track;
    var wasPlaying = false;
    function at(e) {
      var r = track.getBoundingClientRect();
      return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    }
    track.addEventListener('pointerdown', function (e) {
      if (!self.ensureBuilt()) return;
      e.preventDefault();
      track.setPointerCapture && track.setPointerCapture(e.pointerId);
      wasPlaying = self.tl.isActive() && !self.tl.paused();
      self.tl.pause();
      self.el.classList.add('is-scrub');
      self.seekProgress(at(e));
      function move(ev) { self.seekProgress(at(ev)); }
      function up() {
        track.removeEventListener('pointermove', move);
        track.removeEventListener('pointerup', up);
        track.removeEventListener('pointercancel', up);
        self.el.classList.remove('is-scrub');
        if (wasPlaying && self.tl.progress() < 1) self.play(true);
      }
      track.addEventListener('pointermove', move);
      track.addEventListener('pointerup', up);
      track.addEventListener('pointercancel', up);
    });
    track.addEventListener('keydown', function (e) {
      if (!self.ensureBuilt()) return;
      var d = self.tl.duration();
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); self.seekTime(self.tl.time() + 5); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); self.seekTime(self.tl.time() - 5); }
      else if (e.key === 'Home') { e.preventDefault(); e.stopPropagation(); self.seekTime(0); }
      else if (e.key === 'End') { e.preventDefault(); e.stopPropagation(); self.seekTime(d); }
    });
  };

  Player.prototype.onKey = function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    var k = e.key;
    if (k === ' ' || k === 'k' || k === 'K') {
      if (e.target && e.target.tagName === 'BUTTON' && k === ' ') return;
      e.preventDefault();
      this.toggle();
    } else if (k === 'ArrowRight' && e.target === this.el) {
      e.preventDefault();
      if (this.ensureBuilt()) this.seekTime(this.tl.time() + 5);
    } else if (k === 'ArrowLeft' && e.target === this.el) {
      e.preventDefault();
      if (this.ensureBuilt()) this.seekTime(this.tl.time() - 5);
    } else if (k === 'c' || k === 'C') {
      this.setCC(!this.cc);
    } else if (k === 'f' || k === 'F') {
      this.fullscreen();
    } else if (/^[1-9]$/.test(k) && this.def && +k <= this.def.chapters.length) {
      this.goChapter(+k - 1);
    }
  };

  Player.prototype.pickLayout = function () {
    var w = this.el.clientWidth || this.el.getBoundingClientRect().width;
    if (document.fullscreenElement === this.el) return window.innerWidth < window.innerHeight ? 'tall' : 'wide';
    return w && w < 560 ? 'tall' : 'wide';
  };

  Player.prototype.ensureBuilt = function () {
    if (!this.def || !window.gsap) return false;
    if (!this.built) this.build();
    return !!this.tl;
  };

  Player.prototype.build = function (keepProgress, resume) {
    var self = this;
    if (!this.def || !window.gsap) return;
    var layout = this.pickLayout();
    var dims = this.dims(layout);
    if (this.tl) { this.tl.kill(); this.tl = null; }
    this.stage.innerHTML = '';
    this.stage.style.setProperty('--ar', dims.w + ' / ' + dims.h);
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 ' + dims.w + ' ' + dims.h);
    svg.setAttribute('class', 'scene scene--' + this.key + ' scene--' + layout);
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
    this.stage.appendChild(svg);
    var S = makeCtx(svg, layout, dims.w, dims.h);
    var tl;
    try {
      tl = this.def.build(S);
    } catch (err) {
      if (window.console) console.error('scene ' + this.key, err);
      return;
    }
    tl.pause(0);
    this.layout = layout;
    this.tl = tl;
    this.caps = S.caps.slice().sort(function (a, b) { return a.time - b.time; });
    this.chaps = S.chaps.slice().sort(function (a, b) { return a.time - b.time; });
    this.built = true;
    this.capIndex = -1;
    this.chapIndex = -1;
    var d = tl.duration();
    this.track.setAttribute('aria-valuemax', String(Math.round(d)));
    this.marks.innerHTML = '';
    this.chaps.forEach(function (c, i) {
      if (i === 0) return;
      var m = h('span', 'player__mark');
      m.style.left = (c.time / d * 100) + '%';
      self.marks.appendChild(m);
    });
    this.chapBtns.forEach(function (b, i) {
      var c = self.chaps[i];
      var t = b.querySelector('.ch-t');
      if (t && c) t.textContent = ' · ' + fmtTime(c.time);
    });
    tl.eventCallback('onUpdate', function () { self.sync(); });
    tl.eventCallback('onComplete', function () { self.onEnd(); });
    this.measureCaps();
    if (keepProgress != null) {
      tl.progress(keepProgress);
      this.sync();
      if (resume) this.play(true);
      else this.el.classList.toggle('is-ended', keepProgress >= 1);
    } else if (isReduced()) {
      this.poster = false;
      tl.progress(1);
      this.ended = true;
      this.sync();
      this.el.classList.remove('is-idle');
      this.el.classList.add('is-ended');
      this.setBig('play');
    } else {
      this.poster = true;
      tl.progress(this.def.poster || 0.12);
      this.sync();
    }
  };

  Player.prototype.dims = function (layout) {
    if (!this.def) return { w: 1280, h: 720 };
    return layout === 'tall' ? (this.def.tall || { w: 720, h: 960 }) : (this.def.wide || { w: 1280, h: 720 });
  };

  Player.prototype.reserve = function () {
    if (!this.def || !this.stage) return;
    var d = this.dims(this.pickLayout());
    this.stage.style.setProperty('--ar', d.w + ' / ' + d.h);
    this.measureCaps();
  };

  Player.prototype.measureCaps = function () {
    var box = this.ccP && this.ccP.parentNode;
    if (!box || !box.clientWidth) return;
    var probe = document.createElement('p');
    var pad = getComputedStyle(box);
    probe.style.cssText = 'position:absolute;visibility:hidden;left:' + pad.paddingLeft + ';right:' + pad.paddingRight + ';top:0;margin:0;pointer-events:none';
    box.appendChild(probe);
    var max = 0;
    var src = this.caps.length ? this.caps : (this.def.captions || []).map(function (t) { return { text: t }; });
    var texts = src.map(function (c) { return pick(c.text); });
    texts.push(pick(this.def.intro || this.def.title));
    texts.forEach(function (t) {
      probe.innerHTML = t;
      max = Math.max(max, probe.offsetHeight);
    });
    box.removeChild(probe);
    var cs = getComputedStyle(box);
    var pad = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    box.style.minHeight = Math.ceil(max + pad) + 'px';
  };

  Player.prototype.setBig = function (kind) {
    var label = kind === 'replay' ? pick(UI.replay) : pick(UI.watch);
    this.big.innerHTML = '<span>' + (kind === 'replay' ? ICON.replay : ICON.play) + '<b>' + label + '</b></span>';
    this.big.setAttribute('aria-label', label);
  };

  Player.prototype.sync = function () {
    var tl = this.tl;
    if (!tl) return;
    var t = tl.time();
    var d = tl.duration() || 1;
    var p = t / d;
    this.el.style.setProperty('--p', p.toFixed(4));
    this.timeEl.innerHTML = '<b>' + fmtTime(t) + '</b> / ' + fmtTime(d);
    this.track.setAttribute('aria-valuenow', String(Math.round(t)));
    this.track.setAttribute('aria-valuetext', fmtTime(t) + ' / ' + fmtTime(d));
    var ci = -1;
    for (var i = 0; i < this.caps.length; i++) {
      if (this.caps[i].time <= t + 0.01) ci = i;
    }
    if (this.poster) ci = -1;
    if (ci !== this.capIndex) {
      this.capIndex = ci;
      this.showCaption(ci >= 0 ? pick(this.caps[ci].text) : pick(this.def.intro || this.def.title));
    }
    var hi = 0;
    for (var j = 0; j < this.chaps.length; j++) {
      if (this.chaps[j].time <= t + 0.01) hi = j;
    }
    for (var k = 0; k < this.chapBtns.length; k++) {
      var c = this.chaps[k];
      var next = this.chaps[k + 1] ? this.chaps[k + 1].time : d;
      var cp = !c ? 0 : Math.min(1, Math.max(0, (t - c.time) / Math.max(0.01, next - c.time)));
      this.chapBtns[k].style.setProperty('--cp', cp.toFixed(3));
    }
    if (hi !== this.chapIndex) {
      this.chapIndex = hi;
      this.chapBtns.forEach(function (b, i) { b.classList.toggle('is-on', i === hi); });
      var name = this.def.chapters[hi];
      this.hudChap.innerHTML = '<b>' + (hi < 9 ? '0' : '') + (hi + 1) + '</b> ' + pick(name);
    }
  };

  Player.prototype.showCaption = function (text) {
    var p = this.ccP;
    if (!p) return;
    if (p.innerHTML === text) return;
    p.classList.add('is-swap');
    clearTimeout(this._capT);
    var self = this;
    this._capT = setTimeout(function () {
      p.innerHTML = text;
      p.classList.remove('is-swap');
    }, self.tl && self.tl.paused() ? 0 : 160);
  };

  Player.prototype.play = function (fromUser) {
    if (!this.ensureBuilt()) return;
    var tl = this.tl;
    players.forEach(function (o) { if (o !== this && o.tl && !o.tl.paused()) { o.pause(); o.autoPaused = false; } }, this);
    if (tl.progress() >= 1 || this.poster) {
      this.poster = false;
      tl.restart();
    } else {
      tl.play();
    }
    this.ended = false;
    this.el.classList.add('is-playing');
    this.el.classList.remove('is-idle', 'is-ended', 'is-paused');
    this.pp.innerHTML = ICON.pause;
    this.pp.setAttribute('aria-label', pick(UI.pause));
    if (fromUser) this.userPaused = false;
  };

  Player.prototype.userPlay = function () {
    this.userPaused = false;
    this.play(true);
  };

  Player.prototype.pause = function (byUser) {
    if (!this.tl) return;
    this.tl.pause();
    this.el.classList.remove('is-playing');
    if (this.tl.progress() < 1 && !this.el.classList.contains('is-idle')) this.el.classList.add('is-paused');
    this.pp.innerHTML = ICON.play;
    this.pp.setAttribute('aria-label', pick(UI.play));
    if (byUser) this.userPaused = true;
  };

  Player.prototype.toggle = function () {
    if (!this.ensureBuilt()) return;
    if (!this.tl.paused() && this.tl.progress() < 1) {
      this.pause(true);
    } else {
      this.userPlay();
    }
  };

  Player.prototype.onEnd = function () {
    this.ended = true;
    this.el.classList.remove('is-playing');
    this.el.classList.add('is-ended');
    this.pp.innerHTML = ICON.replay;
    this.pp.setAttribute('aria-label', pick(UI.replay));
    this.setBig('replay');
    setTimeout(arbitrate, 1400);
  };

  Player.prototype.seekProgress = function (p) {
    if (!this.tl) return;
    this.poster = false;
    this.tl.progress(p);
    this.el.classList.remove('is-idle');
    this.el.classList.toggle('is-ended', p >= 1);
    if (p < 1) this.setBig('play');
    this.sync();
  };

  Player.prototype.seekTime = function (t) {
    if (!this.tl) return;
    var d = this.tl.duration();
    this.seekProgress(Math.min(1, Math.max(0, t / d)));
  };

  Player.prototype.goChapter = function (i) {
    if (!this.ensureBuilt()) return;
    var c = this.chaps[i];
    if (!c) return;
    this.poster = false;
    this.tl.time(c.time + 0.001);
    this.el.classList.remove('is-idle', 'is-ended');
    this.sync();
    this.userPlay();
  };

  Player.prototype.relang = function () {
    var p = this.tl ? this.tl.progress() : null;
    var playing = this.tl && !this.tl.paused() && this.tl.progress() < 1;
    var wasBuilt = this.built;
    var idle = this.el.classList.contains('is-idle');
    this.built = false;
    if (this.tl) { this.tl.kill(); this.tl = null; }
    this.renderChrome();
    if (!idle) this.el.classList.remove('is-idle');
    if (wasBuilt) this.build(p, playing);
    if (!idle && !playing && p != null && p < 1) this.el.classList.remove('is-idle');
  };

  Player.prototype.relayout = function () {
    if (!this.built) return;
    var next = this.pickLayout();
    if (next === this.layout) return;
    var p = this.tl ? this.tl.progress() : 0;
    var playing = this.tl && !this.tl.paused() && p < 1;
    this.build(p, playing);
  };

  function mostVisible() {
    var best = null;
    players.forEach(function (p) { if (p.ratio > 0.4 && (!best || p.ratio > best.ratio)) best = p; });
    return best;
  }

  function isPlaying(p) {
    return !!(p.tl && !p.tl.paused() && p.tl.progress() < 1);
  }

  function arbitrate() {
    players.forEach(function (p) {
      if (p.built && p.ratio < 0.25 && isPlaying(p)) {
        p.pause();
        p.autoPaused = true;
      }
    });
    if (isReduced() || document.hidden) return;
    if (players.some(function (p) { return p.userPaused && p.ratio >= 0.25; })) return;
    var best = null;
    players.forEach(function (p) {
      if (!p.built || p.ended || p.ratio < 0.55) return;
      if (!best || p.ratio > best.ratio) best = p;
    });
    if (best && !isPlaying(best)) best.play(false);
  }

  function init() {
    var els = document.querySelectorAll('.player[data-scene]');
    els.forEach(function (el) {
      if (!Scenes[el.getAttribute('data-scene')]) return;
      players.push(new Player(el));
    });
    if (!players.length) return;
    if ('IntersectionObserver' in window) {
      var near = new IntersectionObserver(function (entries) {
        var fresh = false;
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var p = en.target.__player;
          if (p && !p.built) { p.build(); fresh = true; }
          near.unobserve(en.target);
        });
        if (fresh) arbitrate();
      }, { rootMargin: '900px 0px' });
      var vis = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var p = en.target.__player;
          if (p) p.ratio = en.isIntersecting ? en.intersectionRatio : 0;
        });
        arbitrate();
      }, { threshold: [0, 0.25, 0.55, 0.8, 1] });
      players.forEach(function (p) {
        p.el.__player = p;
        near.observe(p.el);
        vis.observe(p.el);
      });
    } else {
      players.forEach(function (p) { p.build(); });
    }
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(function (entries) {
        entries.forEach(function (en) {
          var p = en.target.__player;
          if (!p) return;
          clearTimeout(p._rz);
          p._rz = setTimeout(function () { if (p.built) { p.relayout(); p.measureCaps(); } else { p.reserve(); } }, 180);
        });
      });
      players.forEach(function (p) { ro.observe(p.el); });
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        players.forEach(function (p) {
          if (p.tl && !p.tl.paused()) { p.pause(); p.autoPaused = true; }
        });
      } else {
        players.forEach(function (p) {
          if (p.autoPaused && p.ratio >= 0.55 && !p.userPaused) { p.autoPaused = false; p.play(false); }
        });
      }
    });
    document.addEventListener('i18n:applied', function () {
      players.forEach(function (p) { p.relang(); });
    });
    document.addEventListener('fullscreenchange', function () {
      players.forEach(function (p) { setTimeout(function () { p.relayout(); }, 60); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'k' && e.key !== 'K') return;
      var t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (t && t.closest && t.closest('.player')) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      var p = players.filter(function (o) { return o.ratio >= 0.25 && isPlaying(o); })[0] || mostVisible();
      if (p) { e.preventDefault(); p.toggle(); }
    });
  }

  window.Players = {
    list: players,
    get: function (key) {
      for (var i = 0; i < players.length; i++) if (players[i].key === key) return players[i];
      return null;
    },
    play: function (key) {
      var p = this.get(key);
      if (p) { p.el.scrollIntoView({ behavior: isReduced() ? 'auto' : 'smooth', block: 'center' }); setTimeout(function () { p.userPlay(); }, isReduced() ? 0 : 650); }
    },
    pauseAll: function () {
      players.forEach(function (p) { if (p.tl) p.pause(); });
    },
    init: init
  };
})();
