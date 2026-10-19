/* Back of House landing: interactions. GSAP from CDN for the hero drawing and small transitions only.
 * 18 Oct 2026: no smooth-scroll takeover, no pinned or scroll-scrubbed sections. Every interaction is something the
 * owner presses: rooms, the day's moments, sign a check, socials tabs and the post plan, connect a system.
 * Everything degrades to a readable static page; prefers-reduced-motion gets no animation at all. */
(function () {
  "use strict";
  var C = window.BOH_CONTENT, docEl = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasG = !!window.gsap;
  var motion = hasG && !reduce;
  if (!motion) docEl.classList.remove("js-motion");
  var hasST = motion && !!window.ScrollTrigger;
  if (hasST) gsap.registerPlugin(ScrollTrigger);
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var EASE = "expo.out";   // = cubic-bezier(.16,1,.3,1), the system ease (DESIGN_SYSTEM §7)
  // highlighter: amber swipes in behind money found. Works with reduced motion too (the CSS transition is instant then).
  function fillIn(el, delay) {
    if (!el) return;
    el.classList.add("is-pending"); void el.offsetWidth;
    setTimeout(function () { el.classList.remove("is-pending"); }, delay || 0);
  }
  // a rubber stamp: one thump, no bounce
  function thump(el) { if (motion && el) gsap.fromTo(el, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 0.9, duration: 0.16, ease: "power3.out" }); }
  // biro figures written left to right
  function writeOn(els, delay) {
    if (!motion || !els.length) return;
    gsap.fromTo(els, { clipPath: "inset(-10% 100% -10% 0)" }, { clipPath: "inset(-10% -4% -10% 0)", duration: 0.22, ease: "power2.out", stagger: 0.04, delay: delay || 0, clearProps: "clipPath" });
  }
  // a guest check printing from the rail (top to bottom), rows following
  function printIn(card, delay) {
    if (!motion) return;
    gsap.fromTo(card, { clipPath: "inset(0 0 100% 0)", y: -8, rotate: 0, opacity: 1 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.24, ease: EASE, delay: delay || 0, clearProps: "clipPath,transform" });
  }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  // arrow keys, Home and End across a set of tabs
  function tabKeys(bar, getTabs, pick) {
    bar.addEventListener("keydown", function (e) {
      var t = getTabs(), i = t.indexOf(document.activeElement); if (i < 0) return;
      var n = t.length, j = e.key === "ArrowRight" || e.key === "ArrowDown" ? (i + 1) % n : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
      if (j < 0) return; e.preventDefault(); t[j].focus(); pick(j);
    });
  }

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

  /* ---------- the plans ---------- */
  var heroSvg = $("#plan-hero"), leakSvg = $("#plan-leaks"), cxSvg = $("#plan-cx");
  BOHPlan.draw(heroSvg, { marks: true });
  var LP = BOHPlan.draw(leakSvg, { zones: true });
  var CP = cxSvg ? BOHPlan.draw(cxSvg, { zones: true, viewBox: "-10 -10 1030 800" }) : null;
  var zoneById = {}; BOHPlan.zones.forEach(function (z) { zoneById[z.id] = z; });

  // hero marks are links into the leaks section, opened on that room
  $$(".mark", heroSvg).forEach(function (g) {
    var id = g.getAttribute("data-zone");
    g.setAttribute("tabindex", "0"); g.setAttribute("role", "link");
    g.setAttribute("aria-label", zoneById[id].n + ". " + zoneById[id].label + ": see what we check there");
    g.style.cursor = "pointer";
    function go() { select(id, true); scrollToEl($("#leaks")); }
    g.addEventListener("click", go);
    g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
  });

  /* ---------- hero: the plan draws itself in ink, then the line lands ---------- */
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
      .to(".hero-h .w>span", { y: 0, duration: 0.9, stagger: 0.06, ease: "expo.out" }, 2.05)
      .to(".hero-line, .hero-status", { opacity: 1, duration: 0.6 }, 2.55)
      .to(".hero-cta, .hero-facts, .hero-who", { opacity: 1, duration: 0.5, stagger: 0.08 }, 2.7)
      .add(function () { heroSvg.classList.remove("is-drawing"); });
    // any key, tap, wheel or scroll finishes the drawing at once: nobody waits for it
    var finish = function () { if (tl.progress() < 1) tl.progress(1); };
    ["keydown", "pointerdown", "wheel", "touchstart"].forEach(function (ev) { window.addEventListener(ev, finish, { once: true, passive: true }); });
    window.addEventListener("scroll", function () { if (window.scrollY > 40) finish(); }, { passive: true });
    if (hasST) gsap.to(".hero-plan .plan", { yPercent: -3, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  } else heroSvg.classList.remove("is-drawing");

  /* ---------- desktop: a drafting crosshair over Sheet 01, reading out the room under the pen ---------- */
  var hp = $(".hero-plan"), xh = $(".xhair", hp);
  if (fine && xh) {
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

  /* ---------- No. 02: find the leaks ---------- */
  var rooms = $(".rooms"), ticket = $("#ticket"), current = null;
  BOHPlan.zones.forEach(function (z) {
    var b = document.createElement("button");
    b.className = "room-btn"; b.type = "button"; b.id = "room-" + z.id;
    b.setAttribute("role", "tab"); b.setAttribute("aria-controls", "ticket"); b.setAttribute("aria-selected", "false"); b.tabIndex = -1;
    b.dataset.zone = z.id;
    b.innerHTML = '<span class="num" aria-hidden="true">' + z.n + "</span>" + esc(z.label);
    b.addEventListener("click", function (e) { select(z.id, e.detail === 0); });
    b.addEventListener("mouseenter", function () { hover(z.id, true); });
    b.addEventListener("mouseleave", function () { hover(z.id, false); });
    rooms.appendChild(b);
  });
  tabKeys(rooms, function () { return $$(".room-btn", rooms); }, function (j) { select($$(".room-btn", rooms)[j].dataset.zone, true); });
  Object.keys(LP.els).forEach(function (id) {
    var h = LP.els[id].hit;
    h.addEventListener("mouseenter", function () { hover(id, true); });
    h.addEventListener("mouseleave", function () { hover(id, false); });
    h.addEventListener("click", function () { select(id); });
  });
  function hover(id, on) { if (id !== current) LP.els[id].fill.classList.toggle("hov", on); }

  function ticketHTML(id) {
    var r = C.rooms[id];
    return '<div class="ch"><b>' + esc(r.name) + '</b><span class="serial">' + r.serial + "</span></div>" +
      '<div class="swap"><h3>What we check here</h3><ul>' + r.checks.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>" +
      '<h3>A sample finding</h3><p class="f-title">' + esc(r.title) + "</p>" +
      r.lines.map(function (l) { return '<div class="ln"><span class="it">' + esc(l[0]) + '</span><span class="v">' + esc(l[1]) + "</span></div>"; }).join("") +
      '<div class="tot"><span class="lab">' + esc(r.per) + '</span><span class="amt fill">' + esc(r.amount) + "</span></div>" +
      '<p class="conf">' + esc(r.conf) + "</p>" +
      '<p class="next"><b>Next:</b> ' + esc(r.next) + "</p></div>";
  }
  function select(id, instant) {
    if (id === current) return;
    var prev = current; current = id;
    $$(".room-btn", rooms).forEach(function (b) { var on = b.dataset.zone === id; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; });
    ticket.setAttribute("aria-labelledby", "room-" + id);
    Object.keys(LP.els).forEach(function (k) { LP.els[k].fill.classList.remove("hov"); LP.els[k].fill.classList.toggle("on", k === id); });
    $$(".mark", leakSvg).forEach(function (m) {
      var on = m.getAttribute("data-zone") === id; m.classList.toggle("is-off", !on);
      if (on && motion && !instant) gsap.fromTo(m.querySelectorAll(".biro"), { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.55, ease: "power1.inOut", stagger: 0.08 });
    });
    // the old check tears off the rail; the new one prints, its figures are written in biro, the total gets the amber
    var write = function () {
      ticket.innerHTML = ticketHTML(id);
      if (motion && !instant) {
        printIn(ticket);
        gsap.fromTo($$(".swap li, .ln .it, .f-title, .conf, .next", ticket), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.02, delay: 0.1, ease: EASE, clearProps: "transform,opacity" });
        writeOn($$(".ln .v, .amt", ticket), 0.18);
        fillIn($(".amt", ticket), 380);
      }
    };
    if (prev && motion && !instant) {
      gsap.killTweensOf(ticket);
      gsap.to(ticket, { y: -12, rotate: -2, opacity: 0, duration: 0.16, ease: "power2.out", onComplete: write });
      thump($(".ticket-stamp"));
    } else write();
  }
  select("floor", true);

  /* ---------- No. 04: a normal day. Tap a moment; its messages play in order. ---------- */
  var day = $(".day"), chaps = $$(".chap"), phone = $("#phone");
  if (day && phone) {
    day.classList.add("js-play");
    var screens = $$(".screen", phone), playT = [];
    var CH = [ { screen: "0", show: [0], play: [] }, { screen: "0", show: [0], play: [1, 2, 3, 4] },
               { screen: "2", show: [], play: [5, 6, 7] }, { screen: "3", show: [], play: [8, 9, 10] },
               { screen: "4", show: [], play: [11, 12, 13, 14, 15] } ];
    // keep the newest message in view inside the phone, like a chat
    var toBottom = function (m) { var box = m.closest(".msgs"); if (box) box.scrollTo({ top: box.scrollHeight, behavior: reduce ? "auto" : "smooth" }); };
    var showChapter = function (i, focus) {
      playT.forEach(clearTimeout); playT = [];
      chaps.forEach(function (c, k) { var on = k === i; c.setAttribute("aria-selected", on); c.tabIndex = on ? 0 : -1; if (on && focus) c.focus(); });
      phone.setAttribute("aria-labelledby", "ch-" + i);
      var c = CH[i];
      screens.forEach(function (s) { s.classList.toggle("on", s.dataset.screen === c.screen); });
      // 19 Oct: service mode. The lights go down: dark ink fills the phone from the top before the screen reads.
      phone.classList.toggle("is-service", c.screen === "4");
      // 19 Oct (late), the pass: paper by day, stainless at night. In service the whole sheet goes dark; only the checks stay lit.
      day.classList.toggle("is-night", c.screen === "4");
      if (c.screen === "4" && motion) {
        var sv = $(".s-service", phone);
        gsap.fromTo(sv, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.28, ease: "power2.out", clearProps: "clipPath" });
        gsap.fromTo($$(".sv-top, .sv-time, .sv-kpi > div", sv), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.22, stagger: 0.04, delay: 0.16, ease: EASE, clearProps: "transform,opacity" });
      }
      $$("[data-step]", phone).forEach(function (m) {
        var st = +m.dataset.step;
        m.classList.toggle("hide", c.show.indexOf(st) < 0 && c.play.indexOf(st) < 0);
        m.classList.toggle("wait", c.play.indexOf(st) >= 0 && !reduce);
      });
      $$(".msgs", phone).forEach(function (b) { b.scrollTop = reduce ? b.scrollHeight : 0; });
      if (!reduce) c.play.forEach(function (st, k) {
        playT.push(setTimeout(function () { var m = $('[data-step="' + st + '"]', phone); if (m) { m.classList.remove("wait"); toBottom(m); } }, (c.screen === "4" ? 260 + k * 220 : 350 + k * 750)));
      });
    };
    chaps.forEach(function (c, i) { c.addEventListener("click", function () { showChapter(i); }); });
    tabKeys($("#chapters"), function () { return chaps; }, function (j) { showChapter(j); });
    showChapter(0);
  }

  /* ---------- No. 05: take the check off the rail (a demonstration; sends nothing) ----------
     19 Oct (late), the pass (38_dashboard v6): Sign is a hold, not a tap (600 ms; the signature writes while you hold; let go early
     and nothing happens). Keyboard Enter or Space signs at once, with no animation. Reduced motion: a press signs.
     Say no needs a reason, written on the check in biro. Not now sends it to the back of the rail. Why unfolds the working. */
  var sc = $("#signcard");
  if (sc) {
    var out = $(".sign-out", sc), stamp = $(".sign-stamp", sc), act = $(".sign-act", sc), form = $(".sign-no", sc), reason = $("#sign-reason");
    var amt = $(".amt", sc), why = $("#sign-why"), whyB = $('[data-sign="why"]', sc), holdB = $('[data-sign="yes"]', sc), rsn = $(".reason", sc);
    var stubs = $("#stubs"), railN = $("#rail-n"), spike = $("#spike"), STUBS = stubs ? stubs.innerHTML : "";
    var HOLD = 600, ht = null;
    amt.classList.add("is-pending");   // the £ is only "released" once it is signed
    var stub7 = function () { return stubs ? $('.stub[data-no="7"]', stubs) : null; };
    var nowCount = function () { if (railN) railN.textContent = String($$(".stub:not(.is-later)", stubs).length); };
    var tick = function (k) { var e = $('[data-k="' + k + '"]', spike); if (e) e.textContent = String(+e.textContent + 1); };
    // spiked: the stub drops onto the spike; torn: it tears off the rail
    var unhang = function (how) {
      var s = stub7(); if (!s) return;
      var gone = function () { if (s.parentNode) s.parentNode.removeChild(s); nowCount(); };
      if (!motion) { gone(); return; }
      if (how === "spike") gsap.to(s, { y: 8, scaleY: 0.4, opacity: 0, duration: 0.22, ease: "power2.out", transformOrigin: "50% 100%", onComplete: gone });
      else gsap.to(s, { y: -12, rotate: -2, opacity: 0, duration: 0.2, ease: "power2.out", onComplete: gone });
    };
    var settle = function (label, text, kind) {
      act.hidden = true; form.hidden = true; why.hidden = true; whyB.setAttribute("aria-expanded", "false");
      stamp.textContent = label; sc.classList.add("is-done");
      if (kind === "yes") sc.classList.add("is-signed"); if (kind === "no") sc.classList.add("is-no"); if (kind === "later") sc.classList.add("is-later");
      out.innerHTML = esc(text) + ' <button class="linkbtn" type="button">Try it again</button>';
      if (kind === "yes") setTimeout(function () { amt.classList.remove("is-pending"); }, motion ? 160 : 0);
      if (label) thump(stamp);
      $(".linkbtn", out).addEventListener("click", reset);
      $(".linkbtn", out).focus({ preventScroll: true });
    };
    var reset = function () {
      sc.classList.remove("is-done", "is-signed", "is-no", "is-later", "is-holding");
      amt.classList.add("is-pending"); stamp.textContent = ""; out.textContent = ""; act.hidden = false; reason.value = ""; rsn.textContent = "";
      if (stubs) { stubs.innerHTML = STUBS; $$("[data-k]", spike).forEach(function (e) { e.textContent = "0"; }); nowCount(); }
      holdB.focus({ preventScroll: true });
    };
    var sign = function () {
      sc.classList.remove("is-holding");
      settle("SIGNED", "Signed by Sam K. (duty manager, SAMPLE) and recorded under that name. Quin T. goes home; £40.50 of labour released.", "yes");
      tick("signed"); unhang("spike");
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
    // keyboard (detail 0) and reduced motion sign at once; a pointer has to hold
    holdB.addEventListener("click", function (e) { if (sc.classList.contains("is-done")) return; if (e.detail === 0 || reduce) sign(); });
    $('[data-sign="no"]', sc).addEventListener("click", function () {
      act.hidden = true; form.hidden = false; out.textContent = ""; reason.focus();
    });
    $('[data-sign="later"]', sc).addEventListener("click", function () {
      var s = stub7();
      if (s) {
        s.classList.remove("is-up"); s.classList.add("is-later");
        s.insertAdjacentHTML("beforeend", '<span class="back">back in the 08:00 message</span>');
        stubs.appendChild(s); nowCount();
        if (motion) gsap.fromTo(s, { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.24, ease: EASE, clearProps: "transform,opacity" });
      }
      settle("", "Not now. It moves to the back of the rail and comes back in the 08:00 message. Nothing has been changed.", "later");
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
      tick("no"); unhang("tear");
    });
  }

  /* ---------- No. 08: socials and quiet nights, four tabs ---------- */
  var mTabs = $$(".mkt-tabs .room-btn"), mPanels = $$(".mkt-panel");
  function mSelect(i) {
    mTabs.forEach(function (t, k) { var on = k === i; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
    mPanels.forEach(function (p, k) { p.hidden = k !== i; });
    if (motion) gsap.fromTo($$(".mkt-list li, .ln, .cal-day.has, .verdicts span", mPanels[i]), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.22, stagger: 0.02, ease: "power2.out", clearProps: "all" });
  }
  mTabs.forEach(function (t, i) { t.addEventListener("click", function () { mSelect(i); }); });
  if ($(".mkt-tabs")) tabKeys($(".mkt-tabs"), function () { return mTabs; }, mSelect);
  // the month's plan: 1 Nov 2026 is a Sunday, so six blank days first
  var cal = $(".cal-grid"), pcard = $("#post-card"), byDay = {};
  var ST = { approved: "Approved", waiting: "Ready for your yes", needs: "Needs the team’s own words" };
  if (cal && C.posts) {
    C.posts.forEach(function (p, i) { p.n = i + 1; byDay[p.d] = p; });
    for (var b0 = 0; b0 < 6; b0++) { var e0 = document.createElement("span"); e0.className = "cal-day blank"; cal.appendChild(e0); }
    for (var d = 1; d <= 30; d++) {
      var p = byDay[d], el;
      if (p) {
        el = document.createElement("button"); el.type = "button"; el.className = "cal-day has st-" + p.st; el.dataset.d = d;
        el.setAttribute("aria-pressed", "false");
        el.setAttribute("aria-label", d + " November: " + p.t + ", " + ST[p.st]);
        el.innerHTML = '<span class="dn">' + d + '</span><span class="pk">' + esc(p.kind) + "</span>";
        el.addEventListener("click", (function (pp) { return function () { showPost(pp); }; })(p));
      } else { el = document.createElement("span"); el.className = "cal-day"; el.innerHTML = '<span class="dn">' + d + "</span>"; }
      cal.appendChild(el);
    }
  }
  function showPost(p, focusNote) {
    $$(".cal-day.has", cal).forEach(function (b) { var on = +b.dataset.d === p.d; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); });
    pcard.innerHTML = '<p class="pc-h"><span class="pc-k">' + esc(p.ch) + " · " + esc(p.kind) + " · " + p.d + ' Nov</span><span class="pc-s st-' + p.st + '">' + ST[p.st] + "</span></p>" +
      '<p class="pc-t">' + esc(p.t) + "</p>" +
      '<p class="pc-l"><b>Caption</b>' + esc(p.cap) + "</p>" +
      '<p class="pc-l"><b>Photo</b>' + esc(p.photo) + "</p>" +
      (p.floor ? '<p class="pc-l"><b>Tell the table</b>' + esc(p.floor) + "</p>" : "") +
      (p.st === "approved" ? '<p class="pc-a" tabindex="-1">You approved this one. You post it yourself; we never post.</p>'
        : p.st === "needs" ? '<p class="pc-a">Waits for the team member’s own words. Reply EDIT ' + p.n + " with them first.</p>"
        : '<p class="pc-a">Reply YES ' + p.n + " to approve, EDIT " + p.n + " with your words, or NO " + p.n + ' with a reason.</p><button class="btn btn-sm pc-yes" type="button">YES ' + p.n + "</button>");
    var y = $(".pc-yes", pcard);
    if (y) y.addEventListener("click", function () {
      p.st = "approved";
      var b = $('.cal-day[data-d="' + p.d + '"]', cal); b.className = "cal-day has st-approved on";
      b.setAttribute("aria-label", p.d + " November: " + p.t + ", " + ST.approved);
      showPost(p, true);
    });
    if (focusNote) $(".pc-a", pcard).focus();
  }
  if (C.posts) showPost(byDay[2]);

  /* ---------- No. 08: connect a system (a demonstration on this page; connects to nothing) ---------- */
  var cxBox = $("#cx-systems"), cxT = $("#cx-ticket"), cxOn = null;
  if (cxBox && CP && C.connect) {
    var NS = "http://www.w3.org/2000/svg";
    var mk = function (n, a, parent) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (parent) parent.appendChild(e); return e; };
    var gF = mk("g", { "class": "flow" }, cxSvg);
    mk("rect", { x: 600, y: 680, width: 400, height: 104, "class": "boh-box" }, gF);
    var bt = mk("text", { x: 620, y: 722, "class": "boh-t" }, gF); bt.textContent = "Back of House";
    var bh = mk("text", { x: 620, y: 764, "class": "boh-h" }, gF); bh.textContent = "reads only";
    var flowLine = mk("path", { "class": "flow-line", pathLength: 1 }, gF), flowDots = mk("path", { "class": "flow-dots" }, gF);

    C.connect.forEach(function (g) {
      var row = document.createElement("div"); row.className = "cx-row";
      row.innerHTML = '<p class="cx-h">' + esc(g.head) + "</p>";
      var chips = document.createElement("div"); chips.className = "cx-chips";
      g.systems.forEach(function (s) {
        var b = document.createElement("button"); b.type = "button"; b.className = "cx-chip k-" + g.kind; b.setAttribute("aria-pressed", "false");
        b.innerHTML = '<span class="led" aria-hidden="true"></span>' + esc(s.n);
        b.addEventListener("click", function () { cxConnect(g, s, b); });
        chips.appendChild(b);
      });
      row.appendChild(chips); cxBox.appendChild(row);
    });

    var cxTicket = function (g, s, state) {
      var serial = state === "off" ? "Disconnected" : g.kind === "photo" ? "In testing" : g.kind === "email" ? "By email · SAMPLE" : "Linked · SAMPLE";
      var h = '<div class="ch"><b>' + esc(s.n) + '</b><span class="serial">' + serial + "</span></div>";
      if (state === "off") return h + '<p class="cx-msg">Disconnected. Nothing more is read. You keep your reports and an export of your records.</p>' +
        '<div class="cx-act"><button class="btn btn-sm cx-again" type="button">Connect again</button></div>';
      h += "<h3>" + (g.kind === "photo" ? "The last resort" : "What we read") + '</h3><ul>' + g.reads.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>";
      if (s.note) h += '<p class="cx-note">' + esc(s.note) + "</p>";
      if (g.kind === "photo") return h + '<p class="cx-msg"><span class="tag">in testing</span>Not offered yet.</p>';
      if (g.catchText) h += '<div class="cx-catch"><span class="tag">SAMPLE</span><b>What the link caught on an invented venue:</b> ' + esc(g.catchText) + "</div>";
      return h + '<div class="cx-act"><button class="btn btn-sm cx-write" type="button">Try to change a figure</button><button class="btn btn-sm btn-ghost cx-off" type="button">Disconnect</button></div><p class="cx-refuse" role="status"></p>';
    };

    var cxConnect = function (g, s, btn, instant) {
      cxOn = { g: g, s: s, btn: btn };
      $$(".cx-chip", cxBox).forEach(function (b) { b.setAttribute("aria-pressed", b === btn); b.classList.remove("off"); });
      Object.keys(CP.els).forEach(function (k) { CP.els[k].fill.classList.toggle("on", k === g.zone); });
      cxT.innerHTML = cxTicket(g, s, "on");
      // the line from the room to Back of House
      if (g.zone) {
        var z = zoneById[g.zone], x = z.mark[0], y = z.mark[1] + 20;
        var dPath = "M" + x + " " + y + " C" + x + " 420, 800 460, 800 680";
        flowLine.setAttribute("d", dPath); flowDots.setAttribute("d", dPath);
        gF.classList.add("on"); gF.classList.toggle("mail", g.kind === "email");
        if (motion && !instant) gsap.fromTo(flowLine, { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" });
        else flowLine.style.strokeDashoffset = 0;
      } else gF.classList.remove("on");
      if (motion && !instant) {
        gsap.fromTo(btn.querySelector(".led"), { scale: 0.4 }, { scale: 1, duration: 0.25, ease: EASE, clearProps: "transform" });
        printIn(cxT, 0.28);
        gsap.fromTo($$("li, .cx-catch, .cx-note, .cx-msg", cxT), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.03, delay: 0.4, ease: EASE, clearProps: "transform,opacity" });
      }
      var w = $(".cx-write", cxT), off = $(".cx-off", cxT);
      if (w) w.addEventListener("click", function () {
        var r = $(".cx-refuse", cxT);
        r.innerHTML = 'We only read. Our software refuses any change to your accounts, POS or socials.';
        var st = $(".refused", cxT);
        if (!st) { st = document.createElement("span"); st.className = "stamp refused"; st.setAttribute("aria-hidden", "true"); st.textContent = "REFUSED"; cxT.appendChild(st); }
        thump(st);
      });
      if (off) off.addEventListener("click", function () {
        btn.setAttribute("aria-pressed", "false"); btn.classList.add("off");
        Object.keys(CP.els).forEach(function (k) { CP.els[k].fill.classList.remove("on"); });
        gF.classList.remove("on");
        cxT.innerHTML = cxTicket(g, s, "off");
        var again = $(".cx-again", cxT);
        again.addEventListener("click", function () { cxConnect(g, s, btn); btn.focus(); });
        again.focus();
      });
    };
    var first = C.connect[0];
    cxConnect(first, first.systems[0], $(".cx-chip", cxBox), true);
  }

  /* ---------- No. 09: how it works, a two-lane ledger ---------- */
  var steps = $("#steps"), lastStage = "";
  C.steps.forEach(function (s) {
    var li = document.createElement("li"); li.className = "step";
    li.innerHTML = (s.stage !== lastStage ? '<span class="stg">' + esc(s.stage) + "</span>" : "") +
      '<div class="hd"><span class="num" aria-hidden="true">' + s.n + "</span><span>" + esc(s.t) + "</span></div>" +
      '<p class="you">' + esc(s.you) + '</p><p class="us">' + esc(s.us) + "</p>" +
      (s.call ? '<span class="call"><span class="dia" aria-hidden="true"></span>' + esc(s.call) + "</span>" : "");
    lastStage = s.stage; steps.appendChild(li);
  });
  var prog = document.createElement("li"); prog.className = "steps-prog"; prog.setAttribute("aria-hidden", "true"); steps.appendChild(prog);

  /* ---------- 19 Oct: sheets, scroll-linked lines, buttons ---------- */
  // each section's drafting rule inks in once as it enters; the header says which sheet you are on
  var sheets = $$("[data-sheet]"), sn = $(".sheet-n"), cur = "";
  var setSheet = function (n) {
    if (!sn || n === cur) return; cur = n;
    sn.innerHTML = "<span>" + (n === "00" ? "Cover" : "No. " + n + " of 17") + "</span>";
    if (motion) { sn.classList.remove("roll"); void sn.offsetWidth; sn.classList.add("roll"); }
  };
  if ("IntersectionObserver" in window) {
    var ioIn = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); ioIn.unobserve(e.target); } }); }, { rootMargin: "0px 0px -15% 0px" });
    sheets.forEach(function (el) { ioIn.observe(el); });
    var ioSheet = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) setSheet(e.target.dataset.sheet); }); }, { rootMargin: "-45% 0px -54% 0px" });
    sheets.forEach(function (el) { ioSheet.observe(el); });
    var ioStep = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); ioStep.unobserve(e.target); } }); }, { rootMargin: "0px 0px -30% 0px" });
    $$(".step", steps).forEach(function (el) { ioStep.observe(el); });
  } else { sheets.concat($$(".step")).forEach(function (el) { el.classList.add("is-in"); }); }
  setSheet("00");

  // header rule follows the page (transform only; heights are measured on resize, not on scroll)
  var topBar = $(".top");
  if (motion && topBar) {
    var maxY = 1, ticking = false, rule = document.createElement("i");
    rule.className = "top-rule"; rule.setAttribute("aria-hidden", "true"); topBar.appendChild(rule);
    var measure = function () { maxY = Math.max(1, document.documentElement.scrollHeight - innerHeight); };
    var upd = function () { ticking = false; rule.style.transform = "scaleX(" + Math.min(1, scrollY / maxY).toFixed(4) + ")"; };
    measure(); upd();
    window.addEventListener("resize", function () { measure(); upd(); });
    window.addEventListener("load", measure);
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(upd); } }, { passive: true });
  }

  if (hasST) {
    // No. 02: the biro line runs through the four stations as the section scrolls past (scrubbed, never pinned)
    var f4 = $(".flow4");
    if (f4) {
      var f4Path = $(".flow4-line path", f4), f4Nums = $$(".num", f4), f4Fill = $(".fill", f4), lit = 0;
      var wide = window.matchMedia("(min-width: 721px)").matches;
      f4Fill.classList.add("is-pending");
      gsap.set(f4Nums, { opacity: 0.25, scale: 0.85 });
      var light = function (k) {
        while (lit < k) {
          var n = f4Nums[lit]; gsap.to(n, { opacity: 1, scale: 1, duration: 0.3, ease: EASE });
          if (lit === 1) fillIn(f4Fill, 120);
          lit++;
        }
      };
      if (wide && f4Path) {
        gsap.fromTo(f4Path, { strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none",
          scrollTrigger: { trigger: f4, start: "top 82%", end: "top 32%", scrub: 0.5,
            onUpdate: function (st) { light(Math.min(4, 1 + Math.floor(st.progress * 3.999 + 0.0001))); } } });
      } else {
        ScrollTrigger.create({ trigger: f4, start: "top 80%", once: true, onEnter: function () { f4Nums.forEach(function (n, i) { setTimeout(function () { light(i + 1); }, i * 160); }); } });
      }
    }
    // No. 10: a biro rule follows the scroll down the ledger
    gsap.fromTo(prog, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: steps, start: "top 70%", end: "bottom 70%", scrub: 0.4 } });
  }

  // desktop: primary buttons lean toward the pointer (max 6 px), and settle back
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
