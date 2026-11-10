# SGLang — minimalist explainer

Hand-drawn, Dracula-dark explainer built with Remotion. Audio and word-level
timing are already wired in.

## Preview (no MP4 render)

```bash
cd video
npm start
```

Open <http://localhost:3111>.

The Remotion Studio is currently running at that address.

## Source map

- `src/Video.tsx` — 37 scene sequence + audio
- `src/scenes/` — Intro / Core / Frontend / Compare scenes
- `src/lib/` — Rough.js primitives, type, scene/timing helpers
- `src/data/script_words.json` — word-level timestamps aligned to `script.txt`
- `public/audio/vo.wav` — voiceover
- `public/fonts/` — bundled Caveat + Patrick Hand

`npm run render` exists but was intentionally not run. The `out/stills/`
folder only contains review frames used to check layout, contrast, and timing.


## 2K Google Colab render

Use `../SGLang_2K_Colab_Render.ipynb` in Google Colab.

- Asks for Google Drive access first, then verifies write access
- Pulls the latest `main` from `lroe/sglang`
- Renders at 2560x1440 (2K QHD), H.264/AAC
- Streams percentage, frame count, fps, ETA, and encoding stage in real time
- Copies the MP4, render log, and manifest into the approved Drive folder

A full 2K render is CPU-heavy; use a High-RAM Colab runtime.
