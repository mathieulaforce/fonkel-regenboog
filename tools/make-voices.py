#!/usr/bin/env python3
"""Neemt alle zinnen van het spel op met Piper (Vlaamse neurale stemmen) -> voice/*.mp3 + voice/manifest.js

Gebruik (vanuit de map van het spel):
    uv run --python 3.12 --with piper-tts tools/make-voices.py          # alleen nieuwe/gewijzigde zinnen
    uv run --python 3.12 --with piper-tts tools/make-voices.py --all    # alles opnieuw

Nodig: node, ffmpeg. De stemmodellen (2 x 63 MB) worden één keer gedownload naar ~/.cache/piper-voices.
Stem, toonhoogte (p) en tempo (l) per figuur staan in tekst.js (WHO).
"""
import json, os, subprocess, sys, tempfile, urllib.request, wave
from pathlib import Path
from piper import PiperVoice, SynthesisConfig

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'voice'
CACHE = Path(os.environ.get('PIPER_VOICES', Path.home() / '.cache' / 'piper-voices'))
URL = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/nl/nl_BE/{v}/medium/nl_BE-{v}-medium.{e}'
# kleine uitspraakhulp voor de voorlezer (alleen voor het geluid, niet voor de tekst op het scherm)
SAY = {'oranje': 'orangje', 'Oranje': 'Orangje', 'Amai': 'Amaai', 'Joepie': 'Joepie', 'Njam': 'Njam', 'Daaag': 'Daaag', 'Hihihi': 'Hi hi hi', 'Hihi': 'Hi hi',
       'Boehoe': 'Boehoehoe', 'Kraa': 'Kraaa', 'Joehoe': 'Joehoe', 'Ahoi': 'Ahoj', 'Hokus pokus pilatus pas': 'Hokus, pokus, pilatus, pas'}

def model(v):
    CACHE.mkdir(parents=True, exist_ok=True)
    for e in ('onnx', 'onnx.json'):
        f = CACHE / f'nl_BE-{v}-medium.{e}'
        if not f.exists() or f.stat().st_size == 0:
            print('download', f.name, flush=True)
            urllib.request.urlretrieve(URL.format(v=v, e=e), f)
    return PiperVoice.load(str(CACHE / f'nl_BE-{v}-medium.onnx'))

def main():
    redo = '--all' in sys.argv
    lines = json.loads(subprocess.check_output(['node', str(ROOT / 'tools' / 'lines.mjs')]))
    who = json.loads(subprocess.check_output(['node', str(ROOT / 'tools' / 'lines.mjs'), '--who']))
    OUT.mkdir(exist_ok=True)
    voices, made = {}, 0
    with tempfile.TemporaryDirectory() as tmp:
        wav = Path(tmp) / 'a.wav'
        for w, text, key in lines:
            mp3 = OUT / f'{key}.mp3'
            if mp3.exists() and not redo:
                continue
            c = who[w]
            if c['v'] not in voices:
                voices[c['v']] = model(c['v'])
            spoken = text
            for a, b in SAY.items():
                spoken = spoken.replace(a, b)
            with wave.open(str(wav), 'wb') as f:
                # trager inspreken en daarna sneller afspelen = hogere stem met hetzelfde tempo
                voices[c['v']].synthesize_wav(spoken, f, syn_config=SynthesisConfig(length_scale=c['l'] * c['p']))
            rate = round(22050 * c['p'])
            subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav),
                            '-af', f'asetrate={rate},aresample=44100,apad=pad_dur=0.15,loudnorm=I=-16:TP=-1.5:LRA=11',
                            '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '64k', str(mp3)], check=True)
            made += 1
            print(f'{made:3d} {w:7s} {text}', flush=True)
    keep = {k for _, _, k in lines}
    for f in OUT.glob('*.mp3'):
        if f.stem not in keep:
            f.unlink(); print('weg:', f.name)
    (OUT / 'manifest.js').write_text('window.VOICE=' + json.dumps({k: 1 for k in sorted(keep)}, separators=(',', ':')) + ';\n')
    print(f'{made} opgenomen, {len(keep)} zinnen in totaal')

main()
