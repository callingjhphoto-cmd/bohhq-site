/* Back of House landing, the pitch rebuild (19 Oct 2026, evening). Trimmed from site.js (archived in _archive/2026-10-19_pre_fable_pitch/).
 * What runs: the hero plan inks itself (GSAP from CDN), the drafting crosshair on desktop, in-page links, the sheet indicator, each section's
 * rule and parts entering, the amber fills behind money found, hold-to-sign on one sample check, the biro rule in the header, magnetic buttons.
 * Everything degrades to a readable static page; prefers-reduced-motion gets no movement at all. Sends nothing. */
(function () {
  "use strict";
  var docEl = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasG = !!window.gsap;
  var motion = hasG && !reduce;
  if (!motion) docEl.classList.remove("js-motion");
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var EASE = "expo.out";
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function thump(el) { if (motion && el) gsap.fromTo(el, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 0.9, duration: 0.16, ease: "power3.out" }); }
  // highlighter: amber swipes in behind money found (reduced motion: instant)
  function fillIn(el, delay) { if (!el) return; setTimeout(function () { el.classList.remove("is-pending"); }, delay || 0); }

  /* ---------- in-page links: native scrolling only ---------- */
  function scrollToEl(el) { el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href"); if (id.length < 2) return;
      var t = document.querySelector(id); if (!t) return;
      e.preventDefault(); scrollToEl(t);
      if (id !== "#top") { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
    });
  });

  /* ---------- the hero plan: drawn in ink, then the line lands ---------- */
  var heroSvg = $("#plan-hero");
  if (heroSvg && window.BOHPlan) {
    BOHPlan.draw(heroSvg, { marks: true });
    if (motion) {
      var q = function (s) { return heroSvg.querySelectorAll(s); };
      var tl = gsap.timeline({ defaults: { ease: "power2.out" }, delay: 0.15 });
      tl.to(q(".ink-wall"), { strokeDashoffset: 0, duration: 0.9, stagger: 0.015, ease: "power1.inOut" })
        .to(q(".ink-inner"), { strokeDashoffset: 0, duration: 0.6, stagger: 0.012 }, 0.45)
        .to(q(".ink-fix"), { strokeDashoffset: 0, duration: 0.5, stagger: 0.004 }, 0.8)
        .to(q(".ink-furn"), { strokeDashoffset: 0, duration: 0.45, stagger: 0.0022 }, 1.0)
        .to(q(".ink.dash"), { opacity: 1, duration: 0.3 }, 1.4)
        .to(q(".fills"), { opacity: 1, duration: 0.6, ease: "none" }, 1.45)
        .to(q(".labels"), { opacity: 1, duration: 0.4 }, 1.5);
      $$(".mark", heroSvg).forEach(function (m, i) {
        var at = 1.75 + i * 0.13;
        tl.to(m.querySelectorAll(".biro:not(.bubble)"), { strokeDashoffset: 0, duration: 0.45, ease: "power1.inOut" }, at)
          .to(m.querySelectorAll(".bubble"), { strokeDashoffset: 0, opacity: 1, duration: 0.3 }, at + 0.22)
          .to(m.querySelectorAll(".num-hand"), { opacity: 1, duration: 0.2 }, at + 0.34);
      });
      tl.fromTo(".hero-plan .plan-note", { opacity: 1, clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% -5% -20% 0)", duration: 0.7, ease: "power1.inOut" }, 2.45)
        .fromTo(".hero-plan .title-block", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: EASE }, 2.55)
        .to(".hero-h .w>span", { y: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" }, 1.9)
        .to(".hero-line", { opacity: 1, duration: 0.6 }, 2.45)
        .to(".hero-cta, .hero-first, .hero-facts, .hero-who", { opacity: 1, duration: 0.5, stagger: 0.08 }, 2.6)
        .add(function () { heroSvg.classList.remove("is-drawing"); });
      // any key, tap, wheel or scroll finishes the drawing at once: nobody waits for it
      var finish = function () { if (tl.progress() < 1) tl.progress(1); };
      ["keydown", "pointerdown", "wheel", "touchstart"].forEach(function (ev) { window.addEventListener(ev, finish, { once: true, passive: true }); });
      window.addEventListener("scroll", function () { if (window.scrollY > 40) finish(); }, { passive: true });
    } else heroSvg.classList.remove("is-drawing");
    // the six marks: each is a quiet link to the statement
    $$(".mark", heroSvg).forEach(function (g) {
      g.setAttribute("tabindex", "0"); g.setAttribute("role", "link"); g.setAttribute("aria-label", "See what you get back"); g.style.cursor = "pointer";
      var go = function () { scrollToEl($("#keep")); };
      g.addEventListener("click", go);
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }

  /* ---------- desktop: a drafting crosshair over Sheet 01, reading out the room under the pen ---------- */
  var hp = $(".hero-plan"), xh = $(".xhair", hp);
  if (fine && xh && heroSvg && window.BOHPlan) {
    var xx = $(".xh-x", xh), xy = $(".xh-y", xh), xl = $(".xh-l", xh), rq = 0, lastE = null, lastRoom = null, lw = 120;
    var inside = function (pt, r) { return pt.x >= r[0] && pt.x <= r[0] + r[2] && pt.y >= r[1] && pt.y <= r[1] + r[3]; };
    var paint = function () {
      rq = 0; var e = lastE, b = hp.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top;
      xx.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
      xy.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0)";
      var m = heroSvg.getScreenCTM(), room = "";
      if (m) {
        var pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
        for (var i = 0; i < BOHPlan.zones.length; i++) if (inside(pt, BOHPlan.zones[i].shape)) { room = BOHPlan.zones[i].label; break; }
        var txt = "x " + Math.round(pt.x) + "  y " + Math.round(pt.y);
        if (room !== lastRoom) { xl.innerHTML = '<span class="xh-c">x 0000  y 0000</span>' + (room ? "<b>" + esc(room) + "</b>" : ""); lastRoom = room; lw = xl.offsetWidth; }
        xl.firstChild.textContent = txt;
      }
      var lx = Math.min(x + 14, b.width - lw - 4);
      xl.style.transform = "translate3d(" + lx.toFixed(1) + "px," + (y + 14).toFixed(1) + "px,0)";
    };
    hp.addEventListener("pointermove", function (e) { lastE = e; if (!rq) rq = requestAnimationFrame(paint); });
    hp.addEventListener("pointerenter", function () { hp.classList.add("is-aiming"); });
    hp.addEventListener("pointerleave", function () { hp.classList.remove("is-aiming"); });
  }

  /* ---------- sheets: each section's rule inks and its parts rise as it enters; the header says which sheet you are on ---------- */
  var sheets = $$("[data-sheet]"), sn = $(".sheet-n"), cur = "", N = sheets.length - 1;
  // money found: the amber waits until its sheet is read
  ["#stmt-amt", "#fsb-amt"].forEach(function (id) { var el = $(id); if (el) el.classList.add("is-pending"); });
  var setSheet = function (n) {
    if (!sn || n === cur) return; cur = n;
    sn.innerHTML = "<span>" + (n === "00" ? "Cover" : "No. " + n + " of " + (N < 10 ? "0" + N : N)) + "</span>";
    if (motion) { sn.classList.remove("roll"); void sn.offsetWidth; sn.classList.add("roll"); }
  };
  var enter = function (el) {
    el.classList.add("is-in");
    if (el.id === "keep") { fillIn($("#stmt-amt"), motion ? 650 : 0); fillIn($("#fsb-amt"), motion ? 1100 : 0); }
  };
  if ("IntersectionObserver" in window) {
    var ioIn = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { enter(e.target); ioIn.unobserve(e.target); } }); }, { rootMargin: "0px 0px -12% 0px" });
    sheets.forEach(function (el) { ioIn.observe(el); });
    var ioSheet = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) setSheet(e.target.dataset.sheet); }); }, { rootMargin: "-45% 0px -54% 0px" });
    sheets.forEach(function (el) { ioSheet.observe(el); });
  } else { sheets.forEach(enter); }
  setSheet("00");

  /* ---------- No. 04: sign the check (a demonstration; sends nothing) ----------
     Sign is a hold, not a tap (600 ms; the signature writes while you hold; let go early and nothing happens).
     Keyboard Enter or Space signs at once. Reduced motion: a press signs. Say no needs a reason. Not now sends it back. Why unfolds the working. */
  var sc = $("#signcard");
  if (sc) {
    var out = $(".sign-out", sc), stamp = $(".sign-stamp", sc), act = $(".sign-act", sc), form = $(".sign-no", sc), reason = $("#sign-reason");
    var amt = $(".amt", sc), why = $("#sign-why"), whyB = $('[data-sign="why"]', sc), holdB = $('[data-sign="yes"]', sc), rsn = $(".reason", sc);
    var HOLD = 600, ht = null;
    amt.classList.add("is-pending");   // the £ is only "released" once it is signed
    var settle = function (label, text, kind) {
      act.hidden = true; form.hidden = true; why.hidden = true; whyB.setAttribute("aria-expanded", "false");
      stamp.textContent = label; sc.classList.add("is-done");
      if (kind === "yes") sc.classList.add("is-signed"); if (kind === "no") sc.classList.add("is-no"); if (kind === "later") sc.classList.add("is-later");
      out.innerHTML = esc(text) + ' <button class="linkbtn" type="button">Try it again</button>';
      if (kind === "yes") fillIn(amt, motion ? 160 : 0);
      if (label) thump(stamp);
      $(".linkbtn", out).addEventListener("click", reset);
      $(".linkbtn", out).focus({ preventScroll: true });
    };
    var reset = function () {
      sc.classList.remove("is-done", "is-signed", "is-no", "is-later", "is-holding");
      amt.classList.add("is-pending"); stamp.textContent = ""; out.textContent = ""; act.hidden = false; reason.value = ""; rsn.textContent = "";
      holdB.focus({ preventScroll: true });
    };
    var sign = function () {
      sc.classList.remove("is-holding");
      settle("SIGNED", "Signed by Sam K. (duty manager, SAMPLE) and recorded under that name. Quin T. goes home; £40.50 of labour released.", "yes");
    };
    var cancel = function () {
      if (!ht) return; clearTimeout(ht); ht = null; sc.classList.remove("is-holding");
      out.textContent = "Keep holding until the signature is written. Let go early and nothing happens.";
    };
    holdB.addEventListener("pointerdown", function (e) {
      if (reduce || sc.classList.contains("is-done") || (e.button !== undefined && e.button !== 0)) return;
      out.textContent = ""; sc.classList.add("is-holding");
      ht = setTimeout(function () { ht = null; sign(); }, HOLD);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { holdB.addEventListener(ev, cancel); });
    holdB.addEventListener("keydown", function (e) { if (e.key === "Escape") cancel(); });
    holdB.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    holdB.addEventListener("click", function (e) { if (sc.classList.contains("is-done")) return; if (e.detail === 0 || reduce) sign(); });
    $('[data-sign="no"]', sc).addEventListener("click", function () { act.hidden = true; form.hidden = false; out.textContent = ""; reason.focus(); });
    $('[data-sign="later"]', sc).addEventListener("click", function () {
      settle("", "Not now. It goes to the back of the list and comes back in the 08:00 message. Nothing has been changed.", "later");
    });
    whyB.addEventListener("click", function () {
      var open = why.hidden; why.hidden = !open; whyB.setAttribute("aria-expanded", String(open));
      if (open && motion) gsap.fromTo(why, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.18, ease: EASE, clearProps: "transform,opacity" });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var r = reason.value.trim();
      if (!r) { out.textContent = "I need a reason, so the record shows why. Nothing has been changed."; reason.focus(); return; }
      rsn.textContent = "“" + r.slice(0, 120) + "”";
      if (motion) gsap.fromTo(rsn, { clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% -4% -20% 0)", duration: 0.28, ease: "power2.out", clearProps: "clipPath" });
      settle("NOT SIGNED", "Turned down and recorded under Sam K.’s name, with the reason. Nothing has been changed.", "no");
    });
  }

  /* ---------- header rule follows the page (transform only) ---------- */
  var topBar = $(".top");
  if (motion && topBar) {
    var maxY = 1, ticking = false, rule = document.createElement("i");
    rule.className = "top-rule"; rule.setAttribute("aria-hidden", "true"); topBar.appendChild(rule);
    var measure = function () { maxY = Math.max(1, docEl.scrollHeight - innerHeight); };
    var upd = function () { ticking = false; rule.style.transform = "scaleX(" + Math.min(1, scrollY / maxY).toFixed(4) + ")"; };
    measure(); upd();
    window.addEventListener("resize", function () { measure(); upd(); });
    window.addEventListener("load", measure);
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  }

  /* ---------- desktop: primary buttons lean toward the pointer (max 6 px), and settle back ---------- */
  if (motion && fine) {
    $$(".btn:not(.btn-sm)").forEach(function (b) {
      var qx = gsap.quickTo(b, "x", { duration: 0.35, ease: "power3.out" }), qy = gsap.quickTo(b, "y", { duration: 0.35, ease: "power3.out" });
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        qx(Math.max(-6, Math.min(6, (e.clientX - r.left - r.width / 2) * 0.18)));
        qy(Math.max(-5, Math.min(5, (e.clientY - r.top - r.height / 2) * 0.3)));
      });
      b.addEventListener("pointerleave", function () { qx(0); qy(0); });
    });
  }
})();
