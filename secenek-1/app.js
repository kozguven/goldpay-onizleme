/* GoldPay — Seçenek 1 "Kasa" · küçük vanilla JS */
(function () {
  'use strict';
  var azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;

  function bicimle(n, d) {
    return n.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  /* ---------- Mobil menü: kasa kapısı ---------- */
  var panel = document.getElementById('menuPanel');
  var hamburgerler = document.querySelectorAll('.hamburger');
  var sonOdak = null;

  function menuAc() {
    body.classList.add('menu-acik');
    hamburgerler.forEach(function (h) { h.setAttribute('aria-expanded', 'true'); });
    sonOdak = document.activeElement;
    var kapat = panel && panel.querySelector('[data-menu-kapat]');
    if (kapat) setTimeout(function () { kapat.focus(); }, azHareket ? 0 : 330);
  }
  function menuKapat() {
    if (!body.classList.contains('menu-acik')) return;
    body.classList.remove('menu-acik');
    hamburgerler.forEach(function (h) { h.setAttribute('aria-expanded', 'false'); });
    if (sonOdak && sonOdak.focus) sonOdak.focus();
  }
  hamburgerler.forEach(function (h) {
    h.addEventListener('click', function () {
      body.classList.contains('menu-acik') ? menuKapat() : menuAc();
    });
  });
  document.querySelectorAll('[data-menu-kapat]').forEach(function (k) {
    k.addEventListener('click', menuKapat);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { menuKapat(); filtreKapat(); }
  });

  /* Kategori satırı: alt kategorileri aç/kapat (menü + telefon kopyaları) */
  document.querySelectorAll('.kat[aria-expanded]').forEach(function (b) {
    b.addEventListener('click', function () {
      var acik = b.getAttribute('aria-expanded') === 'true';
      var liste = b.closest('ul');
      if (liste) {
        liste.querySelectorAll('.kat[aria-expanded]').forEach(function (x) {
          x.setAttribute('aria-expanded', 'false');
        });
      }
      b.setAttribute('aria-expanded', acik ? 'false' : 'true');
    });
  });

  /* ---------- Canlı fiyat: 4 saniyede bir birkaç kuruş ---------- */
  var canli = document.querySelectorAll('[data-canli]');
  if (canli.length && !azHareket) {
    var taban = {};
    canli.forEach(function (el) {
      var k = el.getAttribute('data-canli');
      if (!(k in taban)) taban[k] = parseFloat(el.getAttribute('data-deger'));
    });
    var adim = { altin: 0.14, gumus: 0.04, usd: 0.01, eur: 0.01, ons: 0.6, ceyrek: 0.3 };
    setInterval(function () {
      Object.keys(taban).forEach(function (k) {
        var tur = k.split('-')[0];
        var d = (Math.random() * 2 - 1) * (adim[tur] || 0.1);
        taban[k] = Math.round((taban[k] + d) * 100) / 100;
      });
      canli.forEach(function (el) {
        var k = el.getAttribute('data-canli');
        var d = parseInt(el.getAttribute('data-ondalik') || '2', 10);
        var yeni = bicimle(taban[k], d);
        if (el.textContent !== yeni) {
          el.textContent = yeni;
          el.classList.remove('parilti');
          void el.offsetWidth;
          el.classList.add('parilti');
        }
      });
    }, 4000);
  }

  /* ---------- Geri sayım: "fiyat 03:48 geçerli" ---------- */
  document.querySelectorAll('[data-geri-sayim]').forEach(function (gs) {
    var s = parseInt(gs.getAttribute('data-geri-sayim'), 10);
    setInterval(function () {
      s -= 1;
      if (s < 0) s = 240;
      gs.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
    }, 1000);
  });

  /* ---------- Cip grupları (gramaj, saflık, teslimat) ---------- */
  document.querySelectorAll('[data-cip-grup]').forEach(function (grup) {
    grup.querySelectorAll('.cip').forEach(function (cip) {
      cip.addEventListener('click', function () {
        grup.querySelectorAll('.cip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
        cip.setAttribute('aria-pressed', 'true');
        var havale = cip.getAttribute('data-havale');
        if (havale) {
          var h = document.getElementById('fiyatHavale');
          var k = document.getElementById('fiyatKart');
          var ad = document.getElementById('urunGramaj');
          if (h) { h.textContent = havale; h.classList.remove('parilti'); void h.offsetWidth; h.classList.add('parilti'); }
          if (k) k.textContent = cip.getAttribute('data-kart');
          if (ad) ad.textContent = cip.getAttribute('data-ad');
        }
      });
    });
  });

  /* ---------- Sekmeler ---------- */
  document.querySelectorAll('.sekmeler').forEach(function (sek) {
    sek.querySelectorAll('.sekme-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        sek.querySelectorAll('.sekme-btn').forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
        btn.setAttribute('aria-selected', 'true');
        var hedef = btn.getAttribute('aria-controls');
        var kap = sek.parentElement;
        kap.querySelectorAll('.sekme-icerik').forEach(function (p) { p.classList.toggle('aktif', p.id === hedef); });
      });
    });
  });

  /* ---------- Sepet adımları ---------- */
  function adimaGit(n) {
    document.querySelectorAll('.adim-btn').forEach(function (b) {
      var no = parseInt(b.getAttribute('data-adim'), 10);
      b.setAttribute('aria-current', no === n ? 'step' : 'false');
      b.classList.toggle('tamam', no < n);
    });
    document.querySelectorAll('.adim-icerik').forEach(function (p) {
      p.classList.toggle('aktif', parseInt(p.getAttribute('data-adim'), 10) === n);
    });
    var ust = document.querySelector('.adim-cubuk');
    if (ust) ust.scrollIntoView({ behavior: azHareket ? 'auto' : 'smooth', block: 'start' });
  }
  document.querySelectorAll('.adim-btn').forEach(function (b) {
    b.addEventListener('click', function () { adimaGit(parseInt(b.getAttribute('data-adim'), 10)); });
  });
  document.querySelectorAll('[data-adim-git]').forEach(function (b) {
    b.addEventListener('click', function () { adimaGit(parseInt(b.getAttribute('data-adim-git'), 10)); });
  });

  /* ---------- Galeri ---------- */
  var anaFoto = document.getElementById('anaFoto');
  document.querySelectorAll('.kucuk-foto').forEach(function (k) {
    k.addEventListener('click', function () {
      document.querySelectorAll('.kucuk-foto').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
      k.setAttribute('aria-pressed', 'true');
      if (anaFoto) anaFoto.style.backgroundImage = k.style.backgroundImage;
    });
  });

  /* ---------- Filtre paneli (mobil) ---------- */
  function filtreKapat() { body.classList.remove('filtre-acik'); }
  document.querySelectorAll('[data-filtre-ac]').forEach(function (b) {
    b.addEventListener('click', function () { body.classList.add('filtre-acik'); });
  });
  document.querySelectorAll('[data-filtre-kapat]').forEach(function (b) {
    b.addEventListener('click', filtreKapat);
  });

  /* ---------- Adet ---------- */
  document.querySelectorAll('.adet').forEach(function (a) {
    var out = a.querySelector('output');
    a.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = parseInt(out.textContent, 10) + (b.getAttribute('data-adet') === '+' ? 1 : -1);
        out.textContent = Math.max(1, v);
      });
    });
  });

  /* ---------- Anahtar (toggle) ---------- */
  document.querySelectorAll('.anahtar').forEach(function (a) {
    a.addEventListener('click', function () {
      a.setAttribute('aria-checked', a.getAttribute('aria-checked') === 'true' ? 'false' : 'true');
    });
  });

  /* ---------- Fiyat alarmı: sadece görsel geri bildirim ---------- */
  var alarmForm = document.getElementById('alarmForm');
  if (alarmForm) {
    alarmForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var mesaj = document.getElementById('alarmMesaj');
      if (mesaj) { mesaj.hidden = false; }
    });
  }
})();
