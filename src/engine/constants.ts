export const EngineFlags = {
  AUTO_SCALE_Y: 1 << 0,
  EMA_ENABLED: 1 << 1,
  LOG_SCALE: 1 << 2,
  HEIKIN_ASHI: 1 << 3,
  BB_ENABLED: 1 << 4,
  RSI_ENABLED: 1 << 5,
  CROSSHAIR_MAGNET: 1 << 6,
} as const;

export const CandleMetaBits = {
  BULLISH: 1 << 0,
  DOJI: 1 << 1,
  PINBAR: 1 << 2,
  ENGULFING: 1 << 3,
} as const;

export const ParamInOffset = {
  CANDLE_COUNT: 0,
  VP_WIDTH: 4,
  VP_HEIGHT: 8,
  CHART_LEFT: 12,
  CHART_TOP: 16,
  CHART_WIDTH: 20,
  CHART_HEIGHT: 24,
  VOL_TOP: 28,
  VOL_HEIGHT: 32,
  CANDLE_PITCH: 36,
  BODY_WIDTH: 40,
  SCROLL_RIGHT: 44,
  CURSOR_X: 48,
  CURSOR_Y: 52,
  EMA0_PERIOD: 56,
  EMA1_PERIOD: 60,
  FLAGS: 64,
  MANUAL_MIN: 68,
  MANUAL_MAX: 72,
  PADDING_RATIO: 76,
  DPR: 80,
  RSI_TOP: 84,
  RSI_HEIGHT: 88,
  BB_PERIOD: 92,
  BB_STDDEV: 96,
  EMA2_PERIOD: 100,
  EMA3_PERIOD: 104,
  EMA_MASK: 108,
} as const;

export const ParamOutOffset = {
  VIS_START: 0,
  VIS_END: 4,
  VIS_COUNT: 8,
  MIN_PRICE: 12,
  MAX_PRICE: 16,
  RAW_LOW: 20,
  RAW_HIGH: 24,
  MAX_VOL: 28,
  HOVER_INDEX: 32,
  HOVER_SNAP_X: 36,
  HOVER_PRICE: 40,
  GRID_COUNT: 44,
  LAST_CLOSE: 48,
  FIRST_OPEN: 52,
  CHANGE_PCT: 56,
  LAST_PRICE_Y: 60,
  BULL_COUNT: 64,
  BEAR_COUNT: 68,
  EMA0_LAST: 72,
  EMA1_LAST: 76,
  RSI_LAST: 80,
  BB_UPPER_LAST: 84,
  BB_LOWER_LAST: 88,
  EMA2_LAST: 92,
  EMA3_LAST: 96,
} as const;

export interface EmaSlotConfig {
  enabled: boolean;
  period: number;
  color: string;
}

export type EmaConfigTuple = [
  EmaSlotConfig,
  EmaSlotConfig,
  EmaSlotConfig,
  EmaSlotConfig,
];

export type EmaPeriodTuple = [number, number, number, number];

export const DEFAULT_EMA_CONFIGS: EmaConfigTuple = [
  { enabled: true, period: 9, color: "#38BDF8" },
  { enabled: true, period: 21, color: "#F59E0B" },
  { enabled: false, period: 50, color: "#F472B6" },
  { enabled: false, period: 200, color: "#2DD4BF" },
];

export const EMA_COLOR_SWATCHES = [
  "#38BDF8",
  "#F59E0B",
  "#F472B6",
  "#2DD4BF",
  "#818CF8",
  "#FB923C",
  "#E879F9",
  "#FACC15",
] as const;

export function buildEmaMask(emas: readonly EmaSlotConfig[]): number {
  let mask = 0;
  for (let i = 0; i < 4 && i < emas.length; i++) {
    if (emas[i].enabled) mask |= 1 << i;
  }
  return mask;
}

export interface OhlcvCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CandleInspection extends OhlcvCandle {
  index: number;
  emas: [number, number, number, number];
  bbUpper: number;
  bbLower: number;
  rsi: number;
  meta: number;
  isBullish: boolean;
  isDoji: boolean;
  isPinbar: boolean;
  isEngulfing: boolean;
}

export interface ViewportConfig {
  viewportWidth: number;
  viewportHeight: number;
  chartLeft: number;
  chartTop: number;
  chartWidth: number;
  chartHeight: number;
  volTop: number;
  volHeight: number;
  rsiTop: number;
  rsiHeight: number;
  candlePitch: number;
  bodyWidth: number;
  scrollRightCandles: number;
  cursorX: number;
  cursorY: number;
  emaPeriods: EmaPeriodTuple;
  emaMask: number;
  bbPeriod: number;
  bbStdDev: number;
  autoScaleY: boolean;
  emaEnabled: boolean;
  bbEnabled: boolean;
  rsiEnabled: boolean;
  logScale: boolean;
  heikinAshi: boolean;
  magnetCrosshair: boolean;
  manualMinPrice: number;
  manualMaxPrice: number;
  paddingRatio: number;
  dpr: number;
}

export interface FrameProjection {
  visibleStart: number;
  visibleEnd: number;
  visibleCount: number;
  minPrice: number;
  maxPrice: number;
  rawLow: number;
  rawHigh: number;
  maxVolume: number;
  hoverIndex: number;
  hoverSnapX: number;
  hoverPrice: number;
  gridCount: number;
  lastClose: number;
  firstOpen: number;
  changePct: number;
  lastPriceY: number;
  bullCount: number;
  bearCount: number;
  emaLasts: [number, number, number, number];
  rsiLast: number;
  bbUpperLast: number;
  bbLowerLast: number;
  wasmProjectUs: number;
  // Zero-copy views directly into WASM Arena memory
  bodies: Float32Array;
  wicks: Float32Array;
  volumes: Float32Array;
  colors: Uint8Array;
  emaXy: [Float32Array, Float32Array, Float32Array, Float32Array];
  bbUpperXy: Float32Array;
  bbLowerXy: Float32Array;
  rsiXy: Float32Array;
  gridPrices: Float32Array;
  gridYs: Float32Array;
}

export interface ArenaMemoryDiagnostics {
  wasmPages: number;
  wasmBytes: number;
  totalArenaBytes: number;
  maxCandles: number;
  maxVisible: number;
  maxEmas: number;
  bytesPerCandle: number;
  loadedCandles: number;
  worlds: {
    name: string;
    ptr: number;
    bytes: number;
    role: string;
  }[];
}
