(function () {
  var T = {
    title: { es: 'SEPOMEX: direcciones que sí existen', en: 'SEPOMEX: addresses that actually exist' },
    ch: [
      { es: 'Captura', en: 'Entry' },
      { es: 'Validación', en: 'Validation' },
      { es: 'Checkout', en: 'Checkout' }
    ],
    c1: { es: 'Alguien captura una dirección con prisa: sin acentos y con un error de dedo en la ciudad.', en: 'Someone types an address in a hurry: no accents and a typo in the city.' },
    c2: { es: 'El CP se busca en el <b>catálogo SEPOMEX local</b>, sin APIs externas. El estado se compara sin acentos y la ciudad con similitud difusa: 0.94 supera el umbral de 0.86.', en: 'The ZIP is looked up in the <b>local SEPOMEX catalog</b>, no external APIs. The state is compared accent-insensitively and the city with fuzzy similarity: 0.94 clears the 0.86 threshold.' },
    c3: { es: 'En la tienda en línea, un CP que no corresponde al estado <b>bloquea el checkout</b> hasta corregirlo. En contactos solo avisa.', en: 'In the online store, a ZIP that doesn’t match the state <b>blocks checkout</b> until fixed. On contacts it only warns.' },
    form: { es: 'Contacto · dirección', en: 'Contact · address' },
    fields: [['CP', '64000'], [{ es: 'Estado', en: 'State' }, 'Nuevo Leon'], [{ es: 'Ciudad', en: 'City' }, 'Monterey'], [{ es: 'Colonia', en: 'Neighborhood' }, 'Centro']],
    cat: { es: 'catálogo SEPOMEX · CP 64000', en: 'SEPOMEX catalog · ZIP 64000' },
    catRow: [[{ es: 'estado', en: 'state' }, 'Nuevo León'], [{ es: 'municipio', en: 'municipality' }, 'Monterrey'], [{ es: 'colonias', en: 'neighborhoods' }, 'Centro, …']],
    chk: [
      [{ es: 'CP existe en el catálogo', en: 'ZIP exists in the catalog' }, ''],
      [{ es: 'estado sin acentos', en: 'state, accent-insensitive' }, 'nuevo leon = nuevo leon'],
      [{ es: 'ciudad difusa', en: 'fuzzy city' }, 'monterey ~ monterrey · 0.9412'],
      [{ es: 'colonia', en: 'neighborhood' }, 'centro = centro']
    ],
    valid: { es: 'CP 64000 válido (Monterrey, Nuevo León)', en: 'ZIP 64000 valid (Monterrey, Nuevo León)' },
    shop: { es: 'Tienda · datos de envío', en: 'Store · shipping details' },
    state2: 'Jalisco',
    err: { es: 'el estado debería ser «Nuevo León»', en: 'the state should be “Nuevo León”' },
    cont: { es: 'Continuar', en: 'Continue' },
    blocked: { es: 'bloqueado hasta corregir', en: 'blocked until fixed' },
    fixed: { es: 'corregido · continúa', en: 'fixed · continues' }
  };

  function build(S) {
    var gsap = window.gsap;
    var W = S.W, H = S.H, tall = S.tall;
    var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.6 } });
    var bg = S.g();
    S.rect(0, 0, W, H, 0, 'sc-bg', bg);
    S.dotgrid(bg, 40);
    var s1 = S.slide(), s3 = S.slide();

    var F = tall ? { x: 26, y: 88, w: W - 52 } : { x: 70, y: 96, w: 520 };
    var fh = tall ? 66 : 84;
    S.chapter(tl, 0);
    S.cap(tl, T.c1);
    S.showSlide(tl, s1, 0, { from: 1 });
    var fg = S.g(null, s1);
    S.text(F.x, F.y + 18, T.form, { size: 14, family: 'mono', cls: 'sc-fg3', ls: 1.5, parent: fg });
    var inputs = T.fields.map(function (f, i) {
      var y = F.y + 34 + i * (fh + 10);
      var g = S.g(null, fg);
      S.text(F.x + 4, y + 20, f[0], { size: 13, family: 'mono', cls: 'sc-fg3', parent: g });
      var b = S.rect(F.x, y + 30, F.w, fh - 34, 10, 'sc-card', g);
      var v = S.text(F.x + 16, y + 30 + (fh - 34) / 2 + 7, '', { size: tall ? 17 : 19, family: 'mono', cls: 'sc-fg', parent: g });
      return { g: g, b: b, v: v, text: f[1], y: y };
    });
    tl.from(fg, { opacity: 0, y: 10, duration: 0.4 }, 0.1);
    inputs.forEach(function (inp, i) {
      var st = { n: 0 };
      tl.to(st, {
        n: inp.text.length, duration: 0.35 + inp.text.length * 0.03, ease: 'none',
        onUpdate: function () { inp.v.textContent = inp.text.slice(0, Math.round(st.n)); }
      }, i ? '+=0.1' : '+=0.2');
    });
    S.hold(tl, 0.6);

    S.chapter(tl, 1);
    S.cap(tl, T.c2);
    var C = tall ? { x: 26, y: F.y + 34 + 4 * (fh + 10) + 12, w: W - 52 } : { x: F.x + F.w + 40, y: 96, w: W - 70 - (F.x + F.w + 40) };
    var cg = S.g(null, s1);
    var cH = tall ? 330 : 510;
    S.rect(C.x, C.y, C.w, cH, 16, 'sc-card', cg);
    S.chip(C.x + 20, C.y + 18, T.cat, { size: 13, cls: 'sc-soft-blue', tcls: 'sc-blue', weight: 600, parent: cg });
    var catEls = T.catRow.map(function (r, i) {
      var y = C.y + 76 + i * (tall ? 26 : 30);
      var g = S.g(null, cg);
      S.text(C.x + 22, y, r[0], { size: 13, family: 'mono', cls: 'sc-fg4', parent: g });
      S.text(C.x + (tall ? 140 : 150), y, r[1], { size: tall ? 14 : 15, family: 'mono', cls: 'sc-fg', parent: g });
      g.style.opacity = 0;
      return g;
    });
    var ckY = C.y + (tall ? 170 : 190);
    var checks = T.chk.map(function (c, i) {
      var y = ckY + i * (tall ? 34 : 62);
      var g = S.g(null, cg);
      var ck = S.check(C.x + 34, y, tall ? 11 : 13, true, g);
      S.text(C.x + 56, y + 5, c[0], { size: tall ? 13 : 15, weight: 600, parent: g });
      if (c[1] && !tall) S.text(C.x + 56, y + 29, c[1], { size: 13, family: 'mono', cls: i === 2 ? 'sc-gold' : 'sc-fg3', parent: g });
      if (c[1] && tall) S.text(C.x + C.w - 18, y + 5, c[1].split(' · ').pop(), { size: 12, family: 'mono', cls: i === 2 ? 'sc-gold' : 'sc-fg3', anchor: 'end', parent: g });
      g.style.opacity = 0;
      return g;
    });
    var ban = tall ? { x: 26, y: C.y + cH + 14, w: W - 52 } : { x: F.x, y: F.y + 34 + 4 * (fh + 10) + 20, w: F.w };
    var banG = S.g(null, s1);
    S.rect(ban.x, ban.y, ban.w, 60, 12, 'sc-card-ok', banG);
    S.text(ban.x + 20, ban.y + 37, T.valid, { size: tall ? 14 : 15, family: 'mono', weight: 600, cls: 'sc-ok', parent: banG });
    banG.style.opacity = 0;
    tl.from(cg, { opacity: 0, x: 16, duration: 0.45 });
    tl.to(catEls, { opacity: 1, stagger: 0.12, duration: 0.25 }, '+=0.1');
    checks.forEach(function (g, i) {
      tl.to(g, { opacity: 1, duration: 0.25 }, '+=' + (i ? 0.25 : 0.2));
      if (i === 1) tl.set(inputs[1].b, { attr: { class: 'sc-card-ok' } }, '<');
      if (i === 2) tl.set(inputs[2].b, { attr: { class: 'sc-card-ok' } }, '<');
      if (i === 3) tl.set(inputs[3].b, { attr: { class: 'sc-card-ok' } }, '<');
      if (i === 0) tl.set(inputs[0].b, { attr: { class: 'sc-card-ok' } }, '<');
    });
    tl.fromTo(banG, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, '+=0.2');
    S.hold(tl, 1.4);

    S.hideSlide(tl, s1);
    S.chapter(tl, 2);
    S.cap(tl, T.c3);
    S.showSlide(tl, s3, '<0.3');
    var K = tall ? { x: 26, y: 96, w: W - 52 } : { x: 250, y: 96, w: 780 };
    var kg = S.g(null, s3);
    S.rect(K.x, K.y, K.w, tall ? 420 : 440, 18, 'sc-card', kg);
    S.text(K.x + 24, K.y + 40, T.shop, { size: 15, family: 'mono', cls: 'sc-fg3', ls: 1.5, parent: kg });
    var rows = [['CP', '64000'], [{ es: 'Estado', en: 'State' }, 'Jalisco']];
    var shopIn = rows.map(function (r, i) {
      var y = K.y + 64 + i * (tall ? 128 : 124);
      var g = S.g(null, kg);
      S.text(K.x + 24, y + 20, r[0], { size: 13, family: 'mono', cls: 'sc-fg3', parent: g });
      var b = S.rect(K.x + 24, y + 30, K.w - 48, 52, 10, 'sc-card2', g);
      var v = S.text(K.x + 40, y + 63, r[1], { size: 19, family: 'mono', parent: g });
      return { g: g, b: b, v: v, y: y };
    });
    var errT = S.text(K.x + 24, shopIn[0].y + 106, T.err, { size: 14, family: 'mono', cls: 'sc-err', weight: 600, parent: kg });
    errT.style.opacity = 0;
    var btnY = K.y + (tall ? 330 : 330);
    var btn = S.chip(K.x + 24, btnY, T.cont, { size: 18, cls: 'sc-acc', tcls: 'sc-on-acc', weight: 600, h: 48, r: 12, padX: 28, parent: kg });
    var blocked = S.chip(K.x + 24 + btn.w + 16, btnY + 10, T.blocked, { size: 13, cls: 'sc-card-err', tcls: 'sc-err', weight: 600, parent: kg });
    blocked.g.style.opacity = 0;
    var fixedC = S.chip(K.x + 24 + btn.w + 16, btnY + 10, T.fixed, { size: 13, cls: 'sc-card-ok', tcls: 'sc-ok', weight: 600, parent: kg });
    fixedC.g.style.opacity = 0;
    var nl = S.text(K.x + 40, shopIn[1].y + 63, 'Nuevo León', { size: 19, family: 'mono', cls: 'sc-ok', parent: kg });
    nl.style.opacity = 0;
    tl.from(kg, { opacity: 0, y: 12, duration: 0.4 }, '<0.15');
    tl.to(btn.g, { scale: 0.95, transformOrigin: '50% 50%', duration: 0.1, yoyo: true, repeat: 1 }, '+=0.5');
    tl.set(shopIn[0].b, { attr: { class: 'sc-card-err' } });
    tl.to(errT, { opacity: 1, duration: 0.25 }, '<');
    tl.to(btn.g, { opacity: 0.4, duration: 0.25 }, '<');
    tl.to(blocked.g, { opacity: 1, duration: 0.25 }, '<');
    tl.to(shopIn[0].g, { x: 6, duration: 0.05, yoyo: true, repeat: 5, ease: 'none' }, '<');
    tl.to(shopIn[1].v, { opacity: 0, duration: 0.2 }, '+=1');
    tl.to(nl, { opacity: 1, duration: 0.25 }, '<0.1');
    tl.set([shopIn[0].b, shopIn[1].b], { attr: { class: 'sc-card-ok' } });
    tl.to(errT, { opacity: 0, duration: 0.2 }, '<');
    tl.to(blocked.g, { opacity: 0, duration: 0.2 }, '<');
    tl.to(btn.g, { opacity: 1, duration: 0.25 }, '<');
    tl.to(fixedC.g, { opacity: 1, duration: 0.25 }, '<0.1');
    S.hold(tl, 2.2);
    return tl;
  }

  window.Scenes = window.Scenes || {};
  window.Scenes.sepomex = {
    title: T.title,
    chapters: T.ch,
    poster: 0.52,
    captions: [T.c1, T.c2, T.c3],
    wide: { w: 1280, h: 720 },
    tall: { w: 720, h: 900 },
    build: build
  };
})();
