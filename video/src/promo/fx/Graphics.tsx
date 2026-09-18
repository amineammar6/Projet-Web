import React from 'react';
import {C, F} from '../theme';
import {ramp, track} from '../../lib/anim';

/** Concentric technical rings, drawn on then slowly counter-rotating. */
export const TechRing: React.FC<{
  frame: number; x: number; y: number; r: number; start: number; label?: string;
}> = ({frame, x, y, r, start, label}) => {
  const p = ramp(frame, start, 34);
  const spin = (frame - start) * 0.22;
  const c = 2 * Math.PI * r;
  return (
    <g opacity={p}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.teal} strokeOpacity={0.55}
        strokeWidth={1.5} strokeDasharray={`${c}`} strokeDashoffset={c * (1 - p)}
        transform={`rotate(${-90} ${x} ${y})`} />
      <circle cx={x} cy={y} r={r * 0.78} fill="none" stroke={C.navy} strokeOpacity={0.22}
        strokeWidth={1} strokeDasharray="4 10" transform={`rotate(${spin} ${x} ${y})`} />
      <circle cx={x} cy={y} r={r * 1.16} fill="none" stroke={C.navy} strokeOpacity={0.13}
        strokeWidth={1} strokeDasharray="2 16" transform={`rotate(${-spin * 0.6} ${x} ${y})`} />
      {[0, 90, 180, 270].map((a) => (
        <line key={a}
          x1={x + Math.cos((a * Math.PI) / 180) * r * 1.16}
          y1={y + Math.sin((a * Math.PI) / 180) * r * 1.16}
          x2={x + Math.cos((a * Math.PI) / 180) * r * 1.30}
          y2={y + Math.sin((a * Math.PI) / 180) * r * 1.30}
          stroke={C.teal} strokeOpacity={0.5} strokeWidth={1.5} />
      ))}
      {label ? (
        <text x={x + r * 1.42} y={y - r * 1.02} fill={C.navy} fillOpacity={0.55}
          fontFamily={F.mono} fontSize={15} letterSpacing={1.6}>{label}</text>
      ) : null}
    </g>
  );
};

/** Framing brackets that draw themselves in from the corners. */
export const Brackets: React.FC<{
  frame: number; x: number; y: number; w: number; h: number; start: number; len?: number;
}> = ({frame, x, y, w, h, start, len = 46}) => {
  const p = ramp(frame, start, 26);
  const L = len * p;
  const seg = (px: number, py: number, dx: number, dy: number) => (
    <>
      <line x1={px} y1={py} x2={px + dx * L} y2={py} stroke={C.navy} strokeOpacity={0.45} strokeWidth={2} />
      <line x1={px} y1={py} x2={px} y2={py + dy * L} stroke={C.navy} strokeOpacity={0.45} strokeWidth={2} />
    </>
  );
  return (
    <g opacity={p}>
      {seg(x, y, 1, 1)}
      {seg(x + w, y, -1, 1)}
      {seg(x, y + h, 1, -1)}
      {seg(x + w, y + h, -1, -1)}
    </g>
  );
};

/**
 * Callout: a marker dot on the component, an elbow leader and a label block.
 * `side` flips the elbow so the text never lands on top of the machine.
 */
export const Callout: React.FC<{
  frame: number; start: number; x: number; y: number;
  dx: number; dy: number; title: string; sub: string; side?: 'left' | 'right';
}> = ({frame, start, x, y, dx, dy, title, sub, side = 'right'}) => {
  const dot = ramp(frame, start, 14);
  const line = ramp(frame, start + 8, 22);
  const text = ramp(frame, start + 20, 20);
  const ex = x + dx;
  const ey = y + dy;
  const tail = side === 'right' ? 132 : -132;
  const anchor = side === 'right' ? 'start' : 'end';
  const pad = side === 'right' ? 14 : -14;

  const d1x = x + dx * line;
  const d1y = y + dy * line;
  const d2 = ex + tail * ramp(frame, start + 18, 18);

  return (
    <g>
      <circle cx={x} cy={y} r={5 * dot} fill={C.teal} />
      <circle cx={x} cy={y} r={14 * dot} fill="none" stroke={C.teal} strokeOpacity={0.45} strokeWidth={1.4} />
      <circle cx={x} cy={y} r={14 + 16 * ((frame - start) % 45) / 45}
        fill="none" stroke={C.teal}
        strokeOpacity={dot * 0.30 * (1 - ((frame - start) % 45) / 45)} strokeWidth={1.2} />
      <path d={`M ${x} ${y} L ${d1x} ${d1y} L ${d2} ${ey}`} fill="none"
        stroke={C.navy} strokeOpacity={0.5} strokeWidth={1.6} />
      <g opacity={text} transform={`translate(${ex + pad + tail}, ${ey})`}>
        <text textAnchor={anchor} y={-12} fill={C.navy} fontFamily={F.sans}
          fontSize={30} fontWeight={700} letterSpacing={0.6}>{title}</text>
        <text textAnchor={anchor} y={22} fill={C.slate} fontFamily={F.sans}
          fontSize={21} fontWeight={400}>{sub}</text>
      </g>
    </g>
  );
};

/** A single measurement rule with ticks — pure schematic dressing. */
export const Dimension: React.FC<{
  frame: number; start: number; x1: number; x2: number; y: number; label: string;
}> = ({frame, start, x1, x2, y, label}) => {
  const p = ramp(frame, start, 28);
  const xe = x1 + (x2 - x1) * p;
  return (
    <g opacity={p}>
      <line x1={x1} y1={y} x2={xe} y2={y} stroke={C.navy} strokeOpacity={0.35} strokeWidth={1.4} />
      <line x1={x1} y1={y - 9} x2={x1} y2={y + 9} stroke={C.navy} strokeOpacity={0.35} strokeWidth={1.4} />
      <line x1={xe} y1={y - 9} x2={xe} y2={y + 9} stroke={C.navy} strokeOpacity={0.35} strokeWidth={1.4} />
      <text x={(x1 + x2) / 2} y={y - 16} textAnchor="middle" fill={C.navy} fillOpacity={0.6}
        fontFamily={F.mono} fontSize={16} letterSpacing={1.4}>{label}</text>
    </g>
  );
};

/** Horizontal analysis sweep passing over the machine once. */
export const ScanBar: React.FC<{
  frame: number; start: number; duration: number;
  x: number; top: number; height: number; width: number;
}> = ({frame, start, duration, x, top, height, width}) => {
  const y = track(frame, [{t: start, v: top}, {t: start + duration, v: top + height}], true);
  const a = track(frame, [
    {t: start, v: 0}, {t: start + 14, v: 1},
    {t: start + duration - 18, v: 1}, {t: start + duration, v: 0},
  ], true);
  return (
    <g opacity={a}>
      <rect x={x} y={y - 46} width={width} height={46} fill="url(#scanGrad)" />
      <line x1={x} y1={y} x2={x + width} y2={y} stroke={C.teal} strokeOpacity={0.75} strokeWidth={1.6} />
    </g>
  );
};

export const ScanDefs: React.FC = () => (
  <defs>
    <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.teal} stopOpacity={0} />
      <stop offset="100%" stopColor={C.teal} stopOpacity={0.18} />
    </linearGradient>
  </defs>
);
