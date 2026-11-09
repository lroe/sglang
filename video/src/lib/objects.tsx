import React from 'react';
import {BG, INK, MUTED, SURFACE, SURFACE_2, WELL, GREEN, RED, CYAN, PURPLE, ORANGE, YELLOW, PINK, COMMENT} from '../theme';
import {T} from './copy';
import {prog} from './scene';
import {
  SketchArrow,
  SketchCheck,
  SketchCircle,
  SketchCross,
  SketchEllipse,
  SketchLine,
  SketchPath,
  SketchRect,
  SketchPolygon,
  roundedRectPath,
} from './rough';

/* ─────────────────────────── panels & cards ─────────────────────────── */

export const Panel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  sub?: string;
  color?: string;
  fill?: string;
  progress?: number;
  radius?: number;
  seed?: string;
  titleSize?: number;
  opacity?: number;
  ticks?: boolean;
}> = ({x, y, w, h, title, sub, color = INK, fill = SURFACE, progress = 1, radius = 16, seed = 'panel', titleSize = 44, opacity = 1, ticks = false}) => (
  <g opacity={opacity}>
    <SketchRect x={x} y={y} w={w} h={h} fill={fill} progress={progress} radius={radius} seed={seed} strokeWidth={4} color={color} ticks={ticks} />
    {title ? <T x={x + w / 2} y={y + (sub ? 58 : h / 2 + titleSize * 0.34)} text={title} size={titleSize} color={color} anchor="middle" font="head" /> : null}
    {sub ? <T x={x + w / 2} y={y + 104} text={sub} size={38} color={MUTED} anchor="middle" /> : null}
  </g>
);

export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  color?: string;
  fill?: string;
  progress?: number;
  size?: number;
  seed?: string;
  opacity?: number;
}> = ({x, y, w, h, lines, color = INK, fill = SURFACE, progress = 1, size = 42, seed = 'card', opacity = 1}) => {
  const gap = size * 1.12;
  const top = y + h / 2 - ((lines.length - 1) * gap) / 2 + size * 0.34;
  return (
    <g opacity={opacity}>
      <SketchRect x={x} y={y} w={w} h={h} fill={fill} progress={progress} radius={14} seed={seed} strokeWidth={4} color={color} />
      {lines.map((l, i) => (
        <T key={i} x={x + w / 2} y={top + i * gap} text={l} size={size} color={color} anchor="middle" />
      ))}
    </g>
  );
};

export const TokenSquare: React.FC<{
  x: number;
  y: number;
  s?: number;
  fill?: string;
  color?: string;
  progress?: number;
  label?: string;
  opacity?: number;
  seed?: string;
}> = ({x, y, s = 24, fill = SURFACE_2, color = INK, progress = 1, label, opacity = 1, seed = 'tok'}) => (
  <g opacity={opacity}>
    <SketchRect x={x} y={y} w={s} h={s} fill={fill} progress={progress} radius={4} seed={seed} strokeWidth={3} color={color} />
    {label ? <T x={x + s / 2} y={y + s * 0.65} text={label} size={Math.max(18, s * 0.45)} color={color} anchor="middle" /> : null}
  </g>
);

export const TokenRow: React.FC<{
  x: number;
  y: number;
  n: number;
  s?: number;
  gap?: number;
  fill?: string;
  color?: string;
  progress?: number;
  startIndex?: number;
  opacity?: number;
  seed?: string;
}> = ({x, y, n, s = 24, gap = 10, fill = SURFACE_2, color = INK, progress = 1, startIndex = 0, opacity = 1, seed = 'row'}) => (
  <g opacity={opacity}>
    {Array.from({length: n}).map((_, i) => (
      <TokenSquare key={i} x={x + i * (s + gap)} y={y} s={s} fill={fill} color={color} progress={progress} seed={`${seed}-${startIndex + i}`} />
    ))}
  </g>
);

/* ─────────────────────────── tech objects ─────────────────────────── */

