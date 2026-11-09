import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BG} from '../theme';

export const useTime = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

/** 0→1 progress for an event starting at `start` seconds, lasting `dur` seconds. */
export const useProgress = (
  start: number,
  dur: number,
  easing: (t: number) => number = Easing.out(Easing.cubic),
) => {
  const t = useTime();
  const p = dur <= 0 ? (t >= start ? 1 : 0) : (t - start) / dur;
  return easing(Math.max(0, Math.min(1, p)));
};

export const useStarted = (start: number) => useTime() >= start;

/** Draw-on easing: slightly mechanical, like a marker. */
export const drawEase = Easing.bezier(0.2, 0, 0.2, 1);

export const progressAt = (t: number, start: number, dur: number, easing = drawEase) => {
  if (dur <= 0) return t >= start ? 1 : 0;
  return easing(Math.max(0, Math.min(1, (t - start) / dur)));
};

/** CSS pop: scale + slight rotation + fade. 0.22s default. */
export const PopIn: React.FC<{
  start: number;
  children: React.ReactNode;
  dur?: number;
  from?: number;
  rotate?: number;
  style?: React.CSSProperties;
  className?: string;
}> = ({start, children, dur = 0.24, from = 0.82, rotate = -2.5, style, className}) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const s = spring({
    frame: frame - start * fps,
    fps,
    config: {damping: 14, mass: 0.5, stiffness: 180},
    durationInFrames: Math.round(dur * fps),
  });
  const opacity = interpolate(s, [0, 0.6], [0, 1], {extrapolateRight: 'clamp'});
  const scale = from + (1 - from) * s;
  const rot = rotate * (1 - s);
  return (
    <div
      className={className}
      style={{
        ...style,
        opacity,
        transform: `scale(${scale}) rotate(${rot}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </div>
  );
};

/** Fade old content down before the next idea arrives. */
export const useDim = (dimAt: number, dur = 0.35, to = 0.18) => {
  const t = useTime();
  return interpolate(t, [dimAt, dimAt + dur], [1, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
};

export const FadeToBackground: React.FC<{start: number; dur?: number}> = ({start, dur = 0.5}) => {
  const p = useProgress(start, dur, Easing.inOut(Easing.quad));
  if (p <= 0) return null;
  return (
    <AbsoluteFill
      style={{backgroundColor: BG, opacity: p, pointerEvents: 'none', zIndex: 999}}
    />
  );
};
