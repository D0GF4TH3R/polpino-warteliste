/* Polpino Startseite: Auftritt der Figur und Mini-Chat der Beispiele. Ohne Skript bleibt alles sichtbar. */
(function () {
  'use strict';
  var wurzel = document.documentElement;
  var figur = document.querySelector('.figur');

  /* Auftritt: Polpino laeuft herein, schiebt die Wortmarke, danach uebernimmt die Schleife. */
  if (figur && wurzel.classList.contains('start')) {
    var auftritt = new Image(50, 50);
    var fertig = function () {
      wurzel.classList.remove('start', 'lauf', 'geschoben');
      if (auftritt.parentNode) auftritt.parentNode.removeChild(auftritt);
    };
    var notbremse = window.setTimeout(fertig, 4000);
    auftritt.className = 'auftritt';
    auftritt.alt = '';
    auftritt.onload = function () {
      window.clearTimeout(notbremse);
      figur.insertBefore(auftritt, figur.firstChild);
      wurzel.classList.add('lauf');
      window.setTimeout(function () { wurzel.classList.add('geschoben'); }, 3000);
      window.setTimeout(fertig, 8200);
    };
    auftritt.onerror = fertig;
    auftritt.src = '../assets/img/start/polpino-auftritt.webp';
  }

  /* Anmeldeseite: Vorschau, es wird nichts gesendet. */
  var senden = document.getElementById('senden');
  var hinweis = document.getElementById('hinweis');
  if (senden && hinweis) senden.addEventListener('click', function () { hinweis.hidden = false; });

  /* Mini-Chat: zeigt zu jedem Beispiel Auftrag und Ergebnis. */
  var chat = document.getElementById('chat');
  var frage = document.getElementById('chat-frage');
  var antwort = document.getElementById('chat-antwort');
  var beispiele = document.querySelectorAll('.bsp');
  if (!chat || !frage || !antwort) return;

  function zeige(knopf) {
    frage.textContent = knopf.getAttribute('data-frage');
    antwort.textContent = knopf.getAttribute('data-antwort');
    chat.hidden = false;
    for (var i = 0; i < beispiele.length; i += 1) beispiele[i].classList.toggle('offen', beispiele[i] === knopf);
  }
  function verbirg() {
    chat.hidden = true;
    for (var i = 0; i < beispiele.length; i += 1) beispiele[i].classList.remove('offen');
  }
  for (var i = 0; i < beispiele.length; i += 1) {
    (function (knopf) {
      knopf.addEventListener('mouseenter', function () { zeige(knopf); });
      knopf.addEventListener('focus', function () { zeige(knopf); });
      knopf.addEventListener('click', function (e) { e.preventDefault(); knopf.focus(); zeige(knopf); });
      knopf.addEventListener('mouseleave', function () { if (document.activeElement !== knopf) verbirg(); });
      knopf.addEventListener('blur', verbirg);
    })(beispiele[i]);
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') verbirg(); });
})();
