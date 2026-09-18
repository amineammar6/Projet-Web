import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Set} from '../Set';
import {UnitStage} from '../Unit';
import {Callout, Dust} from '../fx/Atmos';
import {BearingCompare} from '../fx/Diagrams';
import {Kicker, Reveal, Rule, Sub, Title} from '../fx/Typo';
import {ramp, track} from '../../lib/anim';

/**
 * Scene 4 — a macro on the output bore, then the mounting comparison: seat
 * machined into the main body versus a bolted-on cover carrying the bearing.
 */
export const S4Bearings: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const macro = Math.min(ramp(frame, 4, 24, true), 1 - ramp(frame, 118, 32, true));
  const cmp = ramp(frame, 128, 32, true);
  // frame the output bore: the render point (0.30, 0.55) parked at (0.42, 0.52)
  const push = track(frame, [{t: 0, v: 1.0}, {t: 150, v: 1.08}], true);

  return (
    <AbsoluteFill>
      <Set light={{x: 0.42, y: 0.46}} spread={0.6} tint={0.45} grid={false} horizon={0.86} />
      <Dust frame={frame} count={48} seed="s4" />

      {macro > 0.002 ? (
        <>
          <UnitStage unit="bevel" width={1280} opacity={macro} ground={false} glow={0.3 * macro}
            style={{transform: `translate(232px, 6px) scale(${push})`}} />
          <svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: macro}}>
            <Callout frame={frame} start={28} x={806} y={562} dx={-40} dy={-286}
              title="Roulements" sub="Logés dans le corps principal" side="left" />
          </svg>
        </>
      ) : null}

      <AbsoluteFill style={{
        opacity: cmp, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 92,
      }}>
        <div style={{textAlign: 'center', paddingBottom: 10}}>
          <Reveal frame={frame} start={140} style={{paddingBottom: 14}}>
            <Kicker>Montage</Kicker>
          </Reveal>
          <div style={{display: 'flex', justifyContent: 'center', paddingBottom: 20}}>
            <Rule frame={frame} start={150} w={90} />
          </div>
          <Reveal frame={frame} start={158} rise={28}>
            <Title size={52}>Roulements montés directement<br />sur le corps principal</Title>
          </Reveal>
        </div>

        <div style={{paddingTop: 12}}>
          <BearingCompare frame={frame} start={186} width={1640} />
        </div>

        <div style={{opacity: ramp(frame, 286, 28), paddingTop: 18, maxWidth: 1080, textAlign: 'center'}}>
          <Sub size={21}>
            Et non sur des pièces rapportées telles qu’un couvercle ou une bride.
          </Sub>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
