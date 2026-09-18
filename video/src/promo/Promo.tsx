import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {z} from 'zod';
import {Fonts} from './Fonts';
import {S1Intro} from './scenes/S1Intro';
import {S2Angles} from './scenes/S2Angles';
import {S3Tech} from './scenes/S3Tech';
import {S4Details} from './scenes/S4Details';
import {S5Running} from './scenes/S5Running';
import {S6Outro} from './scenes/S6Outro';
import {ramp} from '../lib/anim';
import {C, CROSSFADE, F, SCENES} from './theme';

export const promoSchema = z.object({
  brand: z.string(),
  product: z.string(),
  reference: z.string(),
  website: z.string(),
});

export type PromoProps = z.infer<typeof promoSchema>;

/**
 * Cross-dissolve by fading the incoming scene in over the outgoing one, which
 * stays fully opaque for the whole overlap. Fading both at once lets the empty
 * background show through at the midpoint and dips every cut towards white.
 */
const FadeIn: React.FC<{enabled: boolean; children: React.ReactNode}> = ({enabled, children}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: enabled ? ramp(frame, 0, CROSSFADE, true) : 1}}>
      {children}
    </AbsoluteFill>
  );
};

const Beat: React.FC<{
  from: number; duration: number; fadeIn?: boolean; children: React.ReactNode;
}> = ({from, duration, fadeIn = true, children}) => (
  <Sequence from={from} durationInFrames={duration} layout="none">
    <FadeIn enabled={fadeIn}>{children}</FadeIn>
  </Sequence>
);

export const Promo: React.FC<PromoProps> = ({brand, product, reference, website}) => (
  <AbsoluteFill style={{background: C.paper, fontFamily: F.sans}}>
    <Fonts />

    <Beat {...SCENES.intro} fadeIn={false}>
      <S1Intro />
    </Beat>
    <Beat {...SCENES.angles}>
      <S2Angles duration={SCENES.angles.duration} />
    </Beat>
    <Beat {...SCENES.tech}>
      <S3Tech />
    </Beat>
    <Beat {...SCENES.details}>
      <S4Details />
    </Beat>
    <Beat {...SCENES.running}>
      <S5Running />
    </Beat>
    <Beat {...SCENES.outro}>
      <S6Outro branding={{brand, product, reference, website}} />
    </Beat>
  </AbsoluteFill>
);
