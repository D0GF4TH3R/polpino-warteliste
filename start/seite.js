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
     du: deine Nachricht (darf fehlen) · foto: Briefbild in deiner Blase · sprache: Dauer, dann zeigt das Overlay eine Sprachnachricht statt du · ack: Polpinos Antwort
     laeuft / danach: Statuszeile während und nach dem Anruf · fett + rest: Ergebnis · karte: «Termin zum Antippen»
     kalcheck: Zeile «Kalender geprüft» vor dem Anruf · anruf: Anrufbildschirm im Papierhandy, Ablehnen wird gedrückt
     frage + ja (+ nein): Schluss als Frage mit Knöpfen statt «Alles paletti.» · kurz: Wortlaut der Bühne am Desktop */
  var ARME = [
    { titel: 'Termin holen', unter: 'Sprachnachricht genügt. Polpino schaut in deinen Kalender und bucht, wo du frei hast.',
      sprache: '0:06', kalcheck: 'Dein Kalender: Dienstag vormittag frei', du: '«Zahnarzt nächschti Wuche, am liebschte am Morge.»', ack: 'Verstanden: «Zahnarzt nächschti Wuche, am liebschte am Morge.» Ich schau in deinen Kalender und ruf an.',
      laeuft: 'Ruft Praxis Dr. Weber an', fett: 'Dienstag 10:30', rest: 'bei Dr. Weber. Da hast du frei, also hab ich zugesagt.', karte: 'Di 10:30, Zahnarzt Dr. Weber',
      kurz: { anhang: 'Sprachnachricht, 0:06', status: 'Polpino schaut in deinen Kalender und ruft die Praxis an', ergebnis: 'Dienstag 10:30 bei Dr. Weber. Da hast du frei, also hab ich zugesagt. Der Termin zum Antippen kommt gleich.' } },
    { titel: 'Verschieben und absagen', unter: 'Der Anruf, den niemand gern macht.',
      du: 'Donnerstag klappt nicht. Verschieb den Coiffeur auf nächste Woche.', ack: 'Mach ich.',
      laeuft: 'Ruft den Coiffeur an', fett: 'Mittwoch 17:30', rest: 'statt Donnerstag. Der alte Termin ist abgesagt.', karte: 'Mi 17:30, Coiffeur',
      kurz: { status: 'Polpino ruft den Coiffeur an', ergebnis: 'Mittwoch 17:30 statt Donnerstag. Der alte Termin ist abgesagt.' } },
    { titel: 'Handwerker finden', unter: 'Polpino sucht die drei besten in deiner Nähe und ruft alle an.',
      du: 'Die Heizung tropft. Wer kann diese Woche kommen?', ack: 'Ich such dir die drei besten Installateure in der Nähe und ruf alle an.',
      laeuft: 'Ruft Installateure an, 2 von 3', fett: 'Keller kann Donnerstag um 8.', rest: 'Müller erst am Montag, Brunner ruft zurück.',
      frage: 'Soll ich den Termin bei Keller fixieren?', ja: 'Ja, fixieren',
      kurz: { status: 'Polpino sucht im Netz und ruft drei Installateure an', ergebnis: 'Keller kann Donnerstag um 8. Müller erst am Montag, Brunner ruft zurück. Soll ich den Termin bei Keller fixieren?' } },
    { titel: 'Hotline aussitzen', unter: 'Er wartet in der Schleife, du machst weiter.',
      du: 'Mein Internet spinnt. Meld das der Hotline.', ack: 'Mach ich. Die Warteschleife übernehme ich.',
      laeuft: 'In der Warteschleife, Position 4', fett: 'Störung gemeldet.', rest: 'Ein Techniker meldet sich bis morgen Mittag.',
      kurz: { status: 'In der Warteschleife, Position 4', ergebnis: 'Störung gemeldet. Ein Techniker meldet sich bis morgen Mittag.' } },
    { titel: 'Anruf abgeben', unter: 'Keine Lust auf den Anruf? Rot drücken, Polpino nimmt ab.', anruf: 'Unbekannte Nummer',
      ack: 'Ich geh ran und frag, worum es geht.',
      laeuft: 'Nimmt den Anruf für dich an', fett: 'Garage Huber', rest: 'will den Reifenwechsel verschieben und bittet um Rückruf.',
      frage: 'Wer ruft zurück?', ja: 'Polpino ruft zurück', nein: 'Ich ruf selbst an',
      kurz: { status: 'Polpino nimmt für dich ab', ergebnis: 'Garage Huber will den Reifenwechsel verschieben und bittet um Rückruf. Soll ich zurückrufen?' } },
    { titel: 'Im Ausland', unter: 'Du schreibst Deutsch. Polpino spricht vor Ort Italienisch, Französisch, Spanisch, Portugiesisch oder Englisch.',
      du: 'Wir sind in Rom. Reservier heute um acht einen Tisch für vier, Trattoria Da Piero.', ack: 'Mach ich. Ich rufe auf Italienisch an.',
      laeuft: 'Ruft die Trattoria an, auf Italienisch', fett: 'Tisch für vier, heute 20:00.', rest: 'Reserviert auf deinen Namen. Das Gespräch lief auf Italienisch.', karte: 'Heute 20:00, Trattoria Da Piero',
      kurz: { status: 'Polpino ruft in Rom an und spricht Italienisch', ergebnis: 'Tisch für vier, heute um 20:00, auf deinen Namen. Das Gespräch lief auf Italienisch. Buon appetito!' } },
    { titel: 'Paket suchen', unter: 'Oder fragen, ob offen, vorrätig oder fertig ist.',
      du: 'Wo steckt mein Paket?', ack: 'Ich frag nach.',
      laeuft: 'Ruft die Post an', fett: 'Liegt in der Filiale am Bahnhof.', rest: 'Abholen kannst du es bis Samstag.',
      kurz: { status: 'Polpino ruft die Post an', ergebnis: 'Liegt in der Filiale am Bahnhof. Abholen kannst du es bis Samstag.' } },
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
  function sprachblase(dauer, zeit) {
    var p = el('p', 'blase auf blase-du sprachblase');
    p.innerHTML = '<svg aria-hidden="true" width="120" height="22" viewBox="0 0 120 22"><path d="M2 4l9 7-9 7z" fill="currentColor"/><g fill="currentColor" opacity=".55"><rect x="18" y="8" width="3" height="6" rx="1.5"/><rect x="24" y="5" width="3" height="12" rx="1.5"/><rect x="30" y="2" width="3" height="18" rx="1.5"/><rect x="36" y="6" width="3" height="10" rx="1.5"/><rect x="42" y="4" width="3" height="14" rx="1.5"/><rect x="48" y="8" width="3" height="6" rx="1.5"/><rect x="54" y="3" width="3" height="16" rx="1.5"/><rect x="60" y="6" width="3" height="10" rx="1.5"/><rect x="66" y="9" width="3" height="4" rx="1.5"/><rect x="72" y="5" width="3" height="12" rx="1.5"/><rect x="78" y="7" width="3" height="8" rx="1.5"/><rect x="84" y="4" width="3" height="14" rx="1.5"/><rect x="90" y="8" width="3" height="6" rx="1.5"/><rect x="96" y="6" width="3" height="10" rx="1.5"/><rect x="102" y="9" width="3" height="4" rx="1.5"/></g></svg>';
    p.appendChild(el('span', 'sprachdauer', dauer));
    p.appendChild(el('span', 'zeit', zeit));
    return p;
  }
  function kalcheck(text) {
    var d = el('div', 'kalcheck auf');
    d.innerHTML = '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3.5" width="14" height="12" rx="1.5"></rect><path d="M2 7h14M6 2v3M12 2v3"></path></svg>';
    d.appendChild(el('span', '', text));
    return d;
  }
  function hinweis(text) { return el('div', 'status hinweis auf', text); }
  var HOERER = '<svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>';
  function anrufSchirm(wer) {
    var d = el('div', 'anruf-schirm');
    d.setAttribute('aria-hidden', 'true');
    d.appendChild(el('span', 'anruf-klein', 'Eingehender Anruf'));
    d.appendChild(el('b', 'anruf-wer', wer));
    d.appendChild(el('span', 'anruf-klein', 'Mobil'));
    var k = el('div', 'anruf-knoepfe');
    [['ab', 'Ablehnen'], ['an', 'Annehmen']].forEach(function (x) {
      var w = el('span', 'anruf-wahl');
      var b = el('span', 'anruf-knopf ' + x[0]);
      b.innerHTML = HOERER;
      w.appendChild(b); w.appendChild(el('span', 'anruf-klein', x[1]));
      k.appendChild(w);
    });
    d.appendChild(k);
    return d;
  }
  function rueckfrage(text, ja, nein) {
    var d = el('div', 'rueckfrage auf');
    d.appendChild(el('span', '', text));
    var k = el('span', 'scheinknoepfe');
    k.appendChild(el('span', 'scheinknopf ja', ja));
    k.appendChild(el('span', 'scheinknopf', nein || 'Nein'));
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
      if (a.sprache) { verlauf.appendChild(sprachblase(a.sprache, '09:12')); return; }
      var p = blase('du', a.du, '09:12');
      if (a.foto) p.insertBefore(brief(), p.firstChild);
      verlauf.appendChild(p);
    });
    if (!a.du && a.anruf) schritte.push(function () { verlauf.appendChild(hinweis('Anruf weggedrückt, Polpino übernimmt')); });
    schritte.push(function () { verlauf.appendChild(blase('p', a.ack, '09:12')); });
    if (!a.du && !a.anruf) schritte.push(function () {});
    schritte.push(function () {
      if (a.kalcheck) verlauf.appendChild(kalcheck(a.kalcheck));
      verlauf.appendChild(status);
    });
    schritte.push(function () {
      lampe.remove(); statusText.textContent = a.danach || 'Anruf beendet';
      verlauf.appendChild(blase('p', a.rest, '09:17', a.fett));
    });
    schritte.push(function () {
      if (a.karte) verlauf.appendChild(kalender(a.karte));
      verlauf.appendChild(a.frage ? rueckfrage(a.frage, a.ja, a.nein) : paletti());
    });
    var alterSchirm = handy.querySelector('.anruf-schirm');
    if (alterSchirm) alterSchirm.remove();
    if (!bewegt) { schritte.forEach(function (s) { s(); }); return; }
    /* Anruf abgeben: erst klingelt es, Ablehnen wird gedrückt, dann läuft der Chat wie sonst (alles 2'000 ms später) */
    var vorlauf = 0;
    if (a.anruf) {
      vorlauf = 2000;
      var schirm = anrufSchirm(a.anruf);
      handy.querySelector('.schirm').appendChild(schirm);
      uhren.push(window.setTimeout(function () { schirm.querySelector('.ab').classList.add('gedrueckt'); }, 1000));
      uhren.push(window.setTimeout(function () { schirm.classList.add('weg'); }, 1600));
      uhren.push(window.setTimeout(function () { schirm.remove(); }, 2000));
    }
    var zeiten = [0, 1000, 1900, 4400, 5400];
    schritte.forEach(function (s, n) { uhren.push(window.setTimeout(s, vorlauf + zeiten[n])); });
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
      function () { chat.appendChild(a.du ? kurzBlase(a.du, true, a.kurz.anhang) : a.anruf ? kurzBlase('Du drückst den Anruf weg.', true, a.anruf) : kurzBlase(a.ack, false)); },
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
