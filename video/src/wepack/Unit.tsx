import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, UNITS, UnitKey} from './theme';

type Props = {
  unit: UnitKey;
  /** On-screen width in px at scale 1. */
  width: number;
  opacity?: number;
  /** Ground the unit with a cast shadow and a floor reflection. */
  ground?: boolean;
  /** Brand-coloured rim glow behind the silhouette. */
  glow?: number;
  style?: React.CSSProperties;
};

/**
 * One product, exactly as supplied. The renders arrive with their own alpha, so
 * nothing is keyed or repainted here — only placed, lit from behind and given a
 * floor. Every transform belongs to the camera, never to the machine.
 */
export const Unit: React.FC<Props> = ({unit, width, opacity = 1, ground = true, glow = 0, style}) => {
  const u = UNITS[unit];
  const h = width * (u.h / u.w);
  const src = staticFile(`wepack/${u.src}`);

  return (
    <div style={{position: 'relative', width, height: h, opacity, ...style}}>
      {glow > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: '-18%', top: '-14%', width: '136%', height: '150%',
            background: `radial-gradient(50% 44% at 50% 46%, rgba(232,24,127,${0.42 * glow}) 0%, rgba(232,24,127,0) 70%)`,
            filter: 'blur(28px)',
          }}
        />
      ) : null}

      {ground ? (
        <>
          {/* cast shadow on the floor */}
          <div
            style={{
              position: 'absolute',
              left: '-10%', top: h * 0.93, width: '120%', height: h * 0.20,
              background: 'radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 72%)',
              filter: 'blur(10px)',
            }}
          />
          {/* floor reflection */}
          <Img
            src={src}
            style={{
              position: 'absolute',
              left: 0, top: h, width, height: h,
              transform: 'scaleY(-1)',
              opacity: 0.16,
              filter: 'blur(3px) saturate(0.7)',
              maskImage: 'linear-gradient(to top, transparent 4%, rgba(0,0,0,0.9) 62%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 4%, rgba(0,0,0,0.9) 62%)',
            }}
          />
        </>
      ) : null}

      <Img
        src={src}
        style={{
          position: 'relative',
          width,
          height: h,
          display: 'block',
          filter: `drop-shadow(0 18px 34px rgba(0,0,0,0.55))`,
          willChange: 'transform',
        }}
      />
    </div>
  );
};

/** Centres a unit on the frame so a camera transform can act on it. */
export const UnitStage: React.FC<Props> = (props) => (
  <div style={{
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <Unit {...props} />
  </div>
);

export const RULE = C.faint;
