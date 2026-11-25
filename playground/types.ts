import type {
  AggTradeItem,
  ArenaMemoryDiagnostics,
  CandleInspection,
  CryptoPair,
  EmaConfigTuple,
  OrderBookSnapshot,
  StreamConnectionState,
  Ticker24h,
  Timeframe,
} from "../src/engine";

export type RendererBackend = "webgl2" | "canvas2d";
export type SidebarTab = "market" | "arena";

export interface ChartSettings {
  pair: CryptoPair;
  timeframe: Timeframe;
  heikinAshi: boolean;
  logScale: boolean;
  showEma: boolean;
  emas: EmaConfigTuple;
  showBb: boolean;
  showRsi: boolean;
  showVolume: boolean;
  magnetCrosshair: boolean;
  renderer: RendererBackend;
  streamActive: boolean;
}

export interface TelemetrySnapshot {
  wasmProjectUs: number;
  drawUs: number;
  visibleCount: number;
  visibleStart: number;
  visibleEnd: number;
  loadedCandles: number;
  bullCount: number;
  bearCount: number;
  lastClose: number;
  changePct: number;
  emaLasts: [number, number, number, number];
  rsiLast: number;
  bbUpperLast: number;
  bbLowerLast: number;
}

export interface BenchmarkSummary {
  iterations: number;
  totalMs: number;
  meanUs: number;
  p99Us: number;
  fpsCapacity: number;
}

export type {
  AggTradeItem,
  ArenaMemoryDiagnostics,
  CandleInspection,
  OrderBookSnapshot,
  StreamConnectionState,
  Ticker24h,
};
