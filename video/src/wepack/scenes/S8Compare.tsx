import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Set} from '../Set';
import {Unit} from '../Unit';
import {Dust} from '../fx/Atmos';
import {Kicker, Reveal, Rule, Title} from '../fx/Typo';
import {ramp} from '../../lib/anim';
import {C, F, SERIES} from '../theme';

const THUMB: Record<string, number> = {N: 330, D: 250, K: 320};

const Column: React.FC<{index: number; frame: number; start: number}> = ({index, frame, start}) => {
  const s = SERIES[index];
  const p = ramp(frame, start, 30);
  return (
    <div style={{
      flex: 1, opacity: p, transform: `translateY(${(1 - p) * 26}px)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '34px 26px 30px',
      border: `1px solid ${C.faint}`,
      borderRadius: 18,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.008) 100%)',
    }}>
      <div style={{height: 220, display: 'flex', alignItems: 'center'}}>
        <Unit unit={s.unit} width={THUMB[s.key]} ground={false} glow={0.3} />
      </div>
      <div style={{
        fontFamily: F.sans, fontSize: 40, fontWeight: 800, color: C.ink,
        letterSpacing: 1.6, paddingTop: 10,
      }}>{s.name}</div>
      <div style={{
        fontFamily: F.sans, fontSize: 16, color: C.mute, textAlign: 'center',
        paddingTop: 10, minHeight: 46, lineHeight: 1.4,
      }}>{s.kind}</div>
      <div style={{width: 46, height: 2, background: C.brand, margin: '18px 0 20px'}} />
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 14}}>
        {s.specs.map((sp) => (
          <div key={sp.label} style={{display: 'flex', flexDirection: 'column', gap: 3}}>
            <div style={{fontFamily: F.mono, fontSize: 11, letterSpacing: 2.4, color: C.mute}}>
              {sp.label.toUpperCase()}
            </div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 7}}>
              <div style={{fontFamily: F.mono, fontSize: 25, fontWeight: 600, color: C.ink}}>
                {sp.value}
              </div>
              <div style={{fontFamily: F.sans, fontSize: 14, fontWeight: 500, color: C.brandHot}}>
                {sp.unit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Scene 8 — the three ranges side by side, figures exactly as supplied. */
export const S8Compare: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Set light={{x: 0.5, y: 0.34}} spread={0.72} tint={0.35} horizon={0.94} streaks={0.25} />
      <Dust frame={frame} count={40} opacity={0.6} seed="s8" />

      <AbsoluteFill style={{alignItems: 'center', paddingTop: 76}}>
        <Reveal frame={frame} start={10} style={{paddingBottom: 14}}>
          <Kicker>Nos produits</Kicker>
        </Reveal>
        <div style={{display: 'flex', justifyContent: 'center', paddingBottom: 18}}>
          <Rule frame={frame} start={20} w={90} />
        </div>
        <Reveal frame={frame} start={28} rise={26}>
          <Title size={50}>Trois gammes, une même ingénierie</Title>
        </Reveal>
      </AbsoluteFill>

      <AbsoluteFill style={{
        padding: '286px 110px 72px', display: 'flex', flexDirection: 'row', gap: 26,
        alignItems: 'stretch',
      }}>
        {[0, 1, 2].map((i) => (
          <Column key={i} index={i} frame={frame} start={62 + i * 38} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
