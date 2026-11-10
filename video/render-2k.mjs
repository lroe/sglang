import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import {bundle} from '@remotion/bundler';
import {selectComposition, renderMedia} from '@remotion/renderer';

/**
 * 2K render driver with streaming progress.
 *
 * Usage:
 *   node render-2k.mjs /path/out.mp4
 *
 * Env:
 *   CONCURRENCY=4     number of render workers
 *   FRAME_RANGE=0-89  optional smoke-test range
 *   SCALE=1.3333333   override output scale (default is 4/3 = 2560x1440)
 */

const output = process.argv[2];
if (!output) {
  console.error('Usage: node render-2k.mjs <output.mp4>');
  process.exit(1);
}

const scale = Number(process.env.SCALE ?? 4 / 3);
const autoConcurrency = Math.max(2, Math.min(8, os.cpus().length - 1));
const concurrency = Number(process.env.CONCURRENCY ?? autoConcurrency);
const frameRange = process.env.FRAME_RANGE
  ? process.env.FRAME_RANGE.split('-').map(Number)
  : undefined;

const log = (line) => process.stdout.write(`${line}\n`);
const hms = (seconds) => {
  const s = Math.max(0, Math.round(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h > 0 ? `${h}h ` : ''}${m}m ${String(s % 60).padStart(2, '0')}s`;
};

const started = Date.now();
log(`Bundling Remotion project from ${process.cwd()} ...`);
const serveUrl = await bundle({
  entryPoint: path.resolve('src/index.ts'),
  publicDir: path.resolve('public'),
});
const composition = await selectComposition({serveUrl, id: 'SGLangExplainer'});
const width = Math.round(composition.width * scale);
const height = Math.round(composition.height * scale);
const frameCount = frameRange
  ? frameRange[1] - frameRange[0] + 1
  : composition.durationInFrames;

fs.mkdirSync(path.dirname(output), {recursive: true});
log(`Rendering ${width}x${height} @ ${composition.fps}fps (${frameCount} frames)`);
log(`Output: ${output}`);
log(`Concurrency: ${concurrency}${frameRange ? ` | frame range: ${frameRange.join('-')}` : ''}`);

let lastPct = -1;
let lastPrint = 0;

await renderMedia({
  composition,
  serveUrl,
  outputLocation: output,
  overwrite: true,
  codec: 'h264',
  crf: 18,
  x264Preset: 'medium',
  pixelFormat: 'yuv420p',
  imageFormat: 'jpeg',
  jpegQuality: 95,
  audioCodec: 'aac',
  audioBitrate: '320k',
  concurrency,
  scale,
  frameRange,
  timeoutInMilliseconds: 120000,
  onProgress: ({progress, renderedFrames, encodedFrames, renderEstimatedTime, stitchStage}) => {
    const pct = Math.min(100, progress * 100);
    const now = Date.now();
    const force = pct >= 100;
    if (!force && pct - lastPct < 0.4 && now - lastPrint < 5000) return;
    lastPct = pct;
    lastPrint = now;
    const elapsed = (now - started) / 1000;
    const fps = renderedFrames > 0 ? renderedFrames / Math.max(1, elapsed) : 0;
    const eta = hms(renderEstimatedTime / 1000);
    log(
      `[${pct.toFixed(1).padStart(5)}%] frames ${String(renderedFrames).padStart(6)}/${frameCount} | encoded ${String(encodedFrames).padStart(6)} | ${fps.toFixed(2)} fps | ETA ${eta} | ${stitchStage}`,
    );
  },
});

const sizeMb = fs.statSync(output).size / (1024 * 1024);
log(`DONE in ${hms((Date.now() - started) / 1000)} | ${sizeMb.toFixed(1)} MB | ${output}`);
