import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_BODY, FONT_HEAD, INK} from '../theme';
import {SketchRect} from './rough';
import {Cue, useScene, useTime} from './scene';

type TProps = {
  x: number;
  y: number;
  text: string;
  size?: number;
  color?: string;
  font?: 'head' | 'body';
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
  rotate?: number;
  letterSpacing?: number;
  italic?: boolean;
  weight?: number;
  stroke?: string;
  strokeWidth?: number;
};

/** Crisp SVG label. Y is the text baseline; all sizes obey the 36px floor. */
export const T: React.FC<TProps> = ({
  x,
  y,
  text,
  size = 44,
  color = INK,
  font = 'body',
  anchor = 'start',
  opacity = 1,
  rotate = 0,
  letterSpacing = 0,
  italic = false,
  weight = 400,
  stroke,
  strokeWidth = 0,
}) => (
  <text
    x={x}
    y={y}
    fill={color}
    fontFamily={font === 'head' ? FONT_HEAD : FONT_BODY}
    fontSize={size}
    fontWeight={weight}
    textAnchor={anchor}
    opacity={opacity}
    transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
    letterSpacing={letterSpacing}
    fontStyle={italic ? 'italic' : 'normal'}
    stroke={stroke}
    strokeWidth={strokeWidth}
    paintOrder="stroke"
    style={{whiteSpace: 'pre'}}
  >
    {text}
  </text>
);

export const MultiT: React.FC<Omit<TProps, 'text' | 'y'> & {x: number; y: number; lines: string[]; lineHeight?: number}> = ({
  x,
  y,
  lines,
  lineHeight = 1.06,
  size = 44,
  ...rest
}) => (
  <g>
    {lines.map((ln, i) => (
      <T key={i} x={x} y={y + i * size * lineHeight} text={ln} size={size} {...rest} />
    ))}
  </g>
);

/** Pop-in group. Transforms around its own anchor without moving layout. */
export const PopGroup: React.FC<{
  start: number;
  children: React.ReactNode;
  x: number;
  y: number;
  from?: number;
  damping?: number;
  stiffness?: number;
  style?: React.CSSProperties;
}> = ({start, children, x, y, from = 0.72, damping = 14, stiffness = 170}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({
    frame: frame - start * fps,
    fps,
    config: {damping, mass: 0.55, stiffness},
    durationInFrames: Math.round(0.32 * fps),
  });
  const o = interpolate(s, [0, 0.55], [0, 1], {extrapolateRight: 'clamp'});
  const scale = from + (1 - from) * s;
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`}>
      {children}
    </g>
  );
};

/** Label keyed to a spoken phrase. */
export const CueT: React.FC<TProps & {
  phrase: string;
  occurrence?: number;
  fallback?: [number, number];
  delay?: number;
  mode?: 'type' | 'pop' | 'fade';
  typeDur?: number;
}> = ({
  phrase,
  occurrence = 0,
  fallback = [0, 1],
  delay = -0.06,
  mode = 'fade',
  typeDur,
  ...props
}) => {
  const t = useTime();
  const {cue} = useScene();
  const c = cue(phrase, occurrence, fallback);
  const start = Math.max(0, c.start + delay);

  if (mode === 'type') {
    const p = interpolate(t, [start, start + (typeDur ?? 0.55)], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.quad),
    });
    const n = Math.floor(p * props.text.length);
    return <T {...props} text={props.text.slice(0, n)} />;
  }

  if (mode === 'pop') {
    return (
      <PopGroup start={start} x={props.x} y={props.y}>
        <T {...props} />
      </PopGroup>
    );
  }

  const opacity = interpolate(t, [start, start + 0.3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <T {...props} opacity={(props.opacity ?? 1) * opacity} />;
};

/** A compact pill that grows around its text. */
export const CuePill: React.FC<{
  text: string;
  phrase: string;
  occurrence?: number;
  fallback?: [number, number];
  x: number;
  y: number;
  w?: number;
  h?: number;
  color?: string;
  border?: string;
  fill?: string;
  size?: number;
  delay?: number;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
}> = ({
  text,
  phrase,
  occurrence = 0,
  fallback = [0, 1],
  x,
  y,
  w,
  h = 64,
  color = INK,
  border = INK,
  fill,
  size = 42,
  delay = -0.05,
  anchor = 'middle',
  opacity = 1,
}) => {
  const t = useTime();
  const {cue} = useScene();
  const c = cue(phrase, occurrence, fallback);
  const start = Math.max(0, c.start + delay);
  const ww = w ?? Math.max(120, text.length * size * 0.53 + 54);
  const scale = interpolate(t, [start, start + 0.22], [0.8, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.3)),
  });
  const o = interpolate(t, [start, start + 0.18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const left = anchor === 'middle' ? x - ww / 2 : anchor === 'end' ? x - ww : x;
  const tx = left + ww / 2;
  return (
    <g opacity={o * opacity} transform={`translate(${tx} ${y}) scale(${scale}) translate(${-tx} ${-y})`}>
      <SketchRect x={left} y={y - h / 2} w={ww} h={h} fill={fill} radius={h / 2} strokeWidth={3.5} color={border} seed={`pill-${text}-${x}-${y}`} />
      <T x={tx} y={y + size * 0.34} text={text} size={size} color={color} anchor="middle" />
    </g>
  );
};

/** Big hero number that lands on its noun. */
export const CueNumber: React.FC<{
  value: string;
  phrase: string;
  occurrence?: number;
  fallback?: [number, number];
  x: number;
  y: number;
  size?: number;
  color?: string;
  delay?: number;
  anchor?: 'start' | 'middle' | 'end';
}> = ({value, phrase, occurrence = 0, fallback = [0, 1], x, y, size = 150, color = INK, delay = -0.05, anchor = 'middle'}) => {
  const t = useTime();
  const {cue} = useScene();
  const c = cue(phrase, occurrence, fallback);
  const start = Math.max(0, c.start + delay);
  const p = interpolate(t, [start, start + 0.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const scale = 0.86 + 0.14 * p;
  return (
    <g opacity={p} transform={`translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`}>
      <T x={x} y={y} text={value} size={size} color={color} font="head" anchor={anchor} />
    </g>
  );
};

/** Dim older supporting art as the focus moves on. */
export const useDim = (at: number, to = 0.25, dur = 0.35) => {
  const t = useTime();
  return interpolate(t, [at, at + dur], [1, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
};

export const cueFade = (t: number, c: Cue, inDur = 0.35) =>
  interpolate(t, [c.start, c.start + inDur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