export const ChatWindow: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  progress?: number;
  label?: string;
  bubbles?: {text: string; y: number; side?: 'left' | 'right'; color?: string; opacity?: number; w?: number}[];
  accent?: string;
  opacity?: number;
}> = ({x, y, w, h, progress = 1, label = 'chat', bubbles = [], accent = GREEN, opacity = 1}) => (
  <g opacity={opacity}>
    <SketchRect x={x} y={y} w={w} h={h} fill={WELL} progress={progress} radius={24} seed={`chat-${x}-${y}`} strokeWidth={4} color={INK} />
    <SketchLine x1={x + 14} y1={y + 62} x2={x + w - 14} y2={y + 62} progress={progress} seed={`chat-${x}-${y}-rule`} strokeWidth={3} color={SURFACE_2} />
    <SketchCircle cx={x + 30} cy={y + 32} r={5} progress={progress} fill={RED} seed={`chat-${x}-r`} strokeWidth={0} />
    <SketchCircle cx={x + 50} cy={y + 32} r={5} progress={progress} fill={YELLOW} seed={`chat-${x}-y`} strokeWidth={0} />
    <SketchCircle cx={x + 70} cy={y + 32} r={5} progress={progress} fill={GREEN} seed={`chat-${x}-g`} strokeWidth={0} />
    <T x={x + w / 2} y={y + 45} text={label} size={36} color={MUTED} anchor="middle" />
    {bubbles.map((b, i) => {
      const bw = b.w ?? Math.min(w - 64, Math.max(170, b.text.length * 20 + 44));
      const bx = b.side === 'right' ? x + w - 24 - bw : x + 24;
      return (
        <g key={i} opacity={b.opacity ?? 1}>
          <SketchRect x={bx} y={y + b.y} w={bw} h={52} fill={b.side === 'right' ? accent : SURFACE_2} progress={1} radius={18} seed={`bub-${x}-${i}`} strokeWidth={3} color={b.color ?? INK} />
          <T x={bx + 20} y={y + b.y + 35} text={b.text} size={36} color={b.side === 'right' ? BG : INK} />
        </g>
      );
    })}
  </g>
);

export const GPUChip: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  progress?: number;
  label?: string;
  sub?: string;
  color?: string;
  fill?: string;
  opacity?: number;
  seed?: string;
  pins?: boolean;
}> = ({x, y, w = 340, h = 220, progress = 1, label = 'GPU', sub, color = CYAN, fill = SURFACE, opacity = 1, seed = 'gpu', pins = true}) => (
  <g opacity={opacity}>
    {pins
      ? Array.from({length: 5}).map((_, i) => (
          <g key={i}>
            <SketchLine x1={x - 18} y1={y + 30 + i * 38} x2={x} y2={y + 30 + i * 38} progress={progress} seed={`${seed}-pin-l-${i}`} strokeWidth={3} color={color} />
            <SketchLine x1={x + w} y1={y + 30 + i * 38} x2={x + w + 18} y2={y + 30 + i * 38} progress={progress} seed={`${seed}-pin-r-${i}`} strokeWidth={3} color={color} />
          </g>
        ))
      : null}
    <SketchRect x={x} y={y} w={w} h={h} fill={fill} progress={progress} radius={18} seed={seed} strokeWidth={4} color={INK} />
    <SketchRect x={x + 32} y={y + 32} w={w - 64} h={h - 64} fill={WELL} progress={progress} radius={8} seed={`${seed}-die`} strokeWidth={3} color={color} />
    <T x={x + w / 2} y={y + h / 2 + 4} text={label} size={44} color={color} anchor="middle" font="head" />
    {sub ? <T x={x + w / 2} y={y + h / 2 + 48} text={sub} size={36} color={MUTED} anchor="middle" /> : null}
  </g>
);

