import React from 'react';
import {Img, staticFile} from 'remotion';

type Props = {
  /** File name inside public/product. */
  src: string;
  width: number;
  /**
   * Fades must be applied here, never on an ancestor: `opacity` on a wrapper
   * creates a stacking context, which cuts `multiply` off from the backdrop and
   * makes the photo's white sweep paint as a flat white rectangle.
   */
  opacity?: number;
  style?: React.CSSProperties;
};

/**
 * The machine, untouched.
 *
 * The source photographs sit on a white sweep, so they are composited with
 * `mix-blend-mode: multiply` over the light backdrop: white background pixels
 * become invisible, while the body, the teal trim and the original contact
 * shadow are preserved exactly. No cut-out, no repaint, no reconstruction —
 * every pixel of the machine is the pixel the manufacturer shot.
 */
export const Product: React.FC<Props> = ({src, width, opacity = 1, style}) => (
  <Img
    src={staticFile(`product/${src}`)}
    style={{
      width,
      opacity,
      mixBlendMode: 'multiply',
      willChange: 'transform',
      ...style,
    }}
  />
);
