(function () {
  var T = {
    title: { es: 'IMSS: cuotas obrero-patronales, día por día', en: 'IMSS: social security contributions, day by day' },
    ch: [
      { es: 'Días reales', en: 'Real days' },
      { es: 'Topes y excedente', en: 'Caps & excess' },
      { es: 'Trece cuotas', en: 'Thirteen contributions' },
      { es: 'IDSE y SUA', en: 'IDSE & SUA files' },
      { es: 'Confronta', en: 'Reconciliation' }
    ],
    c1: { es: 'El cálculo parte de los días reales del trabajador: altas, incapacidades y ausencias. Si el salario cambia a mitad del mes, el periodo se divide en <b>tramos</b>.', en: 'The calculation starts from the worker’s real days: enrollment, disability leave and absences. If the salary changes mid-month, the period splits into <b>tranches</b>.' },
    c2: { es: 'Cada día usa la UMA vigente: el SBC se topa en <b>25 UMA</b> y la cuota de excedente se calcula sobre lo que pasa de <b>3 UMA</b>.', en: 'Every day uses the UMA in force: the contribution base is capped at <b>25 UMA</b> and the excess fee applies to whatever goes above <b>3 UMA</b>.' },
    c3: { es: 'Trece conceptos de cuota, cada uno con su base y su tasa. La cesantía y vejez patronal toma la tasa del <b>rango del salario</b> en la tabla vigente.', en: 'Thirteen contribution concepts, each with its own base and rate. The employer old-age rate is taken from the <b>salary band</b> in the current table.' },
    c4: { es: 'Con los mismos datos genera los archivos de <b>ancho fijo</b> para IDSE y SUA, validando NSS, CURP y registro patronal antes de exportar.', en: 'The same data produces the <b>fixed-width</b> files for IDSE and SUA, validating social security number, CURP and employer registration before exporting.' },
    c5: { es: 'Y cierra el ciclo: compara lo calculado en Odoo contra la <b>cédula del IMSS</b> y marca cada diferencia por trabajador.', en: 'And it closes the loop: it compares what Odoo calculated against the <b>IMSS statement</b> and flags every difference per worker.' },
    month: { es: 'SEPTIEMBRE 2026', en: 'SEPTEMBER 2026' },
    dow: { es: ['L', 'M', 'M', 'J', 'V', 'S', 'D'], en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'] },
    t1: { es: 'tramo 1 · SBC $950.00', en: 'tranche 1 · SBC $950.00' },
    t2: { es: 'tramo 2 · SBC $1,000.00', en: 'tranche 2 · SBC $1,000.00' },
    lgAlta: { es: 'día de alta', en: 'enrolled day' },
    lgInc: { es: 'incapacidad', en: 'disability' },
    lgAus: { es: 'ausencia', en: 'absence' },
    tagInc: { es: 'INC', en: 'DIS' },
    tagAus: { es: 'AUS', en: 'ABS' },
    b1: { es: 'EyM · sin días de incapacidad', en: 'Health · excludes disability days' },
    b2: { es: 'Retiro · sin días de ausencia', en: 'Retirement · excludes absences' },
    b3: { es: 'cambio de salario el día 16', en: 'salary change on day 16' },
    uma: { es: 'UMA 2026 · $117.31 diario', en: 'UMA 2026 · $117.31 daily' },
    wa: { es: 'Trabajador A · SBC $1,000.00', en: 'Worker A · SBC $1,000.00' },
    wb: { es: 'Trabajador B · SBC $3,200.00', en: 'Worker B · SBC $3,200.00' },
    exc: { es: 'excedente $648.07', en: 'excess $648.07' },
    capped: { es: 'topado a $2,932.75', en: 'capped at $2,932.75' },
    ex: { es: 'Ejemplo · tramo 2 · 15 días · SBC $1,000.00', en: 'Example · tranche 2 · 15 days · SBC $1,000.00' },
    hConcept: { es: 'CONCEPTO', en: 'CONCEPT' },
    hBase: { es: 'BASE', en: 'BASE' },
    hPat: { es: 'PATRÓN', en: 'EMPLOYER' },
    hObr: { es: 'OBRERO', en: 'WORKER' },
    rows: [
      [{ es: 'Cuota fija', en: 'Fixed fee' }, 'UMA', '20.40%', '—', 358.97, null],
      [{ es: 'Excedente de 3 UMA', en: 'Excess over 3 UMA' }, { es: 'excedente', en: 'excess' }, '1.10%', '0.40%', 106.93, 38.88],
      [{ es: 'Prestaciones en dinero', en: 'Cash benefits' }, 'SBC', '0.70%', '0.25%', 105.00, 37.50],
      [{ es: 'Gastos médicos pensionados', en: 'Pensioner medical' }, 'SBC', '1.05%', '0.375%', 157.50, 56.25],
      [{ es: 'Invalidez y vida', en: 'Disability & life' }, 'SBC', '1.75%', '0.625%', 262.50, 93.75],
      [{ es: 'Guarderías', en: 'Childcare' }, 'SBC', '1.00%', '—', 150.00, null],
      [{ es: 'Cesantía y vejez', en: 'Old-age & severance' }, 'SBC', '7.513%', '1.125%', 1126.95, 168.75],
      [{ es: 'Retiro', en: 'Retirement' }, 'SBC', '2.00%', '—', 300.00, null],
      [{ es: 'INFONAVIT', en: 'INFONAVIT' }, 'SBC', '5.00%', '—', 750.00, null]
    ],
    band: { es: 'rango 4.01 UMA o más → 7.513 %', en: 'band 4.01 UMA and up → 7.513%' },
    total: { es: 'Total del tramo', en: 'Tranche total' },
    file: 'SUA · movimientos.txt',
    segs: [
      ['Y5412345109', { es: 'registro patronal', en: 'employer reg.' }, 'sc-blue'],
      ['12345678901', 'NSS', 'sc-violet'],
      ['07', { es: 'cambio de salario', en: 'salary change' }, 'sc-acc-ink'],
      ['16092026', { es: 'fecha', en: 'date' }, 'sc-gold'],
      ['        ', { es: 'folio', en: 'folio' }, 'sc-fg4'],
      ['00', { es: 'días', en: 'days' }, 'sc-fg2'],
      ['0100000', 'SBC', 'sc-ok']
    ],
    v1: { es: 'NSS de 11 dígitos', en: '11-digit NSS' },
    v2: 'CURP',
    v3: { es: 'registro patronal', en: 'employer registration' },
    v4: { es: 'SBC sin decimales, 7 posiciones', en: 'SBC, 7 positions, no dot' },
    colOdoo: 'Odoo',
    colImss: { es: 'Cédula IMSS', en: 'IMSS statement' },
    people: ['Ana R.', 'Luis M.', 'Carla P.', 'Jorge T.'],
    diff: { es: 'diferencia · 1 día', en: 'difference · 1 day' },
    result: { es: '1 diferencia por revisar · 3 cuadran', en: '1 difference to review · 3 match' }
  };

  function money(n) {
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function build(S) {
    var gsap = window.gsap;
    var W = S.W, H = S.H, tall = S.tall;
    var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.6 } });
    var bg = S.g();
    S.rect(0, 0, W, H, 0, 'sc-bg', bg);
    S.dotgrid(bg, 40);
    var s1 = S.slide(), s2 = S.slide(), s3 = S.slide(), s4 = S.slide(), s5 = S.slide();

    S.chapter(tl, 0);
    S.cap(tl, T.c1);
    S.showSlide(tl, s1, 0, { from: 1 });
    var cal = tall ? { x: 36, y: 156, cw: 92, ch: 70 } : { x: 80, y: 150, cw: 84, ch: 66 };
    S.text(cal.x, cal.y - 44, T.month, { size: 18, family: 'mono', weight: 600, ls: 2, parent: s1 });
    var dowL = S.t(T.dow);
    for (var d = 0; d < 7; d++) {
      S.text(cal.x + d * cal.cw + (cal.cw - 8) / 2, cal.y - 12, dowL[d], { size: 14, family: 'mono', cls: 'sc-fg4', anchor: 'middle', parent: s1 });
    }
    var cells = [];
    for (var day = 1; day <= 30; day++) {
      var col = day % 7;
      var row = Math.floor(day / 7);
      var x = cal.x + col * cal.cw;
      var y = cal.y + row * cal.ch;
      var g = S.g(null, s1);
      var cls = day <= 15 ? 'sc-card-blue' : 'sc-card-ok';
      if (day === 9) cls = 'sc-card-warn';
      if (day === 22) cls = 'sc-card-err';
      var b = S.rect(x, y, cal.cw - 8, cal.ch - 8, 10, 'sc-card', g);
      S.text(x + 12, y + 26, String(day), { size: 16, family: 'mono', weight: 600, cls: 'sc-fg2', parent: g });
      if (day === 9) S.text(x + cal.cw - 18, y + cal.ch - 18, T.tagInc, { size: 11, family: 'mono', cls: 'sc-gold', anchor: 'end', weight: 600, parent: g });
      if (day === 22) S.text(x + cal.cw - 18, y + cal.ch - 18, T.tagAus, { size: 11, family: 'mono', cls: 'sc-err', anchor: 'end', weight: 600, parent: g });
      cells.push({ g: g, b: b, cls: cls, day: day });
    }
    var lg = tall ? { x: 36, y: cal.y + 5 * cal.ch + 30 } : { x: cal.x + 7 * cal.cw + 40, y: 130 };
    var lgW = tall ? W - 72 : W - lg.x - 70;
    var lgEls = [];
    var tr1 = S.chip(lg.x, lg.y, T.t1, { size: 15, cls: 'sc-card-blue', tcls: 'sc-blue', weight: 600, parent: s1 });
    var tr2 = S.chip(tall ? lg.x : lg.x, tall ? lg.y + 46 : lg.y + 48, T.t2, { size: 15, cls: 'sc-card-ok', tcls: 'sc-ok', weight: 600, parent: s1 });
    lgEls.push(tr1.g, tr2.g);
    var legY = tall ? lg.y + 118 : lg.y + 132;
    [[T.lgAlta, 'sc-card'], [T.lgInc, 'sc-card-warn'], [T.lgAus, 'sc-card-err']].forEach(function (l, i) {
      var g = S.g(null, s1);
      var lx = tall ? lg.x + i * 216 : lg.x;
      var ly = tall ? legY : legY + i * 40;
      S.rect(lx, ly - 16, 22, 22, 6, l[1], g);
      S.text(lx + 34, ly, l[0], { size: 15, family: 'mono', cls: 'sc-fg2', parent: g });
      lgEls.push(g);
    });
    var rulesY = tall ? legY + 44 : legY + 150;
    var rules = [T.b1, T.b2, T.b3].map(function (t, i) {
      var c = S.chip(lg.x, rulesY + i * 46, t, { size: 14.5, cls: 'sc-card2', tcls: 'sc-fg', parent: s1 });
      return c.g;
    });
    tl.from(cells.map(function (c) { return c.g; }), { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', stagger: 0.025, duration: 0.35 }, 0.2);
    cells.forEach(function (c, i) {
      tl.set(c.b, { attr: { class: c.cls } }, 1.3 + (c.day <= 15 ? c.day * 0.03 : 0.5 + (c.day - 15) * 0.03));
    });
    tl.from(lgEls, { opacity: 0, x: 12, stagger: 0.1, duration: 0.4 }, 1.4);
    tl.from(rules, { opacity: 0, x: 12, stagger: 0.18, duration: 0.4 }, '+=0.2');
    S.hold(tl, 1.8);

    S.hideSlide(tl, s1);
    S.chapter(tl, 1);
    S.cap(tl, T.c2);
    S.showSlide(tl, s2, '<0.3');
    var ax = tall ? { x0: 50, x1: 670, y: 200 } : { x0: 120, x1: 1160, y: 190 };
    var umaMax = 28;
    function X(u) { return ax.x0 + (ax.x1 - ax.x0) * u / umaMax; }
    var umaChip = S.chip(ax.x0, ax.y - 88, T.uma, { size: 15, cls: 'sc-soft-gold', tcls: 'sc-gold', weight: 600, parent: s2 });
    var axis = S.line(ax.x0, ax.y, ax.x1, ax.y, 'sc-line', s2);
    var ticks = [[0, '0'], [3, '3 UMA'], [25, '25 UMA']].map(function (t) {
      var g = S.g(null, s2);
      S.line(X(t[0]), ax.y - 10, X(t[0]), ax.y + 10, 'sc-stroke-fg3', g);
      S.text(X(t[0]), ax.y - 22, t[1], { size: 14, family: 'mono', cls: t[0] === 25 ? 'sc-err' : (t[0] === 3 ? 'sc-gold' : 'sc-fg3'), anchor: 'middle', weight: 600, parent: g });
      S.line(X(t[0]), ax.y + 10, X(t[0]), H - 90, 'sc-dash', g).setAttribute('opacity', t[0] ? 0.7 : 0);
      return g;
    });
    var aY = ax.y + (tall ? 90 : 80);
    var bY = ax.y + (tall ? 300 : 250);
    var barH = tall ? 58 : 60;
    var aSBC = 1000 / 117.31;
    var bSBC = 3200 / 117.31;
    var laA = S.text(ax.x0, aY - 14, T.wa, { size: 16, weight: 600, parent: s2 });
    var aBase = S.rect(X(0), aY, X(3) - X(0), barH, 8, 'sc-bg3', s2);
    var aExc = S.rect(X(3), aY, X(aSBC) - X(3), barH, 8, 'sc-gold', s2);
    aBase.style.transformBox = 'fill-box';
    aBase.style.transformOrigin = 'left center';
    aExc.style.transformBox = 'fill-box';
    aExc.style.transformOrigin = 'left center';
    var aLab = S.text(X(aSBC) + 14, aY + barH / 2 + 6, T.exc, { size: 15, family: 'mono', weight: 600, cls: 'sc-gold', parent: s2 });
    if (tall) aLab.setAttribute('x', X(3) + 10), aLab.setAttribute('y', aY + barH + 28);
    var laB = S.text(ax.x0, bY - 14, T.wb, { size: 16, weight: 600, parent: s2 });
    var bBar = S.rect(X(0), bY, X(bSBC) - X(0), barH, 8, 'sc-blue', s2);
    bBar.style.transformBox = 'fill-box';
    bBar.style.transformOrigin = 'left center';
    var cut = S.rect(X(25), bY - 6, X(bSBC) - X(25) + 4, barH + 12, 8, 'sc-soft-acc', s2);
    cut.style.opacity = 0;
    var cutLine = S.line(X(25), bY - 12, X(25), bY + barH + 12, 'sc-wire-err', s2);
    cutLine.style.opacity = 0;
    var bLab = S.text(tall ? X(25) - 8 : X(25) - 12, bY + barH + 34, T.capped, { size: 15, family: 'mono', weight: 600, cls: 'sc-err', anchor: 'end', parent: s2 });
    bLab.style.opacity = 0;
    tl.from([umaChip.g, axis].concat(ticks), { opacity: 0, y: 10, stagger: 0.08, duration: 0.4 }, '>-0.1');
    tl.from(laA, { opacity: 0, duration: 0.3 });
    tl.from(aBase, { scaleX: 0, duration: 0.5 }, '<');
    tl.from(aExc, { scaleX: 0, duration: 0.6 }, '>-0.05');
    tl.from(aLab, { opacity: 0, x: -8, duration: 0.35 });
    tl.from(laB, { opacity: 0, duration: 0.3 }, '+=0.2');
    tl.from(bBar, { scaleX: 0, duration: 0.9, ease: 'power2.out' }, '<');
    tl.to([cut, cutLine], { opacity: 1, duration: 0.25 }, '+=0.1');
    tl.to(bBar, { attr: { width: X(25) - X(0) }, duration: 0.5, ease: 'power3.inOut' }, '+=0.15');
    tl.to(cut, { opacity: 0, duration: 0.4 }, '<0.2');
    tl.to(bLab, { opacity: 1, duration: 0.3 }, '<');
    S.hold(tl, 1.6);

    S.hideSlide(tl, s2);
    S.chapter(tl, 2);
    S.cap(tl, T.c3);
    S.showSlide(tl, s3, '<0.3');
    var tb = tall ? { x: 26, y: 118, w: W - 52, rh: 58 } : { x: 70, y: 110, w: W - 140, rh: 44 };
    S.text(tb.x, tb.y - 24, T.ex, { size: tall ? 13.5 : 15, family: 'mono', cls: 'sc-fg3', parent: s3 });
    var cols = tall
      ? { concept: tb.x + 16, pat: tb.x + tb.w - 150, obr: tb.x + tb.w - 16 }
      : { concept: tb.x + 20, base: tb.x + 470, pp: tb.x + 640, po: tb.x + 780, pat: tb.x + tb.w - 190, obr: tb.x + tb.w - 20 };
    var head = S.g(null, s3);
    S.text(cols.concept, tb.y + 18, T.hConcept, { size: 13, family: 'mono', cls: 'sc-fg4', ls: 1.5, parent: head });
    if (!tall) {
      S.text(cols.base, tb.y + 18, T.hBase, { size: 13, family: 'mono', cls: 'sc-fg4', ls: 1.5, parent: head });
      S.text(cols.pp, tb.y + 18, '%' + ' ' + S.t(T.hPat), { size: 13, family: 'mono', cls: 'sc-fg4', ls: 1.5, parent: head });
      S.text(cols.po, tb.y + 18, '%' + ' ' + S.t(T.hObr), { size: 13, family: 'mono', cls: 'sc-fg4', ls: 1.5, parent: head });
    }
    S.text(cols.pat, tb.y + 18, T.hPat, { size: 13, family: 'mono', cls: 'sc-fg4', ls: 1.5, anchor: 'end', parent: head });
    S.text(cols.obr, tb.y + 18, T.hObr, { size: 13, family: 'mono', cls: 'sc-fg4', ls: 1.5, anchor: 'end', parent: head });
    S.line(tb.x, tb.y + 30, tb.x + tb.w, tb.y + 30, 'sc-line2', head);
    var sumP = 0, sumO = 0;
    var rowEls = T.rows.map(function (r, i) {
      var y = tb.y + 40 + i * tb.rh;
      var g = S.g(null, s3);
      var isCeav = i === 6;
      S.rect(tb.x, y, tb.w, tb.rh - 6, 8, isCeav ? 'sc-card-hi' : 'sc-card', g);
      var cy = y + (tb.rh - 6) / 2 + 6;
      if (tall) {
        S.text(cols.concept, y + 24, r[0], { size: 15, weight: 600, parent: g });
        S.text(cols.concept, y + 44, S.t(r[1]) + ' · ' + r[2] + (r[3] !== '—' ? ' / ' + r[3] : ''), { size: 12.5, family: 'mono', cls: isCeav ? 'sc-acc-ink' : 'sc-fg3', parent: g });
      } else {
        S.text(cols.concept, cy, r[0], { size: 16, weight: 500, parent: g });
        S.text(cols.base, cy, r[1], { size: 14, family: 'mono', cls: 'sc-fg3', parent: g });
        S.text(cols.pp, cy, r[2], { size: 15, family: 'mono', cls: isCeav ? 'sc-acc-ink' : 'sc-fg2', weight: isCeav ? 600 : null, parent: g });
        S.text(cols.po, cy, r[3], { size: 15, family: 'mono', cls: 'sc-fg2', parent: g });
      }
      var pv = S.text(cols.pat, tall ? y + 34 : cy, '0.00', { size: tall ? 15 : 16, family: 'mono', anchor: 'end', weight: 600, parent: g });
      var ov = S.text(cols.obr, tall ? y + 34 : cy, r[5] == null ? '—' : '0.00', { size: tall ? 15 : 16, family: 'mono', anchor: 'end', cls: r[5] == null ? 'sc-fg4' : 'sc-fg', parent: g });
      sumP += r[4];
      sumO += r[5] || 0;
      g.style.opacity = 0;
      return { g: g, pv: pv, ov: ov, r: r, y: y };
    });
    var bandY = tb.y + 40 + T.rows.length * tb.rh + (tall ? 16 : 12);
    var band = S.chip(tb.x, bandY, T.band, { size: 14, cls: 'sc-soft-acc', tcls: 'sc-acc-ink', weight: 600, parent: s3 });
    band.g.style.opacity = 0;
    var totY = bandY + (tall ? 70 : 20);
    var tot = S.g(null, s3);
    S.text(tall ? tb.x + 16 : cols.po - 150, totY + 16, T.total, { size: 15, family: 'mono', cls: 'sc-fg3', parent: tot });
    var tp = S.text(cols.pat, totY + 18, '0.00', { size: tall ? 20 : 20, family: 'mono', anchor: 'end', weight: 600, cls: 'sc-ok', parent: tot });
    var to = S.text(cols.obr, totY + 18, '0.00', { size: tall ? 20 : 20, family: 'mono', anchor: 'end', weight: 600, cls: 'sc-ok', parent: tot });
    tot.style.opacity = 0;
    tl.from(head, { opacity: 0, duration: 0.35 }, '>-0.1');
    rowEls.forEach(function (o, i) {
      tl.to(o.g, { opacity: 1, duration: 0.2 }, '+=' + (i ? 0.12 : 0.1));
      S.counter(tl, o.pv, 0, o.r[4], { fmt: money, duration: 0.45 }, '<');
      if (o.r[5] != null) S.counter(tl, o.ov, 0, o.r[5], { fmt: money, duration: 0.45 }, '<');
      if (i === 6) tl.to(band.g, { opacity: 1, duration: 0.3 }, '<0.1');
    });
    tl.to(tot, { opacity: 1, duration: 0.3 }, '+=0.2');
    S.counter(tl, tp, 0, sumP, { fmt: money, duration: 0.7 }, '<');
    S.counter(tl, to, 0, sumO, { fmt: money, duration: 0.7 }, '<');
    S.hold(tl, 1.8);

    S.hideSlide(tl, s3);
    S.chapter(tl, 3);
    S.cap(tl, T.c4);
    S.showSlide(tl, s4, '<0.3');
    var fx = tall ? { x: 26, y: 110, w: W - 52 } : { x: 80, y: 120, w: W - 160 };
    var fileG = S.g(null, s4);
    S.rect(fx.x, fx.y, fx.w, tall ? 300 : 240, 18, 'sc-card', fileG);
    S.text(fx.x + 24, fx.y + 38, T.file, { size: 15, family: 'mono', cls: 'sc-fg3', parent: fileG });
    var lfs = tall ? 20 : 30;
    var lcw = lfs * 0.6;
    var total = T.segs.reduce(function (a, s) { return a + s[0].length; }, 0);
    var lineW = total * lcw;
    var lx0 = tall ? fx.x + 24 : fx.x + (fx.w - lineW) / 2;
    var ly = fx.y + (tall ? 104 : 116);
    var col = 0;
    var segEls = [];
    T.segs.forEach(function (s, i) {
      var x = lx0 + col * lcw;
      var w = s[0].length * lcw;
      var g = S.g(null, s4);
      var hl = S.rect(x - 2, ly - lfs + 2, w + 4, lfs + 10, 5, 'sc-bg3', g);
      var txt = S.text(x, ly, s[0] === '        ' ? '········' : s[0], { size: lfs, family: 'mono', weight: 600, cls: s[2], parent: g });
      var tick = S.line(x + w / 2, ly + 14, x + w / 2, ly + (tall ? (i % 2 ? 76 : 40) : (i % 2 ? 60 : 36)), 'sc-stroke-fg3', g);
      var lab = S.text(x + w / 2, ly + (tall ? (i % 2 ? 96 : 60) : (i % 2 ? 82 : 58)), s[1], { size: tall ? 12 : 14, family: 'mono', cls: s[2], anchor: 'middle', parent: g });
      g.style.opacity = 0;
      segEls.push(g);
      col += s[0].length;
    });
    var vy = fx.y + (tall ? 330 : 280);
    var vchecks = [T.v1, T.v2, T.v3, T.v4].map(function (t, i) {
      var colN = tall ? 1 : 2;
      var cwv = tall ? fx.w : (fx.w - 16) / 2;
      var x = fx.x + (i % colN) * (cwv + 16);
      var y = vy + Math.floor(i / colN) * (tall ? 76 : 80);
      var g = S.g(null, s4);
      S.rect(x, y, cwv, tall ? 64 : 66, 12, 'sc-card-ok', g);
      S.text(x + 22, y + (tall ? 39 : 40), t, { size: tall ? 16 : 17, weight: 600, parent: g });
      S.check(x + cwv - 36, y + (tall ? 32 : 33), 15, true, g);
      g.style.opacity = 0;
      return g;
    });
    tl.from(fileG, { opacity: 0, y: 12, duration: 0.4 }, '>-0.1');
    segEls.forEach(function (g, i) { tl.fromTo(g, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25 }, '+=' + (i ? 0.1 : 0.15)); });
    tl.to(vchecks, { opacity: 1, stagger: 0.15, duration: 0.3 }, '+=0.2');
    S.hold(tl, 1.8);

    S.hideSlide(tl, s4);
    S.chapter(tl, 4);
    S.cap(tl, T.c5);
    S.showSlide(tl, s5, '<0.3');
    var cf = tall ? { x: 26, y: 112, w: W - 52, rh: 110 } : { x: 90, y: 124, w: W - 180, rh: 100 };
    var hG = S.g(null, s5);
    var colX = tall ? { name: cf.x + 18, a: cf.x + cf.w * 0.58, b: cf.x + cf.w - 18 } : { name: cf.x + 26, a: cf.x + cf.w * 0.56, b: cf.x + cf.w * 0.82 };
    S.text(colX.name, cf.y, tall ? '' : ' ', { size: 13, family: 'mono', parent: hG });
    S.text(colX.a, cf.y, T.colOdoo, { size: 14, family: 'mono', cls: 'sc-fg3', ls: 1.5, anchor: 'end', parent: hG });
    S.text(colX.b, cf.y, T.colImss, { size: 14, family: 'mono', cls: 'sc-fg3', ls: 1.5, anchor: 'end', parent: hG });
    var data = [[2176.95, 2176.95], [1840.10, 1840.10], [2512.44, 2473.84], [1966.30, 1966.30]];
    var crs = data.map(function (d, i) {
      var y = cf.y + 18 + i * cf.rh;
      var g = S.g(null, s5);
      var bad = d[0] !== d[1];
      var b = S.rect(cf.x, y, cf.w, cf.rh - 12, 12, 'sc-card', g);
      S.text(colX.name, y + (tall ? 38 : 42), T.people[i], { size: tall ? 18 : 20, weight: 600, parent: g });
      S.text(colX.a, y + (tall ? 38 : 50), '$' + money(d[0]), { size: tall ? 16 : 18, family: 'mono', anchor: 'end', parent: g });
      S.text(colX.b, y + (tall ? 38 : 50), '$' + money(d[1]), { size: tall ? 16 : 18, family: 'mono', anchor: 'end', cls: bad ? 'sc-err' : 'sc-fg', weight: bad ? 600 : null, parent: g });
      var ck = S.check(tall ? cf.x + cf.w - 38 : cf.x + cf.w - 44, y + (tall ? 76 : 44), 15, !bad, g);
      if (tall) ck.g.setAttribute('transform', '');
      var note = null;
      if (bad) note = S.text(colX.name, tall ? y + 78 : y + 70, T.diff, { size: 14, family: 'mono', cls: 'sc-err', weight: 600, parent: g });
      g.style.opacity = 0;
      return { g: g, b: b, bad: bad, note: note };
    });
    var resY = cf.y + 18 + data.length * cf.rh + (tall ? 20 : 16);
    var res = S.chip(tall ? W / 2 : cf.x + cf.w / 2, resY, T.result, { size: 16, anchor: 'middle', cls: 'sc-card-warn', tcls: 'sc-gold', weight: 600, parent: s5 });
    res.g.style.opacity = 0;
    tl.from(hG, { opacity: 0, duration: 0.3 }, '>-0.1');
    crs.forEach(function (c, i) {
      tl.to(c.g, { opacity: 1, duration: 0.3 }, '+=' + (i ? 0.2 : 0.15));
      if (c.bad) {
        tl.set(c.b, { attr: { class: 'sc-card-err' } }, '+=0.1');
        tl.to(c.g, { x: 6, duration: 0.05, yoyo: true, repeat: 5, ease: 'none' });
      } else {
        tl.set(c.b, { attr: { class: 'sc-card-ok' } }, '+=0.05');
      }
    });
    tl.fromTo(res.g, { opacity: 0, scale: 0.8, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, '+=0.2');
    S.hold(tl, 2.4);
    return tl;
  }

  window.Scenes = window.Scenes || {};
  window.Scenes.imss = {
    title: T.title,
    chapters: T.ch,
    poster: 0.1,
    captions: [T.c1, T.c2, T.c3, T.c4, T.c5],
    wide: { w: 1280, h: 720 },
    tall: { w: 720, h: 920 },
    build: build
  };
})();
