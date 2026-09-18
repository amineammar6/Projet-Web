import React from 'react';
import {C, F} from '../theme';
import {ramp} from '../../lib/anim';

/**
 * Both figures use the drafting convention for sectioned parts: one piece, one
 * hatch direction. That is what carries the argument here — the monobloc body
 * is hatched continuously from the bearing seat to the far wall, while a bolted
 * cover is drawn hatched the other way across a joint line, exactly as a
 * section drawing would distinguish two parts. Schematic by intent: it
 * illustrates the principle, it is not a drawing of a specific WEPACK part.
 */

const Hatch: React.FC<{id: string; color: string; angle: number; opacity?: number}> = ({
  id, color, angle, opacity = 0.55,
}) => (
  <pattern id={id} width={11} height={11} patternUnits="userSpaceOnUse"
    patternTransform={`rotate(${angle})`}>
    <line x1={0} y1={0} x2={0} y2={11} stroke={color} strokeWidth={1.5} opacity={opacity} />
  </pattern>
);

/** Ball bearing in section: outer race, rolling elements, inner race. */
const Bearing: React.FC<{
  x: number; y: number; w: number; h: number; on: number; accent?: boolean;
}> = ({x, y, w, h, on, accent}) => {
  const s = accent ? C.brandHot : C.steel;
  const race = h * 0.24;
  return (
    <g opacity={on}>
      <rect x={x} y={y} width={w} height={race} fill={accent ? 'rgba(232,24,127,0.22)' : 'rgba(180,200,225,0.14)'}
        stroke={s} strokeWidth={1.8} />
      <rect x={x} y={y + h - race} width={w} height={race}
        fill={accent ? 'rgba(232,24,127,0.22)' : 'rgba(180,200,225,0.14)'} stroke={s} strokeWidth={1.8} />
      {new Array(3).fill(0).map((_, i) => (
        <circle key={i} cx={x + (w * (i + 0.5)) / 3} cy={y + h / 2} r={Math.min(h * 0.5 - race, w / 7)}
          fill="none" stroke={s} strokeWidth={1.8} />
      ))}
    </g>
  );
};

const Gear: React.FC<{cx: number; cy: number; r: number; on: number; spin: number; teeth?: number}> = ({
  cx, cy, r, on, spin, teeth = 20,
}) => (
  <g opacity={on}>
    <circle cx={cx} cy={cy} r={r} fill="rgba(180,200,225,0.08)" stroke={C.steel}
      strokeOpacity={0.95} strokeWidth={2.2} />
    <g transform={`rotate(${spin} ${cx} ${cy})`}>
      {new Array(teeth).fill(0).map((_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return (
          <line key={i}
            x1={cx + Math.cos(a) * r} y1={cy + Math.sin(a) * r}
            x2={cx + Math.cos(a) * r * 1.1} y2={cy + Math.sin(a) * r * 1.1}
            stroke={C.steel} strokeOpacity={1} strokeWidth={2.4} />
        );
      })}
      <line x1={cx - r * 0.72} y1={cy} x2={cx + r * 0.72} y2={cy} stroke={C.steel}
        strokeOpacity={0.35} strokeWidth={1.4} />
      <line x1={cx} y1={cy - r * 0.72} x2={cx} y2={cy + r * 0.72} stroke={C.steel}
        strokeOpacity={0.35} strokeWidth={1.4} />
    </g>
  </g>
);

const HOUSING_OUT =
  'M 112 58 H 492 Q 532 58 532 98 V 292 Q 532 332 492 332 H 362 V 360 H 258 V 332 H 112 ' +
  'Q 72 332 72 292 V 248 H 22 V 168 H 72 V 98 Q 72 58 112 58 Z';
const HOUSING_IN =
  'M 122 104 H 478 Q 496 104 496 122 V 268 Q 496 286 478 286 H 122 Q 104 286 104 268 V 122 ' +
  'Q 104 104 122 104 Z';
const OUTLINE_LEN = 2000;

export const MonoblocDiagram: React.FC<{frame: number; start: number; width?: number}> = ({
  frame, start, width = 700,
}) => {
  const draw = ramp(frame, start, 62);
  const hatch = ramp(frame, start + 44, 34);
  const guts = ramp(frame, start + 72, 30);
  const spin = (frame - start) * 0.55;

  return (
    <svg width={width} height={width * (400 / 560)} viewBox="0 0 560 400" style={{overflow: 'visible'}}>
      <defs><Hatch id="hMono" color={C.brandHot} angle={45} opacity={0.5} /></defs>

      {/* the wall, hatched continuously: one part, one direction */}
      <path d={`${HOUSING_OUT} ${HOUSING_IN}`} fillRule="evenodd" fill="url(#hMono)" opacity={hatch} />
      <path d={HOUSING_IN} fill="rgba(0,0,0,0.45)" opacity={hatch} />

      <path d={HOUSING_OUT} fill="none" stroke={C.brand} strokeWidth={3} strokeLinejoin="round"
        strokeDasharray={OUTLINE_LEN} strokeDashoffset={OUTLINE_LEN * (1 - draw)}
        style={{filter: 'drop-shadow(0 0 9px rgba(232,24,127,0.45))'}} />
      <path d={HOUSING_IN} fill="none" stroke={C.brand} strokeOpacity={0.55} strokeWidth={1.8}
        strokeDasharray={OUTLINE_LEN} strokeDashoffset={OUTLINE_LEN * (1 - draw)} />

      {/* gear train and output shaft */}
      <g opacity={guts}>
        <rect x={4} y={194} width={286} height={28} rx={2} fill="rgba(180,200,225,0.18)"
          stroke={C.steel} strokeWidth={2.4} />
      </g>
      <Gear cx={300} cy={208} r={64} on={guts} spin={spin} />
      <Gear cx={414} cy={146} r={36} on={guts} spin={-spin * 1.75} teeth={12} />
      <Bearing x={64} y={182} w={44} h={52} on={guts} accent />
      <Bearing x={472} y={182} w={40} h={52} on={guts} accent />
      <g opacity={guts * 0.7}>
        <line x1={116} y1={266} x2={486} y2={266} stroke={C.steel} strokeOpacity={0.4}
          strokeWidth={1.4} strokeDasharray="8 8" />
      </g>

      <text x={280} y={392} textAnchor="middle" fill={C.mute}
        fontFamily={F.mono} fontSize={13} letterSpacing={3}>COUPE DE PRINCIPE</text>
    </svg>
  );
};

