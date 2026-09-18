import React, {useMemo} from 'react';
import {AbsoluteFill, random, useVideoConfig} from 'remotion';
import {C, F} from '../theme';
import {ramp, track} from '../../lib/anim';

/** Airborne dust caught in the key light. Deterministic, so renders match. */
export const Dust: React.FC<{frame: number; count?: number; opacity?: number; seed?: string}> = ({
  frame, count = 80, opacity = 1, seed = 'd',
}) => {
  const {width, height} = useVideoConfig();
  const motes = useMemo(
    () => new Array(count).fill(0).map((_, i) => ({
      x: random(`${seed}x${i}`), y: random(`${seed}y${i}`),
      r: 0.7 + random(`${seed}r${i}`) * 2.1,
      drift: 0.2 + random(`${seed}d${i}`) * 0.7,
      phase: random(`${seed}p${i}`) * Math.PI * 2,
      amp: 8 + random(`${seed}a${i}`) * 30,
      warm: random(`${seed}w${i}`) > 0.78,
    })),
    [count, seed],
  );
  const t = frame / 30;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={width} height={height} style={{position: 'absolute'}}>
        {motes.map((m, i) => {
          const y = ((m.y - t * m.drift * 0.03) % 1 + 1) % 1;
          const x = m.x + (Math.sin(t * 0.5 + m.phase) * m.amp) / width;
          const tw = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.3 + m.phase));
          return (
            <circle key={i} cx={x * width} cy={y * height} r={m.r}
              fill={m.warm ? C.brandHot : '#BFD0E6'} opacity={tw * 0.34 * opacity} />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** A hard key light raking across the set once. */
export const Sweep: React.FC<{
  frame: number; start: number; duration: number; angle?: number; strength?: number;
}> = ({frame, start, duration, angle = 100, strength = 1}) => {
  const p = track(frame, [{t: start, v: -0.4}, {t: start + duration, v: 1.4}], true);
  const fade = track(frame, [
    {t: start, v: 0}, {t: start + duration * 0.2, v: 1},
    {t: start + duration * 0.8, v: 1}, {t: start + duration, v: 0},
  ], true);
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none', mixBlendMode: 'screen'}}>
      <AbsoluteFill style={{
        opacity: 0.5 * strength * fade,
        transform: `translateX(${p * 165 - 32}%)`,
        background: `linear-gradient(${angle}deg, transparent 36%, rgba(196,216,246,0.30) 50%, transparent 64%)`,
      }} />
      <AbsoluteFill style={{
        opacity: 0.35 * strength * fade,
        transform: `translateX(${(p + 0.05) * 165 - 32}%)`,
        background: `linear-gradient(${angle}deg, transparent 42%, rgba(232,24,127,0.34) 50%, transparent 58%)`,
      }} />
    </AbsoluteFill>
  );
};

/** Marker dot, elbow leader and a two-line label pinned to a component. */
export const Callout: React.FC<{
  frame: number; start: number; x: number; y: number; dx: number; dy: number;
  title: string; sub?: string; side?: 'left' | 'right';
}> = ({frame, start, x, y, dx, dy, title, sub, side = 'right'}) => {
  const dot = ramp(frame, start, 14);
  const line = ramp(frame, start + 8, 22);
  const text = ramp(frame, start + 20, 22);
  const tail = side === 'right' ? 120 : -120;
  const anchor = side === 'right' ? 'start' : 'end';
  const pad = side === 'right' ? 14 : -14;
  const ping = ((frame - start) % 48) / 48;

  return (
    <g>
      <circle cx={x} cy={y} r={4.5 * dot} fill={C.brandHot} />
      <circle cx={x} cy={y} r={13 * dot} fill="none" stroke={C.brand} strokeOpacity={0.6} strokeWidth={1.4} />
      <circle cx={x} cy={y} r={13 + 20 * ping} fill="none" stroke={C.brand}
        strokeOpacity={dot * 0.35 * (1 - ping)} strokeWidth={1.2} />
      <path d={`M ${x} ${y} L ${x + dx * line} ${y + dy * line} L ${x + dx + tail * ramp(frame, start + 18, 18)} ${y + dy}`}
        fill="none" stroke={C.steel} strokeOpacity={0.55} strokeWidth={1.5} />
      <g opacity={text} transform={`translate(${x + dx + tail + pad}, ${y + dy})`}>
        <text textAnchor={anchor} y={-10} fill={C.ink} fontFamily={F.sans}
          fontSize={27} fontWeight={700} letterSpacing={0.3}>{title}</text>
        {sub ? (
          <text textAnchor={anchor} y={20} fill={C.mute} fontFamily={F.sans} fontSize={19}>{sub}</text>
        ) : null}
      </g>
    </g>
  );
};

/** Framing brackets that draw in from the corners. */
export const Brackets: React.FC<{
  frame: number; start: number; x: number; y: number; w: number; h: number; len?: number;
}> = ({frame, start, x, y, w, h, len = 44}) => {
  const p = ramp(frame, start, 26);
  const L = len * p;
  const seg = (px: number, py: number, dx: number, dy: number) => (
    <>
      <line x1={px} y1={py} x2={px + dx * L} y2={py} stroke={C.steel} strokeOpacity={0.4} strokeWidth={2} />
      <line x1={px} y1={py} x2={px} y2={py + dy * L} stroke={C.steel} strokeOpacity={0.4} strokeWidth={2} />
    </>
  );
  return (
    <g opacity={p}>
      {seg(x, y, 1, 1)}{seg(x + w, y, -1, 1)}
      {seg(x, y + h, 1, -1)}{seg(x + w, y + h, -1, -1)}
    </g>
  );
};
