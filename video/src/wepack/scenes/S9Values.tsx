import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Set} from '../Set';
import {UnitStage} from '../Unit';
import {Dust, Sweep} from '../fx/Atmos';
import {Reveal, Word} from '../fx/Typo';
import {ramp, track} from '../../lib/anim';
import {C, F} from '../theme';

const WORDS = ['Performance', 'Fiabilité', 'Robustesse', 'Ingénierie'];

/** Scene 9 — the values, over a slow drift across a unit held in low key. */
export const S9Values: React.FC = () => {
  const frame = useCurrentFrame();
  const a = ramp(frame, 4, 30, true);
  const drift = track(frame, [{t: 0, v: -60}, {t: 308, v: 40}], true);
  const scale = track(frame, [{t: 0, v: 1.12}, {t: 308, v: 1.0}], true);

  return (
    <AbsoluteFill>
      <Set light={{x: 0.64, y: 0.46}} spread={0.58} tint={0.55} grid={false} horizon={0.82} />
      <Dust frame={frame} count={60} seed="s9" />

      <UnitStage
        unit="parallel"
        width={760}
        opacity={a * 0.85}
        glow={0.5 * a}
        style={{transform: `translate(${430 + drift}px, 10px) scale(${scale})`}}
      />

      <Sweep frame={frame} start={150} duration={110} strength={0.7} />

      <AbsoluteFill style={{padding: '0 0 0 120px', justifyContent: 'center', width: 900}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
          {WORDS.map((w, i) => (
            <Word key={w} frame={frame} start={22 + i * 44} size={70}>{w}</Word>
          ))}
        </div>
        <Reveal frame={frame} start={222} rise={24} style={{paddingTop: 52}}>
          <div style={{
            fontFamily: F.sans, fontSize: 28, fontWeight: 400, color: C.steel,
            lineHeight: 1.45, maxWidth: 700,
          }}>
            Conçus pour optimiser vos installations industrielles.
          </div>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
