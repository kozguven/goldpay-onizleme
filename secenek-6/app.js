/* GoldPay — Seçenek 6 "Gece & Gündüz" · küçük vanilla JS */
(function () {
  'use strict';
  var kok = document.documentElement;
  var body = document.body;
  var azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var params = new URLSearchParams(location.search);
  function bicim(n, d) {
    return n.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  /* ---------- Gece / Gündüz ---------- */
  function temaUygula(t, kaydet) {
    kok.setAttribute('data-tema', t);
    document.querySelectorAll('.tema-dugme').forEach(function (b) {
      b.setAttribute('aria-pressed', t === 'gece' ? 'true' : 'false');
      b.setAttribute('aria-label', t === 'gece' ? 'Gündüz temasına geç' : 'Gece temasına geç');
    });
    if (kaydet) { try { localStorage.setItem('gp6-tema', t); } catch (e) {} }
  }
  temaUygula(kok.getAttribute('data-tema') || 'gunduz', false);
  document.querySelectorAll('.tema-dugme').forEach(function (b) {
    b.addEventListener('click', function () {
      temaUygula(kok.getAttribute('data-tema') === 'gece' ? 'gunduz' : 'gece', true);
    });
  });

  /* ---------- Tam ekran görselli menü ---------- */
  var menu = document.getElementById('menu');
  var hamburgerler = document.querySelectorAll('[data-menu-ac]');
  var sonOdak = null;
  function menuAc() {
    if (!menu) return;
    sonOdak = document.activeElement;
    body.classList.add('menu-acik');
    menu.removeAttribute('inert');
    hamburgerler.forEach(function (h) { h.setAttribute('aria-expanded', 'true'); });
    var k = menu.querySelector('.menu-kapat');
    if (k) setTimeout(function () { k.focus(); }, 30);
  }
  function menuKapat() {
    if (!body.classList.contains('menu-acik')) return;
    body.classList.remove('menu-acik');
    menu.setAttribute('inert', '');
    hamburgerler.forEach(function (h) { h.setAttribute('aria-expanded', 'false'); });
    if (sonOdak && sonOdak.focus) sonOdak.focus();
  }
  hamburgerler.forEach(function (h) { h.addEventListener('click', menuAc); });
  document.querySelectorAll('.menu-kapat').forEach(function (k) { k.addEventListener('click', menuKapat); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { menuKapat(); filtreKapat(); }
  });

  function onizle(kapsam, i) {
    var figs = kapsam.querySelectorAll('.menu-onizleme figure');
    figs.forEach(function (f, j) { f.classList.toggle('aktif', j === i); });
  }
  document.querySelectorAll('.menu, .tel-menu').forEach(function (kapsam) {
    var satirlar = kapsam.querySelectorAll('.m-satir');
    satirlar.forEach(function (s, i) {
      s.addEventListener('click', function () {
        var acik = s.getAttribute('aria-expanded') === 'true';
        satirlar.forEach(function (x) {
          x.setAttribute('aria-expanded', 'false');
          var a = document.getElementById(x.getAttribute('aria-controls'));
          if (a) a.hidden = true;
        });
        if (!acik) {
          s.setAttribute('aria-expanded', 'true');
          var alt = document.getElementById(s.getAttribute('aria-controls'));
          if (alt) alt.hidden = false;
        }
        onizle(kapsam, i);
      });
      if (window.matchMedia('(hover:hover) and (min-width:900px)').matches) {
        s.addEventListener('mouseenter', function () { onizle(kapsam, i); });
        s.addEventListener('focus', function () { onizle(kapsam, i); });
      }
    });
  });
  if (menu) {
    if (params.get('menu') === '1') {
      menuAc();
      var kat = parseInt(params.get('kat') || '0', 10);
      var hedef = menu.querySelectorAll('.m-satir')[kat];
      if (hedef) hedef.click();
    } else {
      menu.setAttribute('inert', '');
    }
  }

  /* ---------- Canlı fiyat: 4 sn'de bir birkaç kuruş ---------- */
  var canli = document.querySelectorAll('[data-canli]');
  if (canli.length && !azHareket) {
    setInterval(function () {
      var oran = (Math.random() - 0.45) * 0.0009;
      canli.forEach(function (el) {
        var taban = parseFloat(el.getAttribute('data-deger'));
        var d = parseInt(el.getAttribute('data-ondalik') || '2', 10);
        var yeni = taban * (1 + oran);
        el.textContent = bicim(yeni, d);
      });
    }, 4000);
  }

  /* ---------- Geri sayım ---------- */
  document.querySelectorAll('[data-geri-sayim]').forEach(function (el) {
    var bas = parseInt(el.getAttribute('data-geri-sayim'), 10);
    var kalan = bas;
    function yaz() {
      var m = Math.floor(kalan / 60), s = kalan % 60;
      el.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }
    yaz();
    setInterval(function () { kalan = kalan > 0 ? kalan - 1 : bas; yaz(); }, 1000);
  });

  /* ---------- Basılı seçim grupları (gramaj, plan, çipler) ---------- */
  document.querySelectorAll('[data-tekli]').forEach(function (grup) {
    var dugmeler = grup.querySelectorAll('button');
    dugmeler.forEach(function (b) {
      b.addEventListener('click', function () {
        dugmeler.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        var h = b.getAttribute('data-havale');
        if (h) {
          var adet = parseInt((document.getElementById('adet') || { value: 1 }).value, 10) || 1;
          urunFiyat(parseFloat(h), adet, b.getAttribute('data-ad'));
        }
      });
    });
  });

  /* ---------- Ürün: gramaj → fiyat, adet ---------- */
  var gHavale = document.querySelector('[data-urun-havale]');
  var gKart = document.querySelector('[data-urun-kart]');
  function urunFiyat(birim, adet, ad) {
    if (!gHavale) return;
    gHavale.textContent = bicim(Math.round(birim * adet), 0);
    if (gKart) gKart.textContent = bicim(Math.round(birim * adet * 1.035), 0);
    var baslik = document.querySelector('[data-urun-ad]');
    if (baslik && ad) baslik.textContent = 'GoldPay ' + ad + ' Külçe Altın 999.9';
    var sec = document.querySelector('[data-secili-gram]');
    if (sec && ad) sec.textContent = ad;
  }
  var adetEl = document.getElementById('adet');
  if (adetEl) {
    document.querySelectorAll('[data-adet]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = Math.max(1, Math.min(20, (parseInt(adetEl.value, 10) || 1) + parseInt(b.getAttribute('data-adet'), 10)));
        adetEl.value = v;
        var secili = document.querySelector('.gramaj [aria-pressed="true"]');
        if (secili) urunFiyat(parseFloat(secili.getAttribute('data-havale')), v);
      });
    });
  }

  /* ---------- Galeri ---------- */
  document.querySelectorAll('.galeri').forEach(function (g) {
    var buyuk = g.querySelectorAll('.galeri-ana img');
    var kucuk = g.querySelectorAll('.galeri-kucuk button');
    kucuk.forEach(function (b, i) {
      b.addEventListener('click', function () {
        kucuk.forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        buyuk.forEach(function (im, j) { im.classList.toggle('aktif', i === j); });
      });
    });
  });

  /* ---------- Sekmeler ---------- */
  document.querySelectorAll('[role="tablist"]').forEach(function (liste) {
    var sekmeler = liste.querySelectorAll('[role="tab"]');
    sekmeler.forEach(function (s) {
      s.addEventListener('click', function () {
        sekmeler.forEach(function (x) {
          x.setAttribute('aria-selected', 'false');
          var p = document.getElementById(x.getAttribute('aria-controls'));
          if (p) p.hidden = true;
        });
        s.setAttribute('aria-selected', 'true');
        var p = document.getElementById(s.getAttribute('aria-controls'));
        if (p) p.hidden = false;
      });
    });
  });

  /* ---------- Kategori filtreleri ---------- */
  var kartlar = document.querySelectorAll('[data-gram]');
  var sonucSay = document.querySelector('[data-sonuc]');
  function filtrele() {
    var gramlar = [], saflik = [];
    document.querySelectorAll('[data-f-gram][aria-pressed="true"]').forEach(function (b) { gramlar.push(b.getAttribute('data-f-gram')); });
    document.querySelectorAll('[data-f-saflik][aria-pressed="true"]').forEach(function (b) { saflik.push(b.getAttribute('data-f-saflik')); });
    var n = 0;
    kartlar.forEach(function (k) {
      var g = gramlar.length === 0 || gramlar.indexOf(k.getAttribute('data-gram')) > -1;
      var s = saflik.length === 0 || saflik.indexOf(k.getAttribute('data-saflik')) > -1;
      k.hidden = !(g && s);
      if (g && s) n++;
    });
    if (sonucSay) sonucSay.textContent = n;
  }
  document.querySelectorAll('[data-f-gram],[data-f-saflik]').forEach(function (b) {
    b.addEventListener('click', function () {
      var anahtar = b.hasAttribute('data-f-gram') ? 'data-f-gram' : 'data-f-saflik';
      var deger = b.getAttribute(anahtar);
      var yeni = b.getAttribute('aria-pressed') !== 'true';
      document.querySelectorAll('[' + anahtar + '="' + deger + '"]').forEach(function (x) { x.setAttribute('aria-pressed', yeni ? 'true' : 'false'); });
      filtrele();
    });
  });
  var sirala = document.getElementById('sirala');
  if (sirala) {
    sirala.addEventListener('change', function () {
      var kap = document.querySelector('.urunler');
      var dizi = Array.prototype.slice.call(kap.children);
      dizi.sort(function (a, b) {
        var fa = parseFloat(a.getAttribute('data-fiyat')), fb = parseFloat(b.getAttribute('data-fiyat'));
        return sirala.value === 'azalan' ? fb - fa : fa - fb;
      });
      dizi.forEach(function (d) { kap.appendChild(d); });
    });
  }
  var altPanel = document.getElementById('filtrePanel');
  var ortu = document.querySelector('.ortu');
  function filtreKapat() {
    if (!altPanel) return;
    altPanel.classList.remove('acik');
    if (ortu) ortu.classList.remove('acik');
    document.querySelectorAll('[data-filtre-ac]').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
  }
  document.querySelectorAll('[data-filtre-ac]').forEach(function (b) {
    b.addEventListener('click', function () {
      altPanel.classList.add('acik');
      if (ortu) ortu.classList.add('acik');
      b.setAttribute('aria-expanded', 'true');
    });
  });
  document.querySelectorAll('[data-filtre-kapat]').forEach(function (b) { b.addEventListener('click', filtreKapat); });
  if (ortu) ortu.addEventListener('click', filtreKapat);

  /* ---------- Sepete ekle geri bildirimi ---------- */
  var sepetAdet = document.querySelectorAll('.sepet-adet');
  document.querySelectorAll('[data-sepete]').forEach(function (b) {
    b.addEventListener('click', function () {
      var eski = b.textContent;
      sepetAdet.forEach(function (s) { s.textContent = (parseInt(s.textContent, 10) || 0) + 1; });
      b.textContent = 'Sepete eklendi';
      setTimeout(function () { b.textContent = eski; }, 1600);
    });
  });

  /* ---------- Panel: fiyatları dondur ---------- */
  var dondur = document.getElementById('dondur');
  if (dondur) {
    dondur.addEventListener('change', function () {
      var d = document.querySelector('[data-dondur-durum]');
      if (d) d.textContent = dondur.checked ? 'Fiyatlar donduruldu, 14:32 fiyatı geçerli' : 'Canlı, her 4 dakikada bir';
    });
  }
})();
