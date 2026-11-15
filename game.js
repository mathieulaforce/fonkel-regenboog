'use strict';
/* Fonkel en de Verdwenen Regenboog — een klik-avontuur voor kleuters
   tekst.js = teksten en stemmen, art.js = tekeningen, game.js = het spel zelf */

const FAST = /[?&]fast/.test(location.search);
const $ = s => document.querySelector(s);
const svg = $('#scene'), sceneL = $('#sceneL'), heroL = $('#heroL'), fxL = $('#fxL'), hudL = $('#hudL'), mapL = $('#mapL');
const bubble = $('#bubble'), fade = $('#fade'), stage = $('#stage');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.random() * (b - a);
const wait = ms => new Promise(r => setTimeout(r, FAST ? Math.min(ms, 15) : ms));
const add = (layer, html) => { layer.insertAdjacentHTML('beforeend', html); return layer.lastElementChild; };

function tween(ms, fn, ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2) {
  if (FAST) ms = Math.min(ms, 25);
  return new Promise(res => {
    const t0 = performance.now();
    const f = t => { const k = clamp((t - t0) / ms, 0, 1); fn(ease(k)); k < 1 ? requestAnimationFrame(f) : res(); };
    requestAnimationFrame(f);
  });
}

/* ---------- state ---------- */
const NS = RB.length;
const fresh = () => ({ scene: 'kasteel', stars: {}, inv: [], flags: {}, music: true, sound: true });
const SAVE = 'fonkel-regenboog-v2';
function load() { try { const s = JSON.parse(localStorage.getItem(SAVE)); return s && s.stars && s.flags && s.inv ? s : null; } catch (e) { return null; } }
function save() { try { localStorage.setItem(SAVE, JSON.stringify(S)); } catch (e) { } }
let S = load() || fresh();
let started = false, busy = false, skipLine = null, idleT = 0, scale = 1;
let pointer = { x: 500, y: 450 };
const nStars = () => RB.filter(c => S.stars[c.id]).length;
const has = it => S.inv.includes(it);
const newGame = () => { const o = { music: S.music, sound: S.sound }; S = Object.assign(fresh(), o); };

/* ---------- sound ---------- */
let ac = null, master = null;
function audioInit() {
  if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
  try {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = S.sound ? 1 : 0; master.connect(ac.destination);
  } catch (e) { ac = null; }
}
function tone(f, d, o = {}) {
  if (!ac) return;
  const { type = 'sine', v = .2, t = 0, slide = 0 } = o;
  const os = ac.createOscillator(), g = ac.createGain(), s = ac.currentTime + t;
  os.type = type; os.frequency.setValueAtTime(f, s);
  if (slide) os.frequency.exponentialRampToValueAtTime(slide, s + d);
  g.gain.setValueAtTime(.0001, s); g.gain.exponentialRampToValueAtTime(v, s + .02); g.gain.exponentialRampToValueAtTime(.0001, s + d);
  os.connect(g); g.connect(master); os.start(s); os.stop(s + d + .05);
}
function noise(d, o = {}) {
  if (!ac) return;
  const { v = .2, t = 0, f = 1200, f2 = 0, q = 1 } = o;
  const n = Math.floor(ac.sampleRate * d), buf = ac.createBuffer(1, n, ac.sampleRate), ch = buf.getChannelData(0);
  for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource(), fl = ac.createBiquadFilter(), g = ac.createGain(), s = ac.currentTime + t;
  src.buffer = buf; fl.type = 'bandpass'; fl.Q.value = q; fl.frequency.setValueAtTime(f, s);
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, s + d);
  g.gain.setValueAtTime(v, s); g.gain.exponentialRampToValueAtTime(.0001, s + d);
  src.connect(fl); fl.connect(g); g.connect(master); src.start(s);
}
const SCALE = [523, 587, 659, 784, 880, 1047, 1175, 1319];
const SFX = {
  pop() { tone(500, .12, { slide: 1300, v: .25 }); },
  boing() { tone(180, .32, { slide: 520, type: 'triangle', v: .25 }); },
  ding() { tone(1320, .5, { v: .18 }); tone(1980, .4, { v: .07 }); },
  note(i) { tone(SCALE[i % SCALE.length], .45, { type: 'triangle', v: .22 }); },
  splash() { noise(.45, { f: 2200, f2: 700, v: .3 }); },
  hoot() { tone(430, .22, { v: .25 }); tone(350, .45, { t: .28, v: .25 }); },
  kwak() { tone(320, .14, { type: 'sawtooth', slide: 190, v: .15 }); tone(300, .16, { type: 'sawtooth', slide: 170, v: .15, t: .2 }); },
  miauw() { tone(520, .2, { type: 'triangle', slide: 900, v: .2 }); tone(900, .4, { type: 'triangle', slide: 450, v: .2, t: .2 }); },
  flap() { noise(.1, { f: 600, v: .25 }); noise(.1, { f: 600, v: .25, t: .15 }); },
  squeak() { tone(2100, .09, { slide: 2700, v: .1 }); tone(2300, .09, { slide: 2900, v: .1, t: .12 }); },
  knock() { for (let i = 0; i < 3; i++) tone(140, .08, { type: 'square', v: .2, t: i * .18 }); },
  roar() { noise(1.3, { f: 500, f2: 1400, v: .5, q: .6 }); tone(90, 1.2, { type: 'sawtooth', v: .12, slide: 130 }); },
  yum() { for (let i = 0; i < 4; i++) tone(220 + (i % 2) * 60, .11, { type: 'square', v: .1, t: i * .16 }); },
  magic() { for (let i = 0; i < 8; i++) tone(SCALE[i], .25, { v: .14, t: i * .07 }); },
  star() { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .35, { type: 'triangle', v: .2, t: i * .1 })); tone(2093, .6, { v: .08, t: .5 }); },
  fanfare() { [523, 523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i === 7 ? .9 : .22, { type: 'triangle', v: .22, t: i * .2 })); [262, 330, 392].forEach(f => tone(f, 1, { v: .1, t: 1.4 })); },
  whoosh() { noise(.35, { f: 400, f2: 2400, v: .15 }); },
  oops() { tone(330, .18, { type: 'triangle', v: .2 }); tone(250, .3, { type: 'triangle', v: .2, t: .18 }); },
  pof() { noise(.15, { f: 900, v: .2 }); tone(260, .15, { slide: 180, v: .12 }); },
  clang(i) { tone(SCALE[i % 8] * 1.5, .5, { type: 'square', v: .06 }); tone(SCALE[i % 8] * 2.02, .4, { v: .1 }); },
  kra() { tone(950, .12, { type: 'sawtooth', slide: 600, v: .12 }); tone(1000, .16, { type: 'sawtooth', slide: 560, v: .12, t: .16 }); },
  dig() { noise(.16, { f: 500, f2: 1500, v: .35 }); },
  zoem() { tone(230, .45, { type: 'sawtooth', v: .06, slide: 260 }); },
  coin() { tone(1568, .1, { v: .15 }); tone(2093, .35, { v: .15, t: .08 }); },
};
function sfx(n, a) { if (ac && S.sound && SFX[n]) try { SFX[n](a); } catch (e) { } }

const MEL = [523, 659, 784, 659, 698, 880, 784, 0, 659, 784, 1047, 784, 880, 784, 659, 0, 587, 698, 880, 698, 784, 988, 880, 0, 1047, 880, 784, 659, 587, 659, 523, 0];
const BAS = [131, 0, 196, 0, 175, 0, 196, 0, 131, 0, 165, 0, 175, 0, 131, 0, 147, 0, 220, 0, 196, 0, 247, 0, 131, 0, 175, 0, 196, 0, 131, 0];
let mi = 0, talking = false;
setInterval(() => {
  if (!ac || !started || !S.music || !S.sound || document.hidden) return;
  const f = MEL[mi % 32], b = BAS[mi % 32], q = talking ? .4 : 1;   // zachter terwijl iemand praat
  if (f) tone(f, .26, { type: 'triangle', v: .03 * q });
  if (b) tone(b, .5, { v: .05 * q });
  mi++;
}, 300);

/* ---------- voice: opgenomen zinnen (voice/*.mp3), anders de stem van het toestel ---------- */
const VOICE = window.VOICE || {};
const synth = window.speechSynthesis || null;
let sysVoice = null, curA = null;
function pickVoice() { if (!synth) return; const vs = synth.getVoices(); sysVoice = vs.find(v => /nl[-_]BE/i.test(v.lang)) || vs.find(v => /^nl/i.test(v.lang)) || null; }
if (synth) { pickVoice(); try { synth.addEventListener('voiceschanged', pickVoice); } catch (e) { } }
function stopVoice() {
  if (curA) { try { curA.onended = curA.onerror = null; curA.pause(); } catch (e) { } curA = null; }
  if (synth) try { synth.cancel(); } catch (e) { }
}
function speak(text, who, onend) {
  who = who || 'fonkel';
  const k = voiceKey(who, text);
  if (!VOICE[k]) (window.MISSING = window.MISSING || []).push(who + '|' + text);
  if (!S.sound || FAST) return false;
  stopVoice();
  if (VOICE[k]) {
    try {
      const a = new Audio('voice/' + k + '.mp3'); curA = a;
      if (onend) { a.onended = onend; a.onerror = onend; }
      const pr = a.play(); if (pr && pr.catch) pr.catch(() => { });
      return true;
    } catch (e) { }
  }
  if (!synth || !sysVoice) return false;
  try {
    const u = new SpeechSynthesisUtterance(text), w = WHO[who];
    u.voice = sysVoice; u.lang = sysVoice.lang; u.pitch = clamp(w.p * w.p, .5, 2); u.rate = .95;
    if (onend) { u.onend = onend; u.onerror = onend; }
    synth.speak(u);
    return true;
  } catch (e) { return false; }
}

/* ---------- speech bubbles ---------- */
let actors = {};
function anchor(who) {
  if (who === 'fonkel' && S.scene !== 'wolken') return { x: hero.x, y: hero.y, h: 300 };
  return actors[who] || { x: 800, y: 420, h: 0 };
}
function say(who, text) {
  return new Promise(res => {
    const w = WHO[who], a = anchor(who);
    bubble.innerHTML = `<b style="color:${w.c}">${w.n}</b>${text}`;
    bubble.style.display = 'block';
    bubble.style.borderColor = w.c;
    const bw = bubble.offsetWidth, bh = bubble.offsetHeight;
    const left = clamp(a.x - bw / 2, 14, 1600 - bw - 14);
    const top = clamp(a.y - a.h - bh - 34, 112, 900 - bh - 40);
    bubble.style.left = left + 'px'; bubble.style.top = top + 'px';
    bubble.style.setProperty('--tail', clamp(a.x - left, 40, bw - 40) + 'px');
    const el = who === 'fonkel' && S.scene !== 'wolken' ? hero.el : document.getElementById(who);
    const inn = el && el.querySelector('.in');
    if (inn) inn.classList.add('talk');
    let done = false; const t0 = performance.now(); talking = true;
    const fin = () => {
      if (done) return; done = true;
      clearTimeout(to); skipLine = null; bubble.style.display = 'none'; talking = false;
      if (inn) inn.classList.remove('talk');
      stopVoice();
      setTimeout(res, FAST ? 0 : 180);
    };
    skipLine = () => { if (performance.now() - t0 > 600) fin(); };
    const spoken = speak(text, who, () => setTimeout(fin, 300));
    const to = setTimeout(fin, FAST ? 20 : spoken ? 4000 + text.length * 130 : 1400 + text.length * 75);
  });
}
function shout(text, who) { speak(text, who || 'fonkel'); }
bubble.addEventListener('pointerdown', e => { e.preventDefault(); if (skipLine) skipLine(); });

/* ---------- hero ---------- */
const hero = { x: 620, y: 800, dir: 1, el: null };
const HS = .8;
function drawHero() {
  heroL.innerHTML = `<g id="hero" data-hot="fonkel"><g class="in">${artUnicorn()}</g></g>`;
  hero.el = $('#hero'); posHero();
}
function posHero() { hero.el.setAttribute('transform', `translate(${hero.x.toFixed(1)},${hero.y}) scale(${hero.dir * HS},${HS})`); }
async function walkTo(x, free) {
  if (!free) x = clamp(x, 200, 1400);
  const d = Math.abs(x - hero.x); if (d < 10) return;
  hero.dir = x > hero.x ? 1 : -1; hero.el.classList.add('walking');
  const x0 = hero.x;
  await tween(d / .6, k => { hero.x = x0 + (x - x0) * k; posHero(); }, k => k);
  hero.el.classList.remove('walking');
}
function face(tx) { hero.dir = tx >= hero.x ? 1 : -1; posHero(); }
async function heroJump() { const inn = hero.el.querySelector('.in'); inn.classList.add('a-jump'); sfx('boing'); await wait(650); inn.classList.remove('a-jump'); }

