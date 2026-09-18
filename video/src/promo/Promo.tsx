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
import {sceneFade} from './anim';
import {C, CROSSFADE, F, SCENES} from './theme';

export const promoSchema = z.object({
  brand: z.string(),
  product: z.string(),
  reference: z.string(),
  website: z.string(),
});

export type PromoProps = z.infer<typeof promoSchema>;

/** Wraps a scene so consecutive scenes dissolve into each other. */
const Beat: React.FC<{
  from: number; duration: number; fadeIn?: boolean; fadeOut?: boolean;
  children: React.ReactNode;
}> = ({from, duration, fadeIn = true, fadeOut = true, children}) => (
  <Sequence from={from} durationInFrames={duration} layout="none">
    <Dissolve duration={duration} fadeIn={fadeIn} fadeOut={fadeOut}>{children}</Dissolve>
  </Sequence>
);

const Dissolve: React.FC<{
  duration: number; fadeIn: boolean; fadeOut: boolean; children: React.ReactNode;
}> = ({duration, fadeIn, fadeOut, children}) => {
  const frame = useCurrentFrame();
  const f = sceneFade(frame, duration, CROSSFADE);
  const opacity = Math.min(fadeIn ? f : 1, fadeOut ? f : 1, 1);
  return <AbsoluteFill style={{opacity: fadeIn || fadeOut ? opacity : 1}}>{children}</AbsoluteFill>;
};

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
    <Beat {...SCENES.outro} fadeOut={false}>
      <S6Outro branding={{brand, product, reference, website}} />
    </Beat>
  </AbsoluteFill>
);
