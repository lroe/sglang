import React, {useMemo} from 'react';
import rough from 'roughjs';
import type {Drawable, Options} from 'roughjs/bin/core';
import {INK} from '../theme';

const gen = rough.generator();

// Deterministic seed so a shape never "boils" between frames.
export const seedFrom = (s: string | number): number => {
  const str = String(s);
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const clamp = (v: number) => Math.max(0, Math.min(1, v));

export const baseOptions = (
  seed: string | number,
  fill?: string,
  strokeWidth = 4.5,
): Options => ({
  roughness: 1.15,
  bowing: 1.1,
  stroke: INK,
  strokeWidth,
  fill: fill ?? undefined,
  fillStyle: 'solid',
  seed: seedFrom(seed),
  preserveVertices: false,
});

type RoughProps = {
  drawable: Drawable;
  /** 0..1 stroke draw-on */
  progress?: number;
  /** 0..1 fill fade-in (usually starts as the stroke ends) */
  fillProgress?: number;
  opacity?: number;
  stroke?: string;
  strokeWidth?: number;
};

/**
 * Renders a Rough.js drawable as SVG paths.  Stroke paths are revealed with
 * pathLength=1 + dashoffset so no getTotalLength() measuring is needed.
 */
export const Rough: React.FC<RoughProps> = ({
  drawable,
  progress = 1,
  fillProgress = 1,
  opacity = 1,
  stroke,
  strokeWidth,
}) => {
  const paths = useMemo(() => gen.toPaths(drawable), [drawable]);
  const p = clamp(progress);
  const f = clamp(fillProgress);

  return (
    <g opacity={opacity}>
      {paths.map((path, i) => {
        const isFill = !path.stroke || path.stroke === 'none';
        if (isFill) {
          return (
            <path
              key={i}
              d={path.d}
              fill={path.fill ?? 'none'}
              stroke="none"
              opacity={f}
            />
          );
        }
        return (
          <path
            key={i}
            d={path.d}
            fill="none"
            stroke={stroke ?? path.stroke ?? INK}
            strokeWidth={strokeWidth ?? path.strokeWidth ?? 4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
            opacity={p <= 0 ? 0 : 1}
          />
        );
      })}
    </g>
  );
};

/* ─────────────────────────── primitives ─────────────────────────── */

export const SketchRect: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  fill?: string;
  progress?: number;
  fillProgress?: number;
  seed?: string | number;
  strokeWidth?: number;
  ticks?: boolean;
  tickProgress?: number;
  radius?: number;
  opacity?: number;
  color?: string;
}> = ({
  x,
  y,
  w,
  h,
  fill,
  progress = 1,
  fillProgress,
  seed = 'rect',
  strokeWidth = 4.5,
  ticks = false,
  tickProgress,
  radius = 0,
  opacity = 1,
  color,
}) => {
  const drawable = useMemo(() => {
    if (radius > 0) {
      return gen.path(roundedRectPath(x, y, w, h, radius), baseOptions(seed, fill, strokeWidth));
    }
    return gen.rectangle(x, y, w, h, baseOptions(seed, fill, strokeWidth));
  }, [x, y, w, h, fill, seed, strokeWidth, radius]);

  const fp = fillProgress ?? clamp((progress - 0.72) / 0.28);

  return (
    <g>
      <Rough drawable={drawable} progress={progress} fillProgress={fp} opacity={opacity} stroke={color} />
      {ticks ? (
        <CornerTicks
          x={x}
          y={y}
          w={w}
          h={h}
          progress={tickProgress ?? progress}
          seed={`${seed}-ticks`}
          opacity={opacity}
        />
      ) : null}
    </g>
  );
};

export const SketchLine: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress?: number;
  seed?: string | number;
  color?: string;
  strokeWidth?: number;
  opacity?: number;
}> = ({x1, y1, x2, y2, progress = 1, seed = 'line', color, strokeWidth = 4.5, opacity = 1}) => {
  const drawable = useMemo(
    () => gen.line(x1, y1, x2, y2, {...baseOptions(seed), strokeWidth}),
    [x1, y1, x2, y2, seed, strokeWidth],
  );
  return <Rough drawable={drawable} progress={progress} opacity={opacity} stroke={color} strokeWidth={strokeWidth} />;
};

