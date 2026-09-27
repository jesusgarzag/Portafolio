(function () {
  var T = {
    title: { es: 'PTU: una persona, tres empresas, un solo reparto', en: 'Profit sharing: one person, three companies, one payout' },
    ch: [
      { es: 'Registros dispersos', en: 'Scattered records' },
      { es: 'Union-find', en: 'Union-find' },
      { es: 'Reparto 50/50', en: '50/50 split' },
      { es: 'Centavos y nómina', en: 'Cents & payroll' }
    ],
    c1: { es: 'En un grupo con varias razones sociales, la misma persona aparece varias veces y <b>no siempre con los mismos datos</b>: aquí con CURP, allá solo con RFC o con NSS.', en: 'In a group with several legal entities, the same person shows up several times and <b>not always with the same data</b>: CURP here, only RFC or social security number there.' },
    c2: { es: 'Con <b>union-find</b>, dos registros son la misma persona si comparten CURP, RFC o NSS, aunque sea de forma indirecta. Seis registros se convierten en tres personas: nada se duplica ni se parte.', en: 'With <b>union-find</b>, two records are the same person if they share CURP, RFC or NSS, even indirectly. Six records become three people: nothing is duplicated or split.' },
    c3: { es: 'La mitad de la PTU se reparte por <b>días trabajados</b> y la otra mitad por <b>salario devengado</b>, con el tope anual aplicado a quien lo rebasa.', en: 'Half of the profit share is distributed by <b>days worked</b> and the other half by <b>earned salary</b>, with the annual cap applied to anyone above it.' },
    c4: { es: 'El centavo de redondeo va al mayor reparto. Si la diferencia no fuera de redondeo, el cálculo se <b>detiene antes de pagar</b>. Después, cada persona recibe su recibo de nómina.', en: 'The rounding cent goes to the largest payout. If the difference weren’t just rounding, the calculation <b>stops before paying</b>. Then every person gets a payslip.' },
    cos: [{ es: 'Empresa principal', en: 'Main company' }, { es: 'Interna 1', en: 'Internal 1' }, { es: 'Interna 2', en: 'Internal 2' }],
    recs: [
      [0, 'Ana Rodríguez', 'RODA900512MNLDRN04', '—', '43119012345'],
      [0, 'Luis Martínez', 'MAGL880213HNLRRS09', '—', '—'],
      [1, 'A. Rodríguez', '—', 'RODA900512KT3', '43119012345'],
      [1, 'Luis Martínez G.', 'MAGL880213HNLRRS09', 'MAGL880213P41', '—'],
      [2, 'Ana R.', '—', 'RODA900512KT3', '—'],
      [2, 'Carla Pérez', 'PELC950830MNLRRR02', 'PELC950830AB7', '52089876543']
    ],
    six: { es: '6 registros', en: '6 records' },
    three: { es: '3 personas', en: '3 people' },
    persons: [
      ['Ana Rodríguez', { es: '3 registros · NSS + RFC', en: '3 records · NSS + RFC' }],
      ['Luis Martínez', { es: '2 registros · CURP', en: '2 records · CURP' }],
      ['Carla Pérez', { es: '1 registro', en: '1 record' }]
    ],
    find: { es: 'find(Ana R.) → raíz · compresión de caminos', en: 'find(Ana R.) → root · path compression' },
    pool: { es: 'PTU a repartir', en: 'Profit share to distribute' },
    byDays: { es: '50 % por días', en: '50% by days' },
    bySal: { es: '50 % por salario', en: '50% by salary' },
    cap: { es: 'tope anual $180,000.00', en: 'annual cap $180,000.00' },
    days: { es: 'días', en: 'days' },
    salary: { es: 'salario', en: 'salary' },
    sum: { es: 'Σ repartido', en: 'Σ distributed' },
    diff: { es: 'diferencia de redondeo', en: 'rounding difference' },
    toTop: { es: '→ al mayor reparto: Ana', en: '→ to the largest payout: Ana' },
    guard: { es: 'salvaguarda: |dif| ≤ 3 × $0.01 + $1.00', en: 'safeguard: |diff| ≤ 3 × $0.01 + $1.00' },
    slip: { es: 'Recibo PTU', en: 'PTU payslip' },
    sent: { es: 'enviado a nómina', en: 'sent to payroll' }
  };

  var P = [
    { n: 'Ana', days: 365, sal: 210000, cap: 180000, byD: 25347.22, byS: 25714.29 },
    { n: 'Luis', days: 300, sal: 150000, cap: 150000, byD: 20833.33, byS: 21428.57 },
    { n: 'Carla', days: 199, sal: 90000, cap: 90000, byD: 13819.44, byS: 12857.14 }
  ];

  function m(n) {
    return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function build(S) {
    var gsap = window.gsap;
    var W = S.W, H = S.H, tall = S.tall;
    var tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out', duration: 0.6 } });
    var bg = S.g();
    S.rect(0, 0, W, H, 0, 'sc-bg', bg);
    S.dotgrid(bg, 40);
    var s1 = S.slide(), s3 = S.slide(), s4 = S.slide();

    S.chapter(tl, 0);
    S.cap(tl, T.c1);
    S.showSlide(tl, s1, 0, { from: 1 });
    var colW = tall ? W - 60 : (W - 140 - 40) / 3;
    var cardH = tall ? 118 : 172;
    var cardW = tall ? (colW - 14) / 2 : colW;
    var y0 = tall ? 104 : 110;
    var heads = [];
    var cards = [];
    T.cos.forEach(function (c, i) {
      var x = tall ? 30 : 70 + i * (colW + 20);
      var y = tall ? y0 + i * (cardH + 58) : y0;
      var hg = S.g(null, s1);
      S.text(x, y + 16, c, { size: 15, family: 'mono', cls: i ? 'sc-fg3' : 'sc-acc-ink', ls: 1.5, weight: 600, parent: hg });
      heads.push(hg);
    });
    T.recs.forEach(function (r, i) {
      var co = r[0];
      var k = i - (co === 0 ? 0 : (co === 1 ? 2 : 4));
      var x = tall ? 30 + k * (cardW + 14) : 70 + co * (colW + 20);
      var y = tall ? y0 + co * (cardH + 58) + 30 : y0 + 30 + k * (cardH + 16);
      var g = S.g(null, s1);
      var b = S.rect(x, y, cardW, cardH, 14, 'sc-card', g);
      S.text(x + 18, y + (tall ? 28 : 36), r[1], { size: tall ? 15.5 : 19, weight: 600, parent: g });
      var ids = [['CURP', r[2]], ['RFC', r[3]], ['NSS', r[4]]];
      var idEls = ids.map(function (id, j) {
        var yy = y + (tall ? 54 : 72) + j * (tall ? 22 : 30);
        S.text(x + 18, yy, id[0], { size: tall ? 11 : 13, family: 'mono', cls: 'sc-fg4', parent: g });
        var v = S.text(x + (tall ? 62 : 74), yy, id[1], { size: tall ? 11.5 : 14.5, family: 'mono', cls: id[1] === '—' ? 'sc-fg4' : 'sc-fg2', parent: g });
        return v;
      });
      cards.push({ g: g, b: b, x: x, y: y, w: cardW, h: cardH, ids: idEls, co: co });
    });
    var six = S.chip(tall ? W / 2 : W / 2, tall ? H - 60 : H - 76, T.six, { size: 16, anchor: 'middle', cls: 'sc-card2', tcls: 'sc-fg', weight: 600, parent: s1 });
    tl.from(heads, { opacity: 0, y: -8, stagger: 0.1, duration: 0.4 }, 0.2);
    tl.from(cards.map(function (c) { return c.g; }), { opacity: 0, y: 16, stagger: 0.12, duration: 0.45 }, 0.4);
    tl.from(six.g, { opacity: 0, duration: 0.4 }, '+=0.2');
    S.hold(tl, 1.4);

    S.chapter(tl, 1);
    S.cap(tl, T.c2);
    function hi(card, j, cls) {
      tl.set(card.ids[j], { attr: { class: cls + ' sc-mono sc-b' } }, '<');
    }
    var linkLabels = [];
    function link(a, b, j, cls, wireCls) {
      var A = cards[a], B = cards[b];
      var ax = A.x + A.w / 2, ay = A.y + A.h, bx = B.x + B.w / 2, by = B.y;
      var d;
      if (tall) {
        if (A.co === B.co) { d = S.curve(A.x + A.w, A.y + A.h / 2, B.x, B.y + B.h / 2, 'h'); }
        else { d = S.curve(ax, ay, bx, by, 'v', 0.5); }
      } else {
        var ry = A.y + 72 + j * 30 - 5;
        var vw = S.t(A.ids[j].textContent).length * 14.5 * 0.6;
        ax = A.x + 74 + vw + 8;
        bx = B.x + 66;
        d = 'M' + ax + ',' + ry + ' L' + bx + ',' + ry;
      }
      var p = S.path(d, wireCls, s1);
      p.style.opacity = 0;
      if (!tall) {
        var lab = S.chip(A.x + A.w + 10, A.y + 72 + j * 30 - 17, ['CURP', 'RFC', 'NSS'][j], { size: 12, anchor: 'middle', h: 22, cls: 'sc-bg2', tcls: cls, weight: 600, parent: s1 });
        lab.g.style.opacity = 0;
        tl.to(lab.g, { opacity: 1, duration: 0.2 }, '+=0');
        linkLabels.push(lab.g);
      }
      tl.set(p, { opacity: 1 });
      hi(A, j, cls);
      hi(B, j, cls);
      tl.set([A.b, B.b], { attr: { class: 'sc-card-hi' } }, '<');
      S.draw(tl, p, { duration: 0.55 }, '<');
      return p;
    }
    var l1 = link(0, 2, 2, 'sc-violet', 'sc-wire-blue');
    tl.to({}, { duration: 0.35 });
    var l2 = link(2, 4, 1, 'sc-gold', 'sc-wire-gold');
    tl.to({}, { duration: 0.35 });
    var l3 = link(1, 3, 0, 'sc-ok', 'sc-wire-ok');
    tl.to({}, { duration: 0.6 });
    var fnd = S.chip(W / 2, tall ? H - 110 : H - 128, T.find, { size: tall ? 13 : 15, anchor: 'middle', cls: 'sc-soft-blue', tcls: 'sc-blue', weight: 600, parent: s1 });
    fnd.g.style.opacity = 0;
    tl.fromTo(fnd.g, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 });
    tl.to({}, { duration: 0.8 });
    var pg = S.g(null, s1);
    pg.style.opacity = 0;
    var pw = tall ? W - 60 : (W - 140 - 40) / 3;
    var ph = tall ? 118 : 150;
    var personEls = T.persons.map(function (p, i) {
      var x = tall ? 30 : 70 + i * (pw + 20);
      var y = tall ? 150 + i * (ph + 22) : 250;
      var g = S.g(null, pg);
      S.rect(x, y, pw, ph, 16, i === 2 ? 'sc-card' : 'sc-card-ok', g);
      S.circle(x + 44, y + ph / 2, 24, i === 2 ? 'sc-bg3' : 'sc-soft-ok', g);
      S.text(x + 44, y + ph / 2 + 7, p[0].split(' ').map(function (w) { return w[0]; }).join(''), { size: 18, weight: 600, anchor: 'middle', cls: i === 2 ? 'sc-fg2' : 'sc-ok', parent: g });
      S.text(x + 84, y + ph / 2 - 6, p[0], { size: tall ? 20 : 21, weight: 600, parent: g });
      S.text(x + 84, y + ph / 2 + 22, p[1], { size: 14, family: 'mono', cls: 'sc-fg3', parent: g });
      return g;
    });
    var three = S.chip(W / 2, tall ? H - 60 : H - 76, T.three, { size: 16, anchor: 'middle', cls: 'sc-card-ok', tcls: 'sc-ok', weight: 600, parent: pg });
    var gatherX = W / 2, gatherY = tall ? 400 : 330;
    tl.to(cards.map(function (c) { return c.g; }), { opacity: 0, scale: 0.7, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.04, ease: 'power2.in' });
    tl.to([l1, l2, l3, fnd.g, six.g].concat(heads).concat(linkLabels), { opacity: 0, duration: 0.35 }, '<');
    tl.to(pg, { opacity: 1, duration: 0.01 });
    tl.from(personEls, { opacity: 0, scale: 0.85, transformOrigin: '50% 50%', stagger: 0.12, duration: 0.5, ease: 'back.out(1.6)' }, '<');
    tl.from(three.g, { opacity: 0, duration: 0.3 }, '>-0.1');
    S.hold(tl, 1.6);

    S.hideSlide(tl, s1);
    S.chapter(tl, 2);
    S.cap(tl, T.c3);
    S.showSlide(tl, s3, '<0.3');
    var top = tall ? { x: 30, y: 96, w: W - 60 } : { x: 70, y: 96, w: W - 140 };
    var poolG = S.g(null, s3);
    S.rect(top.x, top.y, top.w, tall ? 96 : 92, 16, 'sc-card-hi', poolG);
    S.text(top.x + 24, top.y + (tall ? 36 : 38), T.pool, { size: 14, family: 'mono', cls: 'sc-acc-ink', ls: 1.5, parent: poolG });
    var poolV = S.text(tall ? top.x + 24 : top.x + top.w - 24, tall ? top.y + 80 : top.y + 62, '$120,000.00', { size: tall ? 34 : 40, family: 'serif', anchor: tall ? 'start' : 'end', parent: poolG });
    var halfY = top.y + (tall ? 110 : 108);
    var halfW = (top.w - 16) / 2;
    var halves = [[T.byDays, 'sc-card-blue', 'sc-blue'], [T.bySal, 'sc-card-warn', 'sc-gold']].map(function (hh, i) {
      var x = top.x + i * (halfW + 16);
      var g = S.g(null, s3);
      S.rect(x, halfY, halfW, 72, 14, hh[1], g);
      S.text(x + 20, halfY + 30, hh[0], { size: 14, family: 'mono', cls: hh[2], weight: 600, parent: g });
      S.text(x + 20, halfY + 58, '$60,000.00', { size: tall ? 20 : 22, family: 'mono', weight: 600, parent: g });
      return g;
    });
    var capC = S.chip(top.x + top.w, halfY + (tall ? 84 : 86), T.cap, { size: 13, anchor: 'end', cls: 'sc-soft-gold', tcls: 'sc-gold', weight: 600, parent: s3 });
    var rowsY = halfY + (tall ? 132 : 130);
    var rowH = tall ? 150 : 118;
    var maxDays = 365, maxSal = 210000;
    var barX = top.x + (tall ? 20 : 170);
    var barW = tall ? top.w - 190 : top.w - 170 - 240;
    var rows = P.map(function (p, i) {
      var y = rowsY + i * (rowH + 10);
      var g = S.g(null, s3);
      S.rect(top.x, y, top.w, rowH, 14, 'sc-card', g);
      S.text(top.x + 20, y + (tall ? 30 : rowH / 2 + 7), p.n, { size: 19, weight: 600, parent: g });
      var bx1 = tall ? top.x + 20 : barX;
      var by1 = tall ? y + 48 : y + 26;
      var by2 = tall ? y + 96 : y + 66;
      var bx2 = tall ? top.x + 20 : barX + barW + 30;
      var bw1 = tall ? barW : barW;
      S.text(bx1, by1 - 6, S.t(T.days) + ' · ' + p.days, { size: 12.5, family: 'mono', cls: 'sc-fg3', parent: g });
      S.rect(bx1, by1, bw1, 14, 7, 'sc-bg3', g);
      var d1 = S.rect(bx1, by1, bw1 * p.days / maxDays, 14, 7, 'sc-blue', g);
      d1.style.transformBox = 'fill-box';
      d1.style.transformOrigin = 'left center';
      S.text(tall ? bx2 : bx2, (tall ? by2 : by1) - 6 + (tall ? 0 : 40), S.t(T.salary) + ' · ' + m(p.sal).replace('.00', ''), { size: 12.5, family: 'mono', cls: 'sc-fg3', parent: g });
      var sy2 = tall ? by2 : by1 + 40;
      var sx2 = tall ? bx2 : bx1;
      if (!tall) {
        g.lastChild.setAttribute('x', bx1);
      }
      S.rect(sx2, sy2, bw1, 14, 7, 'sc-bg3', g);
      var s2r = S.rect(sx2, sy2, bw1 * p.sal / maxSal, 14, 7, 'sc-gold', g);
      s2r.style.transformBox = 'fill-box';
      s2r.style.transformOrigin = 'left center';
      var capMark = null;
      if (p.sal > p.cap) {
        capMark = S.g(null, g);
        var cx = sx2 + bw1 * p.cap / maxSal;
        S.rect(cx, sy2 - 4, bw1 * (p.sal - p.cap) / maxSal, 22, 5, 'sc-soft-acc', capMark);
        S.line(cx, sy2 - 8, cx, sy2 + 22, 'sc-wire-err', capMark);
        capMark.style.opacity = 0;
      }
      var amtX = top.x + top.w - 20;
      var aD = S.text(amtX, tall ? y + 62 : y + 42, '0.00', { size: 15, family: 'mono', cls: 'sc-blue', anchor: 'end', parent: g });
      var aS = S.text(amtX, tall ? y + 110 : y + 82, '0.00', { size: 15, family: 'mono', cls: 'sc-gold', anchor: 'end', parent: g });
      return { g: g, d1: d1, s2r: s2r, capMark: capMark, aD: aD, aS: aS, p: p, cx: cx, sx2: sx2, bw1: bw1 };
    });
    tl.from(poolG, { opacity: 0, y: 12, duration: 0.45 }, '<0.15');
    tl.from(halves, { opacity: 0, y: 12, stagger: 0.12, duration: 0.4 }, '+=0.1');
    tl.from(capC.g, { opacity: 0, duration: 0.3 }, '+=0.1');
    tl.from(rows.map(function (r) { return r.g; }), { opacity: 0, y: 12, stagger: 0.1, duration: 0.4 }, '+=0.1');
    tl.from(rows.map(function (r) { return r.d1; }), { scaleX: 0, stagger: 0.1, duration: 0.6 }, '<0.2');
    tl.from(rows.map(function (r) { return r.s2r; }), { scaleX: 0, stagger: 0.1, duration: 0.6 }, '<0.2');
    rows.forEach(function (r) {
      if (r.capMark) {
        tl.to(r.capMark, { opacity: 1, duration: 0.25 }, '+=0.1');
        tl.to(r.s2r, { attr: { width: r.bw1 * r.p.cap / maxSal }, duration: 0.45, ease: 'power3.inOut' });
        tl.to(r.capMark, { opacity: 0.35, duration: 0.3 }, '<0.2');
      }
    });
    rows.forEach(function (r, i) {
      S.counter(tl, r.aD, 0, r.p.byD, { fmt: function (v) { return m(v); }, duration: 0.6 }, i ? '<0.1' : '+=0.1');
      S.counter(tl, r.aS, 0, r.p.byS, { fmt: function (v) { return m(v); }, duration: 0.6 }, '<');
    });
    S.hold(tl, 1.6);

    S.hideSlide(tl, s3);
    S.chapter(tl, 3);
    S.cap(tl, T.c4);
    S.showSlide(tl, s4, '<0.3');
    var bx = tall ? { x: 30, y: 96, w: W - 60 } : { x: 70, y: 100, w: 560 };
    var calc = S.g(null, s4);
    S.rect(bx.x, bx.y, bx.w, tall ? 300 : 330, 16, 'sc-card', calc);
    var lines = [
      [T.sum, '$119,999.99', 'sc-fg'],
      [T.diff, '+$0.01', 'sc-gold'],
      [T.toTop, 'Ana · $51,061.52', 'sc-ok']
    ];
    var lEls = lines.map(function (l, i) {
      var y = bx.y + 54 + i * (tall ? 62 : 70);
      var g = S.g(null, calc);
      S.text(bx.x + 24, y, l[0], { size: tall ? 14 : 15, family: 'mono', cls: 'sc-fg3', parent: g });
      S.text(bx.x + bx.w - 24, y + (tall ? 28 : 0), l[1], { size: tall ? 20 : 22, family: 'mono', weight: 600, anchor: 'end', cls: l[2], parent: g });
      g.style.opacity = 0;
      return g;
    });
    var gd = S.chip(bx.x + 24, bx.y + (tall ? 232 : 250), T.guard, { size: tall ? 12.5 : 14, cls: 'sc-card-ok', tcls: 'sc-ok', weight: 600, parent: calc });
    gd.g.style.opacity = 0;
    var sl = tall ? { x: 30, y: bx.y + 330, w: W - 60 } : { x: bx.x + bx.w + 40, y: 100, w: W - 70 - (bx.x + bx.w + 40) };
    var totals = [51061.52, 42261.90, 26676.58];
    var slips = P.map(function (p, i) {
      var y = sl.y + i * (tall ? 120 : 110);
      var g = S.g(null, s4);
      S.rect(sl.x, y, sl.w, tall ? 104 : 96, 14, 'sc-card', g);
      S.text(sl.x + 22, y + 36, T.slip, { size: 13, family: 'mono', cls: 'sc-fg3', ls: 1.5, parent: g });
      S.text(sl.x + 22, y + 70, p.n, { size: 20, weight: 600, parent: g });
      S.text(sl.x + sl.w - 22, y + 70, m(totals[i]), { size: 20, family: 'mono', weight: 600, anchor: 'end', cls: 'sc-ok', parent: g });
      var ck = S.check(sl.x + sl.w - 36, y + 30, 13, true, g);
      g.style.opacity = 0;
      return g;
    });
    var sent = S.chip(sl.x + sl.w / 2, sl.y + 3 * (tall ? 120 : 110) + 8, T.sent, { size: 15, anchor: 'middle', cls: 'sc-card-ok', tcls: 'sc-ok', weight: 600, parent: s4 });
    sent.g.style.opacity = 0;
    tl.from(calc, { opacity: 0, y: 12, duration: 0.4 }, '<0.15');
    lEls.forEach(function (e, i) { tl.to(e, { opacity: 1, duration: 0.3 }, '+=' + (i ? 0.35 : 0.2)); });
    tl.fromTo(gd.g, { opacity: 0, scale: 0.8, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '+=0.3');
    tl.to(slips, { opacity: 1, stagger: 0.2, duration: 0.35 }, '+=0.3');
    tl.fromTo(sent.g, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, '+=0.1');
    S.hold(tl, 2.4);
    return tl;
  }

  window.Scenes = window.Scenes || {};
  window.Scenes.ptu = {
    title: T.title,
    chapters: T.ch,
    poster: 0.11,
    captions: [T.c1, T.c2, T.c3, T.c4],
    wide: { w: 1280, h: 720 },
    tall: { w: 720, h: 920 },
    build: build
  };
})();