/** One panel of the mounting comparison. */
const Panel: React.FC<{
  frame: number; start: number; split: boolean; on: number;
}> = ({frame, start, split, on}) => {
  const hatchId = split ? 'hBody' : 'hMono2';
  const mark = ramp(frame, start + 40, 26);

  // main body wall; when `split`, it stops short and a bolted cover carries the seat
  const bodyLeft = split ? 236 : 132;
  const body =
    `M ${bodyLeft} 44 H 470 Q 502 44 502 76 V 212 Q 502 244 470 244 H ${bodyLeft} V 44 Z`;
  const cavity = `M ${bodyLeft + 46} 86 H 462 Q 472 86 472 96 V 192 Q 472 202 462 202 H ${bodyLeft + 46} V 86 Z`;
  const nose = split ? '' : 'M 132 44 H 132 V 244 H 132 Z';

  return (
    <g opacity={on}>
      {/* the piece (or pieces) in section */}
      <path d={`${body} ${cavity} ${nose}`} fillRule="evenodd" fill={`url(#${hatchId})`} />
      <path d={body} fill="none" stroke={split ? C.steel : C.brand} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={cavity} fill="rgba(0,0,0,0.5)" stroke={split ? C.steel : C.brand}
        strokeOpacity={0.5} strokeWidth={1.5} />

      {!split ? (
        <>
          {/* bearing seat machined into the very same wall */}
          <path d="M 132 44 H 236 V 244 H 132 Z" fill="url(#hMono2)" />
          <path d="M 132 44 H 236 V 244 H 132 Z" fill="none" stroke={C.brand} strokeWidth={2.4} />
        </>
      ) : (
        <>
          {/* an added cover, hatched the other way, bolted across a joint */}
          <path d="M 132 52 H 230 V 236 H 132 Z" fill="url(#hCover)" />
          <path d="M 132 52 H 230 V 236 H 132 Z" fill="none" stroke={C.steelDim} strokeWidth={2.2} />
          <line x1={233} y1={44} x2={233} y2={244} stroke={C.brandHot} strokeWidth={2}
            strokeDasharray="6 6" opacity={mark} />
          {[86, 202].map((y) => (
            <g key={y}>
              <line x1={150} y1={y} x2={300} y2={y} stroke={C.steelDim} strokeWidth={3} opacity={0.75} />
              <circle cx={150} cy={y} r={6} fill="none" stroke={C.steelDim} strokeWidth={2} />
            </g>
          ))}
        </>
      )}

      {/* shaft and the bearing it runs in */}
      <rect x={20} y={128} width={150} height={28} rx={2} fill="rgba(180,200,225,0.12)"
        stroke={C.steel} strokeWidth={2} />
      <Bearing x={split ? 148 : 152} y={116} w={54} h={52} on={1} accent={!split} />
    </g>
  );
};

export const BearingCompare: React.FC<{frame: number; start: number; width?: number}> = ({
  frame, start, width = 1260,
}) => {
  const a = ramp(frame, start, 32);
  const b = ramp(frame, start + 44, 32);
  const VB_W = 1240;

  return (
    <svg width={width} height={width * (300 / VB_W)} viewBox={`0 0 ${VB_W} 300`} style={{overflow: 'visible'}}>
      <defs>
        <Hatch id="hMono2" color={C.brandHot} angle={45} opacity={0.5} />
        <Hatch id="hBody" color={C.steelDim} angle={45} opacity={0.4} />
        <Hatch id="hCover" color={C.steelDim} angle={-45} opacity={0.4} />
      </defs>

      <g><Panel frame={frame} start={start} split={false} on={a} /></g>
      <text x={270} y={288} textAnchor="middle" fill={C.ink} fontFamily={F.sans}
        fontSize={23} fontWeight={600} opacity={a}>Corps principal</text>

      <line x1={615} y1={40} x2={615} y2={252} stroke={C.steel} strokeOpacity={0.16} strokeWidth={1} />

      <g transform="translate(660,0)"><Panel frame={frame} start={start + 44} split on={b} /></g>
      <text x={930} y={288} textAnchor="middle" fill={C.mute} fontFamily={F.sans}
        fontSize={23} fontWeight={500} opacity={b}>Couvercle rapporté</text>
    </svg>
  );
};
