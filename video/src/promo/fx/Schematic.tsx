import React from 'react';
import {C, F} from '../theme';
import {ramp} from '../anim';

/**
 * Working principle diagram — rollers occluding a flexible tube around the
 * pump bed. This is a schematic drawn beside the machine, never an overlay
 * altering it: the product's own geometry is left strictly alone.
 */
export const Schematic: React.FC<{
  frame: number; start: number; size?: number; rpm?: number;
}> = ({frame, start, size = 250, rpm = 26}) => {
  const p = ramp(frame, start, 34);
  const c = size / 2;
  const bed = size * 0.34;      // tube centre-line radius
  const roller = size * 0.062;
  const spin = ((frame - start) * rpm) / 30;
  const circ = 2 * Math.PI * bed;

  return (
    <svg width={size} height={size} style={{overflow: 'visible', opacity: p}}>
      {/* pump bed */}
      <circle cx={c} cy={c} r={bed + roller * 1.5} fill="none"
        stroke={C.navy} strokeOpacity={0.12} strokeWidth={1.2} />
      {/* the tube: an arc, open where the ports are */}
      <circle cx={c} cy={c} r={bed} fill="none" stroke={C.teal} strokeOpacity={0.55}
        strokeWidth={roller * 1.05} strokeLinecap="round"
        strokeDasharray={`${circ * 0.76} ${circ}`}
        strokeDashoffset={circ * (0.12 + (1 - p) * 0.76)}
        transform={`rotate(-126 ${c} ${c})`} />
      {/* fluid inside the tube */}
      <circle cx={c} cy={c} r={bed} fill="none" stroke="#FFFFFF" strokeOpacity={0.8}
        strokeWidth={roller * 0.34} strokeLinecap="round"
        strokeDasharray={`10 22`} strokeDashoffset={-spin * 3.2}
        transform={`rotate(-126 ${c} ${c})`} />
      {/* rotor hub + three rollers travelling round the bed */}
      <g transform={`rotate(${spin * 2.2} ${c} ${c})`}>
        <circle cx={c} cy={c} r={size * 0.075} fill="none" stroke={C.navy} strokeOpacity={0.35} strokeWidth={1.4} />
        {[0, 120, 240].map((a) => {
          const rad = ((a - 90) * Math.PI) / 180;
          const rx = c + Math.cos(rad) * bed;
          const ry = c + Math.sin(rad) * bed;
          return (
            <g key={a}>
              <line x1={c} y1={c} x2={rx} y2={ry} stroke={C.navy} strokeOpacity={0.30} strokeWidth={2} />
              <circle cx={rx} cy={ry} r={roller} fill="#FFFFFF" stroke={C.navy} strokeOpacity={0.5} strokeWidth={1.6} />
              <circle cx={rx} cy={ry} r={roller * 0.34} fill={C.navy} fillOpacity={0.35} />
            </g>
          );
        })}
      </g>
      <text x={c} y={size + 26} textAnchor="middle" fill={C.mute}
        fontFamily={F.mono} fontSize={13} letterSpacing={2.4}>
        PRINCIPE PÉRISTALTIQUE
      </text>
    </svg>
  );
};
