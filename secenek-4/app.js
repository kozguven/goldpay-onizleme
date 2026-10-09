/* GoldPay — Seçenek 4 "Mühür" · küçük vanilla JS */
(function () {
  'use strict';
  var azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;
  var $$ = function (s, k) { return Array.prototype.slice.call((k || document).querySelectorAll(s)); };

  function bicimle(n, d) {
    return n.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  /* ---------- Mobil menü: bordo panel ---------- */
  var panel = document.getElementById('menuPanel');
  var hamburgerler = $$('.hamburger');
  var sonOdak = null;
  function menuAc() {
    if (!panel) return;
    body.classList.add('menu-acik');
    hamburgerler.forEach(function (h) { h.setAttribute('aria-expanded', 'true'); });
    sonOdak = document.activeElement;
    var kapat = panel.querySelector('[data-menu-kapat]');
    if (kapat) setTimeout(function () { kapat.focus({ preventScroll: true }); }, 30);
  }
  function menuKapat() {
    if (!body.classList.contains('menu-acik')) return;
    body.classList.remove('menu-acik');
    hamburgerler.forEach(function (h) { h.setAttribute('aria-expanded', 'false'); });
    if (sonOdak && sonOdak.focus) sonOdak.focus();
  }
  hamburgerler.forEach(function (h) {
    h.addEventListener('click', function () { body.classList.contains('menu-acik') ? menuKapat() : menuAc(); });
  });
  $$('[data-menu-kapat]').forEach(function (k) { k.addEventListener('click', menuKapat); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { menuKapat(); filtreKapat(); }
  });

  /* Kategori satırı: alt kategorileri aç/kapat */
  $$('.kat[aria-expanded]').forEach(function (b) {
    b.addEventListener('click', function () {
      var acik = b.getAttribute('aria-expanded') === 'true';
      var liste = b.closest('ul');
      if (liste) $$('.kat[aria-expanded]', liste).forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
      b.setAttribute('aria-expanded', acik ? 'false' : 'true');
    });
  });

  /* ?menu=1 → menü açık, ilk kategori genişlemiş (ekran görüntüsü / sunum için) */
  var q = new URLSearchParams(location.search);
  if (q.get('menu') && panel) {
    menuAc();
    var ilk = panel.querySelector('.kat[aria-expanded]');
    if (ilk && q.get('menu') !== '2') ilk.setAttribute('aria-expanded', 'true');
  }

  /* ---------- Canlı fiyat: 4 saniyede bir birkaç kuruş ---------- */
  var canli = $$('[data-canli]');
  if (canli.length && !azHareket) {
    var gruplar = {};
    canli.forEach(function (el) {
      var k = el.getAttribute('data-canli');
      (gruplar[k] = gruplar[k] || { taban: parseFloat(el.getAttribute('data-deger')), d: parseInt(el.getAttribute('data-ondalik') || '0', 10), els: [] }).els.push(el);
    });
    var piyasa = 0;
    setInterval(function () {
      piyasa += (Math.random() - 0.48) * 0.0006;           // ortak piyasa yönü
      piyasa = Math.max(-0.003, Math.min(0.003, piyasa));
      Object.keys(gruplar).forEach(function (k) {
        var g = gruplar[k];
        var fark = piyasa + (Math.random() - 0.5) * 0.0003;
        var yeni = g.taban * (1 + fark);
        var eski = g.son || g.taban;
        g.son = yeni;
        g.els.forEach(function (el) {
          el.textContent = bicimle(yeni, g.d);
          var b = el.closest('.levha b, .ftablo [data-canli], .mini-levha b');
          if (b && Math.abs(yeni - eski) / eski > 0.00005) {
            b.classList.add('parla');
            setTimeout(function () { b.classList.remove('parla'); }, 900);
          }
        });
      });
    }, 4000);
  }

  /* ---------- Geri sayımlar ---------- */
  $$('[data-geri-sayim]').forEach(function (el) {
    var bas = parseInt(el.getAttribute('data-geri-sayim'), 10), s = bas;
    setInterval(function () {
      s = s <= 0 ? 240 : s - 1;
      var m = Math.floor(s / 60), sn = s % 60;
      el.textContent = (m < 10 ? '0' : '') + m + ':' + (sn < 10 ? '0' : '') + sn;
    }, 1000);
  });

  /* ---------- Düzenli birikim hesap (ana sayfa) ---------- */
  var birikim = document.querySelector('[data-birikim]');
  if (birikim) {
    $$('button', birikim).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', birikim).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        var g = parseFloat(b.getAttribute('data-g')) * 5;
        document.querySelector('[data-birikim-gram]').textContent = bicimle(g, g % 1 ? 1 : 0) + ' g';
        document.querySelector('[data-birikim-tutar]').textContent = bicimle(Math.round(g * 7347), 0) + ' TL';
      });
    });
  }

  /* ---------- Ürün: galeri, gramaj, alım şekli, adet ---------- */
  var ana = document.querySelector('[data-galeri-ana]');
  $$('[data-gorsel]').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('[data-gorsel]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      b.setAttribute('aria-pressed', 'true');
      if (ana) ana.style.backgroundImage = 'url(' + b.getAttribute('data-gorsel') + ')';
    });
  });
  var gramaj = document.querySelector('[data-gramaj]');
  var adetEl = document.querySelector('[data-adet-deger]');
  function urunFiyat() {
    var sec = gramaj && gramaj.querySelector('[aria-pressed="true"]');
    if (!sec) return;
    var f = parseFloat(sec.getAttribute('data-fiyat'));
    var adet = Math.max(1, parseInt(adetEl ? adetEl.value : '1', 10) || 1);
    var gr = parseFloat(sec.getAttribute('data-g').replace(',', '.'));
    document.querySelector('[data-urun-fiyat]').textContent = bicimle(f * adet, 2);
    document.querySelector('[data-urun-kart]').textContent = bicimle(f * adet * 1.035, 2);
    var gb = document.querySelector('[data-gram-basi]');
    if (gb) gb.textContent = bicimle(Math.round(f / gr), 0);
    var h1 = document.querySelector('.urun-bilgi h1');
    if (h1) h1.textContent = 'GoldPay ' + sec.getAttribute('data-g') + ' Gr Külçe Altın 999.9';
  }
  if (gramaj) {
    $$('button', gramaj).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', gramaj).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        urunFiyat();
      });
    });
  }
  $$('[data-adet]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!adetEl) return;
      adetEl.value = Math.max(1, (parseInt(adetEl.value, 10) || 1) + parseInt(b.getAttribute('data-adet'), 10));
      urunFiyat();
    });
  });
  $$('[data-alim]').forEach(function (grup) {
    $$('button', grup).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('button', grup).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
      });
    });
  });

  /* ---------- Sekmeler (ödeme, sipariş kuyruğu) ---------- */
  $$('.sekmeler').forEach(function (s) {
    var kap = s.parentElement;
    $$('[data-sekme]', s).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-sekme]', s).forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
        b.setAttribute('aria-selected', 'true');
        $$('[data-icerik]', kap).forEach(function (c) { c.hidden = c.getAttribute('data-icerik') !== b.getAttribute('data-sekme'); });
        var odeme = b.getAttribute('data-odeme');
        var t = document.querySelector('[data-toplam]');
        if (odeme && t) {
          t.textContent = bicimle(parseFloat(t.getAttribute('data-' + odeme)), 0);
          var ad = document.querySelector('[data-odeme-ad]');
          if (ad) ad.textContent = odeme === 'kart' ? 'Kredi kartı, tek çekim' : 'Havale / EFT';
        }
      });
    });
  });

  /* ---------- Kategori: gramaj çipi, saflık, sıralama, filtre paneli ---------- */
  var izgara = document.querySelector('[data-izgara]');
  function filtrele() {
    if (!izgara) return;
    var cip = document.querySelector('.cip[aria-pressed="true"]');
    var gram = cip ? cip.getAttribute('data-gram') : 'hepsi';
    var saflik = $$('input[data-saflik]').filter(function (i) { return i.checked; }).map(function (i) { return i.getAttribute('data-saflik'); });
    var n = 0;
    $$('.urun-kart', izgara).forEach(function (k) {
      var ok = (gram === 'hepsi' || k.getAttribute('data-gram') === gram) && saflik.indexOf(k.getAttribute('data-saflik')) > -1;
      k.hidden = !ok;
      if (ok) n++;
    });
    var s = document.querySelector('[data-sonuc]');
    if (s) s.textContent = n + ' ürün';
    var bos = document.querySelector('[data-bos]');
    if (bos) bos.style.display = n ? 'none' : 'block';
  }
  $$('.cip[data-gram]').forEach(function (c) {
    c.addEventListener('click', function () {
      $$('.cip[data-gram]').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      c.setAttribute('aria-pressed', 'true');
      filtrele();
    });
  });
  $$('input[data-saflik]').forEach(function (i) { i.addEventListener('change', filtrele); });
  var sirala = document.querySelector('[data-sirala]');
  if (sirala && izgara) {
    var ilkSira = $$('.urun-kart', izgara);
    sirala.addEventListener('change', function () {
      var l = ilkSira.slice();
      if (sirala.value !== 'onerilen') {
        l.sort(function (a, b) {
          var d = parseFloat(a.getAttribute('data-fiyat')) - parseFloat(b.getAttribute('data-fiyat'));
          return sirala.value === 'artan' ? d : -d;
        });
      }
      l.forEach(function (k) { izgara.appendChild(k); });
    });
  }
  function filtreKapat() { body.classList.remove('filtre-acik'); }
  $$('[data-filtre-ac]').forEach(function (b) { b.addEventListener('click', function () { body.classList.add('filtre-acik'); }); });
  $$('[data-filtre-kapat]').forEach(function (b) { b.addEventListener('click', filtreKapat); });

  /* ---------- Sepete ekle geri bildirimi ---------- */
  $$('[data-sepete]').forEach(function (b) {
    b.addEventListener('click', function () {
      var eski = b.textContent;
      b.textContent = 'Sepete eklendi';
      $$('.sayac').forEach(function (s) { s.textContent = (parseInt(s.textContent, 10) || 0) + 1; });
      setTimeout(function () { b.textContent = eski; }, 1600);
    });
  });

  /* ---------- Anahtarlar, fiyat dondurma, alarm, havale eşleştirme ---------- */
  $$('[data-anahtar], [data-dondur]').forEach(function (a) {
    a.addEventListener('click', function () {
      var acik = a.getAttribute('aria-checked') === 'true';
      a.setAttribute('aria-checked', acik ? 'false' : 'true');
      if (a.hasAttribute('data-dondur')) {
        var k = a.closest('[data-fiyat-yonetimi]');
        if (k) k.classList.toggle('dondu', !acik);
      }
    });
  });
  var alarm = document.querySelector('[data-alarm]');
  if (alarm) {
    alarm.addEventListener('submit', function (e) {
      e.preventDefault();
      var sel = alarm.querySelectorAll('select');
      var v = alarm.querySelector('[data-alarm-deger]').value;
      document.querySelector('[data-alarm-sonuc]').textContent =
        'Alarm kuruldu: ' + sel[0].value + ', ' + v + ' TL ' + (sel[1].selectedIndex ? 'üstüne çıkınca' : 'altına düşünce') + ' SMS gelecek.';
    });
  }
  $$('[data-eslestir]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.textContent === 'Eşleştir') { b.textContent = 'Eşleşti'; b.classList.add('eslesti'); }
    });
  });
})();
