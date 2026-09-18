import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Set} from '../Set';
import {UnitStage} from '../Unit';
import {Brackets, Callout, Dust} from '../fx/Atmos';
import {Badge, Reveal, Sub, Title} from '../fx/Typo';
import {ramp, track} from '../../lib/anim';
import {UnitKey, UNITS} from '../theme';

type Pin = {
  at: number;
  /** Anchor on the product, as a fraction of the render. */
  fx: number; fy: number;
  dx: number; dy: number;
  title: string; sub?: string; side: 'left' | 'right';
};

type Beat = {
  from: number; dur: number; unit: UnitKey; width: number;
  x: number; y: number; s0: number; s1: number; pins: Pin[];
};

/**
 * Three angles on real product renders — no invented geometry, no fake orbit.
 * Each callout is anchored in the render's own coordinates and projected under
 * that beat's camera, so a leader always lands on the part it names.
 */
const BEATS: Beat[] = [
  {
    from: 0, dur: 132, unit: 'foot', width: 1120, x: -40, y: -18, s0: 0.98, s1: 1.10,
    pins: [
      {at: 26, fx: 0.44, fy: 0.42, dx: -130, dy: -180, title: 'Carter', sub: 'Corps monobloc', side: 'left'},
      {at: 62, fx: 0.08, fy: 0.33, dx: -30, dy: -210, title: 'Arbre de sortie', side: 'left'},
      {at: 92, fx: 0.82, fy: 0.40, dx: 130, dy: -170, title: 'Moteur', sub: 'Bride normalisée', side: 'right'},
    ],
  },
  {
    from: 122, dur: 126, unit: 'bevel', width: 1040, x: 60, y: -10, s0: 1.10, s1: 0.99,
    pins: [
      {at: 26, fx: 0.28, fy: 0.55, dx: -140, dy: 170, title: 'Bride de sortie', side: 'left'},
      {at: 62, fx: 0.62, fy: 0.24, dx: 120, dy: -180, title: 'Engrenages', sub: 'Couple conique-hélicoïdal', side: 'right'},
    ],
  },
  {
    from: 238, dur: 100, unit: 'flange', width: 900, x: -20, y: -60, s0: 0.96, s1: 1.06, pins: [],
  },
];

const Shot: React.FC<{beat: Beat; frame: number; w: number; h: number}> = ({beat, frame, w, h}) => {
  const a = Math.min(
    ramp(frame, beat.from, 20, true),
    1 - ramp(frame, beat.from + beat.dur - 20, 20, true),
  );
  if (a <= 0.002) return null;

  const local = frame - beat.from;
  const s = track(local, [{t: 0, v: beat.s0}, {t: beat.dur, v: beat.s1}], true);
  const dx = track(local, [{t: 0, v: beat.x}, {t: beat.dur, v: -beat.x}], true);

  const u = UNITS[beat.unit];
  const dw = beat.width * s;
  const dh = dw * (u.h / u.w);
  const px = (fx: number) => w / 2 + (fx - 0.5) * dw + dx;
  const py = (fy: number) => h / 2 + (fy - 0.5) * dh + beat.y;

  return (
    <>
      <UnitStage unit={beat.unit} width={beat.width} opacity={a} glow={0.4 * a}
        style={{transform: `translate(${dx}px, ${beat.y}px) scale(${s})`}} />
      <svg width={w} height={h} style={{position: 'absolute', inset: 0, opacity: a}}>
        {beat.pins.map((p) => (
          <Callout key={p.title} frame={frame} start={beat.from + p.at}
            x={px(p.fx)} y={py(p.fy)} dx={p.dx} dy={p.dy}
            title={p.title} sub={p.sub} side={p.side} />
        ))}
      </svg>
    </>
  );
};

/** Scene 2 — the hero pass: housing, shaft, motor, flange, gears. */
export const S2Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  return (
    <AbsoluteFill>
      <Set light={{x: 0.52, y: 0.44}} spread={0.66} tint={0.45} streaks={0.4} />
      <Dust frame={frame} count={62} seed="s2" />

      {BEATS.map((b) => <Shot key={b.unit} beat={b} frame={frame} w={width} h={height} />)}

      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <Brackets frame={frame} start={16} x={250} y={150} w={width - 500} h={height - 440} />
      </svg>

      <AbsoluteFill style={{padding: '0 0 88px 110px', justifyContent: 'flex-end'}}>
        <Reveal frame={frame} start={250} rise={28} style={{paddingBottom: 20}}>
          <Title size={48} ls={-1}>
            Optimisez vos installations avec
            <br />nos motoréducteurs haute performance.
          </Title>
        </Reveal>
        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <Badge frame={frame} start={286}>Garantie 2 ans</Badge>
          <div style={{opacity: ramp(frame, 300, 24)}}>
            <Sub size={19}>Une offre exclusive signée WEPACK</Sub>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
