import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Product} from './Product';

/** Base on-screen width of the hero photo at camera scale 1. */
export const HERO_W = 1340;

/** A centred product plate that the camera transform acts upon. */
export const Shot: React.FC<{
  src: string;
  width: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({src, width, opacity, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
    <Product src={src} width={width} opacity={opacity} style={style} />
  </AbsoluteFill>
);
