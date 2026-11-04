/* Mazzucco Events — gallery filters and lightbox. */
(function () {
  "use strict";
  var grid = document.getElementById("gal"); if (!grid) return;
  var items = Array.prototype.slice.call(grid.querySelectorAll(".shot"));
  var filters = document.querySelectorAll(".gal-filters button");
  filters.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.dataset.f;
      filters.forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      items.forEach(function (it) { it.hidden = f !== "all" && it.dataset.cat !== f; });
    });
  });

  var box = document.getElementById("lightbox"), img = box.querySelector("img"), cap = box.querySelector(".lb-cap");
  var cur = -1;
  function visible() { return items.filter(function (it) { return !it.hidden; }); }
  function show(it) {
    var i = it.querySelector("img");
    img.src = i.dataset.full || i.currentSrc || i.src; img.alt = i.alt; cap.textContent = it.querySelector("figcaption") ? it.querySelector("figcaption").textContent : "";
    cur = visible().indexOf(it);
    box.hidden = false; document.body.style.overflow = "hidden"; box.querySelector(".lb-close").focus();
  }
  function close() { box.hidden = true; document.body.style.overflow = ""; img.src = ""; if (cur > -1 && visible()[cur]) visible()[cur].querySelector("button").focus(); }
  function step(d) { var v = visible(); if (!v.length) return; cur = (cur + d + v.length) % v.length; show(v[cur]); }
  items.forEach(function (it) { it.querySelector("button").addEventListener("click", function () { show(it); }); });
  box.querySelector(".lb-close").addEventListener("click", close);
  box.querySelector(".lb-prev").addEventListener("click", function () { step(-1); });
  box.querySelector(".lb-next").addEventListener("click", function () { step(1); });
  box.addEventListener("click", function (e) { if (e.target === box) close(); });
  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") close(); else if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1);
  });
})();
