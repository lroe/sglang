import React, {createContext, useContext, useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {BG, INK} from '../theme';
import {findPhrase, PhraseHit} from '../timing';

export type Cue = {start: number; end: number; absStart: number; absEnd: number};

export type SceneCtx = {
  start: number;
  end: number;
  /** Find a spoken phrase and convert it to scene-local seconds. */
  cue: (phrase: string, occurrence?: number, fallback?: [number, number]) => Cue;
  hit: (phrase: string, occurrence?: number) => PhraseHit | null;
};

const fallbackCtx: SceneCtx = {
  start: 0,
  end: 0,
  cue: (_p, _o, fallback = [0, 0]) => ({start: fallback[0], end: fallback[1], absStart: fallback[0], absEnd: fallback[1]}),
  hit: () => null,
};

const Ctx = createContext<SceneCtx>(fallbackCtx);

export const useScene = () => useContext(Ctx);

export const SceneFrame: React.FC<{
  start: number;
  end: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({start, end, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const localEnd = end - start;

  const value = useMemo<SceneCtx>(() => {
    const cue: SceneCtx['cue'] = (phrase, occurrence = 0, fallback = [0, 0]) => {
      const h = findPhrase(phrase, occurrence);
      if (!h) {
        if (typeof window !== 'undefined') {
          // eslint-disable-next-line no-console
          console.warn('[timing] missing phrase:', phrase, '— fallback', fallback);
        }
        return {
          start: Math.max(0, fallback[0] - start),
          end: Math.max(0, fallback[1] - start),
          absStart: fallback[0],
          absEnd: fallback[1],
        };
      }
      return {
        start: Math.max(0, h.start - start),
        end: Math.max(0, h.end - start),
        absStart: h.start,
        absEnd: h.end,
      };
    };
    return {start, end, cue, hit: (p, o = 0) => findPhrase(p, o)};
  }, [start, end]);

  // 5-frame fade through the Dracula page at every cut (0.167s at 30fps).
  const fadeDur = 5 / fps;
  const opacity = Math.min(
    interpolate(t, [0, fadeDur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(t, [localEnd - fadeDur, localEnd], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );

  return (
    <Ctx.Provider value={value}>
      <AbsoluteFill style={{backgroundColor: BG, color: INK, ...style}}>
        <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>
      </AbsoluteFill>
    </Ctx.Provider>
  );
};

export const useTime = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

export const drawEase = Easing.bezier(0.2, 0, 0.2, 1);
export const softEase = Easing.inOut(Easing.quad);

export const prog = (t: number, start: number, dur: number, easing = drawEase) => {
  if (dur <= 0) return t >= start ? 1 : 0;
  return easing(Math.max(0, Math.min(1, (t - start) / dur)));
};

export const fade = (t: number, inAt: number, outAt = 1e9, inDur = 0.35, outDur = 0.3) =>
  Math.min(
    interpolate(t, [inAt, inAt + inDur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(t, [outAt, outAt + outDur], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );

export const dim = (t: number, at: number, dur = 0.35, to = 0.28) =>
  interpolate(t, [at, at + dur], [1, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg
    width="1920"
    height="1080"
    viewBox="0 0 1920 1080"
    style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}
  >
    {children}
  </svg>
);

export const useDim = (at: number, to = 0.28, dur = 0.35) => {
  const t = useTime();
  return interpolate(t, [at, at + dur], [1, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
};
