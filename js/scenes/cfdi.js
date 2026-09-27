(function () {
  var T = {
    title: { es: 'CFDI: el XML que el SAT sí acepta', en: 'CFDI: the XML the SAT actually accepts' },
    ch: [
      { es: 'Hidrocarburos', en: 'Hydrocarbons' },
      { es: 'Leyendas IMMEX', en: 'IMMEX legends' },
      { es: 'Centavos que rechazan', en: 'Cents that get rejected' },
      { es: 'RFC genérico', en: 'Generic RFC' }
    ],
    c1a: { es: 'Desde el 24 de abril de 2026, vender gasolina o diésel exige el complemento <b>HidroYPetro</b> en cada concepto. El módulo lo agrega con los datos del permiso y del producto.', en: 'Since April 24, 2026, selling gasoline or diesel requires the <b>HidroYPetro</b> complement on every line item. The module adds it from the permit and product data.' },
    c1b: { es: 'Antes de llamar al PAC valida las reglas del SAT: patrón del permiso CNE (<b>CCHYP107</b>), SubProducto contra ClaveHYP (<b>CCHYP110</b>) y unidad en litros. El error se explica en Odoo, no en un rechazo.', en: 'Before calling the PAC it checks the SAT rules: CNE permit pattern (<b>CCHYP107</b>), SubProduct against ClaveHYP (<b>CCHYP110</b>) and liters as the unit. Errors are explained in Odoo, not in a rejection.' },
    c2: { es: 'En transferencias virtuales entre empresas IMMEX, el CFDI sale como <b>traslado</b> con la leyenda fiscal de pedimento, armada con el programa IMMEX y el RFC de ambas partes.', en: 'For virtual transfers between IMMEX companies, the CFDI is issued as a <b>transfer</b> carrying the customs tax legend, built from both parties’ IMMEX program and RFC.' },
    c3a: { es: 'El 11 de septiembre de 2026 un ajuste de Odoo empezó a truncar BaseP. Desde el 15, el PAC exige que BaseP no sea menor que la suma de BaseDR: rechazo <b>CRP20268</b>.', en: 'On September 11, 2026 an Odoo change started truncating BaseP. From the 15th, the PAC requires BaseP to be no lower than the sum of BaseDR: rejection <b>CRP20268</b>.' },
    c3b: { es: 'La corrección redondea cada BaseDR e ImporteDR a los decimales de la moneda y calcula BaseP como la suma exacta. <b>Tres días después</b>, los pagos volvían a timbrarse.', en: 'The fix rounds each BaseDR and ImporteDR to the currency decimals and computes BaseP as the exact sum. <b>Three days later</b>, payments were stamping again.' },
    c4: { es: 'Y si al cliente le falta RFC, código postal o país, el CFDI se detiene con un mensaje claro en lugar de salir a <b>XAXX010101000</b> por accidente.', en: 'And if a customer is missing RFC, ZIP code or country, the CFDI stops with a clear message instead of accidentally going out to <b>XAXX010101000</b>.' },
    file: 'factura.xml · CFDI 4.0',
    filePay: 'pago.xml · Pagos 2.0',
    checks: { es: 'Validación antes de timbrar', en: 'Checks before stamping' },
    r1: { es: 'Permiso CNE · patrón PER01', en: 'CNE permit · PER01 pattern' },
    r2: { es: 'SubProducto ↔ ClaveHYP', en: 'SubProduct ↔ ClaveHYP' },
    r3: { es: 'Unidad LTR (litro)', en: 'Unit LTR (liter)' },
    bad: { es: 'SP18 no corresponde a 15101514', en: 'SP18 does not match 15101514' },
    stop: { es: 'timbrado detenido con mensaje claro', en: 'stamping stopped with a clear message' },
    pac: { es: 'PAC · timbrado', en: 'PAC · stamped' },
    i1: { es: 'IMMEX del emisor', en: 'Issuer IMMEX' },
    i2: { es: 'IMMEX del receptor', en: 'Receiver IMMEX' },
    i3: { es: 'RFC de ambas partes', en: 'RFC of both parties' },
    i4: { es: 'Traslado · totales 0 · S01', en: 'Transfer · totals 0 · S01' },
    d1: { es: '11 SEP', en: 'SEP 11' },
    d1t: { es: 'Odoo trunca BaseP', en: 'Odoo truncates BaseP' },
    d2: { es: '15 SEP', en: 'SEP 15' },
    d2t: { es: 'el PAC endurece la regla', en: 'the PAC tightens the rule' },
    d3: { es: '18 SEP', en: 'SEP 18' },
    d3t: { es: 'módulo de corrección', en: 'fix module ready' },
    sum: { es: 'Σ BaseDR', en: 'Σ BaseDR' },
    rej: 'CRP20268',
    rejT: { es: 'La sumatoria de BaseDR es mayor a BaseP', en: 'The sum of BaseDR is greater than BaseP' },
    ok: { es: 'BaseP = Σ BaseDR · timbrado', en: 'BaseP = Σ BaseDR · stamped' },
    native: { es: 'Odoo nativo', en: 'Native Odoo' },
    missing: { es: 'al cliente le faltan RFC y CP', en: 'customer is missing RFC and ZIP' },
    guard: { es: 'con el módulo', en: 'with the module' },
    guardT: { es: 'Timbrado detenido: completa el RFC y el CP del cliente', en: 'Stamping stopped: complete the customer RFC and ZIP' },
    legit: { es: 'factura global y público en general real: sin cambios', en: 'global invoices and real walk-in customers: unchanged' }
  };

  function build(S) {
    var gsap = window.gsap;
    var W = S.W, H = S.H, tall = S.tall;
    var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.6 } });
    var bg = S.g();
    S.rect(0, 0, W, H, 0, 'sc-bg', bg);
    S.dotgrid(bg, 40);

    var X = tall ? { x: 30, y: 84, w: W - 60, h: 480 } : { x: 60, y: 86, w: 740, h: 580 };
    var V = tall ? { x: 30, y: X.y + X.h + 20, w: W - 60, h: H - (X.y + X.h + 20) - 26 } : { x: 830, y: 86, w: 390, h: 580 };
    var fsz = tall ? 15.5 : 17;
    var cw = fsz * 0.6;
    var lh = tall ? 29 : 31;

    function editor(fileLabel) {
      var g = S.slide();
      S.rect(X.x, X.y, X.w, X.h, 18, 'sc-card', g);
      S.rect(X.x, X.y, X.w, 46, 18, 'sc-card2', g);
      S.rect(X.x, X.y + 30, X.w, 16, 0, 'sc-card2', g).setAttribute('stroke', 'none');
      [0, 1, 2].forEach(function (i) { S.circle(X.x + 22 + i * 16, X.y + 23, 5, i === 0 ? 'sc-acc' : 'sc-bg3', g); });
      S.text(X.x + 80, X.y + 29, fileLabel, { size: 14, family: 'mono', cls: 'sc-fg3', parent: g });
      return g;
    }
    function line(parent, row, indent, segs) {
      var g = S.g(null, parent);
      var x = X.x + 26 + indent * cw * 2;
      var y = X.y + 84 + row * lh;
      var col = 0;
      var out = { g: g, y: y, parts: [] };
      segs.forEach(function (s) {
        var t = S.text(x + col * cw, y, s[0], { size: fsz, family: 'mono', cls: s[1] || 'sc-fg2', parent: g, weight: s[2] });
        out.parts.push({ el: t, col: col, x: x + col * cw });
        col += S.t(s[0]).length;
      });
      out.endX = x + col * cw;
      g.style.opacity = 0;
      return out;
    }
    var TAG = 'sc-acc-ink', ATT = 'sc-blue', VAL = 'sc-ok', PUN = 'sc-fg3';
    function tagOpen(name, attrs, close) {
      var segs = [['<', PUN], [name, TAG]];
      (attrs || []).forEach(function (a) { segs.push([' ' + a[0] + '=', ATT]); segs.push(['"' + a[1] + '"', a[2] || VAL]); });
      segs.push([close ? '/>' : '>', PUN]);
      return segs;
    }
    function validator(title) {
      var g = S.slide();
      S.rect(V.x, V.y, V.w, V.h, 18, 'sc-card', g);
      S.text(V.x + 24, V.y + 42, title, { size: 17, weight: 600, parent: g });
      return g;
    }
    function rule(parent, i, label, sub, ok) {
      var rh = tall ? 50 : 76;
      var y = V.y + (tall ? 60 : 72) + i * (rh + (tall ? 8 : 10));
      var g = S.g(null, parent);
      var b = S.rect(V.x + 18, y, V.w - 36, rh, 12, 'sc-card2', g);
      S.text(V.x + 36, y + (tall ? 22 : 32), label, { size: tall ? 14 : 16, weight: 600, parent: g });
      if (sub) S.text(V.x + 36, y + (tall ? 40 : 56), sub, { size: 13, family: 'mono', cls: 'sc-fg3', parent: g });
      var ck = S.check(V.x + V.w - 50, y + rh / 2, 15, ok !== false, g);
      ck.g.style.opacity = 0;
      g.style.opacity = 0;
      return { g: g, b: b, ck: ck, y: y, h: rh };
    }
    function pacBox(parent, label, uuidText) {
      var bh = tall ? 92 : 124;
      var y = V.y + V.h - bh - 18;
      var g = S.g(null, parent);
      S.rect(V.x + 18, y, V.w - 36, bh, 14, 'sc-card-ok', g);
      S.text(V.x + 36, y + (tall ? 34 : 40), label, { size: 15, family: 'mono', weight: 600, cls: 'sc-ok', ls: 1, parent: g });
      var u = S.text(V.x + 36, y + (tall ? 66 : 80), uuidText, { size: tall ? 14 : 14, family: 'mono', cls: 'sc-fg', parent: g });
      S.check(V.x + V.w - 50, y + (tall ? 30 : 38), 15, true, g);
      g.style.opacity = 0;
      return { g: g, u: u };
    }
    function showLines(lines, gap) {
      lines.forEach(function (l, i) { tl.fromTo(l.g, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.22 }, '+=' + (i ? (gap || 0.07) : 0.1)); });
    }
    function pass(r, delay) {
      tl.to(r.g, { opacity: 1, duration: 0.3 }, '+=' + (delay || 0.1));
      tl.fromTo(r.ck.g, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '<0.1');
    }

    var e1 = editor(T.file);
    var v1 = validator(T.checks);
    S.chapter(tl, 0);
    S.cap(tl, T.c1a);
    S.showSlide(tl, e1, 0.05);
    S.showSlide(tl, v1, 0.2);
    var permit = tall ? 'PL/12345/EXP/ES/2016' : 'PL/12345/EXP/ES/2016';
    var L1 = [
      line(e1, 0, 0, tagOpen('cfdi:Comprobante', [['Version', '4.0'], ['TipoDeComprobante', 'I']])),
      line(e1, 1, 1, tagOpen('cfdi:Conceptos')),
      line(e1, 2, 2, tagOpen('cfdi:Concepto', tall ? [['ClaveUnidad', 'LTR']] : [['ClaveProdServ', '15101514'], ['ClaveUnidad', 'LTR']])),
      line(e1, 3, 3, tagOpen('cfdi:ComplementoConcepto')),
      line(e1, 4, 4, [['<', PUN], [tall ? 'hidrocarburospetroliferos:' : 'hidrocarburospetroliferos:HidroYPetro', TAG, 600]].concat(tall ? [] : [])),
      line(e1, tall ? 5 : 5, tall ? 5 : 6, tall ? [['HidroYPetro', TAG, 600]] : [['Version=', ATT], ['"1.0"', VAL]]),
      line(e1, 6, 6, [['TipoPermiso=', ATT], ['"PER01"', VAL]]),
      line(e1, 7, 6, [['NumeroPermiso=', ATT], ['"' + permit + '"', VAL]]),
      line(e1, 8, 6, [['ClaveHYP=', ATT], ['"15101514"', VAL]]),
      line(e1, 9, 6, [['SubProductoHYP=', ATT], ['"', VAL], ['SP16', VAL, 600], ['"', VAL], ['/>', PUN]]),
      line(e1, 10, 3, [['</', PUN], ['cfdi:ComplementoConcepto', TAG], ['>', PUN]]),
      line(e1, 11, 2, [['</', PUN], ['cfdi:Concepto', TAG], ['>', PUN]])
    ];
    var hydroBox = S.rect(X.x + 14, L1[4].y - lh + 6, X.w - 28, lh * 6 + 6, 10, 'sc-soft-acc', e1);
    e1.insertBefore(hydroBox, e1.children[5]);
    hydroBox.style.opacity = 0;
    var spPart = L1[9].parts[2];
    var sp18 = S.text(spPart.x, L1[9].y, 'SP18', { size: fsz, family: 'mono', weight: 600, cls: 'sc-err', parent: L1[9].g });
    sp18.style.opacity = 0;
    var R1 = [
      rule(v1, 0, T.r1, 'CCHYP107'),
      rule(v1, 1, T.r2, 'CCHYP110'),
      rule(v1, 2, T.r3, 'ClaveUnidad')
    ];
    var badR = S.g(null, v1);
    var by = R1[1].y;
    S.rect(V.x + 18, by, V.w - 36, R1[1].h, 12, 'sc-card-err', badR);
    S.text(V.x + 36, by + (tall ? 22 : 32), T.bad, { size: tall ? 14 : 15, weight: 600, cls: 'sc-err', parent: badR });
    S.text(V.x + 36, by + (tall ? 40 : 56), T.stop, { size: 13, family: 'mono', cls: 'sc-fg3', parent: badR });
    S.check(V.x + V.w - 50, by + R1[1].h / 2, 15, false, badR);
    badR.style.opacity = 0;
    var pac1 = pacBox(v1, T.pac, '9b2e7f04-5c1a-4d8e-b3f6-0a4c77e1d215');

    showLines(L1.slice(0, 4), 0.1);
    tl.to(hydroBox, { opacity: 1, duration: 0.4 }, '+=0.15');
    showLines(L1.slice(4, 10), 0.12);
    showLines(L1.slice(10), 0.08);
    S.cap(tl, T.c1b, 0.1);
    pass(R1[0], 0.3);
    pass(R1[1], 0.15);
    pass(R1[2], 0.15);
    tl.to(spPart.el, { opacity: 0, duration: 0.2 }, '+=0.5');
    tl.to(sp18, { opacity: 1, duration: 0.2 }, '<');
    tl.to(badR, { opacity: 1, duration: 0.25 }, '<0.1');
    tl.to(badR, { x: 6, duration: 0.05, yoyo: true, repeat: 5, ease: 'none' });
    tl.to(sp18, { opacity: 0, duration: 0.2 }, '+=0.9');
    tl.to(spPart.el, { opacity: 1, duration: 0.2 }, '<');
    tl.to(badR, { opacity: 0, duration: 0.25 }, '<');
    if (tall) tl.to(R1.map(function (r) { return r.g; }), { opacity: 0, duration: 0.3 }, '+=0.2');
    tl.to(pac1.g, { opacity: 1, duration: 0.4 }, tall ? '>' : '+=0.2');
    S.scramble(tl, pac1.u, '9b2e7f04-5c1a-4d8e-b3f6-0a4c77e1d215', { duration: 0.9 }, '<');
    S.hold(tl, 1.2);

    S.hideSlide(tl, e1);
    S.hideSlide(tl, v1, '<');
    var e2 = editor(T.file);
    var v2 = validator(T.checks);
    S.chapter(tl, 1);
    S.cap(tl, T.c2);
    S.showSlide(tl, e2, '<0.3');
    S.showSlide(tl, v2, '<0.1');
    var L2 = [
      line(e2, 0, 0, tagOpen('cfdi:Comprobante', [['TipoDeComprobante', 'T', 'sc-gold'], ['Total', '0', 'sc-gold']])),
      line(e2, 1, 1, tagOpen('cfdi:Receptor', [['UsoCFDI', 'S01', 'sc-gold']], true)),
      line(e2, 2, 1, tagOpen('cfdi:Complemento')),
      line(e2, 3, 2, [['<', PUN], ['leyendasFisc:LeyendasFiscales', TAG, 600], ['>', PUN]]),
      line(e2, 4, 3, [['<', PUN], ['leyendasFisc:Leyenda', TAG, 600]]),
      line(e2, 5, 4, [['disposicionFiscal=', ATT], ['"RGCE"', VAL]]),
      line(e2, 6, 4, [['norma=', ATT], [tall ? '"4.3.21, 5.2.5 Fr II, 5.2.6"' : '"4.3.21, 5.2.5 Fracc II y 5.2.6"', VAL]]),
      line(e2, 7, 4, [['textoLeyenda=', ATT], ['"Operación efectuada', VAL]]),
      line(e2, 8, 5, [[tall ? 'al amparo de los arts. 104,' : 'al amparo de los artículos 104, 105,', 'sc-fg3']]),
      line(e2, 9, 5, [[tall ? '105, 108 y 112 de la Ley…' : '108 y 112 de la Ley Aduanera… con', 'sc-fg3']]),
      line(e2, 10, 5, [[tall ? 'Programa IMMEX: 2345-2021"' : 'Programa IMMEX: 2345-2021 …"', VAL]]),
      line(e2, 11, 4, [['/>', PUN]])
    ];
    var legBox = S.rect(X.x + 14, L2[3].y - lh + 6, X.w - 28, lh * 9 + 6, 10, 'sc-soft-gold', e2);
    e2.insertBefore(legBox, e2.children[5]);
    legBox.style.opacity = 0;
    var R2 = [rule(v2, 0, T.i1, '1987-2019'), rule(v2, 1, T.i2, '2345-2021'), rule(v2, 2, T.i3), rule(v2, 3, T.i4, 'TipoDeComprobante="T"')];
    showLines(L2.slice(0, 3), 0.1);
    tl.to(legBox, { opacity: 1, duration: 0.35 }, '+=0.1');
    showLines(L2.slice(3), 0.09);
    R2.forEach(function (r, i) { pass(r, i ? 0.12 : 0.3); });
    S.hold(tl, 1.8);

    S.hideSlide(tl, e2);
    S.hideSlide(tl, v2, '<');
    var e3 = editor(T.filePay);
    var v3 = validator(T.checks);
    S.chapter(tl, 2);
    S.cap(tl, T.c3a);
    S.showSlide(tl, e3, '<0.3');
    S.showSlide(tl, v3, '<0.1');
    var L3 = [
      line(e3, 0, 0, tagOpen('pago20:Pago', [['MonedaP', 'MXN']])),
      line(e3, 1, 1, tagOpen('pago20:DoctoRelacionado', [['Folio', '1041']])),
      line(e3, 2, 2, [['<', PUN], ['pago20:TrasladoDR', TAG], [' BaseDR=', ATT], ['"', VAL], ['1234.567890', 'sc-gold', 600], ['"', VAL], ['/>', PUN]]),
      line(e3, 3, 1, tagOpen('pago20:DoctoRelacionado', [['Folio', '1042']])),
      line(e3, 4, 2, [['<', PUN], ['pago20:TrasladoDR', TAG], [' BaseDR=', ATT], ['"', VAL], ['2345.678901', 'sc-gold', 600], ['"', VAL], ['/>', PUN]]),
      line(e3, 5, 1, [['<', PUN], ['pago20:TrasladoP', TAG], [' BaseP=', ATT], ['"', VAL], ['3580.24', 'sc-err', 600], ['"', VAL], ['/>', PUN]]),
      line(e3, 6, 0, [['</', PUN], ['pago20:Pago', TAG], ['>', PUN]])
    ];
    function altValue(l, idx, txt, cls) {
      var p = l.parts[idx];
      var t = S.text(p.x, l.y, txt, { size: fsz, family: 'mono', weight: 600, cls: cls, parent: l.g });
      t.style.opacity = 0;
      var q = l.parts[idx + 1];
      var r = l.parts[idx + 2];
      var shift = (S.t(txt).length - S.t(p.el.textContent).length) * cw;
      return { old: p.el, neu: t, tail: [q.el, r.el], shift: shift };
    }
    var a1 = altValue(L3[2], 4, '1234.57', 'sc-ok');
    var a2 = altValue(L3[4], 4, '2345.68', 'sc-ok');
    var a3 = altValue(L3[5], 4, '3580.25', 'sc-ok');
    var tlY = X.y + 84 + 8 * lh + 10;
    var tlG = S.g(null, e3);
    var dates = [[T.d1, T.d1t, 'sc-fg3'], [T.d2, T.d2t, 'sc-err'], [T.d3, T.d3t, 'sc-ok']];
    var segW = (X.w - 60) / 3;
    S.line(X.x + 30, tlY + 12, X.x + X.w - 30, tlY + 12, 'sc-line', tlG);
    var dEls = dates.map(function (d, i) {
      var x = X.x + 30 + i * segW;
      var g = S.g(null, tlG);
      S.circle(x + 8, tlY + 12, 7, d[2] === 'sc-ok' ? 'sc-ok' : (d[2] === 'sc-err' ? 'sc-err' : 'sc-fg3'), g);
      S.text(x, tlY + 48, d[0], { size: 15, family: 'mono', weight: 600, cls: d[2], parent: g });
      S.text(x, tlY + 72, d[1], { size: tall ? 12.5 : 14, family: 'mono', cls: 'sc-fg3', parent: g });
      g.style.opacity = 0;
      return g;
    });
    var sumBox = S.g(null, v3);
    var sy = V.y + (tall ? 88 : 84);
    S.text(V.x + 24, sy, T.sum, { size: 15, family: 'mono', cls: 'sc-fg3', parent: sumBox });
    var sumV = S.text(V.x + V.w - 24, sy, '3580.246791', { size: tall ? 20 : 22, family: 'mono', anchor: 'end', weight: 600, cls: 'sc-gold', parent: sumBox });
    S.text(V.x + 24, sy + (tall ? 36 : 44), 'BaseP', { size: 15, family: 'mono', cls: 'sc-fg3', parent: sumBox });
    var bpV = S.text(V.x + V.w - 24, sy + (tall ? 36 : 44), '3580.24', { size: tall ? 20 : 22, family: 'mono', anchor: 'end', weight: 600, cls: 'sc-err', parent: sumBox });
    var rel = S.text(V.x + V.w / 2, sy + (tall ? 80 : 100), 'BaseP < Σ BaseDR', { size: tall ? 18 : 20, family: 'mono', anchor: 'middle', weight: 600, cls: 'sc-err', parent: sumBox });
    sumBox.style.opacity = 0;
    var rejG = S.g(null, v3);
    var rjY = sy + (tall ? 100 : 136);
    S.rect(V.x + 18, rjY, V.w - 36, tall ? 70 : 96, 14, 'sc-card-err', rejG);
    S.text(V.x + 36, rjY + (tall ? 30 : 38), T.rej, { size: tall ? 18 : 22, family: 'mono', weight: 600, cls: 'sc-err', parent: rejG });
    S.text(V.x + 36, rjY + (tall ? 54 : 68), T.rejT, { size: tall ? 12 : 13, family: 'mono', cls: 'sc-fg2', parent: rejG });
    rejG.style.opacity = 0;
    var pac3 = pacBox(v3, T.ok, '1c0d6a93-7e45-4b2f-9d18-e6f2a0b35c77');

    showLines(L3, 0.1);
    tl.to(dEls[0], { opacity: 1, duration: 0.3 }, '+=0.2');
    tl.to(dEls[1], { opacity: 1, duration: 0.3 }, '+=0.3');
    tl.to(sumBox, { opacity: 1, duration: 0.35 }, '<');
    tl.fromTo(rejG, { opacity: 0, scale: 1.15, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power4.in' }, '+=0.3');
    tl.to(rejG, { x: 6, duration: 0.05, yoyo: true, repeat: 5, ease: 'none' });
    S.hold(tl, 1.2);
    S.cap(tl, T.c3b);
    tl.to(dEls[2], { opacity: 1, duration: 0.3 });
    [a1, a2, a3].forEach(function (a, i) {
      tl.to(a.old, { opacity: 0, duration: 0.2 }, i ? '<0.2' : '+=0.2');
      tl.to(a.neu, { opacity: 1, duration: 0.2 }, '<');
      tl.to(a.tail, { x: a.shift, duration: 0.3 }, '<');
    });
    S.counter(tl, sumV, 3580.246791, 3580.25, { fmt: function (v) { return v === 3580.25 ? '3580.25' : v.toFixed(6); }, duration: 0.5 }, '<');
    tl.set(sumV, { attr: { class: 'sc-ok sc-mono sc-b' } });
    tl.to(bpV, { opacity: 0, duration: 0.15 }, '<');
    tl.call(function () {}, null, '<');
    var bpV2 = S.text(V.x + V.w - 24, sy + (tall ? 36 : 44), '3580.25', { size: tall ? 20 : 22, family: 'mono', anchor: 'end', weight: 600, cls: 'sc-ok', parent: sumBox });
    bpV2.style.opacity = 0;
    tl.to(bpV2, { opacity: 1, duration: 0.2 }, '<');
    var rel2 = S.text(V.x + V.w / 2, sy + (tall ? 80 : 100), 'BaseP = Σ BaseDR', { size: tall ? 18 : 20, family: 'mono', anchor: 'middle', weight: 600, cls: 'sc-ok', parent: sumBox });
    rel2.style.opacity = 0;
    tl.to(rel, { opacity: 0, duration: 0.2 }, '<');
    tl.to(rel2, { opacity: 1, duration: 0.2 }, '<');
    tl.to(rejG, { opacity: 0, duration: 0.3 }, '<');
    tl.to(pac3.g, { opacity: 1, duration: 0.4 }, '+=0.15');
    S.scramble(tl, pac3.u, '1c0d6a93-7e45-4b2f-9d18-e6f2a0b35c77', { duration: 0.9 }, '<');
    S.hold(tl, 1.4);

    S.hideSlide(tl, e3);
    S.hideSlide(tl, v3, '<');
    var e4 = editor(T.file);
    var v4 = validator(T.checks);
    S.chapter(tl, 3);
    S.cap(tl, T.c4);
    S.showSlide(tl, e4, '<0.3');
    S.showSlide(tl, v4, '<0.1');
    var L4 = [
      line(e4, 0, 0, tagOpen('cfdi:Comprobante', [['Version', '4.0']])),
      line(e4, 1, 1, [['<', PUN], ['cfdi:Receptor', TAG]]),
      line(e4, 2, 2, [['Rfc=', ATT], ['"XAXX010101000"', 'sc-err', 600]]),
      line(e4, 3, 2, [['Nombre=', ATT], ['"PUBLICO EN GENERAL"', 'sc-err']]),
      line(e4, 4, 2, [['DomicilioFiscalReceptor=', ATT], ['"64000"', 'sc-err']]),
      line(e4, 5, 2, [['/>', PUN]])
    ];
    var natBox = S.rect(X.x + 14, L4[1].y - lh + 6, X.w - 28, lh * 5 + 6, 10, 'sc-soft-acc', e4);
    e4.insertBefore(natBox, e4.children[5]);
    natBox.style.opacity = 0;
    var natC = S.chip(X.x + X.w - 26, L4[0].y + lh * 7, T.native, { size: 14, anchor: 'end', cls: 'sc-card-err', tcls: 'sc-err', weight: 600, parent: e4 });
    var miss = S.text(X.x + 26, L4[0].y + lh * 7 + 18, T.missing, { size: 15, family: 'mono', cls: 'sc-fg2', parent: e4 });
    natC.g.style.opacity = 0;
    miss.style.opacity = 0;
    var cross = S.path('M' + (X.x + 20) + ',' + (L4[2].y - 6) + ' L' + (X.x + X.w - 20) + ',' + (L4[4].y - 6), 'sc-wire-err', e4);
    cross.style.opacity = 0;
    var gG = S.g(null, v4);
    var gy2 = V.y + (tall ? 64 : 76);
    var gh = tall ? 116 : 170;
    S.rect(V.x + 18, gy2, V.w - 36, gh, 14, 'sc-card-hi', gG);
    S.text(V.x + 36, gy2 + (tall ? 30 : 38), T.guard, { size: 14, family: 'mono', cls: 'sc-acc-ink', ls: 1.5, parent: gG });
    var gw = tall ? [T.guardT] : [{ es: 'Timbrado detenido:', en: 'Stamping stopped:' }, { es: 'completa el RFC y el CP', en: 'complete the customer' }, { es: 'del cliente', en: 'RFC and ZIP' }];
    gw.forEach(function (t, i) {
      S.text(V.x + 36, gy2 + (tall ? 64 : 76) + i * 28, t, { size: tall ? 14 : 18, weight: 600, parent: gG });
    });
    gG.style.opacity = 0;
    var lg = S.g(null, v4);
    var lgy = gy2 + gh + 18;
    S.rect(V.x + 18, lgy, V.w - 36, tall ? 64 : 110, 14, 'sc-card-ok', lg);
    var lgw = tall ? [T.legit] : [{ es: 'factura global y público', en: 'global invoices and real' }, { es: 'en general real:', en: 'walk-in customers:' }, { es: 'sin cambios', en: 'unchanged' }];
    lgw.forEach(function (t, i) {
      S.text(V.x + 36, lgy + (tall ? 38 : 36) + i * 26, t, { size: tall ? 12.5 : 15, family: 'mono', cls: 'sc-ok', parent: lg });
    });
    lg.style.opacity = 0;
    showLines(L4, 0.09);
    tl.to(natBox, { opacity: 1, duration: 0.3 }, '+=0.1');
    tl.to([natC.g, miss], { opacity: 1, duration: 0.3 }, '<');
    tl.to(cross, { opacity: 1, duration: 0.01 }, '+=0.5');
    S.draw(tl, cross, { duration: 0.5 }, '<');
    tl.fromTo(gG, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.45 }, '<0.2');
    tl.fromTo(lg, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.45 }, '+=0.3');
    S.hold(tl, 2.6);
    return tl;
  }

  window.Scenes = window.Scenes || {};
  window.Scenes.cfdi = {
    title: T.title,
    chapters: T.ch,
    poster: 0.26,
    captions: [T.c1a, T.c1b, T.c2, T.c3a, T.c3b, T.c4],
    wide: { w: 1280, h: 720 },
    tall: { w: 720, h: 920 },
    build: build
  };
})();