/* ---------- effects ---------- */
function burst(x, y, n = 16, dist = 140, cols = RB.map(c => c.col)) {
  for (let i = 0; i < n; i++) {
    const a = Math.PI * 2 * i / n + Math.random() * .4, d = dist * rnd(.5, 1.1);
    const c = add(fxL, `<circle class="np" r="${rnd(6, 14).toFixed(1)}" fill="${cols[i % cols.length]}"/>`);
    tween(rnd(700, 1100), k => { c.setAttribute('cx', x + Math.cos(a) * d * k); c.setAttribute('cy', y + Math.sin(a) * d * k + 60 * k * k); c.setAttribute('opacity', 1 - k); }, k => 1 - (1 - k) * (1 - k)).then(() => c.remove());
  }
}
function floatText(x, y, txt, col = '#fff') {
  const t = add(fxL, `<text class="np" text-anchor="middle" font-size="110" fill="${col}" stroke="#4b3060" stroke-width="10" paint-order="stroke" stroke-linejoin="round">${txt}</text>`);
  tween(1100, k => { t.setAttribute('x', x); t.setAttribute('y', y - 120 * k); t.setAttribute('opacity', k < .7 ? 1 : (1 - k) / .3); }, k => k).then(() => t.remove());
}
/* laat een tekening van a naar b vliegen (in een boogje) */
async function fly(art, x0, y0, x1, y1, o = {}) {
  const { ms = 650, arc = 120, s0 = 1, s1 = 1, spin = 0 } = o;
  const g = add(fxL, `<g class="np">${art}</g>`);
  await tween(ms, k => g.setAttribute('transform', `translate(${x0 + (x1 - x0) * k},${y0 + (y1 - y0) * k - arc * Math.sin(Math.PI * k)}) rotate(${spin * k}) scale(${s0 + (s1 - s0) * k})`));
  g.remove();
}
const slotX = i => 584 + i * 72;
async function giveStar(id, x, y) {
  const i = RB.findIndex(r => r.id === id), c = RB[i];
  const g = add(fxL, `<g class="np">${starArt(c.col, 60)}</g>`);
  sfx('star'); burst(x, y);
  await tween(700, k => g.setAttribute('transform', `translate(${x},${y - 90 * k}) scale(${.3 + 1.3 * k}) rotate(${360 * k})`));
  await wait(600);
  const y0 = y - 90;
  await tween(700, k => g.setAttribute('transform', `translate(${x + (slotX(i) - x) * k},${y0 + (60 - y0) * k}) scale(${1.6 - 1.13 * k})`));
  g.remove(); S.stars[id] = true; drawHUD(); sfx('ding'); save();
  if (S.scene !== 'wolken') heroJump();
  await say('fonkel', T.joepie(c));
  const n = nStars();
  if (n === NS) await say('fonkel', 'We hebben alle zeven de sterren! Vlug, terug naar prinses Lotte in het kasteel!');
  else await say('fonkel', T.nog(NS - n));
}
async function addInv(it, x, y) {
  sfx('pop');
  await fly(ITEMS[it].art, x, y, 90 + S.inv.length * 130, 820, { s1: 1.3 });
  S.inv.push(it); drawHUD(); sfx('ding');
}
function remInv(it) { S.inv = S.inv.filter(i => i !== it); drawHUD(); }
async function fadeTo(v) { fade.style.opacity = v; await wait(320); }

/* ---------- HUD ---------- */
function drawHUD() {
  if (!started) { hudL.innerHTML = ''; return; }
  let h = `<rect class="np" x="530" y="12" width="540" height="96" rx="48" fill="#fff" opacity=".7"/>`;
  RB.forEach((c, i) => {
    h += `<g class="np" transform="translate(${slotX(i)},60)">${S.stars[c.id] ? starArt(c.col, 28) : `<path d="${starPath(27)}" fill="${c.col}" fill-opacity=".18" stroke="${c.col}" stroke-width="4" stroke-dasharray="7 7" stroke-linejoin="round"/>`}</g>`;
  });
  S.inv.forEach((it, i) => {
    h += `<g data-tap="inv" data-it="${it}" transform="translate(${90 + i * 130},820)"><rect x="-56" y="-56" width="112" height="112" rx="26" fill="#fff" opacity=".9" stroke="#ffb3de" stroke-width="6"/><g transform="scale(1.3)">${ITEMS[it].art}</g></g>`;
  });
  const btn = (x, ui, on, glyph) => `<g data-ui="${ui}" transform="translate(${x},60)"><circle r="36" fill="#fff" opacity=".85" stroke="#ffb3de" stroke-width="5"/>${glyph}${on ? '' : '<path d="M-22,-22 L22,22" stroke="#ff4d5e" stroke-width="8" stroke-linecap="round"/>'}</g>`;
  h += btn(1450, 'music', S.music, `<text text-anchor="middle" y="18" font-size="50" fill="#7b4bc4">♪</text>`);
  h += btn(1540, 'sound', S.sound, `<path d="M-18,-8 h10 l14,-12 v40 l-14,-12 h-10 z" fill="#7b4bc4"/><path d="M12,-10 q8,10 0,20" fill="none" stroke="#7b4bc4" stroke-width="5" stroke-linecap="round"/>`);
  if (S.scene !== 'wolken') h += `<g data-ui="map" transform="translate(1520,826)"><circle r="54" fill="#fff" opacity=".92" stroke="#ffb3de" stroke-width="6"/>
    <path d="M-30,-20 L-10,-28 L10,-20 L30,-28 V20 L10,28 L-10,20 L-30,28 Z" fill="#ffe9a8" ${ST}/><path d="M-10,-28 V20 M10,-20 V28" stroke="#4b3060" stroke-width="3"/><path d="M-20,8 l8,-10 l10,6 l10,-12" fill="none" stroke="#ff4d5e" stroke-width="4" stroke-dasharray="5 4" stroke-linecap="round"/></g>`;
  hudL.innerHTML = h;
}
function ui(k) {
  if (k === 'map') { if (!busy && started && S.scene !== 'wolken' && !catchG.on) { sfx('pop'); openMap(); } return; }
  S[k] = !S[k];
  if (master) master.gain.value = S.sound ? 1 : 0;
  if (!S.sound) stopVoice();
  drawHUD(); if (!busy) save();
}

/* ---------- kaart ---------- */
const MAPPOS = { strand: [170, 660, '#ffe9a8'], grot: [390, 440, '#8f7bc0'], bos: [600, 660, '#8fdc7a'], kasteel: [800, 480, '#ffd1e8'], keuken: [800, 250, '#ffd9a0'], meer: [1010, 660, '#7fd4ff'], heks: [1200, 440, '#c9a8f5'], brug: [1370, 660, '#bfe8ff'], wei: [1460, 340, '#c9f7a8'] };
const ROUTE = ['strand', 'grot', 'bos', 'kasteel', 'meer', 'heks', 'brug', 'wei'];
const seen = id => id === 'kasteel' || S.flags['seen_' + id];
function openMap() {
  let h = `<rect data-tap="mapclose" width="1600" height="900" fill="#fff4d6" opacity=".97"/>
    <text class="np" x="800" y="112" text-anchor="middle" font-size="64" fill="#7b4bc4">Waar gaan we naartoe?</text>
    <path class="np" d="M${ROUTE.map(id => MAPPOS[id][0] + ',' + MAPPOS[id][1]).join(' L')} M800,480 L800,250" fill="none" stroke="#d9b98a" stroke-width="14" stroke-dasharray="4 26" stroke-linecap="round"/>`;
  for (const id in MAPPOS) {
    const [x, y, col] = MAPPOS[id], ok = seen(id);
    h += `<g ${ok ? `data-tap="travel" data-to="${id}"` : 'class="np"'} transform="translate(${x},${y})">
      ${id === S.scene ? `<circle class="pulse" r="96" fill="none" stroke="#ff5fb0" stroke-width="12"/>` : ''}
      <circle r="78" fill="${ok ? col : '#ddd6c6'}" stroke="#fff" stroke-width="8"/><circle r="78" fill="none" stroke="#4b3060" stroke-width="4"/>
      ${ok ? mapIcon[id] + `<text text-anchor="middle" y="118" font-size="30" fill="#4b3060">${PLACE_SHORT[id]}</text>` : `<text text-anchor="middle" y="30" font-size="90" fill="#fff">?</text>`}</g>`;
  }
  h += `<g data-tap="mapclose" transform="translate(1520,80)"><circle r="46" fill="#ff7eb9" stroke="#fff" stroke-width="8"/><path d="M-18,-18 L18,18 M18,-18 L-18,18" stroke="#fff" stroke-width="12" stroke-linecap="round"/></g>`;
  mapL.innerHTML = h;
}
function closeMap() { mapL.innerHTML = ''; mem = null; shp = null; }

/* ---------- scenes ---------- */
const scenes = {};
let potion, bub, flight, bake, flw, catchG, simon, mem = null, shp = null, pcol = 0;
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function resetMini() {
  potion = { on: false, step: 0, used: {} };
  bub = { on: false, n: 0, list: [], star: null, t: 0 };
  flight = { on: false, n: 0, list: [], big: null, t: 0, x: 400, y: 480 };
  bake = { on: false, phase: 0, n: 0 };
  flw = { on: false, round: 0, order: [1, 2, 0] };
  catchG = { on: false, n: 0, list: [], t: 0, x: 800, el: null };
  simon = { on: false, seq: [], pos: 0, round: 0 };
}
resetMini();
const wiggle = el => { const inn = el.querySelector('.in') || el; inn.classList.add('a-wiggle'); setTimeout(() => inn.classList.remove('a-wiggle'), 650); };

/* --- titel --- */
scenes.titel = {
  draw() {
    return `<rect width="1600" height="900" fill="url(#gSky)"/>${rainbow(760, true)}
    <g transform="translate(1380,130)" class="np">${artSun}</g>
    <g class="drift np" transform="translate(220,170)">${artCloud}</g>
    <path d="M0,700 Q400,620 800,690 T1600,680 V900 H0Z" fill="#7fd36b"/>
    <text x="800" y="250" text-anchor="middle" font-size="150" fill="#ff5fb0" stroke="#fff" stroke-width="22" paint-order="stroke" stroke-linejoin="round">Fonkel</text>
    <text x="800" y="350" text-anchor="middle" font-size="68" fill="#7b4bc4" stroke="#fff" stroke-width="16" paint-order="stroke" stroke-linejoin="round">en de Verdwenen Regenboog</text>
    <g transform="translate(330,850) scale(1.25)" class="np"><g class="in bobber">${artUnicorn()}</g></g>
    <g transform="translate(1330,850) scale(-1,1)" class="np"><g class="happy">${artDragon()}</g></g>
    <g transform="translate(1100,850) scale(.9)" class="np">${artLotte()}</g>
    <g data-tap="start" transform="translate(760,610)"><g class="pulse"><circle r="130" fill="#4cd964" stroke="#fff" stroke-width="14"/><path d="M-40,-66 L74,0 L-40,66 Z" fill="#fff" stroke="#2f9e44" stroke-width="6" stroke-linejoin="round"/></g></g>
    ${S.flags.intro ? `<g data-tap="reset" transform="translate(760,820)"><rect x="-190" y="-36" width="380" height="72" rx="36" fill="#fff" opacity=".9" stroke="#ffb3de" stroke-width="5"/><text text-anchor="middle" y="14" font-size="38" fill="#7b4bc4">↺ Opnieuw beginnen</text></g>` : ''}`;
  }
};