export const SketchEllipse: React.FC<{
  cx: number;
  cy: number;
  w: number;
  h: number;
  fill?: string;
  progress?: number;
  fillProgress?: number;
  seed?: string | number;
  strokeWidth?: number;
  opacity?: number;
  color?: string;
}> = ({cx, cy, w, h, fill, progress = 1, fillProgress, seed = 'ellipse', strokeWidth = 4.5, opacity = 1, color}) => {
  const drawable = useMemo(
    () => gen.ellipse(cx, cy, w, h, baseOptions(seed, fill, strokeWidth)),
    [cx, cy, w, h, fill, seed, strokeWidth],
  );
  return (
    <Rough
      drawable={drawable}
      progress={progress}
      fillProgress={fillProgress ?? clamp((progress - 0.7) / 0.3)}
      opacity={opacity}
      stroke={color}
    />
  );
};

export const SketchPolygon: React.FC<{
  points: [number, number][];
  fill?: string;
  progress?: number;
  fillProgress?: number;
  seed?: string | number;
  strokeWidth?: number;
  color?: string;
  opacity?: number;
}> = ({points, fill, progress = 1, fillProgress, seed = 'poly', strokeWidth = 4.5, color, opacity = 1}) => {
  const drawable = useMemo(
    () => gen.polygon(points, baseOptions(seed, fill, strokeWidth)),
    [points, fill, seed, strokeWidth],
  );
  return (
    <Rough
      drawable={drawable}
      progress={progress}
      fillProgress={fillProgress ?? clamp((progress - 0.7) / 0.3)}
      stroke={color}
      opacity={opacity}
    />
  );
};

export const SketchPath: React.FC<{
  d: string;
  fill?: string;
  progress?: number;
  fillProgress?: number;
  seed?: string | number;
  strokeWidth?: number;
  color?: string;
  opacity?: number;
}> = ({d, fill, progress = 1, fillProgress, seed = 'path', strokeWidth = 4.5, color, opacity = 1}) => {
  const drawable = useMemo(
    () => gen.path(d, baseOptions(seed, fill, strokeWidth)),
    [d, fill, seed, strokeWidth],
  );
  return (
    <Rough
      drawable={drawable}
      progress={progress}
      fillProgress={fillProgress ?? clamp((progress - 0.65) / 0.35)}
      stroke={color}
      strokeWidth={strokeWidth}
      opacity={opacity}
    />
  );
};

/* ─────────────────────────── helpers ─────────────────────────── */

export const CornerTicks: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  progress?: number;
  seed?: string | number;
  opacity?: number;
}> = ({x, y, w, h, progress = 1, seed = 'ticks', opacity = 1}) => {
  const corners: [number, number][] = [
    [x, y],
    [x + w, y],
    [x, y + h],
    [x + w, y + h],
  ];
  const len = 11;
  return (
    <g opacity={opacity}>
      {corners.map(([cx, cy], i) => (
        <g key={i}>
          <SketchLine
            x1={cx - len}
            y1={cy}
            x2={cx + len}
            y2={cy}
            progress={progress}
            seed={`${seed}-h${i}`}
            strokeWidth={3}
          />
          <SketchLine
            x1={cx}
            y1={cy - len}
            x2={cx}
            y2={cy + len}
            progress={progress}
            seed={`${seed}-v${i}`}
            strokeWidth={3}
          />
        </g>
      ))}
    </g>
  );
};

export const roundedRectPath = (x: number, y: number, w: number, h: number, r: number) => {
  const rr = Math.min(r, w / 2, h / 2);
  return [
    `M ${x + rr} ${y}`,
    `H ${x + w - rr}`,
    `Q ${x + w} ${y} ${x + w} ${y + rr}`,
    `V ${y + h - rr}`,
    `Q ${x + w} ${y + h} ${x + w - rr} ${y + h}`,
    `H ${x + rr}`,
    `Q ${x} ${y + h} ${x} ${y + h - rr}`,
    `V ${y + rr}`,
    `Q ${x} ${y} ${x + rr} ${y}`,
    'Z',
  ].join(' ');
};

