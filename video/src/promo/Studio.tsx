import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from './theme';

type Props = {
  /** Centre of the key light, in fractions of the frame. */
  light?: {x: number; y: number};
  /** Key-light radius as a fraction of frame width. */
  spread?: number;
  /** 0 = flat plate, 1 = full falloff towards the edges. */
  falloff?: number;
  grid?: boolean;
  horizon?: number;
};

/**
 * The set: a seamless light cyclorama. Everything stays bright because the
 * product photography is composited with `multiply` — a dark backdrop would
 * clip the machine's white body, so depth comes from falloff, not from black.
 */
export const Studio: React.FC<Props> = ({
  light = {x: 0.5, y: 0.44},
  spread = 0.62,
  falloff = 1,
  grid = true,
  horizon = 0.78,
}) => {
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `linear-gradient(180deg, #FDFEFF 0%, #F4F7FB 52%, #E9EEF5 100%)`}} />

      {/* floor plane: a touch cooler and darker than the wall, with a soft seam */}
      <AbsoluteFill
        style={{
          top: `${horizon * 100}%`,
          background: `linear-gradient(180deg, rgba(210,219,231,0) 0%, rgba(200,211,226,0.55) 38%, rgba(184,197,215,0.75) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          top: `${horizon * 100}%`,
          height: 2,
          background: `linear-gradient(90deg, rgba(13,26,101,0) 0%, rgba(13,26,101,0.10) 28%, rgba(13,26,101,0.10) 72%, rgba(13,26,101,0) 100%)`,
        }}
      />

      {grid ? (
        <AbsoluteFill
          style={{
            opacity: 0.55,
            backgroundImage: `linear-gradient(${C.lineFaint} 1px, transparent 1px), linear-gradient(90deg, ${C.lineFaint} 1px, transparent 1px)`,
            backgroundSize: '96px 96px',
            maskImage: 'radial-gradient(120% 90% at 50% 45%, #000 20%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(120% 90% at 50% 45%, #000 20%, transparent 78%)',
          }}
        />
      ) : null}

      {/* key light pool */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(${spread * 100}% ${spread * 78}% at ${light.x * 100}% ${light.y * 100}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.45) 45%, rgba(255,255,255,0) 72%)`,
        }}
      />

      {/* edge falloff keeps the product reading as the brightest thing on screen */}
      <AbsoluteFill
        style={{
          opacity: falloff,
          background: `radial-gradient(84% 74% at 50% 46%, rgba(255,255,255,0) 48%, rgba(139,155,180,0.26) 84%, rgba(84,103,138,0.42) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
