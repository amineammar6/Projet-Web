import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {z} from 'zod';
import {Fonts} from '../promo/Fonts';
import {ramp} from '../lib/anim';
import {C, CROSSFADE, F, SC} from './theme';
import {S1Intro} from './scenes/S1Intro';
import {S2Hero} from './scenes/S2Hero';
import {S3Monobloc} from './scenes/S3Monobloc';
import {S4Bearings} from './scenes/S4Bearings';
import {SeriesScene} from './scenes/SeriesScene';
import {S8Compare} from './scenes/S8Compare';
import {S9Values} from './scenes/S9Values';
import {S10Final} from './scenes/S10Final';

export const wepackSchema = z.object({
  brand: z.string(),
  claim: z.string(),
  warranty: z.string(),
  signature: z.string(),
});

export type WepackProps = z.infer<typeof wepackSchema>;

/**
 * Cross-dissolve by fading the incoming scene in over the outgoing one, which
 * stays fully opaque underneath for the whole overlap. Fading both at once
 * would let the empty background show through at the midpoint and dip the cut
 * to black — every scene here paints its own opaque set, so only the top layer
 * needs to move.
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

export const Wepack: React.FC<WepackProps> = ({brand, claim, warranty, signature}) => (
  <AbsoluteFill style={{background: C.bg0, fontFamily: F.sans}}>
    <Fonts />

    <Beat {...SC.intro} fadeIn={false}><S1Intro /></Beat>
    <Beat {...SC.hero}><S2Hero /></Beat>
    <Beat {...SC.monobloc}><S3Monobloc /></Beat>
    <Beat {...SC.bearings}><S4Bearings /></Beat>
    <Beat {...SC.nSeries}><SeriesScene index={0} /></Beat>
    <Beat {...SC.dSeries}><SeriesScene index={1} /></Beat>
    <Beat {...SC.kSeries}><SeriesScene index={2} /></Beat>
    <Beat {...SC.compare}><S8Compare /></Beat>
    <Beat {...SC.values}><S9Values /></Beat>
    <Beat {...SC.final}>
      <S10Final brand={brand} claim={claim} warranty={warranty} signature={signature} />
    </Beat>
  </AbsoluteFill>
);
