(function () {
  var T = {
    title: { es: 'Tesorería: diez bancos, una sola verdad', en: 'Treasury: ten banks, one source of truth' },
    ch: [
      { es: 'Estados de cuenta', en: 'Bank statements' },
      { es: '¿Quién pagó?', en: 'Who paid?' },
      { es: 'Conciliación automática', en: 'Auto-reconciliation' },
      { es: 'REP y tablero', en: 'Payment complement & dashboard' }
    ],
    c1a: { es: 'Cada banco exporta su propio formato. El módulo reconoce el banco por el nombre del archivo y lee <b>10 layouts distintos</b> en CSV, XLS o XLSX.', en: 'Every bank exports its own format. The module recognizes the bank from the file name and reads <b>10 different layouts</b> in CSV, XLS or XLSX.' },
    c1b: { es: 'Todo queda en una sola estructura. Si alguien vuelve a subir el mismo archivo, <b>no se duplica ni un movimiento</b>.', en: 'Everything lands in one structure. If someone uploads the same file again, <b>not a single line is duplicated</b>.' },
    c2a: { es: 'Cada movimiento busca a su contraparte por <b>CLABE, cuenta, RFC o nombre</b>, con el texto normalizado y cada dato validado.', en: 'Each line looks for its counterparty by <b>CLABE, account number, RFC or name</b>, with normalized text and every field validated.' },
    c2b: { es: 'Si no aparece, un extractor con <b>Google Gemini</b> lee la descripción y devuelve JSON validado. Solo se acepta con confianza de 0.85 o más, y la IA nunca decide la conciliación.', en: 'If nothing matches, a <b>Google Gemini</b> extractor reads the description and returns validated JSON. It is only accepted at 0.85 confidence or higher, and the AI never decides the reconciliation.' },
    c3a: { es: 'Una tarea programada busca qué facturas del cliente <b>suman exactamente</b> el depósito: búsqueda de subconjuntos con poda, sin recorrer combinaciones imposibles.', en: 'A scheduled job looks for the customer invoices that <b>add up exactly</b> to the deposit: a pruned subset search that skips impossible combinations.' },
    c3b: { es: 'Con una sola combinación crea el pago, lo publica y concilia. Con más de una <b>no adivina</b>: marca el movimiento como ambiguo y deja las opciones a la vista.', en: 'With a single combination it creates, posts and reconciles the payment. With more than one it <b>doesn’t guess</b>: the line is flagged as ambiguous with the options on display.' },
    c3c: { es: 'Faltantes y excedentes dentro de la <b>tolerancia de cada empresa</b> se concilian solos contra su cuenta de ajuste. Cada ejecución queda en bitácora.', en: 'Shortfalls and overpayments within <b>each company’s tolerance</b> reconcile on their own against the adjustment account. Every run is logged.' },
    c4a: { es: 'Cuando una factura PPD queda pagada, el <b>complemento de pago se timbra solo</b>. Si el PAC falla, la conciliación no se revierte y el pendiente queda marcado.', en: 'When a PPD invoice is fully paid, the <b>payment complement stamps itself</b>. If the PAC fails, the reconciliation is kept and the pending item is flagged.' },
    c4b: { es: 'Todo termina en un tablero: saldos por banco, cartera por vencimiento y flujo a 30 días. <b>217 pruebas automatizadas</b> cuidan que cada peso cuadre.', en: 'It all ends on one dashboard: balances per bank, aging buckets and a 30-day cash forecast. <b>217 automated tests</b> make sure every peso adds up.' },
    banksTitle: { es: '10 bancos · 10 formatos', en: '10 banks · 10 formats' },
    parser: { es: 'Parser', en: 'Parser' },
    parserSub: { es: 'banco por archivo', en: 'bank by file name' },
    head: { es: 'FECHA   CONCEPTO', en: 'DATE    DESCRIPTION' },
    amount: { es: 'IMPORTE', en: 'AMOUNT' },
    rows: [
      ['15/09', { es: 'SPEI · ABC INDUSTRIAL', en: 'SPEI · ABC INDUSTRIAL' }, 58000],
      ['15/09', { es: 'EFECTIVO · SUC 0412', en: 'CASH · BR 0412' }, 10000],
      ['16/09', { es: 'SPEI · METALES DEL NORTE', en: 'SPEI · METALES DEL NORTE' }, -23480],
      ['16/09', { es: 'TEF · REF 88213', en: 'TEF · REF 88213' }, 9998.5]
    ],
    structure: { es: 'una sola estructura · líneas de extracto de Odoo', en: 'one structure · Odoo statement lines' },
    dup: { es: 'reimportado · 0 duplicados', en: 're-imported · 0 duplicates' },
    spei: { es: 'SPEI RECIBIDO', en: 'SPEI RECEIVED' },
    lanes: ['CLABE', { es: 'CUENTA', en: 'ACCOUNT' }, 'RFC', { es: 'NOMBRE', en: 'NAME' }],
    noMatch: { es: 'sin coincidencia', en: 'no match' },
    match: { es: 'coincide', en: 'match' },
    partner: { es: 'CONTACTO IDENTIFICADO', en: 'PARTNER FOUND' },
    cashLab: { es: 'DEPÓSITO EN EFECTIVO', en: 'CASH DEPOSIT' },
    noPartner: { es: 'sin contacto', en: 'no partner' },
    ai: { es: 'IA · Gemini · JSON validado', en: 'AI · Gemini · validated JSON' },
    accepted: { es: 'confianza ≥ 0.85 · contacto propuesto', en: 'confidence ≥ 0.85 · partner proposed' },
    deposit: { es: 'DEPÓSITO', en: 'DEPOSIT' },
    remaining: { es: 'restante', en: 'remaining' },
    invoices: { es: 'Facturas abiertas del cliente', en: 'Customer’s open invoices' },
    due: { es: 'vence', en: 'due' },
    trace: { es: 'TRAZA DE LA BÚSQUEDA', en: 'SEARCH TRACE' },
    tr: [
      { es: '32,000 → restan 26,000', en: '32,000 → 26,000 left' },
      { es: '+ 14,500 → restan 11,500 · no alcanza, poda', en: '+ 14,500 → 11,500 left · short, pruned' },
      { es: '+ 26,000 → restan 0 · exacta', en: '+ 26,000 → 0 left · exact' }
    ],
    one: { es: '1 combinación exacta', en: '1 exact combination' },
    reconciled: { es: 'CONCILIADO', en: 'RECONCILED' },
    ambiguous: { es: 'AMBIGUO', en: 'AMBIGUOUS' },
    optA: { es: 'opción A', en: 'option A' },
    optB: { es: 'opción B', en: 'option B' },
    review: { es: 'queda para revisión humana con 2 opciones', en: 'left for human review with 2 options' },
    tol: { es: 'tolerancia de faltante de la empresa', en: 'company shortfall tolerance' },
    short: { es: 'faltante $1.50 → cuenta de ajuste', en: 'shortfall $1.50 → adjustment account' },
    paid: { es: 'pagada', en: 'paid' },
    rep: { es: 'Complemento de pago', en: 'Payment complement' },
    stamping: { es: 'timbrando con el PAC…', en: 'stamping with the PAC…' },
    stamped: { es: 'REP timbrado', en: 'REP stamped' },
    safe: { es: 'si el PAC falla, la conciliación se conserva', en: 'if the PAC fails, the reconciliation is kept' },
    dash: { es: 'Tablero de tesorería', en: 'Treasury dashboard' },
    balances: { es: 'Saldos por banco', en: 'Balance per bank' },
    aging: { es: 'Cartera por vencimiento', en: 'Receivables aging' },
    buckets: [{ es: 'vencido', en: 'overdue' }, { es: 'hoy', en: 'today' }, { es: '7 días', en: '7 days' }, { es: '30 días', en: '30 days' }],
    flow: { es: 'Flujo proyectado · 30 días', en: 'Projected cash flow · 30 days' },
    tests: { es: '217 pruebas ✓', en: '217 tests ✓' }
  };

  var BANKS = ['Banorte', 'BBVA', 'Santander', 'BanBajío', 'Banregio', 'Inbursa', 'Afirme', 'Bancrea', 'Banco Base', 'STP'];

  function build(S) {
    var gsap = window.gsap;
    var W = S.W, H = S.H, tall = S.tall;
    var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.7 } });
    var bg = S.g();
    S.rect(0, 0, W, H, 0, 'sc-bg', bg);
    S.dotgrid(bg, 40);
    var s1 = S.slide(), s2 = S.slide(), s3 = S.slide(), s4 = S.slide();

    S.chapter(tl, 0);
    S.cap(tl, T.c1a);
    S.showSlide(tl, s1, 0, { from: 1 });

    var bx = tall ? 50 : 70;
    var by = tall ? 140 : 150;
    var bw = tall ? 302 : 196;
    var bgap = 16;
    var bh = tall ? 48 : 60;
    var brow = tall ? 58 : 86;
    S.text(bx, by - 30, T.banksTitle, { size: 17, family: 'mono', cls: 'sc-fg3', ls: 1.5, parent: s1 });
    var parser = tall ? { x: W / 2 - 160, y: 452, w: 320, h: 100 } : { x: 548, y: 262, w: 176, h: 180 };
    var chips = [];
    var wires = [];
    BANKS.forEach(function (name, i) {
      var col = i % 2;
      var row = Math.floor(i / 2);
      var x = bx + col * (bw + bgap);
      var y = by + row * brow;
      var g = S.g(null, s1);
      S.rect(x, y, bw, bh, 12, 'sc-card', g);
      S.rect(x + 14, y + bh / 2 - 9, 5, 18, 2, 'sc-acc', g).setAttribute('opacity', (0.4 + (i % 5) * 0.12).toFixed(2));
      S.text(x + 32, y + bh / 2 + 7, name, { size: 20, weight: 600, parent: g });
      S.path('M' + (x + bw - 36) + ',' + (y + bh / 2 - 10) + ' h11 l6,6 v14 h-17 z', 'sc-stroke-fg3', g);
      chips.push(g);
      if (!tall) {
        var ey = parser.y + 24 + i * ((parser.h - 48) / 9);
        wires.push(S.path(S.curve(x + bw, y + bh / 2, parser.x, ey, 'h', 0.55), 'sc-wire', s1));
      }
    });
    if (tall) {
      [8, 9].forEach(function (i) {
        var col = i % 2;
        var x = bx + col * (bw + bgap) + bw / 2;
        var y = by + 4 * brow + bh;
        wires.push(S.path(S.curve(x, y, parser.x + parser.w / 2 + (col ? 40 : -40), parser.y, 'v', 0.5), 'sc-wire', s1));
      });
    }
    var pg = S.g(null, s1);
    S.rect(parser.x, parser.y, parser.w, parser.h, 18, 'sc-card-hi', pg);
    if (tall) {
      S.text(parser.x + 36, parser.y + 66, '{ }', { size: 34, family: 'mono', cls: 'sc-acc-ink', weight: 600, parent: pg });
      S.text(parser.x + 108, parser.y + 50, T.parser, { size: 24, weight: 600, parent: pg });
      S.text(parser.x + 108, parser.y + 78, T.parserSub, { size: 15, family: 'mono', cls: 'sc-fg3', parent: pg });
    } else {
      S.text(parser.x + parser.w / 2, parser.y + 74, '{ }', { size: 40, family: 'mono', anchor: 'middle', cls: 'sc-acc-ink', weight: 600, parent: pg });
      S.text(parser.x + parser.w / 2, parser.y + 114, T.parser, { size: 24, weight: 600, anchor: 'middle', parent: pg });
      S.text(parser.x + parser.w / 2, parser.y + 142, T.parserSub, { size: 14, family: 'mono', anchor: 'middle', cls: 'sc-fg3', parent: pg });
    }
    var tb = tall ? { x: 50, y: 604, w: W - 100, rh: 60 } : { x: 780, y: 170, w: 440, rh: 88 };
    var tg = S.g(null, s1);
    S.text(tb.x + 4, tb.y, T.head, { size: 14, family: 'mono', cls: 'sc-fg4', ls: 1.5, parent: tg });
    S.text(tb.x + tb.w - 4, tb.y, T.amount, { size: 14, family: 'mono', cls: 'sc-fg4', ls: 1.5, anchor: 'end', parent: tg });
    S.line(tb.x, tb.y + 14, tb.x + tb.w, tb.y + 14, 'sc-line2', tg);
    var rowsG = [];
    T.rows.forEach(function (r, i) {
      var y = tb.y + 28 + i * tb.rh;
      var rh = tb.rh - 12;
      var g = S.g(null, tg);
      S.rect(tb.x, y, tb.w, rh, 12, 'sc-card', g);
      S.text(tb.x + 18, y + rh / 2 + 6, r[0], { size: 16, family: 'mono', cls: 'sc-fg3', parent: g });
      S.text(tb.x + 84, y + rh / 2 + 7, r[1], { size: 17, weight: 500, parent: g });
      S.text(tb.x + tb.w - 18, y + rh / 2 + 7, (r[2] > 0 ? '+' : '') + S.money(r[2]).replace('$', ''), { size: 17, family: 'mono', anchor: 'end', cls: r[2] > 0 ? 'sc-ok' : 'sc-fg2', weight: 500, parent: g });
      rowsG.push(g);
    });
    var stx = S.text(tb.x + 4, tb.y + 28 + 4 * tb.rh + 18, T.structure, { size: 14, family: 'mono', cls: 'sc-fg4', parent: tg });
    var dup = S.chip(tb.x + tb.w, tall ? tb.y - 44 : tb.y + 28 + 4 * tb.rh + 36, T.dup, { size: 15, anchor: 'end', cls: 'sc-card-ok', tcls: 'sc-ok', weight: 600, parent: s1 });
    dup.g.style.opacity = 0;

    tl.from(chips, { opacity: 0, y: 14, stagger: 0.05, duration: 0.45 }, 0.2);
    S.draw(tl, wires, { duration: 0.8, stagger: 0.035 }, 0.7);
    tl.from(pg, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%', duration: 0.55, ease: 'back.out(1.6)' }, 0.9);
    wires.forEach(function (w, i) {
      var c = S.circle(0, 0, 5, 'sc-acc', s1);
      c.style.opacity = 0;
      var at = 1.45 + i * 0.06;
      tl.set(c, { opacity: 1 }, at);
      tl.to(c, { duration: 0.7, ease: 'power1.in', motionPath: { path: w, align: w, alignOrigin: [0.5, 0.5] } }, at);
      tl.to(c, { opacity: 0, duration: 0.12 }, at + 0.66);
    });
    tl.from(tg, { opacity: 0, duration: 0.35 }, 2.0);
    tl.from(rowsG, { opacity: 0, x: -24, stagger: 0.14, duration: 0.5 }, 2.15);
    S.hold(tl, 1.0);
    S.cap(tl, T.c1b);
    var ghost = S.g(null, s1);
    var gx = tall ? parser.x + parser.w + 14 : parser.x + parser.w / 2 - 80;
    var gy = tall ? parser.y + 18 : parser.y - 110;
    S.rect(gx, gy, tall ? 150 : 160, 66, 12, 'sc-card2', ghost);
    S.text(gx + (tall ? 75 : 80), gy + 41, 'BBVA.csv', { size: 17, family: 'mono', anchor: 'middle', cls: 'sc-fg', parent: ghost });
    ghost.style.opacity = 0;
    tl.fromTo(ghost, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.45 });
    tl.to(ghost, tall ? { x: -120, opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.55, ease: 'power2.in' } : { y: 100, opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.55, ease: 'power2.in' });
    tl.to(rowsG, { opacity: 0.4, duration: 0.16, stagger: 0.035, yoyo: true, repeat: 1 }, '-=0.05');
    tl.fromTo(dup.g, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '<');
    S.hold(tl, 1.6);

    S.hideSlide(tl, s1);
    S.chapter(tl, 1);
    S.cap(tl, T.c2a);
    S.showSlide(tl, s2, '<0.3');

    var mv = tall ? { x: 40, y: 92, w: W - 80, h: 196 } : { x: 110, y: 96, w: W - 220, h: 184 };
    var mvG = S.g(null, s2);
    S.rect(mv.x, mv.y, mv.w, mv.h, 18, 'sc-card', mvG);
    S.text(mv.x + 26, mv.y + 44, T.spei, { size: 16, family: 'mono', cls: 'sc-fg3', ls: 2, parent: mvG });
    S.text(mv.x + mv.w - 26, mv.y + 52, '+$58,000.00', { size: tall ? 32 : 38, family: 'serif', anchor: 'end', cls: 'sc-ok', parent: mvG });
    var fs = tall ? 21 : 24;
    var cw = fs * 0.6;
    var l1y = mv.y + (tall ? 104 : 104);
    var l2y = mv.y + (tall ? 150 : 150);
    S.text(mv.x + 26, l1y, 'SPEI 002580701234567891', { size: fs, family: 'mono', cls: 'sc-fg2', parent: mvG });
    var rfcX, rfcY;
    if (tall) {
      S.text(mv.x + 26, l2y, 'ABC INDUSTRIAL SA DE CV', { size: fs, family: 'mono', cls: 'sc-fg2', parent: mvG });
      S.text(mv.x + 26, l2y + 34, 'RFC AIN120304AB1', { size: fs, family: 'mono', cls: 'sc-fg2', parent: mvG });
      rfcX = mv.x + 26 + 4 * cw;
      rfcY = l2y + 34;
      mv.h = 228;
      mvG.firstChild.setAttribute('height', mv.h);
    } else {
      S.text(mv.x + 26, l2y, 'ABC INDUSTRIAL SA DE CV  RFC AIN120304AB1', { size: fs, family: 'mono', cls: 'sc-fg2', parent: mvG });
      rfcX = mv.x + 26 + 29 * cw;
      rfcY = l2y;
    }
    var hl = [
      S.rect(mv.x + 26 + 5 * cw - 5, l1y - fs + 1, 18 * cw + 10, fs + 10, 6, 'sc-soft-blue', null),
      S.rect(rfcX - 5, rfcY - fs + 1, 12 * cw + 10, fs + 10, 6, 'sc-soft-gold', null),
      S.rect(mv.x + 26 - 5, l2y - fs + 1, 23 * cw + 10, fs + 10, 6, 'sc-soft-ok', null)
    ];
    hl.forEach(function (r) { mvG.insertBefore(r, mvG.children[1]); r.style.opacity = 0; });

    var lanesY = mv.y + mv.h + (tall ? 28 : 34);
    var laneW = tall ? (W - 80 - 14) / 2 : (W - 220 - 42) / 4;
    var laneH = tall ? 104 : 118;
    var lanes = T.lanes.map(function (name, i) {
      var col = tall ? i % 2 : i;
      var row = tall ? Math.floor(i / 2) : 0;
      var x = (tall ? 40 : 110) + col * (laneW + 14);
      var y = lanesY + row * (laneH + 14);
      var g = S.g(null, s2);
      var b = S.rect(x, y, laneW, laneH, 14, 'sc-card', g);
      S.text(x + 22, y + 42, name, { size: 19, family: 'mono', weight: 600, ls: 2, parent: g });
      var res = S.text(x + 22, y + laneH - 30, i >= 2 ? T.match : T.noMatch, { size: 15, family: 'mono', cls: i >= 2 ? 'sc-ok' : 'sc-fg3', parent: g });
      res.style.opacity = 0;
      var ck = S.check(x + laneW - 36, y + 38, 17, i >= 2, g);
      ck.g.style.opacity = 0;
      return { g: g, b: b, res: res, ck: ck };
    });
    var pcY = lanesY + (tall ? 2 * (laneH + 14) : laneH + 22);
    var pc = { x: tall ? 40 : 110, y: pcY, w: tall ? W - 80 : W - 220, h: tall ? 96 : 100 };
    var pcG = S.g(null, s2);
    S.rect(pc.x, pc.y, pc.w, pc.h, 16, 'sc-card-ok', pcG);
    S.text(pc.x + 26, pc.y + 38, T.partner, { size: 14, family: 'mono', cls: 'sc-ok', ls: 2, parent: pcG });
    S.text(pc.x + 26, pc.y + 72, 'ABC Industrial, S.A. de C.V.', { size: tall ? 24 : 26, weight: 600, parent: pcG });
    S.check(pc.x + pc.w - 44, pc.y + pc.h / 2, 20, true, pcG);
    pcG.style.opacity = 0;

    tl.from(mvG, { opacity: 0, y: 20, duration: 0.55 }, '>-0.2');
    tl.to(hl[0], { opacity: 1, duration: 0.3 }, '+=0.15');
    tl.to(hl[1], { opacity: 1, duration: 0.3 }, '+=0.1');
    tl.to(hl[2], { opacity: 1, duration: 0.3 }, '+=0.1');
    tl.from(lanes.map(function (l) { return l.g; }), { opacity: 0, y: 16, stagger: 0.08, duration: 0.45 }, '<');
    lanes.forEach(function (l, i) {
      tl.to(l.res, { opacity: 1, duration: 0.25 }, '+=' + (i === 0 ? 0.2 : 0.1));
      tl.fromTo(l.ck.g, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '<');
      if (i >= 2) tl.set(l.b, { attr: { class: 'sc-card-ok' } }, '<');
    });
    tl.fromTo(pcG, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5 }, '+=0.15');
    S.hold(tl, 1.1);

    S.cap(tl, T.c2b);
    var s2b = S.g(null, s2);
    s2b.style.opacity = 0;
    var mv2h = tall ? 196 : 184;
    S.rect(mv.x, mv.y, mv.w, mv2h, 18, 'sc-card', s2b);
    S.text(mv.x + 26, mv.y + 44, T.cashLab, { size: 16, family: 'mono', cls: 'sc-fg3', ls: 2, parent: s2b });
    S.text(mv.x + mv.w - 26, mv.y + 52, '+$10,000.00', { size: tall ? 32 : 38, family: 'serif', anchor: 'end', cls: 'sc-ok', parent: s2b });
    S.text(mv.x + 26, l1y, 'DEP EFECTIVO SUC 0412', { size: fs, family: 'mono', cls: 'sc-fg2', parent: s2b });
    S.text(mv.x + 26, l2y, 'COMERCIAL RIO BRAVO FACT 2001', { size: fs, family: 'mono', cls: 'sc-fg2', parent: s2b });
    var np = S.chip(mv.x + mv.w - 26, mv.y + mv2h - (tall ? 44 : 52), T.noPartner, { size: 15, anchor: 'end', cls: 'sc-card-err', tcls: 'sc-err', weight: 600, parent: s2b });
    var ai = tall ? { x: 40, y: mv.y + mv2h + 28, w: W - 80, h: 400 } : { x: 110, y: mv.y + mv2h + 30, w: W - 220, h: 310 };
    var aiG = S.g(null, s2b);
    S.rect(ai.x, ai.y, ai.w, ai.h, 18, 'sc-card-blue', aiG);
    S.chip(ai.x + 24, ai.y + 22, T.ai, { size: 15, cls: 'sc-soft-blue', tcls: 'sc-blue', weight: 600, parent: aiG });
    var js = ['{', '  "movement_type": "cash_deposit",', '  "customer_name": "COMERCIAL RIO BRAVO",', '  "invoice_folios": ["2001"],', '  "confidence": 0.93', '}'];
    var jsEls = js.map(function (line, i) {
      var e = S.text(ai.x + 32, ai.y + (tall ? 110 : 98) + i * (tall ? 38 : 30), line, { size: tall ? 18 : 19, family: 'mono', cls: i === 4 ? 'sc-gold' : 'sc-fg2', weight: i === 4 ? 600 : null, parent: aiG });
      e.style.opacity = 0;
      return e;
    });
    var acc = S.chip(tall ? ai.x + ai.w / 2 : ai.x + ai.w - 26, ai.y + ai.h - (tall ? 62 : 58), T.accepted, { size: 16, anchor: tall ? 'middle' : 'end', cls: 'sc-card-ok', tcls: 'sc-ok', weight: 600, parent: aiG });
    acc.g.style.opacity = 0;

    tl.to([mvG, pcG].concat(lanes.map(function (l) { return l.g; })), { opacity: 0, duration: 0.35 });
    tl.to(s2b, { opacity: 1, duration: 0.45 });
    tl.from(np.g, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%', duration: 0.35, ease: 'back.out(2)' }, '+=0.1');
    tl.from(aiG, { opacity: 0, y: 20, duration: 0.45 }, '+=0.1');
    jsEls.forEach(function (e, i) { tl.to(e, { opacity: 1, duration: 0.15 }, '+=' + (i === 0 ? 0.15 : 0.1)); });
    tl.fromTo(acc.g, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, '+=0.25');
    S.hold(tl, 1.7);

    S.hideSlide(tl, s2);
    S.chapter(tl, 2);
    S.cap(tl, T.c3a);
    S.showSlide(tl, s3, '<0.3');

    var dp = tall ? { x: 40, y: 92, w: W - 80, h: 160 } : { x: 70, y: 110, w: 400, h: 236 };
    function depositCard(parent, who, amount) {
      var g = S.g(null, parent);
      S.rect(dp.x, dp.y, dp.w, dp.h, 18, 'sc-card-hi', g);
      S.text(dp.x + 26, dp.y + 42, T.deposit, { size: 15, family: 'mono', cls: 'sc-acc-ink', ls: 2, parent: g });
      S.text(dp.x + 26, dp.y + 76, who, { size: 22, weight: 600, parent: g });
      S.text(dp.x + 26, dp.y + (tall ? 134 : 150), amount, { size: tall ? 42 : 52, family: 'serif', parent: g });
      return g;
    }
    var dpG = depositCard(s3, 'ABC Industrial', '$58,000.00');
    var rmLab = S.text(tall ? dp.x + dp.w - 26 : dp.x + 26, tall ? dp.y + 76 : dp.y + 206, T.remaining, { size: 15, family: 'mono', cls: 'sc-fg3', anchor: tall ? 'end' : 'start', parent: dpG });
    var rmVal = S.text(tall ? dp.x + dp.w - 26 : dp.x + 120, tall ? dp.y + 128 : dp.y + 206, '$58,000.00', { size: tall ? 28 : 20, family: 'mono', cls: 'sc-gold', weight: 600, anchor: tall ? 'end' : 'start', parent: dpG });

    var iv = tall ? { x: 40, y: 300, w: W - 80, rh: 80 } : { x: 540, y: 128, w: 670, rh: 88 };
    S.text(iv.x, iv.y - 18, T.invoices, { size: 15, family: 'mono', cls: 'sc-fg3', ls: 1.5, parent: s3 });
    var INV = [['F-1041', '02/09', 32000], ['F-1042', '09/09', 26000], ['F-1047', '16/09', 14500], ['F-1050', '23/09', 8700]];
    function invRow(parent, r, i, cls) {
      var y = iv.y + i * iv.rh;
      var g = S.g(null, parent);
      var b = S.rect(iv.x, y, iv.w, iv.rh - 12, 14, cls || 'sc-card', g);
      S.text(iv.x + 24, y + (iv.rh - 12) / 2 + 7, r[0], { size: 20, family: 'mono', weight: 600, parent: g });
      if (r[1]) {
        S.text(iv.x + 136, y + (iv.rh - 12) / 2 + 6, T.due, { size: 14, family: 'mono', cls: 'sc-fg4', parent: g });
        S.text(iv.x + 188, y + (iv.rh - 12) / 2 + 6, r[1], { size: 16, family: 'mono', cls: 'sc-fg3', parent: g });
      }
      S.text(iv.x + iv.w - 24, y + (iv.rh - 12) / 2 + 8, S.money(r[2]), { size: 22, family: 'mono', anchor: 'end', parent: g });
      return { g: g, b: b, y: y };
    }
    var inv = INV.map(function (r, i) { return invRow(s3, r, i); });
    var tr = tall ? { x: 40, y: iv.y + 4 * iv.rh + 6, w: W - 80, h: 164 } : { x: iv.x, y: iv.y + 4 * iv.rh + 14, w: iv.w, h: 150 };
    var trG = S.g(null, s3);
    S.rect(tr.x, tr.y, tr.w, tr.h, 14, 'sc-card2', trG);
    S.text(tr.x + 22, tr.y + 34, T.trace, { size: 13, family: 'mono', cls: 'sc-fg4', ls: 2, parent: trG });
    var trLines = T.tr.map(function (t, i) {
      var e = S.text(tr.x + 22, tr.y + 70 + i * (tall ? 34 : 28), t, { size: tall ? 16 : 17, family: 'mono', cls: i === 1 ? 'sc-err' : (i === 2 ? 'sc-ok' : 'sc-fg2'), parent: trG });
      e.style.opacity = 0;
      return e;
    });
    var wiresInv = [0, 1].map(function (i) {
      var d = tall
        ? S.curve(dp.x + dp.w / 2 + (i ? 80 : -80), dp.y + dp.h, iv.x + (i ? iv.w - 80 : 80), inv[i].y, 'v', 0.5)
        : S.curve(dp.x + dp.w, dp.y + dp.h / 2, iv.x, inv[i].y + (iv.rh - 12) / 2, 'h', 0.5);
      var p = S.path(d, 'sc-wire-ok', s3);
      p.style.opacity = 0;
      return p;
    });
    var stampPos = tall ? { x: W / 2, y: tr.y + tr.h + 62 } : { x: dp.x + dp.w / 2, y: dp.y + dp.h + 120 };
    var stamp1 = S.stamp(stampPos.x, stampPos.y, T.reconciled, { size: 28, kind: 'ok', parent: s3 });
    stamp1.style.opacity = 0;

    tl.from(dpG, { opacity: 0, x: -20, duration: 0.55 }, '>-0.2');
    tl.from(inv.map(function (o) { return o.g; }), { opacity: 0, x: 24, stagger: 0.08, duration: 0.45 }, '<0.15');
    tl.from(trG, { opacity: 0, duration: 0.3 }, '<0.2');
    function pickRow(i, cls, from, to, line) {
      tl.set(inv[i].b, { attr: { class: cls } });
      tl.fromTo(inv[i].g, { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.02, duration: 0.16, yoyo: true, repeat: 1 }, '<');
      S.counter(tl, rmVal, from, to, { fmt: function (v) { return S.money(v); }, duration: 0.4 }, '<');
      tl.to(trLines[line], { opacity: 1, duration: 0.2 }, '<');
      tl.to({}, { duration: 0.35 });
    }
    pickRow(0, 'sc-card-warn', 58000, 26000, 0);
    pickRow(2, 'sc-card-err', 26000, 11500, 1);
    tl.set(inv[2].b, { attr: { class: 'sc-card' } });
    S.counter(tl, rmVal, 11500, 26000, { fmt: function (v) { return S.money(v); }, duration: 0.25 }, '<');
    pickRow(1, 'sc-card-warn', 26000, 0, 2);
    tl.set([inv[0].b, inv[1].b], { attr: { class: 'sc-card-ok' } });
    tl.set(rmVal, { attr: { class: 'sc-ok sc-mono sc-b' } }, '<');
    tl.set(wiresInv, { opacity: 1 });
    S.draw(tl, wiresInv, { duration: 0.5 }, '<');
    S.cap(tl, T.c3b, 0.1);
    tl.fromTo(stamp1, { opacity: 0, scale: 1.8, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power4.in' }, '+=0.15');
    tl.to(s3, { x: 3, duration: 0.05, yoyo: true, repeat: 3, ease: 'none' });
    S.hold(tl, 1.0);

    var s3b = S.g(null, s3);
    s3b.style.opacity = 0;
    tl.to([dpG, stamp1, trG].concat(inv.map(function (o) { return o.g; })).concat(wiresInv), { opacity: 0, duration: 0.35 });
    var dp2 = depositCard(s3b, 'Comercial Río Bravo', '$10,000.00');
    var AMB = [['F-2001', null, 10000, 'A'], ['F-2003', null, 6000, 'B'], ['F-2004', null, 4000, 'B']];
    var amb = AMB.map(function (r, i) {
      var o = invRow(s3b, r, i, r[3] === 'A' ? 'sc-card-blue' : 'sc-card-warn');
      S.chip(iv.x + 150, o.y + (iv.rh - 12) / 2 - 13, r[3] === 'A' ? T.optA : T.optB, { size: 14, cls: r[3] === 'A' ? 'sc-soft-blue' : 'sc-soft-gold', tcls: r[3] === 'A' ? 'sc-blue' : 'sc-gold', weight: 600, parent: o.g });
      return o.g;
    });
    var ambPos = tall ? { x: W / 2, y: iv.y + 3 * iv.rh + 70 } : { x: dp.x + dp.w / 2, y: dp.y + dp.h + 110 };
    var stamp2 = S.stamp(ambPos.x, ambPos.y, T.ambiguous, { size: 28, kind: 'acc', parent: s3b });
    var rev = S.text(ambPos.x, ambPos.y + 76, T.review, { size: 16, family: 'mono', cls: 'sc-fg2', anchor: 'middle', parent: s3b });
    tl.to(s3b, { opacity: 1, duration: 0.35 });
    tl.from(dp2, { opacity: 0, x: -16, duration: 0.45 }, '<');
    tl.from(amb, { opacity: 0, x: 20, stagger: 0.08, duration: 0.4 }, '<0.1');
    tl.fromTo(stamp2, { opacity: 0, scale: 1.8, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power4.in' }, '+=0.25');
    tl.from(rev, { opacity: 0, duration: 0.35 });
    S.hold(tl, 1.4);

    S.cap(tl, T.c3c);
    var s3c = S.g(null, s3);
    s3c.style.opacity = 0;
    tl.to(s3b, { opacity: 0, duration: 0.35 });
    var dp3 = depositCard(s3c, 'Grupo Delta', '$9,998.50');
    var iv3 = invRow(s3c, ['F-3100', '20/09', 10000], 0, 'sc-card-ok');
    var ty = iv.y + iv.rh + 6;
    var tolG = S.g(null, s3c);
    S.rect(iv.x, ty, iv.w, 150, 14, 'sc-card', tolG);
    S.text(iv.x + 24, ty + 42, T.tol, { size: 15, family: 'mono', cls: 'sc-fg3', parent: tolG });
    S.text(iv.x + iv.w - 24, ty + 42, '$5.00', { size: 20, family: 'mono', anchor: 'end', parent: tolG });
    S.rect(iv.x + 24, ty + 66, iv.w - 48, 14, 7, 'sc-bg3', tolG);
    var tolFill = S.rect(iv.x + 24, ty + 66, (iv.w - 48) * 0.3, 14, 7, 'sc-gold', tolG);
    tolFill.style.transformBox = 'fill-box';
    tolFill.style.transformOrigin = 'left center';
    S.text(iv.x + 24 + (iv.w - 48) * 0.3, ty + 102, '$1.50', { size: 14, family: 'mono', cls: 'sc-gold', anchor: 'middle', parent: tolG });
    S.text(iv.x + 24, ty + 132, T.short, { size: 16, family: 'mono', cls: 'sc-ok', weight: 600, parent: tolG });
    var stamp3 = S.stamp(tall ? W / 2 : dp.x + dp.w / 2, tall ? ty + 240 : dp.y + dp.h + 110, T.reconciled, { size: 28, kind: 'ok', parent: s3c });
    tl.to(s3c, { opacity: 1, duration: 0.35 });
    tl.from([dp3, iv3.g], { opacity: 0, y: 14, stagger: 0.1, duration: 0.45 }, '<');
    tl.from(tolG, { opacity: 0, y: 14, duration: 0.45 }, '+=0.05');
    tl.from(tolFill, { scaleX: 0, duration: 0.7, ease: 'power2.out' }, '<0.15');
    tl.fromTo(stamp3, { opacity: 0, scale: 1.8, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power4.in' }, '+=0.15');
    S.hold(tl, 1.5);

    S.hideSlide(tl, s3);
    S.chapter(tl, 3);
    S.cap(tl, T.c4a);
    S.showSlide(tl, s4, '<0.3');

    var rp = tall ? { x: 40, y: 86, w: W - 80 } : { x: 70, y: 100, w: 440 };
    var rpG = S.g(null, s4);
    S.rect(rp.x, rp.y, rp.w, 100, 16, 'sc-card', rpG);
    S.text(rp.x + 24, rp.y + 44, 'F-1041', { size: 22, family: 'mono', weight: 600, parent: rpG });
    S.chip(rp.x + 134, rp.y + 22, 'PPD', { size: 14, cls: 'sc-soft-gold', tcls: 'sc-gold', weight: 600, parent: rpG });
    S.text(rp.x + 24, rp.y + 78, '$32,000.00', { size: 18, family: 'mono', cls: 'sc-fg2', parent: rpG });
    var paid = S.chip(rp.x + rp.w - 24, rp.y + 30, T.paid, { size: 15, anchor: 'end', cls: 'sc-card-ok', tcls: 'sc-ok', weight: 600, parent: rpG });
    paid.g.style.opacity = 0;
    var docY = rp.y + 124;
    var docH = tall ? 180 : 250;
    var docG = S.g(null, rpG);
    S.rect(rp.x, docY, rp.w, docH, 16, 'sc-card-hi', docG);
    S.text(rp.x + 24, docY + 44, T.rep, { size: 21, weight: 600, parent: docG });
    S.text(rp.x + 24, docY + 72, 'Pagos 2.0 · CFDI 4.0', { size: 14, family: 'mono', cls: 'sc-fg3', parent: docG });
    var stp = S.text(rp.x + 24, docY + (tall ? 114 : 130), T.stamping, { size: 15, family: 'mono', cls: 'sc-gold', parent: docG });
    var stamped = S.text(rp.x + 24, docY + (tall ? 114 : 130), T.stamped, { size: 15, family: 'mono', cls: 'sc-ok', weight: 600, parent: docG });
    stamped.style.opacity = 0;
    var uuid = S.text(rp.x + 24, docY + (tall ? 150 : 176), '5f3a9c1e-2b7d-4e61-a0c4-7d2e19b88f40', { size: 16, family: 'mono', parent: docG });
    var okc = S.check(rp.x + rp.w - 42, docY + 42, 19, true, docG);
    okc.g.style.opacity = 0;
    var safe = S.text(rp.x + 4, docY + docH + 36, T.safe, { size: 14, family: 'mono', cls: 'sc-fg3', parent: rpG });

    var db = tall ? { x: 40, y: docY + docH + 64, w: W - 80, h: H - (docY + docH + 64) - 36 } : { x: 548, y: 90, w: 662, h: 560 };
    var dbG = S.g(null, s4);
    S.rect(db.x, db.y, db.w, db.h, 20, 'sc-card', dbG);
    S.text(db.x + 24, db.y + 42, T.dash, { size: 20, weight: 600, parent: dbG });
    var tests = S.chip(db.x + db.w - 24, db.y + 20, T.tests, { size: 14, anchor: 'end', cls: 'sc-card-ok', tcls: 'sc-ok', weight: 600, parent: dbG });
    tests.g.style.opacity = 0;
    var inner = { x: db.x + 22, y: db.y + 68, w: db.w - 44, h: db.h - 90 };
    var colW = tall ? inner.w : (inner.w - 14) / 2;
    var topH = tall ? inner.h * 0.34 : inner.h * 0.46;
    var wa = { x: inner.x, y: inner.y, w: colW, h: topH };
    var wb = tall ? { x: inner.x, y: wa.y + wa.h + 12, w: inner.w, h: inner.h * 0.28 } : { x: inner.x + colW + 14, y: inner.y, w: colW, h: topH };
    var wcY = wb.y + wb.h + 12;
    var wc = { x: inner.x, y: wcY, w: inner.w, h: inner.y + inner.h - wcY };
    [wa, wb, wc].forEach(function (w) { S.rect(w.x, w.y, w.w, w.h, 14, 'sc-card2', dbG); });
    S.text(wa.x + 16, wa.y + 30, T.balances, { size: 14, family: 'mono', cls: 'sc-fg3', parent: dbG });
    var bal = [['BBVA', 0.92], ['Banorte', 0.7], ['Santander', 0.52], ['BanBajío', 0.34]];
    var balBars = bal.map(function (b, i) {
      var y = wa.y + 52 + i * ((wa.h - 64) / 4);
      S.text(wa.x + 16, y + 13, b[0], { size: 13, family: 'mono', cls: 'sc-fg2', parent: dbG });
      var r = S.rect(wa.x + 108, y + 2, (wa.w - 128) * b[1], 12, 6, 'sc-ok', dbG);
      r.style.transformBox = 'fill-box';
      r.style.transformOrigin = 'left center';
      return r;
    });
    S.text(wb.x + 16, wb.y + 30, T.aging, { size: 14, family: 'mono', cls: 'sc-fg3', parent: dbG });
    var ag = [0.55, 0.3, 0.72, 0.95];
    var agCls = ['sc-err', 'sc-gold', 'sc-blue', 'sc-ok'];
    var agBars = ag.map(function (v, i) {
      var bw2 = (wb.w - 40) / 4 - 14;
      var x = wb.x + 20 + i * (bw2 + 14) + 7;
      var maxH = wb.h - 76;
      var r = S.rect(x, wb.y + wb.h - 30 - maxH * v, bw2, maxH * v, 5, agCls[i], dbG);
      r.style.transformBox = 'fill-box';
      r.style.transformOrigin = 'center bottom';
      S.text(x + bw2 / 2, wb.y + wb.h - 10, T.buckets[i], { size: 12, family: 'mono', cls: 'sc-fg3', anchor: 'middle', parent: dbG });
      return r;
    });
    S.text(wc.x + 16, wc.y + 30, T.flow, { size: 14, family: 'mono', cls: 'sc-fg3', parent: dbG });
    var pts = [0.42, 0.38, 0.5, 0.46, 0.6, 0.55, 0.68, 0.64, 0.76, 0.72, 0.86];
    var fx0 = wc.x + 22, fx1 = wc.x + wc.w - 22, fy0 = wc.y + wc.h - 22, fy1 = wc.y + 48;
    var dd = pts.map(function (v, i) {
      return (i ? 'L' : 'M') + (fx0 + (fx1 - fx0) * i / (pts.length - 1)).toFixed(1) + ',' + (fy0 - (fy0 - fy1) * v).toFixed(1);
    }).join(' ');
    S.line(fx0, fy0, fx1, fy0, 'sc-line2', dbG);
    var flow = S.path(dd, 'sc-wire-ok', dbG);
    flow.setAttribute('stroke-width', '3');
    var endDot = S.circle(fx1, fy0 - (fy0 - fy1) * pts[pts.length - 1], 6, 'sc-ok', dbG);

    tl.from(rpG, { opacity: 0, x: -16, duration: 0.45 }, '>-0.2');
    tl.fromTo(paid.g, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, '+=0.2');
    tl.from(docG, { opacity: 0, y: 16, duration: 0.45 }, '+=0.05');
    S.scramble(tl, uuid, '5f3a9c1e-2b7d-4e61-a0c4-7d2e19b88f40', { duration: 1.0 }, '+=0.1');
    tl.to(stp, { opacity: 0, duration: 0.2 });
    tl.to(stamped, { opacity: 1, duration: 0.2 }, '<');
    tl.fromTo(okc.g, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '<');
    tl.from(safe, { opacity: 0, duration: 0.35 }, '+=0.1');
    S.hold(tl, 0.9);
    S.cap(tl, T.c4b);
    tl.from(dbG, { opacity: 0, y: 20, duration: 0.55 });
    tl.from(balBars, { scaleX: 0, stagger: 0.08, duration: 0.6 }, '<0.25');
    tl.from(agBars, { scaleY: 0, stagger: 0.08, duration: 0.6 }, '<0.15');
    S.draw(tl, flow, { duration: 1.0 }, '<0.15');
    tl.from(endDot, { scale: 0, transformOrigin: '50% 50%', duration: 0.3, ease: 'back.out(3)' });
    tl.fromTo(tests.g, { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '+=0.05');
    S.hold(tl, 2.4);
    return tl;
  }

  window.Scenes = window.Scenes || {};
  window.Scenes.tesoreria = {
    title: T.title,
    chapters: T.ch,
    poster: 0.11,
    captions: [T.c1a, T.c1b, T.c2a, T.c2b, T.c3a, T.c3b, T.c3c, T.c4a, T.c4b],
    wide: { w: 1280, h: 720 },
    tall: { w: 720, h: 920 },
    build: build
  };
})();
