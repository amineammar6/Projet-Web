// Palette derived from the product itself (teal trim, warm white body, slate
// panel) and from the WE PACK datasheet (navy). Nothing here is invented.
export const C = {
  navy: '#0D1A65',
  navyDeep: '#071039',
  teal: '#2FBDB2',
  tealSoft: '#7FD9D2',
  slate: '#5A6472',
  ink: '#101826',
  mute: '#7C8797',
  line: 'rgba(13, 26, 101, 0.14)',
  lineFaint: 'rgba(13, 26, 101, 0.06)',
  paper: '#FFFFFF',
  paperEdge: '#E7ECF3',
};

export const F = {
  sans: "'Inter', 'Liberation Sans', sans-serif",
  mono: "'JetBrains Mono', 'DejaVu Sans Mono', monospace",
};

/** Cinematic ease: slow start, long glide, gentle settle. */
export const EASE = [0.33, 0.0, 0.12, 1.0] as const;
/** Softer ease for graphic elements that should feel weightless. */
export const EASE_SOFT = [0.4, 0.0, 0.2, 1.0] as const;

export const FPS = 30;

/** Scene cut sheet. Each scene overlaps the next by CROSSFADE frames. */
export const CROSSFADE = 14;
/**
 * Every scene must still be on screen while the next one fades in over it, so
 * each duration runs CROSSFADE frames past the following scene's start. Leaving
 * a gap here blinks the background through the cut.
 */
export const SCENES = {
  intro:   {from: 0,    duration: 220},
  angles:  {from: 206,  duration: 300},
  tech:    {from: 492,  duration: 252},
  details: {from: 730,  duration: 300},
  running: {from: 1016, duration: 248},
  outro:   {from: 1250, duration: 250},
} as const;

export const TOTAL =
  SCENES.outro.from + SCENES.outro.duration; // 1500 frames @30fps = 50s

/** Hero photo geometry (public/product/hero.png is 1648 x 1430). */
export const HERO = {w: 1648, h: 1430, ratio: 1430 / 1648};

/** Focal points on the hero photo, as fractions of its width / height. */
export const FOCUS = {
  whole:    {x: 0.47, y: 0.50},
  panel:    {x: 0.34, y: 0.39},
  knob:     {x: 0.40, y: 0.385},
  keys:     {x: 0.36, y: 0.49},
  handle:   {x: 0.62, y: 0.22},
  pumpHead: {x: 0.22, y: 0.65},
  logo:     {x: 0.55, y: 0.62},
};

/** Rotor disc registration inside public/product/front.png (506 x 503). */
export const ROTOR = {cx: 233, cy: 360, r: 86, frontW: 506, frontH: 503};
