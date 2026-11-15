'use strict';
/* ---------- art ---------- */
const ST = 'stroke="#4b3060" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';
const SKIN = '#ffd9b8';
function starPath(r, r2 = r * .5) {
  let p = '';
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r2 : r; p += (i ? 'L' : 'M') + (rr * Math.cos(a)).toFixed(1) + ',' + (rr * Math.sin(a)).toFixed(1); }
  return p + 'Z';
}
function starArt(col, r = 50) {
  const e = r * .12;
  return `<path d="${starPath(r)}" fill="${col}" stroke="#fff" stroke-width="${r * .14}" stroke-linejoin="round"/>
  <circle cx="${-r * .2}" cy="${-r * .05}" r="${e}" fill="#4b3060"/><circle cx="${r * .2}" cy="${-r * .05}" r="${e}" fill="#4b3060"/>
  <path d="M${-r * .18},${r * .18} Q0,${r * .38} ${r * .18},${r * .18}" fill="none" stroke="#4b3060" stroke-width="${r * .08}" stroke-linecap="round"/>`;
}
const leg = (x, f, c) => `<g class="leg ${c}"><rect x="${x}" y="-95" width="30" height="95" rx="13" fill="${f}" ${ST}/><path d="M${x},-22 h30 v10 a12,12 0 0 1 -12,12 h-6 a12,12 0 0 1 -12,-12 z" fill="#ff9ed8" ${ST}/></g>`;

