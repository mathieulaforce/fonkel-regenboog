'use strict';
/* Alle tekst die niet letterlijk in game.js staat + de stemmen per figuur.
   Wordt geladen door index.html én door tools/lines.mjs (om de stemmen op te nemen). */

const RB = [
  { id: 'rood', col: '#ff4d5e', adj: 'rode', name: 'Rood' },
  { id: 'oranje', col: '#ff9a3c', adj: 'oranje', name: 'Oranje' },
  { id: 'geel', col: '#ffd43b', adj: 'gele', name: 'Geel' },
  { id: 'groen', col: '#4cd964', adj: 'groene', name: 'Groen' },
  { id: 'blauw', col: '#4aa8ff', adj: 'blauwe', name: 'Blauw' },
  { id: 'paars', col: '#b266ff', adj: 'paarse', name: 'Paars' },
  { id: 'roze', col: '#ff7ecb', adj: 'roze', name: 'Roze' },
];
const COUNT = ['Eén', 'Twee', 'Drie', 'Vier', 'Vijf'];
const NSTER = ['nul sterren', 'één ster', 'twee sterren', 'drie sterren', 'vier sterren', 'vijf sterren', 'zes sterren', 'zeven sterren'];

/* v = stem (Piper nl_BE), p = toonhoogte, l = traagheid (groter = trager) */
const WHO = {
  fonkel: { n: 'Fonkel', c: '#e0559f', v: 'nathalie', p: 1.14, l: 1.08 },
  lotte: { n: 'Prinses Lotte', c: '#d6478f', v: 'nathalie', p: 1.04, l: 1.12 },
  marie: { n: 'Zeemeermin Marie', c: '#8e5bd9', v: 'nathalie', p: .98, l: 1.18 },
  hanne: { n: 'Heks Hanne', c: '#7b4bc4', v: 'nathalie', p: .9, l: 1.02 },
  fien: { n: 'Fee Fien', c: '#3f9e2f', v: 'nathalie', p: 1.24, l: 1.05 },
  koko: { n: 'Papegaai Koko', c: '#e8413c', v: 'nathalie', p: 1.4, l: .9 },
  vlam: { n: 'Draakje Vlam', c: '#2f9e44', v: 'rdh', p: 1.2, l: 1.12 },
  pim: { n: 'Kabouter Pim', c: '#2f6fd0', v: 'rdh', p: 1.02, l: 1.1 },
  kamiel: { n: 'Kok Kamiel', c: '#c0562b', v: 'rdh', p: 1.08, l: 1.05 },
  piet: { n: 'Piraat Piet', c: '#3a4a7a', v: 'rdh', p: .9, l: 1.08 },
  kwak: { n: 'Kikker Kwak', c: '#2f9e44', v: 'rdh', p: 1.32, l: 1.0 },
  bram: { n: 'Trol Bram', c: '#5b73c4', v: 'rdh', p: .8, l: 1.15 },
};