export const Person: React.FC<{
  x: number;
  y: number;
  scale?: number;
  color?: string;
  progress?: number;
  reading?: boolean;
  opacity?: number;
  book?: boolean;
  hat?: boolean;
}> = ({x, y, scale = 1, color = INK, progress = 1, reading = false, opacity = 1, book = false, hat = false}) => (
  <g opacity={opacity} transform={`translate(${x} ${y}) scale(${scale})`}>
    <SketchCircle cx={0} cy={-128} r={36} progress={progress} color={color} strokeWidth={4} seed={`person-head-${x}-${y}`} />
    <SketchLine x1={0} y1={-92} x2={0} y2={6} progress={progress} seed={`person-body-${x}-${y}`} color={color} strokeWidth={4} />
    <SketchLine x1={0} y1={-62} x2={-58} y2={-10} progress={progress} seed={`person-arm-l-${x}-${y}`} color={color} strokeWidth={4} />
    <SketchLine x1={0} y1={-62} x2={58} y2={-10} progress={progress} seed={`person-arm-r-${x}-${y}`} color={color} strokeWidth={4} />
    <SketchLine x1={0} y1={6} x2={-42} y2={82} progress={progress} seed={`person-leg-l-${x}-${y}`} color={color} strokeWidth={4} />
    <SketchLine x1={0} y1={6} x2={42} y2={82} progress={progress} seed={`person-leg-r-${x}-${y}`} color={color} strokeWidth={4} />
    {reading ? <SketchCircle cx={0} cy={-130} r={4} progress={progress} fill={color} seed={`person-eye-${x}-${y}`} strokeWidth={0} /> : null}
    {book ? (
      <g transform="translate(-60 30)">
        <SketchPath d="M0 0 L60 -20 L120 0 L120 74 L60 54 L0 74 Z" fill={SURFACE_2} progress={progress} seed={`book-${x}-${y}`} strokeWidth={3} color={color} />
        <SketchLine x1={60} y1={-20} x2={60} y2={54} progress={progress} seed={`book-spine-${x}-${y}`} strokeWidth={3} color={color} />
      </g>
    ) : null}
    {hat ? (
      <g>
        <SketchLine x1={-38} y1={-168} x2={38} y2={-168} progress={progress} seed={`hat-brim-${x}-${y}`} color={color} strokeWidth={4} />
        <SketchRect x={-24} y={-204} w={48} h={36} fill={SURFACE_2} progress={progress} radius={4} seed={`hat-top-${x}-${y}`} strokeWidth={3} color={color} />
      </g>
    ) : null}
  </g>
);

export const FolderIcon: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  color?: string;
  fill?: string;
  progress?: number;
  opacity?: number;
  seed?: string;
  labelSize?: number;
}> = ({x, y, w = 210, h = 104, label, color = INK, fill = SURFACE, progress = 1, opacity = 1, seed = 'folder', labelSize = 40}) => {
  const d = `M ${x} ${y + 18} Q ${x} ${y} ${x + 18} ${y} H ${x + w * 0.36} Q ${x + w * 0.36 + 14} ${y} ${x + w * 0.36 + 24} ${y + 16} L ${x + w * 0.42} ${y + 26} H ${x + w - 18} Q ${x + w} ${y + 26} ${x + w} ${y + 44} V ${y + h - 16} Q ${x + w} ${y + h} ${x + w - 16} ${y + h} H ${x + 16} Q ${x} ${y + h} ${x} ${y + h - 16} Z`;
  return (
    <g opacity={opacity}>
      <SketchPath d={d} fill={fill} progress={progress} seed={seed} strokeWidth={4} color={color} />
      {label ? (
        <g opacity={Math.max(0, Math.min(1, progress))}>
          <T x={x + w / 2} y={y + h / 2 + 18} text={label} size={labelSize} color={color} anchor="middle" font="body" />
        </g>
      ) : null}
    </g>
  );
};

export const Phone: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  progress?: number;
  opacity?: number;
  children?: React.ReactNode;
  accent?: string;
  seed?: string;
}> = ({x, y, w = 300, h = 560, progress = 1, opacity = 1, children, accent = GREEN, seed = 'phone'}) => (
  <g opacity={opacity}>
    <SketchRect x={x} y={y} w={w} h={h} fill={WELL} progress={progress} radius={38} seed={seed} strokeWidth={4} color={INK} />
    <SketchRect x={x + 16} y={y + 38} w={w - 32} h={h - 92} fill={SURFACE} progress={progress} radius={20} seed={`${seed}-screen`} strokeWidth={3} color={SURFACE_2} />
    <SketchLine x1={x + w / 2 - 36} y1={y + 20} x2={x + w / 2 + 36} y2={y + 20} progress={progress} seed={`${seed}-notch`} strokeWidth={6} color={accent} />
    <SketchCircle cx={x + w / 2} cy={y + h - 28} r={10} progress={progress} color={INK} strokeWidth={3} seed={`${seed}-home`} />
    {children}
  </g>
);

export const Server: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  progress?: number;
  opacity?: number;
  color?: string;
  lit?: boolean;
  seed?: string;
}> = ({x, y, w = 220, h = 150, label, progress = 1, opacity = 1, color = INK, lit = true, seed = 'server'}) => (
  <g opacity={opacity}>
    <SketchRect x={x} y={y} w={w} h={h} fill={SURFACE} progress={progress} radius={12} seed={seed} strokeWidth={4} color={color} />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <SketchRect x={x + 18} y={y + 18 + i * 38} w={w - 54} h={24} fill={WELL} progress={progress} radius={5} seed={`${seed}-slot-${i}`} strokeWidth={3} color={SURFACE_2} />
        <SketchCircle cx={x + w - 24} cy={y + 30 + i * 38} r={5} progress={progress} fill={lit ? GREEN : RED} seed={`${seed}-led-${i}`} strokeWidth={0} />
      </g>
    ))}
    {label ? <T x={x + w / 2} y={y + h + 40} text={label} size={38} color={MUTED} anchor="middle" /> : null}
  </g>
);