function artUnicorn() {
  return `
  <g class="tail"><path d="M-84,-150 C-165,-175 -195,-75 -158,-18 C-146,-62 -124,-84 -86,-104 Z" fill="#ff8ad1" ${ST}/>
    <path d="M-98,-140 C-150,-140 -164,-86 -152,-48" fill="none" stroke="#9b7bff" stroke-width="9" stroke-linecap="round"/>
    <path d="M-96,-124 C-132,-116 -142,-84 -138,-62" fill="none" stroke="#6fd0ff" stroke-width="8" stroke-linecap="round"/></g>
  ${leg(-56, '#e2d6f0', 'lb')}${leg(46, '#e2d6f0', 'la')}
  <path d="M28,-150 C55,-200 68,-236 78,-266 L142,-226 C124,-196 106,-160 90,-124 Z" fill="#fff" ${ST}/>
  <ellipse cx="0" cy="-120" rx="98" ry="62" fill="#fff" ${ST}/>
  <path d="M28,-150 C55,-200 68,-236 78,-266 L142,-226 C124,-196 106,-160 90,-124 Z" fill="#fff"/><ellipse cx="0" cy="-120" rx="96" ry="60" fill="#fff"/>
  ${leg(-88, '#fff', 'la')}${leg(14, '#fff', 'lb')}
  <g class="head">
    <path d="M100,-296 C56,-306 34,-274 48,-244 C22,-226 26,-190 44,-170 C40,-150 52,-140 62,-146 C62,-186 78,-234 104,-266 Z" fill="#ff8ad1" ${ST}/>
    <path d="M84,-282 C58,-274 50,-250 58,-232" fill="none" stroke="#9b7bff" stroke-width="9" stroke-linecap="round"/>
    <path d="M62,-226 C44,-212 44,-190 54,-176" fill="none" stroke="#6fd0ff" stroke-width="8" stroke-linecap="round"/>
    <path d="M86,-278 L76,-318 L108,-288 Z" fill="#fff" ${ST}/>
    <path d="M112,-284 L140,-366 L138,-280 Z" fill="#ffd84a" ${ST}/>
    <path d="M120,-306 l15,6 M126,-326 l11,5" stroke="#f0a020" stroke-width="4" stroke-linecap="round"/>
    <ellipse cx="116" cy="-244" rx="50" ry="42" fill="#fff" ${ST}/>
    <ellipse cx="152" cy="-226" rx="37" ry="29" fill="#fff" ${ST}/>
    <ellipse cx="116" cy="-244" rx="48" ry="40" fill="#fff"/><ellipse cx="152" cy="-226" rx="35" ry="27" fill="#fff"/>
    <path d="M104,-284 C120,-292 132,-280 128,-268 C118,-272 110,-274 100,-270 Z" fill="#ff8ad1" ${ST}/>
    <ellipse cx="116" cy="-246" rx="11" ry="14" fill="#3b2a4a"/><circle cx="120" cy="-251" r="4.5" fill="#fff"/>
    <circle cx="138" cy="-222" r="10" fill="#ffb3d1" opacity=".7"/>
    <circle cx="172" cy="-230" r="4" fill="#4b3060"/>
    <path d="M146,-208 Q160,-198 174,-210" fill="none" ${ST}/>
  </g>`;
}
function artLotte() {
  return `
  <path d="M-52,-120 C-72,-200 -50,-240 0,-240 C50,-240 72,-200 52,-120 Z" fill="#8a4b2a" ${ST}/>
  <g class="wave-arm"><path d="M24,-142 L62,-178" stroke="${SKIN}" stroke-width="15" stroke-linecap="round"/><circle cx="64" cy="-180" r="11" fill="${SKIN}" ${ST}/></g>
  <path d="M-24,-142 L-54,-100" stroke="${SKIN}" stroke-width="15" stroke-linecap="round"/><circle cx="-56" cy="-98" r="11" fill="${SKIN}" ${ST}/>
  <path d="M-78,0 Q-66,-90 -28,-152 L28,-152 Q66,-90 78,0 Z" fill="#ff7eb9" ${ST}/>
  <path d="M-78,0 Q-76,-14 -73,-26 Q0,-6 73,-26 Q76,-14 78,0 Z" fill="#ffd1e8" ${ST}/>
  <path d="M-28,-152 Q0,-128 28,-152" fill="none" stroke="#ffd84a" stroke-width="7" stroke-linecap="round"/>
  <circle cx="0" cy="-104" r="7" fill="#ffd84a"/><circle cx="0" cy="-74" r="7" fill="#ffd84a"/>
  <circle cx="0" cy="-188" r="40" fill="${SKIN}" ${ST}/>
  <path d="M-40,-192 C-36,-226 -8,-232 2,-224 C14,-232 38,-224 40,-192 C24,-204 8,-212 0,-212 C-10,-208 -26,-200 -40,-192 Z" fill="#8a4b2a" ${ST}/>
  <path d="M-28,-222 L-30,-258 L-14,-240 L0,-264 L14,-240 L30,-258 L28,-222 Z" fill="#ffd84a" ${ST}/>
  <circle cx="0" cy="-246" r="5" fill="#ff4d5e"/>
  <circle cx="-14" cy="-186" r="5" fill="#3b2a4a"/><circle cx="14" cy="-186" r="5" fill="#3b2a4a"/>
  <circle cx="-24" cy="-174" r="7" fill="#ff9ebb" opacity=".7"/><circle cx="24" cy="-174" r="7" fill="#ff9ebb" opacity=".7"/>
  <path d="M-12,-170 Q0,-158 12,-170" fill="none" ${ST}/>`;
}
function artDragon() {
  return `
  <g class="wing"><path d="M-50,-190 C-130,-300 -200,-250 -214,-176 C-184,-198 -164,-190 -152,-166 C-136,-186 -116,-180 -106,-154 C-94,-172 -76,-170 -62,-150 Z" fill="#b48cf0" ${ST}/></g>
  <path d="M-60,-50 C-170,-10 -220,-70 -186,-130 C-170,-88 -136,-80 -76,-104 Z" fill="#6fd36f" ${ST}/>
  <path d="M-188,-128 l-26,-30 l40,6 z" fill="#ff9f43" ${ST}/>
  <path d="M-84,-170 l-30,-12 l22,28 z M-92,-120 l-32,-4 l26,24 z M-70,-214 l-26,-18 l14,32 z" fill="#ff9f43" ${ST}/>
  <ellipse cx="0" cy="-108" rx="94" ry="106" fill="#6fd36f" ${ST}/>
  <ellipse cx="20" cy="-94" rx="58" ry="80" fill="#ffeaa0" ${ST}/>
  <path d="M-22,-130 Q20,-116 62,-130 M-30,-98 Q20,-84 72,-98 M-26,-64 Q20,-50 68,-64" fill="none" stroke="#f0c860" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="-38" cy="-12" rx="42" ry="19" fill="#58bd58" ${ST}/><ellipse cx="58" cy="-12" rx="42" ry="19" fill="#58bd58" ${ST}/>
  <ellipse cx="78" cy="-128" rx="14" ry="32" transform="rotate(-42 78 -128)" fill="#6fd36f" ${ST}/>
  <ellipse cx="-58" cy="-128" rx="14" ry="32" transform="rotate(30 -58 -128)" fill="#6fd36f" ${ST}/>
  <g class="head">
    <path d="M-22,-296 l-6,-42 l30,30 z M36,-304 l10,-40 l18,36 z" fill="#ffd84a" ${ST}/>
    <ellipse cx="24" cy="-244" rx="84" ry="68" fill="#6fd36f" ${ST}/>
    <ellipse cx="88" cy="-220" rx="52" ry="40" fill="#8be58b" ${ST}/>
    <circle cx="108" cy="-238" r="5" fill="#2f7d3a"/><circle cx="124" cy="-232" r="5" fill="#2f7d3a"/>
    <ellipse cx="2" cy="-266" rx="21" ry="25" fill="#fff" ${ST}/><circle cx="8" cy="-262" r="11" fill="#3b2a4a"/><circle cx="12" cy="-267" r="4" fill="#fff"/>
    <ellipse cx="50" cy="-272" rx="19" ry="23" fill="#fff" ${ST}/><circle cx="55" cy="-268" r="10" fill="#3b2a4a"/><circle cx="59" cy="-273" r="4" fill="#fff"/>
    <circle cx="-22" cy="-226" r="12" fill="#ffc2d4" opacity=".9"/>
    <path class="m-happy" d="M58,-204 Q94,-176 128,-208" fill="none" ${ST}/>
    <path class="m-sad" d="M64,-192 Q94,-212 124,-196" fill="none" ${ST}/>
    <path class="tear" d="M-6,-236 q-10,18 0,26 q10,-8 0,-26" fill="#7fd4ff" stroke="#fff" stroke-width="2"/>
  </g>
  <g class="fire np" style="display:none"><path class="flame" d="M134,-212 C220,-280 340,-230 520,-120 C380,-150 250,-130 134,-196 Z" fill="#ff8a2a"/>
    <path class="flame" d="M140,-208 C220,-250 320,-214 440,-150 C340,-166 240,-158 140,-198 Z" fill="#ffd84a"/></g>`;
}
function artPim(hat) {
  return `
  <ellipse cx="-20" cy="-8" rx="22" ry="11" fill="#7a4a2a" ${ST}/><ellipse cx="20" cy="-8" rx="22" ry="11" fill="#7a4a2a" ${ST}/>
  <path d="M-40,-12 Q-48,-86 0,-96 Q48,-86 40,-12 Z" fill="#4a90e2" ${ST}/>
  <rect x="-41" y="-46" width="82" height="12" fill="#7a4a2a" ${ST}/><rect x="-9" y="-49" width="18" height="18" rx="3" fill="#ffd84a" ${ST}/>
  <ellipse cx="-44" cy="-66" rx="11" ry="24" transform="rotate(20 -44 -66)" fill="#4a90e2" ${ST}/>
  <ellipse cx="44" cy="-66" rx="11" ry="24" transform="rotate(-20 44 -66)" fill="#4a90e2" ${ST}/>
  <circle cx="-36" cy="-118" r="9" fill="${SKIN}" ${ST}/><circle cx="36" cy="-118" r="9" fill="${SKIN}" ${ST}/>
  <circle cx="0" cy="-118" r="35" fill="${SKIN}" ${ST}/>
  <path d="M-35,-114 Q-42,-52 0,-40 Q42,-52 35,-114 Q18,-92 0,-98 Q-18,-92 -35,-114 Z" fill="#fff" ${ST}/>
  <circle cx="0" cy="-110" r="11" fill="#ffb59a" ${ST}/>
  <circle cx="-14" cy="-128" r="4.5" fill="#3b2a4a"/><circle cx="14" cy="-128" r="4.5" fill="#3b2a4a"/>
  ${hat ? `<path d="M-40,-140 Q0,-156 40,-140 L7,-226 Q0,-234 -7,-226 Z" fill="#e8413c" ${ST}/><path d="M-10,-84 Q0,-74 10,-84" fill="none" ${ST}/>`
      : `<path d="M-12,-152 q-4,-16 4,-20 M2,-153 q2,-18 10,-18" fill="none" ${ST}/><path d="M-10,-78 Q0,-88 10,-78" fill="none" ${ST}/><path d="M-22,-116 q-8,14 0,20 q8,-6 0,-20" fill="#7fd4ff"/>`}`;
}
function artMarie() {
  return `
  <path d="M-52,-140 C-78,-60 -66,-20 -56,6 L56,6 C66,-20 78,-60 52,-140 Z" fill="#8e5bd9" ${ST}/>
  <g class="wave-arm"><path d="M24,-62 L64,-104" stroke="${SKIN}" stroke-width="14" stroke-linecap="round"/><circle cx="66" cy="-106" r="10" fill="${SKIN}" ${ST}/></g>
  <path d="M-24,-62 L-44,-14" stroke="${SKIN}" stroke-width="14" stroke-linecap="round"/>
  <path d="M-28,6 L-25,-70 Q0,-80 25,-70 L28,6 Z" fill="${SKIN}" ${ST}/>
  <circle cx="-12" cy="-44" r="13" fill="#ff9fb8" ${ST}/><circle cx="12" cy="-44" r="13" fill="#ff9fb8" ${ST}/>
  <circle cx="0" cy="-112" r="39" fill="${SKIN}" ${ST}/>
  <path d="M-40,-112 C-44,-156 -10,-160 0,-148 C12,-162 44,-152 40,-112 C28,-130 12,-136 0,-134 C-14,-136 -28,-128 -40,-112 Z" fill="#8e5bd9" ${ST}/>
  <g transform="translate(28,-142)"><path d="${starPath(14)}" fill="#ffd84a" ${ST}/></g>
  <circle cx="-14" cy="-108" r="5" fill="#3b2a4a"/><circle cx="14" cy="-108" r="5" fill="#3b2a4a"/>
  <circle cx="-24" cy="-96" r="7" fill="#ff9ebb" opacity=".7"/><circle cx="24" cy="-96" r="7" fill="#ff9ebb" opacity=".7"/>
  <path d="M-12,-92 Q0,-80 12,-92" fill="none" ${ST}/>
  <g transform="translate(130,4)" class="bobber"><path d="M0,0 C-8,-40 8,-64 -4,-90 C30,-84 40,-56 32,-34 C52,-52 76,-46 86,-22 C58,-18 34,-6 22,0 Z" fill="#ff9fb8" ${ST}/></g>
  <ellipse cx="0" cy="6" rx="80" ry="13" fill="#fff" opacity=".55"/><ellipse cx="140" cy="6" rx="46" ry="9" fill="#fff" opacity=".55"/>`;
}
function artHanne() {
  return `
  <rect x="-22" y="-44" width="14" height="40" fill="#fff" ${ST}/><rect x="8" y="-44" width="14" height="40" fill="#fff" ${ST}/>
  <path d="M-22,-30 h14 M-22,-16 h14 M8,-30 h14 M8,-16 h14" stroke="#ff8a3c" stroke-width="6"/>
  <ellipse cx="-22" cy="-5" rx="22" ry="10" fill="#4b2f80" ${ST}/><ellipse cx="22" cy="-5" rx="22" ry="10" fill="#4b2f80" ${ST}/>
  <g class="wave-arm"><path d="M24,-166 L66,-196" stroke="#7b4bc4" stroke-width="16" stroke-linecap="round"/><circle cx="70" cy="-198" r="11" fill="${SKIN}" ${ST}/>
    <path d="M70,-198 L104,-250" stroke="#7a4a2a" stroke-width="6" stroke-linecap="round"/><g transform="translate(106,-254)"><path d="${starPath(16)}" fill="#ffd84a" ${ST}/></g></g>
  <path d="M-24,-166 L-58,-122" stroke="#7b4bc4" stroke-width="16" stroke-linecap="round"/><circle cx="-60" cy="-118" r="11" fill="${SKIN}" ${ST}/>
  <path d="M-68,-38 Q-54,-124 -27,-180 L27,-180 Q54,-124 68,-38 Z" fill="#7b4bc4" ${ST}/>
  <g transform="translate(-14,-84)"><path d="${starPath(13)}" fill="#ffd84a"/></g><circle cx="24" cy="-114" r="8" fill="#ff8ad1"/><circle cx="16" cy="-58" r="6" fill="#6fd0ff"/>
  <circle cx="-44" cy="-204" r="19" fill="#ff8a3c" ${ST}/><circle cx="44" cy="-204" r="19" fill="#ff8a3c" ${ST}/>
  <circle cx="-50" cy="-178" r="16" fill="#ff8a3c" ${ST}/><circle cx="50" cy="-178" r="16" fill="#ff8a3c" ${ST}/>
  <circle cx="0" cy="-214" r="41" fill="${SKIN}" ${ST}/>
  <ellipse cx="0" cy="-248" rx="74" ry="14" fill="#4b2f80" ${ST}/>
  <path d="M-42,-250 Q-10,-330 34,-356 Q22,-310 42,-250 Z" fill="#4b2f80" ${ST}/>
  <path d="M-39,-258 Q0,-244 40,-258 L37,-274 Q0,-262 -34,-274 Z" fill="#ffd84a" ${ST}/>
  <circle cx="-15" cy="-218" r="5" fill="#3b2a4a"/><circle cx="15" cy="-218" r="5" fill="#3b2a4a"/>
  <ellipse cx="0" cy="-206" rx="9" ry="11" fill="#ffb59a" ${ST}/>
  <circle cx="-26" cy="-200" r="8" fill="#ff9ebb" opacity=".7"/><circle cx="26" cy="-200" r="8" fill="#ff9ebb" opacity=".7"/>
  <path d="M-16,-192 Q0,-174 16,-192 Z" fill="#fff" ${ST}/>`;
}
const artCloud = `<ellipse cx="0" cy="8" rx="78" ry="34" fill="#fff"/><circle cx="-44" cy="0" r="36" fill="#fff"/><circle cx="44" cy="2" r="38" fill="#fff"/><circle cx="2" cy="-26" r="42" fill="#fff"/>`;
const artSun = `<g class="rays">${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M-12,-78 L0,-112 L12,-78 Z" fill="#ffc107" transform="rotate(${a})"/>`).join('')}</g>
  <circle r="66" fill="#ffd84a" stroke="#ffb300" stroke-width="5"/><circle cx="-22" cy="-10" r="7" fill="#4b3060"/><circle cx="22" cy="-10" r="7" fill="#4b3060"/>
  <path d="M-24,16 Q0,40 24,16" fill="none" ${ST}/><circle cx="-38" cy="14" r="10" fill="#ff9ebb" opacity=".6"/><circle cx="38" cy="14" r="10" fill="#ff9ebb" opacity=".6"/>`;
const artFlower = (c) => `<path d="M0,0 Q-6,-30 0,-60" fill="none" stroke="#3fae4a" stroke-width="7" stroke-linecap="round"/><ellipse cx="14" cy="-22" rx="14" ry="7" fill="#3fae4a" transform="rotate(-30 14 -22)"/>
  ${[0, 72, 144, 216, 288].map(a => `<circle cx="0" cy="-17" r="13" fill="${c}" transform="translate(0,-62) rotate(${a})"/>`).join('')}<circle cx="0" cy="-62" r="11" fill="#ffd84a"/>`;
const artMush = (c) => `<rect x="-16" y="-50" width="32" height="50" rx="14" fill="#fff5e6" ${ST}/><path d="M-56,-44 Q-52,-110 0,-110 Q52,-110 56,-44 Q0,-58 -56,-44 Z" fill="${c}" ${ST}/>
  <circle cx="-24" cy="-76" r="9" fill="#fff"/><circle cx="14" cy="-88" r="11" fill="#fff"/><circle cx="32" cy="-64" r="7" fill="#fff"/>`;
const artTree = (c1, c2) => `<rect x="-26" y="-230" width="52" height="230" rx="10" fill="#8a5a3c" ${ST}/><circle cx="-90" cy="-270" r="95" fill="${c1}" ${ST}/><circle cx="90" cy="-270" r="95" fill="${c1}" ${ST}/><circle cx="0" cy="-350" r="130" fill="${c1}" ${ST}/><circle cx="0" cy="-270" r="90" fill="${c1}"/><circle cx="-40" cy="-380" r="40" fill="${c2}" opacity=".5"/>`;
const artApple = `<path d="M0,-22 q4,-14 12,-16" fill="none" stroke="#7a4a2a" stroke-width="5" stroke-linecap="round"/><ellipse cx="15" cy="-32" rx="11" ry="6" fill="#4cd964" transform="rotate(-25 15 -32)"/><circle r="25" fill="#ff4d5e" ${ST}/><circle cx="-9" cy="-9" r="6" fill="#fff" opacity=".6"/>`;
const artHat = `<path d="M-40,32 Q0,16 40,32 L7,-42 Q0,-50 -7,-42 Z" fill="#e8413c" ${ST}/>`;
const artOwl = `<ellipse cx="0" cy="-50" rx="44" ry="52" fill="#a8744a" ${ST}/><ellipse cx="0" cy="-36" rx="26" ry="32" fill="#f1d9b5"/>
  <path d="M-34,-92 l-6,-26 l24,14 z M34,-92 l6,-26 l-24,14 z" fill="#a8744a" ${ST}/>
  <g class="closed"><path d="M-30,-68 q12,10 24,0 M6,-68 q12,10 24,0" fill="none" ${ST}/></g>
  <g class="open"><circle cx="-18" cy="-68" r="17" fill="#fff" ${ST}/><circle cx="18" cy="-68" r="17" fill="#fff" ${ST}/><circle cx="-18" cy="-68" r="8" fill="#3b2a4a"/><circle cx="18" cy="-68" r="8" fill="#3b2a4a"/></g>
  <path d="M-7,-56 L7,-56 L0,-44 Z" fill="#ff9f43" ${ST}/>`;
const artFrog = `<ellipse cx="0" cy="0" rx="84" ry="24" fill="#3fae4a" ${ST}/><path d="M0,0 L84,-10 L84,10 Z" fill="#4aa3e0"/>
  <g class="frogb"><ellipse cx="0" cy="-30" rx="44" ry="33" fill="#7ed957" ${ST}/><ellipse cx="-36" cy="-8" rx="20" ry="9" fill="#7ed957" ${ST}/><ellipse cx="36" cy="-8" rx="20" ry="9" fill="#7ed957" ${ST}/>
  <circle cx="-20" cy="-62" r="16" fill="#fff" ${ST}/><circle cx="20" cy="-62" r="16" fill="#fff" ${ST}/><circle cx="-20" cy="-62" r="7" fill="#3b2a4a"/><circle cx="20" cy="-62" r="7" fill="#3b2a4a"/>
  <path d="M-22,-30 Q0,-12 22,-30" fill="none" ${ST}/></g>`;
const artBunny = `<ellipse cx="-14" cy="-120" rx="11" ry="34" fill="#fff" ${ST}/><ellipse cx="14" cy="-120" rx="11" ry="34" fill="#fff" ${ST}/><ellipse cx="-14" cy="-118" rx="5" ry="22" fill="#ffb3d1"/><ellipse cx="14" cy="-118" rx="5" ry="22" fill="#ffb3d1"/>
  <circle cx="0" cy="-66" r="36" fill="#fff" ${ST}/><circle cx="-13" cy="-72" r="5" fill="#3b2a4a"/><circle cx="13" cy="-72" r="5" fill="#3b2a4a"/><circle cx="0" cy="-60" r="5" fill="#ff8ad1"/><path d="M-8,-52 Q0,-44 8,-52" fill="none" ${ST}/>`;
const artBush = `<circle cx="-50" cy="-30" r="46" fill="#3fae4a" ${ST}/><circle cx="50" cy="-30" r="46" fill="#3fae4a" ${ST}/><circle cx="0" cy="-52" r="56" fill="#3fae4a" ${ST}/><rect x="-60" y="-34" width="120" height="36" fill="#3fae4a"/>`;
const artCat = `<path d="M30,-6 C70,-6 74,-56 54,-64" fill="none" stroke="#2c2440" stroke-width="10" stroke-linecap="round"/><ellipse cx="0" cy="-28" rx="32" ry="30" fill="#2c2440"/><circle cx="0" cy="-70" r="26" fill="#2c2440"/>
  <path d="M-24,-80 l2,-28 l20,16 z M24,-80 l-2,-28 l-20,16 z" fill="#2c2440"/><ellipse cx="-10" cy="-72" rx="6" ry="8" fill="#ffe14a"/><ellipse cx="10" cy="-72" rx="6" ry="8" fill="#ffe14a"/><circle cx="-10" cy="-72" r="2.5" fill="#000"/><circle cx="10" cy="-72" r="2.5" fill="#000"/><circle cx="0" cy="-62" r="3" fill="#ff8ad1"/>`;
const artBat = `<path d="M0,10 L-52,-4 L-40,22 L-26,12 L-14,30 Z M0,10 L52,-4 L40,22 L26,12 L14,30 Z" fill="#8a63c9" ${ST}/><circle cx="0" cy="18" r="20" fill="#8a63c9" ${ST}/><path d="M-14,2 l-2,-16 l12,10 z M14,2 l2,-16 l-12,10 z" fill="#8a63c9" ${ST}/><circle cx="-7" cy="16" r="4" fill="#fff"/><circle cx="7" cy="16" r="4" fill="#fff"/><path d="M-6,26 q6,5 12,0" fill="none" stroke="#4b3060" stroke-width="3"/>`;
const artCrystal = (c) => `<path d="M-40,0 L-52,-60 L-30,-100 L-10,-50 L0,-130 L26,-150 L44,-80 L60,-40 L50,0 Z" fill="${c}" stroke="#fff" stroke-width="4" stroke-linejoin="round" opacity=".92"/><path d="M0,-130 L10,-40 M-30,-100 L-24,-20" stroke="#fff" stroke-width="3" opacity=".7"/>`;
const artPumpkin = `<path d="M0,-70 q4,-18 16,-20" fill="none" stroke="#3fae4a" stroke-width="8" stroke-linecap="round"/><ellipse cx="-26" cy="-36" rx="34" ry="36" fill="#ff8a2a" ${ST}/><ellipse cx="26" cy="-36" rx="34" ry="36" fill="#ff8a2a" ${ST}/><ellipse cx="0" cy="-36" rx="30" ry="38" fill="#ff9f43" ${ST}/>
  <circle cx="-14" cy="-44" r="5" fill="#4b3060"/><circle cx="14" cy="-44" r="5" fill="#4b3060"/><path d="M-14,-26 Q0,-12 14,-26" fill="none" ${ST}/>`;
const artFish = `<path d="M-40,0 Q0,-34 40,0 Q0,34 -40,0 Z" fill="#ff9f43" ${ST}/><path d="M-36,0 L-66,-22 L-60,0 L-66,22 Z" fill="#ff9f43" ${ST}/><circle cx="20" cy="-6" r="6" fill="#fff"/><circle cx="21" cy="-6" r="3" fill="#3b2a4a"/>`;
const artDuck = `<ellipse cx="0" cy="-20" rx="46" ry="26" fill="#ffe14a" ${ST}/><circle cx="34" cy="-56" r="24" fill="#ffe14a" ${ST}/><path d="M54,-58 l26,6 l-26,8 z" fill="#ff9f43" ${ST}/><circle cx="40" cy="-62" r="4.5" fill="#3b2a4a"/><path d="M-30,-22 q18,-18 36,0" fill="none" ${ST}/><ellipse cx="0" cy="4" rx="64" ry="9" fill="#fff" opacity=".5"/>`;
const artButterfly = (c) => `<ellipse cx="-14" cy="-8" rx="15" ry="19" fill="${c}" ${ST}/><ellipse cx="14" cy="-8" rx="15" ry="19" fill="${c}" ${ST}/><ellipse cx="-11" cy="14" rx="10" ry="12" fill="${c}" ${ST}/><ellipse cx="11" cy="14" rx="10" ry="12" fill="${c}" ${ST}/><rect x="-3" y="-18" width="6" height="40" rx="3" fill="#4b3060"/>`;
const artCauldron = `<path d="M-70,10 L-50,-30 M70,10 L50,-30" stroke="#2c2440" stroke-width="12" stroke-linecap="round"/>
  <g class="np"><path class="flame" d="M-60,14 Q-70,-30 -40,-50 Q-36,-24 -14,-40 Q0,-70 14,-40 Q36,-24 40,-52 Q72,-28 60,14 Z" fill="#ff8a2a"/><path class="flame" d="M-34,14 Q-36,-14 -14,-22 Q0,-40 14,-22 Q36,-14 34,14 Z" fill="#ffd84a"/></g>
  <path d="M-96,-124 Q-118,-18 -54,-12 L54,-12 Q118,-18 96,-124 Z" fill="#3a3550" ${ST}/>
  <ellipse cx="0" cy="-124" rx="104" ry="24" fill="#4f4a6b" ${ST}/><ellipse id="potion" cx="0" cy="-125" rx="86" ry="16" fill="#8be58b"/>
  <circle class="bobber" cx="-30" cy="-136" r="12" fill="#fff" opacity=".6"/><circle class="bobber" cx="26" cy="-146" r="8" fill="#fff" opacity=".6" style="animation-delay:-1s"/><circle class="bobber" cx="50" cy="-132" r="6" fill="#fff" opacity=".6" style="animation-delay:-2s"/>`;
const ING = {
  rood: { zin: 'De aardbei is rood', iets: 'roods', art: `<path d="M0,30 C-36,6 -34,-26 -14,-30 Q0,-32 0,-24 Q0,-32 14,-30 C34,-26 36,6 0,30Z" fill="#ff4d5e" ${ST}/><path d="M-18,-30 L0,-20 L18,-30 L9,-40 L0,-32 L-9,-40Z" fill="#4cd964" ${ST}/><circle cx="-10" cy="-8" r="2.5" fill="#ffe14a"/><circle cx="8" cy="-10" r="2.5" fill="#ffe14a"/><circle cx="0" cy="8" r="2.5" fill="#ffe14a"/>` },
  geel: { zin: 'De banaan is geel', iets: 'geels', art: `<path d="M-36,-16 Q-10,34 36,-6 Q41,-13 34,-18 Q0,8 -27,-25 Q-34,-27 -36,-16Z" fill="#ffd43b" ${ST}/>` },
  blauw: { zin: 'De bessen zijn blauw', iets: 'blauws', art: `<circle cx="-16" cy="6" r="17" fill="#4a78ff" ${ST}/><circle cx="16" cy="6" r="17" fill="#4a78ff" ${ST}/><circle cx="0" cy="-16" r="17" fill="#4a78ff" ${ST}/><circle cx="-5" cy="-21" r="4" fill="#fff" opacity=".7"/>` },
  groen: { zin: 'Het blaadje is groen', iets: 'groens', art: `<path d="M-32,22 Q-32,-26 28,-30 Q30,22 -32,22Z" fill="#4cd964" ${ST}/><path d="M-32,22 L16,-20" fill="none" ${ST}/>` },
};

/* placement helpers */
function fun(x, y, art, o = {}) {
  const { a = 'jump', snd = 'boing', note = 0, s = 1, cls = '', id = '', inCls = '' } = o;
  return `<g ${id ? `id="${id}"` : ''} class="${cls}" data-fun="${a}" data-snd="${snd}" data-note="${note}" transform="translate(${x},${y}) scale(${s})"><g class="in ${inCls}">${art}</g></g>`;
}
function actor(id, x, y, art, o = {}) {
  const { s = 1, flip = false, h = 260, cls = '', inCls = '', hot = id } = o;
  actors[id] = { x, y, h: h * s };
  return `<g id="${id}" class="${cls}" ${hot ? `data-hot="${hot}"` : ''} transform="translate(${x},${y}) scale(${flip ? -s : s},${s})"><g class="in ${inCls}">${art}</g></g>`;
}
const arrow = (dir, target) => {
  const x = dir === 'l' ? 88 : 1512;
  return `<g data-go="${target}" data-dir="${dir}" transform="translate(${x},470)"><g class="pulse"><circle r="66" fill="#ffd84a" stroke="#fff" stroke-width="8"/>
    <path d="${dir === 'l' ? 'M-30,0 L16,-34 L16,34 Z' : 'M30,0 L-16,-34 L-16,34 Z'}" fill="#fff" stroke="#f0a020" stroke-width="5" stroke-linejoin="round"/></g></g>`;
};
const rbR = i => 600 - i * 31;
const rainbow = (cy, colored) => `<g id="rainbow">${RB.map((c, i) => { const r = rbR(i); return `<path id="rb${i}" d="M${800 - r},${cy} A${r},${r} 0 0 1 ${800 + r},${cy}" fill="none" stroke="${colored ? c.col : (i % 2 ? '#c4c4d0' : '#dadae4')}" stroke-width="32"/>`; }).join('')}</g>`;
function castle() {
  const win = (x, y, n) => fun(x, y, `<path d="M-20,28 V-10 A20,20 0 0 1 20,-10 V28 Z" fill="#ffe89a" ${ST}/><path d="M0,-30 V28 M-20,2 H20" stroke="#4b3060" stroke-width="3"/>`, { a: 'twinkle', snd: 'note', note: n });
  const flag = (x, y, c) => `<path d="M${x},${y} v-56" stroke="#4b3060" stroke-width="5" stroke-linecap="round"/>` + fun(x, y - 56, `<path d="M0,0 L46,14 L0,30 Z" fill="${c}" ${ST}/>`, { a: 'wiggle', snd: 'flap' });
  let cren = ''; for (let i = 0; i < 8; i++) cren += `<rect x="${566 + i * 60}" y="378" width="36" height="26" fill="#efe3fb" ${ST}/>`;
  return `${cren}<rect x="560" y="400" width="480" height="270" fill="#efe3fb" ${ST}/>
  <rect x="480" y="300" width="120" height="370" fill="#f7eefe" ${ST}/><path d="M462,302 L540,170 L618,302 Z" fill="#ff7eb9" ${ST}/>
  <rect x="1000" y="300" width="120" height="370" fill="#f7eefe" ${ST}/><path d="M982,302 L1060,170 L1138,302 Z" fill="#ff7eb9" ${ST}/>
  <rect x="730" y="270" width="140" height="400" fill="#f7eefe" ${ST}/><path d="M708,272 L800,168 L892,272 Z" fill="#b48cf0" ${ST}/>
  ${flag(540, 170, '#ffd84a')}${flag(1060, 170, '#ffd84a')}${flag(800, 168, '#ff7eb9')}
  ${win(800, 340, 4)}${win(540, 400, 0)}${win(1060, 400, 2)}${win(660, 500, 1)}${win(940, 500, 3)}
  <g data-go="keuken" data-dir="u" transform="translate(800,670)"><path d="M-58,0 V-100 A58,58 0 0 1 58,-100 V0 Z" fill="#a8744a" ${ST}/><path d="M0,-158 V0 M-30,-150 V0 M30,-150 V0" stroke="#7a4a2a" stroke-width="4"/><circle cx="14" cy="-70" r="7" fill="#ffd84a" ${ST}/><g transform="translate(0,-212)"><g class="pulse"><circle r="40" fill="#ffd84a" stroke="#fff" stroke-width="6"/><path d="M0,-20 L22,14 L-22,14 Z" fill="#fff" stroke="#f0a020" stroke-width="4" stroke-linejoin="round"/></g></g></g>`;
}


/* ---------- art, deel 2: keuken, brug, bloemenwei, strand ---------- */
const arm = (d, col) => `<path d="${d}" stroke="#4b3060" stroke-width="26" stroke-linecap="round"/><path d="${d}" stroke="${col}" stroke-width="18" stroke-linecap="round"/>`;
const artKoek = `<circle r="26" fill="#d9a05b" ${ST}/><circle cx="-9" cy="-8" r="5" fill="#7a4a2a"/><circle cx="9" cy="-3" r="5" fill="#7a4a2a"/><circle cx="-3" cy="11" r="5" fill="#7a4a2a"/><circle cx="13" cy="13" r="4" fill="#7a4a2a"/>`;
const artSchop = `<g transform="rotate(30)"><rect x="-4" y="-42" width="8" height="54" rx="4" fill="#a8744a" ${ST}/><rect x="-14" y="-48" width="28" height="10" rx="5" fill="#a8744a" ${ST}/><path d="M-17,10 H17 V26 Q17,42 0,46 Q-17,42 -17,26 Z" fill="#b8c4d8" ${ST}/></g>`;
const keyD = 'M-3,0 H34 M22,0 V12 M33,0 V10';
const artSleutel = `<g transform="rotate(-30)"><circle cx="-18" cy="0" r="15" fill="none" stroke="#4b3060" stroke-width="14"/><path d="${keyD}" fill="none" stroke="#4b3060" stroke-width="14" stroke-linecap="round"/><circle cx="-18" cy="0" r="15" fill="none" stroke="#ffd84a" stroke-width="7"/><path d="${keyD}" fill="none" stroke="#ffd84a" stroke-width="7" stroke-linecap="round"/></g>`;
const ITEMS = { appel: { art: artApple }, muts: { art: artHat }, koek: { art: artKoek }, schop: { art: artSchop }, sleutel: { art: artSleutel } };
const artEgg = `<ellipse rx="20" ry="26" fill="#fff8e8" ${ST}/><ellipse cx="-6" cy="-9" rx="5" ry="8" fill="#fff"/>`;
const artBowl = `<path d="M-92,-62 Q-92,0 -40,0 H40 Q92,0 92,-62 Z" fill="#6fb8ff" ${ST}/><ellipse cx="0" cy="-62" rx="92" ry="17" fill="#fff8e8" ${ST}/><path d="M-66,-30 Q0,-12 66,-30" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`;
const artFace = (y, e = 15) => `<circle cx="${-e}" cy="${y}" r="5" fill="#3b2a4a"/><circle cx="${e}" cy="${y}" r="5" fill="#3b2a4a"/><circle cx="${-e - 11}" cy="${y + 14}" r="8" fill="#ff9ebb" opacity=".7"/><circle cx="${e + 11}" cy="${y + 14}" r="8" fill="#ff9ebb" opacity=".7"/>`;
function artKamiel() {
  return `
  <ellipse cx="-24" cy="-6" rx="24" ry="11" fill="#3a3550" ${ST}/><ellipse cx="24" cy="-6" rx="24" ry="11" fill="#3a3550" ${ST}/>
  <rect x="-34" y="-52" width="26" height="46" fill="#5b6f9a" ${ST}/><rect x="8" y="-52" width="26" height="46" fill="#5b6f9a" ${ST}/>
  <g class="wave-arm">${arm('M42,-140 L82,-176', '#fff')}<circle cx="86" cy="-180" r="12" fill="${SKIN}" ${ST}/>
    <path d="M86,-180 L112,-250" stroke="#a8744a" stroke-width="8" stroke-linecap="round"/><ellipse cx="116" cy="-262" rx="13" ry="18" fill="#c98f5a" ${ST}/></g>
  ${arm('M-42,-140 L-74,-96', '#fff')}<circle cx="-76" cy="-92" r="12" fill="${SKIN}" ${ST}/>
  <path d="M-62,-44 Q-80,-150 0,-178 Q80,-150 62,-44 Z" fill="#fff" ${ST}/>
  <circle cx="0" cy="-128" r="5" fill="#4b3060"/><circle cx="0" cy="-102" r="5" fill="#4b3060"/><circle cx="0" cy="-76" r="5" fill="#4b3060"/>
  <path d="M-30,-172 Q0,-152 30,-172 L22,-152 Q0,-140 -22,-152 Z" fill="#ff4d5e" ${ST}/>
  <circle cx="0" cy="-214" r="41" fill="${SKIN}" ${ST}/>${artFace(-220)}
  <path d="M-10,-186 Q0,-178 10,-186" fill="none" ${ST}/>
  <path d="M0,-200 Q-16,-186 -36,-198 Q-18,-206 0,-200 Q18,-206 36,-198 Q16,-186 0,-200Z" fill="#7a4a2a" ${ST}/>
  <ellipse cx="0" cy="-208" rx="9" ry="8" fill="#ffb59a" ${ST}/>
  <circle cx="-28" cy="-290" r="24" fill="#fff" ${ST}/><circle cx="28" cy="-290" r="24" fill="#fff" ${ST}/><circle cx="0" cy="-304" r="30" fill="#fff" ${ST}/>
  <rect x="-36" y="-276" width="72" height="32" fill="#fff" ${ST}/><rect x="-30" y="-296" width="60" height="26" fill="#fff"/>`;
}
function artBram() {
  const B = '#9db4e8';
  return `
  <ellipse cx="-44" cy="-10" rx="46" ry="20" fill="${B}" ${ST}/><ellipse cx="44" cy="-10" rx="46" ry="20" fill="${B}" ${ST}/>
  <ellipse cx="-106" cy="-118" rx="24" ry="62" transform="rotate(12 -106 -118)" fill="${B}" ${ST}/><ellipse cx="106" cy="-118" rx="24" ry="62" transform="rotate(-12 106 -118)" fill="${B}" ${ST}/>
  <path d="M-96,-20 Q-118,-200 0,-216 Q118,-200 96,-20 Z" fill="#b07a48" ${ST}/>
  <rect x="22" y="-112" width="40" height="36" fill="#d9a877" stroke="#4b3060" stroke-width="4" stroke-dasharray="6 5"/>
  <path d="M-60,-150 l16,12 M-50,-70 l14,-12" fill="none" ${ST}/>
  <ellipse cx="-94" cy="-262" rx="18" ry="32" transform="rotate(-28 -94 -262)" fill="${B}" ${ST}/><ellipse cx="94" cy="-262" rx="18" ry="32" transform="rotate(28 94 -262)" fill="${B}" ${ST}/>
  <g class="head">
    <path d="M-52,-312 l-14,-42 l30,24 l6,-46 l26,38 l22,-42 l12,46 l30,-28 l-8,46 Z" fill="#ff8a3c" ${ST}/>
    <ellipse cx="0" cy="-256" rx="86" ry="70" fill="${B}" ${ST}/>
    <circle cx="-34" cy="-276" r="17" fill="#fff" ${ST}/><circle cx="34" cy="-276" r="17" fill="#fff" ${ST}/><circle cx="-31" cy="-274" r="8" fill="#3b2a4a"/><circle cx="31" cy="-274" r="8" fill="#3b2a4a"/>
    <path class="m-sad" d="M-60,-308 L-18,-294 M60,-308 L18,-294" fill="none" stroke="#4b3060" stroke-width="8" stroke-linecap="round"/>
    <circle cx="-58" cy="-232" r="11" fill="#ffc2d4" opacity=".8"/><circle cx="58" cy="-232" r="11" fill="#ffc2d4" opacity=".8"/>
    <path class="m-sad" d="M-40,-204 Q0,-226 40,-204" fill="none" ${ST}/>
    <path class="m-sad" d="M-26,-211 l6,-15 l8,12 Z M26,-211 l-6,-15 l-8,12 Z" fill="#fff" ${ST}/>
    <path class="m-happy" d="M-44,-218 Q0,-176 44,-218 Z" fill="#fff" ${ST}/>
    <ellipse cx="0" cy="-246" rx="24" ry="28" fill="#8aa0dc" ${ST}/>
  </g>`;
}
function artFien() {
  const w = (cx, cy, rx, ry, r) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${r} ${cx} ${cy})" fill="#e3f7ff" opacity=".85" ${ST}/>`;
  return `
  <g class="fwing">${w(-54, -152, 50, 26, 30)}${w(-42, -108, 32, 18, -20)}</g><g class="fwing fw2">${w(54, -152, 50, 26, -30)}${w(42, -108, 32, 18, 20)}</g>
  <path d="M-10,-44 V-8 M10,-44 V-8" stroke="${SKIN}" stroke-width="9" stroke-linecap="round"/>
  <ellipse cx="-12" cy="-4" rx="11" ry="6" fill="#ff8ad1" ${ST}/><ellipse cx="12" cy="-4" rx="11" ry="6" fill="#ff8ad1" ${ST}/>
  <g class="wave-arm"><path d="M16,-122 L50,-150" stroke="${SKIN}" stroke-width="11" stroke-linecap="round"/><path d="M50,-150 L78,-196" stroke="#7a4a2a" stroke-width="5" stroke-linecap="round"/><g transform="translate(80,-200)"><path d="${starPath(16)}" fill="#ffd84a" ${ST}/></g></g>
  <path d="M-16,-122 L-42,-92" stroke="${SKIN}" stroke-width="11" stroke-linecap="round"/>
  <path d="M-44,-38 L-30,-52 L-15,-38 L0,-52 L15,-38 L30,-52 L44,-38 Q32,-100 18,-134 L-18,-134 Q-32,-100 -44,-38 Z" fill="#ff9ecb" ${ST}/>
  <circle cx="0" cy="-200" r="17" fill="#5fd3c8" ${ST}/>
  <circle cx="0" cy="-162" r="33" fill="${SKIN}" ${ST}/>
  <path d="M-33,-164 C-34,-198 -6,-200 0,-192 C8,-200 34,-198 33,-164 C22,-180 8,-184 0,-182 C-10,-184 -22,-178 -33,-164 Z" fill="#5fd3c8" ${ST}/>
  ${artFace(-160, 12)}<path d="M-10,-146 Q0,-136 10,-146" fill="none" ${ST}/>`;
}
function artPiet() {
  return `
  <path d="M21,-52 V-6" stroke="#4b3060" stroke-width="17" stroke-linecap="round"/><path d="M21,-52 V-6" stroke="#a8744a" stroke-width="9" stroke-linecap="round"/>
  <rect x="-34" y="-54" width="26" height="46" fill="#3a4a7a" ${ST}/><rect x="8" y="-54" width="26" height="16" fill="#3a4a7a" ${ST}/><ellipse cx="-26" cy="-6" rx="26" ry="11" fill="#2c2440" ${ST}/>
  ${arm('M-42,-148 L-76,-106', '#ff4d5e')}<circle cx="-78" cy="-102" r="12" fill="${SKIN}" ${ST}/>
  <g class="wave-arm">${arm('M42,-148 L82,-186', '#ff4d5e')}<circle cx="86" cy="-190" r="12" fill="${SKIN}" ${ST}/></g>
  <path d="M-56,-48 Q-68,-160 0,-182 Q68,-160 56,-48 Z" fill="#fff" ${ST}/>
  <path d="M-44,-152 H44 M-54,-124 H54 M-55,-96 H55 M-54,-70 H54" stroke="#ff4d5e" stroke-width="12"/>
  <rect x="-58" y="-62" width="116" height="14" fill="#7a4a2a" ${ST}/><rect x="-10" y="-66" width="20" height="22" rx="3" fill="#ffd84a" ${ST}/>
  <circle cx="0" cy="-218" r="41" fill="${SKIN}" ${ST}/>
  <path d="M-40,-214 Q-46,-166 0,-164 Q46,-166 40,-214 Q20,-196 0,-200 Q-20,-196 -40,-214 Z" fill="#7a4a2a" ${ST}/>
  <path d="M-12,-190 Q0,-180 12,-190" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  <circle cx="15" cy="-224" r="5" fill="#3b2a4a"/><circle cx="27" cy="-210" r="8" fill="#ff9ebb" opacity=".7"/>
  <path d="M-40,-240 L40,-228" stroke="#2c2440" stroke-width="4"/><ellipse cx="-15" cy="-224" rx="13" ry="11" fill="#2c2440"/>
  <ellipse cx="0" cy="-210" rx="8" ry="8" fill="#ffb59a" ${ST}/>
  <path d="M-72,-246 Q0,-334 72,-246 Q0,-264 -72,-246 Z" fill="#2c2440" ${ST}/>
  <g transform="translate(0,-278)"><path d="${starPath(13)}" fill="#fff"/></g>
  <circle cx="43" cy="-200" r="7" fill="none" stroke="#ffd84a" stroke-width="4"/>`;
}
const artKoko = `<path d="M-10,-10 L-30,42 L-10,34 L0,50 L8,30 Z" fill="#4a78ff" ${ST}/><ellipse cx="0" cy="-40" rx="30" ry="40" fill="#ff4d5e" ${ST}/><ellipse cx="-14" cy="-30" rx="14" ry="26" fill="#4cd964" ${ST}/>
  <path d="M-4,-106 l-6,-20 l14,12 l4,-18 l8,20" fill="#ffd84a" ${ST}/><circle cx="8" cy="-84" r="26" fill="#ff4d5e" ${ST}/><path d="M28,-94 Q54,-88 40,-64 Q34,-74 26,-74 Z" fill="#ffd84a" ${ST}/><circle cx="14" cy="-90" r="8" fill="#fff"/><circle cx="16" cy="-90" r="4" fill="#3b2a4a"/>`;
