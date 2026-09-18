import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Set} from '../Set';
import {UnitStage} from '../Unit';
import {Dust, Sweep} from '../fx/Atmos';
import {Kicker, Reveal, Rule} from '../fx/Typo';
import {ramp, track} from '../../lib/anim';
import {C, F} from '../theme';

/** Scene 1 — the unit rises out of the dark as a single key light rakes across it. */
export const S1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = ramp(frame, 8, 90, true);
  const scale = track(frame, [{t: 0, v: 0.84}, {t: 240, v: 1.0}]);
  const drift = track(frame, [{t: 0, v: 34}, {t: 240, v: -12}]);

  return (
    <AbsoluteFill>
      <Set light={{x: 0.5, y: 0.40}} spread={0.6 + 0.12 * reveal} tint={0.35 * reveal}
        grid={false} streaks={0.35} />
      <Dust frame={frame} count={70} opacity={reveal} seed="s1" />

      <UnitStage
        unit="foot"
        width={880}
        opacity={reveal}
        glow={0.55 * reveal}
        style={{transform: `translate(${drift}px, -86px) scale(${scale})`}}
      />

      <Sweep frame={frame} start={22} duration={118} strength={1.2} />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 96}}>
        <Reveal frame={frame} start={140} rise={26}>
          <div style={{
            fontFamily: F.sans, fontSize: 104, fontWeight: 800, color: C.ink,
            letterSpacing: 26, paddingLeft: 26,
          }}>WEPACK</div>
        </Reveal>
        <div style={{paddingTop: 26, paddingBottom: 22}}>
          <Rule frame={frame} start={168} w={180} />
        </div>
        <div style={{opacity: ramp(frame, 182, 28)}}>
          <Kicker color={C.steel}>Motoréducteurs haute performance</Kicker>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