/** Wavy closed cloud outline with soft scallops. */
export const cloudPath = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  lobes = 12,
  seed = 7,
): string => {
  const pts: {x: number; y: number}[] = [];
  for (let i = 0; i < lobes; i++) {
    const a = (i / lobes) * Math.PI * 2;
    const wob = 0.94 + 0.06 * Math.sin(i * 2.7 + seed);
    pts.push({x: cx + Math.cos(a) * rx * wob, y: cy + Math.sin(a) * ry * wob});
  }
  // midpoint of each pair, pushed slightly outward -> scallop
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < lobes; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % lobes];
    const mx = (p1.x + p2.x) / 2;
    const my = (p1.y + p2.y) / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const mag = Math.hypot(dx, dy) || 1;
    const out = 1.035;
    const qx = cx + dx * out;
    const qy = cy + dy * out;
    d += ` Q ${qx.toFixed(2)} ${qy.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d + ' Z';
};

/** Long curly brace. side='left' puts the cusp on the left (like `}`). */
export const bracePath = (x: number, y: number, w: number, h: number, side: 'left' | 'right') => {
  const cusp = side === 'left' ? x : x + w;
  const back = side === 'left' ? x + w : x;
  const mid = y + h / 2;
  const r = Math.min(28, h / 6);
  const dir = side === 'left' ? 1 : -1;
  return [
    `M ${back} ${y}`,
    `C ${back + dir * r} ${y} ${cusp} ${y + r * 0.2} ${cusp} ${y + r}`,
    `L ${cusp} ${mid - r}`,
    `C ${cusp} ${mid - r * 0.3} ${cusp - dir * r * 0.7} ${mid} ${cusp - dir * r} ${mid}`,
    `C ${cusp - dir * r * 0.7} ${mid} ${cusp} ${mid + r * 0.3} ${cusp} ${mid + r}`,
    `L ${cusp} ${y + h - r}`,
    `C ${cusp} ${y + h - r * 0.2} ${back + dir * r} ${y + h} ${back} ${y + h}`,
  ].join(' ');
};

export {clamp};

/* ─────────────────────────── extra marks ─────────────────────────── */

export const SketchArrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress?: number;
  color?: string;
  strokeWidth?: number;
  head?: number;
  seed?: string | number;
  opacity?: number;
}> = ({x1, y1, x2, y2, progress = 1, color, strokeWidth = 4.5, head = 18, seed = 'arrow', opacity = 1}) => {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const a1 = ang + Math.PI * 0.78;
  const a2 = ang - Math.PI * 0.78;
  return (
    <g opacity={opacity}>
      <SketchLine x1={x1} y1={y1} x2={x2} y2={y2} progress={progress} seed={`${seed}-shaft`} color={color} strokeWidth={strokeWidth} />
      <SketchLine
        x1={x2}
        y1={y2}
        x2={x2 + Math.cos(a1) * head}
        y2={y2 + Math.sin(a1) * head}
        progress={progress}
        seed={`${seed}-h1`}
        color={color}
        strokeWidth={strokeWidth}
      />
      <SketchLine
        x1={x2}
        y1={y2}
        x2={x2 + Math.cos(a2) * head}
        y2={y2 + Math.sin(a2) * head}
        progress={progress}
        seed={`${seed}-h2`}
        color={color}
        strokeWidth={strokeWidth}
      />
    </g>
  );
};

export const SketchCheck: React.FC<{
  x: number;
  y: number;
  size?: number;
  progress?: number;
  color?: string;
  strokeWidth?: number;
  seed?: string | number;
}> = ({x, y, size = 34, progress = 1, color = INK, strokeWidth = 5, seed = 'check'}) => (
  <g>
    <SketchLine x1={x} y1={y} x2={x + size * 0.34} y2={y + size * 0.38} progress={progress} seed={`${seed}-1`} color={color} strokeWidth={strokeWidth} />
    <SketchLine
      x1={x + size * 0.34}
      y1={y + size * 0.38}
      x2={x + size}
      y2={y - size * 0.32}
      progress={progress}
      seed={`${seed}-2`}
      color={color}
      strokeWidth={strokeWidth}
    />
  </g>
);

export const SketchCross: React.FC<{
  x: number;
  y: number;
  size?: number;
  progress?: number;
  color?: string;
  strokeWidth?: number;
  seed?: string | number;
}> = ({x, y, size = 34, progress = 1, color = INK, strokeWidth = 5, seed = 'cross'}) => (
  <g>
    <SketchLine x1={x} y1={y} x2={x + size} y2={y + size} progress={progress} seed={`${seed}-1`} color={color} strokeWidth={strokeWidth} />
    <SketchLine x1={x + size} y1={y} x2={x} y2={y + size} progress={progress} seed={`${seed}-2`} color={color} strokeWidth={strokeWidth} />
  </g>
);

export const SketchCircle: React.FC<{
  cx: number;
  cy: number;
  r: number;
  fill?: string;
  progress?: number;
  fillProgress?: number;
  seed?: string | number;
  strokeWidth?: number;
  color?: string;
  opacity?: number;
}> = ({cx, cy, r, fill, progress = 1, fillProgress, seed = 'circle', strokeWidth = 3, color, opacity = 1}) => (
  <SketchEllipse
    cx={cx}
    cy={cy}
    w={r * 2}
    h={r * 2}
    fill={fill}
    progress={progress}
    fillProgress={fillProgress}
    seed={seed}
    strokeWidth={strokeWidth}
    color={color}
    opacity={opacity}
  />
);