const artKist = open => `<rect x="-92" y="-82" width="184" height="82" rx="8" fill="#a8744a" ${ST}/><rect x="-92" y="-54" width="184" height="12" fill="#ffd84a" ${ST}/>
  ${open ? `<path d="M-92,-82 Q-92,-176 0,-182 Q92,-176 92,-82 Z" fill="#7a4a2a" ${ST}/>${[[-56, -88], [-22, -98], [12, -88], [44, -100], [64, -86], [-4, -112], [-40, -110], [28, -116]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#ffd84a" ${ST}/>`).join('')}`
    : `<path d="M-98,-82 Q-98,-142 0,-146 Q98,-142 98,-82 Z" fill="#c98f5a" ${ST}/><path d="M-50,-140 V-82 M50,-140 V-82" stroke="#ffd84a" stroke-width="10"/><rect x="-15" y="-98" width="30" height="36" rx="6" fill="#ffd84a" ${ST}/><circle cx="0" cy="-84" r="5" fill="#4b3060"/><path d="M0,-84 v10" stroke="#4b3060" stroke-width="4" stroke-linecap="round"/>`}`;
const artPalm = `<path d="M-22,0 Q-12,-200 40,-384 L76,-374 Q30,-200 28,0 Z" fill="#c98f5a" ${ST}/><path d="M-14,-80 h38 M-8,-160 h38 M6,-240 h38 M22,-310 h38" stroke="#a8744a" stroke-width="5" stroke-linecap="round"/>
  ${['Q-30,-480 -170,-390 Q-40,-432 56,-380', 'Q20,-510 -70,-560 Q10,-470 56,-380', 'Q130,-530 230,-530 Q130,-470 56,-380', 'Q180,-470 290,-370 Q170,-420 56,-380', 'Q110,-380 190,-270 Q90,-350 56,-380'].map(d => `<path d="M56,-380 ${d} Z" fill="#3fae4a" ${ST}/>`).join('')}
  <circle cx="44" cy="-368" r="17" fill="#7a4a2a" ${ST}/><circle cx="74" cy="-360" r="17" fill="#7a4a2a" ${ST}/>`;
const artShip = `<rect x="-5" y="-190" width="10" height="190" fill="#7a4a2a" ${ST}/><path d="M10,-180 Q90,-130 10,-60 Z" fill="#fff" ${ST}/><path d="M-10,-170 Q-70,-120 -10,-70 Z" fill="#fff" ${ST}/>
  <path d="M-5,-190 L-50,-204 L-5,-218 Z" fill="#2c2440" ${ST}/><circle cx="-22" cy="-204" r="5" fill="#fff"/>
  <path d="M-130,-40 Q-110,30 -60,30 H70 Q120,30 140,-40 Z" fill="#a8744a" ${ST}/><path d="M-124,-18 H132" stroke="#ffd84a" stroke-width="7"/>
  <circle cx="-50" cy="6" r="8" fill="#4b3060"/><circle cx="0" cy="6" r="8" fill="#4b3060"/><circle cx="50" cy="6" r="8" fill="#4b3060"/>`;
const artSunflower = `<path d="M0,0 Q-8,-80 0,-160" fill="none" stroke="#3fae4a" stroke-width="12" stroke-linecap="round"/><ellipse cx="26" cy="-60" rx="26" ry="12" fill="#3fae4a" ${ST} transform="rotate(-30 26 -60)"/><ellipse cx="-26" cy="-90" rx="26" ry="12" fill="#3fae4a" ${ST} transform="rotate(30 -26 -90)"/>
  ${[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map(a => `<ellipse cx="0" cy="-52" rx="15" ry="28" fill="#ffd43b" ${ST} transform="translate(0,-180) rotate(${a})"/>`).join('')}
  <circle cx="0" cy="-180" r="36" fill="#a8744a" ${ST}/><circle cx="-12" cy="-186" r="5" fill="#3b2a4a"/><circle cx="12" cy="-186" r="5" fill="#3b2a4a"/><path d="M-12,-170 Q0,-158 12,-170" fill="none" ${ST}/>`;
const artMound = dug => dug ? `<ellipse cx="0" cy="-8" rx="70" ry="20" fill="#c9a968" ${ST}/><ellipse cx="0" cy="-6" rx="50" ry="12" fill="#9a7a44"/><path d="M-100,0 Q-88,-26 -66,0 Z M66,0 Q88,-26 104,0 Z" fill="#e8cf8a" ${ST}/>`
  : `<path d="M-78,0 Q-66,-58 0,-62 Q66,-58 78,0 Z" fill="#e8cf8a" ${ST}/><path d="M-20,-48 L20,-14 M20,-48 L-20,-14" stroke="#ff4d5e" stroke-width="10" stroke-linecap="round"/><rect x="-80" y="-80" width="160" height="90" fill="transparent"/>`;
const artCrab = `<path d="M-30,6 l-18,14 M-22,12 l-12,18 M30,6 l18,14 M22,12 l12,18" fill="none" ${ST}/><path d="M-30,-10 L-48,-26 M30,-10 L48,-26" fill="none" ${ST}/><circle cx="-52" cy="-32" r="14" fill="#ff6b5e" ${ST}/><circle cx="52" cy="-32" r="14" fill="#ff6b5e" ${ST}/>
  <ellipse rx="36" ry="25" fill="#ff6b5e" ${ST}/><path d="M-12,-22 V-38 M12,-22 V-38" fill="none" ${ST}/><circle cx="-12" cy="-42" r="8" fill="#fff" ${ST}/><circle cx="12" cy="-42" r="8" fill="#fff" ${ST}/><circle cx="-12" cy="-42" r="3" fill="#3b2a4a"/><circle cx="12" cy="-42" r="3" fill="#3b2a4a"/><path d="M-12,4 Q0,14 12,4" fill="none" ${ST}/>`;
const artShell = `<path d="M-30,0 Q-34,-40 0,-44 Q34,-40 30,0 Z" fill="#ffc9de" ${ST}/><path d="M0,-44 V0 M-16,-38 L-8,0 M16,-38 L8,0" stroke="#4b3060" stroke-width="3"/>`;
const artBee = `<ellipse cx="-8" cy="-16" rx="12" ry="16" fill="#e3f7ff" opacity=".9" ${ST}/><ellipse cx="10" cy="-16" rx="12" ry="16" fill="#e3f7ff" opacity=".9" ${ST}/><ellipse rx="24" ry="17" fill="#ffd43b" ${ST}/><path d="M-6,-16 V16 M8,-15 V15" stroke="#4b3060" stroke-width="6"/><circle cx="17" cy="-4" r="3" fill="#3b2a4a"/>`;
const artSnail = `<path d="M-50,0 Q-56,-18 -40,-20 H34 Q54,-20 56,-44 L58,-62 M48,-44 L40,-64" fill="none" stroke="#4b3060" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M-50,0 Q-56,-18 -40,-20 H34 Q54,-20 56,-44 L58,-62 M48,-44 L40,-64" fill="none" stroke="#ffd9a0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="-8" cy="-44" r="34" fill="#ff9ee0" ${ST}/><path d="M-8,-44 m-18,0 a18,18 0 1 1 18,18 a10,10 0 1 1 -8,-16" fill="none" ${ST}/>`;
const mapIcon = {
  kasteel: `<rect x="-24" y="-8" width="48" height="48" fill="#f7eefe" ${ST}/><path d="M-32,-8 L0,-52 L32,-8Z" fill="#ff7eb9" ${ST}/><path d="M-9,40 V18 A9,9 0 0 1 9,18 V40Z" fill="#a8744a" ${ST}/>`,
  keuken: `<g transform="scale(1.6)">${artKoek}</g>`,
  bos: `<g transform="translate(0,46) scale(.2)">${artTree('#58c45a', '#a8ee9a')}</g>`,
  grot: `<g transform="translate(0,40) scale(.55)">${artCrystal('#6fe3ff')}</g>`,
  meer: `<path d="M-46,24 q12,-12 24,0 t24,0 t24,0 t22,0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><g transform="translate(4,-8) scale(.75)">${artFish}</g>`,
  heks: `<ellipse cx="0" cy="30" rx="48" ry="11" fill="#4b2f80" ${ST}/><path d="M-28,30 Q-6,-30 22,-48 Q14,-10 28,30 Z" fill="#4b2f80" ${ST}/><path d="M-25,22 Q0,32 26,22 L23,10 Q0,20 -21,10 Z" fill="#ffd84a" ${ST}/>`,
  brug: `<path d="M-50,26 Q0,-44 50,26" fill="none" stroke="#4b3060" stroke-width="20" stroke-linecap="round"/><path d="M-50,26 Q0,-44 50,26" fill="none" stroke="#c98f5a" stroke-width="12" stroke-linecap="round"/><path d="M-30,6 V-22 M0,-8 V-36 M30,6 V-22" stroke="#7a4a2a" stroke-width="7" stroke-linecap="round"/>`,
  wei: `<g transform="translate(0,44) scale(1.05)">${artFlower('#ff8ad1')}</g>`,
  strand: `<g transform="translate(-10,46) scale(.19)">${artPalm}</g>`,
};

/* ---------- art, deel 3: extra spelletjes ---------- */
const artBasket = `<path d="M-70,-50 Q0,-130 70,-50" fill="none" stroke="#4b3060" stroke-width="16" stroke-linecap="round"/><path d="M-70,-50 Q0,-130 70,-50" fill="none" stroke="#c98f5a" stroke-width="8" stroke-linecap="round"/>
  <path d="M-90,-56 H90 L70,0 H-70 Z" fill="#d9a05b" ${ST}/><path d="M-84,-38 H84 M-78,-20 H78 M-45,-56 L-36,0 M0,-56 V0 M45,-56 L36,0" stroke="#a8744a" stroke-width="4"/>`;
const artEzel = `<path d="M-70,0 L-30,-250 M70,0 L30,-250 M0,-40 V-270" stroke="#4b3060" stroke-width="18" stroke-linecap="round"/><path d="M-70,0 L-30,-250 M70,0 L30,-250 M0,-40 V-270" stroke="#c98f5a" stroke-width="10" stroke-linecap="round"/>
  <rect x="-90" y="-240" width="180" height="150" rx="6" fill="#fff" ${ST}/><rect x="-100" y="-96" width="200" height="16" rx="6" fill="#c98f5a" ${ST}/>
  <path d="M-60,-130 A44,44 0 0 1 28,-130" fill="none" stroke="#ff4d5e" stroke-width="12"/><path d="M-46,-130 A30,30 0 0 1 14,-130" fill="none" stroke="#ffd43b" stroke-width="12"/><path d="M-32,-130 A16,16 0 0 1 0,-130" fill="none" stroke="#4aa8ff" stroke-width="12"/>
  <circle cx="54" cy="-200" r="16" fill="#ffd84a"/>`;
const SHAPES = {
  cirkel: { col: '#ff4d5e', d: 'M0,-60 A60,60 0 1 1 -0.1,-60 Z' },
  vierkant: { col: '#4aa8ff', d: 'M-54,-54 H54 V54 H-54 Z' },
  driehoek: { col: '#ffd43b', d: 'M0,-64 L66,52 L-66,52 Z' },
  ster: { col: '#4cd964', d: starPath(70) },
};
const MEMART = [() => `<g transform="scale(2.6)">${artApple}</g>`, () => `<g transform="scale(1.6)">${artFish}</g>`, () => `<g transform="scale(2.6)">${artButterfly('#ff8ad1')}</g>`, () => `<g transform="translate(0,80) scale(1.7)">${artFlower('#b48cf0')}</g>`];
/* kleurplaat: [vorm, standaardkleur] — elke vorm is één vlak om in te kleuren */
const PAINT = [
  `<rect x="0" y="0" width="1000" height="430"/>`,
  `<path d="M0,430 Q500,380 1000,430 V620 H0 Z"/>`,
  `<path d="M150,440 A350,350 0 0 1 850,440 L800,440 A300,300 0 0 0 200,440 Z"/>`,
  `<path d="M200,440 A300,300 0 0 1 800,440 L750,440 A250,250 0 0 0 250,440 Z"/>`,
  `<path d="M250,440 A250,250 0 0 1 750,440 L700,440 A200,200 0 0 0 300,440 Z"/>`,
  `<circle cx="880" cy="110" r="70"/>`,
  `<g><circle cx="150" cy="130" r="50"/><circle cx="215" cy="110" r="62"/><circle cx="280" cy="135" r="48"/><rect x="150" y="130" width="130" height="48" stroke="none"/></g>`,
  `<rect x="400" y="400" width="200" height="170"/>`,
  `<path d="M370,404 L500,290 L630,404 Z"/>`,
  `<path d="M470,570 V490 A30,30 0 0 1 530,490 V570 Z"/>`,
  `<rect x="800" y="430" width="40" height="150"/>`,
  `<g><circle cx="780" cy="400" r="60"/><circle cx="860" cy="400" r="60"/><circle cx="820" cy="340" r="70"/></g>`,
  `<g>${[0, 72, 144, 216, 288].map(a => `<circle cx="0" cy="-34" r="26" transform="translate(180,500) rotate(${a})"/>`).join('')}</g>`,
  `<circle cx="180" cy="500" r="22"/>`,
];
