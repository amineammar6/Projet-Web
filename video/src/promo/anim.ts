import type React from 'react';
import {Easing, interpolate} from 'remotion';
import {EASE, EASE_SOFT} from './theme';

const bez = (e: readonly number[]) => Easing.bezier(e[0], e[1], e[2], e[3]);

export type Key = {t: number; v: number};

/**
 * Interpolate a value across an arbitrary number of keyframes, clamped at both
 * ends, with a cinematic ease on every segment.
 */
export const track = (frame: number, keys: Key[], soft = false): number => {
  if (keys.length === 1) return keys[0].v;
  return interpolate(
    frame,
    keys.map((k) => k.t),
    keys.map((k) => k.v),
    {
      easing: bez(soft ? EASE_SOFT : EASE),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    },
  );
};

/** Ramp 0 -> 1 over `dur` frames starting at `start`. */
export const ramp = (frame: number, start: number, dur: number, soft = false) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    easing: bez(soft ? EASE_SOFT : EASE),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

/** Fade a scene in at its head and out at its tail. */
export const sceneFade = (frame: number, duration: number, cross: number) =>
  Math.min(
    interpolate(frame, [0, cross], [0, 1], {extrapolateRight: 'clamp', easing: bez(EASE_SOFT)}),
    interpolate(frame, [duration - cross, duration], [1, 0], {extrapolateLeft: 'clamp', easing: bez(EASE_SOFT)}),
  );

/**
 * Camera transform for a centred product photo.
 *
 * `transformOrigin` is pinned to the focal point so scaling pushes into that
 * detail instead of the image centre; the translation then slides that point to
 * `toX`/`toY`, expressed in fractions of the frame.
 */
export const camera = ({
  scale, focus, w, h, frameW, frameH,
  toX = 0.5, toY = 0.5, driftX = 0, driftY = 0, rotate = 0,
}: {
  scale: number;
  focus: {x: number; y: number};
  w: number;
  h: number;
  frameW: number;
  frameH: number;
  toX?: number;
  toY?: number;
  driftX?: number;
  driftY?: number;
  rotate?: number;
}): React.CSSProperties => {
  const tx = (toX - 0.5) * frameW - (focus.x - 0.5) * w + driftX;
  const ty = (toY - 0.5) * frameH - (focus.y - 0.5) * h + driftY;
  return {
    transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
    transform: [
      `translate(${tx}px, ${ty}px)`,
      `scale(${scale})`,
      rotate ? `rotate(${rotate}deg)` : '',
    ].filter(Boolean).join(' '),
  };
};