/* --- kasteel --- */
scenes.kasteel = {
  left: 'bos', right: 'meer', mx: 620,
  draw() {
    const d = S.flags.done;
    const fr = (id, x, y, art, s, o = {}) => actor(id, x, y, art, Object.assign({ s, hot: '', inCls: 'dance', h: 330 }, o));
    return `<rect width="1600" height="900" fill="url(#gSky)"/>
    ${fun(1290, 150, artSun, { a: 'spin', snd: 'ding', s: .9 })}
    ${rainbow(720, d)}
    <g class="drift">${fun(240, 190, artCloud, { a: 'wiggle', snd: 'pof' })}</g><g class="drift" style="animation-delay:-6s">${fun(1440, 330, artCloud, { a: 'wiggle', snd: 'pof', s: .7 })}</g>
    <path class="np" d="M0,640 Q200,560 420,630 T820,620 T1250,630 T1600,600 V900 H0Z" fill="#a5e08a"/>
    ${castle()}
    <path class="np" d="M0,690 Q800,650 1600,690 V900 H0Z" fill="#7fd36b"/>
    <path class="np" d="M742,668 L858,668 L1060,900 L540,900 Z" fill="#f3e2b3"/>
    ${d ? fr('hanne', 650, 722, artHanne(), .6) + fr('pim', 530, 745, artPim(true), .8, { h: 240 }) + fr('kamiel', 775, 722, artKamiel(), .6)
        + fr('bram', 1290, 730, artBram(), .55, { cls: 'happy' }) + fr('vlam', 1450, 760, artDragon(), .6, { flip: true, cls: 'happy' })
        + fr('piet', 420, 735, artPiet(), .62) + `<g class="np" transform="translate(1010,470) scale(.7)"><g class="bobber">${artFien()}</g></g>` : ''}
    ${fun(250, 770, `<ellipse cx="0" cy="-20" rx="130" ry="34" fill="#cfd8ea" ${ST}/><ellipse cx="0" cy="-28" rx="108" ry="22" fill="#7fd4ff"/>
      <rect x="-15" y="-120" width="30" height="96" fill="#cfd8ea" ${ST}/><ellipse cx="0" cy="-122" rx="56" ry="14" fill="#cfd8ea" ${ST}/>
      <path d="M0,-130 Q-10,-200 -60,-180 Q-80,-120 -72,-40 M0,-130 Q10,-200 60,-180 Q80,-120 72,-40 M0,-130 V-210" fill="none" stroke="#7fd4ff" stroke-width="9" stroke-linecap="round" stroke-dasharray="20 14"/>`, { a: 'jump', snd: 'splash' })}
    ${d ? '' : `<g data-tap="verf" transform="translate(1400,800)"><g class="in">${artEzel}</g></g>`}
    ${actor('lotte', 1130, 800, artLotte(), { h: 270 })}
    ${fun(480, 885, artFlower('#ff8ad1'), { a: 'grow', snd: 'note', note: 0 })}${fun(600, 870, artFlower('#b48cf0'), { a: 'grow', snd: 'note', note: 2 })}
    ${fun(1270, 880, artFlower('#ff8a3c'), { a: 'grow', snd: 'note', note: 4 })}${fun(700, 890, artFlower('#6fd0ff'), { a: 'grow', snd: 'note', note: 5 })}
    ${d ? `<g transform="translate(800,300)"><text class="np" text-anchor="middle" font-size="110" fill="#ff5fb0" stroke="#fff" stroke-width="20" paint-order="stroke" stroke-linejoin="round">Goed gedaan!</text></g>
      <g data-tap="again" transform="translate(240,420)"><g class="pulse"><circle r="62" fill="#4cd964" stroke="#fff" stroke-width="8"/><text text-anchor="middle" y="26" font-size="76" fill="#fff">↺</text></g></g>` : ''}`;
  },
  hot: {
    lotte: {
      x: 930, tx: 1130, async act() {
        if (S.flags.done) return say('lotte', 'Wat een schoon feest! Dank je wel, Fonkel!');
        const n = nStars();
        if (n === NS) return finale();
        if (n === 0) return say('lotte', 'Zoek de zeven toversterren, Fonkel! Ze zijn overal in het land verstopt.');
        await say('lotte', T.lotteN(n));
      }
    }
  },
  async enter() {
    if (!S.flags.intro) {
      await wait(400);
      await say('lotte', 'Oei oei oei! Fonkel, kom vlug!');
      await say('lotte', 'De regenboog is al zijn kleuren kwijt! Hij is helemaal grijs.');
      await say('lotte', 'De zeven toversterren zijn weggevlogen. Wil jij ze gaan zoeken?');
      await heroJump();
      await say('fonkel', 'Natuurlijk, prinses Lotte! Ik vind ze allemaal terug!');
      await say('fonkel', 'Help jij mij? Duw op de grote gele pijlen om te wandelen!');
      await say('fonkel', 'En als je op mij duwt, dan zeg ik wat we kunnen doen.');
      S.flags.intro = true;
    } else if (nStars() === NS && !S.flags.done) await finale();
  },
  tick(dt) {
    if (!S.flags.done) return;
    this.fw = (this.fw || 0) - dt;
    if (this.fw < 0) { this.fw = rnd(500, 1100); burst(rnd(150, 1450), rnd(120, 420), 14, 120); if (Math.random() < .5) sfx('pop'); }
  }
};
async function finale() {
  await walkTo(930); face(1130);
  await say('lotte', 'Fonkel! Je hebt alle zeven de sterren gevonden! Amai, wat ben jij flink!');
  await say('fonkel', 'Sterretjes, vlieg maar terug naar de regenboog!');
  for (let i = 0; i < NS; i++) {
    const c = RB[i], r = rbR(i);
    const g = add(fxL, `<g class="np">${starArt(c.col, 36)}</g>`);
    sfx('note', i);
    await tween(650, k => g.setAttribute('transform', `translate(${slotX(i) + (800 - slotX(i)) * k},${60 + (720 - r - 60) * k}) scale(${1 + k})`));
    g.remove(); $('#rb' + i).setAttribute('stroke', c.col);
    burst(800, 720 - r, 18, 180, [c.col, '#fff']); sfx('ding'); floatText(800, 720 - r + 130, c.name, c.col); shout(T.kleur(c), 'lotte');
    await wait(1100);
  }
  S.flags.done = true; save();
  sfx('fanfare'); redraw(); await heroJump();
  await say('lotte', 'De regenboog heeft al zijn kleuren terug! Amai, wat is hij schoon!');
  await say('vlam', 'Joepie! Nu kan het feest beginnen!');
  await say('bram', 'En ik heb koekjes mee voor iedereen!');
  await say('lotte', 'Dank je wel, Fonkel! En ook een dikke merci aan jou, voor al je hulp!');
  await say('fonkel', 'Dat was plezant! Tot de volgende keer! Daaag!');
  sfx('fanfare');
}

/* --- keuken --- */
scenes.keuken = {
  left: 'kasteel', mx: 300,
  draw() {
    let tiles = ''; for (let x = 0; x < 1600; x += 100) tiles += `M${x},430 V700 `;
    let floor = ''; for (let x = -200; x < 1800; x += 160) floor += `M${x},900 L${800 + (x - 800) * .55},700 `;
    const pan = (x, n, c) => fun(x, 250, `<path d="M0,0 V26" stroke="#4b3060" stroke-width="6" stroke-linecap="round"/><circle cx="0" cy="66" r="42" fill="${c}" ${ST}/><circle cx="0" cy="66" r="28" fill="#fff" opacity=".25"/>`, { a: 'wiggle', snd: 'clang', note: n, inCls: 'top' });
    const eggs = [0, 1, 2, 3, 4].map(i => `<g data-tap="ei" transform="translate(${505 + i * 52},584)">${artEgg}<circle r="34" fill="transparent"/></g>`).join('');
    const bes = [0, 1, 2, 3].map(i => `<g data-tap="bes" transform="translate(${955 + i * 50},584)"><g transform="scale(.8)">${ING.rood.art}</g><circle r="32" fill="transparent"/></g>`).join('');
    return `<rect width="1600" height="900" fill="#fff0cf"/><rect class="np" y="430" width="1600" height="270" fill="#ffd9a0"/><path class="np" d="${tiles} M0,430 H1600 M0,565 H1600" stroke="#f0bf7a" stroke-width="4" fill="none"/>
    <rect class="np" y="700" width="1600" height="200" fill="#d9a877"/><path class="np" d="${floor} M0,770 H1600" stroke="#c08a55" stroke-width="4" fill="none"/>
    ${fun(250, 350, `<rect x="-130" y="-230" width="260" height="230" rx="16" fill="#9fdcff" ${ST}/><g transform="translate(20,-150) scale(.6)">${artCloud}</g><path d="M-130,-60 Q-40,-120 40,-70 T130,-80 V0 H-130Z" fill="#8fdc7a"/><path d="M0,-230 V0 M-130,-115 H130" stroke="#4b3060" stroke-width="6"/><rect x="-146" y="-4" width="292" height="20" rx="8" fill="#c98f5a" ${ST}/>`, { a: 'twinkle', snd: 'ding' })}
    <rect class="np" x="560" y="236" width="480" height="18" rx="8" fill="#c98f5a" ${ST}/>
    ${pan(630, 0, '#ff8a3c')}${pan(750, 2, '#6fb8ff')}${pan(870, 4, '#ff7eb9')}${pan(980, 5, '#b8c4d8')}
    <g class="np"><rect x="1340" y="120" width="60" height="290" fill="#8f9bb5" ${ST}/><rect x="1300" y="400" width="270" height="400" rx="18" fill="#b8c4d8" ${ST}/>
      <rect id="ovenwin" x="1335" y="520" width="200" height="180" rx="14" fill="#3a3550" ${ST}/><rect x="1335" y="486" width="200" height="14" rx="7" fill="#6b7896" ${ST}/>
      <circle cx="1360" cy="445" r="14" fill="#ff4d5e" ${ST}/><circle cx="1410" cy="445" r="14" fill="#ffd43b" ${ST}/><circle cx="1460" cy="445" r="14" fill="#4cd964" ${ST}/></g>
    <g class="np"><rect x="500" y="640" width="26" height="170" fill="#8a5a3c" ${ST}/><rect x="1100" y="640" width="26" height="170" fill="#8a5a3c" ${ST}/><rect x="460" y="610" width="700" height="32" rx="10" fill="#c98f5a" ${ST}/></g>
    <g id="kom" class="np" transform="translate(830,612)">${artBowl}</g>
    ${eggs}${bes}
    ${actor('kamiel', 1230, 805, artKamiel(), { h: 350 })}
    ${fun(120, 800, `<path d="M-50,0 V-40 A50,50 0 0 1 50,-40 V0 Z" fill="#4a2d1c" ${ST}/><ellipse cx="6" cy="-18" rx="26" ry="18" fill="#b8b0c8" ${ST}/><circle cx="-14" cy="-36" r="11" fill="#b8b0c8" ${ST}/><circle cx="24" cy="-22" r="3.5" fill="#3b2a4a"/><circle cx="33" cy="-14" r="4" fill="#ff8ad1"/>`, { a: 'jump', snd: 'squeak' })}`;
  },
  hot: { kamiel: { x: 300, tx: 1230, act: () => kamielTalk() } }
};
async function kamielTalk() {
  if (bake.on) return bake.phase === 0 ? say('kamiel', 'Doe drie eieren in de kom! Duw maar op de eieren.') : say('kamiel', 'Doe twee aardbeien in de kom! Duw maar op de aardbeien.');
  if (has('koek')) return say('kamiel', 'Deel de koekjes maar uit, Fonkel! Wie honger heeft, wordt er blij van.');
  if (S.flags.trol) return say('kamiel', 'Mijn koekjes zijn de lekkerste van het hele land!');
  if (!S.flags.baked) {
    await say('kamiel', 'Dag Fonkel! Ik ben kok Kamiel. Ik bak koekjes voor het grote feest.');
    await say('kamiel', 'Maar ik kan niet zo goed tellen. Help jij mij?');
  } else await say('kamiel', 'Zijn de koekjes op? Dan bakken we er nog!');
  bake = { on: true, phase: 0, n: 0 };
  await say('kamiel', 'Doe drie eieren in de kom! Duw maar op de eieren.');
}

