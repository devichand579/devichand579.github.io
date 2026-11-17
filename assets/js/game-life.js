(function () {
  var root = document.getElementById("play");
  if (!root) return;
  var W = 64,
    H = 44,
    M = 8,
    TW = W + 2 * M,
    TH = H + 2 * M;
  var cv = root.querySelector("canvas"),
    ctx = cv.getContext("2d");
  var g = new Uint8Array(TW * TH),
    nx = new Uint8Array(TW * TH);
  var gen = 0,
    running = false,
    over = false,
    speed = 12,
    userMade = false,
    cs = 8,
    dpr = 1;
  var done = { still: false, osc: false, glider: false };
  function q(s) {
    return root.querySelector(s);
  }
  function I(x, y) {
    return (y + M) * TW + (x + M);
  }
  function lifeSet(cells) {
    var m = {},
      o = [];
    cells.forEach(function (c) {
      for (var dy = -1; dy <= 1; dy++)
        for (var dx = -1; dx <= 1; dx++) {
          var k = c[0] + dx + "," + (c[1] + dy);
          m[k] = (m[k] || 0) + (dx || dy ? 1 : 0);
        }
    });
    var live = {};
    cells.forEach(function (c) {
      live[c[0] + "," + c[1]] = 1;
    });
    for (var k in m) {
      var n = m[k];
      if (n === 3 || (n === 2 && live[k])) {
        var p = k.split(",");
        o.push([+p[0], +p[1]]);
      }
    }
    return o;
  }
  function norm(cells) {
    var mx = Math.min.apply(
        null,
        cells.map(function (c) {
          return c[0];
        })
      ),
      my = Math.min.apply(
        null,
        cells.map(function (c) {
          return c[1];
        })
      );
    return cells
      .map(function (c) {
        return c[0] - mx + "," + (c[1] - my);
      })
      .sort()
      .join(";");
  }
  var gliderKeys = {};
  (function () {
    var ph = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    for (var t = 0; t < 4; t++) {
      for (var s = 0; s < 8; s++) {
        var v = ph.map(function (c) {
          var x = c[0],
            y = c[1];
          if (s & 1) x = -x;
          if (s & 2) y = -y;
          if (s & 4) {
            var tmp = x;
            x = y;
            y = tmp;
          }
          return [x, y];
        });
        gliderKeys[norm(v)] = 1;
      }
      ph = lifeSet(ph);
    }
  })();
  function stepOnce() {
    for (var y = 1; y < TH - 1; y++)
      for (var x = 1; x < TW - 1; x++) {
        var i = y * TW + x;
        var c =
          g[i - TW - 1] +
          g[i - TW] +
          g[i - TW + 1] +
          g[i - 1] +
          g[i + 1] +
          g[i + TW - 1] +
          g[i + TW] +
          g[i + TW + 1];
        nx[i] = c === 3 || (c === 2 && g[i]) ? 1 : 0;
      }
    for (x = 0; x < TW; x++) {
      nx[x] = 0;
      nx[TW + x] = 0;
      nx[(TH - 1) * TW + x] = 0;
      nx[(TH - 2) * TW + x] = 0;
    }
    for (y = 0; y < TH; y++) {
      nx[y * TW] = 0;
      nx[y * TW + 1] = 0;
      nx[y * TW + TW - 1] = 0;
      nx[y * TW + TW - 2] = 0;
    }
    var t = g;
    g = nx;
    nx = t;
    gen++;
    checkGoals();
    if (!over && gen >= 400 && !(done.still && done.osc && done.glider)) finish(false);
  }
  function pop() {
    var p = 0;
    for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) p += g[I(x, y)];
    return p;
  }
  function win(kind) {
    if (done[kind] || over) return;
    done[kind] = true;
    if (done.still && done.osc && done.glider) finish(true);
  }
  function finish(ok) {
    if (over) return;
    over = true;
    running = false;
    q("[data-verdict]").textContent = ok ? "Won" : "Lost";
    q("[data-end]").textContent = ok
      ? "A block stores, a blink keeps time, and a glider carries a signal."
      : "Generation 400. The grid never held all three.";
    q("[data-card=end]").hidden = false;
  }
  function status() {
    var bits = [];
    if (done.still) bits.push("block");
    if (done.osc) bits.push("blink");
    if (done.glider) bits.push("glider");
    q("[data-status]").textContent = "gen " + gen + (bits.length ? " · " + bits.join(", ") : "");
  }
  function hasGlider() {
    var seen = new Uint8Array(W * H);
    for (var y = 0; y < H; y++)
      for (var x = 0; x < W; x++) {
        if (!g[I(x, y)] || seen[y * W + x]) continue;
        var stack = [[x, y]],
          comp = [];
        seen[y * W + x] = 1;
        while (stack.length && comp.length < 7) {
          var c = stack.pop();
          comp.push(c);
          for (var dy = -1; dy <= 1; dy++)
            for (var dx = -1; dx <= 1; dx++) {
              var a = c[0] + dx,
                b = c[1] + dy;
              if (a < 0 || b < 0 || a >= W || b >= H || seen[b * W + a] || !g[I(a, b)]) continue;
              seen[b * W + a] = 1;
              stack.push([a, b]);
            }
        }
        if (comp.length === 5 && !stack.length && gliderKeys[norm(comp)]) return true;
      }
    return false;
  }
  var hb = new Uint32Array(W * H),
    sinceEdit = 0;
  function comps(test) {
    var seen = new Uint8Array(W * H),
      out = [];
    for (var y = 0; y < H; y++)
      for (var x = 0; x < W; x++) {
        var j = y * W + x;
        if (seen[j] || !test(j)) continue;
        var st = [j],
          c = [];
        seen[j] = 1;
        while (st.length) {
          var k = st.pop();
          c.push(k);
          var kx = k % W,
            ky = (k / W) | 0;
          for (var dy = -1; dy <= 1; dy++)
            for (var dx = -1; dx <= 1; dx++) {
              var a = kx + dx,
                b = ky + dy;
              if (a < 0 || b < 0 || a >= W || b >= H) continue;
              var m = b * W + a;
              if (!seen[m] && test(m)) {
                seen[m] = 1;
                st.push(m);
              }
            }
        }
        out.push(c);
      }
    return out;
  }
  function halo(c) {
    var inC = {},
      h = [];
    c.forEach(function (k) {
      inC[k] = 1;
    });
    c.forEach(function (k) {
      var kx = k % W,
        ky = (k / W) | 0;
      for (var dy = -1; dy <= 1; dy++)
        for (var dx = -1; dx <= 1; dx++) {
          var a = kx + dx,
            b = ky + dy;
          if (a < 0 || b < 0 || a >= W || b >= H) continue;
          var m = b * W + a;
          if (!inC[m]) {
            inC[m] = 1;
            h.push(m);
          }
        }
    });
    return h;
  }
  var M20 = 0xfffff,
    M30 = 0x3fffffff;
  function checkGoals() {
    for (var y = 0; y < H; y++)
      for (var x = 0; x < W; x++) {
        var j = y * W + x;
        hb[j] = ((hb[j] << 1) | g[I(x, y)]) >>> 0;
      }
    sinceEdit++;
    if (!userMade) return;
    if (hasGlider()) win("glider");
    if (sinceEdit < 30) return;
    if (!done.still) {
      comps(function (j) {
        return g[I(j % W, (j / W) | 0)] === 1;
      }).some(function (c) {
        if (c.length < 3) return false;
        if (
          !c.every(function (k) {
            return (hb[k] & M20) === M20;
          })
        )
          return false;
        if (
          !halo(c).every(function (k) {
            return (hb[k] & M20) === 0;
          })
        )
          return false;
        win("still");
        return true;
      });
    }
    if (!done.osc) {
      comps(function (j) {
        var h = hb[j] & M30;
        return h !== 0 && h !== M30;
      }).some(function (c) {
        var hl = halo(c);
        if (
          !hl.every(function (k) {
            var h = hb[k] & M30;
            return h === 0 || h === M30;
          })
        )
          return false;
        for (var p = 2; p <= 15; p++) {
          var mk = ((1 << (30 - p)) - 1) >>> 0;
          if (
            c.every(function (k) {
              return ((hb[k] ^ (hb[k] >>> p)) & mk) === 0;
            })
          ) {
            win("osc");
            return true;
          }
        }
        return false;
      });
    }
  }
  function reset() {
    g = new Uint8Array(TW * TH);
    nx = new Uint8Array(TW * TH);
    gen = 0;
    hb = new Uint32Array(W * H);
    sinceEdit = 0;
  }
  function place(cells, ox, oy) {
    reset();
    userMade = false;
    cells.forEach(function (c) {
      g[I(c[0] + ox, c[1] + oy)] = 1;
    });
    draw();
  }
  var P = {
    glider: function () {
      place(
        [
          [1, 0],
          [2, 1],
          [0, 2],
          [1, 2],
          [2, 2],
        ],
        4,
        4
      );
    },
    blinker: function () {
      place(
        [
          [0, 0],
          [1, 0],
          [2, 0],
        ],
        (W >> 1) - 1,
        H >> 1
      );
    },
    rpent: function () {
      place(
        [
          [1, 0],
          [2, 0],
          [0, 1],
          [1, 1],
          [1, 2],
        ],
        (W >> 1) - 1,
        (H >> 1) - 1
      );
    },
    gun: function () {
      place(
        [
          [24, 0],
          [22, 1],
          [24, 1],
          [12, 2],
          [13, 2],
          [20, 2],
          [21, 2],
          [34, 2],
          [35, 2],
          [11, 3],
          [15, 3],
          [20, 3],
          [21, 3],
          [34, 3],
          [35, 3],
          [0, 4],
          [1, 4],
          [10, 4],
          [16, 4],
          [20, 4],
          [21, 4],
          [0, 5],
          [1, 5],
          [10, 5],
          [14, 5],
          [16, 5],
          [17, 5],
          [22, 5],
          [24, 5],
          [10, 6],
          [16, 6],
          [24, 6],
          [11, 7],
          [15, 7],
          [12, 8],
          [13, 8],
        ],
        2,
        2
      );
    },
    random: function () {
      reset();
      userMade = false;
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) g[I(x, y)] = Math.random() < 0.3 ? 1 : 0;
      draw();
    },
  };
  var lastW = -1;
  function size() {
    var w = cv.clientWidth || 600;
    if (w === lastW) return;
    lastW = w;
    dpr = window.devicePixelRatio || 1;
    cs = Math.max(3, w / W);
    cv.width = Math.round(W * cs * dpr);
    cv.height = Math.round(H * cs * dpr);
    cv.style.height = H * cs + "px";
    draw();
  }
  function draw() {
    var st = getComputedStyle(root),
      bg = st.getPropertyValue("--global-bg-color").trim(),
      fg = st.getPropertyValue("--ca-cell").trim(),
      ln = st.getPropertyValue("--global-divider-color").trim();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W * cs, H * cs);
    if (cs >= 7) {
      ctx.strokeStyle = ln;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (var x = 1; x < W; x++) {
        ctx.moveTo(x * cs, 0);
        ctx.lineTo(x * cs, H * cs);
      }
      for (var y = 1; y < H; y++) {
        ctx.moveTo(0, y * cs);
        ctx.lineTo(W * cs, y * cs);
      }
      ctx.stroke();
    }
    ctx.fillStyle = fg;
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) if (g[I(x, y)]) ctx.fillRect(x * cs + 0.5, y * cs + 0.5, cs - 1, cs - 1);
    status();
  }
  var painting = false,
    paintVal = 1;
  function cellAt(e) {
    var rc = cv.getBoundingClientRect();
    return [Math.floor(((e.clientX - rc.left) / rc.width) * W), Math.floor(((e.clientY - rc.top) / rc.height) * H)];
  }
  function paint(e) {
    var c = cellAt(e);
    if (c[0] < 0 || c[1] < 0 || c[0] >= W || c[1] >= H) return;
    g[I(c[0], c[1])] = paintVal;
    userMade = true;
    sinceEdit = 0;
    draw();
  }
  cv.addEventListener("pointerdown", function (e) {
    if (!root.classList.contains("is-on") || over) return;
    var c = cellAt(e);
    if (c[0] < 0 || c[1] < 0 || c[0] >= W || c[1] >= H) return;
    painting = true;
    paintVal = g[I(c[0], c[1])] ? 0 : 1;
    cv.setPointerCapture(e.pointerId);
    paint(e);
  });
  cv.addEventListener("pointermove", function (e) {
    if (painting) paint(e);
  });
  cv.addEventListener("pointerup", function () {
    painting = false;
  });
  cv.addEventListener("pointercancel", function () {
    painting = false;
  });
  function begin() {
    over = false;
    done.still = false;
    done.osc = false;
    done.glider = false;
    q("[data-card=rules]").hidden = true;
    q("[data-card=end]").hidden = true;
    root.classList.add("is-on");
    reset();
    userMade = false;
    running = true;
    draw();
  }
  q("[data-enter]").addEventListener("click", begin);
  q("[data-again]").addEventListener("click", begin);
  var last = 0,
    acc = 0;
  function loop(t) {
    var dt = Math.min(250, t - (last || t));
    last = t;
    if (running) {
      acc += dt;
      var iv = 1000 / speed,
        n = 0;
      while (acc >= iv && n < 5) {
        stepOnce();
        acc -= iv;
        n++;
      }
      if (n) draw();
    }
    requestAnimationFrame(loop);
  }
  if (window.ResizeObserver) new ResizeObserver(size).observe(cv);
  else window.addEventListener("resize", size);
  reset();
  size();
  requestAnimationFrame(loop);
})();
