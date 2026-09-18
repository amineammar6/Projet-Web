import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Studio} from '../Studio';
import {Shot, HERO_W} from '../Stage';
import {LightSweep} from '../fx/LightSweep';
import {Particles} from '../fx/Particles';
import {Kicker, Reveal, Rule, Sub, Title} from '../fx/Typo';
import {camera, ramp, track} from '../../lib/anim';
import {C, FOCUS, HERO} from '../theme';

/**
 * Scene 1 — the machine arrives out of an overexposed plate on a wide shot,
 * then a slow dolly-in while the key light rakes across it.
 */
export const S1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const scale = track(frame, [{t: 0, v: 0.60}, {t: 200, v: 0.93}]);
  const h = HERO_W * HERO.ratio;
  const cam = camera({
    scale,
    focus: FOCUS.whole,
    w: HERO_W,
    h,
    frameW: width,
    frameH: height,
    toY: track(frame, [{t: 0, v: 0.53}, {t: 200, v: 0.49}]),
    driftX: track(frame, [{t: 0, v: 26}, {t: 200, v: -10}]),
  });

  // the plate the machine emerges from
  const bloom = track(frame, [{t: 0, v: 1}, {t: 78, v: 0}], true);
  const lightX = track(frame, [{t: 0, v: 0.36}, {t: 200, v: 0.52}], true);

  return (
    <AbsoluteFill>
      <Studio light={{x: lightX, y: 0.42}} spread={0.66} falloff={ramp(frame, 10, 90)} />
      <Particles count={54} opacity={ramp(frame, 30, 70)} seed="s1" />

      <Shot src="hero.png" width={HERO_W} style={cam} />

      <LightSweep start={16} duration={112} strength={1.15} />

      <AbsoluteFill style={{background: '#FFFFFF', opacity: bloom}} />

      <AbsoluteFill style={{padding: '0 0 96px 110px', justifyContent: 'flex-end'}}>
        <Reveal frame={frame} start={132} style={{paddingBottom: 14}}>
          <Kicker>Équipement de process</Kicker>
        </Reveal>
        <Rule frame={frame} start={144} w={96} />
        <Reveal frame={frame} start={152} rise={34} style={{paddingTop: 20}}>
          <Title size={72}>
            Pompe péristaltique
            <br />
            <span style={{color: C.slate, fontWeight: 300}}>compacte</span>
          </Title>
        </Reveal>
        <Reveal frame={frame} start={172} style={{paddingTop: 18}}>
          <Sub>Transfert sans contact · dosage de précision</Sub>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
