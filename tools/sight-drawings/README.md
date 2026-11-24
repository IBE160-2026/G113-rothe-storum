# Sight drawings

These scripts draw the 16 sight images in `public/assets/sights/` (Story 2.2, issue #45). Claude (Anthropic) wrote them in an AI-assisted session on 2026-11-24, working from reference photos on Wikimedia Commons. The team chose the views and asked for several redraws.

- `lib.py` holds the shared helpers: line weights, depth layers that hide what lies behind them (SVG masks), hatching, water, trees and cobbles. `save()` writes `public/assets/sights/<id>.svg`.
- Each `<id>.py` draws one sight. Its first comment line names the reference photo, the photographer, the licence and the Commons page. The same data is in `content/sights.json` and the README credits table.

Run a script from this folder to redraw one image, then run `npm test`:

```sh
cd tools/sight-drawings
python3 copenhagen-tivoli.py
```

The scripts use only the Python 3 standard library. The output follows the content rules (NFR-7) that `tests/content/content.test.ts` checks: `viewBox="0 0 800 600"`, the theme `<style>` block first, strokes in `currentColor`, and no text, scripts or external references. The reference photos are not stored here, only linked.

A drawing made after a CC BY, CC BY-SA or Free Art License photo is a derivative work and is licensed CC BY-SA 4.0. A drawing made after a public-domain or CC0 photo is CC0 1.0. See "Content and image credits" in the main README.
