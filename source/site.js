/* Mazzucco Events — shared behaviour: intro loader, mobile menu, Radio Mazzucco. */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Pause Lorenzo's spinning pizza for visitors who prefer less motion */
  if (reduce) document.querySelectorAll("svg").forEach(function (s) { if (s.pauseAnimations) try { s.pauseAnimations(); } catch (e) {} });

  /* ---------- Intro loader (home page only) ---------- */
  var loader = document.getElementById("loader");
  if (loader) {
    var seen = false;
    try { seen = sessionStorage.getItem("mzc-intro") === "1"; } catch (e) {}
    if (seen) loader.remove();
    else {
      drawPizza(document.getElementById("pizzaSpin"), 230);
      var done = false;
      var finish = function () { if (done) return; done = true; loader.classList.add("out"); try { sessionStorage.setItem("mzc-intro", "1"); } catch (e) {} setTimeout(function () { loader.remove(); }, 900); };
      setTimeout(function () { loader.classList.add("show-mark"); }, reduce ? 50 : 900);
      setTimeout(finish, reduce ? 900 : 2800);
      loader.addEventListener("click", finish);
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") finish(); }, { once: true });
    }
  }
  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function blob(ctx, x, y, r, rand, wob) { ctx.beginPath(); for (var i = 0; i <= 14; i++) { var a = (i / 14) * Math.PI * 2, rr = r * (1 - wob / 2 + rand() * wob), px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); } ctx.closePath(); }
  function drawPizza(cvs, css) {
    if (!cvs) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1); cvs.width = css * dpr; cvs.height = css * dpr;
    var ctx = cvs.getContext("2d"); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var c = css / 2, R = css / 2 * 0.95, rand = rng(20050103), i;
    var g = ctx.createRadialGradient(c, c, R * 0.7, c, c, R); g.addColorStop(0, "#E8B66E"); g.addColorStop(0.75, "#D79A4F"); g.addColorStop(1, "#A9662B");
    ctx.fillStyle = g; blob(ctx, c, c, R, rand, 0.03); ctx.fill();
    for (i = 0; i < 46; i++) { var a = rand() * Math.PI * 2, rr = R * (0.86 + rand() * 0.11); ctx.fillStyle = "rgba(55,28,10," + (0.35 + rand() * 0.4) + ")"; ctx.beginPath(); ctx.ellipse(c + Math.cos(a) * rr, c + Math.sin(a) * rr, R * (0.012 + rand() * 0.02), R * (0.01 + rand() * 0.012), a, 0, Math.PI * 2); ctx.fill(); }
    var sg = ctx.createRadialGradient(c, c, 0, c, c, R * 0.82); sg.addColorStop(0, "#D2442B"); sg.addColorStop(1, "#A9230F");
    ctx.fillStyle = sg; blob(ctx, c, c, R * 0.8, rand, 0.05); ctx.fill();
    [[-.35,-.28,.17],[.22,-.38,.14],[.4,.1,.16],[.05,.05,.15],[-.42,.22,.13],[-.08,.45,.15],[.3,.44,.11],[-.15,-.55,.1],[.55,-.2,.09]].forEach(function (m) {
      var x = c + m[0] * R, y = c + m[1] * R, r = m[2] * R;
      ctx.fillStyle = "rgba(90,25,10,0.25)"; blob(ctx, x + r * 0.08, y + r * 0.12, r, rand, 0.25); ctx.fill();
      var mg = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); mg.addColorStop(0, "#FFFFFF"); mg.addColorStop(0.7, "#F7F0E1"); mg.addColorStop(1, "#E9D9BC");
      ctx.fillStyle = mg; blob(ctx, x, y, r, rand, 0.25); ctx.fill();
    });
    [[-.12,-.22],[.15,-.12],[.5,-.42],[-.55,-.05],[.18,.28],[-.3,.5],[.55,.32],[-.25,.08],[.0,-.4],[.38,-.2]].forEach(function (t) {
      var x = c + t[0] * R, y = c + t[1] * R, r = R * 0.062;
      ctx.fillStyle = "#C8250F"; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#EC5B3E"; ctx.beginPath(); ctx.arc(x, y, r * 0.72, 0, Math.PI * 2); ctx.fill();
    });
    [[-.02,-.08,.6],[.32,-.02,-.9],[-.38,-.38,2.1],[.12,.52,.2],[-.5,.38,-.4],[.42,-.52,1.2]].forEach(function (b) {
      var L = R * 0.13; ctx.save(); ctx.translate(c + b[0] * R, c + b[1] * R); ctx.rotate(b[2]);
      var bg = ctx.createLinearGradient(-L, 0, L, 0); bg.addColorStop(0, "#1E5A2A"); bg.addColorStop(1, "#3E8C45"); ctx.fillStyle = bg;
      ctx.beginPath(); ctx.moveTo(-L, 0); ctx.quadraticCurveTo(0, -L * 0.62, L, 0); ctx.quadraticCurveTo(0, L * 0.62, -L, 0); ctx.fill(); ctx.restore();
    });
    ctx.strokeStyle = "rgba(60,25,8,0.35)"; ctx.lineWidth = 1.2;
    for (i = 0; i < 4; i++) { var ca = i * Math.PI / 4 + 0.2; ctx.beginPath(); ctx.moveTo(c + Math.cos(ca) * R * 0.97, c + Math.sin(ca) * R * 0.97); ctx.lineTo(c - Math.cos(ca) * R * 0.97, c - Math.sin(ca) * R * 0.97); ctx.stroke(); }
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menuBtn"), navList = document.getElementById("navList");
  if (menuBtn && navList) {
    menuBtn.addEventListener("click", function () { var o = navList.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); });
    navList.addEventListener("click", function (e) { if (e.target.tagName === "A") { navList.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); } });
  }

  /* ---------- Radio Mazzucco ----------
     RADIO_STREAM: paste the URL of a licensed live stream (e.g. your own web radio,
     with SACEM/SCPP rights covered) to broadcast it. Left empty, the player performs
     an original tarantella composed for Mazzucco, synthesised live in the browser. */
  var RADIO_STREAM = "";
  var RADIO_TITLE = "Tarantella Mazzucco";
  var radio = document.getElementById("radio");
  if (!radio) return;
  var btn = document.getElementById("radioPlay"), vol = document.getElementById("radioVol"), trackEl = document.getElementById("radioTrack");
  var ICON_PLAY = '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M5 3l10 6-10 6z" fill="currentColor"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4 3h3.5v12H4zM10.5 3H14v12h-3.5z" fill="currentColor"/></svg>';
  var playing = false, audioEl = null, ctx = null, master = null, timer = null, step = 0, nextTime = 0;
  trackEl.textContent = RADIO_STREAM ? "En direct" : RADIO_TITLE;

  // 16 bars of 6/8, one entry per eighth note (MIDI numbers, null = rest)
  var MEL = [76,76,76,74,72,71, 72,69,69,69,71,72, 74,74,74,72,71,69, 71,68,68,68,69,71,
             76,76,76,77,76,74, 72,72,72,74,72,71, 71,72,74,72,71,68, 69,null,null,69,null,null,
             79,79,79,77,76,74, 76,72,72,72,74,76, 77,77,77,76,74,72, 74,71,71,71,72,74,
             76,76,76,79,77,76, 77,81,81,81,79,77, 76,74,72,74,71,67, 71,null,null,68,null,null];
  var CH = { Am: [[45, 52], [57, 60, 64]], Dm: [[38, 45], [57, 62, 65]], E: [[40, 47], [56, 59, 64]], C: [[48, 43], [55, 60, 64]], G: [[43, 50], [55, 59, 62]], F: [[41, 48], [57, 60, 65]] };
  var PROG = ["Am","Am","Dm","E","Am","Am","E","Am","C","C","G","G","C","F","G","E"];
  var EIGHTH = 0.15;
  function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function pluck(t, m, len) {
    var n = 3, d = len / n;
    for (var k = 0; k < n; k++) {
      var tt = t + k * d;
      [0, 7].forEach(function (cents) {
        var o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sawtooth"; o.frequency.value = hz(m); o.detune.value = cents;
        g.gain.setValueAtTime(0.0001, tt); g.gain.exponentialRampToValueAtTime(k === 0 ? 0.07 : 0.045, tt + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, tt + d * 1.15);
        o.connect(g); g.connect(ctx._mel); o.start(tt); o.stop(tt + d * 1.2);
      });
    }
  }
  function bass(t, m) {
    var o = ctx.createOscillator(), g = ctx.createGain(); o.type = "triangle"; o.frequency.value = hz(m);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.32, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.32);
  }
  function stab(t, notes) {
    notes.forEach(function (m) {
      var o = ctx.createOscillator(), g = ctx.createGain(); o.type = "square"; o.frequency.value = hz(m);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.022, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
      o.connect(g); g.connect(ctx._pad); o.start(t); o.stop(t + 0.1);
    });
  }
  function schedule() {
    while (nextTime < ctx.currentTime + 0.15) {
      var bar = Math.floor(step / 6) % 16, beat = step % 6, chord = CH[PROG[bar]], note = MEL[step % 96];
      if (note) pluck(nextTime, note, EIGHTH);
      if (beat === 0) bass(nextTime, chord[0][0]);
      else if (beat === 3) bass(nextTime, chord[0][1]);
      else stab(nextTime, chord[1]);
      nextTime += EIGHTH; step++;
    }
  }
  function startSynth() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) { trackEl.textContent = "Audio non disponible"; return false; }
      ctx = new AC();
      var comp = ctx.createDynamicsCompressor(); comp.connect(ctx.destination);
      master = ctx.createGain(); master.connect(comp);
      ctx._mel = ctx.createBiquadFilter(); ctx._mel.type = "lowpass"; ctx._mel.frequency.value = 2600; ctx._mel.connect(master);
      ctx._pad = ctx.createBiquadFilter(); ctx._pad.type = "lowpass"; ctx._pad.frequency.value = 1400; ctx._pad.connect(master);
    }
    ctx.resume();
    master.gain.setValueAtTime(+vol.value, ctx.currentTime);
    nextTime = ctx.currentTime + 0.05;
    timer = setInterval(schedule, 25); schedule();
    return true;
  }
  function stopSynth() { clearInterval(timer); timer = null; if (ctx) { master.gain.setTargetAtTime(0, ctx.currentTime, 0.05); setTimeout(function () { if (!playing) ctx.suspend(); }, 300); } }
  function setUI() { radio.classList.toggle("playing", playing); btn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY; btn.setAttribute("aria-pressed", playing); btn.setAttribute("aria-label", playing ? "Mettre Radio Mazzucco en pause" : "Écouter Radio Mazzucco"); }
  btn.innerHTML = ICON_PLAY;
  btn.addEventListener("click", function () {
    if (!playing) {
      if (RADIO_STREAM) {
        if (!audioEl) { audioEl = new Audio(RADIO_STREAM); audioEl.preload = "none"; }
        audioEl.volume = +vol.value;
        audioEl.play().then(function () { playing = true; setUI(); }, function () { trackEl.textContent = "Flux indisponible"; });
        return;
      }
      if (startSynth()) { playing = true; setUI(); }
    } else {
      playing = false;
      if (audioEl) audioEl.pause(); else stopSynth();
      setUI();
    }
  });
  vol.addEventListener("input", function () { if (audioEl) audioEl.volume = +vol.value; if (master && playing) master.gain.setTargetAtTime(+vol.value, ctx.currentTime, 0.03); });
})();