export const JsonCard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  progress?: number;
  opacity?: number;
  lines?: {text: string; color?: string; indent?: number; strike?: boolean}[];
  title?: string;
  titleColor?: string;
  seed?: string;
  codeSize?: number;
}> = ({x, y, w, h, progress = 1, opacity = 1, lines = [], title = 'JSON', titleColor = CYAN, seed = 'json', codeSize = 42}) => (
  <g opacity={opacity}>
    <SketchRect x={x} y={y} w={w} h={h} fill={WELL} progress={progress} radius={18} seed={seed} strokeWidth={4} color={INK} />
    <SketchLine x1={x + 16} y1={y + 58} x2={x + w - 16} y2={y + 58} progress={progress} seed={`${seed}-rule`} strokeWidth={3} color={SURFACE_2} />
    <T x={x + 30} y={y + 42} text={title} size={36} color={titleColor} font="head" />
    {lines.map((l, i) => (
      <g key={i} opacity={l.strike ? 0.45 : 1}>
        <T x={x + 34 + (l.indent ?? 0)} y={y + 108 + i * (codeSize * 1.22)} text={l.text} size={codeSize} color={l.color ?? INK} font="body" />
        {l.strike ? <SketchLine x1={x + 28 + (l.indent ?? 0)} y1={y + 96 + i * (codeSize * 1.22)} x2={x + w - 28} y2={y + 96 + i * (codeSize * 1.22)} progress={1} seed={`${seed}-strike-${i}`} color={RED} strokeWidth={3} /> : null}
      </g>
    ))}
  </g>
);

export const CodeSheet: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  progress?: number;
  opacity?: number;
  lines: {text: string; color?: string; indent?: number; strike?: boolean}[];
  title?: string;
  seed?: string;
  codeSize?: number;
}> = ({x, y, w, h, progress = 1, opacity = 1, lines, title, seed = 'sheet', codeSize = 40}) => (
  <g opacity={opacity}>
    <SketchRect x={x} y={y} w={w} h={h} fill={SURFACE} progress={progress} radius={14} seed={seed} strokeWidth={4} color={INK} />
    {title ? <T x={x + 30} y={y + 46} text={title} size={38} color={MUTED} font="head" /> : null}
    {lines.map((l, i) => (
      <g key={i} opacity={l.strike ? 0.5 : 1}>
        <T x={x + 34 + (l.indent ?? 0)} y={y + (title ? 94 : 56) + i * (codeSize * 1.28)} text={l.text} size={codeSize} color={l.color ?? INK} font="body" />
        {l.strike ? <SketchLine x1={x + 26 + (l.indent ?? 0)} y1={y + (title ? 82 : 44) + i * (codeSize * 1.28)} x2={x + w - 26} y2={y + (title ? 82 : 44) + i * (codeSize * 1.28)} progress={1} seed={`${seed}-s-${i}`} color={RED} strokeWidth={3} /> : null}
      </g>
    ))}
  </g>
);

export const TreeEdge: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress?: number;
  color?: string;
  width?: number;
  seed?: string;
  opacity?: number;
}> = ({x1, y1, x2, y2, progress = 1, color = COMMENT, width = 3.5, seed = 'edge', opacity = 1}) => {
  const midY = (y1 + y2) / 2;
  return (
    <SketchPath
      d={`M ${x1} ${y1} V ${midY} Q ${x1} ${midY + 12} ${x1 + (x2 > x1 ? 12 : -12)} ${midY + 12} H ${x2 + (x2 > x1 ? -12 : 12)} Q ${x2} ${midY + 12} ${x2} ${midY + 24} V ${y2}`}
      progress={progress}
      seed={seed}
      color={color}
      strokeWidth={width}
      opacity={opacity}
    />
  );
};

