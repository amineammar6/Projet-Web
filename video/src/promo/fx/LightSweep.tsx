import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {track} from '../anim';

type Props = {start: number; duration: number; angle?: number; strength?: number};

/**
 * A soft key light travelling across the set. Two offset bands — one faintly
 * cool, one white — so the pass reads as a moving light source rather than a
 * flat brightness pump.
 */
export const LightSweep: React.FC<Props> = ({start, duration, angle = 104, strength = 1}) => {
  const frame = useCurrentFrame();
  const p = track(frame, [
    {t: start, v: -0.45},
    {t: start + duration, v: 1.45},
  ], true);
  const fade = track(frame, [
    {t: start, v: 0},
    {t: start + duration * 0.18, v: 1},
    {t: start + duration * 0.82, v: 1},
    {t: start + duration, v: 0},
  ], true);

  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          opacity: 0.30 * strength * fade,
          transform: `translateX(${(p - 0.06) * 160 - 30}%)`,
          background: `linear-gradient(${angle}deg, transparent 38%, rgba(120,140,175,0.55) 50%, transparent 62%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.85 * strength * fade,
          transform: `translateX(${p * 160 - 30}%)`,
          background: `linear-gradient(${angle}deg, transparent 34%, rgba(255,255,255,0.95) 50%, transparent 66%)`,
        }}
      />
    </AbsoluteFill>
  );
};
