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
