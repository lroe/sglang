import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT_HEAD, INK} from '../theme';

/**
 * Hand-written type-on.  The full string reserves its final layout so the
 * centre/left anchor never drifts while characters appear.
 */
export const TypeOn: React.FC<{
  text: string;
  start: number;
  dur: number;
  style?: React.CSSProperties;
  align?: 'left' | 'center' | 'right';
}> = ({text, start, dur, style, align = 'left'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = dur <= 0 ? (t >= start ? 1 : 0) : Math.max(0, Math.min(1, (t - start) / dur));
  const n = Math.floor(p * text.length + (p >= 1 ? 1 : 0));
  const visible = text.slice(0, n);

  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        whiteSpace: 'pre',
        textAlign: align,
        ...style,
      }}
    >
      {/* invisible sizer keeps final width */}
      <span style={{visibility: 'hidden'}}>{text}</span>
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          whiteSpace: 'pre',
          textAlign: align,
        }}
      >
        {visible}
      </span>
    </span>
  );
};

export const HandTitle: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  size?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
  rotate?: number;
  opacity?: number;
  width?: number;
}> = ({children, x, y, size = 76, color = INK, align = 'left', rotate = 0, opacity = 1, width}) => {
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        transform: `translateX(${tx}) rotate(${rotate}deg)`,
        fontFamily: FONT_HEAD,
        fontSize: size,
        lineHeight: 0.98,
        color,
        opacity,
        letterSpacing: '-0.01em',
        whiteSpace: 'pre',
        textAlign: align,
        transformOrigin: 'left top',
      }}
    >
      {children}
    </div>
  );
};
