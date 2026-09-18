import React from 'react';
import {C, F} from '../theme';
import {ramp} from '../../lib/anim';

/** Text rises behind a clipping edge — restrained, no letter-by-letter tricks. */
export const Reveal: React.FC<{
  frame: number; start: number; dur?: number; rise?: number;
  children: React.ReactNode; style?: React.CSSProperties;
}> = ({frame, start, dur = 28, rise = 30, children, style}) => {
  const p = ramp(frame, start, dur);
  return (
    <div style={{overflow: 'hidden', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * rise}px)`, opacity: p}}>{children}</div>
    </div>
  );
};

export const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({
  children, color = C.brandHot,
}) => (
  <div style={{
    fontFamily: F.mono, fontSize: 18, letterSpacing: 6, fontWeight: 600,
    color, textTransform: 'uppercase',
  }}>{children}</div>
);

export const Title: React.FC<{
  children: React.ReactNode; size?: number; color?: string; weight?: number; ls?: number;
}> = ({children, size = 66, color = C.ink, weight = 800, ls = -1.6}) => (
  <div style={{
    fontFamily: F.sans, fontSize: size, lineHeight: 1.04, fontWeight: weight,
    color, letterSpacing: ls,
  }}>{children}</div>
);

export const Sub: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({
  children, size = 25, color = C.mute,
}) => (
  <div style={{fontFamily: F.sans, fontSize: size, fontWeight: 400, color, lineHeight: 1.5}}>
    {children}
  </div>
);

export const Rule: React.FC<{frame: number; start: number; w?: number; color?: string}> = ({
  frame, start, w = 96, color = C.brand,
}) => {
  const p = ramp(frame, start, 30);
  return <div style={{width: w * p, height: 3, background: color, borderRadius: 2}} />;
};

/**
 * One technical figure. The value carries the weight; the unit stays quiet, so
 * a column of these reads as a spec sheet rather than as marketing.
 */
export const Spec: React.FC<{
  frame: number; start: number; label: string; value: string; unit: string;
  size?: number; align?: 'left' | 'center';
}> = ({frame, start, label, value, unit, size = 46, align = 'left'}) => {
  const p = ramp(frame, start, 26);
  return (
    <div style={{
      opacity: p,
      transform: `translateY(${(1 - p) * 16}px)`,
      textAlign: align,
    }}>
      <div style={{
        fontFamily: F.mono, fontSize: 13, letterSpacing: 3.4, color: C.mute,
        textTransform: 'uppercase', marginBottom: 10,
      }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 10,
        justifyContent: align === 'center' ? 'center' : 'flex-start',
      }}>
        <div style={{
          fontFamily: F.mono, fontSize: size, fontWeight: 600, color: C.ink, letterSpacing: -1,
        }}>{value}</div>
        <div style={{fontFamily: F.sans, fontSize: size * 0.42, fontWeight: 500, color: C.brandHot}}>
          {unit}
        </div>
      </div>
    </div>
  );
};

/** Small outlined badge used for the warranty mention. */
export const Badge: React.FC<{frame: number; start: number; children: React.ReactNode}> = ({
  frame, start, children,
}) => {
  const p = ramp(frame, start, 24);
  return (
    <div style={{
      opacity: p,
      transform: `translateY(${(1 - p) * 10}px)`,
      display: 'inline-flex', alignItems: 'center', gap: 12,
      padding: '11px 22px',
      border: `1px solid rgba(232,24,127,0.45)`,
      borderRadius: 999,
      background: 'rgba(232,24,127,0.07)',
      fontFamily: F.sans, fontSize: 19, fontWeight: 500, color: C.text, letterSpacing: 0.4,
      whiteSpace: 'nowrap',
    }}>
      <span style={{width: 7, height: 7, borderRadius: 999, background: C.brand}} />
      {children}
    </div>
  );
};

/** Word that steps in as part of a vertical list (Performance / Fiabilité / …). */
export const Word: React.FC<{
  frame: number; start: number; children: React.ReactNode; size?: number;
}> = ({frame, start, children, size = 78}) => {
  const p = ramp(frame, start, 24);
  const out = ramp(frame, start + 62, 20);
  const o = Math.min(p, 1 - out * 0.0);
  return (
    <div style={{
      opacity: o,
      transform: `translateX(${(1 - p) * -28}px)`,
      display: 'flex', alignItems: 'center', gap: 22,
    }}>
      <div style={{width: 10 + 44 * p, height: 2, background: C.brand}} />
      <div style={{
        fontFamily: F.sans, fontSize: size, fontWeight: 800, color: C.ink, letterSpacing: -1.6,
      }}>{children}</div>
    </div>
  );
};
