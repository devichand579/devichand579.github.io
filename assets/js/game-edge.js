(function () {
  var root = document.getElementById("play");
  if (!root) return;
  var W = 128,
    R = 96,
    K = 4,
    N = 5,
    SZ = 1024,
    MAX = 8;
  var cv = root.querySelector("canvas"),
    ctx = cv.getContext("2d"),
    img = ctx.createImageData(W, R);
  var lamTarget = 0.45,
    lamActual = 0,
    table = new Uint8Array(SZ);
  var base,
    twin = null,
    rows = [],
    running = false,
    pert = null,
    tries = 0,
    over = false;
  function q(s) {
    return root.querySelector(s);
  }
  function rev(i) {
    var r = 0;
    for (var k = 0; k < N; k++) {
      r = r * K + (i % K);
      i = (i / K) | 0;
    }
    return r;
  }
  function makeRule() {
    for (var i = 0; i < SZ; i++) table[i] = 255;
    for (i = 0; i < SZ; i++) {
      if (table[i] !== 255) continue;
      var x = i,
        d = [];
      for (var k = 0; k < N; k++) {
        d.push(x % K);
        x = (x / K) | 0;
      }
      var same = d.every(function (e) {
          return e === d[0];
        }),
        v;
      if (same) v = d[0];
      else v = Math.random() < lamTarget ? 1 + ((Math.random() * (K - 1)) | 0) : 0;
      table[i] = v;
      table[rev(i)] = v;
    }
    var c = 0;
    for (i = 0; i < SZ; i++) if (table[i] !== 0) c++;
    lamActual = c / SZ;
    setStatus();
  }
  function next(s) {
    var o = new Uint8Array(W);
    for (var i = 0; i < W; i++) {
      var id = 0;
      for (var k = -2; k <= 2; k++) id = id * K + s[(i + k + W) % W];
      o[i] = table[id];
    }
    return o;
  }
  function restart() {
    base = new Uint8Array(W);
    for (var i = 0; i < W; i++) base[i] = (Math.random() * K) | 0;
    rows = [{ s: base, d: null }];
    twin = null;
    pert = null;
  }
  function setStatus() {
    var el = q("[data-status]");
    if (!el) return;
    var word = pert && pert.verdict ? pert.verdict : "";
    el.textContent = "λ " + lamActual.toFixed(2) + " · rule " + tries + "/" + MAX + (word ? " · " + word : "");
  }
  function endGame(ok) {
    if (over) return;
    over = true;
    running = false;
    q("[data-verdict]").textContent = ok ? "Won" : "Lost";
    q("[data-end]").textContent = ok
      ? "The edge. The mark lasted and kept moving."
      : "Eight rules. The mark either died or flooded the row.";
    q("[data-card=end]").hidden = false;
  }
  function award(kind) {
    pert.verdict = kind;
    setStatus();
    if (kind === "edge") endGame(true);
    else if (tries >= MAX) endGame(false);
  }
  function step() {
    base = next(base);
    var d = null;
    if (twin) {
      twin = next(twin);
      d = new Uint8Array(W);
      var cnt = 0;
      for (var i = 0; i < W; i++) {
        if (base[i] !== twin[i]) {
          d[i] = 1;
          cnt++;
          if (!pert.touched[i]) {
            pert.touched[i] = 1;
            pert.nt++;
          }
        }
      }
      pert.t++;
      if (!pert.verdict) {
        var key = String.fromCharCode.apply(null, d);
        if (cnt === 0) award("order");
        else if (cnt > 0.6 * W) {
          if (pert.t < 150) award("chaos");
          else award("edge");
        } else if (pert.t > 5 && pert.keys.indexOf(key) !== -1) award("order");
        else if (pert.t >= 300) {
          if (pert.nt >= W / 4) award("edge");
          else award("order");
        }
        pert.keys.push(key);
        if (pert.keys.length > 64) pert.keys.shift();
      }
      if (cnt === 0) twin = null;
    }
    rows.push({ s: base, d: d });
    if (rows.length > R) rows.shift();
  }
  function hex(c) {
    c = c.trim().replace("#", "");
    if (c.length === 3) c = c.replace(/(.)/g, "$1$1");
    var n = parseInt(c, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function draw() {
    var cs = getComputedStyle(root);
    var bg = hex(cs.getPropertyValue("--ca-bg")),
      acc = hex(cs.getPropertyValue("--ca-accent"));
    var col = [bg, hex(cs.getPropertyValue("--ca-s1")), hex(cs.getPropertyValue("--ca-s2")), hex(cs.getPropertyValue("--ca-s3"))];
    var fade = !!(pert && rows.some(function (r) { return r.d; }));
    var p = img.data;
    for (var y = 0; y < R; y++) {
      var r = rows[y];
      for (var x = 0; x < W; x++) {
        var o = (y * W + x) * 4,
          c;
        if (!r) c = bg;
        else if (r.d && r.d[x]) c = acc;
        else {
          c = col[r.s[x]];
          if (fade && r.s[x] !== 0) c = [bg[0] + (c[0] - bg[0]) * 0.3, bg[1] + (c[1] - bg[1]) * 0.3, bg[2] + (c[2] - bg[2]) * 0.3];
        }
        p[o] = c[0];
        p[o + 1] = c[1];
        p[o + 2] = c[2];
        p[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  function begin() {
    over = false;
    tries = 1;
    running = true;
    q("[data-card=rules]").hidden = true;
    q("[data-card=end]").hidden = true;
    root.classList.add("is-on");
    makeRule();
    restart();
    draw();
  }
  cv.addEventListener("pointerdown", function (e) {
    if (!root.classList.contains("is-on") || over) return;
    var rc = cv.getBoundingClientRect();
    var c = Math.min(W - 1, Math.max(0, Math.floor(((e.clientX - rc.left) / rc.width) * W)));
    twin = base.slice();
    twin[c] = (twin[c] + 1 + ((Math.random() * (K - 1)) | 0)) % K;
    var d = new Uint8Array(W);
    d[c] = 1;
    rows[rows.length - 1] = { s: base, d: d };
    var tc = new Uint8Array(W);
    tc[c] = 1;
    pert = { t: 0, keys: [], verdict: null, touched: tc, nt: 1 };
    draw();
  });
  q("[data-a=lam]").addEventListener("change", function (e) {
    if (over || !running) return;
    if (tries >= MAX) return endGame(false);
    tries++;
    lamTarget = parseFloat(e.target.value);
    makeRule();
    restart();
    draw();
  });
  q("[data-enter]").addEventListener("click", begin);
  q("[data-again]").addEventListener("click", begin);
  var last = 0,
    acc = 0,
    interval = 1000 / 30;
  function loop(t) {
    var dt = Math.min(200, t - (last || t));
    last = t;
    if (running) {
      acc += dt;
      var n = 0;
      while (acc >= interval && n < 4) {
        step();
        acc -= interval;
        n++;
      }
      if (n) draw();
    }
    requestAnimationFrame(loop);
  }
  makeRule();
  restart();
  draw();
  requestAnimationFrame(loop);
})();