const PLACE = {
  kasteel: 'het kasteel', keuken: 'de keuken', bos: 'het toverbos', grot: 'de drakengrot', meer: 'het meer',
  heks: 'heks Hanne', brug: 'de brug', wei: 'de bloemenwei', strand: 'het strand',
};
const PLACE_SHORT = { kasteel: 'Kasteel', keuken: 'Keuken', bos: 'Bos', grot: 'Grot', meer: 'Meer', heks: 'Heks', brug: 'Brug', wei: 'Bloemenwei', strand: 'Strand' };
const FIRST = {
  bos: 'Wauw, het toverbos! Kijk, daar zit kabouter Pim.',
  grot: 'Oei, wat is het hier donker. Ik hoor iemand wenen...',
  meer: 'Het meer! Amai, wat blinkt het water schoon.',
  heks: 'Dat is het huisje van heks Hanne. Geen schrik, ze is heel lief!',
  keuken: 'Mmm, wat ruikt het hier lekker! Dit is de keuken van het kasteel.',
  brug: 'Een brug over de rivier. Maar wie staat daar?',
  wei: 'Amai, wat een schone bloemenwei! Hier woont fee Fien.',
  strand: 'Het strand! Kijk, daar ligt een echt piratenschip!',
};
const INGT = {
  rood: { zin: 'De aardbei is rood', iets: 'roods' },
  geel: { zin: 'De banaan is geel', iets: 'geels' },
  blauw: { zin: 'De bessen zijn blauw', iets: 'blauws' },
  groen: { zin: 'Het blaadje is groen', iets: 'groens' },
};
const ASK = ['rood', 'geel', 'blauw'];
const VORM = { cirkel: 'een cirkel', vierkant: 'een vierkant', driehoek: 'een driehoek', ster: 'een ster' };
const ITEMT = {
  appel: 'Dat is een appel. Lekker!',
  muts: 'Dat is een rode muts.',
  koek: 'Dat zijn koekjes van kok Kamiel. Mmm!',
  schop: 'Dat is een schopje. Daarmee kan je graven.',
  sleutel: 'Dat is een gouden sleutel!',
};
const HINT = {
  feest: 'Het is feest! Duw maar overal op!',
  bellen: 'Duw op de bellen om ze kapot te prikken!',
  bakken: 'Tel maar mee! Duw op de eieren en de aardbeien op de tafel.',
  alle: 'We hebben alle sterren! Vlug naar prinses Lotte in het kasteel!',
  roodligt: 'De rode ster ligt in de grot van het draakje. Duw erop!',
  appel: 'Het draakje in de grot heeft honger. Breng de appel naar het draakje!',
  muts: 'Breng de rode muts naar kabouter Pim in het bos!',
  koek: 'De trol op de brug heeft honger. Breng hem de koekjes! De brug ligt voorbij het huisje van de heks.',
  sleutel: 'We hebben de sleutel! Vlug naar de schatkist op het strand!',
  honger: 'Het draakje in de grot heeft honger. In het bos staat een appelboom!',
  vliegen: 'Het draakje wil met ons vliegen! Duw op het draakje in de grot.',
  pim: 'Kabouter Pim is zijn muts kwijt. Misschien ligt ze bij het meer?',
  marie: 'De zeemeermin in het meer heeft hulp nodig. Duw op de zeemeermin!',
  hanne: 'Heks Hanne maakt een toverdrank. Haar huisje staat voorbij het meer!',
  kok: 'Kok Kamiel bakt koekjes in het kasteel. Duw op de poort van het kasteel!',
  fee: 'Fee Fien wil een spelletje spelen. Ze woont in de bloemenwei, over de brug!',
  schopzoek: 'Om te graven hebben we een schopje nodig. Bij fee Fien in de bloemenwei staat er eentje!',
  graven: 'Duw op de rode kruisjes in het zand. Dan graaf ik met mijn schopje!',
  strandga: 'Met het schopje kunnen we graven op het strand. Het strand ligt voorbij de drakengrot!',
  liedje: 'De groene ster zit in de zingende paddenstoelen. Duw op kabouter Pim en speel het liedje na!',
  mand: 'Schuif de mand onder de appels die naar beneden vallen!',
  piraat: 'Op het strand woont een piraat. Het strand ligt voorbij de drakengrot!',
};
const T = {
  joepie: c => `Joepie! De ${c.adj} ster!`,
  nog: n => `Nu nog ${NSTER[n]} zoeken!`,
  lotteN: n => `Je hebt al ${NSTER[n]} gevonden. Goed bezig! Zoek maar vlug verder.`,
  naar: p => `Naar ${PLACE[p]}!`,
  ask: s => `Ik heb iets ${INGT[ASK[s]].iets} nodig. Wat is er ${ASK[s]}? Duw erop!`,
  ja: c => `Ja! ${INGT[c].zin}. Goed zo!`,
  nee: (c, w) => `Hihi, nee! ${INGT[c].zin}. Ik zoek iets ${INGT[w].iets}!`,
  zin: c => INGT[c].zin + '!',
  kleur: c => c.name + '!',
  tel: i => COUNT[i] + '!',
  vormJa: v => `Ja! Dat is ${VORM[v]}. Dat past!`,
  vormNee: v => `Oei, dat is ${VORM[v]}. Dat past hier niet. Probeer nog eens!`,
};

/* elke [wie, tekst] die via een sjabloon gemaakt wordt */
function dynamicLines() {
  const L = [];
  for (const k in FIRST) L.push(['fonkel', FIRST[k]]);
  for (const k in HINT) L.push(['fonkel', HINT[k]]);
  for (const k in ITEMT) L.push(['fonkel', ITEMT[k]]);
  for (const k in PLACE) L.push(['fonkel', T.naar(k)]);
  RB.forEach(c => { L.push(['fonkel', T.joepie(c)]); L.push(['lotte', T.kleur(c)]); });
  for (let n = 1; n < RB.length; n++) { L.push(['fonkel', T.nog(n)]); L.push(['lotte', T.lotteN(n)]); }
  COUNT.forEach((_, i) => L.push(['fonkel', T.tel(i)]));
  ASK.forEach((w, s) => { L.push(['hanne', T.ask(s)]); L.push(['hanne', T.ja(w)]); for (const c in INGT) if (c !== w) L.push(['hanne', T.nee(c, w)]); });
  for (const c in INGT) L.push(['hanne', T.zin(c)]);
  for (const v in VORM) { L.push(['piet', T.vormJa(v)]); L.push(['piet', T.vormNee(v)]); }
  return L;
}

/* bestandsnaam van een opgenomen zin: FNV-1a over de UTF-8 bytes van "wie|tekst" */
function voiceKey(who, text) {
  const b = new TextEncoder().encode(who + '|' + text);
  let h = 0x811c9dc5;
  for (let i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 0x01000193) >>> 0; }
  return ('0000000' + h.toString(16)).slice(-8);
}
