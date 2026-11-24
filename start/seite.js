if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.documentElement.classList.add('bewegt');
document.documentElement.classList.add('js');

/* Polpino Startseite «acht Arme»: Auftritt der Figur, acht Arme mit Origami-Overlay (Handy) oder Bühne (Desktop).
   Ohne Skript oder mit reduzierter Bewegung bleibt alles sichtbar und ruhig: Die Klasse bewegt setzt nur
   die erste Zeile dieser Datei. Fällt die Datei aus, gilt der ruhige Zustand. */
(function () {
  'use strict';
  var wurzel = document.documentElement;
  var bewegt = wurzel.classList.contains('bewegt');

  /* 1. Auftritt: Polpino schiebt die Wortmarke, danach die Schleife. Im HTML steht nur das ruhige Standbild;
     die Schleife (data-schleife) wird erst nach dem Auftritt geladen. Bis sie da ist, bleibt das letzte Bild
     des Auftritts stehen. */
  var marke = document.querySelector('.marke');
  var schleife = document.querySelector('.figur .schleife');
  if (bewegt && marke && schleife) {
    var auftritt = document.createElement('img');
    auftritt.className = 'auftritt';
    auftritt.alt = '';
    auftritt.width = 214;
    auftritt.height = 50;
    marke.insertBefore(auftritt, marke.firstChild);
    var schleifeSrc = schleife.getAttribute('data-schleife');
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
      var ruhig = schleife.getAttribute('src');
      schleife.onload = zeigen;
      schleife.onerror = function () { schleife.onload = schleife.onerror = null; schleife.setAttribute('src', ruhig); zeigen(); };
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
    auftritt.src = 'start/img/polpino-auftritt.webp';
  }

  /* 2. Die acht Arme: einzige Datenquelle für Overlay (Handy) und Bühne (Desktop). Reihenfolge = Knöpfe data-arm 0 bis 7.
     Kachelwort und Icon stehen im HTML (sichtbar auch ohne Skript), alles andere hier.
     du: deine Nachricht (fehlt bei Arm 7) · foto: Briefbild in deiner Blase · ack: Polpinos Antwort
     laeuft / danach: Statuszeile während und nach dem Anruf · fett + rest: Ergebnis · karte: «Termin zum Antippen»
     frage + ja: Schluss als Frage mit Knöpfen statt «Alles paletti.» · kurz: Wortlaut der Bühne am Desktop */
  var ARME = [
    { titel: 'Termin holen', unter: 'Zahnarzt, Coiffeur, Garage oder der Tisch am Freitag.',
      du: 'Zahnarzt nächste Woche, gern vormittags.', ack: 'Mach ich, ich ruf gleich an.',
      laeuft: 'Ruft Praxis Dr. Weber an', fett: 'Dienstag 10:30', rest: 'bei Dr. Weber.', karte: 'Di 10:30, Zahnarzt Dr. Weber',
      kurz: { status: 'Polpino ruft die Praxis an', ergebnis: 'Dienstag 10:30 bei Dr. Weber. Der Termin zum Antippen kommt gleich.' } },
    { titel: 'Verschieben und absagen', unter: 'Der Anruf, den niemand gern macht.',
      du: 'Donnerstag klappt nicht. Verschieb den Coiffeur auf nächste Woche.', ack: 'Mach ich.',
      laeuft: 'Ruft den Coiffeur an', fett: 'Mittwoch 17:30', rest: 'statt Donnerstag. Der alte Termin ist abgesagt.', karte: 'Mi 17:30, Coiffeur',
      kurz: { status: 'Polpino ruft den Coiffeur an', ergebnis: 'Mittwoch 17:30 statt Donnerstag. Der alte Termin ist abgesagt.' } },
    { titel: 'Abklären, wer Zeit hat', unter: 'Du fragst einmal, Polpino ruft mehrere Betriebe an.',
      du: 'Die Heizung tropft. Wer kann diese Woche kommen?', ack: 'Ich klär das ab und ruf drei Installateure an.',
      laeuft: 'Ruft Installateure an, 2 von 3', fett: 'Keller kann Donnerstag um 8.', rest: 'Müller erst am Montag, Brunner ruft zurück.',
      frage: 'Soll ich den Termin bei Keller fixieren?', ja: 'Ja, fixieren',
      kurz: { status: 'Polpino ruft Installateure an, 2 von 3', ergebnis: 'Keller kann Donnerstag um 8. Müller erst am Montag, Brunner ruft zurück. Soll ich den Termin bei Keller fixieren?' } },
    { titel: 'Warteschleife aussitzen', unter: 'Er wartet, du machst weiter.',
      du: 'Mein Internet spinnt. Meld das der Hotline.', ack: 'Mach ich. Die Warteschleife übernehme ich.',
      laeuft: 'In der Warteschleife, Position 4', fett: 'Störung gemeldet.', rest: 'Ein Techniker meldet sich bis morgen Mittag.',
      kurz: { status: 'In der Warteschleife, Position 4', ergebnis: 'Störung gemeldet. Ein Techniker meldet sich bis morgen Mittag.' } },
    { titel: 'Auskunft holen', unter: 'Offen? Vorrätig? Fertig? Unterwegs?',
      du: 'Wo steckt mein Paket?', ack: 'Ich frag nach.',
      laeuft: 'Ruft die Post an', fett: 'Liegt in der Filiale am Bahnhof.', rest: 'Abholen kannst du es bis Samstag.',
      kurz: { status: 'Polpino ruft die Post an', ergebnis: 'Liegt in der Filiale am Bahnhof. Abholen kannst du es bis Samstag.' } },
    { titel: 'Dranbleiben', unter: 'Niemand nimmt ab? Polpino probiert es später nochmal.',
      du: 'Frag im Veloladen, ob mein Velo fertig ist.', ack: 'Mach ich, ich ruf gleich an.',
      laeuft: 'Ruft den Veloladen an', danach: 'Niemand nimmt ab', fett: 'Der Laden öffnet um 9.', rest: 'Ich bleib dran.',
      frage: 'Soll ich um 9 nochmal anrufen?', ja: 'Ja, um 9',
      kurz: { status: 'Niemand nimmt ab, der Laden öffnet um 9', ergebnis: 'Soll ich um 9 nochmal anrufen? Ein Daumen genügt.' } },
    { titel: 'Rückruf annehmen', unter: 'Die Praxis ruft zurück, du sitzt im Meeting.',
      ack: 'Die Praxis ruft gerade zurück. Ich geh ran.',
      laeuft: 'Nimmt den Rückruf an', fett: 'Dienstag 10 Uhr', rest: 'passt der Praxis.', karte: 'Di 10:00, Praxis Dr. Weber',
      kurz: { status: 'Polpino nimmt den Rückruf an', ergebnis: 'Dienstag 10 Uhr passt der Praxis. Der Termin zum Antippen kommt gleich.' } },
    { titel: 'Foto genügt', unter: 'Brief oder Visitenkarte knipsen, Polpino liest und ruft an.',
      foto: true, du: 'Die wollen einen Termin für den Zählerwechsel.', ack: 'Gelesen. Ich ruf die Stadtwerke an.',
      laeuft: 'Ruft die Stadtwerke an', fett: 'Donnerstag, 9 bis 12 Uhr', rest: 'wäre frei.',
      frage: 'Passt das? Dann sag ich zu.', ja: 'Ja, zusagen',
      kurz: { anhang: 'Foto: Brief der Stadtwerke', status: 'Polpino liest den Brief und ruft an', ergebnis: 'Donnerstag, 9 bis 12 Uhr wäre frei. Passt das? Dann sag ich zu.' } }
  ];
  var knoepfe = Array.prototype.slice.call(document.querySelectorAll('.arm[data-arm]'));
  knoepfe.forEach(function (k) {
    var a = ARME[+k.getAttribute('data-arm')];
    if (a) k.setAttribute('aria-label', 'Beispiel ' + a.titel + ' ansehen');
  });
  var desktop = window.matchMedia('(min-width: 900px)'); /* gleiche Schwelle wie in entwurf.css */
  function zahl(i) { return 'Arm ' + (i + 1) + ' von ' + ARME.length; }

  function el(tag, klasse, text) {
    var e = document.createElement(tag);
    if (klasse) e.className = klasse;
    if (text) e.textContent = text;
    return e;
  }

  /* 3. Handy: Papierhandy mit Beispiel (Overlay) */
  var ueber = document.getElementById('ueber');
  var handy = document.getElementById('handy');
  var verlauf = document.getElementById('verlauf');
  var zu = document.getElementById('zu');
  var uhren = [];
  var zuletzt = null;

  function blase(art, text, zeit, fett) {
    var p = el('p', 'blase auf ' + (art === 'du' ? 'blase-du' : 'blase-p'));
    if (fett) { var b = el('strong', '', fett); p.appendChild(b); p.appendChild(document.createTextNode(' ')); }
    p.appendChild(document.createTextNode(text));
    p.appendChild(el('span', 'zeit', zeit));
    return p;
  }
  function brief() {
    var b = el('span', 'brief');
    b.setAttribute('aria-hidden', 'true');
    ['brief-kopf', '', '', 'brief-kurz'].forEach(function (k) { b.appendChild(el('span', k)); });
    return b;
  }
  function kalender(eintrag) {
    var d = el('div', 'kalender auf');
    d.innerHTML = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3.5" width="14" height="12" rx="1.5"></rect><path d="M2 7h14M6 2v3M12 2v3M6.5 11l1.8 1.8 3.4-3.6"></path></svg>';
    var t = el('div');
    t.appendChild(el('b', '', 'Termin zum Antippen'));
    t.appendChild(el('span', '', eintrag));
    d.appendChild(t);
    return d;
  }
  function paletti() {
    var d = el('div', 'paletti auf');
    var i = el('img'); i.src = 'start/img/polpino.webp'; i.alt = ''; i.width = 40; i.height = 40;
    d.appendChild(i);
    d.appendChild(el('strong', '', 'Alles paletti.'));
    [[36, -2, 5, .6], [42, 8, 4, .75], [30, -8, 4, .9]].forEach(function (f) {
      var s = el('span', 'funke');
      s.style.left = f[0] + 'px'; s.style.top = f[1] + 'px'; s.style.width = s.style.height = f[2] + 'px'; s.style.animationDelay = f[3] + 's';
      d.appendChild(s);
    });
    return d;
  }
  function rueckfrage(text, ja) {
    var d = el('div', 'rueckfrage auf');
    d.appendChild(el('span', '', text));
    var k = el('span', 'scheinknoepfe');
    k.appendChild(el('span', 'scheinknopf ja', ja));
    k.appendChild(el('span', 'scheinknopf', 'Nein'));
    d.appendChild(k);
    return d;
  }

  function massstab() {
    if (handy && !ueber.hidden) handy.style.setProperty('--s', String(handy.offsetHeight / 577));
  }
  function oeffnen(i, knopf) {
    var a = ARME[i];
    if (!a || !ueber) return;
    zuletzt = knopf;
    uhren.forEach(window.clearTimeout); uhren = [];
    verlauf.innerHTML = '';
    document.getElementById('ueber-zahl').textContent = zahl(i);
    document.getElementById('ueber-name').textContent = a.titel;
    document.getElementById('ueber-unter').textContent = a.unter;
    ueber.hidden = false;
    wurzel.style.overflow = 'hidden';
    ueber.scrollTop = 0;
    massstab();
    handy.classList.remove('auf'); void handy.offsetWidth; handy.classList.add('auf');
    zu.focus();

    var status = el('div', 'status auf');
    var lampe = el('span', 'lampe');
    var statusText = el('span', '', a.laeuft);
    status.appendChild(lampe); status.appendChild(statusText);

    /* Zeiten wie bisher: deine Blase 0, Polpino 1'000, Status 1'900, Ergebnis 4'400, Schluss 5'400 ms.
       Ohne deine Blase (Arm 7) kommt Polpino schon beim ersten Schritt. */
    var schritte = [];
    if (a.du) schritte.push(function () {
      var p = blase('du', a.du, '09:12');
      if (a.foto) p.insertBefore(brief(), p.firstChild);
      verlauf.appendChild(p);
    });
    schritte.push(function () { verlauf.appendChild(blase('p', a.ack, '09:12')); });
    if (!a.du) schritte.push(function () {});
    schritte.push(function () { verlauf.appendChild(status); });
    schritte.push(function () {
      lampe.remove(); statusText.textContent = a.danach || 'Anruf beendet';
      verlauf.appendChild(blase('p', a.rest, '09:17', a.fett));
    });
    schritte.push(function () {
      if (a.karte) verlauf.appendChild(kalender(a.karte));
      verlauf.appendChild(a.frage ? rueckfrage(a.frage, a.ja) : paletti());
    });
    if (!bewegt) { schritte.forEach(function (s) { s(); }); return; }
    var zeiten = [0, 1000, 1900, 4400, 5400];
    schritte.forEach(function (s, n) { uhren.push(window.setTimeout(s, zeiten[n])); });
  }
  function schliessen() {
    uhren.forEach(window.clearTimeout); uhren = [];
    if (!ueber || ueber.hidden) return;
    ueber.hidden = true;
    wurzel.style.overflow = '';
    if (zuletzt) zuletzt.focus();
  }

  /* Bilder des Overlays laden erst bei Interesse an einem Arm (Hover, Fokus, Berührung), nur am Handy */
  var vorgeladen = false;
  function vorladen() {
    if (vorgeladen || desktop.matches) return;
    vorgeladen = true;
    ['start/img/handy.webp', 'start/img/polpino.webp'].forEach(function (s) { var b = new Image(); b.src = s; });
  }

  /* 4. Desktop: Bühne mit Kurz-Chat, Auswahl per Maus, Fokus oder Klick, Rundgang bis zur ersten Eingabe */
  var buehne = document.getElementById('buehne');
  var chat = document.getElementById('buehne-chat');
  var gewaehlt = -1;
  var buehnenUhren = [];
  var beruehrt = false;

  function kurzBlase(text, du, anhang) {
    var p = el('p', 'kurz-blase rein' + (du ? ' kurz-du' : ''));
    if (anhang) p.appendChild(el('span', 'kurz-anhang', anhang));
    p.appendChild(document.createTextNode(text));
    return p;
  }
  function waehlen(i, vonHand) {
    if (vonHand && !beruehrt) { beruehrt = true; buehne.setAttribute('aria-live', 'polite'); }
    if (i === gewaehlt) return;
    gewaehlt = i;
    var a = ARME[i];
    buehnenUhren.forEach(window.clearTimeout); buehnenUhren = [];
    knoepfe.forEach(function (k, n) { k.setAttribute('aria-pressed', n === i ? 'true' : 'false'); });
    document.getElementById('buehne-zahl').textContent = zahl(i);
    document.getElementById('buehne-titel').textContent = a.titel;
    document.getElementById('buehne-unter').textContent = a.unter;
    chat.innerHTML = '';
    var punkt = el('span', 'kurz-punkt');
    var status = el('p', 'kurz-status rein');
    status.appendChild(punkt); status.appendChild(document.createTextNode(a.kurz.status));
    var schritte = [
      function () { chat.appendChild(a.du ? kurzBlase(a.du, true, a.kurz.anhang) : kurzBlase(a.ack, false)); },
      function () { chat.appendChild(status); },
      function () { punkt.classList.add('fertig'); chat.appendChild(kurzBlase(a.kurz.ergebnis, false)); }
    ];
    if (!bewegt) { schritte.forEach(function (s) { s(); }); return; }
    [350, 1400, 3200].forEach(function (t, n) { buehnenUhren.push(window.setTimeout(schritte[n], t)); });
    /* Rundgang: alle 7.4 s ein Arm weiter, bis zur ersten Eingabe */
    buehnenUhren.push(window.setTimeout(function () { if (!beruehrt && desktop.matches) waehlen((i + 1) % ARME.length, false); }, 7400));
  }
  function buehneStoppen() {
    buehnenUhren.forEach(window.clearTimeout); buehnenUhren = [];
    gewaehlt = -1;
    knoepfe.forEach(function (k) { k.removeAttribute('aria-pressed'); });
  }

  /* 5. Umschalten zwischen Handy und Desktop */
  function modus() {
    if (desktop.matches) {
      schliessen();
      knoepfe.forEach(function (k) { k.removeAttribute('aria-haspopup'); });
      if (gewaehlt < 0) waehlen(0, false);
    } else {
      buehneStoppen();
      knoepfe.forEach(function (k) { k.setAttribute('aria-haspopup', 'dialog'); });
    }
  }
  if (desktop.addEventListener) desktop.addEventListener('change', modus); else desktop.addListener(modus);
  modus();

  knoepfe.forEach(function (k) {
    var i = +k.getAttribute('data-arm');
    k.addEventListener('click', function () { if (desktop.matches) waehlen(i, true); else oeffnen(i, k); });
    k.addEventListener('pointerenter', function (e) { if (desktop.matches && e.pointerType === 'mouse') waehlen(i, true); else vorladen(); });
    k.addEventListener('focus', function () { if (desktop.matches) waehlen(i, true); else vorladen(); });
    k.addEventListener('touchstart', vorladen, { passive: true });
  });
  if (ueber) {
    ueber.addEventListener('click', function (e) { if (e.target === ueber) schliessen(); });
    zu.addEventListener('click', schliessen);
    window.addEventListener('resize', massstab);
    document.addEventListener('keydown', function (e) {
      if (ueber.hidden) return;
      if (e.key === 'Escape') schliessen();
      if (e.key === 'Tab') { e.preventDefault(); zu.focus(); }
    });
  }
})();
