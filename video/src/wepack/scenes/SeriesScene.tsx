import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Set} from '../Set';
import {UnitStage} from '../Unit';
import {Dust, Sweep} from '../fx/Atmos';
import {Kicker, Reveal, Rule, Spec, Title} from '../fx/Typo';
import {ramp, track} from '../../lib/anim';
import {C, F, SERIES} from '../theme';

/** Per-range display sizes, so the three units read at a comparable scale. */
const SIZING: Record<string, {w: number; x: number; y: number}> = {
  N: {w: 900, x: 330, y: 10},
  D: {w: 720, x: 340, y: 0},
  K: {w: 880, x: 330, y: 10},
};

/**
 * Scenes 5 to 7 — one template per range, the way a real range film is built:
 * same grid, same rhythm, only the unit and the figures change.
 */
export const SeriesScene: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  const s = SERIES[index];
  const size = SIZING[s.key];

  const inUnit = ramp(frame, 6, 34, true);
  const scale = track(frame, [{t: 0, v: 0.94}, {t: 318, v: 1.06}]);
  const drift = track(frame, [{t: 0, v: 46}, {t: 318, v: -22}]);

  return (
    <AbsoluteFill>
      <Set light={{x: 0.66, y: 0.44}} spread={0.62} tint={0.5} horizon={0.8} />
      <Dust frame={frame} count={54} seed={`ser${s.key}`} />

      {/* range letter, set deep into the background */}
      <AbsoluteFill style={{alignItems: 'flex-end', justifyContent: 'center', paddingRight: 90}}>
        <div style={{
          fontFamily: F.sans, fontSize: 760, fontWeight: 800, lineHeight: 0.8,
          color: 'rgba(232,24,127,0.11)', letterSpacing: -40,
          opacity: ramp(frame, 10, 40),
          transform: `translateX(${track(frame, [{t: 0, v: 40}, {t: 318, v: -16}], true)}px)`,
        }}>{s.key}</div>
      </AbsoluteFill>

      <UnitStage
        unit={s.unit}
        width={size.w}
        opacity={inUnit}
        glow={0.45 * inUnit}
        style={{transform: `translate(${size.x + drift}px, ${size.y}px) scale(${scale})`}}
      />

      <Sweep frame={frame} start={18} duration={96} strength={0.75} />

      <AbsoluteFill style={{padding: '0 0 0 116px', justifyContent: 'center', width: 760}}>
        <Reveal frame={frame} start={22} style={{paddingBottom: 16}}>
          <Kicker>Gamme</Kicker>
        </Reveal>
        <Rule frame={frame} start={32} w={96} />
        <Reveal frame={frame} start={40} rise={34} style={{paddingTop: 22}}>
          <Title size={86} ls={2}>{s.name}</Title>
        </Reveal>
        <Reveal frame={frame} start={62} style={{paddingTop: 14, paddingBottom: 44}}>
          <div style={{fontFamily: F.sans, fontSize: 25, fontWeight: 400, color: C.steel}}>
            {s.kind}
          </div>
        </Reveal>

        <div style={{display: 'flex', flexDirection: 'column', gap: 30}}>
          {s.specs.map((sp, i) => (
            <Spec key={sp.label} frame={frame} start={104 + i * 34}
              label={sp.label} value={sp.value} unit={sp.unit} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