export const TreeNode: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
  color?: string;
  fill?: string;
  progress?: number;
  opacity?: number;
  seed?: string;
  labelSize?: number;
  glow?: number;
}> = ({x, y, w = 220, h = 88, label, sub, color = INK, fill = SURFACE, progress = 1, opacity = 1, seed = 'node', labelSize = 44, glow = 0}) => (
  <g opacity={opacity}>
    {glow > 0 ? <SketchRect x={x - 8} y={y - 8} w={w + 16} h={h + 16} fill="none" progress={glow} radius={18} seed={`${seed}-glow`} strokeWidth={3} color={GREEN} opacity={0.45} /> : null}
    <SketchRect x={x} y={y} w={w} h={h} fill={fill} progress={progress} radius={12} seed={seed} strokeWidth={4} color={color} />
    <g opacity={Math.max(0, Math.min(1, progress))}>
      <T x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + labelSize * 0.34)} text={label} size={labelSize} color={color} anchor="middle" />
      {sub ? <T x={x + w / 2} y={y + h / 2 + 42} text={sub} size={36} color={MUTED} anchor="middle" /> : null}
    </g>
  </g>
);

export const WavyUnderline: React.FC<{
  x1: number;
  x2: number;
  y: number;
  progress?: number;
  color?: string;
  seed?: string;
  width?: number;
}> = ({x1, x2, y, progress = 1, color = GREEN, seed = 'under', width = 4}) => {
  const amp = 5;
  const seg = 8;
  let d = `M ${x1} ${y}`;
  for (let x = x1; x < x2; x += seg) {
    const nx = Math.min(x2, x + seg);
    const up = Math.round((x - x1) / seg) % 2 === 0 ? -amp : amp;
    d += ` Q ${(x + nx) / 2} ${y + up} ${nx} ${y}`;
  }
  return <SketchPath d={d} progress={progress} seed={seed} color={color} strokeWidth={width} />;
};

export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  progress?: number;
  color?: string;
  width?: number;
  dash?: boolean;
  seed?: string;
  opacity?: number;
}> = ({x1, y1, x2, y2, progress = 1, color = INK, width = 4, dash = false, seed = 'arrow', opacity = 1}) => {
  if (!dash) return <SketchArrow x1={x1} y1={y1} x2={x2} y2={y2} progress={progress} color={color} strokeWidth={width} seed={seed} opacity={opacity} />;
  // dotted arrow shaft for "automatic / optional" paths
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const len = Math.hypot(x2 - x1, y2 - y1);
  const n = Math.max(2, Math.round(len / 26));
  return (
    <g opacity={opacity}>
      {Array.from({length: n}).map((_, i) => {
        const a = (i / n) * len;
        const b = ((i + 0.45) / n) * len;
        return (
          <SketchLine
            key={i}
            x1={x1 + Math.cos(ang) * a}
            y1={y1 + Math.sin(ang) * a}
            x2={x1 + Math.cos(ang) * b}
            y2={y1 + Math.sin(ang) * b}
            progress={progress}
            color={color}
            strokeWidth={width}
            seed={`${seed}-${i}`}
          />
        );
      })}
      <SketchArrow x1={x2 - Math.cos(ang) * 2} y1={y2 - Math.sin(ang) * 2} x2={x2} y2={y2} progress={progress} color={color} strokeWidth={width} seed={`${seed}-head`} />
    </g>
  );
};

export const CheckMark: React.FC<{x: number; y: number; size?: number; progress?: number; color?: string}> = ({x, y, size = 30, progress = 1, color = GREEN}) => (
  <SketchCheck x={x} y={y} size={size} progress={progress} color={color} strokeWidth={4} seed={`check-${x}-${y}`} />
);

export const CrossMark: React.FC<{x: number; y: number; size?: number; progress?: number; color?: string}> = ({x, y, size = 26, progress = 1, color = RED}) => (
  <SketchCross x={x} y={y} size={size} progress={progress} color={color} strokeWidth={4} seed={`cross-${x}-${y}`} />
);

export const StackedPrompt: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  n?: number;
  color?: string;
  progress?: number;
  opacity?: number;
  label?: string;
}> = ({x, y, w, h, n = 4, color = INK, progress = 1, opacity = 1, label}) => (
  <g opacity={opacity}>
    {Array.from({length: n}).map((_, i) => (
      <SketchRect key={i} x={x + (n - 1 - i) * 10} y={y - (n - 1 - i) * 10} w={w} h={h} fill={i === 0 ? SURFACE : SURFACE_2} progress={progress} radius={8} seed={`stack-${x}-${y}-${i}`} strokeWidth={3} color={i === 0 ? color : COMMENT} />
    ))}
    {label ? <T x={x + w / 2} y={y + h / 2 + 14} text={label} size={40} color={color} anchor="middle" /> : null}
  </g>
);
