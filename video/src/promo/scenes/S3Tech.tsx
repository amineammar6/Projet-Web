import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Studio} from '../Studio';
import {Shot} from '../Stage';
import {Particles} from '../fx/Particles';
import {Brackets, Dimension, ScanBar, ScanDefs, TechRing} from '../fx/Graphics';
import {Schematic} from '../fx/Schematic';
import {Chip, Kicker, Reveal, Rule, Sub, Title} from '../fx/Typo';
import {camera, ramp, track} from '../../lib/anim';
import {FOCUS, HERO} from '../theme';

const W_HERO = 1180;
/** Machine silhouette inside hero.png, as fractions of the photo. */
const BBOX = {x1: 0.097, y1: 0.164, x2: 0.852, y2: 0.847};

const CHIPS = [
  'Entraînement pas à pas',
  'Écran OLED + molette',
  'Pilotage Modbus / RS485',
  'Silicone · EPDM · Santoprène',
];

/**
 * Scene 3 — technical read of the machine: framing brackets, an analysis
 * sweep, a dimension rule and the working-principle diagram. Every graphic is
 * placed around the silhouette, never across it.
 */
export const S3Tech: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const scale = track(frame, [{t: 0, v: 0.99}, {t: 252, v: 1.06}]);
  const h = W_HERO * HERO.ratio;
  const toX = 0.655;
  const toY = 0.47;
  const cam = camera({
    scale, focus: FOCUS.whole, w: W_HERO, h, frameW: width, frameH: height, toX, toY,
  });

  // project any point of the photo onto the frame under the current camera
  const px = (fx: number) => toX * width + (fx - FOCUS.whole.x) * W_HERO * scale;
  const py = (fy: number) => toY * height + (fy - FOCUS.whole.y) * h * scale;

  const bx = px(BBOX.x1);
  const by = py(BBOX.y1);
  const bw = px(BBOX.x2) - bx;
  const bh = py(BBOX.y2) - by;

  return (
    <AbsoluteFill>
      <Studio light={{x: 0.62, y: 0.42}} spread={0.6} />
      <Particles count={60} seed="s3" />

      <Shot src="hero.png" width={W_HERO} style={cam} />

      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <ScanDefs />
        <Brackets frame={frame} start={24} x={bx - 34} y={by - 34} w={bw + 68} h={bh + 68} />
        <ScanBar frame={frame} start={46} duration={96} x={bx - 34} top={by - 30} height={bh + 60} width={bw + 68} />
        <TechRing frame={frame} start={96} x={px(FOCUS.pumpHead.x)} y={py(FOCUS.pumpHead.y)}
          r={Math.max(92, bw * 0.15)} label="TÊTE DE POMPE" />
        <Dimension frame={frame} start={130} x1={bx} x2={bx + bw} y={by + bh + 70} label="ENCOMBREMENT RÉDUIT" />
      </svg>

      <AbsoluteFill style={{padding: '186px 0 0 110px', justifyContent: 'flex-start', width: 620}}>
        <Reveal frame={frame} start={18} style={{paddingBottom: 16}}>
          <Kicker>Technologie</Kicker>
        </Reveal>
        <Rule frame={frame} start={28} w={84} />
        <Reveal frame={frame} start={36} rise={30} style={{paddingTop: 20}}>
          <Title size={58}>Conçue pour la précision</Title>
        </Reveal>
        <Reveal frame={frame} start={54} style={{paddingTop: 18, paddingRight: 40}}>
          <Sub>
            Le liquide ne touche que le tube : aucun contact avec les pièces
            mécaniques, aucune contamination croisée.
          </Sub>
        </Reveal>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 34, maxWidth: 560}}>
          {CHIPS.map((c, i) => (
            <Chip key={c} frame={frame} start={82 + i * 13}>{c}</Chip>
          ))}
        </div>
      </AbsoluteFill>

      <div style={{position: 'absolute', left: 116, bottom: 72, opacity: ramp(frame, 150, 30)}}>
        <Schematic frame={frame} start={150} size={164} rpm={30} />
      </div>
    </AbsoluteFill>
  );
};
