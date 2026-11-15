// Verzamelt elke zin die in het spel gezegd wordt -> JSON [[wie, tekst, sleutel], ...]
// Gebruik: node tools/lines.mjs
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const tekst = readFileSync(join(root, 'tekst.js'), 'utf8');
const { dynamicLines, voiceKey, WHO } = new Function(tekst + '\nreturn { dynamicLines, voiceKey, WHO };')();
const game = readFileSync(join(root, 'game.js'), 'utf8');
const un = s => s.replace(/\\(.)/g, '$1');
const lines = dynamicLines();
for (const m of game.matchAll(/\bsay\('(\w+)',\s*'((?:[^'\\]|\\.)*)'\)/g)) lines.push([m[1], un(m[2])]);
for (const m of game.matchAll(/\bshout\('((?:[^'\\]|\\.)*)'(?:,\s*'(\w+)')?\)/g)) lines.push([m[2] || 'fonkel', un(m[1])]);
const seen = new Set(), out = [];
for (const [who, text] of lines) {
  if (!WHO[who]) throw new Error('onbekende figuur: ' + who);
  const k = voiceKey(who, text);
  if (!seen.has(k)) { seen.add(k); out.push([who, text, k]); }
}
if (process.argv.includes('--who')) console.log(JSON.stringify(WHO));
else console.log(JSON.stringify(out));
