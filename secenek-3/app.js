/* GoldPay — Seçenek 3 "Cüzdan" · küçük vanilla JS (prototip) */
(function () {
  'use strict';
  var $ = function (s, k) { return (k || document).querySelector(s); };
  var $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };
  var azalt = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- sayı biçimi ---------- */
  function tl(n, ondalik) {
    ondalik = ondalik == null ? 0 : ondalik;
    var s = n.toFixed(ondalik);
    var p = s.split('.');
    p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return p.length > 1 ? p[0] + ',' + p[1] : p[0];
  }
  window.gpTL = tl;

  /* ---------- bottom sheet (menü + filtre) ---------- */
  var acikSheet = null, sonOdak = null;
  function sheetAc(id, tetik) {
    var sh = document.getElementById(id);
    if (!sh) return;
    sonOdak = tetik || document.activeElement;
    acikSheet = sh;
    sh.classList.add('acik');
    sh.removeAttribute('inert');
    document.body.classList.add('sheet-acik');
    if (id === 'menu') document.body.classList.add('menu-acik');
    $$('[aria-controls="' + id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
    var ilk = $('.tutmac', sh) || sh;
    setTimeout(function () { ilk.focus && ilk.focus({ preventScroll: true }); }, azalt ? 0 : 380);
  }
  function sheetKapat() {
    if (!acikSheet) return;
    var sh = acikSheet; acikSheet = null;
    sh.classList.remove('acik');
    sh.setAttribute('inert', '');
    document.body.classList.remove('sheet-acik', 'menu-acik');
    $$('[aria-controls="' + sh.id + '"]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (sonOdak && sonOdak.focus) sonOdak.focus({ preventScroll: true });
  }
  $$('.sheet').forEach(function (sh) { sh.setAttribute('inert', ''); });
  document.addEventListener('click', function (e) {
    var ac = e.target.closest('[data-sheet]');
    if (ac) { e.preventDefault(); acikSheet ? sheetKapat() : sheetAc(ac.getAttribute('data-sheet'), ac); return; }
    if (e.target.closest('[data-kapat]') || e.target.closest('.perde')) { sheetKapat(); return; }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') sheetKapat(); });
  // tutmaç: aşağı sürükleme hissi
  $$('.tutmac').forEach(function (t) {
    var y0 = null;
    t.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientY; }, { passive: true });
    t.addEventListener('touchend', function (e) { if (y0 !== null && e.changedTouches[0].clientY - y0 > 40) sheetKapat(); y0 = null; });
  });

  /* ---------- menü: kategori kutucukları → alt kategori çipleri ---------- */
  $$('.kat-izgara .kat').forEach(function (k) {
    k.addEventListener('click', function () {
      var hedef = document.getElementById(k.getAttribute('aria-controls'));
      var acikti = k.getAttribute('aria-expanded') === 'true';
      $$('.kat', k.parentNode).forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
      $$('.altkat', k.parentNode).forEach(function (x) { x.hidden = true; });
      if (!acikti && hedef) {
        k.setAttribute('aria-expanded', 'true');
        hedef.hidden = false;
        if (!azalt && hedef.scrollIntoView) hedef.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else if (!hedef && k.getAttribute('href')) {
        location.href = k.getAttribute('href');
      }
    });
  });

  /* ---------- canlı fiyat ---------- */
  var F = { has: 7347, hasAlis: 7298, gumus: 106.50, gumusAlis: 105.80, ceyrek: 12448, yarim: 23707, tam: 47280, usd: 49.35, eur: 55.27, ons: 4870 };
  var D = { has: 1.65, gumus: 2.10, usd: 0.04, eur: 0.11, ons: 1.22, ceyrek: 1.58 };
  var gramFiyat = { '1': 7347, '2.5': 18380, '5': 36720, '10': 73360, '20': 146540, '50': 368500, '100': 735600, '250': 1833000 };
  window.gpF = F; window.gpGram = gramFiyat;

  function bas(k, deger, ond) {
    $$('[data-canli="' + k + '"]').forEach(function (el) {
      var o = el.hasAttribute('data-ond') ? +el.getAttribute('data-ond') : ond;
      el.textContent = tl(deger, o);
    });
  }
  function degisimBas(k) {
    $$('[data-degisim="' + k + '"]').forEach(function (el) {
      var v = D[k];
      el.classList.toggle('yukari', v >= 0); el.classList.toggle('asagi', v < 0);
      el.innerHTML = '<i class="ok"></i>%' + tl(Math.abs(v), 2);
    });
  }
  function hepsiniBas() {
    bas('has', F.has, 0); bas('hasAlis', F.hasAlis, 0);
    bas('gumus', F.gumus, 2); bas('gumusAlis', F.gumusAlis, 2);
    bas('ceyrek', F.ceyrek, 0); bas('yarim', F.yarim, 0); bas('tam', F.tam, 0);
    bas('usd', F.usd, 2); bas('eur', F.eur, 2); bas('ons', F.ons, 0);
    Object.keys(D).forEach(degisimBas);
    $$('[data-gram]').forEach(function (el) {
      var g = el.getAttribute('data-gram'); var taban = gramFiyat[g] || 0;
      var oran = F.has / 7347; var v = taban * oran;
      if (el.hasAttribute('data-kart')) v = v * 1.035;
      el.textContent = tl(Math.round(v), 0);
    });
    $$('[data-portfoy]').forEach(function (el) { el.textContent = tl(Math.round(12.5 * F.has), 0); });
  }
  function oynat() {
    var r = function (a) { return (Math.random() - 0.48) * a; };
    F.has = +(F.has + r(6)).toFixed(0); F.hasAlis = F.has - 49;
    F.gumus = +(F.gumus + r(0.12)).toFixed(2); F.gumusAlis = +(F.gumus - 0.70).toFixed(2);
    F.ceyrek = Math.round(F.has * 1.6943); F.yarim = Math.round(F.has * 3.227); F.tam = Math.round(F.has * 6.435);
    F.usd = +(F.usd + r(0.02)).toFixed(2); F.eur = +(F.eur + r(0.02)).toFixed(2); F.ons = Math.round(F.ons + r(4));
    D.has = +(D.has + r(0.04)).toFixed(2); D.gumus = +(D.gumus + r(0.05)).toFixed(2); D.usd = +(D.usd + r(0.02)).toFixed(2);
    D.ceyrek = D.has - 0.07; D.ons = +(D.ons + r(0.03)).toFixed(2);
    hepsiniBas();
    var t = $('[data-saat]'); if (t) { var d = new Date(); t.textContent = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
  }
  hepsiniBas();
  if ($('[data-canli]') || $('[data-gram]')) setInterval(oynat, 4000);

  /* ---------- aria-pressed çip grupları ---------- */
  $$('[data-grup]').forEach(function (grup) {
    grup.addEventListener('click', function (e) {
      var b = e.target.closest('button[aria-pressed]'); if (!b) return;
      $$('button[aria-pressed]', grup).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      grup.dispatchEvent(new CustomEvent('secim', { detail: b }));
    });
  });

  /* ---------- birikim planlayıcı ---------- */
  $$('[data-planlayici]').forEach(function (p) {
    var aylik = 2.5, ay = 12;
    function hesapla() {
      var gram = aylik * ay; var tutar = Math.round(gram * F.has / 10) * 10;
      var g = $('[data-plan-gram]', p), t = $('[data-plan-tl]', p), a = $('[data-plan-ay]', p);
      if (g) g.textContent = tl(gram, gram % 1 ? 1 : 0); if (t) t.textContent = tl(tutar, 0); if (a) a.textContent = ay;
    }
    var gg = $('[data-grup="gram"]', p), ga = $('[data-grup="ay"]', p);
    if (gg) gg.addEventListener('secim', function (e) { aylik = +e.detail.getAttribute('data-deger'); hesapla(); });
    if (ga) ga.addEventListener('secim', function (e) { ay = +e.detail.getAttribute('data-deger'); hesapla(); });
    hesapla(); setInterval(hesapla, 4000);
  });

  /* ---------- geri sayım ("fiyat 03:48 sn geçerli") ---------- */
  $$('[data-sayac]').forEach(function (el) {
    var sn = +el.getAttribute('data-sayac') || 228; var baslangic = sn;
    function yaz() { el.textContent = ('0' + Math.floor(sn / 60)).slice(-2) + ':' + ('0' + (sn % 60)).slice(-2); }
    yaz();
    setInterval(function () { sn--; if (sn < 0) sn = baslangic === 228 ? 240 : baslangic; yaz(); }, 1000);
  });

  /* ---------- ürün: galeri, gramaj, adet ---------- */
  var galeri = $('.galeri');
  if (galeri) {
    $$('.kucukler button', galeri).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.kucukler button', galeri).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        var ana = $('.ana .foto img', galeri), src = b.getAttribute('data-src');
        if (ana && src) ana.src = src;
        var anaFoto = $('.ana .foto', galeri); if (anaFoto) anaFoto.setAttribute('data-ad', b.getAttribute('aria-label') || '');
      });
    });
  }
  var gramGrup = $('[data-grup="gramaj"]');
  if (gramGrup) {
    gramGrup.addEventListener('secim', function (e) {
      var g = e.detail.getAttribute('data-deger');
      $$('[data-secili-gram]').forEach(function (el) { el.setAttribute('data-gram', g); });
      $$('[data-gram-adi]').forEach(function (el) { el.textContent = g.replace('.', ',') + ' g'; });
      hepsiniBas();
    });
  }
  $$('.adet').forEach(function (a) {
    var out = $('output', a); if (!out) return;
    $$('button', a).forEach(function (b) {
      b.addEventListener('click', function () {
        var v = +out.value || +out.textContent || 1; v += b.getAttribute('data-adet') === '-' ? -1 : 1; if (v < 1) v = 1; if (v > 99) v = 99;
        out.value = v; out.textContent = v;
      });
    });
  });

  /* ---------- sekmeler (ödeme yöntemi, hesabım) ---------- */
  $$('.sekmeler').forEach(function (s) {
    s.addEventListener('click', function (e) {
      var b = e.target.closest('button[role="tab"]'); if (!b) return;
      $$('button[role="tab"]', s).forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
      b.setAttribute('aria-selected', 'true');
      var kap = s.parentNode;
      $$('.sekme', kap).forEach(function (p) { p.hidden = p.id !== b.getAttribute('aria-controls'); });
    });
  });

  /* ---------- anahtar (toggle) ---------- */
  $$('.anahtar').forEach(function (a) {
    a.addEventListener('click', function () {
      var v = a.getAttribute('aria-checked') === 'true'; a.setAttribute('aria-checked', v ? 'false' : 'true');
      var hedef = a.getAttribute('data-mesaj'); if (hedef) { var m = document.getElementById(hedef); if (m) m.classList.toggle('goster', !v); }
    });
  });

  /* ---------- formlar: gönderince mesaj göster (prototip) ---------- */
  $$('form[data-mesaj]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault(); var m = document.getElementById(f.getAttribute('data-mesaj')); if (m) { m.classList.add('goster'); m.focus && m.focus(); }
    });
  });
  $$('[data-tikla-mesaj]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault(); var m = document.getElementById(b.getAttribute('data-tikla-mesaj')); if (m) m.classList.add('goster');
      if (b.getAttribute('data-scroll') && m) m.scrollIntoView({ block: 'center', behavior: azalt ? 'auto' : 'smooth' });
    });
  });

  /* ---------- panel: marj → satış fiyatı ---------- */
  $$('.marj-tab').forEach(function (t) {
    function hesapla() {
      $$('tr[data-g]', t).forEach(function (tr) {
        var g = +tr.getAttribute('data-g'); var marj = +(($('input', tr).value || '0').replace(',', '.'));
        var kaynak = F.hasAlis * g; var satis = Math.round(kaynak * (1 + marj / 100) + (+tr.getAttribute('data-iscilik') || 0));
        var s = $('.sonuc', tr); if (s) s.textContent = tl(satis, 0) + ' TL';
        var k = $('.kaynak-fiyat', tr); if (k) k.textContent = tl(Math.round(kaynak), 0) + ' TL';
      });
    }
    t.addEventListener('input', hesapla); hesapla(); setInterval(hesapla, 4000);
  });

  /* ---------- SVG çizgi grafik ---------- */
  function seri(n, taban, genlik, tohum) {
    var s = tohum, v = [], y = taban;
    for (var i = 0; i < n; i++) { s = (s * 9301 + 49297) % 233280; y += (s / 233280 - 0.46) * genlik; v.push(y); }
    return v;
  }
  function cizGrafik(svg) {
    var n = +svg.getAttribute('data-n') || 48, taban = +svg.getAttribute('data-taban') || 7250, genlik = +svg.getAttribute('data-genlik') || 18, tohum = +svg.getAttribute('data-tohum') || 7;
    var tip = svg.getAttribute('data-tip') || 'cizgi';
    var W = 600, H = +svg.getAttribute('data-h') || 150, pad = 4;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('preserveAspectRatio', 'none');
    var v = seri(n, taban, genlik, tohum);
    var min = Math.min.apply(null, v), max = Math.max.apply(null, v);
    var renk = svg.getAttribute('data-renk') || '#E7D3A1';
    if (tip === 'cubuk') {
      var bw = W / n * 0.62, html = '';
      v.forEach(function (y, i) { var h = (y - min * 0.85) / (max - min * 0.85) * (H - pad * 2); var x = i * W / n + (W / n - bw) / 2; html += '<rect x="' + x.toFixed(1) + '" y="' + (H - pad - h).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="3" fill="' + renk + '" opacity="' + (i === n - 1 ? 1 : 0.55) + '"/>'; });
      svg.innerHTML = html; return;
    }
    var pts = v.map(function (y, i) { return (i * W / (n - 1)).toFixed(1) + ',' + (H - pad - (y - min) / (max - min || 1) * (H - pad * 2)).toFixed(1); });
    var son = pts[pts.length - 1].split(',');
    svg.innerHTML = '<polygon points="0,' + H + ' ' + pts.join(' ') + ' ' + W + ',' + H + '" fill="' + renk + '" opacity=".10"/>' +
      '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + renk + '" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>' +
      '<circle cx="' + son[0] + '" cy="' + son[1] + '" r="4" fill="' + renk + '" vector-effect="non-scaling-stroke"/>';
  }
  $$('svg[data-grafik]').forEach(cizGrafik);
  $$('.grafik-sec').forEach(function (g) {
    g.addEventListener('secim', function (e) {
      var svg = $('svg[data-grafik]', g.closest('.grafik-kart') || document); if (!svg) return;
      svg.setAttribute('data-tohum', e.detail.getAttribute('data-deger')); svg.setAttribute('data-genlik', e.detail.getAttribute('data-genlik') || 18); cizGrafik(svg);
    });
  });

  /* ---------- Ekranlar aracı: geçerli sayfa ---------- */
  var yol = location.pathname.split('/').pop() || 'index.html';
  $$('.ekranlar a').forEach(function (a) { if (a.getAttribute('href') === yol) a.setAttribute('aria-current', 'page'); });
})();
