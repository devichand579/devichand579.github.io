(() => {
  const gallery = document.getElementById("game-gallery");
  if (!gallery) return;

  const cards = [...gallery.querySelectorAll(".game-tile")];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function drawEdge(ctx, w, h, t) {
    ctx.fillStyle = "#2a1238";
    ctx.fillRect(0, 0, w, h);
    const cols = 42;
    const cw = w / cols;
    const shift = Math.floor(t * 10);
    for (let y = 0; y < h; y += 3) {
      for (let x = 0; x < cols; x++) {
        const wave = Math.sin((x + shift) * 0.45 + y * 0.08);
        const on = wave > 0.2;
        ctx.fillStyle = on ? "#7a4d96" : "#3a2148";
        ctx.fillRect(x * cw, y, cw - 0.5, 2);
      }
    }
    ctx.fillStyle = "#e85ad2";
    const tip = (t * 28) % (h + 20);
    ctx.beginPath();
    ctx.moveTo(w * 0.5, tip);
    ctx.lineTo(w * 0.5 - tip * 0.35, 0);
    ctx.lineTo(w * 0.5 + tip * 0.35, 0);
    ctx.fill();
  }

  function drawLife(ctx, w, h, t) {
    const n = 18;
    const cell = w / n;
    ctx.fillStyle = "#101614";
    ctx.fillRect(0, 0, w, h);
    const step = Math.floor(t * 2.5);
    const glider = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const blink = step % 2 === 0 ? [[0, 0], [0, 1], [0, 2]] : [[-1, 1], [0, 1], [1, 1]];
    ctx.fillStyle = "#5dcaa5";
    glider.forEach(([x, y]) => {
      const gx = (2 + x + step) % n;
      const gy = (2 + y + step) % Math.floor(h / cell);
      ctx.fillRect(gx * cell + 1, gy * cell + 1, cell - 2, cell - 2);
    });
    blink.forEach(([x, y]) => {
      ctx.fillRect((12 + x) * cell + 1, (3 + y) * cell + 1, cell - 2, cell - 2);
    });
  }

  function drawRadiate(ctx, w, h, t) {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.7);
    g.addColorStop(0, "#1a2148");
    g.addColorStop(1, "#090c1d");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const blobs = [
      [0.28, 0.42, "#ff9142"],
      [0.68, 0.38, "#4fa6ff"],
      [0.5, 0.7, "#ee5fa0"],
    ];
    blobs.forEach(([px, py, color], i) => {
      const pulse = 0.75 + 0.25 * Math.sin(t * 2 + i);
      const r = w * 0.16 * pulse;
      const glow = ctx.createRadialGradient(px * w, py * h, 0, px * w, py * h, r);
      glow.addColorStop(0, color);
      glow.addColorStop(1, color + "00");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px * w, py * h, r, 0, Math.PI * 2);
      ctx.fill();
    });
    const ring = (t % 2.4) / 2.4;
    ctx.strokeStyle = `rgba(255, 90, 79, ${1 - ring})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.72, h * 0.62, 8 + ring * w * 0.22, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawBaldwin(ctx, w, h, t) {
    ctx.fillStyle = "#07050f";
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.28);
    glow.addColorStop(0, "rgba(255, 201, 74, 0.85)");
    glow.addColorStop(1, "rgba(255, 201, 74, 0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.28, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 28; i++) {
      const orbit = 18 + (i % 5) * 14;
      const a = t * (0.4 + (i % 4) * 0.15) + i;
      const learned = i % 4 === 0;
      ctx.fillStyle = learned ? "#ffc94a" : i % 3 === 0 ? "#ff4d6d" : "#39d5ff";
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * orbit, cy + Math.sin(a) * orbit * 0.72, learned ? 3.2 : 2.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const painters = {
    edge: drawEdge,
    life: drawLife,
    radiate: drawRadiate,
    baldwin: drawBaldwin,
  };

  function paint(time) {
    const t = reduce ? 0 : time / 1000;
    cards.forEach((card) => {
      const canvas = card.querySelector("canvas");
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(box.width * dpr));
      const h = Math.max(1, Math.round(box.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      painters[card.dataset.preview](ctx, box.width, box.height, t);
    });
    if (!reduce) requestAnimationFrame(paint);
  }

  requestAnimationFrame(paint);
})();
