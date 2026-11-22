/* Polpino Warteliste: Bewegung mit Sinn, Formular an Brevo (Double-Opt-in läuft bei Brevo). */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var ruhig = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hatBeobachter = "IntersectionObserver" in window;

  function sichtbarWenn(el, schwelle, wenn) {
    if (!el) return;
    if (!hatBeobachter) { wenn(); return; }
    var b = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) { b.disconnect(); wenn(); }
      });
    }, { threshold: schwelle });
    b.observe(el);
  }
  function imBild(el) {
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  /* 1. Abschnitte tauchen auf (sichtbar ohne Skript) */
  if (!ruhig && hatBeobachter) {
    document.querySelectorAll(".auftauchen, .entfalten").forEach(function (el) {
      if (imBild(el)) return;
      el.classList.add("wartet");
      sichtbarWenn(el, 0.15, function () { el.classList.remove("wartet"); });
    });
  }

  /* 2. Hero: Polpino arbeitet am Schreibtisch, jeder Arm hat seine Aufgabe */
  var buero = document.getElementById("buero");
  if (buero) {
    var aufgaben = [
      ["Termin bei Dr. Weber holen", "Praxis Dr. Weber", "«Hätten Sie nächste Woche am Vormittag Zeit?»", "Di 10:30 im Kalender"],
      ["Tisch für Freitag reservieren", "Ristorante al Lago", "«Ein Tisch für vier, Freitag um halb acht?»", "Fr 19:30, Tisch für vier"],
      ["Sanitär für den Boiler anfragen", "Sanitär Keller", "«Wann könnten Sie vorbeikommen?»", "Kommt am Donnerstag"],
      ["Coiffeur verschieben", "Coiffeur Mira", "«Ginge auch Samstag statt Freitag?»", "Verschoben auf Sa 9:00"]
    ];
    var blase = document.getElementById("buero-blase");
    var wer = document.getElementById("buero-wer");
    var sagt = document.getElementById("buero-sagt");
    var heroB = document.getElementById("hero");
    function zeige(oben, unten) {
      if (!ruhig) { blase.classList.remove("klappt"); void blase.offsetWidth; blase.classList.add("klappt"); }
      setTimeout(function () { wer.textContent = oben; sagt.textContent = unten; }, ruhig ? 0 : 200);
    }
    function phase(name) {
      buero.classList.remove("tippt", "ruft", "stempelt", "fertig");
      if (name) buero.classList.add(name);
    }
    if (ruhig) {
      phase("fertig");
      zeige("Erledigt", "Di 10:30 im Kalender");
    } else {
      var nr = 0;
      var ablauf = function () {
        if (document.hidden || (heroB && heroB.classList.contains("ruht"))) { setTimeout(ablauf, 1000); return; }
        var a = aufgaben[nr];
        phase("tippt");
        zeige("Neuer Auftrag per WhatsApp", a[0]);
        setTimeout(function () {
          phase("ruft");
          zeige("Ruft an: " + a[1], a[2]);
          setTimeout(function () {
            phase("stempelt");
            setTimeout(function () {
              phase("fertig");
              zeige("Erledigt", a[3]);
              setTimeout(function () { nr = (nr + 1) % aufgaben.length; ablauf(); }, 2200);
            }, 900);
          }, 3000);
        }, 1800);
      };
      setTimeout(ablauf, 500);
    }
  }

  /* 3b. Papierteile ausserhalb des Hero gleiten beim Scrollen gegeneinander */
  var tiefen = Array.prototype.slice.call(document.querySelectorAll("[data-tiefe]"));
  if (!ruhig && tiefen.length) {
    var rollt = false;
    function rollen() {
      var mitte = window.innerHeight / 2;
      tiefen.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        var t = Number(el.getAttribute("data-tiefe")) || 0;
        el.style.setProperty("--py", ((r.top + r.height / 2 - mitte) * t * -1).toFixed(1));
      });
      rollt = false;
    }
    window.addEventListener("scroll", function () {
      if (rollt) return;
      rollt = true;
      requestAnimationFrame(rollen);
    }, { passive: true });
    rollen();
  }

  /* 3c. Schleifen ruhen, solange ein Bogen nicht im Bild ist */
  if (hatBeobachter) {
    var ruhend = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) { e.target.classList.toggle("ruht", !e.isIntersecting); });
    }, { rootMargin: "80px 0px" });
    document.querySelectorAll(".hero, .bogen, .fuss").forEach(function (el) { ruhend.observe(el); });
  }

  /* 4. Chat spielt einen Auftrag ab */
  var chat = document.getElementById("chat");
  if (chat && !ruhig) {
    var teile = Array.prototype.slice.call(chat.querySelectorAll("[data-schritt]"));
    var tippt = chat.querySelector(".tippt");
    var dauer = chat.querySelector(".dauer");
    var status = document.getElementById("chat-status");
    var figur = document.getElementById("chat-figur");
    var nochmal = document.querySelector(".chat-nochmal");
    var uhren = [];
    function warte(fn, ms) { uhren.push(setTimeout(fn, ms)); }
    function zeige(n) {
      teile.forEach(function (t) {
        if (Number(t.getAttribute("data-schritt")) === n) t.classList.remove("versteckt");
      });
    }
    function abspielen() {
      uhren.forEach(clearTimeout); uhren = [];
      if (nochmal) nochmal.hidden = true;
      teile.forEach(function (t) { if (t !== tippt) t.classList.add("versteckt"); });
      tippt.hidden = true;
      dauer.textContent = "0:00";
      status.textContent = "KI-Assistenz";
      warte(function () { zeige(1); }, 200);
      warte(function () { tippt.hidden = false; status.textContent = "schreibt …"; }, 900);
      warte(function () { tippt.hidden = true; zeige(3); status.textContent = "KI-Assistenz"; }, 1900);
      warte(function () {
        zeige(4);
        chat.classList.add("anruf-laeuft");
        figur.classList.add("figur-telefoniert");
        status.textContent = "telefoniert";
        var s = 0;
        var zaehler = setInterval(function () {
          s += 4;
          if (s >= 107) { s = 107; clearInterval(zaehler); }
          dauer.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
        }, 75);
        uhren.push(zaehler);
      }, 2700);
      warte(function () {
        chat.classList.remove("anruf-laeuft");
        figur.classList.remove("figur-telefoniert");
        status.textContent = "KI-Assistenz";
        zeige(5);
      }, 5000);
      warte(function () { zeige(6); }, 5600);
      warte(function () { if (nochmal) nochmal.hidden = false; }, 6200);
    }
    if (nochmal) nochmal.addEventListener("click", abspielen);
    if (!imBild(chat)) {
      teile.forEach(function (t) { if (t !== tippt) t.classList.add("versteckt"); });
    }
    sichtbarWenn(chat, 0.45, abspielen);
  }

  /* 6. Der erste Satz wird gesprochen */
  var zitat = document.getElementById("zitat");
  if (zitat && !ruhig && !imBild(zitat)) {
    var absatz = zitat.querySelector("p");
    var woerterZitat = [];
    Array.prototype.slice.call(absatz.childNodes).forEach(function (knoten) {
      if (knoten.nodeType !== 3) return;
      var frag = document.createDocumentFragment();
      knoten.textContent.split(/(\s+)/).forEach(function (stueck) {
        if (!stueck) return;
        if (/^\s+$/.test(stueck)) { frag.appendChild(document.createTextNode(stueck)); return; }
        var s = document.createElement("span");
        s.className = "wort";
        s.textContent = stueck;
        woerterZitat.push(s);
        frag.appendChild(s);
      });
      absatz.replaceChild(frag, knoten);
    });
    zitat.classList.add("spricht-noch");
    sichtbarWenn(zitat, 0.6, function () {
      woerterZitat.forEach(function (w, n) { w.style.transitionDelay = (n * 140) + "ms"; });
      zitat.classList.remove("spricht-noch");
    });
  }

  /* 7. Zeitplan füllt sich beim Scrollen, Polpino läuft mit */
  var zeitplan = document.getElementById("zeitplan");
  if (zeitplan) {
    var stationen = Array.prototype.slice.call(zeitplan.querySelectorAll(".leporello > li"));
    function stelle(f) {
      zeitplan.style.setProperty("--fortschritt", f.toFixed(3));
      stationen.forEach(function (s, n) {
        var offen = Math.max(0, Math.min(1, f * stationen.length * 1.15 - n));
        s.style.setProperty("--offen", offen.toFixed(3));
        s.classList.toggle("erreicht", f >= n / (stationen.length - 1) - 0.02);
      });
    }
    if (ruhig) {
      stelle(1);
    } else {
      var rechnet = false;
      function messen() {
        var r = zeitplan.getBoundingClientRect();
        var start = window.innerHeight * 0.85;
        var weg = r.height + window.innerHeight * 0.35;
        var f = Math.max(0, Math.min(1, (start - r.top) / weg));
        stelle(f);
        rechnet = false;
      }
      window.addEventListener("scroll", function () {
        if (rechnet) return;
        rechnet = true;
        requestAnimationFrame(messen);
      }, { passive: true });
      window.addEventListener("resize", messen);
      messen();
    }
  }

  /* 9. Formular: Prüfung und Versand */
  var form = document.getElementById("formular");
  if (!form) return;
  form.noValidate = true; // ohne Skript prüft der Browser selbst

  var email = document.getElementById("email");
  var emailFehler = document.getElementById("email-fehler");
  var einwilligung = document.getElementById("einwilligung");
  var einwilligungFehler = document.getElementById("einwilligung-fehler");
  var knopf = form.querySelector('button[type="submit"]');
  var knopfText = knopf.textContent;
  var gut = document.getElementById("meldung-gut");
  var vorschau = document.getElementById("meldung-vorschau");
  var fehler = document.getElementById("meldung-fehler");
  var honig = document.getElementById("email_address_check");
  var MUSTER = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setzeFehler(feld, ziel, text) {
    ziel.textContent = text;
    if (text) feld.setAttribute("aria-invalid", "true");
    else feld.removeAttribute("aria-invalid");
  }
  function pruefeEmail() {
    var wert = email.value.trim();
    if (!wert) { setzeFehler(email, emailFehler, "Bitte gib deine E-Mail-Adresse ein."); return false; }
    if (!MUSTER.test(wert)) { setzeFehler(email, emailFehler, "Diese Adresse sieht nicht vollständig aus. Beispiel: name@beispiel.ch"); return false; }
    setzeFehler(email, emailFehler, "");
    return true;
  }
  function pruefeEinwilligung() {
    if (!einwilligung.checked) { setzeFehler(einwilligung, einwilligungFehler, "Ohne dein Einverständnis können wir dir nicht schreiben."); return false; }
    setzeFehler(einwilligung, einwilligungFehler, "");
    return true;
  }
  email.addEventListener("blur", function () { if (email.value.trim()) pruefeEmail(); });
  email.addEventListener("input", function () { if (email.getAttribute("aria-invalid")) pruefeEmail(); });
  einwilligung.addEventListener("change", pruefeEinwilligung);

  var abflug = document.getElementById("abflug");
  function fertig(istVorschau) {
    fehler.hidden = true;
    vorschau.hidden = !istVorschau;
    if (abflug && !ruhig) abflug.classList.add("startet");
    form.hidden = true;
    gut.hidden = false;
    gut.focus();
  }

  form.addEventListener("submit", function (ereignis) {
    ereignis.preventDefault();
    fehler.hidden = true;
    var emailOk = pruefeEmail();
    var einwilligungOk = pruefeEinwilligung();
    if (!emailOk) { email.focus(); return; }
    if (!einwilligungOk) { einwilligung.focus(); return; }
    if (honig && honig.value) { fertig(false); return; }

    var ziel = form.getAttribute("action") || "";
    if (ziel.indexOf("BREVO_FORM_URL") !== -1) { fertig(true); return; }

    knopf.disabled = true;
    knopf.textContent = "Wird gesendet …";
    // Brevo antwortet ohne CORS-Freigabe: Antwort ist nicht lesbar, ein Netzfehler schon.
    fetch(ziel, { method: "POST", body: new FormData(form), mode: "no-cors" })
      .then(function () { fertig(false); })
      .catch(function () {
        fehler.hidden = false;
        knopf.disabled = false;
        knopf.textContent = knopfText;
      });
  });
})();
