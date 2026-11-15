# Fonkel en de Verdwenen Regenboog

Een avonturenspelletje in het Vlaams voor kleuters (± 4 jaar). Help eenhoorn Fonkel de zeven sterren van de regenboog terug te vinden, samen met prinses Lotte, draakje Vlam, kabouter Pim en nog veel meer vriendjes.

**Spelen:** https://mathieulaforce.github.io/fonkel-regenboog/

A point-and-click adventure in Flemish for 4-year-olds. Plain HTML/SVG/JavaScript, no build step: open `index.html` in a browser or serve the folder.

## Structure

- `index.html` – stage, styles, SVG defs
- `tekst.js` – all text templates and character voices
- `art.js` – SVG artwork
- `game.js` – engine, scenes and minigames
- `voice/` – pre-recorded voice lines (mp3, named by a hash of `who|text`)
- `cursor/` – magic wand cursors
- `tools/` – scripts to collect all lines and record them with [Piper](https://github.com/rhasspy/piper)

## Re-recording voices

```sh
uv run --python 3.12 --with piper-tts tools/make-voices.py        # only new lines
uv run --python 3.12 --with piper-tts tools/make-voices.py --all  # everything
```
