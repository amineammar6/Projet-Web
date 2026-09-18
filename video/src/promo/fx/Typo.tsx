import React from 'react';
import {C, F} from '../theme';
import {ramp} from '../anim';

/** Words rise into place behind a clipping edge — no flashy letter effects. */
export const Reveal: React.FC<{
  frame: number; start: number; dur?: number; rise?: number; children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({frame, start, dur = 26, rise = 26, children, style}) => {
  const p = ramp(frame, start, dur);
  return (
    <div style={{overflow: 'hidden', ...style}}>
      <div style={{transform: `translateY(${(1 - p) * rise}px)`, opacity: p}}>{children}</div>
    </div>
  );
};

export const Kicker: React.FC<{children: React.ReactNode; color?: string}> = ({
  children, color = C.teal,
}) => (
  <div style={{
    fontFamily: F.mono, fontSize: 19, letterSpacing: 5.5, fontWeight: 600,
    color, textTransform: 'uppercase',
  }}>{children}</div>
);

export const Title: React.FC<{
  children: React.ReactNode; size?: number; color?: string; weight?: number;
}> = ({children, size = 66, color = C.navy, weight = 800}) => (
  <div style={{
    fontFamily: F.sans, fontSize: size, lineHeight: 1.06, fontWeight: weight,
    color, letterSpacing: -1.4,
  }}>{children}</div>
);

export const Sub: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({
  children, size = 25, color = C.slate,
}) => (
  <div style={{
    fontFamily: F.sans, fontSize: size, fontWeight: 400, color, letterSpacing: 0.1,
    lineHeight: 1.45,
  }}>{children}</div>
);

/** Thin teal rule that wipes open. */
export const Rule: React.FC<{frame: number; start: number; w?: number; color?: string}> = ({
  frame, start, w = 92, color = C.teal,
}) => {
  const p = ramp(frame, start, 30);
  return <div style={{width: w * p, height: 3, background: color, borderRadius: 2}} />;
};

/** Spec pill used to list technical attributes without crowding the machine. */
export const Chip: React.FC<{
  frame: number; start: number; children: React.ReactNode;
}> = ({frame, start, children}) => {
  const p = ramp(frame, start, 22);
  return (
    <div style={{
      opacity: p,
      transform: `translateY(${(1 - p) * 14}px)`,
      fontFamily: F.sans, fontSize: 20, fontWeight: 500, color: C.navy,
      padding: '11px 20px',
      border: `1px solid ${C.line}`,
      borderRadius: 999,
      background: 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(2px)',
      whiteSpace: 'nowrap',
    }}>{children}</div>
  );
};

/** Numeric readout in the technical mono face. */
export const Readout: React.FC<{
  label: string; value: string; unit?: string; frame: number; start: number;
}> = ({label, value, unit, frame, start}) => {
  const p = ramp(frame, start, 22);
  return (
    <div style={{opacity: p, transform: `translateX(${(1 - p) * -12}px)`}}>
      <div style={{
        fontFamily: F.mono, fontSize: 14, letterSpacing: 3, color: C.mute,
        textTransform: 'uppercase', marginBottom: 6,
      }}>{label}</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
        <div style={{fontFamily: F.mono, fontSize: 40, fontWeight: 600, color: C.navy, letterSpacing: -0.5}}>
          {value}
        </div>
        {unit ? (
          <div style={{fontFamily: F.sans, fontSize: 18, fontWeight: 500, color: C.slate}}>{unit}</div>
        ) : null}
      </div>
    </div>
  );
};
