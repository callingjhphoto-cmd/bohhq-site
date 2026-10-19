/* Back of House landing: the venue plan, drawn as ink linework.
 * Geometry adapted from 12_demo/server/floor_layout.json and the furniture rules in
 * 12_demo/static/floorplan.js (same tables, chairs, bar, sections). Changes for this page:
 * a walk-in is carved out of the kitchen corner, the office is labelled "Back office",
 * and six hit zones are added for the "Find the leaks" section. SAMPLE venue, invented.
 *
 *   BOHPlan.draw(svg, { zones: true|false, marks: true|false })
 * Every stroke carries pathLength=1 so it can be drawn with stroke-dashoffset.
 */
(function (root) {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  var L = {
    room: { x: 28, y: 28, w: 944, h: 584 },
    tables: [
      { kind: "booth", x: 86, y: 250, w: 56, h: 68, seats: 4 }, { kind: "booth", x: 86, y: 345, w: 56, h: 68, seats: 4 },
      { kind: "booth", x: 86, y: 440, w: 56, h: 68, seats: 4 }, { kind: "square", x: 204, y: 250, w: 68, h: 68, seats: 4 },
      { kind: "square", x: 204, y: 360, w: 52, h: 52, seats: 2 }, { kind: "square", x: 204, y: 465, w: 68, h: 68, seats: 4 },
      { kind: "square", x: 296, y: 250, w: 52, h: 52, seats: 2 }, { kind: "square", x: 296, y: 360, w: 52, h: 52, seats: 2 },
      { kind: "round", x: 414, y: 268, r: 40, seats: 6 }, { kind: "square", x: 534, y: 255, w: 68, h: 68, seats: 4 },
      { kind: "square", x: 614, y: 255, w: 52, h: 52, seats: 2 }, { kind: "square", x: 414, y: 402, w: 68, h: 68, seats: 4 },
      { kind: "rect", x: 554, y: 402, w: 160, h: 60, seats: 8 }, { kind: "square", x: 402, y: 520, w: 52, h: 52, seats: 2 },
      { kind: "square", x: 520, y: 525, w: 68, h: 68, seats: 4 }, { kind: "square", x: 612, y: 520, w: 52, h: 52, seats: 2 },
      { kind: "round", x: 722, y: 268, r: 40, seats: 6 }, { kind: "square", x: 830, y: 255, w: 52, h: 52, seats: 2 },
      { kind: "square", x: 702, y: 388, w: 52, h: 52, seats: 2 }, { kind: "square", x: 800, y: 388, w: 60, h: 60, seats: 4 },
      { kind: "round", x: 712, y: 500, r: 34, seats: 4 }, { kind: "high", x: 810, y: 500, r: 20, seats: 2 }
    ],
    // hit zones, ranked by pounds (biggest first), as the SAMPLE audit report ranks them
    zones: [
      { id: "floor", n: 1, label: "Floor", shape: [28, 190, 842, 422], mark: [470, 600, 300, 50], tag: [200, 650] },
      { id: "kitchen", n: 2, label: "Kitchen", shape: [28, 28, 200, 142], mark: [128, 104, 112, 70], tag: [44, 196] },
      { id: "office", n: 3, label: "Back office", shape: [610, 28, 90, 72], mark: [655, 64, 62, 50], tag: [612, 12] },
      { id: "bar", n: 4, label: "Bar", shape: [872, 190, 100, 422], mark: [920, 400, 70, 210], tag: [990, 168] },
      { id: "walkin", n: 5, label: "Walk-in", shape: [228, 28, 102, 92], mark: [279, 74, 66, 58], tag: [300, 12] },
      { id: "pos", n: 6, label: "POS", shape: [340, 28, 260, 162], mark: [410, 57, 70, 38], tag: [476, 210] }
    ]
  };

  // seeded RNG so the drawing is identical on every load
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    return n;
  }
  function stroke(g, name, attrs, layer) {
    attrs.pathLength = 1; attrs["class"] = (attrs["class"] ? attrs["class"] + " " : "") + "ink ink-" + layer;
    var n = el(name, attrs); g.appendChild(n); return n;
  }
  // architect's line: overshoots its corners a little; a faint second pass beside it
  function line(g, x1, y1, x2, y2, layer, cls) {
    var dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len;
    var o1 = 3 + rnd() * 6, o2 = 3 + rnd() * 6;
    var d = "M" + (x1 - ux * o1).toFixed(1) + " " + (y1 - uy * o1).toFixed(1) + " L" + (x2 + ux * o2).toFixed(1) + " " + (y2 + uy * o2).toFixed(1);
    stroke(g, "path", { d: d, "class": cls || "" }, layer);
    if (cls === "wall") {
      var j = 0.9 + rnd() * 0.6;
      var d2 = "M" + (x1 - ux * o1 * 0.4 + uy * j).toFixed(1) + " " + (y1 - uy * o1 * 0.4 - ux * j).toFixed(1) + " L" + (x2 + ux * o2 * 0.6 + uy * j).toFixed(1) + " " + (y2 + uy * o2 * 0.6 - ux * j).toFixed(1);
      stroke(g, "path", { d: d2, "class": "wall-ghost" }, layer);
    }
  }
  function box(g, x, y, w, h, layer, cls) {
    line(g, x, y, x + w, y, layer, cls); line(g, x + w, y, x + w, y + h, layer, cls);
    line(g, x + w, y + h, x, y + h, layer, cls); line(g, x, y + h, x, y, layer, cls);
  }
  // a biro ellipse, drawn once round and a little past where it started
  function biro(g, cx, cy, rx, ry, cls) {
    var pts = [], a0 = -2.2 + rnd() * 0.6, n = 34, over = 0.32;
    for (var i = 0; i <= n; i++) {
      var a = a0 + (Math.PI * 2 + over) * i / n, k = 1 + (rnd() - 0.5) * 0.035 + i / n * 0.05;
      pts.push((cx + Math.cos(a) * rx * k).toFixed(1) + " " + (cy + Math.sin(a) * ry * k).toFixed(1));
    }
    return stroke(g, "path", { d: "M" + pts.join(" L"), "class": "biro " + (cls || "") }, "mark");
  }
  function text(g, x, y, s, cls, anchor) {
    var t = el("text", { x: x, y: y, "class": cls, "text-anchor": anchor || "start" }); t.textContent = s; g.appendChild(t); return t;
  }

  var CH = { w: 20, d: 12, gap: 3 };
  function chair(g, x, y, rot) {
    stroke(g, "rect", { x: -CH.w / 2, y: -CH.d / 2, width: CH.w, height: CH.d, rx: 3, transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ") rotate(" + rot.toFixed(1) + ")" }, "furn");
  }
  function table(g, t) {
    var tg = el("g", { transform: "translate(" + t.x + " " + t.y + ")" }); g.appendChild(tg);
    if (t.kind === "round" || t.kind === "high") {
      stroke(tg, "circle", { r: t.r, "class": "top" }, "furn");
      if (t.kind === "high") { [-1, 1].forEach(function (s) { stroke(tg, "circle", { cx: s * (t.r + 12), r: 8 }, "furn"); }); return; }
      var r = t.r + CH.gap + CH.d / 2;
      for (var i = 0; i < t.seats; i++) { var a = 2 * Math.PI * (i + 0.5) / t.seats - Math.PI / 2; chair(tg, Math.cos(a) * r, Math.sin(a) * r, a * 180 / Math.PI + 90); }
      return;
    }
    stroke(tg, "rect", { x: -t.w / 2, y: -t.h / 2, width: t.w, height: t.h, rx: 3, "class": "top" }, "furn");
    if (t.kind === "booth") {
      stroke(tg, "rect", { x: -t.w / 2 - 20, y: -t.h / 2 - 4, width: 18, height: t.h + 8, rx: 5 }, "furn");
      for (var b = 0; b < t.seats - 2; b++) chair(tg, t.w / 2 + CH.gap + CH.d / 2, -t.h / 2 + (b + 0.5) * t.h / (t.seats - 2), 90);
      return;
    }
    var ends = (t.seats >= 6 && t.w > t.h * 1.6) ? 2 : 0, rest = t.seats - ends, top = Math.ceil(rest / 2), bot = Math.floor(rest / 2);
    for (var i2 = 0; i2 < top; i2++) chair(tg, -t.w / 2 + (i2 + 0.5) * t.w / top, -t.h / 2 - CH.gap - CH.d / 2, 0);
    for (var i3 = 0; i3 < bot; i3++) chair(tg, -t.w / 2 + (i3 + 0.5) * t.w / bot, t.h / 2 + CH.gap + CH.d / 2, 180);
    if (ends) { chair(tg, -t.w / 2 - CH.gap - CH.d / 2, 0, 270); chair(tg, t.w / 2 + CH.gap + CH.d / 2, 0, 90); }
  }

  function draw(svg, opts) {
    opts = opts || {}; seed = 7;
    svg.setAttribute("viewBox", opts.viewBox || "-10 -10 1030 740");
    var uid = svg.id || "p";
    var defs = el("defs", {});
    var pat = el("pattern", { id: uid + "-hatch", width: 7, height: 7, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
    pat.appendChild(el("line", { x1: 0, y1: 0, x2: 0, y2: 7, "class": "hatch-line" }));
    defs.appendChild(pat); svg.appendChild(defs);

    var gFill = el("g", { "class": "fills" }), gZones = el("g", { "class": "zone-fills" }), g = el("g", { "class": "lines" }), gLab = el("g", { "class": "labels" }), gMark = el("g", { "class": "marks" });
    svg.appendChild(gFill); svg.appendChild(gZones); svg.appendChild(g); svg.appendChild(gLab); svg.appendChild(gMark);

    var R = L.room, T = 10;
    // tinted floor of the dining room, and hatched walls (fade in after the ink)
    gFill.appendChild(el("rect", { x: 28, y: 190, width: 842, height: 422, "class": "floor-tint" }));
    gFill.appendChild(el("path", { d: "M" + (R.x - T) + " " + (R.y - T) + "h" + (R.w + 2 * T) + "v" + (R.h + 2 * T) + "h" + -(R.w + 2 * T) + "z M" + R.x + " " + R.y + "v" + R.h + "h" + R.w + "v" + -R.h + "z", fill: "url(#" + uid + "-hatch)", "fill-rule": "evenodd", "class": "wall-hatch" }));
    [[28, 28, 200, 142], [228, 28, 102, 92], [660, 150, 212, 40], [610, 28, 90, 72]].forEach(function (r) {
      gFill.appendChild(el("rect", { x: r[0], y: r[1], width: r[2], height: r[3], fill: "url(#" + uid + "-hatch)", "class": "room-hatch" }));
    });

    // 1. outer walls, double line (entrance gap on the south wall, 150..230)
    line(g, R.x - T, R.y - T, R.x + R.w + T, R.y - T, "wall", "wall");
    line(g, R.x + R.w + T, R.y - T, R.x + R.w + T, R.y + R.h + T, "wall", "wall");
    line(g, R.x + R.w + T, R.y + R.h + T, 230, R.y + R.h + T, "wall", "wall");
    line(g, 150, R.y + R.h + T, R.x - T, R.y + R.h + T, "wall", "wall");
    line(g, R.x - T, R.y + R.h + T, R.x - T, R.y - T, "wall", "wall");
    line(g, R.x, R.y, R.x + R.w, R.y, "wall", "wall-in"); line(g, R.x + R.w, R.y, R.x + R.w, R.y + R.h, "wall", "wall-in");
    line(g, R.x + R.w, R.y + R.h, 230, R.y + R.h, "wall", "wall-in"); line(g, 150, R.y + R.h, R.x, R.y + R.h, "wall", "wall-in");
    line(g, R.x, R.y + R.h, R.x, R.y, "wall", "wall-in");
    // 2. inner walls: kitchen, walk-in, service alley, office, toilets, store
    line(g, 28, 170, 92, 170, "inner", "wall"); line(g, 262, 170, 330, 170, "inner", "wall");
    line(g, 330, 28, 330, 64, "inner", "wall"); line(g, 330, 116, 330, 170, "inner", "wall");
    line(g, 228, 28, 228, 120, "inner", "wall"); line(g, 228, 120, 250, 120, "inner", "wall"); line(g, 300, 120, 330, 120, "inner", "wall");
    line(g, 600, 28, 600, 190, "inner", "wall"); line(g, 340, 28, 340, 64, "inner", "wall"); line(g, 340, 116, 340, 190, "inner", "wall");
    line(g, 700, 28, 700, 100, "inner", "wall"); line(g, 610, 100, 640, 100, "inner", "wall"); line(g, 680, 100, 972, 100, "inner", "wall");
    line(g, 610, 28, 610, 100, "inner", "wall");
    line(g, 660, 150, 872, 150, "inner", "wall"); line(g, 660, 150, 660, 190, "inner", "wall"); line(g, 872, 150, 872, 190, "inner", "wall");
    line(g, 790, 28, 790, 100, "inner", "wall"); line(g, 880, 28, 880, 100, "inner", "wall");
    // 3. fixtures
    box(g, 92, 168, 170, 13, "fix");                                   // pass
    for (var p = 0; p < 6; p++) box(g, 104 + p * 26, 171, 14, 7, "fix");
    box(g, 44, 44, 160, 34, "fix"); [70, 110, 150].forEach(function (x) { stroke(g, "circle", { cx: x, cy: 61, r: 11 }, "fix"); }); // range
    box(g, 44, 104, 120, 30, "fix");                                    // prep bench
    box(g, 240, 40, 78, 22, "fix"); box(g, 240, 74, 78, 22, "fix");      // walk-in shelving
    box(g, 362, 40, 96, 34, "fix"); box(g, 472, 40, 96, 34, "fix");      // POS station, cutlery
    stroke(g, "path", { d: "M330 116 A52 52 0 0 0 366 80 M330 116 L366 80" }, "fix");        // swing door
    stroke(g, "path", { d: "M250 120 A50 50 0 0 1 286 156 M250 120 L286 156" }, "fix");      // walk-in door
    stroke(g, "path", { d: "M150 622 L150 562 A60 60 0 0 1 210 622" }, "fix");               // entrance door
    box(g, 624, 50, 62, 30, "fix");                                    // office desk
    box(g, 906, 200, 40, 340, "fix"); box(g, 948, 200, 24, 340, "fix"); // bar counter, back bar
    for (var k = 0; k < 8; k++) line(g, 951, 214 + k * 40, 969, 214 + k * 40, "fix");
    for (var s = 0; s < 11; s++) stroke(g, "circle", { cx: 888, cy: 215 + s * 31.5, r: 9.5 }, "furn");
    box(g, 256, 566, 64, 34, "fix");                                   // host stand
    [[800, 64], [925, 64]].forEach(function (c) { stroke(g, "circle", { cx: c[0] + 28, cy: c[1], r: 8 }, "fix"); });
    // windows
    [[60, 140], [250, 470], [500, 630]].forEach(function (w) { line(g, w[0], 616, w[1], 616, "fix", "win"); });
    line(g, 24, 200, 24, 560, "fix", "win");
    // 4. tables and chairs
    L.tables.forEach(function (t) { table(g, t); });

    // labels
    text(gLab, 44, 160, "Kitchen", "room");
    text(gLab, 238, 112, "Walk-in", "room-s wi");
    text(gLab, 470, 176, "Service alley", "room mid", "middle");
    text(gLab, 410, 61, "POS", "room-s", "middle"); text(gLab, 520, 61, "Cutlery", "room-s tiny", "middle");
    text(gLab, 655, 94, "Back office", "room-s lg", "middle"); text(gLab, 655, 94, "Office", "room-s sm", "middle"); // .sm shows under 640 px only
    text(gLab, 835, 94, "WC", "room-s tiny", "middle"); text(gLab, 926, 94, "WC", "room-s tiny", "middle");
    text(gLab, 766, 176, "Dry store", "room-s tiny", "middle");
    text(gLab, 0, 0, "Bar", "room").setAttribute("transform", "translate(931 380) rotate(90)");
    text(gLab, 190, 650, "Entrance", "room-s tiny", "middle");   // .tiny labels hide under 640 px (site.css)
    text(gLab, 288, 588, "Host", "room-s tiny", "middle");
    [["A", 184], ["B", 490], ["C", 756]].forEach(function (z) { text(gLab, z[1], 600, "Section " + z[0], "hand-s", "middle"); });
    line(g, 340, 196, 340, 606, "fix", "dash"); line(g, 640, 196, 640, 606, "fix", "dash");

    // zones (fills for the selected state) and hit areas
    var zoneEls = {};
    L.zones.forEach(function (z) {
      var r = z.shape, f = el("rect", { x: r[0], y: r[1], width: r[2], height: r[3], "class": "zone-fill", "data-zone": z.id });
      gZones.appendChild(f); zoneEls[z.id] = { fill: f };
    });
    if (opts.marks || opts.zones) {
      L.zones.forEach(function (z) {
        var m = z.mark, mg = el("g", { "class": "mark", "data-zone": z.id });
        var ring = biro(mg, m[0], m[1], m[2] / 2 + 6, m[3] / 2 + 6);
        var cx = z.tag[0], cy = z.tag[1];
        var lead = stroke(mg, "path", { d: "M" + cx + " " + cy + " L" + (m[0] + (cx - m[0]) * 0.3).toFixed(1) + " " + (m[1] + (cy - m[1]) * 0.3).toFixed(1), "class": "biro lead" }, "mark");
        var bub = stroke(mg, "circle", { cx: cx, cy: cy, r: 17, "class": "biro bubble" }, "mark");
        text(mg, cx, cy + 8, String(z.n), "num-hand", "middle");
        gMark.appendChild(mg);
        zoneEls[z.id].mark = mg;
        if (opts.zones) mg.classList.add("is-off");
      });
    }
    if (opts.zones) {
      var gHit = el("g", { "class": "hits" }); svg.appendChild(gHit);
      L.zones.slice().reverse().forEach(function (z) {
        var r = z.shape, h = el("rect", { x: r[0], y: r[1], width: r[2], height: r[3], "class": "hit", "data-zone": z.id });
        var t = el("title", {}); t.textContent = z.label; h.appendChild(t);
        gHit.appendChild(h); zoneEls[z.id].hit = h;
      });
    }
    return { zones: L.zones, els: zoneEls };
  }

  root.BOHPlan = { draw: draw, zones: L.zones, biro: biro };
})(window);
