/* GoldPay — Seçenek 2 "Cetvel" · küçük vanilla JS */
(function () {
  "use strict";
  var IMG = "../assets/img/";

  /* ───── menü verisi (çekmece + mega menü + telefon kopyası aynı veriyi kullanır) ───── */
  var KATEGORILER = [
    { ad: "Gram Külçe Altın", img: "altin-10g", ipucu: "1 g · 7.347 TL", href: "kategori.html",
      alt: [["995.0 Külçe", "altin-5g", "kategori.html"], ["999.9 Külçe", "altin-10g", "kategori.html"], ["Tüm ürünler", "altin-50g", "kategori.html"]] },
    { ad: "Gram Külçe Gümüş", img: "gumus-250g", ipucu: "50 g · 6.217 TL", href: "kategori.html",
      alt: [["999.9 Basılı", "gumus-50g", "kategori.html"], ["Döküm külçe", "gumus-1000g", "kategori.html"], ["Tüm ürünler", "gumus-yigin", "kategori.html"]] },
    { ad: "Ziynet Altın", img: "ceyrek", ipucu: "Çeyrek · 12.448 TL", href: "kategori.html",
      alt: [["Çeyrek", "ceyrek", "kategori.html"], ["Yarım", "ceyrek", "kategori.html"], ["Tam", "tam-altin", "kategori.html"], ["Ata", "ziynet-set", "kategori.html"], ["Reşat", "tam-altin", "kategori.html"], ["Tüm ürünler", "ziynet-set", "kategori.html"]] },
    { ad: "22 Ayar Takı", img: "bilezik", ipucu: "Burma 10 g · 64.574 TL", href: "kategori.html",
      alt: [["Burma bilezik", "bilezik", "kategori.html"], ["Ajda bilezik", "bilezik", "kategori.html"], ["Kibrit çöpü", "bilezik", "kategori.html"], ["Tüm ürünler", "bilezik", "kategori.html"]] },
    { ad: "Hesaba Altın Havale", img: "sertifika", ipucu: "1 g · 7.298 TL", href: "index.html#havale",
      alt: [["Kuveyt Türk", "sertifika", "index.html#havale"], ["Garanti BBVA", "sertifika", "index.html#havale"], ["Yapı Kredi", "sertifika", "index.html#havale"], ["Ziraat", "sertifika", "index.html#havale"]] },
    { ad: "Düzenli Birikim", img: "birikim", ipucu: "Aylık 1 g'dan başlar", href: "index.html#birikim",
      alt: [["Aylık 1 g", "altin-1g", "index.html#birikim"], ["Aylık 2,5 g", "altin-5g", "index.html#birikim"], ["Aylık 5 g", "altin-5g", "index.html#birikim"], ["Planımı gör", "birikim", "hesabim.html#birikim"]] }
  ];
  var SATIRLAR = [["Canlı fiyatlar", "fiyatlar.html"], ["Sipariş takibi", "sepet.html#takip"], ["Hesabım", "hesabim.html"], ["Kurumsal", "index.html#guven"]];

  var OK_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg>';
  var SAG_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>';
  var TIK_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>';
  var LOGO = 'Gold<svg class="centik" viewBox="0 0 9 22" aria-hidden="true"><path d="M1 1v20M1 4h6M1 11h8M1 18h6" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>Pay';

  function cipler(k) {
    return '<div class="cipler">' + k.alt.map(function (a) {
      return '<a class="cip" href="' + a[2] + '"><img src="' + IMG + a[1] + '.jpg" alt=""><span>' + a[0] + '</span></a>';
    }).join("") + "</div>";
  }

  function cekmeceHTML(onek) {
    var h = '<div class="cekmece-bas"><a class="logo" href="index.html" aria-label="GoldPay ana sayfa">' + LOGO + '</a>' +
      '<button class="kapat" type="button" aria-label="Menüyü kapat"><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>' +
      '<div class="cekmece-ic"><div class="kutular">';
    for (var i = 0; i < KATEGORILER.length; i += 2) {
      var cift = [KATEGORILER[i], KATEGORILER[i + 1]].filter(Boolean);
      cift.forEach(function (k, j) {
        var id = onek + "-alt-" + (i + j);
        h += '<button class="kutu" type="button" aria-expanded="false" aria-controls="' + id + '">' +
          '<span class="kutu-foto"><img src="' + IMG + k.img + '.jpg" alt=""><span class="ok">' + OK_SVG + '</span></span>' +
          '<span class="kutu-ad">' + k.ad + '</span><span class="kutu-ipucu">' + k.ipucu + '</span></button>';
      });
      cift.forEach(function (k, j) {
        var id = onek + "-alt-" + (i + j);
        h += '<div class="altlar" id="' + id + '" hidden>' + cipler(k) + "</div>";
      });
    }
    h += '</div><ul class="cekmece-satirlar">' + SATIRLAR.map(function (s) {
      return '<li><a href="' + s[1] + '">' + s[0] + SAG_SVG + "</a></li>";
    }).join("") + "</ul></div>" +
      '<div class="cekmece-guven"><span>' + TIK_SVG + 'Sertifikalı ürün</span><span>' + TIK_SVG + 'Sigortalı kargo</span><span>' + TIK_SVG + '3D Secure</span><span>' + TIK_SVG + 'ETBİS kayıtlı</span></div>';
    return h;
  }

  function megaHTML() {
    var h = "<ul>";
    KATEGORILER.forEach(function (k) {
      h += '<li><a href="' + k.href + '">' + k.ad + '</a><div class="mega">' +
        '<a class="mega-foto" href="' + k.href + '" tabindex="-1"><img class="foto" src="' + IMG + k.img + '.jpg" alt=""></a>' +
        '<div><div class="mega-ad">' + k.ad + '</div><div class="mega-ipucu">' + k.ipucu + '</div>' + cipler(k) +
        '<a class="baglanti mega-link" href="' + k.href + '">Kategoriye git</a></div></div></li>';
    });
    h += '<li class="saga"><a href="fiyatlar.html">Canlı fiyatlar</a></li></ul>';
    return h;
  }

  function kutuBagla(kok) {
    kok.querySelectorAll(".kutu").forEach(function (b) {
      b.addEventListener("click", function () {
        var acik = b.getAttribute("aria-expanded") === "true";
        kok.querySelectorAll(".kutu[aria-expanded='true']").forEach(function (d) {
          d.setAttribute("aria-expanded", "false");
          var p = kok.querySelector("#" + d.getAttribute("aria-controls"));
          if (p) p.hidden = true;
        });
        if (!acik) {
          b.setAttribute("aria-expanded", "true");
          var panel = kok.querySelector("#" + b.getAttribute("aria-controls"));
          if (panel) panel.hidden = false;
        }
      });
    });
  }

  function menuKur() {
    var cekmece = document.getElementById("cekmece");
    var nav = document.getElementById("nav-masaustu");
    if (nav) nav.innerHTML = megaHTML();
    if (cekmece) {
      cekmece.innerHTML = cekmeceHTML("c");
      cekmece.hidden = false;
      kutuBagla(cekmece);
      var hamb = document.querySelector(".hamburger");
      var perde = document.querySelector(".perde");
      function ac() {
        document.body.classList.add("menu-acik");
        if (hamb) hamb.setAttribute("aria-expanded", "true");
        cekmece.setAttribute("aria-hidden", "false");
        var ilk = cekmece.querySelector(".kapat"); if (ilk) ilk.focus();
      }
      function kapat() {
        document.body.classList.remove("menu-acik");
        if (hamb) { hamb.setAttribute("aria-expanded", "false"); hamb.focus(); }
        cekmece.setAttribute("aria-hidden", "true");
      }
      if (hamb) hamb.addEventListener("click", function () { document.body.classList.contains("menu-acik") ? kapat() : ac(); });
      cekmece.querySelector(".kapat").addEventListener("click", kapat);
      if (perde) { perde.hidden = false; perde.addEventListener("click", kapat); }
      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("menu-acik")) kapat(); });
      if (/[?&]menu=acik/.test(location.search)) ac();
    }
    document.querySelectorAll("[data-menu-kopya]").forEach(function (el, i) {
      el.classList.add("cekmece");
      el.innerHTML = cekmeceHTML("t" + i);
      kutuBagla(el);
      var acikIdx = parseInt(el.getAttribute("data-menu-kopya"), 10);
      if (!isNaN(acikIdx)) {
        var b = el.querySelectorAll(".kutu")[acikIdx];
        if (b) b.click();
      }
    });
  }

  /* ───── sayı biçimi ───── */
  function parseTR(s) {
    s = String(s).trim().replace(/\./g, "").replace(",", ".");
    var n = parseFloat(s);
    return isNaN(n) ? null : n;
  }
  function formatTR(n, ondalik) {
    var sabit = n.toFixed(ondalik);
    var parcalar = sabit.split(".");
    parcalar[0] = parcalar[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return ondalik > 0 ? parcalar.join(",") : parcalar[0];
  }

  /* ───── canlı fiyat oynaması (4 sn) ───── */
  var azaltilmis = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function canliKur() {
    var ogeler = [];
    document.querySelectorAll("[data-canli]").forEach(function (el) {
      var taban = parseTR(el.textContent);
      if (taban === null) return;
      var m = el.textContent.trim().match(/,(\d+)$/);
      var o = { el: el, taban: taban, ondalik: m ? m[1].length : 0, son: taban, grup: el.getAttribute("data-canli") || "" };
      el.__canli = o;
      ogeler.push(o);
    });
    if (!ogeler.length) return;
    var tikler = document.querySelectorAll("[data-tik]");
    function tik() {
      var yon = (Math.random() - 0.48);
      var oran = yon * 0.0012;
      var grupDelta = {};
      ogeler.forEach(function (o) {
        var kendi = o.taban * (1 + oran + (Math.random() - 0.5) * 0.0003);
        var delta = kendi - o.son;
        o.son = kendi;
        grupDelta[o.grup] = delta;
        var metin = formatTR(kendi, o.ondalik);
        if (metin !== o.el.textContent) {
          o.el.textContent = metin;
          o.el.classList.add("yeni");
          setTimeout(function () { o.el.classList.remove("yeni"); }, 900);
        }
      });
      tikler.forEach(function (t) {
        var d = grupDelta[t.getAttribute("data-tik")];
        if (d === undefined) return;
        var neg = d < 0;
        t.textContent = (neg ? "▼ " : "▲ ") + formatTR(Math.abs(d), 2) + " son hareket";
        t.classList.toggle("kayip", neg);
        t.classList.toggle("kazanc", !neg);
      });
    }
    if (!azaltilmis) setInterval(tik, 4000);
  }

  /* ───── geri sayım (fiyat geçerlilik) ───── */
  function geriSayimKur() {
    document.querySelectorAll("[data-geri-sayim]").forEach(function (el) {
      var sn = parseInt(el.getAttribute("data-geri-sayim"), 10) || 228;
      var kalan = sn;
      function yaz() {
        var m = Math.floor(kalan / 60), s = kalan % 60;
        el.textContent = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
      }
      yaz();
      setInterval(function () { kalan = kalan > 0 ? kalan - 1 : sn; yaz(); }, 1000);
    });
  }

  /* ───── gramaj seçimi (radio grubu) ───── */
  function secimKur() {
    document.querySelectorAll(".secim[role='radiogroup']").forEach(function (grup) {
      var hedefHavale = grup.getAttribute("data-havale-hedef");
      var hedefKart = grup.getAttribute("data-kart-hedef");
      var hedefAd = grup.getAttribute("data-ad-hedef");
      grup.querySelectorAll("[role='radio']").forEach(function (b) {
        b.addEventListener("click", function () {
          grup.querySelectorAll("[role='radio']").forEach(function (x) { x.setAttribute("aria-checked", "false"); });
          b.setAttribute("aria-checked", "true");
          var h = b.getAttribute("data-havale"), k = b.getAttribute("data-kart"), ad = b.getAttribute("data-ad");
          if (hedefHavale && h) document.querySelectorAll(hedefHavale).forEach(function (el) {
            el.textContent = h;
            if (el.__canli) { var t = parseTR(h); el.__canli.taban = t; el.__canli.son = t; }
          });
          if (hedefKart && k) document.querySelectorAll(hedefKart).forEach(function (el) { el.textContent = k; });
          if (hedefAd && ad) document.querySelectorAll(hedefAd).forEach(function (el) { el.textContent = ad; });
        });
      });
    });
  }

  /* ───── sekmeler ───── */
  function sekmeKur() {
    document.querySelectorAll("[role='tablist']").forEach(function (liste) {
      var sekmeler = liste.querySelectorAll("[role='tab']");
      sekmeler.forEach(function (s) {
        s.addEventListener("click", function () {
          sekmeler.forEach(function (x) {
            x.setAttribute("aria-selected", "false");
            var p = document.getElementById(x.getAttribute("aria-controls")); if (p) p.hidden = true;
          });
          s.setAttribute("aria-selected", "true");
          var panel = document.getElementById(s.getAttribute("aria-controls")); if (panel) panel.hidden = false;
        });
      });
    });
  }

  /* ───── filtre paneli (mobil alt çekmece) ───── */
  function filtreKur() {
    var ac = document.querySelector(".filtre-ac"), panel = document.querySelector(".filtre-panel");
    if (!ac || !panel) return;
    var kapat = panel.querySelector(".panel-kapat");
    ac.addEventListener("click", function () { panel.classList.add("acik"); ac.setAttribute("aria-expanded", "true"); });
    if (kapat) kapat.addEventListener("click", function () { panel.classList.remove("acik"); ac.setAttribute("aria-expanded", "false"); });
  }

  /* ───── ödeme adımları ───── */
  function adimKur() {
    var cubuk = document.querySelector(".adim-cubuk");
    if (!cubuk) return;
    var dugmeler = cubuk.querySelectorAll("button");
    function git(n) {
      dugmeler.forEach(function (b, i) {
        b.removeAttribute("aria-current");
        b.classList.toggle("tamam", i < n);
        if (i === n) b.setAttribute("aria-current", "step");
      });
      document.querySelectorAll(".adim-panel").forEach(function (p, i) { p.hidden = i !== n; });
      var onay = document.getElementById("siparis-onay"); if (onay) onay.hidden = true;
      var ilk = document.querySelector(".odeme-duzen"); if (ilk) ilk.scrollIntoView({ block: "start" });
    }
    dugmeler.forEach(function (b, i) { b.addEventListener("click", function () { git(i); }); });
    document.querySelectorAll("[data-adim-git]").forEach(function (b) {
      b.addEventListener("click", function () { git(parseInt(b.getAttribute("data-adim-git"), 10)); });
    });
    var onayla = document.getElementById("siparisi-onayla");
    if (onayla) onayla.addEventListener("click", function () {
      var kutu = document.getElementById("sozlesme");
      if (kutu && !kutu.checked) { kutu.focus(); kutu.closest("label").style.outline = "2px solid #B5413B"; return; }
      document.querySelectorAll(".adim-panel").forEach(function (p) { p.hidden = true; });
      dugmeler.forEach(function (b) { b.classList.add("tamam"); b.removeAttribute("aria-current"); });
      var onay = document.getElementById("siparis-onay");
      if (onay) { onay.hidden = false; onay.scrollIntoView({ block: "start" }); }
    });
    if (location.hash === "#takip") {
      var o = document.getElementById("siparis-onay");
      if (o) { document.querySelectorAll(".adim-panel").forEach(function (p) { p.hidden = true; }); o.hidden = false; }
    }
  }

  /* ───── adet ───── */
  function adetKur() {
    document.querySelectorAll(".adet").forEach(function (a) {
      var out = a.querySelector("output"); if (!out) return;
      a.querySelectorAll("button").forEach(function (b) {
        b.addEventListener("click", function () {
          var n = parseInt(out.textContent, 10) || 1;
          n += b.getAttribute("data-eksi") !== null ? -1 : 1;
          out.textContent = Math.max(1, Math.min(99, n));
        });
      });
    });
  }

  /* ───── galeri ───── */
  function galeriKur() {
    var buyuk = document.querySelector(".galeri .buyuk img");
    if (!buyuk) return;
    document.querySelectorAll(".galeri .kucukler button").forEach(function (b) {
      b.addEventListener("click", function () {
        document.querySelectorAll(".galeri .kucukler button").forEach(function (x) { x.removeAttribute("aria-current"); });
        b.setAttribute("aria-current", "true");
        buyuk.src = b.querySelector("img").src;
      });
    });
  }

  /* ───── fiyat alarmı ───── */
  function alarmKur() {
    document.querySelectorAll("form.alarm-form").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var m = f.querySelector(".mesaj"); if (m) m.classList.add("goster");
        var b = f.querySelector("button[type='submit']"); if (b) b.textContent = "Alarm kuruldu";
      });
    });
  }

  /* ───── panel: fiyatları dondur ───── */
  function dondurKur() {
    var a = document.getElementById("dondur"); if (!a) return;
    var m = document.querySelector(".don-mesaj");
    a.addEventListener("change", function () {
      if (!m) return;
      m.classList.toggle("aktif", a.checked);
      m.textContent = a.checked ? "Fiyatlar donduruldu — kaynak kur değişse de site fiyatları sabit kalır. Açık kaldığı süre: 00:00" : "Fiyatlar canlı: kaynak kur her 4 dakikada bir çekiliyor, son çekim 14:32.";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    menuKur(); canliKur(); geriSayimKur(); secimKur(); sekmeKur(); filtreKur(); adimKur(); adetKur(); galeriKur(); alarmKur(); dondurKur();
  });
})();
