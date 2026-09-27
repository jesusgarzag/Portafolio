(function () {
  var TAU = Math.PI * 2;
  var root = document.documentElement;

  function cssRGB(name, fallback) {
    var v = getComputedStyle(root).getPropertyValue(name).trim();
    return v || fallback;
  }

  function isLight() {
    return root.getAttribute('data-theme') === 'light';
  }

  function layerCanvas(size) {
    var c = document.createElement('canvas');
    c.width = c.height = size;
    return c;
  }

  function strokeCurve(ctx, cx, cy, fn, steps) {
    ctx.beginPath();
    for (var i = 0; i <= steps; i++) {
      var t = i / steps * TAU;
      var r = fn(t);
      var x = cx + Math.cos(t) * r;
      var y = cy + Math.sin(t) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  function drawBand(ctx, S, rgb, alpha, lw) {
    var R = S / 2;
    ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha + ')';
    ctx.lineWidth = lw;
    var K = 28;
    for (var k = 0; k < K; k++) {
      var ph = k / K * TAU / 36 * 2;
      strokeCurve(ctx, R, R, function (t) {
        return R * (0.865 + 0.052 * Math.sin(36 * t + ph * 36) * Math.cos(3 * t + k * 0.05));
      }, 1440);
    }
    ctx.lineWidth = lw * 1.2;
    ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha * 1.4 + ')';
    [0.795, 0.94].forEach(function (f) {
      ctx.beginPath();
      ctx.arc(R, R, R * f, 0, TAU);
      ctx.stroke();
    });
  }

  function drawRosette(ctx, S, rgb, alpha, lw) {
    var R = S / 2;
    ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha + ')';
    ctx.lineWidth = lw;
    var K = 22;
    var n = 14;
    for (var k = 0; k < K; k++) {
      var rot = k / K * TAU / n;
      strokeCurve(ctx, R, R, function (t) {
        var u = t + rot;
        return R * (0.55 + 0.19 * Math.cos(n * u) * Math.cos(u * 2 + k * 0.02) + 0.02 * Math.sin(3 * n * u));
      }, 1600);
    }
  }

  function drawInner(ctx, S, rgb, alpha, lw) {
    var R = S / 2;
    ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha + ')';
    ctx.lineWidth = lw;
    var K = 30;
    var n = 9;
    for (var k = 0; k < K; k++) {
      var rot = k / K * TAU / n;
      strokeCurve(ctx, R, R, function (t) {
        var u = t + rot;
        return R * (0.26 + 0.1 * Math.sin(n * u) + 0.035 * Math.cos(2 * n * u + k * 0.3));
      }, 1200);
    }
    ctx.lineWidth = lw * 1.3;
    ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha * 1.5 + ')';
    ctx.beginPath();
    ctx.arc(R, R, R * 0.155, 0, TAU);
    ctx.stroke();
  }

  function Seal(canvas, opts) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.opts = opts || {};
    this.layers = [];
    this.px = 0;
    this.py = 0;
    this.tx = 0;
    this.ty = 0;
    this.reveal = this.opts.reveal != null ? this.opts.reveal : 1;
    this.running = false;
    this.t0 = performance.now();
    this.speed = 1;
    this.resize();
  }

  Seal.prototype.resize = function () {
    var rect = this.canvas.getBoundingClientRect();
    var css = Math.max(120, Math.round(Math.min(rect.width || 400, rect.height || rect.width || 400)));
    var dpr = Math.min(window.devicePixelRatio || 1, this.opts.maxDpr || 1.75);
    var S = Math.round(css * dpr);
    if (S === this.S && this.themeKey === (isLight() ? 'l' : 'd')) return;
    this.S = S;
    this.canvas.width = S;
    this.canvas.height = S;
    this.build();
    this.draw();
  };

  Seal.prototype.build = function () {
    var S = this.S;
    var light = isLight();
    this.themeKey = light ? 'l' : 'd';
    var a = cssRGB('--guil-a', '61, 214, 163');
    var b = cssRGB('--guil-b', '237, 231, 218');
    var c = cssRGB('--guil-c', '255, 91, 58');
    var lw = Math.max(0.6, S / 1400);
    var k = light ? 1.35 : 1;
    var specs = [
      { fn: drawBand, rgb: b, alpha: 0.16 * k, speed: 0.012, depth: 10 },
      { fn: drawRosette, rgb: a, alpha: 0.2 * k, speed: -0.02, depth: 18 },
      { fn: drawInner, rgb: c, alpha: 0.3 * k, speed: 0.035, depth: 26 }
    ];
    if (this.opts.small) specs.forEach(function (s) { s.alpha *= 1.6; });
    this.layers = specs.map(function (sp) {
      var cv = layerCanvas(S);
      var cx = cv.getContext('2d');
      cx.lineJoin = 'round';
      sp.fn(cx, S, sp.rgb, sp.alpha, lw);
      return { cv: cv, speed: sp.speed, depth: sp.depth };
    });
  };

  Seal.prototype.draw = function (now) {
    var ctx = this.ctx;
    var S = this.S;
    if (!S) return;
    var t = ((now || performance.now()) - this.t0) / 1000 * this.speed;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, S, S);
    ctx.globalCompositeOperation = isLight() ? 'multiply' : 'lighter';
    this.px += (this.tx - this.px) * 0.06;
    this.py += (this.ty - this.py) * 0.06;
    var rev = this.reveal;
    for (var i = 0; i < this.layers.length; i++) {
      var L = this.layers[i];
      ctx.save();
      if (rev < 1) {
        var lr = Math.min(1, Math.max(0, rev * 1.6 - i * 0.3));
        if (lr <= 0) { ctx.restore(); continue; }
        ctx.beginPath();
        ctx.moveTo(S / 2, S / 2);
        ctx.arc(S / 2, S / 2, S, -Math.PI / 2, -Math.PI / 2 + lr * TAU);
        ctx.closePath();
        ctx.clip();
      }
      ctx.translate(S / 2 + this.px * L.depth * (S / 1000), S / 2 + this.py * L.depth * (S / 1000));
      ctx.rotate(t * L.speed * TAU);
      ctx.drawImage(L.cv, -S / 2, -S / 2);
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
  };

  Seal.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    var self = this;
    function loop(now) {
      if (!self.running) return;
      self.draw(now);
      self.raf = requestAnimationFrame(loop);
    }
    this.raf = requestAnimationFrame(loop);
  };

  Seal.prototype.stop = function () {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  };

  Seal.prototype.pointer = function (nx, ny) {
    this.tx = nx;
    this.ty = ny;
  };

  function grainURL() {
    var n = 180;
    var c = layerCanvas(n);
    var ctx = c.getContext('2d');
    var img = ctx.createImageData(n, n);
    for (var i = 0; i < img.data.length; i += 4) {
      var v = Math.random() * 255 | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  }

  function stampMaskURL() {
    var n = 180;
    var c = layerCanvas(n);
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, n, n);
    ctx.globalCompositeOperation = 'destination-out';
    for (var i = 0; i < 520; i++) {
      var r = Math.random() * 1.8 + 0.3;
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(Math.random() * n, Math.random() * n, r, 0, TAU);
      ctx.fill();
    }
    for (var j = 0; j < 14; j++) {
      ctx.globalAlpha = 0.25;
      ctx.beginPath();
      ctx.ellipse(Math.random() * n, Math.random() * n, Math.random() * 16 + 4, Math.random() * 3 + 1, Math.random() * TAU, 0, TAU);
      ctx.fill();
    }
    return c.toDataURL('image/png');
  }

  function waveSVG(stroke, w, h, lines, amp, periods, sw) {
    var p = '';
    for (var k = 0; k < lines; k++) {
      var d = '';
      var ph = k / lines * TAU;
      for (var x = 0; x <= w; x += 2) {
        var y = h / 2 + Math.sin(x / w * TAU * periods + ph) * amp * (0.55 + 0.45 * Math.cos(ph));
        d += (x ? 'L' : 'M') + x + ',' + y.toFixed(2);
      }
      p += '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="' + sw + '"/>';
    }
    return 'url("data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' + p + '</svg>') + '")';
  }

  function textures() {
    var light = isLight();
    try {
      root.style.setProperty('--grain-url', 'url(' + grainURL() + ')');
      root.style.setProperty('--stamp-mask', 'url(' + stampMaskURL() + ')');
    } catch (e) {}
    var line = light ? 'rgba(21,23,28,0.28)' : 'rgba(237,231,218,0.2)';
    root.style.setProperty('--wave-url', waveSVG(line, 240, 22, 6, 7, 2, 0.6));
    var acc = getComputedStyle(root).getPropertyValue('--accent').trim() || '#ff5b3a';
    root.style.setProperty('--wave-accent', waveSVG(acc, 22, 8, 1, 2.2, 1, 1.4));
  }

  window.Guilloche = {
    Seal: Seal,
    textures: textures,
    retheme: function () {
      var light = isLight();
      var line = light ? 'rgba(21,23,28,0.28)' : 'rgba(237,231,218,0.2)';
      root.style.setProperty('--wave-url', waveSVG(line, 240, 22, 6, 7, 2, 0.6));
      var acc = getComputedStyle(root).getPropertyValue('--accent').trim() || '#ff5b3a';
      root.style.setProperty('--wave-accent', waveSVG(acc, 22, 8, 1, 2.2, 1, 1.4));
    }
  };
})();
