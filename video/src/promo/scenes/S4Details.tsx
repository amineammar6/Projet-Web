import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Studio} from '../Studio';
import {Shot} from '../Stage';
import {Particles} from '../fx/Particles';
import {Callout} from '../fx/Graphics';
import {Kicker} from '../fx/Typo';
import {camera, ramp, track} from '../anim';
import {FOCUS, HERO} from '../theme';

const W_HERO = 1340;

type Beat = {
  from: number; dur: number;
  focus: {x: number; y: number};
  scale: number; toX: number; toY: number;
  title: string; sub: string;
  side: 'left' | 'right';
  dx: number; dy: number;
};

/** Macro push-ins on the components that actually sell the machine. */
const BEATS: Beat[] = [
  {
    from: 0, dur: 118, focus: FOCUS.panel, scale: 1.26, toX: 0.37, toY: 0.46,
    title: 'Écran OLED & molette', sub: 'Réglage du débit au dixième',
    side: 'right', dx: 250, dy: 210,
  },
  {
    from: 106, dur: 118, focus: FOCUS.pumpHead, scale: 1.34, toX: 0.56, toY: 0.52,
    title: 'Tête de pompe', sub: 'Rotor à galets · changement de tube rapide',
    side: 'left', dx: -210, dy: 180,
  },
  {
    from: 212, dur: 88, focus: FOCUS.handle, scale: 1.22, toX: 0.46, toY: 0.40,
    title: 'Poignée intégrée', sub: 'Corps monobloc, nettoyage immédiat',
    side: 'right', dx: 220, dy: 215,
  },
];

const Detail: React.FC<{beat: Beat; frame: number; width: number; height: number}> = ({
  beat, frame, width, height,
}) => {
  const local = frame - beat.from;
  const a = Math.min(
    ramp(frame, beat.from, 16, true),
    1 - ramp(frame, beat.from + beat.dur - 16, 16, true),
  );
  if (a <= 0.001) return null;

  // continuous push so the shot never sits still
  const scale = track(local, [{t: 0, v: beat.scale}, {t: beat.dur, v: beat.scale * 1.09}], true);
  const h = W_HERO * HERO.ratio;
  const cam = camera({
    scale, focus: beat.focus, w: W_HERO, h, frameW: width, frameH: height,
    toX: beat.toX, toY: beat.toY,
  });

  return (
    <>
      <Shot src="hero.png" width={W_HERO} opacity={a} style={cam} />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: a}}>
        <Callout
          frame={frame} start={beat.from + 20}
          x={beat.toX * width} y={beat.toY * height}
          dx={beat.dx} dy={beat.dy}
          title={beat.title} sub={beat.sub} side={beat.side}
        />
      </svg>
    </>
  );
};

/** Scene 4 — details, lit tight and annotated. */
export const S4Details: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  return (
    <AbsoluteFill>
      <Studio light={{x: 0.48, y: 0.46}} spread={0.7} falloff={0.85} grid={false} />
      <Particles count={40} opacity={0.7} seed="s4" />

      {BEATS.map((b) => (
        <Detail key={b.title} beat={b} frame={frame} width={width} height={height} />
      ))}

      <AbsoluteFill style={{padding: '78px 110px 0 0', alignItems: 'flex-end'}}>
        <div style={{opacity: ramp(frame, 10, 24)}}>
          <Kicker>Détails</Kicker>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
