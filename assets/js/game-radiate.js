// Radiate engine: lineages on a torus of niches. Niche cap, two offspring each, random lottery.
// Each offspring dies with prob load*e (mutational load), else moves to a neighbouring niche with prob e.
// e is set per lineage (the player's dial; AI policies for rivals). Impacts wipe a disc of niches.
const DX = [1, -1, 0, 0], DY = [0, 0, 1, -1];
class World {
  constructor({ W = 90, cap = 5, load = 3, lineages = 3, seeds = [] } = {}) {
    Object.assign(this, { W, cap, load, nl: lineages });
    this.cells = W * W; this.max = this.cells * cap;
    this.x = new Int16Array(this.max); this.y = new Int16Array(this.max); this.l = new Uint8Array(this.max); this.ei = new Float32Array(this.max);
    this.ox = new Int16Array(this.max * 2); this.oy = new Int16Array(this.max * 2); this.ol = new Uint8Array(this.max * 2); this.oe = new Float32Array(this.max * 2);
    this.cnt = new Uint8Array(this.cells); this.tally = new Uint8Array(this.cells * lineages);
    this.owner = new Int8Array(this.cells).fill(-1); this.sumE = new Float32Array(this.cells); this.prevOwner = new Int8Array(this.cells).fill(-1);
    this.e = new Float32Array(lineages).fill(0.05);
    this.n = 0; this.gen = 0; this.founded = [];
    for (const s of seeds) for (let c = 0; c < cap; c++) { const i = this.n++; this.x[i] = s.x; this.y[i] = s.y; this.l[i] = s.l; this.ei[i] = s.e ?? 0.05; }
    this.census();
  }
  step() {
    const { W, cap, load, x, y, l, ei, ox, oy, ol, oe, cnt } = this;
    let m = 0;
    for (let i = 0; i < this.n; i++) {
      const li = l[i], pe = ei[i], die = load * pe;
      for (let c = 0; c < 2; c++) {
        if (Math.random() < die) continue;
        let px = x[i], py = y[i], ce = pe;
        if (Math.random() < pe) { const d = (Math.random() * 4) | 0; px = (px + DX[d] + W) % W; py = (py + DY[d] + W) % W; }
        if (Math.random() < 0.01) { ce += Math.random() * 0.01 - 0.005; if (ce < 0) ce = 0; if (ce > 0.3) ce = 0.3; }
        ox[m] = px; oy[m] = py; ol[m] = li; oe[m] = ce; m++;
      }
    }
    for (let i = m - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      let t = ox[i]; ox[i] = ox[j]; ox[j] = t; t = oy[i]; oy[i] = oy[j]; oy[j] = t; t = ol[i]; ol[i] = ol[j]; ol[j] = t;
      const te = oe[i]; oe[i] = oe[j]; oe[j] = te;
    }
    cnt.fill(0); let n = 0;
    for (let i = 0; i < m; i++) { const k = oy[i] * W + ox[i]; if (cnt[k] < cap) { cnt[k]++; x[n] = ox[i]; y[n] = oy[i]; l[n] = ol[i]; ei[n] = oe[i]; n++; } }
    this.n = n; this.gen++; this.census();
  }
  // set e of lineage `lin` organisms within radius r of (cx,cy) (torus); returns how many were changed
  paint(lin, cx, cy, r, val) {
    const { W } = this; let c = 0;
    for (let i = 0; i < this.n; i++) {
      if (this.l[i] !== lin) continue;
      let dx = Math.abs(this.x[i] - cx), dy = Math.abs(this.y[i] - cy); dx = Math.min(dx, W - dx); dy = Math.min(dy, W - dy);
      if (dx * dx + dy * dy <= r * r) { this.ei[i] = val; c++; }
    }
    return c;
  }
  setAll(lin, val) { for (let i = 0; i < this.n; i++) if (this.l[i] === lin) this.ei[i] = val; }
  meanE(lin) { let s = 0, c = 0; for (let i = 0; i < this.n; i++) if (this.l[i] === lin) { s += this.ei[i]; c++; } return c ? s / c : 0; }
  census() {
    const { W, nl, n, x, y, l, tally, owner, prevOwner } = this;
    prevOwner.set(owner); tally.fill(0); this.cnt.fill(0); this.sumE.fill(0);
    for (let i = 0; i < n; i++) { const k = y[i] * W + x[i]; tally[k * nl + l[i]]++; this.cnt[k]++; this.sumE[k] += this.ei[i]; }
    this.share = new Array(nl).fill(0); this.pop = new Array(nl).fill(0); this.founded.length = 0;
    for (let k = 0; k < this.cells; k++) {
      let b = -1, bv = 0;
      for (let j = 0; j < nl; j++) { const v = tally[k * nl + j]; this.pop[j] += v; if (v > bv) { bv = v; b = j; } }
      owner[k] = b; if (b >= 0) { this.share[b]++; if (prevOwner[k] < 0) this.founded.push(k); }
    }
  }
  impact(cx, cy, r) { // wipe every organism within radius r (torus distance)
    const { W } = this; let n = 0;
    for (let i = 0; i < this.n; i++) {
      let dx = Math.abs(this.x[i] - cx), dy = Math.abs(this.y[i] - cy); dx = Math.min(dx, W - dx); dy = Math.min(dy, W - dy);
      if (dx * dx + dy * dy > r * r) { this.x[n] = this.x[i]; this.y[n] = this.y[i]; this.l[n] = this.l[i]; this.ei[n] = this.ei[i]; n++; }
    }
    this.n = n; this.census();
  }
}



