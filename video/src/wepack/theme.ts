// Palette sampled from the WEPACK renders themselves: the magenta is the
// housing colour under key light, the steel is the aluminium flange.
export const C = {
  bg0: '#070910',
  bg1: '#0E121B',
  bg2: '#161C28',
  panel: 'rgba(22, 28, 40, 0.72)',

  brand: '#E8187F',
  brandHot: '#FF5CA8',
  brandDeep: '#8E0B4C',

  steel: '#C9D3DF',
  steelDim: '#8C97A6',

  ink: '#FFFFFF',
  text: '#E6EAF1',
  mute: '#8A94A6',
  faint: 'rgba(200, 214, 235, 0.10)',
  faint2: 'rgba(200, 214, 235, 0.05)',
};

export const F = {
  sans: "'Inter', 'Liberation Sans', sans-serif",
  mono: "'JetBrains Mono', 'DejaVu Sans Mono', monospace",
};

export const FPS = 30;
export const CROSSFADE = 20;

/** Cut sheet. Scenes overlap by CROSSFADE frames. */
export const SC = {
  intro:    {from: 0,    duration: 240},
  hero:     {from: 220,  duration: 350},
  monobloc: {from: 550,  duration: 388},
  bearings: {from: 918,  duration: 358},
  nSeries:  {from: 1256, duration: 338},
  dSeries:  {from: 1574, duration: 338},
  kSeries:  {from: 1892, duration: 338},
  compare:  {from: 2210, duration: 358},
  values:   {from: 2548, duration: 328},
  final:    {from: 2856, duration: 364},
} as const;

export const TOTAL = SC.final.from + SC.final.duration; // 3220 frames @30fps ≈ 107s

/** Intrinsic size of each cut-out, so the composition can place them precisely. */
export const UNITS = {
  exploded:  {src: 'exploded.png',       w: 974, h: 574},
  foot:      {src: 'helical-foot.png',   w: 965, h: 695},
  flange:    {src: 'helical-flange.png', w: 676, h: 456},
  parallel:  {src: 'parallel-shaft.png', w: 905, h: 928},
  bevel:     {src: 'bevel-helical.png',  w: 911, h: 658},
} as const;

export type UnitKey = keyof typeof UNITS;

/**
 * Ranges exactly as supplied by WEPACK. Nothing here is interpolated or
 * rounded — the film must not state a figure the customer did not give.
 */
export const SERIES = [
  {
    key: 'N',
    name: 'N SERIES',
    kind: 'Réducteurs hélicoïdaux à flasque',
    unit: 'flange' as UnitKey,
    specs: [
      {label: 'Couple', value: '50 – 18.000', unit: 'Nm'},
      {label: 'Puissance moteur', value: '0,12 – 160', unit: 'kW'},
      {label: 'Vitesse de sortie', value: '0,1 – 780', unit: 'rpm'},
    ],
  },
  {
    key: 'D',
    name: 'D SERIES',
    kind: 'Réducteurs hélicoïdaux à arbres parallèles',
    unit: 'parallel' as UnitKey,
    specs: [
      {label: 'Couple', value: '130 – 18.000', unit: 'Nm'},
      {label: 'Puissance moteur', value: '0,12 – 160', unit: 'kW'},
      {label: 'Vitesse de sortie', value: '0,1 – 580', unit: 'rpm'},
    ],
  },
  {
    key: 'K',
    name: 'K SERIES',
    kind: 'Réducteurs à couple conique-hélicoïdaux',
    unit: 'bevel' as UnitKey,
    specs: [
      {label: 'Couple', value: '80 – 20.000', unit: 'Nm'},
      {label: 'Puissance moteur', value: '0,12 – 160', unit: 'kW'},
      {label: 'Vitesse de sortie', value: '0,1 – 460', unit: 'rpm'},
    ],
  },
] as const;
