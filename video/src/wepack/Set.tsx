import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from './theme';

type Props = {
  light?: {x: number; y: number};
  spread?: number;
  /** Warms the key light towards the housing magenta. */
  tint?: number;
  grid?: boolean;
  horizon?: number;
  streaks?: number;
};

/**
 * The set: a dark cyclorama with a single key light and a reflective floor.
 * The products are cut-outs on transparency, so unlike a white-sweep photo they
 * can sit on black without any blending trick.
 */
export const Set: React.FC<Props> = ({
  light = {x: 0.5, y: 0.42},
  spread = 0.68,
  tint = 0.5,
  grid = true,
  horizon = 0.72,
  streaks = 0.5,
}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: `linear-gradient(175deg, ${C.bg1} 0%, ${C.bg0} 58%, #05070C 100%)`}} />

    {/* floor: a shade lighter than the wall so the horizon reads without a hard line */}
    <AbsoluteFill
      style={{
        top: `${horizon * 100}%`,
        background: `linear-gradient(180deg, rgba(28,36,52,0.9) 0%, rgba(11,14,21,0.95) 55%, rgba(5,7,12,1) 100%)`,
      }}
    />
    <AbsoluteFill
      style={{
        top: `${horizon * 100}%`,
        height: 1,
        background: `linear-gradient(90deg, rgba(160,180,210,0) 0%, rgba(160,180,210,0.16) 30%, rgba(160,180,210,0.16) 70%, rgba(160,180,210,0) 100%)`,
      }}
    />

    {grid ? (
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.faint2} 1px, transparent 1px), linear-gradient(90deg, ${C.faint2} 1px, transparent 1px)`,
          backgroundSize: '104px 104px',
          maskImage: 'radial-gradient(118% 88% at 50% 44%, #000 12%, transparent 74%)',
          WebkitMaskImage: 'radial-gradient(118% 88% at 50% 44%, #000 12%, transparent 74%)',
        }}
      />
    ) : null}

    {/* key light */}
    <AbsoluteFill
      style={{
        background: `radial-gradient(${spread * 100}% ${spread * 74}% at ${light.x * 100}% ${light.y * 100}%, rgba(120,140,175,0.30) 0%, rgba(70,84,110,0.13) 42%, rgba(0,0,0,0) 72%)`,
      }}
    />
    {/* brand-tinted bounce, low and wide */}
    <AbsoluteFill
      style={{
        opacity: tint,
        background: `radial-gradient(64% 46% at ${light.x * 100}% ${(light.y + 0.28) * 100}%, rgba(232,24,127,0.20) 0%, rgba(232,24,127,0) 68%)`,
      }}
    />

    {streaks ? (
      <AbsoluteFill
        style={{
          opacity: streaks * 0.5,
          background: `linear-gradient(103deg, transparent 30%, rgba(190,210,240,0.055) 42%, transparent 48%, transparent 58%, rgba(190,210,240,0.035) 66%, transparent 74%)`,
        }}
      />
    ) : null}

    {/* vignette */}
    <AbsoluteFill
      style={{
        background: `radial-gradient(78% 72% at 50% 46%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.50) 86%, rgba(0,0,0,0.78) 100%)`,
      }}
    />
  </AbsoluteFill>
);
