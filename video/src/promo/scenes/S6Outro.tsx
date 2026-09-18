import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Studio} from '../Studio';
import {Shot, HERO_W} from '../Stage';
import {LightSweep} from '../fx/LightSweep';
import {Particles} from '../fx/Particles';
import {camera, ramp, track} from '../anim';
import {C, F, FOCUS, HERO} from '../theme';

export type Branding = {
  brand: string;
  product: string;
  reference: string;
  website: string;
};

/**
 * Scene 6 — the camera pulls back to the whole machine, then the brand plate
 * rises and holds the lock-up.
 */
export const S6Outro: React.FC<{branding: Branding}> = ({branding}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const scale = track(frame, [{t: 0, v: 1.02}, {t: 118, v: 0.74}]);
  const h = HERO_W * HERO.ratio;
  const cam = camera({
    scale, focus: FOCUS.whole, w: HERO_W, h, frameW: width, frameH: height,
    toY: track(frame, [{t: 0, v: 0.5}, {t: 118, v: 0.47}]),
  });

  const plate = track(frame, [{t: 92, v: 1}, {t: 138, v: 0}]); // 1 = off-screen below
  const lock = ramp(frame, 130, 30);
  const rule = ramp(frame, 146, 26);
  const meta = ramp(frame, 158, 28);

  return (
    <AbsoluteFill>
      <Studio light={{x: 0.5, y: 0.45}} spread={0.64} />
      <Particles count={44} seed="s6" />
      <Shot src="hero.png" width={HERO_W} style={cam} />
      <LightSweep start={14} duration={96} strength={0.9} />

      {/* brand plate */}
      <AbsoluteFill
        style={{
          transform: `translateY(${plate * 100}%)`,
          background: `linear-gradient(160deg, ${C.navy} 0%, ${C.navyDeep} 100%)`,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.5,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '110px 110px',
          maskImage: 'radial-gradient(90% 80% at 50% 50%, #000 10%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(90% 80% at 50% 50%, #000 10%, transparent 75%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(52% 58% at 50% 46%, rgba(47,189,178,0.16) 0%, rgba(47,189,178,0) 70%)`,
        }} />

        <div style={{textAlign: 'center', zIndex: 1}}>
          <div style={{
            opacity: lock,
            transform: `translateY(${(1 - lock) * 18}px)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
          }}>
            <div style={{width: 13, height: 13, background: C.teal, transform: 'rotate(45deg)'}} />
            <div style={{
              fontFamily: F.sans, fontSize: 92, fontWeight: 800, color: '#FFFFFF',
              letterSpacing: 16, paddingLeft: 16,
            }}>{branding.brand}</div>
          </div>

          <div style={{
            width: rule * 260, height: 3, background: C.teal,
            margin: '34px auto 0', borderRadius: 2,
          }} />

          <div style={{opacity: meta, transform: `translateY(${(1 - meta) * 14}px)`, paddingTop: 34}}>
            <div style={{
              fontFamily: F.sans, fontSize: 36, fontWeight: 500, color: '#FFFFFF',
              letterSpacing: 1.2,
            }}>{branding.product}</div>
            <div style={{
              fontFamily: F.mono, fontSize: 18, letterSpacing: 4.5, color: C.tealSoft,
              paddingTop: 18,
            }}>RÉF. {branding.reference}</div>
            <div style={{
              fontFamily: F.sans, fontSize: 21, fontWeight: 400,
              color: 'rgba(255,255,255,0.62)', paddingTop: 30, letterSpacing: 0.6,
            }}>{branding.website}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
