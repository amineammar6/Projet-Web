import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Studio} from '../Studio';
import {Particles} from '../fx/Particles';
import {Kicker, Readout, Reveal, Rule, Sub, Title} from '../fx/Typo';
import {ramp, track} from '../../lib/anim';
import {C, F, ROTOR} from '../theme';

const FRONT_W = 700;
/** Rotor turns at a legible film speed; the panel values below are the ones
 *  actually displayed on the machine in the manufacturer's photograph. */
const FILM_RPM = 34;

/**
 * The pump running. The spinning disc is the machine's own rotor, cut from the
 * front view and rotated about its true centre — the part moves, the design
 * does not change. `mix-blend-mode` on the wrapper groups plate and rotor, so
 * the pair multiplies onto the backdrop exactly once.
 */
const RunningPump: React.FC<{
  frame: number; start: number; left: number; top: number; scale: number;
}> = ({frame, start, left, top, scale}) => {
  const s = FRONT_W / ROTOR.frontW;
  const h = FRONT_W * (ROTOR.frontH / ROTOR.frontW);
  const spinUp = track(frame, [{t: start, v: 0}, {t: start + 50, v: 1}], true);
  const angle = ((frame - start) * FILM_RPM * spinUp * 6) / 30;
  const discW = ROTOR.r * 2 * s;

  return (
    <div style={{
      position: 'absolute', left, top, width: FRONT_W, height: h,
      transform: `scale(${scale})`, transformOrigin: '50% 50%',
      mixBlendMode: 'multiply',
    }}>
      <Img src={staticFile('product/front.png')} style={{width: FRONT_W, display: 'block'}} />
      <Img
        src={staticFile('product/rotor.png')}
        style={{
          position: 'absolute',
          left: (ROTOR.cx - ROTOR.r) * s,
          top: (ROTOR.cy - ROTOR.r) * s,
          width: discW,
          height: discW,
          transform: `rotate(${angle}deg)`,
          willChange: 'transform',
        }}
      />
    </div>
  );
};

export const S5Running: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const s = FRONT_W / ROTOR.frontW;
  const h = FRONT_W * (ROTOR.frontH / ROTOR.frontW);
  const plateX = width * 0.655 - FRONT_W / 2;
  const plateY = height / 2 - h / 2;
  const rotorX = plateX + ROTOR.cx * s;
  const rotorY = plateY + ROTOR.cy * s;
  const rotorR = ROTOR.r * s;

  const dash = -(frame * 3.2);
  const live = ramp(frame, 40, 26);

  return (
    <AbsoluteFill>
      <Studio light={{x: 0.64, y: 0.46}} spread={0.6} />
      <Particles count={46} seed="s5" />

      <RunningPump
        frame={frame} start={0} left={plateX} top={plateY}
        scale={track(frame, [{t: 0, v: 0.97}, {t: 236, v: 1.03}], true)}
      />

      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        {/* fluid path: in on one side, out on the other, never over the machine */}
        <path
          d={`M ${plateX - 250} ${rotorY + 120} H ${plateX - 34}`}
          stroke={C.teal} strokeOpacity={0.45 * live} strokeWidth={7} strokeLinecap="round" fill="none"
        />
        <path
          d={`M ${plateX - 250} ${rotorY + 120} H ${plateX - 34}`}
          stroke="#FFFFFF" strokeOpacity={0.9 * live} strokeWidth={2.4}
          strokeDasharray="8 20" strokeDashoffset={dash} fill="none"
        />
        <path
          d={`M ${plateX + FRONT_W + 34} ${rotorY + 120} H ${plateX + FRONT_W + 250}`}
          stroke={C.teal} strokeOpacity={0.45 * live} strokeWidth={7} strokeLinecap="round" fill="none"
        />
        <path
          d={`M ${plateX + FRONT_W + 34} ${rotorY + 120} H ${plateX + FRONT_W + 250}`}
          stroke="#FFFFFF" strokeOpacity={0.9 * live} strokeWidth={2.4}
          strokeDasharray="8 20" strokeDashoffset={dash} fill="none"
        />
        <text x={plateX - 250} y={rotorY + 100} fill={C.mute} fontFamily={F.mono} fontSize={14} letterSpacing={2.4}>
          ASPIRATION
        </text>
        <text x={plateX + FRONT_W + 250} y={rotorY + 100} textAnchor="end" fill={C.mute}
          fontFamily={F.mono} fontSize={14} letterSpacing={2.4}>
          REFOULEMENT
        </text>

        {/* rotation indicator hugging the rotor */}
        <circle cx={rotorX} cy={rotorY} r={rotorR * 1.32} fill="none" stroke={C.teal}
          strokeOpacity={0.5 * live} strokeWidth={2}
          strokeDasharray={`${2 * Math.PI * rotorR * 1.32 * 0.22} ${2 * Math.PI * rotorR * 1.32}`}
          transform={`rotate(${frame * 2.4} ${rotorX} ${rotorY})`} />
        <circle cx={rotorX} cy={rotorY} r={rotorR * 1.55} fill="none" stroke={C.navy}
          strokeOpacity={0.14 * live} strokeWidth={1} strokeDasharray="3 12" />
      </svg>

      <AbsoluteFill style={{padding: '0 0 0 110px', justifyContent: 'center', width: 560}}>
        <Reveal frame={frame} start={12} style={{paddingBottom: 16}}>
          <Kicker>En fonctionnement</Kicker>
        </Reveal>
        <Rule frame={frame} start={22} w={84} />
        <Reveal frame={frame} start={30} rise={30} style={{paddingTop: 20}}>
          <Title size={56}>Débit régulier,<br />dosage répétable</Title>
        </Reveal>
        <Reveal frame={frame} start={48} style={{paddingTop: 16, paddingRight: 30}}>
          <Sub>Marche continue ou par impulsion, réglage fin de la vitesse du rotor.</Sub>
        </Reveal>

        <div style={{display: 'flex', gap: 54, paddingTop: 40}}>
          <Readout frame={frame} start={72} label="Débit" value="166.95" unit="mL/min" />
          <Readout frame={frame} start={86} label="Vitesse" value="350.00" unit="rpm" />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, paddingTop: 34,
          opacity: ramp(frame, 104, 22),
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: 999, background: C.teal,
            opacity: 0.55 + 0.45 * Math.sin(frame / 5),
          }} />
          <div style={{fontFamily: F.mono, fontSize: 15, letterSpacing: 2.6, color: C.slate}}>
            MODE CONTINU · AUTO-AMORÇAGE
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
