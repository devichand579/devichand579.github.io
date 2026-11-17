// Hinton & Nowlan (1987) model. 20 genes, alleles: 0 = incorrect, 1 = correct, 2 = "?" (learnable switch).
// Lifetime: up to T random guesses of all "?" switches; the good net is found on trial t ~ Geometric(2^-q).
// Fitness = 1 + 19 * (T - t) / T if learned (paper uses T = 1000), 20 if born with the good net, else 1.
// Next generation: N matings, parents drawn fitness-proportionally (distinct), one-point crossover, one child each.
const L = 20;
class Pop {
  constructor(N = 1000, pq = 0.5) {
    this.N = N; this.g = new Uint8Array(N * L); this.ng = new Uint8Array(N * L);
    for (let i = 0; i < N * L; i++) { const r = Math.random(); this.g[i] = r < pq ? 2 : (r < pq + (1 - pq) / 2 ? 1 : 0); }
    this.t = new Float64Array(N); this.fit = new Float64Array(N); this.inc = new Uint8Array(N); this.q = new Uint8Array(N);
    this.pa = new Uint16Array(N); this.pb = new Uint16Array(N); this.cut = new Uint8Array(N);
    this.gen = 0; this.live(1000);
  }
  // run lifetimes with T learning trials; returns summary
  live(T) {
    const { N, g } = this; let used = 0, learned = 0, innate = 0, sumF = 0;
    const f = [0, 0, 0];
    for (let i = 0; i < N; i++) {
      let inc = 0, q = 0;
      for (let j = 0; j < L; j++) { const a = g[i * L + j]; f[a]++; if (a === 0) inc++; else if (a === 2) q++; }
      this.inc[i] = inc; this.q[i] = q;
      let t = Infinity, fit = 1;
      if (inc === 0) {
        if (q === 0) { t = 0; fit = 20; innate++; }
        else if (T > 0) {
          const p = Math.pow(2, -q), u = Math.random();
          const tt = Math.max(1, Math.ceil(Math.log(u) / Math.log1p(-p)));
          if (tt <= T) { t = tt; fit = 1 + 19 * (T - tt) / T; }
        }
      }
      if (t !== Infinity && t > 0) learned++;
      used += t === Infinity ? T : t;
      this.t[i] = t; this.fit[i] = fit; sumF += fit;
    }
    this.T = T;
    return this.sum = { used: used / N, learned: learned / N, innate: innate / N, meanFit: sumF / N, freq: f.map(v => v / (N * L)) };
  }
  // reproduce; lamarck: learners pass on the learned net (the paper's point is that this is NOT needed)
  breed(lamarck = false, mu = 0.002) {
    const { N, g, ng, fit } = this;
    const cum = new Float64Array(N); let s = 0; for (let i = 0; i < N; i++) { s += fit[i]; cum[i] = s; }
    const pick = () => { const r = Math.random() * s; let lo = 0, hi = N - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < r) lo = m + 1; else hi = m; } return lo; };
    const src = (i, j) => (lamarck && this.t[i] !== Infinity) ? 1 : g[i * L + j];
    for (let k = 0; k < N; k++) {
      const a = pick(); let b = pick(); let guard = 0; while (b === a && guard++ < 20) b = pick();
      const c = 1 + ((Math.random() * (L - 1)) | 0);
      for (let j = 0; j < L; j++) { let v = j < c ? src(a, j) : src(b, j); if (mu > 0 && Math.random() < mu) v = (Math.random() * 3) | 0; ng[k * L + j] = v; }
      this.pa[k] = a; this.pb[k] = b; this.cut[k] = c;
    }
    this.g.set(ng); this.gen++; this.classify();
  }
  classify() { // allele counts for the new generation, before any learning
    for (let i = 0; i < this.N; i++) { let inc = 0, q = 0; for (let j = 0; j < L; j++) { const a = this.g[i * L + j]; if (a === 0) inc++; else if (a === 2) q++; } this.inc[i] = inc; this.q[i] = q; this.t[i] = Infinity; }
  }
}



