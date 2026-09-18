import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Studio} from '../Studio';
import {Shot} from '../Stage';
import {Particles} from '../fx/Particles';
import {Kicker} from '../fx/Typo';
import {ramp, track} from '../anim';
import {C, F} from '../theme';

/**
 * Scene 2 — the walk-around. Each angle is a real photograph of this machine
 * (the hero shot plus the three views from the manufacturer's data sheet), so
 * no geometry is ever invented to fake an orbit.
 */
const SHOTS = [
  {src: 'hero.png',   w: 1084, label: 'Vue 3/4 avant', from: 0,   dur: 92, dir: 1},
  {src: 'front.png',  w: 690,  label: 'Vue de face',   from: 84,  dur: 82, dir: -1},
  {src: 'rear.png',   w: 578,  label: 'Vue arrière',   from: 158, dur: 74, dir: 1},
  {src: 'rear34.png', w: 880,  label: 'Vue 3/4 arrière', from: 224, dur: 76, dir: -1},
] as const;

const Angle: React.FC<{
  shot: (typeof SHOTS)[number]; index: number; frame: number;
}> = ({shot, index, frame}) => {
  const local = frame - shot.from;
  const IN = 18;
  const OUT = 16;
  const a = Math.min(
    ramp(frame, shot.from, IN, true),
    1 - ramp(frame, shot.from + shot.dur - OUT, OUT, true),
  );
  if (a <= 0.001) return null;

  // lateral travelling: the shot glides through frame instead of cutting in
  const x = track(local, [{t: 0, v: 74 * shot.dir}, {t: shot.dur, v: -74 * shot.dir}], true);
  const s = track(local, [{t: 0, v: 0.965}, {t: shot.dur, v: 1.035}], true);

  return (
    <>
      <Shot
        src={shot.src}
        width={shot.w}
        opacity={a}
        style={{transform: `translate(${x}px, 0) scale(${s})`}}
      />
      <AbsoluteFill style={{opacity: a, padding: '0 0 92px 110px', justifyContent: 'flex-end'}}>
        <div style={{
          opacity: ramp(frame, shot.from + 10, 20),
          transform: `translateY(${(1 - ramp(frame, shot.from + 10, 20)) * 12}px)`,
          display: 'flex', alignItems: 'center', gap: 18,
        }}>
          <div style={{
            fontFamily: F.mono, fontSize: 15, letterSpacing: 2.6, color: C.mute,
          }}>{String(index + 1).padStart(2, '0')}/04</div>
          <div style={{width: 1, height: 22, background: C.line}} />
          <div style={{
            fontFamily: F.sans, fontSize: 27, fontWeight: 600, color: C.navy, letterSpacing: 0.2,
          }}>{shot.label}</div>
        </div>
      </AbsoluteFill>
    </>
  );
};

export const S2Angles: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const progress = interpolate(frame, [0, duration], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <Studio light={{x: 0.5, y: 0.44}} spread={0.62} />
      <Particles count={42} opacity={0.8} seed="s2" />

      {SHOTS.map((s, i) => (
        <Angle key={s.src} shot={s} index={i} frame={frame} />
      ))}

      <AbsoluteFill style={{padding: '78px 110px 0 0', alignItems: 'flex-end'}}>
        <div style={{opacity: ramp(frame, 12, 24)}}>
          <Kicker>Présentation générale</Kicker>
        </div>
      </AbsoluteFill>

      {/* chapter progress rail */}
      <div style={{position: 'absolute', left: 110, bottom: 62, width: width - 220, height: 2, background: C.lineFaint}}>
        <div style={{width: `${progress * 100}%`, height: '100%', background: C.teal, opacity: 0.85}} />
      </div>
    </AbsoluteFill>
  );
};
