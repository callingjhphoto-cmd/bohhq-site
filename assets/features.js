/* Back of House landing, 19 Oct 2026 (day): the four new moments. Same motion language as site.js (ink, write, print, tear,
 * stamp, fill; DESIGN_SYSTEM_2026-10-19.md §7). Every component is whole and readable without this file; it only adds the
 * pending states and the interaction. Reduced motion: no movement, the states still change. Nothing here sends anything.
 *   No. 04  a rebate claim stamped        (50_brand_deals, SIMULATED Trailer Happiness year, as of 12 Oct 2026)
 *   No. 06  a payslip that writes itself  (53_people out/demo/payslip_S03_Cara.html, SAMPLE)
 *   No. 07  the host stand                (51_bookings via 38_dashboard /api/m/bookings, The Lamb & Anchor SAMPLE, Fri 19:30)
 *   No. 08  a strategy card dealt         (56_growth_engine cards on 38_dashboard v5 #/growth, The Copper Hare SAMPLE)
 * 19 Oct (late): retimed to the UI budget (emil-design-eng: under 300 ms, ease-out); host stand T2 drawn as "needs you" (38 v6 marks). */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var motion = !!window.gsap && !reduce;
  var EASE = "expo.out";
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function thump(el, delay) { if (motion && el) gsap.fromTo(el, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 0.9, duration: 0.16, ease: "power3.out", delay: delay || 0 }); }
  function writeOn(els, delay, stagger) {
    if (!motion || !els.length) return 0;
    gsap.fromTo(els, { clipPath: "inset(-10% 100% -10% 0)" }, { clipPath: "inset(-10% -4% -10% 0)", duration: 0.2, ease: "power2.out", stagger: stagger || 0.06, delay: delay || 0, clearProps: "clipPath" });
    return (delay || 0) + (els.length - 1) * (stagger || 0.06) + 0.2;
  }
  function printIn(card, delay) {
    if (!motion) return;
    gsap.fromTo(card, { clipPath: "inset(0 0 100% 0)", y: -8, opacity: 1, rotate: 0 }, { clipPath: "inset(0 0 0% 0)", y: 0, duration: 0.24, ease: EASE, delay: delay || 0, clearProps: "clipPath,transform" });
  }
  function tearOff(card, done) {
    if (!motion) { done(); return; }
    gsap.to(card, { y: -12, rotate: -2, opacity: 0, duration: 0.16, ease: "power2.out", onComplete: function () { gsap.set(card, { clearProps: "transform,opacity" }); done(); } });
  }
  function again(out, fn) {
    var b = document.createElement("button"); b.type = "button"; b.className = "linkbtn"; b.textContent = "Try it again";
    b.addEventListener("click", fn); out.appendChild(document.createTextNode(" ")); out.appendChild(b); return b;
  }

  /* ---------- No. 04: claim the retro ---------- */
  var cl = $("#claim");
  if (cl) {
    var cAmt = $(".now .amt", cl), cBtn = $("[data-claim]", cl), cOut = $(".claim-out", cl), cSt = $(".claim-stamp", cl), cAct = $(".claim-act", cl);
    var cReset = function () { cl.classList.remove("is-done"); cAmt.classList.add("is-pending"); cSt.textContent = ""; cOut.textContent = ""; cAct.hidden = false; };
    cReset();
    cBtn.addEventListener("click", function () {
      cAct.hidden = true; cl.classList.add("is-done");
      cSt.textContent = "CLAIM SENT"; thump(cSt);
      setTimeout(function () { cAmt.classList.remove("is-pending"); }, motion ? 140 : 0);
      cOut.textContent = "Marked as sent by SAMPLE owner, and recorded against Brand A’s contract. You send the claim to the brand yourself.";
      again(cOut, function () { cReset(); cBtn.focus(); }).focus();
    });
  }

  /* ---------- No. 06: the payslip writes itself ---------- */
  var sl = $("#slip");
  if (sl) {
    var sRun = $('[data-slip="run"]', sl), sCert = $('[data-slip="cert"]', sl), sOut = $(".slip-out", sl), sSt = $(".slip-stamp", sl);
    var sReset = function () {
      sl.classList.add("js-slip", "is-blank"); sl.classList.remove("is-certified");
      sRun.hidden = false; sCert.disabled = true; sSt.textContent = ""; sOut.textContent = "Hours come from the approved timesheets. Press to work out pay.";
    };
    sReset();
    sRun.addEventListener("click", function () {
      sl.classList.remove("is-blank"); sRun.hidden = true;
      var t = writeOn($$(".w", sl), 0.05, 0.07);
      sOut.textContent = "";
      setTimeout(function () {
        sCert.disabled = false;
        sOut.textContent = "Worked out with HMRC’s 2026 to 2027 rates. Only the owner can certify it.";
        sCert.focus();
      }, motion ? t * 1000 : 0);
    });
    sCert.addEventListener("click", function () {
      sCert.disabled = true; sl.classList.add("is-certified");
      sSt.textContent = "CERTIFIED"; thump(sSt);
      sOut.textContent = "Certified by SAMPLE owner and recorded under that name. Nothing is sent to HMRC: your payroll provider files.";
      again(sOut, function () { sReset(); sRun.focus(); }).focus();
    });
  }

  /* ---------- No. 07: the host stand ---------- */
  var hsSvg = $("#hs-plan"), hsT = $("#hs-ticket"), hsN = $("#hs-seated"), hsSt = $(".hs-stamp");
  if (hsSvg && hsT) {
    var NS = "http://www.w3.org/2000/svg";
    var mk = function (n, a, p) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
    // tables as read from 38_dashboard /api/m/bookings (51_bookings), 16 Oct 2026 19:30; who = the party seated at the start
    var T0 = [
      ["T1", 6, 5, 7, 7, "round", "seated", 2, "", "Nell F."], ["T2", 17, 5, 7, 7, "round", "seated", 2, "Next 20:00 Ada M. (2)", "Ines M."],
      ["T3", 28, 5, 10, 7, "rect", "free", 0, "Next 20:15 Luca F. (4)"], ["T4", 6, 18, 10, 7, "rect", "seated", 3, "Next 21:00 Jude C. (4)", "Sam W."],
      ["T5", 18, 18, 10, 7, "rect", "held", 0, "Next 20:00 Fay G. (4)"], ["T6", 30, 18, 10, 7, "rect", "free", 0, "Next 20:30 Max P. (4)"],
      ["T7", 6, 31, 14, 8, "rect", "seated", 6, "Next 20:30 Cleo N. (6)", "Hal I."], ["T8", 26, 30, 10, 10, "round", "free", 0, "Next 20:15 Iris K. (5)"],
      ["S1", 51, 5, 10, 7, "rect", "held", 0, "Next 19:45 Priya R. (4)"], ["S2", 51, 17, 10, 7, "rect", "seated", 4, "Next 20:45 Hannah P. (2)", "Rae J."],
      ["S3", 49, 30, 14, 9, "rect", "seated", 8, "", "Otto L."], ["B1", 72, 4, 5, 5, "stool", "seated", 2, ""], ["B2", 80, 4, 5, 5, "stool", "seated", 1, ""],
      ["B3", 88, 4, 5, 5, "stool", "seated", 2, ""], ["B4", 72, 18, 10, 7, "rect", "seated", 4, ""], ["B5", 85, 18, 10, 7, "rect", "seated", 2, ""]
    ];
    var gRooms = mk("g", { "class": "hs-rooms" }, hsSvg), gT = mk("g", { "class": "hs-tables" }, hsSvg);
    [["M0 0 H45 V44 H0 Z", "Dining room", 1, 43], ["M47 0 H66 V44 H47 Z", "Snug", 48, 43], ["M68 0 H100 V44 H68 Z", "Bar", 69, 43]].forEach(function (r) {
      mk("path", { d: r[0], "class": "ink hs-wall", pathLength: 1 }, gRooms);
      var tx = mk("text", { x: r[2], y: r[3], "class": "hs-room" }, gRooms); tx.textContent = r[1];
    });
    mk("path", { d: "M70 13 H98", "class": "ink hs-wall thin", pathLength: 1 }, gRooms);
    var tb = {};
    T0.forEach(function (r) {
      var g = mk("g", { "class": "hs-t", "data-id": r[0] }, gT), sh;
      if (r[5] === "round" || r[5] === "stool") sh = mk("ellipse", { cx: r[1] + r[3] / 2, cy: r[2] + r[4] / 2, rx: r[3] / 2, ry: r[4] / 2, "class": "shape" }, g);
      else sh = mk("rect", { x: r[1], y: r[2], width: r[3], height: r[4], rx: 0.6, "class": "shape" }, g);
      var id = mk("text", { x: r[1] + r[3] / 2, y: r[2] + r[4] / 2 - (r[5] === "stool" ? 0 : 0.6), "class": "hs-id" }, g); id.textContent = r[0];
      var who = mk("text", { x: r[1] + r[3] / 2, y: r[2] + r[4] / 2 + 2.4, "class": "hs-who" }, g);
      tb[r[0]] = { g: g, sh: sh, who: who, row: r };
    });
    var seated, step, focusAfter;
    var setState = function (id, st, who) {
      var t = tb[id]; t.g.setAttribute("class", "hs-t st-" + st); t.st = st;
      t.who.textContent = who || "";
      if (who && motion) gsap.fromTo(t.who, { clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% -5% -20% 0)", duration: 0.26, ease: "power2.out", clearProps: "clipPath" });
    };
    var count = function (d) { seated += d; hsN.textContent = seated; if (motion) gsap.fromTo(hsN, { y: -6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, ease: EASE, clearProps: "all" }); };
    var stamp = function (txt) { hsSt.textContent = txt; thump(hsSt); };
    var free = ["T3", "T6", "T8"];
    var unpick = function () { free.forEach(function (id) { var t = tb[id]; t.g.classList.remove("pickable"); t.g.removeAttribute("tabindex"); t.g.removeAttribute("role"); t.g.removeAttribute("aria-label"); }); };
    var ticket = function (html, wire) {
      // first render at load: same markup as the static ticket in index.html, so nothing moves (CLS 0) and nothing prints
      var go = function () { hsT.innerHTML = html; if (focusAfter) printIn(hsT); if (wire) wire(); if (focusAfter) { var f = $("button", hsT); if (f) f.focus(); } };
      if (focusAfter && motion) tearOff(hsT, go); else go();
    };
    var steps = [
      function () {
        ticket('<div class="ch"><b>Arriving</b><span class="serial">19:45</span></div><p class="f-title">Priya R., party of 4, booked for S1 in the snug.</p><p class="hs-n">S1 is held for them.</p><div class="hs-act"><button class="btn btn-sm" type="button">Seat Priya R. at S1</button></div>',
          function () { $("button", hsT).addEventListener("click", function () { setState("S1", "seated", "Priya R. · 4"); count(4); stamp("SEATED"); next(); }); });
      },
      function () {
        ticket('<div class="ch"><b>Waitlist</b><span class="serial">waited 8 min</span></div><p class="f-title">Tess, party of 3. Pick a free table on the plan.</p><ul class="hs-free"><li><b>T3</b> 4 seats · next 20:15 Luca F. (4)</li><li><b>T6</b> 4 seats · next 20:30 Max P. (4)</li><li><b>T8</b> 6 seats · next 20:15 Iris K. (5)</li></ul><p class="hs-n">Each free table shows who is booked next, before you seat anyone.</p>',
          function () {
            free.forEach(function (id) {
              var t = tb[id]; if (t.st !== "free") return;
              t.g.classList.add("pickable"); t.g.setAttribute("tabindex", "0"); t.g.setAttribute("role", "button"); t.g.setAttribute("aria-label", "Seat Tess, party of 3, at " + id);
              var pick = function (e) { if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return; e.preventDefault(); unpick(); setState(id, "seated", "Tess · 3"); count(3); stamp("SEATED"); focusAfter = true; next(); };
              t.g.onclick = pick; t.g.onkeydown = pick;
            });
            var first = tb.T3.g; if (focusAfter) first.focus();
          });
      },
      function () {
        ticket('<div class="ch"><b>Due out</b><span class="serial">19:32</span></div><p class="f-title">Ines M., party of 2 at T2, was due out at 19:32.</p><p class="hs-n">Next at T2: Ada M., party of 2, at 20:00.</p><div class="hs-act"><button class="btn btn-sm" type="button">Turn the table</button></div>',
          function () { $("button", hsT).addEventListener("click", function () { setState("T2", "held", "20:00"); count(-2); stamp("TURNED"); next(); }); });
      },
      function () {
        ticket('<div class="ch"><b>Done</b><span class="serial">19:46</span></div><p class="f-title">Seated now: ' + seated + ' covers.</p><p class="hs-n">A demonstration on this page. On the real host stand, each move is recorded under the name of whoever made it.</p><div class="hs-act"><button class="btn btn-sm btn-ghost" type="button">Start again</button></div>',
          function () { $("button", hsT).addEventListener("click", function () { start(); }); });
      }
    ];
    var next = function () { step++; steps[step](); };
    var start = function () {
      seated = 36; hsN.textContent = seated; hsSt.textContent = ""; step = -1; unpick();
      T0.forEach(function (r) { setState(r[0], r[0] === "T2" ? "needs" : r[6], r[6] !== "seated" ? "" : (r[9] && r[3] >= 9) ? r[9] + " · " + r[7] : String(r[7])); });
      next();
    };
    focusAfter = false; start(); focusAfter = true;
    // ink the walls in once, when the plan comes into view
    if (motion && "IntersectionObserver" in window) {
      var walls = $$(".hs-wall", hsSvg);
      gsap.set(walls, { strokeDasharray: "1 1", strokeDashoffset: 1 });
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { gsap.to(walls, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12, ease: "power1.inOut" }); gsap.from($$(".hs-t", hsSvg), { opacity: 0, duration: 0.3, stagger: 0.025, delay: 0.5 }); io.disconnect(); } }); }, { rootMargin: "0px 0px -20% 0px" });
      io.observe(hsSvg);
    }
  }

  /* ---------- No. 08: deal the next idea ---------- */
  var deal = $("#deal"), dBtn = $("#deal-next");
  if (deal && dBtn) {
    var cards = $$(".idea", deal), cur = 0;
    deal.classList.add("js-deal");
    var show = function (i) { cards.forEach(function (c, k) { c.classList.toggle("on", k === i); c.setAttribute("aria-hidden", k === i ? "false" : "true"); }); };
    show(0);
    dBtn.addEventListener("click", function () {
      var old = cards[cur]; cur = (cur + 1) % cards.length;
      var put = function () { show(cur); printIn(cards[cur]); if (motion) gsap.fromTo($$("p, li, h3", cards[cur]), { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.02, delay: 0.12, ease: EASE, clearProps: "transform,opacity" }); };
      tearOff(old, put);
      dBtn.textContent = cur === cards.length - 1 ? "Back to the first idea" : "Deal the next idea";
    });
  }
})();