(() => {
const root = document.getElementById('baldwin-app');
if (!root) return;
const $ = s => root.querySelector(s);
const N = 1000, BUDGET = 20, GMAX = 100, GOAL = 0.9;
const GOLD = '#ffc94a', CYAN = '#39d5ff', RED = '#ff4d6d', VIOLET = '#8b6cff';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sky = $('#sky'), ctx = sky.getContext('2d');

// sprites
function glow(col, inner = 0.18) { const s = document.createElement('canvas'); s.width = s.height = 64; const g = s.getContext('2d'); const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, '#fff'); gr.addColorStop(inner, col); gr.addColorStop(.45, col + '55'); gr.addColorStop(1, col + '00'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return s; }
const SP = { gold: glow(GOLD), cyan: glow(CYAN, .3), red: glow(RED, .3), white: glow('#ffffff', .4), violet: glow(VIOLET, .3) };

// stars and nebula
let stars = [];
function makeStars() { stars = Array.from({ length: 420 }, () => ({ x: Math.random(), y: Math.random(), z: Math.random() ** 2, tw: Math.random() * 6.28 })); }

// ---------- game state ----------
let pop, T = 1000, energy = BUDGET, phase = 'idle', phaseT = 0, speed = 1, paused = false, cheated = false, lamarck = false;
let hist = [], pos = null, prevPos = null, parentIdx = null, arcs = [], bursts = [], shock = 0, lowStreak = 0, won = false;
let tips = {};
let best = null; try { best = JSON.parse(localStorage.getItem('baldwin-best') || 'null'); } catch (e) {}
const DUR = { live: 1500, mate: 700, birth: 900 };

// layout: radius from how far the genome is from the needle; angle from WHICH genes are off
const GA = Array.from({ length: 20 }, (_, j) => j / 20 * Math.PI * 2 - Math.PI / 2);
const seedA = new Float32Array(N).map(() => Math.random() * 6.283), seedR = new Float32Array(N).map(() => Math.random() - .5);
function layout() {
  const r = new Float32Array(N), a = new Float32Array(N), g = pop.g;
  for (let i = 0; i < N; i++) {
    let inc = 0, q = 0, vx = 0, vy = 0;
    for (let j = 0; j < 20; j++) { const al = g[i * 20 + j]; if (al === 1) continue; const w = al === 0 ? 1.4 : 1; vx += w * Math.cos(GA[j]); vy += w * Math.sin(GA[j]); if (al === 0) inc++; else q++; }
    if (inc > 0) r[i] = 0.70 + 0.27 * Math.min(inc, 9) / 9 + seedR[i] * 0.05;
    else r[i] = q === 0 ? 0.015 + Math.abs(seedR[i]) * 0.02 : 0.08 + 0.54 * Math.min(q, 13) / 13 + seedR[i] * 0.035;
    a[i] = (vx * vx + vy * vy > 0.2 ? Math.atan2(vy, vx) : seedA[i]) + seedR[i] * 0.5;
  }
  return { r, a };
}
const zoneR = Tv => Tv < 2 ? 0.05 : 0.08 + 0.54 * Math.min(Math.log2(Tv), 13) / 13;

function newGame() {
  pop = new Pop(N, 0.5); T = 1000; energy = BUDGET; cheated = false; lamarck = false; won = false; lowStreak = 0; tips = {};
  hist = []; arcs = []; bursts = [];
  pop.live(T); hist.push(pop.sum.freq.slice()); pos = layout(); prevPos = pos;
  setDial(1); phase = 'live'; phaseT = 0; dirtyHud = true;
}

// ---------- generation cycle ----------
function enterLive() {
  const Tuse = energy <= 0 ? 0 : T;
  pop.live(Tuse); phase = 'live'; phaseT = 0;
  hist.push(pop.sum.freq.slice()); if (hist.length > GMAX + 1) hist.shift();
}
function endLive() {
  energy = Math.max(0, energy - pop.sum.used / 1000);
  const s = pop.sum;
  if (!tips.found && s.learned > 0.02) { toast('Someone learned the net. Selection can finally see the needle.'); tips.found = 1; }
  if (!tips.purge && s.freq[0] < 0.02 && pop.gen > 3) { toast('Wrong alleles are gone. Now turn learning down so the "?" genes start to cost.'); tips.purge = 1; }
  if (!tips.innate && s.innate > 0.01) { toast('Born knowing. The learned trait is being written into the genes, with no Lamarck required.'); tips.innate = 1; }
  if (!tips.low && energy < 3 && energy > 0) { toast('Energy is low. Learning shuts off when it runs out.'); tips.low = 1; }
  if (!tips.out && energy <= 0) { toast('Out of energy. Learning is off; only genes that already know can win now.'); tips.out = 1; setDial(0); }
  if (s.innate >= GOAL) return finish(true);
  if (energy <= 0 && s.innate === 0) { if (++lowStreak > 4) return finish(false); } else lowStreak = 0;
  if (pop.gen >= GMAX) return finish(false);
  // mating
  prevPos = pos;
  const oldT = pop.t.slice();
  pop.breed(lamarck);
  arcs = []; for (let k = 0; k < 140; k++) { const m = (Math.random() * N) | 0; arcs.push([pop.pa[m], pop.pb[m]]); }
  parentIdx = pop.pa.slice();
  pos = layout();
  phase = 'mate'; phaseT = 0; dirtyHud = true;
}
function finish(win) {
  phase = 'over'; won = win; shock = performance.now();
  $('[data-verdict]').textContent = win ? 'Won' : 'Lost';
  $('[data-end]').textContent = win
    ? 'Born knowing. Learning showed the rare wiring, and the genes kept it.'
    : (energy <= 0 ? 'The energy ran out before the wiring reached the genes.' : 'A hundred generations, and the genes still have to guess.');
  $('[data-card=end]').hidden = false;
  dirtyHud = true;
}

// ---------- dial ----------
const svgNS = 'http://www.w3.org/2000/svg';
let dialV = 1;
const vToT = v => v < 0.03 ? 0 : Math.round(Math.pow(10, 3 * (v - 0.03) / 0.97));
function arcPath(cx, cy, r, a0, a1) { const p = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1}`; }
const A0 = Math.PI * 0.75, A1 = Math.PI * 2.25;
function drawDial() {
  const d = $('#dial'), a = A0 + (A1 - A0) * dialV, off = energy <= 0;
  const ink = getComputedStyle(root).color || '#ece8ff';
  const ticks = [0, 1, 10, 100, 1000].map(t => { const v = t === 0 ? 0 : 0.03 + 0.97 * Math.log10(t) / 3; const aa = A0 + (A1 - A0) * v; return `<text x="${110 + 92 * Math.cos(aa)}" y="${100 + 92 * Math.sin(aa) + 4}" fill="#a49dc9" font-size="10" text-anchor="middle" font-family=ui-monospace>${t}</text>`; }).join('');
  d.innerHTML = `<defs><linearGradient id="dg" x1="0" x2="1"><stop offset="0" stop-color="${CYAN}"/><stop offset="1" stop-color="${GOLD}"/></linearGradient><filter id="gl"><feGaussianBlur stdDeviation="3"/></filter></defs>
    <path d="${arcPath(110, 100, 74, A0, A1)}" stroke="${ink}" stroke-opacity=".2" stroke-width="14" fill="none" stroke-linecap="round"/>
    ${dialV > 0.005 ? `<path d="${arcPath(110, 100, 74, A0, a)}" stroke="url(#dg)" stroke-width="14" fill="none" stroke-linecap="round" filter="url(#gl)" opacity=".7"/><path d="${arcPath(110, 100, 74, A0, a)}" stroke="url(#dg)" stroke-width="10" fill="none" stroke-linecap="round" opacity="${off ? .3 : 1}"/>` : ''}
    <circle cx="${110 + 74 * Math.cos(a)}" cy="${100 + 74 * Math.sin(a)}" r="11" fill="${ink}" opacity="${off ? .4 : 1}"/>
    <circle cx="110" cy="100" r="44" fill="transparent" stroke="${ink}" stroke-opacity=".2"/>
    <text x="110" y="96" text-anchor="middle" fill="${ink}" font-family="Roboto, sans-serif" font-weight="800" font-size="20">${off ? 'OFF' : vToT(dialV)}</text>
    <text x="110" y="114" text-anchor="middle" fill="${ink}" opacity=".6" font-family="ui-monospace, monospace" font-size="9">guesses</text>${ticks}`;
  d.setAttribute('aria-valuenow', T);
}
function setDial(v) { dialV = Math.max(0, Math.min(1, v)); T = vToT(dialV); drawDial(); }
(() => {
  const d = $('#dial'); let drag = false;
  const fromEv = ev => { const r = d.getBoundingClientRect(); const x = (ev.clientX - r.left) / r.width * 220 - 110, y = (ev.clientY - r.top) / r.height * 190 - 100; let a = Math.atan2(y, x); if (a < A0 - Math.PI * 0.25) a += Math.PI * 2; if (a > A1 + 0.3) a -= Math.PI * 2; return (Math.max(A0, Math.min(A1, a)) - A0) / (A1 - A0); };
  d.addEventListener('pointerdown', ev => { if (energy <= 0) return; drag = true; d.setPointerCapture(ev.pointerId); setDial(fromEv(ev)); });
  d.addEventListener('pointermove', ev => { if (drag) setDial(fromEv(ev)); });
  d.addEventListener('pointerup', () => drag = false);
  d.addEventListener('wheel', ev => { ev.preventDefault(); if (energy > 0) setDial(dialV + (ev.deltaY < 0 ? 0.03 : -0.03)); }, { passive: false });
})();

// ---------- render ----------
let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, R = 0;
function resize() {
  dpr = Math.min(2, devicePixelRatio || 1);
  const box = $('.play-stage').getBoundingClientRect();
  W = Math.max(1, box.width); H = Math.max(1, box.height);
  sky.width = Math.round(W * dpr); sky.height = Math.round(H * dpr);
  cx = W / 2; cy = H / 2;
  R = Math.max(90, Math.min(W, H) * 0.36);
}
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
let hoverI = -1, mouse = null;
function orgXY(i, t, rot) {
  let r = pos.r[i], a = pos.a[i];
  if (phase === 'birth' || phase === 'mate') {
    const k = phase === 'mate' ? 0 : ease(Math.min(1, phaseT / DUR.birth)), p = parentIdx[i];
    const r0 = prevPos.r[p], a0 = prevPos.a[p];
    let da = a - a0; da = Math.atan2(Math.sin(da), Math.cos(da));
    r = r0 + (r - r0) * k; a = a0 + da * k;
  }
  const spin = rot * (1.6 - r);
  return [cx + Math.cos(a + spin) * r * R, cy + Math.sin(a + spin) * r * R, r];
}
function render(now) {
  const c = ctx; c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const t = now / 1000, rot = reduce ? 0 : t * 0.05;
  // background
  c.globalCompositeOperation = 'source-over';
  c.fillStyle = '#07050f'; c.fillRect(0, 0, W, H);
  const neb = c.createRadialGradient(cx, cy, 0, cx, cy, R * 1.9);
  neb.addColorStop(0, 'rgba(70,40,140,.30)'); neb.addColorStop(.45, 'rgba(40,20,90,.18)'); neb.addColorStop(1, 'rgba(7,5,15,0)');
  c.fillStyle = neb; c.fillRect(0, 0, W, H);
  for (const s of stars) { const a = 0.25 + 0.5 * s.z + (reduce ? 0 : 0.2 * Math.sin(t * 1.5 + s.tw)); c.fillStyle = `rgba(220,215,255,${a})`; const px = (s.x * W + (reduce ? 0 : t * 4 * s.z)) % W; c.fillRect(px, s.y * H, 1 + s.z, 1 + s.z); }
  // haystack band and zone of increased fitness
  c.strokeStyle = 'rgba(255,77,109,.10)'; c.lineWidth = R * 0.30; c.beginPath(); c.arc(cx, cy, R * 0.835, 0, 7); c.stroke();
  const Tn = energy <= 0 ? 0 : T, zr = zoneR(Tn) * R;
  const zg = c.createRadialGradient(cx, cy, 0, cx, cy, zr * 1.15);
  zg.addColorStop(0, 'rgba(255,201,74,.22)'); zg.addColorStop(.8, 'rgba(255,201,74,.10)'); zg.addColorStop(1, 'rgba(255,201,74,0)');
  c.fillStyle = zg; c.beginPath(); c.arc(cx, cy, zr * 1.15, 0, 7); c.fill();
  c.strokeStyle = `rgba(255,201,74,${0.45 + (reduce ? 0 : 0.2 * Math.sin(t * 3))})`; c.lineWidth = 1.5; c.setLineDash([3, 7]); c.lineDashOffset = -t * 20;
  c.beginPath(); c.arc(cx, cy, zr, 0, 7); c.stroke(); c.setLineDash([]);
  c.textAlign = 'center';
  // gene spokes: per-gene allele frequencies
  const g = pop.g; const fc = new Float32Array(20), fq = new Float32Array(20);
  for (let i = 0; i < N; i++) for (let j = 0; j < 20; j++) { const al = g[i * 20 + j]; if (al === 1) fc[j]++; else if (al === 2) fq[j]++; }
  c.globalCompositeOperation = 'lighter';
  for (let j = 0; j < 20; j++) {
    const a = GA[j] + rot * 1.6, cr = fc[j] / N, qr = fq[j] / N, L0 = R * 0.06, L1 = R * 0.62;
    const ex = Math.cos(a), ey = Math.sin(a);
    const grd = c.createLinearGradient(cx + ex * L0, cy + ey * L0, cx + ex * L1, cy + ey * L1);
    grd.addColorStop(0, `rgba(255,201,74,${0.15 + 0.85 * cr})`); grd.addColorStop(Math.max(0.01, cr), `rgba(255,201,74,${0.1 + 0.6 * cr})`);
    grd.addColorStop(Math.min(.99, cr + qr), `rgba(57,213,255,${0.25 * qr + 0.05})`); grd.addColorStop(1, 'rgba(255,77,109,.12)');
    c.strokeStyle = grd; c.lineWidth = 2 + 4 * cr; c.beginPath(); c.moveTo(cx + ex * L0, cy + ey * L0); c.lineTo(cx + ex * L1, cy + ey * L1); c.stroke();
  }
  // mating threads
  if (phase === 'mate' || (phase === 'birth' && phaseT < 400)) {
    const k = phase === 'mate' ? Math.min(1, phaseT / DUR.mate) : 1 - phaseT / 400;
    c.lineWidth = 1;
    for (const [a, b] of arcs) {
      const ra = prevPos.r[a], aa = prevPos.a[a] + rot * (1.6 - ra), rb = prevPos.r[b], ab = prevPos.a[b] + rot * (1.6 - rb);
      const x1 = cx + Math.cos(aa) * ra * R, y1 = cy + Math.sin(aa) * ra * R, x2 = cx + Math.cos(ab) * rb * R, y2 = cy + Math.sin(ab) * rb * R;
      c.strokeStyle = `rgba(190,150,255,${0.28 * k})`; c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(cx + (x1 + x2 - 2 * cx) * 0.15, cy + (y1 + y2 - 2 * cy) * 0.15, x2, y2); c.stroke();
    }
  }
  // organisms
  const live = phase === 'live', lk = live ? Math.min(1, phaseT / DUR.live) : 1;
  const trialNow = live ? Math.pow(Math.max(1, pop.T), lk) : Infinity;
  let hv = -1, hd = 144;
  for (let i = 0; i < N; i++) {
    const [x, y] = orgXY(i, t, rot);
    const inc = pop.inc[i], q = pop.q[i], ti = pop.t[i];
    let sp, size, alpha;
    if (inc > 0) { sp = SP.red; size = 7; alpha = 0.55; }
    else if (q === 0) { sp = SP.white; size = 13 + (reduce ? 0 : 2 * Math.sin(t * 4 + i)); alpha = 1; }
    else if (ti !== Infinity && ti <= trialNow && phase !== 'mate' && phase !== 'birth') {
      const since = live ? (lk - Math.log(Math.max(1, ti)) / Math.log(Math.max(2, pop.T))) : 1;
      sp = SP.gold; size = 10 + 14 * Math.max(0, 0.35 - since) / 0.35 + 4 * pop.fit[i] / 20; alpha = 1;
    }
    else if (phase === 'mate' || phase === 'birth') { sp = ti !== Infinity && q > 0 ? SP.gold : SP.cyan; size = 8; alpha = .8; }
    else { sp = SP.cyan; size = 7 + (live && !reduce ? 3 * Math.random() : 0); alpha = live ? 0.75 : 0.6; }
    c.globalAlpha = alpha; c.drawImage(sp, x - size, y - size, size * 2, size * 2);
    if (mouse) { const dx = x - mouse.x, dy = y - mouse.y, dd = dx * dx + dy * dy; if (dd < hd) { hd = dd; hv = i; } }
  }
  c.globalAlpha = 1;
  hoverI = hv;
  // the needle
  const pulse = reduce ? 1 : 1 + 0.08 * Math.sin(t * 3);
  const sz = R * 0.11 * pulse * (won ? 1 + Math.max(0, Math.min(4, (now - shock) / 300)) : 1);
  c.globalAlpha = won ? Math.max(0.2, 1 - (now - shock) / 2400) + 0.2 : 1;
  c.drawImage(SP.gold, cx - sz * 2, cy - sz * 2, sz * 4, sz * 4); c.drawImage(SP.white, cx - sz, cy - sz, sz * 2, sz * 2);
  c.strokeStyle = 'rgba(255,230,160,.5)'; c.lineWidth = 1;
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 4 + (reduce ? 0 : t * 0.2); c.beginPath(); c.moveTo(cx - Math.cos(a) * sz * 2.6, cy - Math.sin(a) * sz * 2.6); c.lineTo(cx + Math.cos(a) * sz * 2.6, cy + Math.sin(a) * sz * 2.6); c.stroke(); }
  c.globalAlpha = 1;
  // win shockwave
  if (won) { const k = Math.max(0, Math.min(1, (now - shock) / 1800)); c.strokeStyle = `rgba(255,201,74,${1 - k})`; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, R * 1.6 * ease(k), 0, 7); c.stroke(); c.strokeStyle = `rgba(57,213,255,${0.7 * (1 - k)})`; c.beginPath(); c.arc(cx, cy, R * 1.2 * ease(k), 0, 7); c.stroke(); }
  // lamarck tint
  if (lamarck) { c.globalCompositeOperation = 'source-over'; c.fillStyle = `rgba(255,40,80,${0.06 + (reduce ? 0 : 0.03 * Math.sin(t * 6))})`; c.fillRect(0, 0, W, H); }
  c.globalCompositeOperation = 'source-over';
  // hover ring
  if (hv >= 0) { const [x, y] = orgXY(hv, t, rot); c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, 9, 0, 7); c.stroke(); }
  showTip(hv);
}
function showTip() {}
sky.addEventListener('pointermove', ev => {
  const r = sky.getBoundingClientRect();
  mouse = { x: ev.clientX - r.left, y: ev.clientY - r.top, cx: ev.clientX - r.left, cy: ev.clientY - r.top };
});
sky.addEventListener('pointerleave', () => { mouse = null; });

// ---------- HUD ----------
let dirtyHud = true;
function hud() {
  const el = $('[data-status]');
  if (!el || !pop) return;
  const s = pop.sum;
  el.textContent = `gen ${pop.gen} · born ${(s.innate * 100).toFixed(0)}% · energy ${energy.toFixed(1)}`;
}
function toast() {}

// ---------- loop ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min(100, now - last) * speed; last = now;
  if (!paused && phase !== 'over' && phase !== 'idle') {
    phaseT += dt;
    if (phase === 'live' && phaseT >= DUR.live) endLive();
    else if (phase === 'mate' && phaseT >= DUR.mate) { phase = 'birth'; phaseT = 0; }
    else if (phase === 'birth' && phaseT >= DUR.birth) { enterLive(); dirtyHud = true; }
  }
  render(now);
  if (dirtyHud) { hud(); dirtyHud = false; }
  requestAnimationFrame(frame);
}

// ---------- controls ----------
function begin() {
  $('[data-card=rules]').hidden = true;
  $('[data-card=end]').hidden = true;
  root.classList.add('is-on');
  newGame();
}
$('[data-enter]').onclick = begin;
$('[data-again]').onclick = begin;
window.addEventListener('resize', () => { resize(); dirtyHud = true; });

makeStars(); resize();
pop = new Pop(N, 0.5); pop.live(1000); hist = [pop.sum.freq.slice()]; pos = layout(); prevPos = pos; parentIdx = new Uint16Array(N).map((_, i) => i);
phase = 'idle'; setDial(1); hud();
requestAnimationFrame(frame);
})();
