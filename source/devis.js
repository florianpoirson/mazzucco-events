/* Mazzucco Events — quote builder ("comanda") with Lorenzo as guide. */
(function () {
  "use strict";
  var WA = "33618700482";
  var $ = function (id) { return document.getElementById(id); };
  var form = $("cfg"); if (!form) return;
  var guests = $("guests"), bubble = $("guideText"), num = String(Math.floor(1000 + Math.random() * 9000));
  $("tNum").textContent = num;
  var LABELS = { pizza: "Pizzas & focaccias", mozza: "Mozzarella & antipasti", pasta: "Pâtes dans le parmesan", tiramisu: "Verrines de tiramisu" };
  var OCC_LINES = {
    "Soirée d'entreprise": "Une soirée d'entreprise ? On met l'ambiance de la trattoria.",
    "Séminaire / réunion": "Un séminaire ? Une pause italienne et tout le monde repart motivé.",
    "Salon / stand": "Un salon ? Une pizza qui sort du four, et votre stand se remplit.",
    "Lancement / inauguration": "Un lancement ? La roue de parmesan, ça fait parler.",
    "Mariage": "Un mariage ? Auguri ! On prépare une vraie festa.",
    "Fête privée": "Une fête entre proches ? Comme à la maison, en mieux."
  };
  function fmtN(n) { return n.toLocaleString("fr-FR"); }
  function state() {
    return {
      occ: (form.querySelector("input[name=occ]:checked") || {}).value || "",
      g: +guests.value,
      fmt: (form.querySelector("input[name=fmt]:checked") || {}).value || "cocktail",
      anim: Array.prototype.map.call(form.querySelectorAll("input[name=anim]:checked"), function (i) { return i.value; }),
      date: $("date").value, city: $("city").value.trim(), name: $("name").value.trim(), company: $("company").value.trim(),
      email: $("email").value.trim(), phone: $("phone").value.trim(), msg: $("msg").value.trim()
    };
  }
  function estimate(s) {
    var repas = s.fmt === "repas", n = s.g, k = s.anim.length, share = k > 1 ? 0.75 : 1, out = [];
    if (s.anim.indexOf("pizza") > -1) out.push([LABELS.pizza, "≈ " + fmtN(Math.ceil(n * (repas ? 0.9 : 0.45) * share)) + " pizzas"]);
    if (s.anim.indexOf("mozza") > -1) out.push([LABELS.mozza, "≈ " + (Math.ceil(n * (repas ? 0.1 : 0.06) * share * 10) / 10).toLocaleString("fr-FR") + " kg"]);
    if (s.anim.indexOf("pasta") > -1) out.push([LABELS.pasta, "≈ " + fmtN(Math.ceil(n * (repas ? 0.12 : 0.07) * share)) + " kg · " + (n > 300 ? Math.ceil(n / 300) + " meules" : "1 meule")]);
    if (s.anim.indexOf("tiramisu") > -1) out.push([LABELS.tiramisu, fmtN(n) + " verrines"]);
    return { items: out, staff: Math.max(2, Math.ceil(n / 50) + (k > 2 ? 1 : 0)) + " personnes", dur: repas ? "≈ 3 h" : "≈ 2 h 30" };
  }
  function fmtDate(d) { if (!d) return "à définir"; var p = d.split("-"); return p[2] + "/" + p[1] + "/" + p[0]; }
  function text(s) {
    var L = ["Bonjour Lorenzo, voici ma demande Mazzucco Events (comanda n° " + num + ") :",
      "• Occasion : " + s.occ, "• Invités : " + fmtN(s.g), "• Format : " + (s.fmt === "repas" ? "repas complet" : "cocktail dînatoire"),
      "• Animations : " + (s.anim.length ? s.anim.map(function (a) { return LABELS[a]; }).join(", ") : "à définir"),
      "• Date : " + fmtDate(s.date), "• Lieu : " + (s.city || "à définir")];
    if (s.name || s.company) L.push("• Contact : " + [s.name, s.company].filter(Boolean).join(", "));
    if (s.email) L.push("• E-mail : " + s.email);
    if (s.phone) L.push("• Téléphone : " + s.phone);
    if (s.msg) L.push("• Précisions : " + s.msg);
    return L.join("\n");
  }
  function ready(s) { return !!(s.anim.length && s.name && (s.email || s.phone) && s.date); }
  function say(line) {
    if (bubble.textContent === line) return;
    bubble.textContent = line;
    var b = bubble.parentNode; b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
  }
  function lineFor(src, s) {
    if (ready(s)) return "Pronto ! Envoyez-moi la comanda, je vous réponds personnellement.";
    if (!s.anim.length) return "Choisissez au moins une animation, sinon je reste les bras croisés !";
    if (src && src.name === "occ") return OCC_LINES[s.occ];
    if (src && src.id === "guests" || src && src.dataset && src.dataset.g) {
      if (s.g < 60) return fmtN(s.g) + " invités : petit comité, grande cuisine.";
      if (s.g < 250) return fmtN(s.g) + " invités ? Je lance la pâte cinq jours avant, promis.";
      if (s.g < 700) return fmtN(s.g) + " invités : on sort les grands fours et toute l'équipe.";
      return "Mamma mia, " + fmtN(s.g) + " invités ! On organise ça ensemble, pas de panique.";
    }
    if (src && src.value === "pasta" && src.checked) return "La roue de parmesan, c'est mon spectacle préféré.";
    if (src && src.value === "tiramisu" && src.checked) return "Le tiramisu maison, personne n'y résiste.";
    if (src && src.value === "mozza" && src.checked) return "La bufala arrive de Campanie. Fondante, vous verrez.";
    if (src && src.value === "pizza" && src.checked) return "Pizza al momento : cuite sous les yeux de vos invités.";
    if (src && src.name === "fmt") return s.fmt === "repas" ? "Un vrai repas à l'italienne, on prend le temps." : "Cocktail debout : on fait tourner les parts !";
    if (src && src.id === "date" && s.date) return "Je note le " + fmtDate(s.date) + " dans mon carnet.";
    if (src && src.id === "city" && s.city.length > 2) return s.city + " ? On vient avec plaisir, partout en France.";
    return null;
  }
  function render(src) {
    var s = state(), e = estimate(s);
    $("guestsOut").textContent = fmtN(s.g);
    $("tOcc").textContent = s.occ; $("tGuests").textContent = fmtN(s.g) + " convives";
    $("tFmt").textContent = s.fmt === "repas" ? "Repas complet" : "Cocktail";
    $("tDate").textContent = fmtDate(s.date); $("tCity").textContent = s.city || "à définir";
    var box = $("tItems"); box.innerHTML = "";
    if (!e.items.length) { var p = document.createElement("div"); p.className = "empty"; p.textContent = "Choisissez au moins une animation."; box.appendChild(p); }
    e.items.forEach(function (it) { var r = document.createElement("div"); r.className = "row"; var a = document.createElement("span"); a.textContent = "1× " + it[0]; var b = document.createElement("span"); b.textContent = it[1]; r.appendChild(a); r.appendChild(b); box.appendChild(r); });
    $("tStaff").textContent = e.staff; $("tDur").textContent = e.dur;
    $("stamp").classList.toggle("on", ready(s));
    $("sendWa").href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(text(s));
    var l = lineFor(src, s); if (l) say(l);
  }
  var lastRange = 0;
  form.addEventListener("input", function (e) { if (e.target.id === "guests") { var now = Date.now(); if (now - lastRange < 250) { render(null); return; } lastRange = now; } render(e.target); });
  form.addEventListener("change", function (e) { render(e.target); });
  form.addEventListener("submit", function (e) { e.preventDefault(); });
  document.querySelectorAll(".presets button").forEach(function (b) { b.addEventListener("click", function () { guests.value = b.dataset.g; render(b); }); });

  var PRESETS = {
    aperitivo: { anim: ["mozza", "pizza"], fmt: "cocktail", line: "Formule Aperitivo : mozzarella, antipasti et pizzette. Parfait pour trinquer." },
    festa: { anim: ["pizza", "mozza", "tiramisu"], fmt: "cocktail", line: "Formule Festa : la plus demandée. Pizza, mozza et tiramisu." },
    gala: { anim: ["pizza", "mozza", "pasta", "tiramisu"], fmt: "repas", line: "Formule Gran Galà : les quatre bars, le grand jeu !" }
  };
  function applyHash() {
    var p = PRESETS[(location.hash || "").slice(1)]; if (!p) return;
    form.querySelectorAll("input[name=anim]").forEach(function (i) { i.checked = p.anim.indexOf(i.value) > -1; });
    form.querySelector('input[name=fmt][value="' + p.fmt + '"]').checked = true;
    render(null); say(p.line);
  }
  window.addEventListener("hashchange", applyHash);

  $("copyBtn").addEventListener("click", function () {
    var t = text(state()), hint = $("copyHint");
    function ok() { hint.innerHTML = '<span class="copied">Demande copiée.</span> Collez-la dans un e-mail à <b>contact@mazzucco.fr</b>'; }
    function fallback() { var ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) { hint.textContent = "Copie impossible ici : sélectionnez la comanda et copiez-la."; } document.body.removeChild(ta); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, fallback); else fallback();
  });
  render(null);
  applyHash();
})();
