import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Set} from '../Set';
import {Unit} from '../Unit';
import {Dust, Sweep} from '../fx/Atmos';
import {Badge, Kicker, Reveal, Rule} from '../fx/Typo';
import {ramp, track} from '../../lib/anim';
import {C, F} from '../theme';

/**
 * Scene 10 — the three families composed in one frame, a slow pull back, then
 * the brand plate. The word mark is set typographically: no WEPACK logo file
 * was supplied, so none is faked.
 */
export const S10Final: React.FC<{brand: string; claim: string; warranty: string; signature: string}> = ({
  brand, claim, warranty, signature,
}) => {
  const frame = useCurrentFrame();

  const rise = ramp(frame, 4, 40, true);
  const pull = track(frame, [{t: 0, v: 1.10}, {t: 190, v: 0.92}]);
  const lift = track(frame, [{t: 0, v: 30}, {t: 190, v: -6}]);
  const dim = track(frame, [{t: 150, v: 0}, {t: 210, v: 1}], true);

  return (
    <AbsoluteFill>
      <Set light={{x: 0.5, y: 0.42}} spread={0.7} tint={0.5} horizon={0.8} streaks={0.45} />
      <Dust frame={frame} count={66} seed="s10" />

      <AbsoluteFill style={{
        alignItems: 'center', justifyContent: 'center',
        transform: `translateY(${lift}px) scale(${pull})`,
        opacity: rise,
      }}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 10}}>
          <div style={{opacity: ramp(frame, 12, 34), transform: 'translateY(6px)'}}>
            <Unit unit="flange" width={520} glow={0.3} />
          </div>
          <div style={{opacity: ramp(frame, 4, 34), zIndex: 2}}>
            <Unit unit="foot" width={700} glow={0.5} />
          </div>
          <div style={{opacity: ramp(frame, 20, 34), transform: 'translateY(4px)'}}>
            <Unit unit="bevel" width={560} glow={0.3} />
          </div>
        </div>
      </AbsoluteFill>

      <Sweep frame={frame} start={40} duration={120} strength={1} />

      {/* brand plate */}
      <AbsoluteFill style={{
        background: `radial-gradient(70% 62% at 50% 50%, rgba(7,9,16,0.72) 0%, rgba(7,9,16,0.94) 60%, rgba(5,6,11,0.99) 100%)`,
        opacity: dim,
      }} />

      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: dim}}>
        <div style={{textAlign: 'center'}}>
          <div style={{
            opacity: ramp(frame, 206, 30),
            transform: `translateY(${(1 - ramp(frame, 206, 30)) * 18}px)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
          }}>
            <div style={{width: 14, height: 14, background: C.brand, transform: 'rotate(45deg)'}} />
            <div style={{
              fontFamily: F.sans, fontSize: 96, fontWeight: 800, color: C.ink,
              letterSpacing: 20, paddingLeft: 20,
            }}>{brand}</div>
          </div>

          <div style={{display: 'flex', justifyContent: 'center', paddingTop: 30}}>
            <Rule frame={frame} start={224} w={230} />
          </div>

          <Reveal frame={frame} start={238} rise={16} style={{paddingTop: 30}}>
            <Kicker color={C.steel}>{claim}</Kicker>
          </Reveal>

          <div style={{display: 'flex', justifyContent: 'center', paddingTop: 42}}>
            <Badge frame={frame} start={262}>{warranty}</Badge>
          </div>

          <Reveal frame={frame} start={288} rise={14} style={{paddingTop: 34}}>
            <div style={{
              fontFamily: F.sans, fontSize: 24, fontWeight: 400, color: C.mute, letterSpacing: 0.6,
            }}>{signature}</div>
          </Reveal>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
