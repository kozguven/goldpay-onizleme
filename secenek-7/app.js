/* GoldPay — Final tasarım "Platin Cüzdan" · küçük vanilla JS */
(function () {
  'use strict';
  var az = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;
  function $(s, k) { return (k || document).querySelector(s); }
  function $$(s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); }
  function tr(n, d) { return n.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d }); }

  /* ---------- Mobil menü ---------- */
  var mm = $('#mm');
  var acanlar = $$('[data-menu-ac]');
  var sonOdak = null;
  function seviyeleriKapat() {
    $$('.mm-seviye.acik').forEach(function (s) { s.classList.remove('acik'); s.setAttribute('aria-hidden', 'true'); });
    $$('[data-seviye]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }
  function menuAc(odak) {
    if (!mm) return;
    body.classList.add('menu-acik');
    mm.setAttribute('aria-hidden', 'false');
    acanlar.forEach(function (h) { h.setAttribute('aria-expanded', 'true'); });
    sonOdak = document.activeElement;
    if (odak !== false) setTimeout(function () { var k = $('[data-menu-kapat]', mm); if (k) k.focus(); }, 60);
  }
  function menuKapat() {
    if (!body.classList.contains('menu-acik')) return;
    body.classList.remove('menu-acik');
    mm.setAttribute('aria-hidden', 'true');
    acanlar.forEach(function (h) { h.setAttribute('aria-expanded', 'false'); });
    seviyeleriKapat();
    if (sonOdak && sonOdak.focus) sonOdak.focus();
  }
  function seviyeAc(id, odak) {
    var s = document.getElementById('sv-' + id);
    if (!s) return;
    s.classList.add('acik');
    s.setAttribute('aria-hidden', 'false');
    s.scrollTop = 0;
    var b = $('[data-seviye="' + id + '"]', mm);
    if (b) b.setAttribute('aria-expanded', 'true');
    if (odak !== false) setTimeout(function () { var g = $('.geri', s); if (g) g.focus(); }, az ? 0 : 300);
  }
  acanlar.forEach(function (h) {
    h.addEventListener('click', function () { body.classList.contains('menu-acik') ? menuKapat() : menuAc(true); });
  });
  $$('[data-menu-kapat]').forEach(function (k) { k.addEventListener('click', menuKapat); });
  $$('[data-seviye]').forEach(function (b) {
    b.addEventListener('click', function () { seviyeAc(b.getAttribute('data-seviye')); });
  });
  $$('.mm-seviye .geri').forEach(function (g) {
    g.addEventListener('click', function () {
      var s = g.closest('.mm-seviye');
      var id = s.id.replace('sv-', '');
      s.classList.remove('acik');
      s.setAttribute('aria-hidden', 'true');
      var b = $('[data-seviye="' + id + '"]', mm);
      if (b) { b.setAttribute('aria-expanded', 'false'); b.focus(); }
    });
  });

  /* ---------- Mega menü ---------- */
  var megaBtn = $('.nav-urunler'), mega = $('#mega');
  function megaKapat() { if (mega) { mega.classList.remove('acik'); megaBtn.setAttribute('aria-expanded', 'false'); } }
  if (megaBtn && mega) {
    megaBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var acik = mega.classList.toggle('acik');
      megaBtn.setAttribute('aria-expanded', acik ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) { if (!mega.contains(e.target)) megaKapat(); });
  }

  /* ---------- Ekranlar ---------- */
  var ekr = $('.ekranlar');
  if (ekr) {
    var eb = $('button', ekr);
    eb.addEventListener('click', function (e) {
      e.stopPropagation();
      var acik = ekr.classList.toggle('acik');
      eb.setAttribute('aria-expanded', acik ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) { if (!ekr.contains(e.target)) { ekr.classList.remove('acik'); eb.setAttribute('aria-expanded', 'false'); } });
  }

  /* ---------- Filtre paneli (telefonda alttan) ---------- */
  function filtreKapat() { body.classList.remove('filtre-acik'); }
  $$('[data-filtre-ac]').forEach(function (b) { b.addEventListener('click', function () { body.classList.add('filtre-acik'); var k = $('[data-filtre-kapat]'); if (k) k.focus(); }); });
  $$('[data-filtre-kapat]').forEach(function (b) { b.addEventListener('click', filtreKapat); });

  /* ---------- Alttan açılan sayfa: sipariş özeti ---------- */
  var sheetOdak = null;
  function sheetKapat() {
    if (!body.classList.contains('sheet-acik')) return;
    body.classList.remove('sheet-acik');
    $$('[data-sheet-ac]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    if (sheetOdak && sheetOdak.focus) sheetOdak.focus();
  }
  $$('[data-sheet-ac]').forEach(function (b) {
    b.addEventListener('click', function () {
      sheetOdak = b;
      body.classList.add('sheet-acik');
      b.setAttribute('aria-expanded', 'true');
      var k = $('#' + b.getAttribute('data-sheet-ac') + ' [data-sheet-kapat]'); if (k) setTimeout(function () { k.focus(); }, 60);
    });
  });
  $$('[data-sheet-kapat]').forEach(function (b) { b.addEventListener('click', sheetKapat); });

  /* tutmaç: aşağı kaydırınca kapat */
  function surukleKapat(tutamak, kapat) {
    var y0 = null;
    tutamak.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientY; }, { passive: true });
    tutamak.addEventListener('touchend', function (e) { if (y0 !== null && e.changedTouches[0].clientY - y0 > 40) kapat(); y0 = null; });
  }
  $$('.mm .tutmac, .mm-ust').forEach(function (t) { surukleKapat(t, menuKapat); });
  $$('.filtre-panel .tutmac-cizgi, .filtre-bas').forEach(function (t) { surukleKapat(t, filtreKapat); });
  $$('.ozet-kart .tutmac-cizgi, .ozet-kart .sheet-bas').forEach(function (t) { surukleKapat(t, sheetKapat); });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    sheetKapat();
    if ($('.mm-seviye.acik')) { var g = $('.mm-seviye.acik .geri'); if (g) g.click(); return; }
    menuKapat(); megaKapat(); filtreKapat();
    if (ekr) ekr.classList.remove('acik');
  });

  /* URL ile açık hâl: ?menu=1 (menü), ?menu=altin (alt seviye), ?filtre=1 */
  var q = new URLSearchParams(location.search);
  if (q.get('menu')) {
    menuAc(false);
    if (q.get('menu') !== '1') seviyeAc(q.get('menu'), false);
  }
  if (q.get('filtre')) body.classList.add('filtre-acik');
  if (q.get('sheet')) body.classList.add('sheet-acik');
  if (q.get('mega') && mega) { mega.classList.add('acik'); megaBtn.setAttribute('aria-expanded', 'true'); }

  /* ---------- Canlı fiyat ---------- */
  var kayma = { altin: 0, gumus: 0, usd: 0, eur: 0, ons: 0 };
  var yon = {};
  var canlilar = $$('[data-canli]').map(function (e) {
    return { e: e, f: e.getAttribute('data-canli'), v: parseFloat(e.getAttribute('data-deger')), d: parseInt(e.getAttribute('data-ondalik') || '2', 10) };
  });
  if (canlilar.length) {
    setInterval(function () {
      Object.keys(kayma).forEach(function (k) {
        var adim = (Math.random() - 0.45) * 0.0006;
        kayma[k] = Math.max(-0.003, Math.min(0.003, kayma[k] + adim));
        yon[k] = adim >= 0 ? 'flas-y' : 'flas-a';
      });
      canlilar.forEach(function (c) {
        if (!(c.f in kayma)) return;
        c.e.textContent = tr(c.v * (1 + kayma[c.f]), c.d);
        if (!az) { c.e.classList.remove('flas-y', 'flas-a'); void c.e.offsetWidth; c.e.classList.add(yon[c.f]); }
      });
    }, 4000);
  }

  /* ---------- Geri sayım ---------- */
  $$('[data-geri-sayim]').forEach(function (e) {
    var t = parseInt(e.getAttribute('data-geri-sayim'), 10), bas = t;
    setInterval(function () {
      t = t > 0 ? t - 1 : bas;
      e.textContent = String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
    }, 1000);
  });

  /* ---------- Grafik dönemi ---------- */
  $$('[data-grafik-sec]').forEach(function (grup) {
    var hedef = document.getElementById(grup.getAttribute('data-grafik-sec'));
    $$('button', grup).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', grup).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        if (!hedef) return;
        $('.cizgi-yol', hedef).setAttribute('d', b.getAttribute('data-yol'));
        $('.alan-yol', hedef).setAttribute('d', b.getAttribute('data-alan'));
        var n = $('.son-nokta', hedef); var p = b.getAttribute('data-son').split(',');
        n.setAttribute('cx', p[0]); n.setAttribute('cy', p[1]);
        var ek = hedef.parentNode.querySelector('.eksen');
        if (ek) ek.innerHTML = b.getAttribute('data-eksen');
      });
    });
  });

  /* ---------- Birikim hesaplayıcı ---------- */
  var hs = $('#hesaplayici');
  if (hs) {
    var GRAM = 7347;
    var hesapla = function () {
      var aylik = parseFloat($('input[name="aylik"]:checked', hs).value);
      var ay = parseInt($('input[name="sure"]:checked', hs).value, 10);
      var top = aylik * ay;
      $('#h-gram', hs).textContent = tr(top, 1);
      $('#h-ay', hs).textContent = ay;
      $('#h-deger', hs).textContent = tr(Math.round(top * GRAM), 0) + ' TL';
      $('#h-aylik', hs).textContent = tr(Math.round(aylik * GRAM), 0) + ' TL';
      var bas = $('#h-basamak', hs), html = '';
      for (var i = 1; i <= ay; i++) html += '<i style="height:' + Math.max(6, Math.round(100 * i / ay)) + '%"></i>';
      bas.innerHTML = html;
    };
    $$('input', hs).forEach(function (i) { i.addEventListener('change', hesapla); });
    hesapla();
  }

  /* ---------- Ürün: gramaj seçimi → işlem fişi ---------- */
  var fis = $('#fis');
  if (fis) {
    var HAS = 7298, adet = 1, secili = $('.gram-sec [aria-pressed="true"]');
    var guncelle = function () {
      var g = parseFloat(secili.getAttribute('data-gram'));
      var f = parseFloat(secili.getAttribute('data-fiyat'));
      var has = g * HAS, isc = f - has;
      $('#f-urun').textContent = secili.getAttribute('data-ad');
      $('#f-gram-et').textContent = tr(g, g % 1 ? 1 : 0) + ' g × ' + tr(HAS, 2);
      $('#f-has').textContent = tr(has, 2) + ' TL';
      $('#f-isc').textContent = tr(isc, 2) + ' TL';
      $('#f-adet').textContent = '× ' + adet;
      $('#f-top').textContent = tr(f * adet, 2);
      var m = $('#f-top-m'); if (m) m.textContent = tr(f * adet, 2);
      $('#f-kart').textContent = tr(f * adet * 1.035, 2) + ' TL';
      var b = $('#urun-baslik'); if (b) b.textContent = 'GoldPay ' + tr(g, g % 1 ? 1 : 0) + ' Gr Külçe Altın 999.9';
      var r = $('#rozet-gram'); if (r) r.textContent = tr(g, g % 1 ? 1 : 0) + ' g';
    };
    $$('.gram-sec button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.gram-sec button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true'); secili = b; guncelle();
      });
    });
    $$('[data-adet]').forEach(function (b) {
      b.addEventListener('click', function () {
        adet = Math.max(1, Math.min(20, adet + parseInt(b.getAttribute('data-adet'), 10)));
        $('#adet-deger').textContent = adet; guncelle();
      });
    });
    guncelle();
  }

  /* ---------- Sepet adet ---------- */
  $$('.adet.kucuk').forEach(function (a) {
    var o = $('output', a);
    $$('button', a).forEach(function (b) {
      b.addEventListener('click', function () {
        var n = Math.max(1, Math.min(20, parseInt(o.textContent, 10) + (b.textContent.trim() === '+' ? 1 : -1)));
        o.textContent = n;
      });
    });
  });

  /* ---------- Galeri ---------- */
  var ana = $('#galeri-ana');
  $$('.galeri-kucuk button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('.galeri-kucuk button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      var im = $('img', b);
      ana.src = im.src; ana.alt = im.alt; ana.classList.remove('yok');
    });
  });

  /* ---------- Sekmeler ---------- */
  $$('[role="tablist"]').forEach(function (tl) {
    var sek = $$('[role="tab"]', tl);
    sek.forEach(function (t) {
      t.addEventListener('click', function () {
        sek.forEach(function (x) {
          x.setAttribute('aria-selected', x === t ? 'true' : 'false');
          var p = document.getElementById(x.getAttribute('aria-controls'));
          if (p) p.hidden = x !== t;
        });
      });
    });
  });

  /* ---------- Kategori filtresi ---------- */
  var izgara = $('#urunler');
  if (izgara) {
    var gramF = 'hepsi';
    var filtrele = function () {
      var saf = $$('input[name="saflik"]:checked').map(function (i) { return i.value; });
      var n = 0;
      $$('.urun-kart', izgara).forEach(function (k) {
        var ok = (gramF === 'hepsi' || k.getAttribute('data-gram') === gramF) && (saf.length === 0 || saf.indexOf(k.getAttribute('data-saflik')) > -1);
        k.hidden = !ok; if (ok) n++;
      });
      $$('[data-sonuc-say]').forEach(function (e) { e.textContent = n; });
    };
    $$('.gram-cipler button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.gram-cipler button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true'); gramF = b.getAttribute('data-gram'); filtrele();
      });
    });
    $$('input[name="saflik"]').forEach(function (i) { i.addEventListener('change', filtrele); });
    var sir = $('#siralama');
    if (sir) sir.addEventListener('change', function () {
      var kartlar = $$('.urun-kart', izgara);
      kartlar.sort(function (a, b) {
        var x = parseFloat(a.getAttribute('data-fiyat')), y = parseFloat(b.getAttribute('data-fiyat'));
        return sir.value === 'azalan' ? y - x : x - y;
      }).forEach(function (k) { izgara.appendChild(k); });
    });
  }

  /* ---------- Fiyat alarmı ---------- */
  var af = $('#alarm-form');
  if (af) af.addEventListener('submit', function (e) {
    e.preventDefault();
    var s = $('#alarm-sonuc');
    $('#alarm-metin').textContent = 'Alarm kuruldu: ' + $('#alarm-urun').value.toLowerCase() + ' ' + $('#alarm-fiyat').value + ' TL ' + ($('#alarm-kosul').value === 'alt' ? 'altına düşünce' : 'üstüne çıkınca') + ' SMS ile haber vereceğiz.';
    s.classList.add('goster');
  });

  /* ---------- Panel: marj → satış, dondur ---------- */
  $$('.marj-tablo tr[data-has]').forEach(function (tr_) {
    var inp = $('input', tr_), out = $('.satis', tr_), has = parseFloat(tr_.getAttribute('data-has'));
    inp.addEventListener('input', function () {
      var v = parseFloat(inp.value.replace(/\./g, '').replace(',', '.')) || 0;
      out.textContent = tr(has + v, 0);
    });
  });
  var dn = $('#dondur');
  if (dn) dn.addEventListener('change', function () { $('#dondur-not').classList.toggle('goster', dn.checked); });
  $$('.filtre-sekme').forEach(function (fs) {
    $$('button', fs).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', fs).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        var d = b.getAttribute('data-durum');
        $$('#kuyruk tbody tr').forEach(function (r) { r.hidden = d !== 'hepsi' && r.getAttribute('data-durum') !== d; });
      });
    });
  });
})();
