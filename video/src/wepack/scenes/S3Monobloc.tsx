import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Set} from '../Set';
import {UnitStage} from '../Unit';
import {Dust} from '../fx/Atmos';
import {MonoblocDiagram} from '../fx/Diagrams';
import {Kicker, Reveal, Rule, Sub, Title} from '../fx/Typo';
import {ramp, track} from '../../lib/anim';
import {C, F} from '../theme';

const BENEFITS = [
  {t: 'Rigidité', s: 'Une seule pièce, aucun plan de joint structurel'},
  {t: 'Étanchéité', s: 'Moins d’interfaces, moins de fuites'},
  {t: 'Réduction du bruit', s: 'Moins de vibrations transmises'},
  {t: 'Robustesse des engrenages', s: 'Entraxes tenus sous charge'},
];

const Benefit: React.FC<{frame: number; start: number; i: number; t: string; s: string}> = ({
  frame, start, i, t, s,
}) => {
  const p = ramp(frame, start, 26);
  return (
    <div style={{
      opacity: p, transform: `translateX(${(1 - p) * -22}px)`,
      display: 'flex', gap: 20, alignItems: 'flex-start', paddingBottom: 26,
    }}>
      <div style={{
        fontFamily: F.mono, fontSize: 14, color: C.brandHot, paddingTop: 8, minWidth: 30,
      }}>{String(i + 1).padStart(2, '0')}</div>
      <div>
        <div style={{fontFamily: F.sans, fontSize: 31, fontWeight: 700, color: C.ink, letterSpacing: -0.4}}>
          {t}
        </div>
        <div style={{fontFamily: F.sans, fontSize: 19, color: C.mute, paddingTop: 4}}>{s}</div>
      </div>
    </div>
  );
};

/**
 * Scene 3 — from the real exploded render to a cross-section that draws the
 * housing as one unbroken outline.
 */
export const S3Monobloc: React.FC = () => {
  const frame = useCurrentFrame();

  const photo = Math.min(ramp(frame, 6, 26, true), 1 - ramp(frame, 128, 34, true));
  const diagram = ramp(frame, 138, 30, true);
  const drift = track(frame, [{t: 0, v: 40}, {t: 170, v: -26}], true);

  return (
    <AbsoluteFill>
      <Set light={{x: 0.44, y: 0.42}} spread={0.62} tint={0.4} horizon={0.8} />
      <Dust frame={frame} count={54} seed="s3" />

      {photo > 0.002 ? (
        <UnitStage unit="exploded" width={1380} opacity={photo} ground={false} glow={0.35 * photo}
          style={{transform: `translate(${drift}px, -30px) scale(${track(frame, [{t: 0, v: 0.97}, {t: 162, v: 1.05}], true)})`}} />
      ) : null}

      <AbsoluteFill style={{
        opacity: photo, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 108,
      }}>
        <Kicker>Conception</Kicker>
      </AbsoluteFill>

      {/* cross-section */}
      <div style={{
        position: 'absolute', left: 84, top: '50%',
        transform: `translateY(-50%) scale(${0.96 + 0.04 * diagram})`,
        opacity: diagram,
      }}>
        <MonoblocDiagram frame={frame} start={148} width={840} />
      </div>

      <AbsoluteFill style={{
        opacity: diagram, paddingLeft: 980, paddingRight: 96,
        justifyContent: 'center',
      }}>
        <Reveal frame={frame} start={158} style={{paddingBottom: 16}}>
          <Kicker>Principe novateur</Kicker>
        </Reveal>
        <Rule frame={frame} start={168} w={90} />
        <Reveal frame={frame} start={176} rise={30} style={{paddingTop: 20}}>
          <Title size={62}>Corps monobloc</Title>
        </Reveal>
        <Reveal frame={frame} start={196} style={{paddingTop: 16, paddingBottom: 38}}>
          <Sub size={21}>
            Nos réducteurs de nouvelle génération sont conçus selon un principe
            novateur : le corps monobloc.
          </Sub>
        </Reveal>
        {BENEFITS.map((b, i) => (
          <Benefit key={b.t} frame={frame} start={226 + i * 34} i={i} t={b.t} s={b.s} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
