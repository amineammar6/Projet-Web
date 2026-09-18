import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

type Props = {count?: number; opacity?: number; seed?: string};

/** Fine airborne dust, lit by the key light. Deterministic, so renders match. */
export const Particles: React.FC<Props> = ({count = 70, opacity = 1, seed = 'dust'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const motes = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: random(`${seed}x${i}`),
        y: random(`${seed}y${i}`),
        r: 0.8 + random(`${seed}r${i}`) * 2.4,
        drift: 0.15 + random(`${seed}d${i}`) * 0.6,
        phase: random(`${seed}p${i}`) * Math.PI * 2,
        amp: 6 + random(`${seed}a${i}`) * 26,
      })),
    [count, seed],
  );

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg width={width} height={height} style={{position: 'absolute'}}>
        {motes.map((m, i) => {
          const t = frame / 30;
          const y = ((m.y - t * m.drift * 0.035) % 1 + 1) % 1;
          const x = m.x + (Math.sin(t * 0.55 + m.phase) * m.amp) / width;
          const tw = 0.30 + 0.45 * (0.5 + 0.5 * Math.sin(t * 1.5 + m.phase));
          return (
            <circle
              key={i}
              cx={x * width}
              cy={y * height}
              r={m.r}
              fill={i % 5 === 0 ? C.teal : '#8CA0C0'}
              opacity={tw * 0.42 * opacity}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