(() => {
const root = document.getElementById('radiate-app');
if (!root) return;
const $ = s => root.querySelector(s);
const W = 72, G = 1200, GPS = 12, LOAD = 1.5, HI = 0.18, LO = 0.04, WARN = 24;
const COLORS = ['#ff9142', '#4fa6ff', '#ee5fa0'];
const NAMES = ['You', 'Steady', 'Opportunist'];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cv = $('#world'), ctx = cv.getContext('2d');

// glow sprites
const sprites = COLORS.map(c => { const s = document.createElement('canvas'); s.width = s.height = 64; const g = s.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, c); gr.addColorStop(0.25, c + 'cc'); gr.addColorStop(0.6, c + '33'); gr.addColorStop(1, c + '00'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return s; });
const cores = COLORS.map(col => { const s = document.createElement('canvas'); s.width = s.height = 32; const g = s.getContext('2d'); const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.35, col); gr.addColorStop(0.85, col); gr.addColorStop(1, col + '00'); g.fillStyle = gr; g.beginPath(); g.arc(16, 16, 16, 0, 7); g.fill(); return s; });
const white = (() => { const s = document.createElement('canvas'); s.width = s.height = 64; const g = s.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.4, 'rgba(255,240,220,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return s; })();
const phase = new Float32Array(W * W).map(() => Math.random() * 6.283);

let w, state = 'start', acc = 0, last = 0, hits = [], pending = null, nextAt = 120, avg = [0, 0, 0], samples = 0, parts = [], shocks = [], scars = [];
let tool = 'infuse', brushR = 6, mouse = null, painting = 0, toastT = 0, tips = {};
let best = 0; try { best = +localStorage.getItem('radiate-best') || 0; } catch (e) {}

function newGame() {
  w = new World({ W, load: LOAD, seeds: [{ x: 14, y: 14, l: 0, e: 0.05 }, { x: 50, y: 26, l: 1, e: 0.06 }, { x: 26, y: 54, l: 2, e: 0.05 }] });
  hits = []; pending = null; nextAt = 120; avg = [0, 0, 0]; samples = 0; parts = []; shocks = []; scars = []; acc = 0; tips = {};
}
function schedule() { nextAt = w.gen + 62 + ((Math.random() * 18) | 0); }

// ---------- simulation tick ----------
function tick() {
  // telegraph and impact
  if (!pending && w.gen === nextAt - WARN) {
    pending = { x: (Math.random() * W) | 0, y: (Math.random() * W) | 0, r: 12 + Math.random() * 8, at: nextAt };
    if (!tips.warn) { toast('Impact incoming. Get ready to infuse at the crater edge.'); tips.warn = 1; }
  }
  if (pending && w.gen === pending.at) {
    const h = pending; pending = null; w.impact(h.x, h.y, h.r); h.t = w.gen; hits.push(h);
    shocks.push({ x: h.x, y: h.y, r: h.r, t: performance.now() }); scars.push({ x: h.x, y: h.y, r: h.r, g: w.gen });
    if (!reduce) shake = performance.now();
    schedule();
    if (!tips.hit) { toast('Crater open. Infuse your organisms on its edge to flood it first.'); tips.hit = 1; }
  }
  // rivals
  w.setAll(1, 0.06);
  for (const h of hits) {
    if (w.gen - h.t === 10) w.paint(2, h.x, h.y, h.r + 3, 0.14);
    if (w.gen - h.t === 40) w.paint(2, h.x, h.y, h.r + 12, 0.04);
    if (w.gen - h.t === 45 && !tips.settle && tips.hit) { toast('That crater is filling. Settle your infused organisms; high e is costing you offspring.'); tips.settle = 1; }
  }
  if (painting && mouse) paintAt();
  w.step();
  for (const k of w.founded) if (w.owner[k] === 0 && parts.length < 260 && Math.random() < 0.5) parts.push({ x: k % W + .5, y: ((k / W) | 0) + .5, t: performance.now() });
  if (w.gen >= 100) { w.share.forEach((s, i) => avg[i] += s / w.cells); samples++; }
  if (w.gen >= G) end();
}
function paintAt() {
  const v = (painting === 2 || tool === 'settle') ? LO : HI;
  w.paint(0, mouse.cx, mouse.cy, brushR, v);
}

// ---------- rendering ----------
let S = 600, cell = 8, dpr = 1, shake = 0;
function resize() {
  const wrap = $('#stageWrap').getBoundingClientRect();
  S = Math.max(260, Math.floor(Math.min(wrap.width, wrap.height)));
  dpr = devicePixelRatio || 1; cv.style.width = cv.style.height = S + 'px'; cv.width = cv.height = Math.round(S * dpr); cell = cv.width / W;
}
function render(now) {
  const c = ctx, Wp = cv.width;
  c.setTransform(1, 0, 0, 1, 0, 0);
  let sx = 0, sy = 0; if (shake && now - shake < 350) { const a = (1 - (now - shake) / 350) * 6 * dpr; sx = (Math.random() - .5) * a; sy = (Math.random() - .5) * a; }
  c.translate(sx, sy);
  c.globalCompositeOperation = 'source-over';
  const bg = c.createRadialGradient(Wp / 2, Wp / 2, 0, Wp / 2, Wp / 2, Wp * .75); bg.addColorStop(0, '#141a3a'); bg.addColorStop(1, '#090c1d');
  c.fillStyle = bg; c.fillRect(-10, -10, Wp + 20, Wp + 20);
  // lattice dots
  c.fillStyle = 'rgba(160,175,230,.10)';
  for (let y = 0; y < W; y += 2) for (let x = 0; x < W; x += 2) c.fillRect((x + .5) * cell - dpr * .6, (y + .5) * cell - dpr * .6, dpr * 1.2, dpr * 1.2);
  // scars
  scars = scars.filter(s => w.gen - s.g < 120);
  for (const s of scars) { const a = 0.22 * (1 - (w.gen - s.g) / 120); const g = c.createRadialGradient((s.x + .5) * cell, (s.y + .5) * cell, 0, (s.x + .5) * cell, (s.y + .5) * cell, s.r * cell); g.addColorStop(0, `rgba(255,90,79,${a})`); g.addColorStop(1, 'rgba(255,90,79,0)'); c.fillStyle = g; c.beginPath(); c.arc((s.x + .5) * cell, (s.y + .5) * cell, s.r * cell, 0, 7); c.fill(); }
  // organisms: soft glow pass, then crisp cores, then shimmer on high-evolvability niches
  const t = now / 1000;
  c.globalCompositeOperation = 'source-over';
  for (let k = 0; k < w.cells; k++) {
    const n = w.cnt[k]; if (!n) continue; const o = w.owner[k]; if (o < 0) continue;
    const x = (k % W + .5) * cell, y = (((k / W) | 0) + .5) * cell, gs = cell * 1.5;
    c.globalAlpha = 0.16 + 0.03 * n; c.drawImage(sprites[o], x - gs, y - gs, gs * 2, gs * 2);
  }
  for (let k = 0; k < w.cells; k++) {
    const n = w.cnt[k]; if (!n) continue; const o = w.owner[k]; if (o < 0) continue;
    const x = (k % W + .5) * cell, y = (((k / W) | 0) + .5) * cell;
    c.globalAlpha = 0.55 + 0.09 * n; const r = cell * (0.22 + 0.06 * n);
    c.drawImage(cores[o], x - r, y - r, r * 2, r * 2);
  }
  c.globalCompositeOperation = 'lighter';
  for (let k = 0; k < w.cells; k++) {
    const n = w.cnt[k]; if (!n) continue;
    const hot = Math.min(1, Math.max(0, (w.sumE[k] / n - 0.07) / 0.1)); if (hot <= 0) continue;
    const x = (k % W + .5) * cell, y = (((k / W) | 0) + .5) * cell;
    const tw = reduce ? 0.7 : 0.5 + 0.5 * Math.sin(t * 8 + phase[k]);
    const hs = cell * (0.6 + 0.5 * hot); c.globalAlpha = 0.5 * hot * tw; c.drawImage(white, x - hs, y - hs, hs * 2, hs * 2);
  }
  c.globalAlpha = 1;
  // founding sparkles
  parts = parts.filter(p => now - p.t < 700);
  for (const p of parts) { const a = 1 - (now - p.t) / 700, r = cell * (0.8 + 2.4 * (1 - a)); c.globalAlpha = a * .8; c.drawImage(white, p.x * cell - r, p.y * cell - r, r * 2, r * 2); }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  // telegraph
  if (pending) {
    const left = pending.at - w.gen, cx = (pending.x + .5) * cell, cy = (pending.y + .5) * cell, R = pending.r * cell;
    const pulse = reduce ? 0.6 : 0.45 + 0.35 * Math.sin(t * 10);
    c.strokeStyle = `rgba(255,90,79,${pulse})`; c.lineWidth = 2 * dpr; c.setLineDash([6 * dpr, 6 * dpr]);
    c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke(); c.setLineDash([]);
    c.beginPath(); c.arc(cx, cy, R * (left / WARN), 0, 7); c.strokeStyle = 'rgba(255,90,79,.9)'; c.stroke();
    c.lineWidth = 1.5 * dpr; c.beginPath(); c.moveTo(cx - 10 * dpr, cy); c.lineTo(cx + 10 * dpr, cy); c.moveTo(cx, cy - 10 * dpr); c.lineTo(cx, cy + 10 * dpr); c.stroke();
    c.fillStyle = '#ff8a80'; c.font = `600 ${13 * dpr}px ui-monospace, Menlo, monospace`; c.textAlign = 'center'; c.fillText((left / GPS).toFixed(1) + 's', cx, cy - R - 8 * dpr);
  }
  // shockwaves
  shocks = shocks.filter(s => now - s.t < 900);
  for (const s of shocks) {
    const k = (now - s.t) / 900, cx = (s.x + .5) * cell, cy = (s.y + .5) * cell;
    if (k < .25) { c.fillStyle = `rgba(255,220,200,${.5 * (1 - k / .25)})`; c.beginPath(); c.arc(cx, cy, s.r * cell, 0, 7); c.fill(); }
    c.strokeStyle = `rgba(255,140,110,${1 - k})`; c.lineWidth = (6 - 5 * k) * dpr; c.beginPath(); c.arc(cx, cy, s.r * cell * (1 + .7 * k), 0, 7); c.stroke();
  }
  // brush
  if (mouse && state === 'play') {
    const settle = painting === 2 || tool === 'settle';
    c.strokeStyle = settle ? 'rgba(185,196,255,.85)' : 'rgba(255,145,66,.95)'; c.lineWidth = 1.5 * dpr;
    c.setLineDash(painting ? [] : [4 * dpr, 4 * dpr]);
    c.beginPath(); c.arc(mouse.px, mouse.py, brushR * cell, 0, 7); c.stroke(); c.setLineDash([]);
    c.fillStyle = c.strokeStyle; c.beginPath(); c.arc(mouse.px, mouse.py, 2 * dpr, 0, 7); c.fill();
  }
}

// ---------- HUD ----------
function hud() {
  if (!w) return;
  const el = $('[data-status]');
  if (!el) return;
  const sh = w.share[0] / w.cells;
  const secsLeft = Math.max(0, (G - w.gen) / GPS);
  const clock = `${Math.floor(secsLeft / 60)}:${String(Math.floor(secsLeft % 60)).padStart(2, '0')}`;
  const av = samples ? avg[0] / samples : 0;
  el.textContent = `${clock} · you ${(sh * 100).toFixed(0)}% · avg ${(av * 100).toFixed(0)}%`;
}
function toast() {}

// ---------- loop ----------
function frame(now) {
  if (state === 'play') {
    acc += Math.min(250, now - last); const dt = 1000 / GPS;
    while (acc >= dt && state === 'play') { tick(); acc -= dt; }
  }
  last = now;
  render(now); hud();
  requestAnimationFrame(frame);
}
function end() {
  state = 'end';
  const av = avg.map(a => a / Math.max(1, samples));
  const win = w.pop[0] > 0 && av[0] >= av[1] && av[0] >= av[2];
  $('[data-verdict]').textContent = win ? 'Won' : 'Lost';
  $('[data-end]').textContent = win
    ? 'You held the ground. Changing fast fills a crater, then costs offspring once the ground is full.'
    : (w.pop[0] ? 'A rival held more of the ground.' : 'Your cells are gone.');
  $('[data-card=end]').hidden = false;
}
function start() {
  newGame();
  state = 'play';
  last = performance.now();
  acc = 0;
  $('[data-card=rules]').hidden = true;
  $('[data-card=end]').hidden = true;
  root.classList.add('is-on');
}

// ---------- input ----------
function setTool(t) { tool = t; $('#tInfuse').setAttribute('aria-pressed', t === 'infuse'); $('#tSettle').setAttribute('aria-pressed', t === 'settle'); }
$('#tInfuse').onclick = () => setTool('infuse'); $('#tSettle').onclick = () => setTool('settle');
function pos(ev) { const r = cv.getBoundingClientRect(); const px = (ev.clientX - r.left) * dpr, py = (ev.clientY - r.top) * dpr; return { px, py, cx: Math.floor(px / cell), cy: Math.floor(py / cell) }; }
cv.addEventListener('pointermove', ev => { mouse = pos(ev); if (painting && state === 'play') paintAt(); });
cv.addEventListener('pointerdown', ev => { if (state !== 'play') return; cv.setPointerCapture(ev.pointerId); mouse = pos(ev); painting = ev.button === 2 ? 2 : 1; paintAt(); });
cv.addEventListener('pointerup', () => { painting = 0; });
cv.addEventListener('pointerleave', ev => { if (ev.pointerType === 'mouse') mouse = null; });
cv.addEventListener('contextmenu', ev => ev.preventDefault());
$('[data-enter]').onclick = start;
$('[data-again]').onclick = start;
window.addEventListener('resize', resize);

newGame(); resize();
// a living title screen: let the world run quietly behind the start card
for (let i = 0; i < 90; i++) w.step();
(function idle() { if (state === 'start') { w.step(); setTimeout(idle, 120); } })();
requestAnimationFrame(t => { last = t; frame(t); });
})();
