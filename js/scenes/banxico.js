(function () {
  var T = {
    title: { es: 'Banxico y DOF: el tipo de cambio con la fecha correcta', en: 'Banxico and DOF: the FX rate on the right date' },
    ch: [
      { es: 'El desfase', en: 'The offset' },
      { es: 'La corrección', en: 'The fix' },
      { es: 'Respaldo', en: 'Fallback' }
    ],
    c1: { es: 'El DOF publica el FIX con una fecha y Odoo lo registraba <b>un día después</b>. Un día basta para que el tipo de cambio del CFDI no cuadre con la contabilidad.', en: 'The official gazette publishes the FIX on one date and Odoo recorded it <b>one day later</b>. One day is enough for the CFDI rate to disagree with the books.' },
    c2: { es: 'El módulo consulta directo la serie <b>SF43718</b> en la API SIE de Banxico y registra el tipo de cambio con la fecha que coincide con el DOF.', en: 'The module queries the <b>SF43718</b> series straight from Banxico’s SIE API and records the rate on the date that matches the gazette.' },
    c3: { es: 'Si Banxico no responde, <b>no rompe nada</b>: Odoo conserva su comportamiento nativo y el error queda en el log.', en: 'If Banxico doesn’t answer, <b>nothing breaks</b>: Odoo keeps its native behavior and the error is logged.' },
    days: [{ es: 'LUN 14', en: 'MON 14' }, { es: 'MAR 15', en: 'TUE 15' }, { es: 'MIÉ 16', en: 'WED 16' }],
    sep: { es: 'SEPTIEMBRE 2026 · ejemplo', en: 'SEPTEMBER 2026 · example' },
    dof: { es: 'DOF publica', en: 'Gazette (DOF)' },
    odoo: { es: 'Odoo nativo', en: 'Native Odoo' },
    fixed: { es: 'Con el módulo', en: 'With the module' },
    off: { es: '1 día de desfase', en: '1-day offset' },
    ok: { es: 'fechas iguales', en: 'same date' },
    api: 'GET SieAPIRest · SF43718 / oportuno',
    token: 'Bmx-Token: ••••••••',
    resp: '{ "fecha": "15/09/2026", "dato": "17.9315" }',
    down: { es: 'Banxico sin respuesta · timeout 30 s', en: 'Banxico not responding · 30 s timeout' },
    native: { es: 'se usa el cálculo nativo de Odoo', en: 'Odoo’s native rate is used' },
    log: { es: 'warning en log · sin interrumpir', en: 'warning logged · no interruption' }
  };

  function build(S) {
    var gsap = window.gsap;
    var W = S.W, H = S.H, tall = S.tall;
    var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.6 } });
    var bg = S.g();
    S.rect(0, 0, W, H, 0, 'sc-bg', bg);
    S.dotgrid(bg, 40);

    var G = tall ? { x: 150, y: 150, cw: 180, rh: 120, lw: 130 } : { x: 300, y: 150, cw: 290, rh: 118, lw: 230 };
    var lx = tall ? 26 : 70;
    S.chapter(tl, 0);
    S.cap(tl, T.c1);
    var head = S.g();
    S.text(lx, G.y - 64, T.sep, { size: 14, family: 'mono', cls: 'sc-fg3', ls: 1.5, parent: head });
    var dayEls = T.days.map(function (d, i) {
      var x = G.x + i * G.cw;
      var g = S.g(null, head);
      S.text(x + (G.cw - 16) / 2, G.y - 22, d, { size: tall ? 15 : 17, family: 'mono', weight: 600, anchor: 'middle', cls: i === 1 ? 'sc-fg' : 'sc-fg3', parent: g });
      return g;
    });
    function row(r, label, cls) {
      var y = G.y + r * G.rh;
      var g = S.g();
      S.text(lx, y + 52, label, { size: tall ? 14 : 17, weight: 600, cls: cls || 'sc-fg2', parent: g });
      for (var i = 0; i < 3; i++) S.rect(G.x + i * G.cw, y + 10, G.cw - 16, G.rh - 28, 14, 'sc-card', g);
      return { g: g, y: y };
    }
    var rDof = row(0, T.dof, 'sc-fg');
    var rOdoo = row(1, T.odoo, 'sc-fg2');
    var rFix = row(2, T.fixed, 'sc-ok');
    function rate(r, i, cls, label) {
      var x = G.x + i * G.cw;
      var g = S.g(null, r.g);
      S.rect(x, r.y + 10, G.cw - 16, G.rh - 28, 14, cls, g);
      S.text(x + (G.cw - 16) / 2, r.y + 10 + (G.rh - 28) / 2 - 4, 'FIX', { size: 12, family: 'mono', cls: 'sc-fg3', anchor: 'middle', parent: g });
      S.text(x + (G.cw - 16) / 2, r.y + 10 + (G.rh - 28) / 2 + 22, label || '17.9315', { size: tall ? 20 : 24, family: 'mono', weight: 600, anchor: 'middle', parent: g });
      g.style.opacity = 0;
      return g;
    }
    var fDof = rate(rDof, 1, 'sc-card-blue');
    var fOdoo = rate(rOdoo, 2, 'sc-card-err');
    var fFix = rate(rFix, 1, 'sc-card-ok');
    var brX = G.x + 1 * G.cw + (G.cw - 16) / 2;
    var brX2 = G.x + 2 * G.cw + (G.cw - 16) / 2;
    var brY = rOdoo.y + G.rh - 4;
    var br = S.path('M' + brX + ',' + (rDof.y + G.rh - 18) + ' L' + brX + ',' + brY + ' L' + brX2 + ',' + brY + ' L' + brX2 + ',' + (rOdoo.y + G.rh - 18), 'sc-wire-err');
    br.setAttribute('fill', 'none');
    var offT = S.text((brX + brX2) / 2, brY + 24, T.off, { size: 14, family: 'mono', weight: 600, cls: 'sc-err', anchor: 'middle' });
    offT.style.opacity = 0;
    rFix.g.style.opacity = 0;
    tl.from(head, { opacity: 0, y: -8, duration: 0.4 }, 0.1);
    tl.from([rDof.g, rOdoo.g], { opacity: 0, x: -12, stagger: 0.12, duration: 0.45 }, 0.25);
    tl.fromTo(fDof, { opacity: 0, scale: 0.8, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '+=0.2');
    tl.fromTo(fOdoo, { opacity: 0, scale: 0.8, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '+=0.25');
    S.draw(tl, br, { duration: 0.6 }, '+=0.1');
    tl.to(offT, { opacity: 1, duration: 0.3 }, '<0.3');
    S.hold(tl, 1.2);

    S.chapter(tl, 1);
    S.cap(tl, T.c2);
    var ap = tall ? { x: 26, y: rFix.y + G.rh + 26, w: W - 52 } : { x: 70, y: rFix.y + G.rh + 6, w: W - 140 };
    var apiG = S.g();
    S.rect(ap.x, ap.y, ap.w, tall ? 150 : 110, 14, 'sc-card-blue', apiG);
    S.text(ap.x + 22, ap.y + 36, T.api, { size: tall ? 14 : 16, family: 'mono', weight: 600, cls: 'sc-blue', parent: apiG });
    S.text(ap.x + 22, ap.y + (tall ? 66 : 66), T.token, { size: 14, family: 'mono', cls: 'sc-gold', parent: apiG });
    var rs = S.text(tall ? ap.x + 22 : ap.x + ap.w - 22, ap.y + (tall ? 104 : 94), T.resp, { size: tall ? 13.5 : 16, family: 'mono', cls: 'sc-ok', anchor: tall ? 'start' : 'end', parent: apiG });
    apiG.style.opacity = 0;
    rs.style.opacity = 0;
    tl.to(apiG, { opacity: 1, duration: 0.4 });
    tl.from(apiG, { y: 14, duration: 0.4 }, '<');
    tl.to(rs, { opacity: 1, duration: 0.3 }, '+=0.3');
    tl.to(rFix.g, { opacity: 1, duration: 0.4 }, '+=0.1');
    tl.fromTo(fFix, { opacity: 0, scale: 0.8, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, '<0.2');
    var al = S.path('M' + brX + ',' + (rDof.y + G.rh - 18) + ' L' + brX + ',' + (rFix.y + 10), 'sc-wire-ok');
    S.draw(tl, al, { duration: 0.5 }, '<0.2');
    var okT = S.chip(brX + 22, rOdoo.y + G.rh / 2 - 13 + 6, T.ok, { size: 13, cls: 'sc-card-ok', tcls: 'sc-ok', weight: 600 });
    okT.g.style.opacity = 0;
    tl.to([fOdoo, br, offT], { opacity: 0.18, duration: 0.4 }, '<');
    tl.to(okT.g, { opacity: 1, duration: 0.3 }, '<0.2');
    S.hold(tl, 1.4);

    S.chapter(tl, 2);
    S.cap(tl, T.c3);
    var fb = S.g();
    fb.style.opacity = 0;
    var fbY = ap.y;
    S.rect(ap.x, fbY, ap.w, tall ? 150 : 110, 14, 'sc-card-warn', fb);
    S.text(ap.x + 22, fbY + 36, T.down, { size: tall ? 14 : 16, family: 'mono', weight: 600, cls: 'sc-gold', parent: fb });
    S.text(ap.x + 22, fbY + 68, T.native, { size: tall ? 14 : 16, cls: 'sc-fg', weight: 600, parent: fb });
    S.text(ap.x + 22, fbY + (tall ? 104 : 94), T.log, { size: 13, family: 'mono', cls: 'sc-fg3', parent: fb });
    S.check(ap.x + ap.w - 40, fbY + (tall ? 40 : 36), 15, true, fb);
    tl.to(apiG, { opacity: 0, duration: 0.3 });
    tl.to(fb, { opacity: 1, duration: 0.4 }, '<0.1');
    tl.from(fb, { y: 12, duration: 0.4 }, '<');
    S.hold(tl, 2.4);
    return tl;
  }

  window.Scenes = window.Scenes || {};
  window.Scenes.banxico = {
    title: T.title,
    chapters: T.ch,
    poster: 0.34,
    captions: [T.c1, T.c2, T.c3],
    wide: { w: 1280, h: 720 },
    tall: { w: 720, h: 820 },
    build: build
  };
})();
