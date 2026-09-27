(function () {
  var T = {
    title: { es: 'EDI: Odoo avisa, el X12 viaja solo', en: 'EDI: Odoo notifies, the X12 travels on its own' },
    ch: [
      { es: 'Validar albarán', en: 'Validate picking' },
      { es: 'Llave idempotente', en: 'Idempotency key' },
      { es: 'Webhook y acuse', en: 'Webhook & ack' },
      { es: 'X12 por AS2', en: 'X12 over AS2' },
      { es: 'Reintento', en: 'Retry' }
    ],
    c1: { es: 'Al validar un albarán, Odoo no arma el EDI: solo registra que el documento <b>ya está listo</b>. Recepción 944, salida 945, bloqueo 947 e inventario 852.', en: 'When a picking is validated, Odoo does not build the EDI: it only records that the document <b>is ready</b>. Receipt 944, shipment 945, hold 947 and inventory 852.' },
    c2: { es: 'Cada aviso lleva una llave estable <b>modelo:id:documento:ready</b> con restricción única en la bitácora. Validar dos veces no genera dos EDI.', en: 'Every notice carries a stable key <b>model:id:document:ready</b> with a unique constraint in the log. Validating twice never produces two EDIs.' },
    c3: { es: 'Un webhook <b>edi.ready</b> viaja al middleware con token en el header. 202 es un aviso nuevo; 200 significa que ya lo tenía. Ambos cuentan como acuse.', en: 'An <b>edi.ready</b> webhook travels to the middleware with a token in the header. 202 means new; 200 means it already had it. Both count as acknowledged.' },
    c4: { es: 'El middleware consulta a Odoo, genera el <b>X12</b> y lo transmite por <b>AS2</b> a SAP. Odoo conserva la evidencia: request, response, ID del mensaje AS2 y estado del MDN.', en: 'The middleware queries Odoo, builds the <b>X12</b> and transmits it over <b>AS2</b> to SAP. Odoo keeps the evidence: request, response, AS2 message ID and MDN status.' },
    c5: { es: 'Si el middleware falla, un cron reintenta con la <b>misma llave</b>, seguro gracias a la idempotencia. Los 400 y 401 no se reintentan: requieren corregir datos o token.', en: 'If the middleware fails, a cron retries with the <b>same key</b>, safe thanks to idempotency. 400s and 401s are not retried: they need a data or token fix.' },
    odoo: 'Odoo 19',
    odooSub: { es: 'almacén', en: 'warehouse' },
    mw: 'Middleware',
    mwSub: 'IKIGAI',
    sap: 'SAP',
    sapSub: 'Sterling',
    picking: 'IKI/OUT/06563',
    pickSub: { es: 'Salida · 120 piezas', en: 'Shipment · 120 units' },
    validate: { es: 'Validar', en: 'Validate' },
    done: { es: 'Hecho', en: 'Done' },
    docs: [
      ['944', { es: 'recepción', en: 'receipt' }],
      ['945', { es: 'salida', en: 'shipment' }],
      ['947', { es: 'bloqueo 344 / 343', en: 'hold 344 / 343' }],
      ['852', { es: 'inventario', en: 'inventory' }]
    ],
    notice: { es: 'aviso: documento listo', en: 'notice: document ready' },
    log: { es: 'bitácora de eventos EDI', en: 'EDI event log' },
    key: 'stock.picking:6563:945:ready',
    unique: 'UNIQUE(x_idempotency_key)',
    again: { es: 'segundo clic en Validar', en: 'second click on Validate' },
    exists: { es: 'ya existe · se reutiliza el aviso', en: 'already exists · notice reused' },
    count: { es: 'avisos en bitácora', en: 'notices in log' },
    req: 'POST /webhooks/odoo',
    ack: { es: 'acusado', en: 'acknowledged' },
    dupNote: { es: '200 = duplicado ya recibido', en: '200 = duplicate already received' },
    dupNote2: { es: 'también cuenta como acuse', en: 'also counts as an ack' },
    query: { es: 'consulta el albarán por API', en: 'reads the picking via API' },
    x12: { es: 'X12 945 generado por el middleware', en: 'X12 945 built by the middleware' },
    as2: 'AS2',
    mdn: { es: 'MDN recibido', en: 'MDN received' },
    evidence: { es: 'evidencia en Odoo', en: 'evidence in Odoo' },
    fail: { es: 'middleware caído', en: 'middleware down' },
    failed: { es: 'fallido', en: 'failed' },
    cron: '_cron_retry_pending',
    cronSub: { es: 'misma llave · hasta 48 h', en: 'same key · up to 48 h' },
    noRetry: { es: '400 / 401 → no se reintenta: corregir datos o token', en: '400 / 401 → not retried: fix data or token' }
  };

  function build(S) {
    var gsap = window.gsap;
    var W = S.W, H = S.H, tall = S.tall;
    var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.6 } });
    var bg = S.g();
    S.rect(0, 0, W, H, 0, 'sc-bg', bg);
    S.dotgrid(bg, 40);

    var nw = tall ? 196 : 300;
    var nh = tall ? 112 : 124;
    var ny = tall ? 96 : 92;
    var gap = tall ? (W - 60 - 3 * nw) / 2 : (W - 160 - 3 * nw) / 2;
    var nx0 = tall ? 30 : 80;
    var nodes = [
      { t: T.odoo, s: T.odooSub, cls: 'sc-card-hi' },
      { t: T.mw, s: T.mwSub, cls: 'sc-card' },
      { t: T.sap, s: T.sapSub, cls: 'sc-card' }
    ].map(function (n, i) {
      var x = nx0 + i * (nw + gap);
      var g = S.g();
      var b = S.rect(x, ny, nw, nh, 18, n.cls, g);
      S.text(x + (tall ? 18 : 24), ny + (tall ? 46 : 52), n.t, { size: tall ? 23 : 28, weight: 600, parent: g });
      S.text(x + (tall ? 18 : 24), ny + (tall ? 80 : 90), n.s, { size: tall ? 15 : 17, family: 'mono', cls: 'sc-fg3', ls: 1, parent: g });
      var dot = S.circle(x + nw - (tall ? 22 : 28), ny + (tall ? 38 : 44), 6, 'sc-fg4', g);
      return { g: g, b: b, dot: dot, x: x, y: ny, cx: x + nw / 2, r: x + nw, cy: ny + nh / 2 };
    });
    var wy1 = ny + nh * 0.36;
    var wy2 = ny + nh * 0.7;
    var w1 = S.path('M' + nodes[0].r + ',' + wy1 + ' L' + nodes[1].x + ',' + wy1, 'sc-wire');
    var w1b = S.path('M' + nodes[1].x + ',' + wy2 + ' L' + nodes[0].r + ',' + wy2, 'sc-wire');
    w1b.setAttribute('stroke-dasharray', '4 6');
    var w2 = S.path('M' + nodes[1].r + ',' + wy1 + ' L' + nodes[2].x + ',' + wy1, 'sc-wire');
    var w2b = S.path('M' + nodes[2].x + ',' + wy2 + ' L' + nodes[1].r + ',' + wy2, 'sc-wire');
    w2b.setAttribute('stroke-dasharray', '4 6');
    [w1b, w2b].forEach(function (w) { w.style.opacity = 0.0; });

    var P = tall ? { x: 30, y: ny + nh + 34, w: W - 60 } : { x: 80, y: ny + nh + 40, w: W - 160 };
    P.h = H - P.y - (tall ? 30 : 36);
    function panel() {
      var g = S.slide();
      S.rect(P.x, P.y, P.w, P.h, 20, 'sc-card', g);
      return g;
    }
    function packet(path, cls, pos, dur, label) {
      var g = S.g();
      var r = S.rect(-15, -10, 30, 20, 5, cls || 'sc-acc', g);
      S.path('M-15,-10 L0,2 L15,-10', 'sc-stroke-fg', g).setAttribute('stroke', 'var(--bg)');
      g.style.opacity = 0;
      tl.set(g, { opacity: 1 }, pos);
      tl.fromTo(g, { x: 0, y: 0 }, { duration: dur || 0.9, ease: 'power2.inOut', motionPath: { path: path, align: path, alignOrigin: [0.5, 0.5], autoRotate: false } }, pos);
      tl.to(g, { opacity: 0, duration: 0.15 }, '>-0.05');
      return g;
    }
    function pulse(node, cls) {
      tl.set(node.dot, { attr: { class: cls || 'sc-ok' } });
      tl.fromTo(node.dot, { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.8, duration: 0.2, yoyo: true, repeat: 1 }, '<');
    }

    S.chapter(tl, 0);
    S.cap(tl, T.c1);
    tl.from(nodes.map(function (n) { return n.g; }), { opacity: 0, y: -16, stagger: 0.1, duration: 0.5 }, 0.1);
    S.draw(tl, [w1, w2], { duration: 0.6, stagger: 0.1 }, 0.4);

    var p1 = panel();
    S.showSlide(tl, p1, 0.5);
    var pk = tall ? { x: P.x + 26, y: P.y + 30, w: P.w - 52, h: 150 } : { x: P.x + 30, y: P.y + 34, w: 520, h: 150 };
    var pkG = S.g(null, p1);
    S.rect(pk.x, pk.y, pk.w, pk.h, 16, 'sc-card2', pkG);
    S.text(pk.x + 24, pk.y + 48, T.picking, { size: 24, family: 'mono', weight: 600, parent: pkG });
    S.text(pk.x + 24, pk.y + 82, T.pickSub, { size: 17, family: 'mono', cls: 'sc-fg3', parent: pkG });
    var vb = S.chip(pk.x + 24, pk.y + pk.h - 52, T.validate, { size: 17, cls: 'sc-acc', tcls: 'sc-on-acc', weight: 600, h: 36, r: 10, parent: pkG });
    var doneChip = S.chip(pk.x + pk.w - 24, pk.y + 26, T.done, { size: 15, anchor: 'end', cls: 'sc-card-ok', tcls: 'sc-ok', weight: 600, parent: pkG });
    doneChip.g.style.opacity = 0;
    var cursor = S.path('M0,0 L0,24 L7,18 L12,28 L16,26 L11,16 L20,16 Z', 'sc-fg', p1);
    cursor.setAttribute('stroke', 'var(--bg)');
    cursor.setAttribute('stroke-width', '1.5');
    var dg = tall ? { x: P.x + 26, y: pk.y + pk.h + 30 } : { x: pk.x + pk.w + 40, y: P.y + 34 };
    var docW = tall ? (P.w - 52 - 12) / 2 : P.x + P.w - 30 - dg.x;
    var docChips = T.docs.map(function (d, i) {
      var col = tall ? i % 2 : 0;
      var row = tall ? Math.floor(i / 2) : i;
      var x = dg.x + col * (docW + 12);
      var y = dg.y + row * (tall ? 84 : 70);
      var g = S.g(null, p1);
      var b = S.rect(x, y, docW, tall ? 72 : 58, 12, 'sc-card2', g);
      S.text(x + 20, y + (tall ? 44 : 38), d[0], { size: tall ? 24 : 24, family: 'mono', weight: 600, cls: 'sc-acc-ink', parent: g });
      S.text(x + (tall ? 86 : 96), y + (tall ? 43 : 37), d[1], { size: tall ? 16 : 17, cls: 'sc-fg2', parent: g });
      return { g: g, b: b };
    });
    var nt = S.chip(tall ? P.x + P.w / 2 : pk.x + pk.w / 2, tall ? dg.y + 2 * 84 + 20 : pk.y + pk.h + 44, T.notice, { size: 16, anchor: 'middle', cls: 'sc-soft-acc', tcls: 'sc-acc-ink', weight: 600, parent: p1 });
    nt.g.style.opacity = 0;
    tl.from(pkG, { opacity: 0, y: 14, duration: 0.5 }, '>-0.1');
    tl.from(docChips.map(function (d) { return d.g; }), { opacity: 0, x: 14, stagger: 0.08, duration: 0.4 }, '<0.1');
    tl.fromTo(cursor, { x: vb.cx + 90, y: vb.cy + 80, opacity: 0 }, { x: vb.cx - 4, y: vb.cy - 6, opacity: 1, duration: 0.8, ease: 'power2.inOut' }, '+=0.1');
    tl.to(vb.g, { scale: 0.94, transformOrigin: '50% 50%', duration: 0.1, yoyo: true, repeat: 1 });
    tl.to(doneChip.g, { opacity: 1, duration: 0.3 }, '<0.1');
    tl.set(docChips[1].b, { attr: { class: 'sc-card-hi' } }, '<');
    tl.fromTo(docChips[1].g, { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.04, duration: 0.2, yoyo: true, repeat: 1 }, '<');
    tl.fromTo(nt.g, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, '+=0.1');
    tl.to(cursor, { opacity: 0, duration: 0.3 }, '<');
    S.hold(tl, 1.4);

    var p2 = panel();
    S.hideSlide(tl, p1, '+=0', { to: 0.98 });
    S.chapter(tl, 1);
    S.cap(tl, T.c2);
    S.showSlide(tl, p2, '<0.2');
    var lg = tall ? { x: P.x + 26, y: P.y + 30, w: P.w - 52 } : { x: P.x + 30, y: P.y + 34, w: P.w - 60 };
    var lgG = S.g(null, p2);
    S.text(lg.x, lg.y + 20, T.log, { size: 16, family: 'mono', cls: 'sc-fg3', ls: 1, parent: lgG });
    var uq = S.chip(lg.x + lg.w, lg.y, T.unique, { size: 14, anchor: 'end', cls: 'sc-soft-gold', tcls: 'sc-gold', weight: 600, parent: lgG });
    var row1Y = lg.y + 48;
    var rowH = tall ? 118 : 96;
    function logRow(y, cls) {
      var g = S.g(null, p2);
      S.rect(lg.x, y, lg.w, rowH, 14, cls || 'sc-card2', g);
      return g;
    }
    var r1 = logRow(row1Y);
    S.text(lg.x + 22, row1Y + 36, 'idempotency_key', { size: 14, family: 'mono', cls: 'sc-fg4', parent: r1 });
    var keyT = S.text(lg.x + 22, row1Y + (tall ? 76 : 70), T.key, { size: tall ? 21 : 24, family: 'mono', weight: 600, cls: 'sc-fg', parent: r1 });
    var st1 = S.chip(lg.x + lg.w - 22, row1Y + (tall ? rowH - 44 : 30), 'pending', { size: 14, anchor: 'end', cls: 'sc-card2', tcls: 'sc-fg3', parent: r1 });
    var parts = tall ? null : null;
    var r2Y = row1Y + rowH + 22;
    var again = S.text(lg.x, r2Y + 4, T.again, { size: 15, family: 'mono', cls: 'sc-fg3', parent: p2 });
    var r2 = logRow(r2Y + 20, 'sc-card-err');
    S.text(lg.x + 22, r2Y + 20 + (tall ? 50 : 42), T.key, { size: tall ? 19 : 21, family: 'mono', cls: 'sc-fg3', parent: r2 });
    S.text(lg.x + 22, r2Y + 20 + (tall ? 88 : 74), T.exists, { size: 16, family: 'mono', weight: 600, cls: 'sc-err', parent: r2 });
    var cntY = r2Y + 20 + rowH + (tall ? 50 : 46);
    var cntLab = S.text(lg.x, cntY, T.count, { size: 16, family: 'mono', cls: 'sc-fg3', parent: p2 });
    var cntVal = S.text(lg.x + lg.w, cntY + 6, '1', { size: 40, family: 'serif', anchor: 'end', cls: 'sc-ok', parent: p2 });
    tl.from([lgG, r1], { opacity: 0, y: 12, stagger: 0.12, duration: 0.45 }, '>-0.1');
    S.scramble(tl, keyT, T.key, { duration: 1.1, chars: 'abcdefghijklmnopqrstuvwxyz0123456789' }, '<0.2');
    tl.fromTo(uq.g, { opacity: 0, scale: 0.7, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' });
    tl.from(again, { opacity: 0, duration: 0.3 }, '+=0.3');
    tl.from(r2, { opacity: 0, y: 16, duration: 0.45 });
    tl.to(r2, { x: 8, duration: 0.06, yoyo: true, repeat: 5, ease: 'none' });
    tl.to(r2, { opacity: 0.45, duration: 0.4 }, '+=0.3');
    tl.from([cntLab, cntVal], { opacity: 0, duration: 0.35 }, '<');
    S.hold(tl, 1.3);

    var p3 = panel();
    S.hideSlide(tl, p2, '+=0', { to: 0.98 });
    S.chapter(tl, 2);
    S.cap(tl, T.c3);
    S.showSlide(tl, p3, '<0.2');
    var rq = tall ? { x: P.x + 26, y: P.y + 30, w: P.w - 52 } : { x: P.x + 30, y: P.y + 34, w: 700 };
    var rqG = S.g(null, p3);
    S.text(rq.x, rq.y + 20, T.req, { size: tall ? 19 : 20, family: 'mono', weight: 600, cls: 'sc-acc-ink', parent: rqG });
    var hdr = ['Content-Type: application/json', 'X-IKIGAI-Webhook-Token: ••••••••••••'];
    hdr.forEach(function (hline, i) {
      S.text(rq.x, rq.y + 56 + i * 28, hline, { size: tall ? 15 : 16, family: 'mono', cls: i ? 'sc-gold' : 'sc-fg3', parent: rqG });
    });
    var body = ['{', '  "event_type": "edi.ready",', '  "edi_document_type": "945",', '  "res_model": "stock.picking",', '  "res_id": 6563,', '  "idempotency_key": "stock.picking:6563:945:ready"', '}'];
    var bodyEls = body.map(function (line, i) {
      var e = S.text(rq.x, rq.y + 132 + i * (tall ? 30 : 27), tall && i === 5 ? '  "idempotency_key": "…:6563:945:ready"' : line, { size: tall ? 15 : 16, family: 'mono', cls: i === 2 ? 'sc-acc-ink' : 'sc-fg2', parent: rqG });
      e.style.opacity = 0;
      return e;
    });
    var resp = tall ? { x: P.x + 26, y: rq.y + 132 + 7 * 30 + 20, w: P.w - 52 } : { x: rq.x + rq.w + 30, y: P.y + 34, w: P.x + P.w - 30 - (rq.x + rq.w + 30) };
    var rsG = S.g(null, p3);
    S.rect(resp.x, resp.y, resp.w, tall ? 150 : 190, 16, 'sc-card-ok', rsG);
    S.text(resp.x + 22, resp.y + 50, '202', { size: tall ? 40 : 52, family: 'serif', cls: 'sc-ok', parent: rsG });
    S.text(resp.x + (tall ? 110 : 22), resp.y + (tall ? 48 : 90), 'Accepted', { size: 20, family: 'mono', weight: 600, cls: 'sc-ok', parent: rsG });
    S.text(resp.x + 22, resp.y + (tall ? 88 : 130), '"middlewareEventId": "mw_8f2c41"', { size: tall ? 14 : 14, family: 'mono', cls: 'sc-fg2', parent: rsG });
    var ackC = S.chip(resp.x + 22, resp.y + (tall ? 104 : 146), T.ack, { size: 14, cls: 'sc-soft-ok', tcls: 'sc-ok', weight: 600, parent: rsG });
    var dn = S.g(null, p3);
    S.text(resp.x + 4, (tall ? resp.y + 150 : resp.y + 190) + 32, T.dupNote, { size: 14, family: 'mono', cls: 'sc-fg3', parent: dn });
    S.text(resp.x + 4, (tall ? resp.y + 150 : resp.y + 190) + 54, T.dupNote2, { size: 14, family: 'mono', cls: 'sc-fg3', parent: dn });
    tl.from(rqG, { opacity: 0, y: 12, duration: 0.4 }, '>-0.1');
    bodyEls.forEach(function (e, i) { tl.to(e, { opacity: 1, duration: 0.12 }, '+=' + (i ? 0.08 : 0.2)); });
    packet(w1, 'sc-acc', '+=0.15', 0.9);
    pulse(nodes[1], 'sc-acc');
    tl.set(w1b, { opacity: 1 });
    packet(w1b, 'sc-ok', '+=0', 0.7);
    pulse(nodes[0], 'sc-ok');
    tl.from(rsG, { opacity: 0, scale: 0.92, transformOrigin: '50% 50%', duration: 0.45, ease: 'back.out(1.8)' }, '<');
    tl.from(dn, { opacity: 0, duration: 0.3 }, '+=0.2');
    S.hold(tl, 1.4);

    var p4 = panel();
    S.hideSlide(tl, p3, '+=0', { to: 0.98 });
    S.chapter(tl, 3);
    S.cap(tl, T.c4);
    S.showSlide(tl, p4, '<0.2');
    var qx = tall ? { x: P.x + 26, y: P.y + 30, w: P.w - 52 } : { x: P.x + 30, y: P.y + 34, w: 640 };
    var q1 = S.chip(qx.x, qx.y, T.query, { size: 15, cls: 'sc-soft-blue', tcls: 'sc-blue', weight: 600, parent: p4 });
    S.text(qx.x, qx.y + 66, T.x12, { size: 14, family: 'mono', cls: 'sc-fg4', ls: 1, parent: p4 });
    var x12 = tall
      ? ['ISA*00*…*ZZ*IKIGAI*ZZ*SAP~', 'GS*SW*IKIGAI*SAP*20260915~', 'ST*945*0001~', 'W06*N*IKI-OUT-06563*20260915~', 'LX*1~', 'W12*CC*120*120*0*EA~', 'W03*120~', 'SE*7*0001~']
      : ['ISA*00*…*ZZ*IKIGAI*ZZ*SAP*260915*1432~', 'GS*SW*IKIGAI*SAP*20260915*1432*6563~', 'ST*945*0001~', 'W06*N*IKI-OUT-06563*20260915*6563~', 'LX*1~', 'W12*CC*120*120*0*EA**VN*SKU-4471~', 'W03*120*1440*LB~', 'SE*7*0001~'];
    var x12Els = x12.map(function (line, i) {
      var e = S.text(qx.x, qx.y + 100 + i * (tall ? 30 : 29), line, { size: tall ? 16 : 17, family: 'mono', cls: i === 2 || i === 3 ? 'sc-acc-ink' : 'sc-fg2', weight: i === 2 ? 600 : null, parent: p4 });
      e.style.opacity = 0;
      return e;
    });
    var ev = tall ? { x: P.x + 26, y: qx.y + 100 + 8 * 30 + 8, w: P.w - 52, h: 150 } : { x: qx.x + qx.w + 30, y: P.y + 34, w: P.x + P.w - 30 - (qx.x + qx.w + 30), h: 250 };
    var evG = S.g(null, p4);
    S.rect(ev.x, ev.y, ev.w, ev.h, 16, 'sc-card2', evG);
    S.text(ev.x + 22, ev.y + 38, T.evidence, { size: 14, family: 'mono', cls: 'sc-fg4', ls: 1.5, parent: evG });
    var evRows = [['x_last_request_json', '✓'], ['x_last_response_json', '✓'], ['x_as2_message_id', 'as2_7d1e…'], ['x_mdn_status', 'processed']];
    var evEls = evRows.map(function (r, i) {
      var y = ev.y + 72 + i * (tall ? 20 : 42);
      var g = S.g(null, evG);
      if (tall) {
        S.text(ev.x + 22 + (i % 2) * (ev.w / 2), ev.y + 70 + Math.floor(i / 2) * 44, r[0], { size: 13, family: 'mono', cls: 'sc-fg3', parent: g });
        S.text(ev.x + 22 + (i % 2) * (ev.w / 2), ev.y + 92 + Math.floor(i / 2) * 44, r[1], { size: 14, family: 'mono', cls: 'sc-ok', weight: 600, parent: g });
      } else {
        S.text(ev.x + 22, y, r[0], { size: 14, family: 'mono', cls: 'sc-fg3', parent: g });
        S.text(ev.x + ev.w - 22, y, r[1], { size: 14, family: 'mono', cls: 'sc-ok', weight: 600, anchor: 'end', parent: g });
      }
      g.style.opacity = 0;
      return g;
    });
    var lock = S.g();
    var lx = (nodes[1].r + nodes[2].x) / 2;
    S.rect(lx - 9, wy1 - 30, 18, 14, 3, 'sc-gold', lock);
    S.path('M' + (lx - 5) + ',' + (wy1 - 30) + ' v-5 a5,5 0 0 1 10,0 v5', 'sc-stroke-gold', lock);
    S.text(lx, wy1 - 42, T.as2, { size: 13, family: 'mono', cls: 'sc-gold', anchor: 'middle', weight: 600, parent: lock });
    lock.style.opacity = 0;
    tl.from(q1.g, { opacity: 0, x: -10, duration: 0.35 }, '>-0.1');
    tl.set(w1b, { opacity: 1 });
    packet(w1b, 'sc-blue', '<', 0.7);
    tl.set(w1, { opacity: 1 });
    packet(w1, 'sc-blue', '>', 0.6);
    x12Els.forEach(function (e, i) { tl.to(e, { opacity: 1, duration: 0.1 }, '+=' + (i ? 0.1 : 0.15)); });
    tl.to(lock, { opacity: 1, duration: 0.3 });
    packet(w2, 'sc-gold', '<', 0.9);
    pulse(nodes[2], 'sc-ok');
    tl.set(w2b, { opacity: 1 });
    packet(w2b, 'sc-ok', '>', 0.6);
    var mdn = S.chip(nodes[2].cx, nodes[2].y + nodes[2].b.getAttribute('height') * 1 + 12, T.mdn, { size: 13, anchor: 'middle', cls: 'sc-soft-ok', tcls: 'sc-ok', weight: 600 });
    mdn.g.style.opacity = 0;
    tl.fromTo(mdn.g, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3 }, '<0.3');
    tl.from(evG, { opacity: 0, y: 12, duration: 0.4 }, '<');
    tl.to(evEls, { opacity: 1, stagger: 0.12, duration: 0.25 }, '>-0.1');
    S.hold(tl, 1.5);

    var p5 = panel();
    S.hideSlide(tl, p4, '+=0', { to: 0.98 });
    tl.to([mdn.g, lock], { opacity: 0, duration: 0.3 }, '<');
    S.chapter(tl, 4);
    S.cap(tl, T.c5);
    S.showSlide(tl, p5, '<0.2');
    var rt = tall ? { x: P.x + 26, y: P.y + 30, w: P.w - 52 } : { x: P.x + 30, y: P.y + 34, w: P.w - 60 };
    var fr = S.g(null, p5);
    var frH = tall ? 110 : 84;
    S.rect(rt.x, rt.y, rt.w, frH, 14, 'sc-card-err', fr);
    S.text(rt.x + 22, rt.y + (tall ? 46 : 38), 'HTTP 500', { size: tall ? 26 : 28, family: 'mono', weight: 600, cls: 'sc-err', parent: fr });
    S.text(rt.x + 22, rt.y + (tall ? 82 : 66), T.fail, { size: 15, family: 'mono', cls: 'sc-fg3', parent: fr });
    var stF = S.chip(rt.x + rt.w - 22, rt.y + frH / 2 - 16, T.failed, { size: 14, anchor: 'end', cls: 'sc-card-err', tcls: 'sc-err', weight: 600, parent: fr });
    var crY = rt.y + frH + (tall ? 26 : 18);
    var cr = S.g(null, p5);
    var crH = tall ? 150 : 104;
    S.rect(rt.x, crY, rt.w, crH, 14, 'sc-card-blue', cr);
    var ccx = rt.x + 60, ccy = crY + crH / 2;
    S.circle(ccx, ccy, 30, 'sc-soft-blue', cr);
    S.circle(ccx, ccy, 30, 'sc-stroke-blue', cr);
    var hand = S.line(ccx, ccy, ccx, ccy - 20, 'sc-stroke-blue', cr);
    hand.setAttribute('stroke-width', '3');
    hand.setAttribute('stroke-linecap', 'round');
    S.text(ccx + 56, ccy - 6, T.cron, { size: tall ? 19 : 22, family: 'mono', weight: 600, cls: 'sc-blue', parent: cr });
    S.text(ccx + 56, ccy + 26, T.cronSub, { size: 15, family: 'mono', cls: 'sc-fg3', parent: cr });
    var okY = crY + crH + (tall ? 26 : 18);
    var okG = S.g(null, p5);
    S.rect(rt.x, okY, rt.w, frH, 14, 'sc-card-ok', okG);
    S.text(rt.x + 22, okY + (tall ? 46 : 38), '202 Accepted', { size: tall ? 24 : 26, family: 'mono', weight: 600, cls: 'sc-ok', parent: okG });
    S.text(rt.x + 22, okY + (tall ? 82 : 66), T.key, { size: 15, family: 'mono', cls: 'sc-fg3', parent: okG });
    S.check(rt.x + rt.w - 44, okY + frH / 2, 20, true, okG);
    var nr = S.text(rt.x + 4, okY + frH + (tall ? 40 : 30), T.noRetry, { size: tall ? 14 : 16, family: 'mono', cls: 'sc-fg2', parent: p5 });
    tl.from(fr, { opacity: 0, y: 12, duration: 0.4 }, '>-0.1');
    var xp = S.g();
    var xmx = (nodes[0].r + nodes[1].x) / 2;
    S.circle(xmx, wy1, 15, 'sc-card-err', xp);
    S.path('M' + (xmx - 6) + ',' + (wy1 - 6) + ' L' + (xmx + 6) + ',' + (wy1 + 6) + ' M' + (xmx + 6) + ',' + (wy1 - 6) + ' L' + (xmx - 6) + ',' + (wy1 + 6), 'sc-stroke-err', xp);
    xp.style.opacity = 0;
    tl.set(nodes[1].dot, { attr: { class: 'sc-err' } }, '<');
    tl.fromTo(xp, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, '<0.1');
    tl.from(cr, { opacity: 0, y: 12, duration: 0.4 }, '+=0.3');
    tl.fromTo(hand, { rotation: 0, svgOrigin: ccx + ' ' + ccy }, { rotation: 360, svgOrigin: ccx + ' ' + ccy, duration: 1.2, ease: 'power1.inOut' }, '<0.1');
    tl.to(xp, { opacity: 0, duration: 0.25 });
    tl.set(nodes[1].dot, { attr: { class: 'sc-ok' } });
    packet(w1, 'sc-acc', '<', 0.8);
    tl.from(okG, { opacity: 0, y: 12, duration: 0.4 }, '>-0.1');
    tl.to(stF.g, { opacity: 0.3, duration: 0.3 }, '<');
    tl.from(nr, { opacity: 0, duration: 0.35 }, '+=0.25');
    S.hold(tl, 2.4);
    return tl;
  }

  window.Scenes = window.Scenes || {};
  window.Scenes.edi = {
    title: T.title,
    chapters: T.ch,
    poster: 0.13,
    captions: [T.c1, T.c2, T.c3, T.c4, T.c5],
    wide: { w: 1280, h: 720 },
    tall: { w: 720, h: 920 },
    build: build
  };
})();