/* --- bos --- */
const ZWAM = [[840, 875, '#ff4d5e', 0], [990, 888, '#ffd43b', 2], [1140, 872, '#b266ff', 4]];
scenes.bos = {
  left: 'grot', right: 'kasteel', mx: 900,
  draw() {
    let back = '';
    [[420, 620, .8], [760, 600, .7], [960, 630, .85], [1420, 610, .8], [60, 640, .9]].forEach(([x, y, s]) => back += `<g class="np" opacity=".55" transform="translate(${x},${y}) scale(${s})">${artTree('#3fae4a', '#7ed957')}</g>`);
    const apples = [[-70, -300], [40, -400], [100, -280], [-20, -260], [-110, -360]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="#ff4d5e" ${ST}/>`).join('');
    return `<rect width="1600" height="900" fill="url(#gForest)"/>${back}
    <path class="np" d="M0,700 Q400,660 800,690 T1600,680 V900 H0Z" fill="#6cc46a"/>
    <path class="np" d="M0,800 Q500,760 900,800 T1600,790 V900 H0Z" fill="#8fdc7a"/>
    <rect class="np" x="150" y="-10" width="170" height="800" fill="#8a5a3c" ${ST}/><path class="np" d="M150,780 Q110,800 90,830 H380 Q360,800 320,780 Z" fill="#8a5a3c" ${ST}/>
    <ellipse class="np" cx="235" cy="390" rx="62" ry="74" fill="#4a2d1c" ${ST}/>
    ${fun(235, 452, artOwl, { a: 'wiggle', snd: 'hoot', cls: 'owl' })}
    <circle class="np" cx="120" cy="20" r="150" fill="#3fae4a"/><circle class="np" cx="330" cy="0" r="160" fill="#3fae4a"/>
    <g id="boom" data-hot="boom" transform="translate(1180,810)"><g class="in">${artTree('#58c45a', '#a8ee9a')}${apples}</g></g>
    <ellipse class="np" cx="600" cy="800" rx="74" ry="20" fill="#000" opacity=".12"/>
    <rect class="np" x="540" y="730" width="120" height="70" rx="12" fill="#a8744a" ${ST}/><ellipse class="np" cx="600" cy="732" rx="60" ry="17" fill="#d9a877" ${ST}/>
    ${actor('pim', 600, 738, artPim(S.flags.pimhat), { s: 1.05, h: S.flags.pimhat ? 240 : 180 })}
    ${fun(1500, 760, artBunny, { a: 'jump', snd: 'boing' })}<g class="np" transform="translate(1500,830)">${artBush}</g>
    ${ZWAM.map(([x, y, c, n], i) => simon.on ? `<g data-tap="zwam" data-i="${i}" transform="translate(${x},${y})"><g class="in">${artMush(c)}</g></g>` : fun(x, y, artMush(c), { snd: 'note', note: n })).join('')}
    <g class="flutter">${fun(700, 380, artButterfly('#ff8ad1'), { a: 'spin', snd: 'ding' })}</g>
    <g class="flutter" style="animation-delay:-3s">${fun(1000, 250, artButterfly('#6fd0ff'), { a: 'spin', snd: 'ding' })}</g>`;
  },
  hot: {
    pim: {
      x: 800, tx: 600, async act() {
        if (S.stars.groen) return say('pim', 'Mijn oren zijn weer lekker warm! Dank je wel, Fonkel!');
        if (!S.flags.pimhat) {
          if (!has('muts')) {
            await say('pim', 'Snik, snik... Ik ben mijn rode muts kwijt.');
            await say('pim', 'De wind heeft ze meegenomen, helemaal tot aan het meer! En nu heb ik koude oren.');
            return say('fonkel', 'Niet wenen, Pim! Ik ga jouw muts zoeken.');
          }
          await say('fonkel', 'Kijk eens, Pim! Ik heb jouw muts gevonden!');
          remInv('muts'); S.flags.pimhat = true; redraw(); sfx('magic'); burst(600, 560, 12, 100);
          await say('pim', 'Mijn muts! Joepie! Dikke merci, Fonkel!');
          await say('pim', 'Weet je wat? De groene ster zit verstopt in de zingende paddenstoelen!');
        }
        await say('pim', 'Luister goed naar hun liedje. En speel het dan na!');
        await walkTo(380); face(600);
        simon = { on: true, seq: [], pos: 0, round: 0 }; redraw();
        await simonDemo(true);
      }
    },
    boom: {
      x: 930, tx: 1180, async act(el) {
        wiggle(el); sfx('flap');
        if (has('appel')) return say('fonkel', 'Ik heb al een appel. Eentje is genoeg!');
        if (S.flags.fed) return say('fonkel', 'Amai, wat een schone appelboom!');
        await say('fonkel', 'De appels hangen veel te hoog! Ik schud eens aan de boom.');
        await say('fonkel', 'Vang jij drie appels in de mand? Schuif de mand heen en weer!');
        await walkTo(300); face(1180);
        catchG = { on: true, n: 0, list: [], t: 0, x: 900, el: add(fxL, `<g class="np">${artBasket}</g>`) };
      }
    }
  },
  tick(dt) {
    const c = catchG; if (!c.on) return;
    c.x += (clamp(pointer.x, 480, 1500) - c.x) * Math.min(1, dt * .012);
    c.el.setAttribute('transform', `translate(${c.x.toFixed(1)},800) scale(1.3)`);
    if (c.list.length < 2 && (c.t -= dt) < 0) {
      c.t = 1600; wiggle($('#boom')); sfx('flap');
      c.list.push({ x: rnd(560, 1440), y: 330, el: add(fxL, `<g class="np"><g transform="scale(1.5)">${artApple}</g></g>`) });
    }
    for (const a of [...c.list]) {
      a.y += dt * .17; a.el.setAttribute('transform', `translate(${a.x.toFixed(0)},${a.y.toFixed(1)})`);
      const hit = a.y > 690 && a.y < 790 && Math.abs(a.x - c.x) < 115;
      if (hit || a.y > 870) { a.el.remove(); c.list.splice(c.list.indexOf(a), 1); }
      if (!hit) { if (a.y > 870) sfx('pof'); continue; }
      c.n++; sfx('note', c.n * 2); floatText(a.x, 640, c.n, '#ff4d5e'); shout(T.tel(c.n - 1));
      if (c.n >= 3) {
        c.on = false; c.list.forEach(o => o.el.remove()); c.list = []; c.el.remove();
        runSoon(async () => { await wait(700); await say('fonkel', 'Drie appels! Goed gevangen! Eentje neem ik mee voor onderweg.'); await addInv('appel', c.x, 740); });
      }
    }
  }
};
async function simonDemo(fresh) {
  if (fresh) { simon.seq = []; for (let i = 0; i < simon.round + 2; i++) { let n; do n = Math.floor(Math.random() * 3); while (n === simon.seq[i - 1]); simon.seq.push(n); } }
  await wait(500);
  for (const i of simon.seq) { zwamPlay(i); await wait(750); }
  simon.pos = 0;
}
function zwamPlay(i) {
  const inn = document.querySelector(`[data-tap=zwam][data-i="${i}"] .in`); sfx('note', ZWAM[i][3]);
  if (inn) { inn.classList.remove('a-jump'); void inn.getBoundingClientRect(); inn.classList.add('a-jump'); }
}

/* --- grot --- */
scenes.grot = {
  left: 'strand', right: 'bos', mx: 760, inL: 780,
  draw() {
    let tites = '';
    [[80, 180], [240, 110], [420, 220], [640, 130], [800, 250], [980, 150], [1140, 200], [1300, 110]].forEach(([x, h]) => tites += `<path d="M${x - 50},-5 L${x},${h} L${x + 50},-5 Z" fill="#3a2a60" ${ST}/>`);
    return `<rect width="1600" height="900" fill="url(#gCave)"/>
    <g class="np" clip-path="url(#cpOpen)"><rect x="1200" y="200" width="400" height="700" fill="#bfe8ff"/><circle cx="1500" cy="380" r="50" fill="#ffd84a"/><path d="M1200,640 Q1400,580 1600,640 V900 H1200 Z" fill="#8fdc7a"/></g>
    <ellipse class="np" cx="1580" cy="560" rx="270" ry="330" fill="none" stroke="#3a2a60" stroke-width="16"/>
    <ellipse class="np" cx="10" cy="520" rx="150" ry="260" fill="#ffe9a8"/><ellipse class="np" cx="10" cy="520" rx="150" ry="260" fill="none" stroke="#3a2a60" stroke-width="16"/>
    <g class="np">${tites}</g>
    <path class="np" d="M0,760 Q500,720 900,750 T1600,770 V900 H0Z" fill="#6a5596"/>
    <path class="np" d="M0,840 Q600,800 1600,850 V900 H0Z" fill="#7b66aa"/>
    ${fun(200, 770, artCrystal('#6fe3ff'), { a: 'twinkle', snd: 'note', note: 1, s: .8 })}${fun(700, 745, artCrystal('#ff9ee0'), { a: 'twinkle', snd: 'note', note: 3, s: .7 })}${fun(1160, 760, artCrystal('#ffe680'), { a: 'twinkle', snd: 'note', note: 5, s: .8 })}
    ${fun(560, 150, artBat, { a: 'wiggle', snd: 'squeak', s: 1.2 })}${fun(900, 250, artBat, { a: 'wiggle', snd: 'squeak', s: 1 })}
    ${actor('vlam', 400, 820, artDragon(), { cls: S.flags.fed ? 'happy' : 'sad', h: 330 })}
    ${!S.flags.fed ? `<g id="ijs" data-hot="ijs" transform="translate(960,810)"><g class="in"><g transform="translate(0,-80)">${starArt('#ff4d5e', 46)}</g>
        <rect x="-90" y="-180" width="180" height="180" rx="22" fill="#bfeaff" opacity=".72" stroke="#fff" stroke-width="6"/><path d="M-60,-150 L-20,-150 M-60,-130 L-40,-130 M30,-40 L60,-40" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g></g>`
        : `<ellipse class="np" cx="960" cy="812" rx="110" ry="18" fill="#9fdcff" opacity=".7"/>` + (S.stars.rood ? '' : `<g id="rodester" data-hot="rodester" transform="translate(960,730)"><g class="glow">${starArt('#ff4d5e', 56)}<circle r="80" fill="transparent"/></g></g>`)}`;
  },
  hot: {
    vlam: {
      x: 700, tx: 400, async act() {
        if (!S.flags.fed) {
          if (has('appel')) {
            await say('fonkel', 'Kijk, Vlam! Een lekkere appel voor jou!');
            remInv('appel');
            await fly(artApple, 640, 600, 500, 600, { arc: 100 });
            sfx('yum');
            const v = $('#vlam'); v.classList.remove('sad'); v.classList.add('happy');
            await say('vlam', 'Njam njam njam! Dat was lekker! Mijn buikje is vol.');
            await say('vlam', 'Nu kan ik weer vuur spuwen! Opgepast, Fonkel, ga maar een beetje opzij!');
            await walkTo(1270); face(0);
            const fire = v.querySelector('.fire'); fire.style.display = ''; sfx('roar');
            const ice = $('#ijs .in rect');
            await wait(500);
            await tween(1300, k => { ice.setAttribute('height', 180 * (1 - k)); ice.setAttribute('y', -180 * (1 - k)); ice.setAttribute('opacity', .72 * (1 - k)); });
            fire.style.display = 'none';
            S.flags.fed = true; redraw(); sfx('magic');
            await say('vlam', 'Kijk! Het ijs is gesmolten!');
            await say('fonkel', 'Wauw! Daar is de rode ster! Duw er maar op!');
          } else {
            await say('vlam', 'Boehoe... Ik heb zo\'n honger! Mijn buikje rommelt.');
            await say('fonkel', 'Arm draakje! Wat eet jij graag?');
            await say('vlam', 'Appels! Ik ben zot van appels! Maar hier in de grot groeien er geen.');
          }
        } else {
          if (S.stars.geel) await say('vlam', 'Nog eens vliegen? Spring maar op mijn rug!');
          else await say('vlam', 'Wil je meevliegen naar de wolken? Daar heb ik een gele ster gezien! Spring maar op mijn rug!');
          await startFlight();
        }
      }
    },
    ijs: {
      x: 1170, tx: 960, async act() {
        sfx('ding');
        await say('fonkel', 'Brr, een groot blok ijs! Er zit een rode ster in.');
        await say('fonkel', 'Het ijs is veel te hard. Wie kan het laten smelten?');
      }
    },
    rodester: { x: 1170, tx: 960, async act(el) { el.remove(); await giveStar('rood', 960, 730); redraw(); } }
  }
};

/* --- wolken (vliegspel) --- */
scenes.wolken = {
  draw() {
    return `<rect width="1600" height="900" fill="url(#gSky2)"/>
    ${fun(1260, 140, artSun, { a: 'spin', snd: 'ding', s: .8 })}
    <g class="drift">${fun(200, 240, artCloud, { a: 'wiggle', snd: 'pof', s: 1.3 })}</g><g class="drift" style="animation-delay:-5s">${fun(900, 170, artCloud, { a: 'wiggle', snd: 'pof' })}</g>
    <g class="drift" style="animation-delay:-9s">${fun(1250, 520, artCloud, { a: 'wiggle', snd: 'pof', s: 1.5 })}</g><g class="drift" style="animation-delay:-2s">${fun(480, 700, artCloud, { a: 'wiggle', snd: 'pof', s: 1.7 })}</g>
    <g class="np">${[0, 1, 2, 3].map(i => `<g transform="translate(${i * 480 - 80},900) scale(2.4)">${artCloud}</g>`).join('')}</g>
    <g id="flyer" class="np flying"><g transform="scale(.7)"><g class="happy">${artDragon()}</g><g transform="translate(-20,-196) scale(.6)">${artUnicorn()}</g></g></g>`;
  },
  tick(dt) {
    const f = flight;
    const k = Math.min(1, dt * .005);
    f.x += (clamp(pointer.x, 120, 1480) - f.x) * k; f.y += (clamp(pointer.y + 90, 220, 860) - f.y) * k;
    const el = $('#flyer'); if (el) el.setAttribute('transform', `translate(${f.x.toFixed(1)},${f.y.toFixed(1)})`);
    actors.vlam = { x: f.x, y: f.y, h: 250 }; actors.fonkel = { x: f.x, y: f.y, h: 330 };
    if (!f.on) return;
    const cx = f.x, cy = f.y - 110;
    if (!f.big && f.n < 5 && f.list.length < 3 && (f.t -= dt) < 0) {
      f.t = 1200;
      f.list.push({ el: add(fxL, `<g class="np"><g class="glow">${starArt('#fff3a0', 40)}</g></g>`), x: 1680, y: rnd(170, 760) });
    }
    for (const s of [...f.list]) {
      s.x -= dt * .14; if (s.x < -80) { s.x = 1680; s.y = rnd(170, 760); }
      s.el.setAttribute('transform', `translate(${s.x.toFixed(1)},${s.y.toFixed(1)})`);
      if (Math.hypot(s.x - cx, s.y - cy) < 135) {
        s.el.remove(); f.list.splice(f.list.indexOf(s), 1); f.n++;
        sfx('note', f.n); burst(s.x, s.y, 10, 90, ['#fff3a0', '#fff']); floatText(s.x, s.y, f.n, '#ffd43b'); shout(T.tel(f.n - 1));
        if (f.n >= 5) {
          f.list.forEach(o => o.el.remove()); f.list = [];
          if (S.stars.geel) { f.on = false; runSoon(endFlight); }
          else { f.big = { el: add(fxL, `<g class="np"><g class="glow">${starArt('#ffd43b', 80)}</g></g>`), x: 1750, y: 450 }; setTimeout(() => shout('Daar is de grote gele ster! Pak ze!'), FAST ? 0 : 1100); }
        }
      }
    }
    if (f.big) {
      const b = f.big; b.x -= dt * .1; if (b.x < -120) { b.x = 1750; b.y = rnd(250, 650); }
      b.el.setAttribute('transform', `translate(${b.x.toFixed(1)},${b.y.toFixed(1)})`);
      if (Math.hypot(b.x - cx, b.y - cy) < 170) { b.el.remove(); f.big = null; f.on = false; runSoon(endFlight); }
    }
  }
};
async function startFlight() {
  sfx('whoosh'); await fadeTo(1);
  S.scene = 'wolken'; render();
  flight.x = 300; flight.y = 520; pointer = { x: 500, y: 400 }; scenes.wolken.tick(0);
  await fadeTo(0);
  if (S.stars.geel) await say('fonkel', 'Joehoe! We vliegen weer! Vang de sterretjes!');
  else await say('fonkel', 'Joehoe! We vliegen! Vang de vijf kleine sterretjes!');
  flight.on = true; flight.n = 0; flight.t = 0;
}
async function endFlight() {
  if (!S.stars.geel) {
    await giveStar('geel', flight.x + 60, flight.y - 110);
    await say('vlam', 'Dat was plezant! Hou je vast, we vliegen terug naar huis!');
  } else {
    sfx('star');
    await say('fonkel', 'Joepie! Vliegen is plezant!');
  }
  sfx('whoosh'); await fadeTo(1);
  S.scene = 'grot'; hero.x = 760; hero.dir = -1; render();
  await fadeTo(0);
}

/* --- meer --- */
scenes.meer = {
  left: 'kasteel', right: 'heks',
  draw() {
    let waves = '';
    [[200, 440], [520, 480], [900, 450], [1250, 470], [380, 620], [800, 660], [1200, 640], [1450, 560], [120, 560]].forEach(([x, y], i) => waves += `<path class="wavel" style="animation-delay:-${i * .7}s" d="M${x},${y} q20,-14 40,0 t40,0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>`);
    const reed = (x, h) => `<path d="M${x},800 Q${x - 6},${800 - h / 2} ${x},${800 - h}" fill="none" stroke="#3fae4a" stroke-width="8" stroke-linecap="round"/><rect x="${x - 9}" y="${790 - h}" width="18" height="60" rx="9" fill="#7a4a2a" ${ST}/>`;
    return `<rect width="1600" height="900" fill="url(#gSky)"/>
    ${fun(220, 130, artSun, { a: 'spin', snd: 'ding', s: .8 })}
    <g class="drift">${fun(1100, 140, artCloud, { a: 'wiggle', snd: 'pof' })}</g>
    <path class="np" d="M0,400 L220,230 L420,360 L640,200 L900,380 L1150,250 L1400,370 L1600,280 V420 H0Z" fill="#b9a6e8"/>
    <path class="np" d="M640,200 L590,250 L640,240 L690,260 Z M220,230 L190,262 L224,254 L256,268 Z M1150,250 L1112,290 L1150,280 L1190,296 Z" fill="#fff"/>
    <path class="np" d="M0,400 Q800,360 1600,400 V440 H0Z" fill="#7fd36b"/>
    <rect class="np" y="420" width="1600" height="480" fill="url(#gWater)"/>
    <g class="np">${waves}</g>
    ${fun(1390, 650, artFish, { a: 'jump', snd: 'splash' })}
    ${fun(700, 500, artDuck, { a: 'wiggle', snd: 'kwak' })}
    ${actor('kwak', 300, 570, artFrog, { h: 110 })}
    <g class="np" transform="translate(560,660)"><ellipse rx="84" ry="24" fill="#3fae4a" ${ST}/><path d="M0,0 L-84,-10 L-84,10 Z" fill="#3f93d8"/></g>
    ${S.flags.gotHat ? '' : `<g id="muts" data-hot="muts" transform="translate(566,628)"><g class="in bobber">${artHat}<circle r="70" fill="transparent"/></g></g>`}
    ${actor('marie', 1080, 590, artMarie(), { s: 1.1, h: 170 })}
    <path class="np" d="M0,745 Q400,705 800,735 T1600,725 V900 H0Z" fill="#f2dfa8"/>
    <g>${fun(60, 800, reed(0, 300) + reed(40, 240) + reed(-30, 200), { a: 'wiggle', snd: 'flap' }).replace('translate(60,800)', 'translate(60,0)')}</g>
    ${fun(1250, 870, artShell, { a: 'grow', snd: 'note', note: 6 })}
    ${fun(1000, 880, `<g transform="translate(0,-24)"><path d="${starPath(28)}" fill="#ff9f43" ${ST}/></g>`, { a: 'spin', snd: 'note', note: 3 })}`;
  },
  hot: {
    muts: { x: 400, tx: 300, act: () => kwakTalk() },
    kwak: { x: 400, tx: 300, act: () => kwakTalk() },
    marie: {
      x: 790, tx: 1080, async act() {
        if (bub.on) return say('marie', 'Prik de bellen kapot! Duw er maar op!');
        if (S.stars.blauw) { await say('marie', 'Dag Fonkel! Wil je nog eens bellen prikken? Hier komen ze!'); bub.on = true; return; }
        await say('marie', 'Dag Fonkel! Ik ben Marie, de zeemeermin.');
        await say('marie', 'Er zit een blauwe ster verstopt in een luchtbel! Help jij mij de bellen kapot te prikken?');
        await say('fonkel', 'Ja! Bellen prikken is plezant! Duw op de bellen!');
        bub.on = true; bub.n = 0; bub.t = 0;
      }
    }
  },
  tick(dt) {
    if (!bub.on) return;
    if (bub.list.length < 5 && (bub.t -= dt) < 0) {
      bub.t = 700; const r = rnd(44, 62), x = rnd(160, 1440);
      bub.list.push({ x, y: 740, r, v: rnd(.05, .08), ph: rnd(0, 6), el: add(fxL, `<g data-tap="bel"><circle r="${r.toFixed(0)}" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-width="5"/><ellipse cx="${(-r * .35).toFixed(0)}" cy="${(-r * .4).toFixed(0)}" rx="${(r * .22).toFixed(0)}" ry="${(r * .14).toFixed(0)}" fill="#fff" opacity=".9" transform="rotate(-30)"/></g>`) });
    }
    for (const b of [...bub.list, ...(bub.star ? [bub.star] : [])]) {
      b.y -= dt * b.v; b.ph += dt * .003;
      if (b.y < 440 + b.r) { if (b === bub.star) { b.y = 740; b.x = rnd(300, 1300); } else { b.el.remove(); bub.list.splice(bub.list.indexOf(b), 1); continue; } }
      b.el.setAttribute('transform', `translate(${(b.x + Math.sin(b.ph) * 18).toFixed(1)},${b.y.toFixed(1)})`);
    }
  }
};

async function kwakTalk() {
  sfx('kwak'); const k = $('#kwak .in'); k.classList.add('a-jump'); setTimeout(() => k.classList.remove('a-jump'), 700);
  if (!S.flags.gotHat) {
    await say('fonkel', 'Kijk, een rode muts op het waterlelieblad! Die is zeker van kabouter Pim.');
    await say('kwak', 'Kwak! Die muts heb ik gevonden! Ik ruil ze voor een spelletje.');
  } else await say('kwak', 'Kwak! Nog een spelletje? Kwak!');
  await say('kwak', 'Zoek telkens twee dezelfde kaartjes. Kwak!');
  const pairs = S.flags.gotHat ? 4 : 3, ks = [];
  for (let i = 0; i < pairs; i++) ks.push(i, i);
  mem = { cards: shuffle(ks).map(k => ({ k, open: false, done: false })), sel: [] };
  drawMemory();
}
const closeBtn = `<g data-tap="mapclose" transform="translate(1520,80)"><circle r="46" fill="#ff7eb9" stroke="#fff" stroke-width="8"/><path d="M-18,-18 L18,18 M18,-18 L-18,18" stroke="#fff" stroke-width="12" stroke-linecap="round"/></g>`;
function drawMemory() {
  const m = mem, n = m.cards.length, cols = n / 2, W = 250, H = 290, GP = 30, x0 = 800 - (cols * W + (cols - 1) * GP) / 2;
  let h = `<rect width="1600" height="900" fill="#dff3ff" opacity=".97"/>`;
  m.cards.forEach((c, i) => {
    const x = x0 + (i % cols) * (W + GP) + W / 2, y = 150 + Math.floor(i / cols) * (H + GP) + H / 2, up = c.open || c.done;
    h += `<g data-tap="kaartje" data-i="${i}" transform="translate(${x},${y})"><rect x="${-W / 2}" y="${-H / 2}" width="${W}" height="${H}" rx="30" fill="${up ? '#fff' : '#b48cf0'}" stroke="${c.done ? '#4cd964' : '#4b3060'}" stroke-width="${c.done ? 12 : 5}"/>
      ${up ? MEMART[c.k]() : `<path d="${starPath(60)}" fill="#fff" opacity=".55"/>`}</g>`;
  });
  mapL.innerHTML = h + closeBtn; mem = m;
}
function drawShapes() {
  const sh = shp, xs = [400, 667, 933, 1200];
  let h = `<rect width="1600" height="900" fill="#f7e6b0" opacity=".98"/><rect x="250" y="130" width="1100" height="370" rx="40" fill="#a8744a" ${ST}/><rect x="250" y="440" width="1100" height="26" fill="#ffd84a" ${ST}/>`;
  sh.order.forEach((v, i) => {
    h += `<g class="np" transform="translate(${xs[i]},300)"><path d="${SHAPES[v].d}" transform="scale(1.3)" fill="${i < sh.step ? SHAPES[v].col : '#5a3a22'}" ${ST}/></g>`;
    if (i === sh.step) h += `<g class="np" transform="translate(${xs[i]},70)"><g class="pulse"><path d="M-34,-30 H34 L0,36 Z" fill="#ffd84a" stroke="#fff" stroke-width="8" stroke-linejoin="round"/></g></g>`;
  });
  sh.bottom.forEach((v, i) => {
    if (sh.order.indexOf(v) < sh.step) return;
    h += `<g data-tap="vorm" data-v="${v}" transform="translate(${xs[i]},700)"><g class="in"><circle r="120" fill="#fff" opacity=".9" stroke="#ffb3de" stroke-width="6"/><path d="${SHAPES[v].d}" transform="scale(1.3)" fill="${SHAPES[v].col}" ${ST}/></g></g>`;
  });
  mapL.innerHTML = h + closeBtn; shp = sh;
}
const PCOLS = RB.map(c => c.col).concat(['#a8744a', '#ffffff']);
function drawPaint() {
  const P = S.paint || {};
  let h = `<rect width="1600" height="900" fill="#fbe4f1" opacity=".98"/><g transform="translate(300,50)"><rect x="-16" y="-16" width="1032" height="652" rx="22" fill="#c98f5a" ${ST}/>
    <g stroke="#4b3060" stroke-width="5" stroke-linejoin="round">${PAINT.map((p, i) => `<g data-tap="vlak" data-r="${i}" fill="${P[i] || '#ffffff'}">${p}</g>`).join('')}</g></g>`;
  PCOLS.forEach((c, i) => {
    h += `<g data-tap="kleur" data-c="${i}" transform="translate(${310 + i * 118},792)">${i === pcol ? '<circle r="64" fill="none" stroke="#4b3060" stroke-width="8"/>' : ''}<circle r="50" fill="${c}" stroke="#fff" stroke-width="7"/><circle r="50" fill="none" stroke="#4b3060" stroke-width="3"/></g>`;
  });
  h += `<g data-tap="mapclose" transform="translate(1450,792)"><g class="pulse"><circle r="62" fill="#4cd964" stroke="#fff" stroke-width="8"/><path d="M-26,2 L-8,22 L28,-20" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
  mapL.innerHTML = h;
}

/* --- heks --- */
scenes.heks = {
  left: 'meer', right: 'brug', mx: 560,
  draw() {
    let st = ''; [[150, 90], [420, 150], [700, 70], [980, 180], [1180, 60], [1520, 240], [560, 250]].forEach(([x, y], i) => st += `<g class="glow np" style="animation-delay:-${i * .3}s" transform="translate(${x},${y})"><path d="${starPath(12)}" fill="#fff6c9"/></g>`);
    const ings = Object.keys(ING).map((c, i) => potion.used[c] ? '' : `<g data-tap="ing" data-c="${c}" transform="translate(${1130 + i * 100},610)"><g class="in"><circle r="50" fill="transparent"/><g transform="scale(1.3)">${ING[c].art}</g></g></g>`).join('');
    return `<rect width="1600" height="900" fill="url(#gDusk)"/>${st}
    ${fun(1300, 150, `<circle r="80" fill="#fff6c9" stroke="#ffe680" stroke-width="5"/><circle cx="-24" cy="-16" r="14" fill="#f3e3a0"/><circle cx="26" cy="20" r="18" fill="#f3e3a0"/><circle cx="20" cy="-34" r="8" fill="#f3e3a0"/>`, { a: 'spin', snd: 'ding' })}
    <g class="np" opacity=".5">${[[620, 640, .8], [900, 620, .7], [1500, 650, .9], [30, 660, .8]].map(([x, y, s]) => `<g transform="translate(${x},${y}) scale(${s})">${artTree('#3d2a70', '#5b3d99')}</g>`).join('')}</g>
    <path class="np" d="M0,700 Q800,660 1600,700 V900 H0Z" fill="#5f9a5a"/><path class="np" d="M0,820 Q800,780 1600,830 V900 H0Z" fill="#74b06a"/>
    <g transform="translate(290,790)"><g class="np"><rect x="70" y="-420" width="46" height="110" fill="#8a5a3c" ${ST}/>
      <path d="M-160,0 L-142,-240 L150,-250 L160,0 Z" fill="#d9a877" ${ST}/><path d="M-200,-232 L-10,-430 L200,-246 Z" fill="#6b3fa0" ${ST}/>
      <path d="M-50,0 V-110 A46,46 0 0 1 42,-110 V0 Z" fill="#7a4a2a" ${ST}/><circle cx="24" cy="-70" r="7" fill="#ffd84a"/></g>
      ${fun(100, -150, `<circle r="40" fill="#ffe89a" ${ST}/><path d="M-40,0 H40 M0,-40 V40" stroke="#4b3060" stroke-width="4"/>`, { a: 'twinkle', snd: 'note', note: 6 })}
      ${fun(-90, -338, artCat, { a: 'jump', snd: 'miauw' })}</g>
    ${fun(700, 885, artPumpkin, { a: 'wiggle', snd: 'boing', s: 1.1 })}
    <g class="np" transform="translate(800,820)">${artCauldron}</g>
    ${actor('hanne', 970, 810, artHanne(), { h: 370 })}
    <g class="np"><rect x="1060" y="650" width="400" height="26" rx="8" fill="#a8744a" ${ST}/><rect x="1086" y="676" width="24" height="150" fill="#8a5a3c" ${ST}/><rect x="1410" y="676" width="24" height="150" fill="#8a5a3c" ${ST}/></g>
    ${ings}`;
  },
  hot: { hanne: { x: 580, tx: 970, act: () => potionTalk() } }
};
const askLine = () => say('hanne', T.ask(potion.step));
async function potionTalk() {
  if (S.stars.paars) return say('hanne', 'Hihihi! Mijn toverdrank is klaar. Dank je wel, Fonkel!');
  if (!potion.on) {
    await say('hanne', 'Hihihi! Dag Fonkel! Ik ben heks Hanne.');
    await say('hanne', 'Ik maak een toverdrank, maar ik ben mijn bril kwijt. Ik zie de kleuren niet goed. Help jij mij?');
    potion.on = true; potion.step = 0;
  }
  await askLine();
}

/* --- brug --- */
scenes.brug = {
  left: 'heks', get right() { return S.flags.trol ? 'wei' : null; }, mx: 300,
  draw() {
    let posts = ''; for (let x = 450; x <= 1150; x += 100) posts += `<rect x="${x - 9}" y="690" width="18" height="106" rx="6" fill="#a8744a" ${ST}/>`;
    let planks = ''; for (let x = 480; x < 1170; x += 50) planks += `M${x},792 V830 `;
    const t = S.flags.trol;
    return `<rect width="1600" height="900" fill="url(#gSky)"/>
    ${fun(1250, 140, artSun, { a: 'spin', snd: 'ding', s: .8 })}<g class="drift">${fun(300, 170, artCloud, { a: 'wiggle', snd: 'pof' })}</g>
    <path class="np" d="M0,480 Q300,380 600,460 T1100,440 T1600,470 V900 H0Z" fill="#a5e08a"/>
    <g class="np" opacity=".7"><g transform="translate(180,520) scale(.5)">${artTree('#3fae4a', '#7ed957')}</g><g transform="translate(1380,510) scale(.55)">${artTree('#3fae4a', '#7ed957')}</g></g>
    <path class="np" d="M0,560 Q800,520 1600,560 V900 H0Z" fill="#7fd36b"/>
    <path class="np" d="M720,470 L880,470 L1250,900 L350,900 Z" fill="url(#gWater)"/>
    <g class="np">${[[770, 540], [800, 640], [700, 720], [880, 740]].map(([x, y], i) => `<path class="wavel" style="animation-delay:-${i}s" d="M${x},${y} q20,-14 40,0 t40,0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>`).join('')}</g>
    ${fun(800, 600, artDuck, { a: 'wiggle', snd: 'kwak', s: .7 })}
    ${t ? actor('bram', 280, 650, artBram(), { s: .7, cls: 'happy', h: 340 }) + `<g class="np" transform="translate(340,560) scale(.7)">${artKoek}</g>` : ''}
    ${fun(1330, 700, `<rect x="-8" y="-150" width="16" height="150" fill="#a8744a" ${ST}/><path d="M-70,-190 H50 L80,-160 L50,-130 H-70 Z" fill="#ffe9a8" ${ST}/><g transform="translate(-14,-160) scale(.75)">${artKoek}</g>`, { a: 'wiggle', snd: 'knock' })}
    <g class="np">${posts}<path d="M440,700 H1160" stroke="#4b3060" stroke-width="18" stroke-linecap="round"/><path d="M440,700 H1160" stroke="#c98f5a" stroke-width="10" stroke-linecap="round"/>
      <rect x="430" y="790" width="740" height="42" rx="10" fill="#c98f5a" ${ST}/><path d="${planks}" stroke="#8a5a3c" stroke-width="4"/></g>
    ${t ? '' : actor('bram', 780, 806, artBram(), { cls: 'sad', h: 340 })}
    ${fun(900, 885, artFish, { a: 'jump', snd: 'splash', s: .8 })}
    ${fun(1400, 870, artFlower('#ffd43b'), { a: 'grow', snd: 'note', note: 1 })}${fun(1480, 885, artFlower('#ff8ad1'), { a: 'grow', snd: 'note', note: 3 })}
    <g class="flutter">${fun(1100, 380, artButterfly('#ffd43b'), { a: 'spin', snd: 'ding' })}</g>`;
  },
  hot: {
    bram: {
      x: 440, tx: 780, async act() {
        if (S.flags.trol) { face(280); return say('bram', 'Dag vriend! Mijn brug is ook jouw brug. Njam, koekjes!'); }
        if (has('koek')) {
          await say('fonkel', 'Kijk, Bram! Verse koekjes, speciaal voor jou!');
          remInv('koek');
          await fly(artKoek, 520, 600, 780, 590, { arc: 120, spin: 360 });
          sfx('yum');
          const b = $('#bram'); b.classList.remove('sad'); b.classList.add('happy');
          await say('bram', 'Koekjes! Njam njam! Dat zijn de lekkerste koekjes van heel mijn leven!');
          await say('bram', 'Jij bent mijn vriend, Fonkel. Kom maar over mijn brug!');
          sfx('whoosh');
          await tween(900, k => b.setAttribute('transform', `translate(${780 - 500 * k},${806 - 156 * k - 120 * Math.sin(Math.PI * k)}) scale(${1 - .3 * k})`));
          S.flags.trol = true; redraw(); sfx('magic');
          await say('fonkel', 'Dank je wel, Bram! Kom, we gaan over de brug!');
        } else {
          sfx('oops');
          await say('bram', 'Halt! Dit is mijn brug! Niemand mag erover!');
          await say('fonkel', 'Oei! Mag ik er alsjeblieft over, meneer de trol?');
          await say('bram', 'Hmm... Mijn buik knort zo hard. Breng mij koekjes! Dan mag je erover.');
          await say('fonkel', 'Koekjes? Misschien heeft de kok in het kasteel er wel!');
        }
      }
    }
  }
};

/* --- bloemenwei --- */
const FSIZE = [.6, .95, 1.35];
scenes.wei = {
  left: 'brug', mx: 300,
  draw() {
    let small = ''; [[80, 640, '#ff8ad1'], [420, 620, '#6fd0ff'], [640, 650, '#b48cf0'], [1000, 630, '#ff8a3c'], [1240, 650, '#ff8ad1'], [1500, 640, '#6fd0ff']].forEach(([x, y, c], i) => small += fun(x, y, artFlower(c), { a: 'grow', snd: 'note', note: i, s: .8 }));
    const bl = flw.order.map((s, i) => `<g data-tap="bloem" data-s="${s}" transform="translate(${720 + i * 210},815) scale(${FSIZE[s]})"><g class="in">${artSunflower}<rect x="-80" y="-250" width="160" height="250" fill="transparent"/></g></g>`).join('');
    return `<rect width="1600" height="900" fill="url(#gSky)"/>
    ${fun(180, 140, artSun, { a: 'spin', snd: 'ding', s: .8 })}<g class="drift">${fun(900, 150, artCloud, { a: 'wiggle', snd: 'pof' })}</g>
    <path class="np" d="M0,520 Q400,420 800,500 T1600,470 V900 H0Z" fill="#b9ec9a"/>
    <path class="np" d="M0,620 Q500,560 1000,610 T1600,600 V900 H0Z" fill="#8fdc7a"/>
    ${small}
    ${fun(260, 760, `<rect x="-70" y="-190" width="140" height="190" rx="40" fill="#fff5e6" ${ST}/><path d="M-200,-170 Q-190,-400 0,-400 Q190,-400 200,-170 Q0,-220 -200,-170 Z" fill="#ff7eb9" ${ST}/>
      <circle cx="-90" cy="-280" r="30" fill="#fff"/><circle cx="50" cy="-330" r="36" fill="#fff"/><circle cx="120" cy="-240" r="24" fill="#fff"/>
      <path d="M-30,0 V-80 A30,30 0 0 1 30,-80 V0 Z" fill="#a8744a" ${ST}/><circle cx="16" cy="-50" r="5" fill="#ffd84a"/><circle cx="0" cy="-150" r="20" fill="#ffe89a" ${ST}/>`, { a: 'wiggle', snd: 'knock' })}
    <path class="np" d="M0,790 Q800,750 1600,790 V900 H0Z" fill="#74cf62"/>
    ${S.flags.gotSchop ? '' : `<g id="schop" data-hot="schop" transform="translate(530,760)"><g transform="scale(2.4)">${artSchop}</g><circle r="90" fill="transparent"/></g>`}
    ${bl}
    ${actor('fien', 1410, 640, artFien(), { s: 1.15, h: 240, inCls: 'bobber' })}
    ${fun(1300, 880, artSnail, { a: 'wiggle', snd: 'boing' })}
    <g class="flutter">${fun(600, 330, artBee, { a: 'spin', snd: 'zoem' })}</g><g class="flutter" style="animation-delay:-4s">${fun(1100, 300, artBee, { a: 'spin', snd: 'zoem' })}</g>
    <g class="flutter" style="animation-delay:-2s">${fun(400, 440, artButterfly('#b266ff'), { a: 'spin', snd: 'ding' })}</g>`;
  },
  hot: {
    fien: { x: 300, tx: 1410, act: () => fienTalk() },
    schop: {
      x: 300, tx: 530, async act(el) {
        await say('fonkel', 'Een schopje! Mag ik dat lenen, fee Fien?');
        await say('fien', 'Natuurlijk! Daarmee kan je goed graven in het zand.');
        el.remove(); S.flags.gotSchop = true;
        await addInv('schop', 530, 760);
      }
    }
  }
};
const flowerAsk = () => flw.round % 2 === 0 ? say('fien', 'Welke bloem is de grootste? Duw erop!') : say('fien', 'Welke bloem is de kleinste? Duw erop!');
async function fienTalk() {
  if (!flw.on) {
    if (S.stars.oranje) await say('fien', 'Dag Fonkel! Kom je nog eens spelen met mijn bloemen?');
    else {
      await say('fien', 'Dag Fonkel! Ik ben fee Fien. Welkom in mijn bloemenwei!');
      await say('fien', 'Mijn zonnebloemen willen een spelletje spelen. Doe je mee?');
    }
    flw.on = true; flw.round = 0;
  }
  await flowerAsk();
}

/* --- strand --- */
const HOOP = [[760, 885], [980, 890], [1270, 888]];
scenes.strand = {
  right: 'grot', mx: 880, inR: 880,
  draw() {
    const holes = S.flags.holes || {};
    return `<rect width="1600" height="900" fill="url(#gSky)"/>
    ${fun(300, 130, artSun, { a: 'spin', snd: 'ding', s: .8 })}<g class="drift">${fun(700, 150, artCloud, { a: 'wiggle', snd: 'pof' })}</g>
    <rect class="np" y="400" width="1600" height="300" fill="url(#gWater)"/>
    <g class="np">${[[150, 450], [500, 520], [820, 560], [1300, 540], [1450, 460], [350, 590]].map(([x, y], i) => `<path class="wavel" style="animation-delay:-${i * .8}s" d="M${x},${y} q20,-14 40,0 t40,0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>`).join('')}</g>
    <g class="bobber">${fun(1080, 500, artShip, { a: 'wiggle', snd: 'flap', s: 1.1 })}</g>
    ${fun(560, 520, artFish, { a: 'jump', snd: 'splash', s: .8 })}
    <path class="np" d="M0,640 Q500,590 900,630 T1600,620 V900 H0Z" fill="#f7e6b0"/>
    <path class="np" d="M0,820 Q700,780 1600,830 V900 H0Z" fill="#f2dfa8"/>
    ${fun(200, 800, artPalm, { a: 'wiggle', snd: 'boing' })}
    <g id="kist" data-hot="kist" transform="translate(540,800) scale(1.25)"><g class="in">${artKist(S.flags.kist)}</g></g>
    ${actor('piet', 1130, 805, artPiet(), { h: 350 })}
    <g class="np"><rect x="1352" y="640" width="14" height="170" fill="#a8744a" ${ST}/><rect x="1300" y="632" width="118" height="14" rx="7" fill="#a8744a" ${ST}/></g>
    ${actor('koko', 1360, 636, artKoko, { h: 140 })}
    ${HOOP.map(([x, y], i) => `<g ${holes[i] ? 'class="np"' : `data-hot="hoop" data-i="${i}"`} transform="translate(${x},${y})">${artMound(holes[i])}</g>`).join('')}
    ${fun(380, 700, artShell, { a: 'grow', snd: 'note', note: 6, s: .8 })}`;
  },
  hot: {
    piet: {
      x: 880, tx: 1130, async act() {
        if (S.stars.roze) { sfx('coin'); burst(540, 680, 12, 110, ['#ffd84a', '#fff']); return say('piet', 'Ahoi, vriend! Kijk eens hoe mijn gouden muntjes blinken!'); }
        if (has('sleutel')) return say('piet', 'Je hebt de sleutel! Vlug, doe de schatkist open!');
        await say('piet', 'Ahoi, Fonkel! Ik ben piraat Piet. En dat is mijn papegaai Koko.');
        await say('piet', 'Ik ben de sleutel van mijn schatkist kwijt! Hij ligt ergens onder het zand, bij een rood kruisje.');
        await say('piet', 'Vind jij de sleutel? Dan krijg jij iets heel moois uit mijn schat!');
        if (!has('schop')) await say('fonkel', 'Ik wil wel graven, maar dan heb ik een schopje nodig.');
      }
    },
    koko: {
      async act() {
        sfx('kra'); wiggle($('#koko'));
        const n = S.flags.koko = ((S.flags.koko || 0) % 3) + 1;
        if (n === 1) await say('koko', 'Kraa! Dag Fonkel! Dag Fonkel!');
        else if (n === 2) await say('koko', 'Kraa! Graven bij het kruisje! Kraa!');
        else await say('koko', 'Kraa! Koko wil een koekje!');
      }
    },
    kist: {
      x: 820, tx: 540, async act(el) {
        if (S.flags.kist) { sfx('coin'); burst(540, 680, 12, 110, ['#ffd84a', '#fff']); return say('fonkel', 'Amai, zoveel gouden muntjes!'); }
        if (!has('sleutel')) { wiggle(el); sfx('knock'); return say('fonkel', 'De schatkist zit op slot. Waar is de sleutel?'); }
        if (!S.flags.slot) {
          await say('fonkel', 'Ik heb de sleutel! Klik, klak...');
          await fly(artSleutel, 700, 620, 540, 700, { arc: 60 }); sfx('knock'); S.flags.slot = true;
          await say('piet', 'Oei! Er zit ook nog een vormenslot op. Dat was ik vergeten!');
        }
        await say('piet', 'Zet elke vorm op de juiste plaats. Dan gaat de kist open!');
        const ids = Object.keys(SHAPES);
        shp = { order: shuffle(ids.slice()), bottom: shuffle(ids.slice()), step: 0 };
        drawShapes();
      }
    },
    hoop: {
      x: el => HOOP[+el.dataset.i][0] - 190, tx: 1600, async act(el) {
        const i = +el.dataset.i, [x, y] = HOOP[i];
        if (!has('schop')) { sfx('oops'); return say('fonkel', 'Het zand is te hard voor mijn hoeven. Ik heb een schopje nodig!'); }
        const g = add(fxL, `<g class="np"><g transform="scale(2)">${artSchop}</g></g>`);
        for (let k = 0; k < 3; k++) {
          await tween(260, t => g.setAttribute('transform', `translate(${x - 20},${y - 120 + 70 * t}) rotate(${-30 * t})`));
          sfx('dig'); burst(x, y - 40, 7, 80, ['#e8cf8a', '#f7e6b0', '#c9a968']);
          await tween(200, t => g.setAttribute('transform', `translate(${x - 20},${y - 50 - 70 * t}) rotate(${-30 + 30 * t})`));
        }
        g.remove();
        S.flags.holes = Object.assign({}, S.flags.holes, { [i]: 1 }); redraw();
        const n = Object.keys(S.flags.holes).length;
        if (n === 1) {
          sfx('pop');
          await fly(`<g transform="scale(1.6)">${artShell}</g>`, x, y - 10, x, y - 120, { arc: 0, ms: 500 });
          const sh = add(fxL, `<g class="np" transform="translate(${x},${y - 120}) scale(1.6)">${artShell}</g>`);
          await say('fonkel', 'Een schelp! Die is schoon. Maar het is geen sleutel.');
          sh.remove();
          await say('fonkel', 'Ik graaf verder bij een ander kruisje!');
        } else if (n === 2) {
          sfx('boing'); const c = add(fxL, `<g class="np">${artCrab}</g>`);
          await tween(400, t => c.setAttribute('transform', `translate(${x},${y - 20 - 60 * t}) scale(1.4)`));
          await say('fonkel', 'Oei, een krab! Dag krabbetje! Dat kietelt!');
          sfx('squeak');
          await tween(1400, t => c.setAttribute('transform', `translate(${x + (x > 1000 ? -1 : 1) * 500 * t},${y - 80 + 100 * t + 14 * Math.sin(t * 40)}) scale(1.4)`), t => t);
          c.remove();
          await say('fonkel', 'Nog één kruisje! Daar ligt zeker de sleutel.');
        } else {
          sfx('star'); burst(x, y - 60, 14, 120, ['#ffd84a', '#fff']);
          const s = add(fxL, `<g class="np" transform="translate(${x},${y - 110}) scale(2)"><g class="glow">${artSleutel}</g></g>`);
          await say('fonkel', 'De sleutel! Ik heb de gouden sleutel gevonden!');
          s.remove();
          await addInv('sleutel', x, y - 110);
          await say('piet', 'Goed gegraven, Fonkel! Doe nu vlug mijn schatkist open!');
        }
      }
    }
  }
};

/* ---------- taps (instant actions) ---------- */
const taps = {
  async start() {
    started = true;
    if (!S.flags.intro) newGame();
    if (S.scene === 'wolken' || !scenes[S.scene] || S.scene === 'titel') S.scene = 'grot';
    sfx('magic'); await fadeTo(1);
    hero.x = scenes[S.scene].mx || 700; hero.dir = 1; render(); await fadeTo(0);
    await enterScene();
  },
  async reset() { newGame(); save(); await taps.start(); },
  async again() { newGame(); save(); started = false; await fadeTo(1); showTitle(); await fadeTo(0); },
  async inv(el) { sfx('pop'); await say('fonkel', ITEMT[el.dataset.it]); },
  mapclose() { closeMap(); },
  async travel(el) {
    const to = el.dataset.to; closeMap();
    if (to === S.scene) return;
    shout(T.naar(to)); sfx('whoosh'); await fadeTo(1);
    S.scene = to; hero.x = scenes[to].mx || 700; hero.dir = 1; render();
    await fadeTo(0); await enterScene();
  },
  async bel(el) {
    const b = bub.list.find(o => o.el === el); if (!b) return;
    const x = b.x, y = b.y; el.remove(); bub.list.splice(bub.list.indexOf(b), 1);
    sfx('pop'); burst(x, y, 8, 70, ['#fff', '#bfeaff']);
    if (S.stars.blauw || bub.star) return;
    bub.n++; floatText(x, y, bub.n, '#4aa8ff'); shout(T.tel(bub.n - 1));
    if (bub.n >= 5) {
      bub.star = { x: 800, y: 740, r: 86, v: .045, ph: 0, el: add(fxL, `<g data-tap="sterbel"><circle r="86" fill="#fff" fill-opacity=".35" stroke="#fff" stroke-width="6"/><g class="glow">${starArt('#4aa8ff', 50)}</g></g>`) };
      await wait(900);
      await say('marie', 'Kijk! Daar is de grote bel met de ster! Prik ze vlug kapot!');
    }
  },
  async sterbel(el) {
    const b = bub.star; if (!b) return;
    const x = b.x, y = b.y; el.remove(); bub.star = null; bub.on = false;
    bub.list.forEach(o => o.el.remove()); bub.list = [];
    sfx('pop'); burst(x, y, 14, 120, ['#fff', '#4aa8ff']);
    await giveStar('blauw', x, y);
    await say('marie', 'Goed gedaan! Jij bent een echte bellenprikker!');
  },
  async ing(el) {
    const c = el.dataset.c;
    if (S.stars.paars) { wiggle(el); sfx('pop'); return say('hanne', T.zin(c)); }
    if (!potion.on) return potionTalk();
    const want = ASK[potion.step];
    if (c !== want) { wiggle(el); sfx('oops'); return say('hanne', T.nee(c, want)); }
    sfx('ding');
    const m = /translate\(([\d.]+),([\d.]+)\)/.exec(el.getAttribute('transform')), x0 = +m[1], y0 = +m[2];
    el.classList.add('np');
    await tween(700, k => el.setAttribute('transform', `translate(${x0 + (800 - x0) * k},${y0 + (690 - y0) * k - 200 * Math.sin(Math.PI * k)}) rotate(${360 * k}) scale(${1 - .4 * k})`));
    const col = RB.find(r => r.id === c).col;
    el.remove(); potion.used[c] = true; sfx('splash'); burst(800, 690, 10, 90, [col, '#fff']);
    $('#potion').setAttribute('fill', col);
    await say('hanne', T.ja(c));
    potion.step++;
    if (potion.step < ASK.length) return askLine();
    await say('hanne', 'Hokus pokus pilatus pas!');
    sfx('magic'); $('#potion').setAttribute('fill', '#b266ff');
    for (let i = 0; i < 3; i++) { burst(800, 680, 16, 200); await wait(300); }
    await say('hanne', 'Kijk! Er komt een paarse ster uit mijn toverdrank! Die is voor jou.');
    potion = { on: false, step: 0, used: {} };
    await giveStar('paars', 800, 640);
    redraw();
  },
  async zwam(el) {
    if (!simon.on) return;
    const i = +el.dataset.i; zwamPlay(i);
    if (i !== simon.seq[simon.pos]) { await wait(500); sfx('oops'); await say('pim', 'Oei, bijna! Luister nog eens goed.'); return simonDemo(false); }
    if (++simon.pos < simon.seq.length) return;
    await wait(700); simon.round++;
    if (simon.round < 2) { sfx('ding'); await say('pim', 'Knap gedaan! Nu een langer liedje. Luister goed!'); return simonDemo(true); }
    simon.on = false; sfx('magic'); redraw();
    await say('pim', 'Bravo! Kijk, daar komt de groene ster uit de paddenstoel!');
    await giveStar('groen', ZWAM[i][0], ZWAM[i][1] - 110);
  },
  async kaartje(el) {
    if (!mem) return;
    const c = mem.cards[+el.dataset.i]; if (c.open || c.done) return;
    c.open = true; sfx('pop'); mem.sel.push(c); drawMemory();
    if (mem.sel.length < 2) return;
    const [a, b] = mem.sel; mem.sel = [];
    await wait(800); if (!mem) return;
    if (a.k !== b.k) { a.open = b.open = false; sfx('pof'); return drawMemory(); }
    a.done = b.done = true; sfx('ding'); drawMemory();
    if (!mem.cards.every(k => k.done)) return;
    sfx('star'); await wait(1000); closeMap();
    if (S.flags.gotHat) return say('kwak', 'Kwak! Goed gespeeld! Kwak!');
    await say('kwak', 'Kwak! Wat ben jij slim! Hier is de muts.');
    const m = $('#muts'); if (m) m.remove(); S.flags.gotHat = true;
    await addInv('muts', 566, 628);
  },
  async vorm(el) {
    if (!shp) return;
    const v = el.dataset.v;
    if (v !== shp.order[shp.step]) { wiggle(el); sfx('oops'); return say('piet', T.vormNee(v)); }
    sfx('ding'); burst([400, 667, 933, 1200][shp.step], 300, 12, 110, [SHAPES[v].col, '#fff']); shp.step++; drawShapes();
    const last = shp.step >= 4;
    await say('piet', T.vormJa(v));
    if (!last) return;
    closeMap(); remInv('sleutel'); sfx('magic'); S.flags.kist = true; redraw();
    for (let i = 0; i < 3; i++) { burst(540, 680, 14, 150, ['#ffd84a', '#fff', '#ffe89a']); sfx('coin'); await wait(300); }
    await say('piet', 'Hoera! Mijn schat is open! Dank je wel, Fonkel!');
    await say('piet', 'Kijk, tussen de gouden muntjes ligt een roze ster. Die is voor jou!');
    await giveStar('roze', 540, 660);
  },
  async verf() {
    if (!S.flags.verf) {
      S.flags.verf = 1;
      await say('lotte', 'Dat is mijn schildersezel. Kleur jij een mooie tekening voor mij?');
      await say('lotte', 'Kies eerst een kleur. En duw dan op de tekening!');
    }
    drawPaint();
  },
  kleur(el) { pcol = +el.dataset.c; sfx('pop'); if (pcol < NS) shout(T.kleur(RB[pcol]), 'lotte'); drawPaint(); },
  vlak(el) { S.paint = Object.assign({}, S.paint, { [el.dataset.r]: PCOLS[pcol] }); sfx('note', pcol); drawPaint(); },
  async ei(el) { await bakeTap(el, 0, artEgg); },
  async bes(el) { await bakeTap(el, 1, `<g transform="scale(.8)">${ING.rood.art}</g>`); },
  async bloem(el) {
    if (!flw.on) return fienTalk();
    const s = +el.dataset.s, want = flw.round % 2 === 0 ? 2 : 0;
    if (s !== want) { wiggle(el); sfx('oops'); await say('fien', 'Oei, bijna! Kijk nog eens goed.'); return flowerAsk(); }
    const inn = el.querySelector('.in'); inn.classList.add('a-grow'); setTimeout(() => inn.classList.remove('a-grow'), 800);
    const x = 720 + flw.order.indexOf(s) * 210;
    sfx('ding'); burst(x, 815 - 180 * FSIZE[s], 12, 110, ['#ffd43b', '#fff', '#ff9a3c']);
    if (want === 2) await say('fien', 'Ja! Dat is de grootste bloem. Knap gezien!');
    else await say('fien', 'Ja! Dat is de kleinste bloem. Flink zo!');
    flw.round++;
    if (flw.round < 3) {
      const o = flw.order; flw.order = flw.round === 1 ? [o[2], o[0], o[1]] : [o[1], o[2], o[0]];
      sfx('magic'); redraw();
      return flowerAsk();
    }
    flw.on = false; flw.round = 0;
    if (S.stars.oranje) return say('fien', 'Goed gespeeld! Mijn bloemen zijn heel blij.');
    await say('fien', 'Je hebt gewonnen! Kijk, in de grootste bloem zat een oranje ster verstopt. Ze is voor jou!');
    await giveStar('oranje', x, 815 - 180 * FSIZE[s]);
  }
};
async function bakeTap(el, phase, art) {
  if (!bake.on) return kamielTalk();
  if (bake.phase !== phase) { sfx('oops'); return phase === 0 ? say('kamiel', 'Stop! Genoeg eieren. Nu de aardbeien!') : say('kamiel', 'Wacht even! Eerst de eieren.'); }
  const m = /translate\(([\d.]+),([\d.]+)\)/.exec(el.getAttribute('transform'));
  el.remove(); sfx('pop');
  await fly(art, +m[1], +m[2], 830, 550, { arc: 130, spin: 360, ms: 500 });
  sfx('splash'); bake.n++;
  floatText(830, 520, bake.n, phase ? '#ff4d5e' : '#ffd43b'); shout(T.tel(bake.n - 1));
  await wait(900);
  if (phase === 0 && bake.n >= 3) {
    bake.phase = 1; bake.n = 0;
    await say('kamiel', 'Drie eieren! Goed geteld!');
    await say('kamiel', 'Doe twee aardbeien in de kom! Duw maar op de aardbeien.');
  } else if (phase === 1 && bake.n >= 2) {
    bake.on = false;
    await say('kamiel', 'Twee aardbeien! Flink zo!');
    await say('kamiel', 'Roeren, roeren, roeren... en hop, in de oven!');
    const kom = $('#kom'); sfx('whoosh');
    await tween(800, k => kom.setAttribute('transform', `translate(${830 + 605 * k},${612 + 60 * k - 150 * Math.sin(Math.PI * k)}) scale(${1 - .5 * k})`));
    kom.remove(); $('#ovenwin').setAttribute('fill', '#ff9a3c');
    for (let i = 0; i < 3; i++) { sfx('note', i * 2); await wait(550); }
    sfx('ding'); burst(1435, 610, 14, 130, ['#ffd84a', '#fff', '#ff9a3c']);
    await say('kamiel', 'Ting! De koekjes zijn klaar! Mmm, wat ruikt dat lekker.');
    S.flags.baked = true;
    await addInv('koek', 1435, 610);
    await say('kamiel', 'Hier, een zak koekjes voor jou. Deel ze maar uit!');
    redraw();
  }
}

/* ---------- hints ---------- */
async function hint() {
  const f = S.flags, st = S.stars;
  if (S.scene === 'heks' && potion.on) return askLine();
  if (S.scene === 'wei' && flw.on) return flowerAsk();
  if (S.scene === 'bos' && simon.on) { await say('pim', 'Luister goed naar hun liedje. En speel het dan na!'); return simonDemo(false); }
  let k;
  if (f.done) k = 'feest';
  else if (S.scene === 'meer' && bub.on) k = 'bellen';
  else if (S.scene === 'keuken' && bake.on) k = 'bakken';
  else if (S.scene === 'bos' && catchG.on) k = 'mand';
  else if (nStars() === NS) k = 'alle';
  else if (!st.rood && f.fed) k = 'roodligt';
  else if (!f.fed && has('appel')) k = 'appel';
  else if (!st.groen && has('muts')) k = 'muts';
  else if (has('koek') && !f.trol) k = 'koek';
  else if (has('sleutel')) k = 'sleutel';
  else if (!f.fed) k = 'honger';
  else if (!st.geel) k = 'vliegen';
  else if (!st.groen) k = f.pimhat ? 'liedje' : 'pim';
  else if (!st.blauw) k = 'marie';
  else if (!st.paars) k = 'hanne';
  else if (!f.trol) k = 'kok';
  else if (!st.oranje) k = 'fee';
  else if (!f.gotSchop) k = 'schopzoek';
  else if (S.scene === 'strand') k = 'graven';
  else k = f.seen_strand ? 'strandga' : 'piraat';
  await say('fonkel', HINT[k]);
}

/* ---------- engine ---------- */
function redraw() { actors = {}; const sc = scenes[S.scene]; sceneL.innerHTML = sc.draw() + (sc.left ? arrow('l', sc.left) : '') + (sc.right ? arrow('r', sc.right) : ''); drawHUD(); }
function render() {
  resetMini(); fxL.innerHTML = ''; closeMap();
  redraw();
  heroL.style.display = S.scene === 'wolken' ? 'none' : '';
  drawHero();
}
function showTitle() { started = false; actors = {}; fxL.innerHTML = ''; heroL.innerHTML = ''; closeMap(); sceneL.innerHTML = scenes.titel.draw(); drawHUD(); }
async function enterScene() {
  const k = 'seen_' + S.scene, was = S.flags[k];
  S.flags[k] = 1;
  if (!was && FIRST[S.scene]) await say('fonkel', FIRST[S.scene]);
  if (scenes[S.scene].enter) await scenes[S.scene].enter();
}
async function go(target, dir) {
  const from = S.scene, door = dir === 'u' || from === 'keuken';
  shout(T.naar(target));
  if (dir === 'u') await walkTo(800); else await walkTo(dir === 'l' ? -160 : 1760, true);
  sfx('whoosh'); await fadeTo(1);
  S.scene = target;
  const sc = scenes[target];
  hero.x = dir === 'u' ? 300 : from === 'keuken' ? 800 : dir === 'l' ? 1760 : -160;
  if (door) hero.dir = 1;
  render();
  const f = fadeTo(0);
  if (!door) await walkTo(dir === 'l' ? (sc.inR || 1330) : (sc.inL || 270), true);
  await f;
  await enterScene();
}
async function run(f) {
  if (busy) return;
  busy = true;
  try { await f(); } catch (err) { console.error(err); }
  busy = false; idleT = 0; save();
}
function runSoon(f) { const t = setInterval(() => { if (!busy) { clearInterval(t); run(f); } }, 50); }
function doFun(g) {
  const inn = g.querySelector('.in') || g, a = 'a-' + g.dataset.fun;
  sfx(g.dataset.snd, +g.dataset.note || 0);
  inn.classList.remove(a); void inn.getBoundingClientRect(); inn.classList.add(a);
  clearTimeout(inn._t); inn._t = setTimeout(() => inn.classList.remove(a), 900);
  if (g.classList.contains('owl')) { g.classList.add('on'); clearTimeout(g._t); g._t = setTimeout(() => g.classList.remove('on'), 3500); }
}
function toStage(e) { const r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }; }
svg.addEventListener('pointermove', e => { pointer = toStage(e); });
svg.addEventListener('pointerdown', e => {
  e.preventDefault(); audioInit(); idleT = 0;
  const p = toStage(e); pointer = p;
  const t = e.target.closest('[data-ui],[data-fun],[data-tap],[data-hot],[data-go]');
  if (t && t.dataset.ui) return ui(t.dataset.ui);
  if (t && t.dataset.fun) return doFun(t);
  if (skipLine) return skipLine();
  if (busy || catchG.on) return;
  if (!t) { if (mapL.firstChild) return; if (started && S.scene !== 'wolken' && p.y > 640) run(() => walkTo(p.x)); return; }
  if (t.dataset.tap) return run(() => taps[t.dataset.tap](t, p));
  if (!started) return;
  if (t.dataset.go) return run(() => go(t.dataset.go, t.dataset.dir));
  const h = t.dataset.hot === 'fonkel' ? { act: hint } : scenes[S.scene].hot && scenes[S.scene].hot[t.dataset.hot];
  if (h) run(async () => {
    const x = typeof h.x === 'function' ? h.x(t) : h.x;
    if (x != null) await walkTo(x);
    if (h.tx != null) face(h.tx);
    await h.act(t);
  });
});
document.addEventListener('contextmenu', e => e.preventDefault());

let last = performance.now();
function loop(t) {
  const dt = Math.min(60, t - last); last = t;
  if (started) {
    const sc = scenes[S.scene];
    if (sc && sc.tick) sc.tick(dt);
    idleT += dt;
    if (!FAST && !busy && !mapL.firstChild && idleT > 40000 && S.scene !== 'wolken' && !S.flags.done) { idleT = 0; run(hint); }
  }
  requestAnimationFrame(loop);
}
function fit() {
  scale = Math.min(innerWidth / 1600, innerHeight / 900);
  stage.style.transform = `translate(${(innerWidth - 1600 * scale) / 2}px,${(innerHeight - 900 * scale) / 2}px) scale(${scale})`;
}
addEventListener('resize', fit); fit();
showTitle();
requestAnimationFrame(loop);
window.G = { get S() { return S; }, scenes, hero, get busy() { return busy; }, get flight() { return flight; }, get bub() { return bub; }, get potion() { return potion; }, get flw() { return flw; }, get bake() { return bake; }, get catchG() { return catchG; }, get simon() { return simon; }, get mem() { return mem; }, get shp() { return shp; } };
