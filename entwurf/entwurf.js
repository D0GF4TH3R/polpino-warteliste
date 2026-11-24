/* Polpino Startseite, Entwurf: Auftritt der Figur, Faltfilme der Kacheln, Papierhandy mit Beispielchat.
   Ohne Skript oder mit reduzierter Bewegung bleibt alles sichtbar und ruhig. */
(function () {
  'use strict';
  var wurzel = document.documentElement;
  var bewegt = wurzel.classList.contains('bewegt');

  /* 1. Auftritt: Polpino schiebt die Wortmarke, danach die Schleife */
  var marke = document.querySelector('.marke');
  var auftritt = marke && marke.querySelector('.auftritt');
  var schleife = document.querySelector('.figur .schleife');
  if (bewegt && auftritt && schleife) {
    var schleifeSrc = schleife.getAttribute('src');
    schleife.removeAttribute('src');
    var fertig = false;
    var abschluss = function () {
      if (fertig) return;
      fertig = true;
      var zeigen = function () {
        wurzel.classList.remove('lauf');
        wurzel.classList.add('ruhe');
        schleife.style.opacity = '1';
        auftritt.style.visibility = 'hidden';
      };
      schleife.onload = zeigen;
      schleife.onerror = zeigen;
      schleife.setAttribute('src', schleifeSrc);
      if (schleife.complete && schleife.naturalWidth) zeigen();
    };
    var notbremse = window.setTimeout(abschluss, 4000);
    auftritt.onload = function () {
      window.clearTimeout(notbremse);
      wurzel.classList.add('lauf');
      window.setTimeout(abschluss, 10300);
    };
    auftritt.onerror = abschluss;
    auftritt.src = 'img/polpino-auftritt.webp';
  }

  /* 2. Kacheln: alle Faltfilme laden, dann gemeinsam starten */
  var bilder = Array.prototype.slice.call(document.querySelectorAll('.kachel img[data-film]'));
  if (bewegt) {
    var t0 = Date.now();
    var gestartet = false;
    var starten = function () {
      if (gestartet) return;
      gestartet = true;
      window.setTimeout(function () {
        bilder.forEach(function (b) { b.src = b.getAttribute('data-film'); });
        wurzel.classList.add('los');
      }, Math.max(0, 450 - (Date.now() - t0)));
    };
    var geladen = 0;
    bilder.forEach(function (b) {
      var vor = new Image();
      vor.onload = vor.onerror = function () { geladen += 1; if (geladen === bilder.length) starten(); };
      vor.src = b.getAttribute('data-film');
    });
    window.setTimeout(starten, 2500);
  }

  /* 3. Papierhandy mit Beispiel */
  var B = {
    zahnarzt: { name: 'Zahnarzt', du: 'Zahnarzt nächste Woche, gern vormittags.', ziel: 'Praxis Dr. Weber', fett: 'Dienstag 10:30', rest: 'bei Dr. Weber.', eintrag: 'Di 10:30, Zahnarzt Dr. Weber' },
    restaurant: { name: 'Restaurant', du: 'Freitag 19:30, Tisch für vier im Da Marco.', ziel: 'Da Marco', fett: 'Freitag 19:30', rest: 'im Da Marco, reserviert auf deinen Namen für vier.', eintrag: 'Fr 19:30, Da Marco, 4 Personen' },
    handwerker: { name: 'Handwerker', du: 'Der Sanitär soll wegen dem tropfenden Hahn vorbeikommen.', ziel: 'Sanitär Keller', fett: 'Donnerstag, 8 bis 10 Uhr:', rest: 'Firma Keller kommt vorbei.', eintrag: 'Do 8:00 bis 10:00, Sanitär Keller' },
    coiffeur: { name: 'Coiffeur', du: 'Coiffeur nächste Woche, am liebsten Dienstagabend.', ziel: 'Salon Mia', fett: 'Dienstag 18:00', rest: 'bei Salon Mia.', eintrag: 'Di 18:00, Coiffeur Salon Mia' },
    hotline: { name: 'Hotline', du: 'Frag beim Internetanbieter, wann der Techniker kommt.', ziel: 'Internetanbieter', warte: true, fett: 'Montag, 13 bis 15 Uhr:', rest: 'Der Techniker kommt vorbei.', eintrag: 'Mo 13:00 bis 15:00, Techniker' },
    paket: { name: 'Paket', du: 'Die Schuhe gehen zurück. Kannst du die Abholung organisieren?', ziel: 'Kundendienst des Shops', fett: 'Mittwoch:', rest: 'Der Shop holt das Paket ab. Das Etikett kommt per Mail.', eintrag: 'Mi, Abholung Paket' }
  };
  var ueber = document.getElementById('ueber');
  var handy = document.getElementById('handy');
  var verlauf = document.getElementById('verlauf');
  var zu = document.getElementById('zu');
  var uhren = [];
  var zuletzt = null;

  function el(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text) e.textContent = text;
    return e;
  }
  function blase(art, text, zeit, fett) {
    var p = el('p', 'blase auf ' + (art === 'du' ? 'blase-du' : 'blase-p'));
    if (fett) { var b = el('strong', '', fett); p.appendChild(b); p.appendChild(document.createTextNode(' ')); }
    p.appendChild(document.createTextNode(text));
    p.appendChild(el('span', 'zeit', zeit));
    return p;
  }
  function kalender(eintrag) {
    var d = el('div', 'kalender auf');
    d.innerHTML = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#3D5A6D" stroke-width="1.5"><rect x="2" y="3.5" width="14" height="12" rx="1.5"></rect><path d="M2 7h14M6 2v3M12 2v3M6.5 11l1.8 1.8 3.4-3.6"></path></svg>';
    var t = el('div');
    t.appendChild(el('b', '', 'Termin zum Antippen'));
    t.appendChild(el('span', '', eintrag));
    d.appendChild(t);
    return d;
  }
  function paletti() {
    var d = el('div', 'paletti auf');
    var i = el('img'); i.src = 'img/polpino.webp'; i.alt = ''; i.width = 40; i.height = 40;
    d.appendChild(i);
    d.appendChild(el('strong', '', 'Alles paletti.'));
    [[36, -2, 5, .6], [42, 8, 4, .75], [30, -8, 4, .9]].forEach(function (f) {
      var s = el('span', 'funke');
      s.style.left = f[0] + 'px'; s.style.top = f[1] + 'px'; s.style.width = s.style.height = f[2] + 'px'; s.style.animationDelay = f[3] + 's';
      d.appendChild(s);
    });
    return d;
  }

  function oeffnen(key, knopf) {
    var b = B[key];
    if (!b || !ueber) return;
    zuletzt = knopf;
    uhren.forEach(window.clearTimeout); uhren = [];
    verlauf.innerHTML = '';
    ueber.setAttribute('aria-label', 'Beispiel ' + b.name + ': so erledigt Polpino den Auftrag');
    ueber.hidden = false;
    handy.classList.remove('auf'); void handy.offsetWidth; handy.classList.add('auf');
    zu.focus();

    var status = el('div', 'status auf');
    var lampe = el('span', 'lampe');
    var statusText = el('span', '', 'Ruft ' + b.ziel + ' an');
    status.appendChild(lampe); status.appendChild(statusText);
    var espresso = el('img', 'espresso auf'); espresso.src = 'img/espresso.webp'; espresso.alt = '';

    var schritte = [
      function () { verlauf.appendChild(blase('du', b.du, '09:12')); },
      function () { verlauf.appendChild(blase('p', 'Mach ich, ich ruf gleich an.', '09:12')); },
      function () { verlauf.appendChild(status); },
      function () {
        if (b.warte) { verlauf.insertBefore(espresso, status); statusText.textContent = '8 Min. Warteschleife, Polpino bleibt dran'; }
        else statusText.textContent = 'Im Gespräch mit ' + b.ziel;
      },
      function () {
        if (espresso.parentNode) espresso.parentNode.removeChild(espresso);
        lampe.remove(); statusText.textContent = 'Anruf beendet';
        verlauf.appendChild(blase('p', b.rest, '09:17', b.fett));
      },
      function () { verlauf.appendChild(kalender(b.eintrag)); verlauf.appendChild(paletti()); }
    ];
    if (!bewegt) { schritte.forEach(function (s) { s(); }); return; }
    var zeiten = [0, 1000, 1900, 3100, 4400, 5400];
    schritte.forEach(function (s, i) { uhren.push(window.setTimeout(s, zeiten[i])); });
  }
  function schliessen() {
    uhren.forEach(window.clearTimeout); uhren = [];
    if (ueber) ueber.hidden = true;
    if (zuletzt) zuletzt.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll('.kachel'), function (k) {
    k.addEventListener('click', function () { oeffnen(k.getAttribute('data-bsp'), k); });
  });
  if (ueber) {
    ueber.addEventListener('click', function (e) { if (e.target === ueber) schliessen(); });
    zu.addEventListener('click', schliessen);
    document.addEventListener('keydown', function (e) {
      if (ueber.hidden) return;
      if (e.key === 'Escape') schliessen();
      if (e.key === 'Tab') { e.preventDefault(); zu.focus(); }
    });
  }
})();
